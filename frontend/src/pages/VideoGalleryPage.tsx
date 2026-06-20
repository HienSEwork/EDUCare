import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api/client";
import { Lesson } from "@/types/api";
import { motion, AnimatePresence } from "framer-motion";
import { Play, BookOpen, AlertCircle, Trophy, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Khai báo kiểu mở rộng cho window để tránh lỗi TypeScript compile
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

function extractYoutubeId(url: string | null | undefined): string {
  if (!url) return "";
  if (url.length === 11) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

export default function VideoGalleryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lessonsWithVideo, setLessonsWithVideo] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showCtaModal, setShowCtaModal] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  
  const playerRef = useRef<any>(null);

  // Fetch danh sách bài học có chứa video teaser
  useEffect(() => {
    async function fetchVideos() {
      try {
        const data = await apiRequest<Lesson[]>("/lessons");
        const filtered = data.filter((l) => l.teaserVideoId);
        setLessonsWithVideo(filtered);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  // Tải YouTube Iframe Player API
  useEffect(() => {
    if (window.YT) {
      setApiReady(true);
      return;
    }

    // Nếu script chưa có, tạo thẻ script để tải về
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // Thiết lập Youtube Player khi Modal video mở ra
  useEffect(() => {
    if (selectedLesson && apiReady && window.YT) {
      // Đợi DOM được vẽ hoàn tất
      setTimeout(() => {
        try {
          playerRef.current = new window.YT.Player("teaser-player", {
            events: {
              onStateChange: (event: any) => {
                // event.data === 0 tương ứng với YT.PlayerState.ENDED
                if (event.data === 0) {
                  handleVideoEnd();
                }
              },
            },
          });
        } catch (e) {
          console.error("Error initializing YT player", e);
        }
      }, 500);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [selectedLesson, apiReady]);

  const handleVideoEnd = async () => {
    setShowCtaModal(true);
    if (user) {
      try {
        // Cộng +5 XP khích lệ khi xem xong video teaser (Dùng API cộng XP có sẵn)
        await apiRequest("/progress/xp", {
          method: "POST",
          body: JSON.stringify({ amount: 5 }),
        });
        toast({
          title: "Chúc mừng! 🎉",
          description: "Bạn nhận được +5 XP khích lệ vì đã hoàn thành xem video tóm tắt!",
        });
      } catch (e) {
        console.error("Error adding XP:", e);
      }
    }
  };

  const closePlayer = () => {
    setSelectedLesson(null);
    setShowCtaModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 inline-block mb-4">
              AI-POWERED SUMMARIES
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Thư viện <span className="text-gradient">Video Tóm Tắt AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nắm bắt nhanh kiến thức bài giảng dưới 1 phút. Hãy vào trang học chính thức để hoàn thành thử thách và nhận trọn vẹn điểm XP!
            </p>
          </motion.div>
        </div>

        {/* Video Grid Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : lessonsWithVideo.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed bg-card/50 p-8 max-w-md mx-auto">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có video tóm tắt</h3>
            <p className="text-muted-foreground text-sm">
              Ban quản trị đang tích cực sản xuất các nội dung video ngắn. Bạn vui lòng quay lại sau nhé!
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {lessonsWithVideo.map((lesson) => {
              const youtubeId = extractYoutubeId(lesson.teaserVideoId);
              const coverUrl = youtubeId 
                ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                : lesson.courseColorTheme 
                  ? `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop`
                  : `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`;
                
              return (
                <motion.div
                  key={lesson.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="gradient-card overflow-hidden rounded-2xl border border-muted-foreground/10 shadow-md flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full bg-slate-900 group cursor-pointer" onClick={() => setSelectedLesson(lesson)}>
                    <img
                      src={coverUrl}
                      alt={lesson.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg text-primary-foreground group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 fill-current translate-x-0.5" />
                      </div>
                    </div>
                    {lesson.isFree ? (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold bg-green-500 text-white">
                        Miễn phí
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-bold line-clamp-1 mb-2 hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedLesson(lesson)}>
                        {lesson.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {lesson.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-muted/50 pt-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-yellow-500" /> +100 XP Thử thách
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full flex items-center gap-1"
                        onClick={() => window.location.href = `/lesson/${lesson.slug}`}
                      >
                        <BookOpen className="h-3.5 w-3.5" /> Học bài
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedLesson && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-card border border-muted shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-muted">
                  <div>
                    <span className="text-xs font-semibold text-primary">Xem nhanh bài giảng</span>
                    <h2 className="font-heading text-lg font-bold line-clamp-1">{selectedLesson.title}</h2>
                  </div>
                  <button onClick={closePlayer} className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Video Area */}
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    id="teaser-player"
                    src={`https://www.youtube.com/embed/${extractYoutubeId(selectedLesson.teaserVideoId)}?enablejsapi=1&rel=0&modestbranding=1&autoplay=1`}
                    title={selectedLesson.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />

                  {/* Custom CTA Screen when video finishes */}
                  {showCtaModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-10"
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="max-w-md p-6 rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-md shadow-lg"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                          <Star className="h-8 w-8 text-yellow-500 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Chúc mừng bạn đã xem xong!</h3>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                          Bạn vừa nắm được ý chính của bài học. Hãy tham gia lớp học chính thức ngay để làm trắc nghiệm tương tác và nhận trọn vẹn **+100 XP** nhé!
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button variant="outline" onClick={closePlayer} className="rounded-full">
                            Đóng lại
                          </Button>
                          <Button
                            className="gradient-primary text-primary-foreground rounded-full flex items-center gap-1.5"
                            onClick={() => window.location.href = `/lesson/${selectedLesson.slug}`}
                          >
                            <BookOpen className="h-4 w-4" /> Vào học ngay 🚀
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
                
                {/* Modal Footer Info */}
                <div className="p-4 bg-muted/30 text-xs text-muted-foreground flex justify-between items-center">
                  <span>Hoàn thành xem video nhận thưởng khích lệ +5 XP</span>
                  <span>Thời lượng tóm tắt: ~30 giây</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
