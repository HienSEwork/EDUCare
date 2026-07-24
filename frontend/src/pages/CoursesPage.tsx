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
import NotebookCourseCard from "@/components/NotebookCourseCard";

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

  // Extract unique categories dynamically from courses list (Cleaned from all seed emojis)
  const fetchedCategories = courses.reduce<Category[]>((acc, course) => {
    if (course.category) {
      const cleanName = course.category.name
        .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "")
        .trim();
      const cleanedCategory = { ...course.category, name: cleanName };
      if (!acc.some((cat) => cat.slug === cleanedCategory.slug)) {
        acc.push(cleanedCategory);
      }
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
      {/* Full Width Hero Banner - Nền Glass, không bọc border */}
      <section className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-950/80 backdrop-blur-xl border-b border-indigo-400/20 py-10 md:py-14 -mt-8 mb-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-purple-500/20 blur-[100px]" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                KHÔNG GIAN AN TOÀN & TIN CÂY
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] md:text-5xl text-white">
                <span className="block">Giải đáp thắc mắc,</span>
                <span className="block text-amber-300">tự tin lớn khôn.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-indigo-100/80 md:text-lg">
                Nơi đồng hành cùng thanh thiếu niên Việt Nam khám phá bản thân, hiểu rõ cơ thể, cảm xúc và rèn luyện kỹ năng xây dựng các mối quan hệ an toàn, lành mạnh.
              </p>

              {/* Dynamic Statistics Querying Real Data */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-indigo-400/20 pt-6 max-w-lg">
                <div>
                  <div className="text-2xl font-extrabold text-amber-300 md:text-3xl">
                    {fetchedCategories.length > 0 ? `${fetchedCategories.length}+` : `${courses.length}+`}
                  </div>
                  <div className="text-xs text-indigo-200/70 mt-0.5 font-semibold">Chủ đề bài học</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white md:text-3xl">
                    {courses.reduce((sum, c) => sum + (c.lessons?.length || 1), 0)}+
                  </div>
                  <div className="text-xs text-indigo-200/70 mt-0.5 font-semibold">Bài học thực tế</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white md:text-3xl">
                    {courses.length > 0 ? courses.length : 0}
                  </div>
                  <div className="text-xs text-indigo-200/70 mt-0.5 font-semibold">Khóa học sẵn có</div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 }}
              className="relative h-[300px] w-full flex items-center justify-center md:h-[350px]"
            >
              {/* Ambient glowing blobs in background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full bg-primary/10 blur-[50px] pointer-events-none" />
              <div className="absolute top-10 left-10 w-[120px] h-[120px] rounded-full bg-pink/10 blur-[30px] pointer-events-none" />
              
              {/* Card 1: Góc Tuổi Dậy Thì */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="absolute z-20 w-[240px] rounded-2xl border border-indigo-400/30 bg-indigo-950/80 backdrop-blur-md p-4 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                    <Compass className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <h4 className="font-bold text-[10px] text-amber-300 uppercase tracking-wider">Chủ đề tiêu điểm</h4>
                    <h3 className="font-bold text-sm text-white">Góc Tuổi Dậy Thì</h3>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-indigo-200/80">Hiểu rõ sự phát triển cơ thể và tâm sinh lý tự nhiên.</p>
                <div className="mt-3 flex gap-1.5">
                  <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[9px] font-semibold text-white">Tuổi Teen</span>
                  <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[9px] font-semibold text-white">Tự Tin</span>
                </div>
              </motion.div>

              {/* Card 2: Đồng Thuận F.R.I.E.S */}
              <motion.div
                initial={{ x: -30, y: -20, opacity: 0, rotate: -6 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: -6 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="absolute z-10 left-2 top-12 w-[180px] rounded-xl border border-indigo-400/30 bg-indigo-900/70 backdrop-blur-md p-3 shadow-xl hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/20">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </span>
                  <span className="font-bold text-xs text-white">Đồng thuận F.R.I.E.S</span>
                </div>
                <p className="mt-1.5 text-[10px] text-indigo-200/70">Tự nguyện, linh hoạt và tôn trọng ranh giới cơ thể.</p>
              </motion.div>

              {/* Card 3: Ranh Giới Số */}
              <motion.div
                initial={{ x: 30, y: 30, opacity: 0, rotate: 8 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: 8 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute z-10 right-2 bottom-12 w-[180px] rounded-xl border border-indigo-400/30 bg-indigo-900/70 backdrop-blur-md p-3 shadow-xl hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/20">
                    <Heart className="h-4 w-4 text-white" />
                  </span>
                  <span className="font-bold text-xs text-white">Yêu lành mạnh</span>
                </div>
                <p className="mt-1.5 text-[10px] text-indigo-200/70">Học cách chia sẻ, đặt giới hạn an toàn trên MXH.</p>
              </motion.div>

              {/* Card 4: Game Tương Tác */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute z-30 left-6 bottom-4 rounded-full border border-indigo-400/40 bg-indigo-950/90 px-3.5 py-1.5 shadow-2xl flex items-center gap-2 hover:scale-105 transition-all duration-300 pointer-events-auto"
              >
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-bold text-white">Trò chơi tình huống thực tế</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-[1400px]">

        {error ? <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

        {/* 2. CATEGORY SECTION (Glass Button Vuông) */}
        <section className="mt-8 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg md:text-xl font-extrabold text-white">Chủ đề khóa học</h3>
            
            {/* Reset Filter Button */}
            {(searchTerm || selectedTag !== "all" || activeQuestionId) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Đặt lại bộ lọc
              </button>
            )}
          </div>

          {/* Grid Category Buttons Vuông (Radius = 0, Chỉ hiện chữ) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {/* All Categories Button */}
            <button
              onClick={() => {
                setSelectedTag("all");
                setActiveQuestionId(null);
                setRecommendationMsg(null);
              }}
              className={`p-4 rounded-none border text-center font-heading text-xs font-extrabold transition-all flex items-center justify-center h-16 backdrop-blur-md cursor-pointer ${
                selectedTag === "all"
                  ? "bg-amber-300 border-2 border-amber-400 text-slate-950 shadow-lg scale-[1.02]"
                  : "bg-indigo-950/60 border border-indigo-400/25 text-indigo-200 hover:bg-indigo-900/80 hover:text-white hover:border-indigo-400/50"
              }`}
            >
              <span>Tất cả chủ đề</span>
            </button>

            {/* Dynamic Categories */}
            {fetchedCategories.map((item) => {
              const isActive = selectedTag === item.slug;
              return (
                <button
                  key={item.slug}
                  onClick={() => {
                    setSelectedTag(item.slug);
                    setActiveQuestionId(null);
                    setRecommendationMsg(null);
                  }}
                  className={`p-4 rounded-none border text-center font-heading text-xs font-extrabold transition-all flex items-center justify-center h-16 backdrop-blur-md cursor-pointer ${
                    isActive
                      ? "bg-amber-300 border-2 border-amber-400 text-slate-950 shadow-lg scale-[1.02]"
                      : "bg-indigo-950/60 border border-indigo-400/25 text-indigo-200 hover:bg-indigo-900/80 hover:text-white hover:border-indigo-400/50"
                  }`}
                >
                  <span className="line-clamp-2">{item.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. DANH SÁCH KHÓA HỌC (Course Catalog Grid + Search Bar) */}
        <section id="course-catalog-section" className="mb-12">
          {/* Search & Sort Toolbar Bar */}
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-indigo-400/20 bg-indigo-950/60 p-4 shadow-xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Left Inputs */}
              <div className="flex flex-1 flex-wrap gap-3 items-center">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-300" />
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
                    className="h-11 w-full rounded-xl border border-indigo-400/30 bg-indigo-900/50 pl-10 pr-10 text-sm text-white placeholder:text-indigo-300/40 shadow-inner outline-none focus:border-amber-300 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchTerm("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-indigo-300 hover:text-white transition-all"
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
                    className="h-11 rounded-xl border border-indigo-400/30 bg-indigo-900/50 pl-3 pr-8 py-2 text-sm text-white shadow-inner outline-none appearance-none cursor-pointer focus:border-amber-300 font-semibold"
                  >
                    <option value="newest" className="bg-indigo-950 text-white">Mới nhất</option>
                    <option value="oldest" className="bg-indigo-950 text-white">Cũ nhất</option>
                    <option value="alphabetical" className="bg-indigo-950 text-white">Tên (A-Z)</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300">
                    <Filter className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Submit Search Button */}
                <Button
                  onClick={() => handleSearchSubmit(searchQuery)}
                  className="h-11 rounded-xl px-5 magic-btn-primary font-bold text-slate-950 flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Tìm kiếm</span>
                </Button>
              </div>

              {/* Right actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-indigo-400/20">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-900/60 border border-indigo-400/30 px-3.5 py-2 text-xs font-bold text-white">
                  <BookOpen className="h-3.5 w-3.5 text-white" />
                  {sortedCourses.length} khóa học
                </span>

                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="h-11 rounded-xl px-4 flex items-center gap-2 border-indigo-400/30 bg-indigo-900/40 text-white hover:bg-indigo-800/60 transition-all"
                >
                  <GraduationCap className="h-4 w-4 text-white" />
                  <span className="font-bold text-xs md:text-sm text-white">Khóa học của tôi</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-extrabold text-white">Danh mục khóa học 3D</h2>
          </div>

          {sortedCourses.length === 0 ? (
            <div className="rounded-2xl border border-indigo-400/20 bg-indigo-950/60 p-12 text-center shadow-xl backdrop-blur-md">
              <HelpCircle className="mx-auto h-12 w-12 text-white/60 animate-bounce" />
              <h3 className="mt-4 font-heading text-lg font-bold text-white">Không tìm thấy khóa học nào</h3>
              <p className="mt-2 text-sm text-indigo-200/70 max-w-md mx-auto">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc chủ đề khác xem sao nhé!
              </p>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="mt-6 rounded-xl border-indigo-400/30 bg-indigo-900/50 text-white"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {sortedCourses.map((course, idx) => (
                <NotebookCourseCard
                  key={course.id}
                  course={course}
                  index={idx}
                  onClick={() => navigate(`/course/${course.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. QUIZ QUICK SUPPORT (Hỏi nhanh - Gợi ý chuẩn - Đẩy xuống dưới cùng) */}
        <section className="mt-12 mb-8">
          <div className="rounded-2xl border border-indigo-400/30 bg-indigo-950/70 p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-heading text-lg font-extrabold text-white md:text-xl mb-2">Hỏi nhanh - Gợi ý chuẩn</h3>
              <p className="text-sm text-indigo-200/80 mb-6">
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
                      className={`text-left p-4 rounded-xl border transition-all flex items-center backdrop-blur-md cursor-pointer ${
                        isActive 
                          ? "bg-white text-slate-950 border-white font-extrabold shadow-lg scale-[1.01]" 
                          : "bg-indigo-900/40 border-indigo-400/20 text-white hover:bg-indigo-800/60"
                      }`}
                    >
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
                    className="mt-6 p-4 rounded-xl bg-white/10 border border-white/20 flex flex-col gap-1 items-start"
                  >
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">EDUcare khuyên học</h4>
                    <p className="text-xs md:text-sm text-white leading-relaxed">{recommendationMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}