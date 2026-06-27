import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api/client";
import { Lesson, Course } from "@/types/api";
import { motion, AnimatePresence } from "framer-motion";
import { Play, BookOpen, AlertCircle, Trophy, X, Star, Search, Sparkles, ChevronRight, Film, ChevronLeft, ArrowRight, Shuffle, RefreshCw, ArrowUp } from "lucide-react";
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<ExtendedLesson | null>(null);
  const [showCtaModal, setShowCtaModal] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState<string>("Đang tải...");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseTab, setSelectedCourseTab] = useState<string>("all"); // "all" hoặc courseId string
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  // Infinite Scroll & Shuffled Videos State
  interface ExtendedLesson extends Lesson {
    courseColorTheme?: string | null;
    courseTitle?: string | null;
  }

  const [shuffledVideos, setShuffledVideos] = useState<ExtendedLesson[]>([]);
  const [visibleVideosCount, setVisibleVideosCount] = useState(6);
  const [shuffleTrigger, setShuffleTrigger] = useState(0);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const playerRef = useRef<any>(null);

  // Hiển thị nút "Lên đầu trang" khi cuộn xuống dưới
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch danh sách khóa học để lấy các bài học có video
  useEffect(() => {
    async function fetchCoursesData() {
      try {
        const data = await apiRequest<Course[]>("/courses");
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCoursesData();
  }, []);

  // Tải YouTube Iframe Player API
  useEffect(() => {
    if (window.YT) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // Reset thời lượng khi đổi bài học
  useEffect(() => {
    if (selectedLesson) {
      setVideoDuration("Đang tải...");
    }
  }, [selectedLesson]);

  // Thiết lập Youtube Player khi Modal video mở ra
  useEffect(() => {
    if (selectedLesson && apiReady && window.YT) {
      setTimeout(() => {
        try {
          playerRef.current = new window.YT.Player("teaser-player", {
            events: {
              onReady: (event: any) => {
                const duration = event.target.getDuration();
                if (duration) {
                  const minutes = Math.floor(duration / 60);
                  const seconds = Math.floor(duration % 60);
                  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
                  setVideoDuration(`${minutes}:${secondsStr}`);
                } else {
                  setVideoDuration("~30s - 2m");
                }
              },
              onStateChange: (event: any) => {
                if (event.data === 0) {
                  handleVideoEnd();
                }
                const duration = event.target.getDuration();
                if (duration) {
                  const minutes = Math.floor(duration / 60);
                  const seconds = Math.floor(duration % 60);
                  const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
                  setVideoDuration(`${minutes}:${secondsStr}`);
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
        await apiRequest("/progress/xp", {
          method: "POST",
          body: JSON.stringify({ amount: 5 }),
        });
        toast({
          title: "Chúc mừng! 🎉",
          description: "Bạn nhận được +5 XP khích lệ vì đã hoàn thành xem thử video!",
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

  // Trích xuất tất cả bài học có video teaser
  const allVideos = courses.reduce<ExtendedLesson[]>((acc, course) => {
    if (course.lessons) {
      const videosInCourse = course.lessons
        .filter((l) => l.teaserVideoId)
        .map((l) => ({
          ...l,
          courseColorTheme: course.colorTheme,
          courseTitle: course.title,
          courseId: course.id
        }));
      acc.push(...videosInCourse);
    }
    return acc;
  }, []);

  // Thuật toán xáo trộn mảng Fisher-Yates
  const shuffleArray = (array: ExtendedLesson[]): ExtendedLesson[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Xáo trộn video khi danh sách thay đổi hoặc kích hoạt shuffle lại
  useEffect(() => {
    if (allVideos.length > 0) {
      setShuffledVideos(shuffleArray(allVideos));
      setVisibleVideosCount(6); // Reset số lượng hiển thị khi trộn lại
    }
  }, [courses, shuffleTrigger]);

  // Lọc video theo từ khóa tìm kiếm
  const searchedVideos = allVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset số lượng video hiển thị khi đổi tab hoặc tìm kiếm
  useEffect(() => {
    setVisibleVideosCount(6);
  }, [selectedCourseTab, searchQuery]);

  // Hàm tải thêm video bằng nút Xem thêm
  const handleLoadMore = () => {
    setIsMoreLoading(true);
    setTimeout(() => {
      setVisibleVideosCount((prev) => prev + 6);
      setIsMoreLoading(false);
    }, 800); // Tạo độ trễ nhẹ để hiển thị hiệu ứng Skeleton mượt mà
  };

  // Nhóm các khóa học có ít nhất 1 bài học video (để làm Tab)
  const coursesWithVideos = courses.map((course) => {
    const videos = (course.lessons || [])
      .filter((l) => l.teaserVideoId)
      .map((l) => ({
        ...l,
        courseColorTheme: course.colorTheme,
        courseTitle: course.title,
        courseId: course.id
      }));
    return {
      ...course,
      videoLessons: videos
    };
  }).filter((c) => c.videoLessons.length > 0);

  // Định nghĩa Card Component hiển thị bài học có video (YouTube Style)
  const VideoCard = ({ lesson }: { lesson: ExtendedLesson }) => {
    const youtubeId = extractYoutubeId(lesson.teaserVideoId);
    const coverUrl = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : lesson.courseColorTheme
        ? `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop`
        : `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`;

    return (
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="gradient-card overflow-hidden rounded-2xl border border-muted-foreground/10 shadow-md flex flex-col justify-between w-full snap-start transition-all"
      >
        <div className="relative aspect-video w-full bg-slate-900 group cursor-pointer" onClick={() => setSelectedLesson(lesson)}>
          <img
            src={coverUrl}
            alt={lesson.title}
            loading="lazy"
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
            {/* Badge chủ đề khóa học */}
            {lesson.courseTitle && (
              <span
                className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 border cursor-pointer hover:opacity-85 transition-opacity"
                onClick={() => setSelectedCourseTab(String(lesson.courseId))}
                style={{
                  backgroundColor: `${lesson.courseColorTheme || "#7C3AED"}15`,
                  borderColor: `${lesson.courseColorTheme || "#7C3AED"}35`,
                  color: lesson.courseColorTheme || "#7C3AED"
                }}
              >
                {lesson.courseTitle}
              </span>
            )}
            <h3 className="font-heading text-base md:text-lg font-bold line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedLesson(lesson)}>
              {lesson.title}
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 mb-4">
              {lesson.summary}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-muted/50 pt-4 mt-auto">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-yellow-500" /> +100 XP Thử thách
            </span>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full flex items-center gap-1 text-xs"
              onClick={() => window.location.href = `/lesson/${lesson.slug}`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Học bài
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Định nghĩa Card Skeleton (Khung trống nhấp nháy chuyển động - Shimmer)
  const VideoCardSkeleton = () => {
    return (
      <div className="gradient-card overflow-hidden rounded-2xl border border-muted-foreground/10 shadow-md flex flex-col justify-between w-full snap-start animate-pulse">
        <div className="relative aspect-video w-full bg-muted-foreground/10" />
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            {/* Badge skeleton */}
            <div className="h-4 w-24 rounded-full bg-muted-foreground/10 mb-3" />
            {/* Title skeleton */}
            <div className="h-5 w-4/5 rounded bg-muted-foreground/10 mb-2" />
            <div className="h-5 w-2/3 rounded bg-muted-foreground/10 mb-4" />
            {/* Summary skeleton */}
            <div className="h-3 w-full rounded bg-muted-foreground/10 mb-2" />
            <div className="h-3 w-5/6 rounded bg-muted-foreground/10" />
          </div>
          {/* Footer skeleton */}
          <div className="flex items-center justify-between border-t border-muted/50 pt-4 mt-auto">
            <div className="h-3 w-28 rounded bg-muted-foreground/10" />
            <div className="h-8 w-20 rounded-full bg-muted-foreground/10" />
          </div>
        </div>
      </div>
    );
  };

  // Định nghĩa Card "Xem toàn bộ bài học (View All)" ở cuối hàng Carousel (Bỏ - không dùng nữa)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Banner Section - Glassmorphism Premium Hero */}
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(253,244,255,0.85)_0%,rgba(255,241,242,0.85)_50%,rgba(239,246,255,0.85)_100%)] p-6 shadow-card md:p-8 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center max-w-3xl mx-auto py-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft mb-4">
                AI-Powered Previews
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Thư viện <span className="text-gradient">Video AI</span> - Góc Xem Thử
              </h1>
              <p className="text-foreground/80 text-base md:text-lg mb-6 leading-relaxed">
                Nắm bắt nhanh kiến thức cốt lõi dưới 2 phút. Hãy chọn bài giảng, xem thử video để mở khóa thử thách và nhận trọn vẹn điểm XP!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Tabs Filter Section */}
        <div className="flex flex-col gap-5 rounded-[1.8rem] border border-white/60 bg-white/60 p-5 shadow-card backdrop-blur-md mb-8">

          {/* Row 1: Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm video xem thử bài giảng..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value !== "" && selectedCourseTab !== "all") {
                  setSelectedCourseTab("all");
                }
              }}
              className="h-12 w-full rounded-2xl border border-white/80 bg-background/80 pl-11 pr-10 text-sm shadow-inner transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 active:scale-95 transition-all"
                title="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Row 2: Dynamic Tabs for Courses */}
          {!loading && coursesWithVideos.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-white/30 pt-4">
              <span className="text-xs font-bold text-muted-foreground">Phân loại theo Khóa học:</span>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -my-1 flex-nowrap w-full scroll-smooth">
                {/* Tab Tất cả */}
                <button
                  onClick={() => {
                    setSelectedCourseTab("all");
                    setSearchQuery("");
                  }}
                  onMouseEnter={() => setHoveredTabId("all")}
                  onMouseLeave={() => setHoveredTabId(null)}
                  className="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 hover:scale-105 active:scale-[0.98] duration-200"
                  style={
                    selectedCourseTab === "all"
                      ? {
                        backgroundColor: "#7C3AED",
                        color: "#ffffff",
                        boxShadow: `0 8px 16px -4px rgba(124, 58, 237, 0.4)`,
                      }
                      : {
                        backgroundColor: hoveredTabId === "all" ? `rgba(124, 58, 237, 0.15)` : `rgba(124, 58, 237, 0.08)`,
                        color: "#7C3AED",
                      }
                  }
                >
                  ✨ Tất cả khóa học
                </button>

                {/* Tab các Khóa học cụ thể */}
                {coursesWithVideos.map((course) => {
                  const isActive = selectedCourseTab === String(course.id);
                  const colorTheme = course.colorTheme || "#7C3AED";
                  const isHovered = hoveredTabId === String(course.id);

                  return (
                    <button
                      key={course.id}
                      onClick={() => {
                        setSelectedCourseTab(String(course.id));
                        setSearchQuery("");
                      }}
                      onMouseEnter={() => setHoveredTabId(String(course.id))}
                      onMouseLeave={() => setHoveredTabId(null)}
                      className="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 hover:scale-105 active:scale-[0.98] duration-200"
                      style={
                        isActive
                          ? {
                            backgroundColor: colorTheme,
                            color: "#ffffff",
                            boxShadow: `0 8px 16px -4px ${colorTheme}66`,
                          }
                          : {
                            backgroundColor: isHovered ? `${colorTheme}22` : `${colorTheme}12`,
                            color: colorTheme,
                          }
                      }
                    >
                      {course.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            {/* Header / Toolbar của Grid */}
            <div className="flex items-center justify-between mb-6 border-b border-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
                  {searchQuery !== ""
                    ? `Kết quả tìm kiếm (${searchedVideos.length})`
                    : selectedCourseTab === "all"
                      ? "Tất cả bài giảng"
                      : `Chủ đề: ${courses.find(c => String(c.id) === selectedCourseTab)?.title || ""}`
                  }
                </h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* TRƯỜNG HỢP 1: Đang tìm kiếm */}
              {searchQuery !== "" ? (
                <motion.div
                  key="search-results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  {searchedVideos.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border-2 border-dashed bg-card/50 p-8 max-w-md mx-auto">
                      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Không tìm thấy video</h3>
                      <p className="text-muted-foreground text-sm">
                        Thử tìm kiếm với từ khóa khác như "đồng thuận", "ranh giới" hoặc "dậy thì" xem sao nhé!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {searchedVideos.slice(0, visibleVideosCount).map((lesson) => (
                          <VideoCard key={lesson.id} lesson={lesson} />
                        ))}
                        {/* Skeleton Cards để giữ chỗ khi đang tải */}
                        {isMoreLoading && [1, 2, 3].map((n) => (
                          <VideoCardSkeleton key={`skeleton-${n}`} />
                        ))}
                      </div>

                      {/* Nút Xem thêm */}
                      {searchedVideos.length > visibleVideosCount && (
                        <div className="w-full flex justify-center py-8">
                          <Button
                            onClick={handleLoadMore}
                            disabled={isMoreLoading}
                            className="gradient-primary text-primary-foreground rounded-full px-8 py-6 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md hover:shadow-primary/20 transition-all duration-200"
                          >
                            {isMoreLoading ? (
                              <>
                                <RefreshCw className="h-5 w-5 animate-spin" />
                                Đang tải thêm...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5" />
                                Xem thêm bài giảng
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Kết thúc danh sách tìm kiếm */}
                      {!isMoreLoading && searchedVideos.length <= visibleVideosCount && (
                        <div className="w-full flex justify-center py-6 mt-4">
                          <p className="text-xs text-muted-foreground text-center">
                            🎉 Bạn đã xem hết kết quả tìm kiếm!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : selectedCourseTab === "all" ? (
                /* TRƯỜNG HỢP 2: Chế độ YouTube Shuffled Grid (Mặc định) */
                <motion.div
                  key="shuffled-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {shuffledVideos.slice(0, visibleVideosCount).map((lesson) => (
                      <VideoCard key={lesson.id} lesson={lesson} />
                    ))}
                    {/* Skeleton Cards để giữ chỗ khi đang tải */}
                    {isMoreLoading && [1, 2, 3].map((n) => (
                      <VideoCardSkeleton key={`skeleton-${n}`} />
                    ))}
                  </div>

                  {/* Nút Xem thêm */}
                  {shuffledVideos.length > visibleVideosCount && (
                    <div className="w-full flex justify-center py-8">
                      <Button
                        onClick={handleLoadMore}
                        disabled={isMoreLoading}
                        className="gradient-primary text-primary-foreground rounded-full px-8 py-6 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md hover:shadow-primary/20 transition-all duration-200"
                      >
                        {isMoreLoading ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            Đang tải thêm...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Xem thêm bài giảng
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Kết thúc danh sách mặc định */}
                  {!isMoreLoading && shuffledVideos.length <= visibleVideosCount && (
                    <div className="w-full flex justify-center py-6 mt-4">
                      <p className="text-xs text-muted-foreground text-center">
                        🎉 Bạn đã xem hết tất cả video rồi!
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* TRƯỜNG HỢP 3: Xem theo khóa học cụ thể */
                <motion.div
                  key={`course-grid-${selectedCourseTab}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  {(() => {
                    const course = courses.find((c) => String(c.id) === selectedCourseTab);
                    const courseVideos = allVideos.filter((v) => String(v.courseId) === selectedCourseTab);

                    if (!course || courseVideos.length === 0) return null;

                    return (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {courseVideos.slice(0, visibleVideosCount).map((lesson) => (
                            <VideoCard key={lesson.id} lesson={lesson} />
                          ))}
                          {/* Skeleton Cards để giữ chỗ khi đang tải */}
                          {isMoreLoading && [1, 2, 3].map((n) => (
                            <VideoCardSkeleton key={`skeleton-${n}`} />
                          ))}
                        </div>

                        {/* Nút Xem thêm */}
                        {courseVideos.length > visibleVideosCount && (
                          <div className="w-full flex justify-center py-8">
                            <Button
                              onClick={handleLoadMore}
                              disabled={isMoreLoading}
                              className="gradient-primary text-primary-foreground rounded-full px-8 py-6 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md hover:shadow-primary/20 transition-all duration-200"
                            >
                              {isMoreLoading ? (
                                <>
                                  <RefreshCw className="h-5 w-5 animate-spin" />
                                  Đang tải thêm...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-5 w-5" />
                                  Xem thêm bài giảng
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Kết thúc danh sách khóa học cụ thể */}
                        {!isMoreLoading && courseVideos.length <= visibleVideosCount && (
                          <div className="w-full flex justify-center py-6 mt-4">
                            <p className="text-xs text-muted-foreground text-center">
                              🎉 Bạn đã xem hết video của chủ đề này!
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Video Player Modal (Giữ nguyên logic lõi) */}
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
                className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-slate-950 border border-white/10 shadow-[0_0_50px_-12px_rgba(124,58,237,0.3)] text-white"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/40 backdrop-blur-md">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                        Xem thử bài giảng
                      </span>
                      {selectedLesson.courseTitle && (
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                          style={{
                            backgroundColor: `${selectedLesson.courseColorTheme || "#7C3AED"}15`,
                            borderColor: `${selectedLesson.courseColorTheme || "#7C3AED"}35`,
                            color: selectedLesson.courseColorTheme || "#7C3AED"
                          }}
                        >
                          {selectedLesson.courseTitle}
                        </span>
                      )}
                    </div>
                    <h2 className="font-heading text-lg md:text-xl font-bold line-clamp-1 text-white">{selectedLesson.title}</h2>
                  </div>
                  <button onClick={closePlayer} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90 duration-200">
                    <X className="h-5 w-5" />
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
                        className="max-w-md p-6 rounded-2xl border border-primary/30 bg-slate-900/90 backdrop-blur-md shadow-2xl text-white"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                          <Star className="h-8 w-8 text-yellow-500 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Chúc mừng bạn đã xem xong!</h3>
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                          Bạn vừa nắm được ý chính của bài học. Hãy tham gia lớp học chính thức ngay để làm trắc nghiệm tương tác và nhận trọn vẹn **+100 XP** nhé!
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button variant="ghost" onClick={closePlayer} className="rounded-full border border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white">
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
                <div className="p-4 bg-slate-900/80 border-t border-white/10 text-xs text-slate-300 flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Trophy className="h-4 w-4 text-yellow-500 animate-bounce" />
                    Hoàn thành xem video để nhận thưởng khích lệ <strong className="text-yellow-400">+5 XP</strong>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Film className="h-4 w-4 text-primary" />
                    Thời lượng xem thử: <strong className="text-white font-bold">{videoDuration}</strong>
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nút trở về đầu trang */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-8 right-8 z-40 p-3.5 rounded-full gradient-primary text-primary-foreground shadow-lg hover:shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center border border-primary/20"
              title="Trở về đầu trang"
              whileHover={{ y: -4 }}
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
