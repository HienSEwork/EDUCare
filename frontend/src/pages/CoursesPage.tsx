import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Filter,
  Heart,
  Compass,
  HelpCircle,
  Sparkle,
  ArrowRight,
  RotateCcw,
  X
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Course, Category, RecommendQuestion } from "@/types/api";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [myLearning, setMyLearning] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedTag, setSelectedTag] = useState("all");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Recommender state
  const [recommendQuestions, setRecommendQuestions] = useState<RecommendQuestion[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [recommendationMsg, setRecommendationMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const promises = [
      apiRequest<Course[]>("/courses"),
      apiRequest<RecommendQuestion[]>("/courses/questions")
    ];
    if (user) {
      promises.push(apiRequest<Course[]>("/courses/my-learning"));
    }

    Promise.all(promises)
      .then((results) => {
        const [allCourses, allQuestions, enrolledCourses] = results as [Course[], RecommendQuestion[], Course[]?];
        setCourses(allCourses);
        setRecommendQuestions(allQuestions);
        if (enrolledCourses) {
          setMyLearning(enrolledCourses);
        }
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : "Không thể tải danh mục khóa học lúc này.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  // Reset scroll to top when loading is finished and content is fully rendered
  useEffect(() => {
    if (!isLoading) {
      // Temporarily disable smooth scrolling for instant jump
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";

      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);

      // Restore original scrolling behavior
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    }
  }, [isLoading]);

  // Extract unique categories dynamically from courses list
  const fetchedCategories = courses.reduce<Category[]>((acc, course) => {
    if (course.category && !acc.some((cat) => cat.slug === course.category?.slug)) {
      acc.push(course.category);
    }
    return acc;
  }, []);

  // Tag classification logic
  const matchTag = (course: Course, tag: string) => {
    if (tag === "all") return true;
    return course.category?.slug === tag;
  };

  // Filter & Sort Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = searchTerm
      ? course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;

    const matchesTag = matchTag(course, selectedTag);
    return matchesSearch && matchesTag;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (selectedSort === "newest") {
      return (b.id || 0) - (a.id || 0);
    }
    if (selectedSort === "oldest") {
      return (a.id || 0) - (b.id || 0);
    }
    if (selectedSort === "alphabetical") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });

  // Handle recommender click (Option B)
  const handleQuestionClick = (question: RecommendQuestion) => {
    setActiveQuestionId(question.id);
    setSelectedTag(question.targetTag || "all");
    setRecommendationMsg(question.reason);
    setSearchQuery("");
    setSearchTerm("");
    
    // Auto-scroll to recommendation message smoothly so user can read it first
    setTimeout(() => {
      const recommendationElement = document.getElementById("recommendation-message-box");
      if (recommendationElement) {
        recommendationElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchTerm(query);
    // Auto-scroll to course list section smoothly
    setTimeout(() => {
      const catalogElement = document.getElementById("course-catalog-section");
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSearchTerm("");
    setSelectedTag("all");
    setSelectedSort("newest");
    setActiveQuestionId(null);
    setRecommendationMsg(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="detail-panel px-6 py-4">Đang tải danh mục khóa học...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Banner Section */}
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(253,244,255,0.9)_0%,rgba(255,241,242,0.9)_50%,rgba(239,246,255,0.9)_100%)] p-6 shadow-card md:p-8 relative overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                Không gian an toàn & tin cậy
              </span>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-[-0.03em] md:text-5xl text-foreground">
                <span className="block">Giải đáp thắc mắc,</span>
                <span className="block text-primary">tự tin lớn khôn.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-foreground/74 md:text-lg">
                Nơi đồng hành cùng thanh thiếu niên Việt Nam khám phá bản thân, hiểu rõ cơ thể, cảm xúc và rèn luyện kỹ năng xây dựng các mối quan hệ an toàn, lành mạnh.
              </p>

              {/* Statistics */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/5 pt-6 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-primary md:text-3xl">5+</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Lộ trình học tập</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary md:text-3xl">30+</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Tình huống thực tế</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-mint-foreground md:text-3xl">100%</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Bảo mật ẩn danh</div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Floating Cards (Culturally relatable sex-ed modules, no foreign faces) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 }}
              className="relative h-[300px] w-full flex items-center justify-center md:h-[350px]"
            >
              {/* Ambient glowing blobs in background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full bg-primary/10 blur-[50px] pointer-events-none" />
              <div className="absolute top-10 left-10 w-[120px] h-[120px] rounded-full bg-pink/10 blur-[30px] pointer-events-none" />
              
              {/* Card 1: Góc Tuổi Dậy Thì (Floating Center, Large) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="absolute z-20 w-[240px] rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-card hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink/10">
                    <Compass className="h-5 w-5 text-pink-foreground" />
                  </span>
                  <div>
                    <h4 className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Chủ đề tiêu điểm</h4>
                    <h3 className="font-bold text-sm text-foreground">Góc Tuổi Dậy Thì</h3>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Hiểu rõ sự phát triển cơ thể và tâm sinh lý tự nhiên.</p>
                <div className="mt-3 flex gap-1.5">
                  <span className="rounded-full bg-pink/10 px-2 py-0.5 text-[9px] font-semibold text-pink-foreground">Tuổi Teen</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">Tự Tin</span>
                </div>
              </motion.div>

              {/* Card 2: Đồng Thuận F.R.I.E.S (Tilted Left) */}
              <motion.div
                initial={{ x: -30, y: -20, opacity: 0, rotate: -6 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: -6 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="absolute z-10 left-2 top-12 w-[180px] rounded-[1.2rem] border border-white/60 bg-white/70 p-3 shadow-soft hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint/10">
                    <ShieldCheck className="h-4 w-4 text-mint-foreground" />
                  </span>
                  <span className="font-bold text-xs text-foreground">Đồng thuận F.R.I.E.S</span>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">Tự nguyện, linh hoạt và tôn trọng ranh giới cơ thể.</p>
              </motion.div>

              {/* Card 3: Ranh Giới Số (Tilted Right) */}
              <motion.div
                initial={{ x: 30, y: 30, opacity: 0, rotate: 8 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: 8 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute z-10 right-2 bottom-12 w-[180px] rounded-[1.2rem] border border-white/60 bg-white/70 p-3 shadow-soft hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lavender/10">
                    <Heart className="h-4 w-4 text-lavender-foreground" />
                  </span>
                  <span className="font-bold text-xs text-foreground">Yêu lành mạnh</span>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">Học cách chia sẻ, đặt giới hạn an toàn trên MXH.</p>
              </motion.div>

              {/* Card 4: Game Tương Tác (Floating Bottom Left) */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute z-30 left-6 bottom-4 rounded-full border border-white/95 bg-white/95 px-3 py-1.5 shadow-card flex items-center gap-2 hover:scale-105 transition-all duration-300 pointer-events-auto"
              >
                <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
                <span className="text-[10px] font-bold text-foreground">Trò chơi tình huống thực tế</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {error ? <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

        {/* Option B: Interactive Recommender Panel (Hỏi nhanh - Gợi ý chuẩn) */}
        <section className="mt-10">
          <div className="rounded-[2rem] border border-white/70 bg-white/40 p-6 md:p-8 shadow-card backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h3 className="font-heading text-lg font-bold text-foreground md:text-xl">Hỏi nhanh - Gợi ý chuẩn ⚡</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Hôm nay bạn đang có thắc mắc hay băn khoăn nào dưới đây? Chọn một câu hỏi để EDUcare chỉ đường dẫn lối nhé!
              </p>
              
              {/* Question list */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recommendQuestions.map((item) => {
                  const isActive = activeQuestionId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleQuestionClick(item)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3 hover:shadow-soft active:scale-[0.98] ${
                        isActive 
                          ? "bg-primary text-primary-foreground border-primary shadow-soft scale-[1.01]" 
                          : "bg-background/80 hover:bg-background border-white/80 text-foreground"
                      }`}
                    >
                      <span className="text-lg mt-0.5">{item.emoji}</span>
                      <span className="text-xs md:text-sm font-semibold leading-snug">{item.question}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic recommendation message */}
              <AnimatePresence mode="wait">
                {recommendationMsg && (
                  <motion.div
                    id="recommendation-message-box"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-3 items-start"
                  >
                    <Sparkle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-primary uppercase tracking-wider">EDUcare khuyên học</h4>
                      <p className="text-xs md:text-sm text-foreground/80 mt-1 leading-relaxed">{recommendationMsg}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Search & Option A: Quick Tags Bar */}
        <div id="course-catalog-section" className="mt-8 mb-8 flex flex-col gap-5 rounded-[1.8rem] border border-white/60 bg-white/60 p-5 shadow-card backdrop-blur-md">
          {/* Top Row: Search input + Submit + Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Left Inputs */}
            <div className="flex flex-1 flex-wrap gap-3 items-center">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tên hoặc nội dung khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit(searchQuery);
                    }
                  }}
                  className="h-11 w-full rounded-xl border border-white/80 bg-background/80 pl-9 pr-10 text-sm shadow-inner transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchTerm("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 active:scale-95 transition-all"
                    title="Xóa tìm kiếm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="h-11 rounded-xl border border-white/80 bg-background/80 pl-3 pr-8 py-2 text-sm shadow-inner outline-none appearance-none cursor-pointer focus:border-primary"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="alphabetical">Tên (A-Z)</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <Filter className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Submit Button */}
              <Button
                onClick={() => handleSearchSubmit(searchQuery)}
                className="h-11 rounded-xl px-5 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="h-4 w-4" />
                <span>Tìm kiếm</span>
              </Button>
            </div>

            {/* Right actions */}
            <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-white/40">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                {sortedCourses.length} khóa học
              </span>

              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="h-11 rounded-xl px-4 flex items-center gap-2 border-white/80 bg-white/40 hover:bg-white/60 transition-all hover:scale-[1.02]"
              >
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-semibold text-xs md:text-sm text-foreground">Khóa học của tôi</span>
              </Button>
            </div>
          </div>

          {/* Bottom Row: Dynamic Quick Tags list */}
          <div className="flex flex-col gap-3 border-t border-white/30 pt-4">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-semibold text-muted-foreground mr-2 shrink-0">Chủ đề gợi ý:</span>
              
              {/* Reset Filter Button */}
              {(searchTerm || selectedTag !== "all" || activeQuestionId) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors py-1 shrink-0"
                >
                  <RotateCcw className="h-3 w-3" />
                  Đặt lại bộ lọc
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -my-1 flex-nowrap w-full scroll-smooth">
              {[
                { slug: "all", name: "✨ Tất cả chủ đề", colorTheme: "#7C3AED" },
                ...fetchedCategories
              ].map((item) => {
                const isActive = selectedTag === item.slug;
                return (
                  <button
                    key={item.slug}
                    onClick={() => {
                      setSelectedTag(item.slug);
                      setActiveQuestionId(null);
                      setRecommendationMsg(null);
                    }}
                    onMouseEnter={() => setHoveredSlug(item.slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    className="px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 hover:scale-105 active:scale-[0.98] duration-200"
                    style={
                      isActive
                        ? {
                            backgroundColor: item.colorTheme,
                            color: "#ffffff",
                            boxShadow: `0 8px 16px -4px ${item.colorTheme}66`,
                          }
                        : {
                            backgroundColor: hoveredSlug === item.slug ? `${item.colorTheme}22` : `${item.colorTheme}12`,
                            color: item.colorTheme,
                          }
                    }
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Course Catalog (All Available Courses) */}
        <section className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </span>
            <h2 className="font-heading text-2xl font-bold text-foreground">Danh mục khóa học</h2>
          </div>

          {sortedCourses.length === 0 ? (
            <div className="rounded-[2.2rem] border border-white/60 bg-white/40 p-12 text-center shadow-card">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/60 animate-bounce" />
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">Không tìm thấy khóa học nào</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc chủ đề khác xem sao nhé!
              </p>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="mt-6 rounded-xl border-white/85 bg-white/50"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedCourses.map((course, idx) => {
                const userEnrolled = myLearning.some((c) => c.id === course.id);

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col rounded-[2rem] border border-white/70 bg-white/50 shadow-card hover:shadow-hover hover:border-primary/20 transition-all overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    {/* Card Banner / Thumbnail */}
                    <div
                      className="h-36 w-full flex items-center justify-center p-6 relative overflow-hidden"
                      style={{
                        background: course.colorTheme
                          ? `linear-gradient(135deg, ${course.colorTheme}dd, ${course.colorTheme}66)`
                          : "linear-gradient(135deg, #7C3AEDdd, #7C3AED66)",
                      }}
                    >
                      <BookOpen className="h-12 w-12 text-white opacity-80 relative z-10 animate-pulse" />
                      {userEnrolled && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-mint-foreground shadow-soft z-10">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Đã đăng ký
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="rounded-full bg-background/88 px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                            {course.lessons?.length ?? 0} bài học
                          </span>
                          {course.category && (
                            <span
                              className="rounded-full px-2.5 py-1 text-[10px] font-bold shrink-0"
                              style={{
                                backgroundColor: `${course.category.colorTheme}18`,
                                color: course.category.colorTheme
                              }}
                            >
                              {course.category.name}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-foreground line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Xem chi tiết →</span>
                        <span className="text-xs font-semibold text-muted-foreground">Miễn phí</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}