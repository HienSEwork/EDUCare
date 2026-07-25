import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2, Lock, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Course } from "@/types/api";
import { Button } from "@/components/ui/button";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    apiRequest<Course>(`/courses/${id}`)
      .then((data) => {
        setCourse(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Không tìm thấy khóa học.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

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

  const handleEnroll = async () => {
    if (!course) return;

    if (!user) {
      toast.info("Vui lòng đăng nhập để đăng ký khóa học này!");
      navigate("/login", { state: { from: `/course/${course.id}` } });
      return;
    }

    setIsEnrolling(true);
    try {
      await apiRequest(`/courses/${course.id}/enroll`, { method: "POST" });
      setCourse((prev) => (prev ? { ...prev, enrolled: true } : null));
      toast.success(`Đăng ký khóa học "${course.title}" thành công!`);
    } catch (err) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="detail-panel px-6 py-4">Đang tải chi tiết khóa học...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="detail-panel max-w-md px-6 py-8 text-center">
          <p className="mb-4 text-destructive font-semibold">{error || "Khóa học không tồn tại."}</p>
          <Button onClick={() => navigate("/courses")} className="rounded-full gradient-primary text-white">
            Quay lại danh sách khóa học
          </Button>
        </div>
      </div>
    );
  }

  const lessonsCount = course.lessons?.length ?? 0;
  const completedLessonsCount = course.lessons?.filter((l) => user?.completedLessons.includes(l.slug)).length ?? 0;
  const progressPercent = lessonsCount > 0 ? Math.round((completedLessonsCount / lessonsCount) * 100) : 0;

  return (
    <div className={isLight
      ? "course-detail-page min-h-screen w-full max-w-full overflow-x-clip bg-[radial-gradient(circle_at_12%_8%,rgba(251,207,232,0.48),transparent_28%),linear-gradient(180deg,#fff8fb_0%,#fff_45%,#faf5ff_100%)] pb-16 pt-6 text-slate-800 sm:pt-8"
      : "course-detail-page min-h-screen w-full max-w-full overflow-x-clip bg-[radial-gradient(circle_at_12%_8%,rgba(245,158,11,0.1),transparent_28%),linear-gradient(180deg,#0d0929_0%,#120c38_55%,#09061f_100%)] pb-16 pt-6 text-slate-100 sm:pt-8"
    }>
      <div className="mx-auto w-full min-w-0 max-w-5xl px-4 sm:px-5">
        <button
          onClick={() => navigate("/courses")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>

        {/* Hero Section */}
        <section className={isLight
          ? "relative overflow-hidden rounded-[1.75rem] border border-pink-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(253,242,248,0.96)_52%,rgba(245,243,255,0.94)_100%)] p-5 shadow-[0_22px_70px_rgba(219,39,119,0.1)] sm:rounded-[2.4rem] sm:p-7 md:p-8"
          : "relative overflow-hidden rounded-[1.75rem] border border-amber-300/15 bg-[linear-gradient(135deg,rgba(24,16,67,0.96)_0%,rgba(34,22,85,0.96)_52%,rgba(15,31,65,0.92)_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:rounded-[2.4rem] sm:p-7 md:p-8"
        }>
          <div className="relative z-10 grid min-w-0 gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-center md:gap-8">
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className={isLight ? "inline-flex max-w-full rounded-full border border-pink-100 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-pink-600 shadow-sm sm:tracking-[0.2em]" : "inline-flex max-w-full rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300 sm:tracking-[0.2em]"}>
                Khóa học
              </span>
              <h1 className="content-heading mt-5 max-w-full break-words [overflow-wrap:anywhere] text-foreground">
                {course.title}
              </h1>
              <p className="mt-4 max-w-full break-words [overflow-wrap:anywhere] text-base leading-7 text-foreground/74 md:text-lg">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <span className="rounded-full border border-border/60 bg-background/70 px-3 py-2 text-xs font-semibold text-foreground/70 sm:px-4">
                  {lessonsCount} bài học
                </span>
                <span className="rounded-full border border-border/60 bg-background/70 px-3 py-2 text-xs font-semibold text-foreground/70 sm:px-4">
                  {lessonsCount * 10} phút học
                </span>
                {course.enrolled && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint/16 px-4 py-2 text-xs font-semibold text-mint-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    Đã đăng ký học
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={isLight ? "flex min-w-0 max-w-full flex-col items-center justify-center rounded-[1.5rem] border border-pink-100 bg-white/80 p-5 shadow-soft sm:rounded-[2rem] sm:p-6" : "flex min-w-0 max-w-full flex-col items-center justify-center rounded-[1.5rem] border border-amber-300/15 bg-white/[0.05] p-5 shadow-soft backdrop-blur-sm sm:rounded-[2rem] sm:p-6"}
            >
              {course.enrolled ? (
                <div className="w-full text-center space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Tiến độ của bạn</p>
                  <div className="text-4xl font-black text-foreground">{progressPercent}%</div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted w-full">
                    <div
                      className="h-full rounded-full gradient-primary transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hoàn thành {completedLessonsCount}/{lessonsCount} bài
                  </p>
                  <Button
                    onClick={() => {
                      // Find first uncompleted lesson, or go to the first lesson
                      const nextUncompleted = course.lessons.find((l) => !user?.completedLessons.includes(l.slug)) ?? course.lessons[0];
                      if (nextUncompleted) {
                        navigate(`/lesson/${nextUncompleted.slug}`);
                      }
                    }}
                    className="w-full rounded-full gradient-primary text-white font-bold py-5 hover:shadow-hover transition-all"
                  >
                    Tiếp tục học
                  </Button>
                </div>
              ) : (
                <div className="w-full text-center space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Bắt đầu học ngay</p>
                  <div className="text-2xl font-black text-foreground">Miễn phí hoàn toàn</div>
                  <p className="text-xs text-muted-foreground">Đăng ký để lưu tiến độ và nhận XP tích lũy</p>
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full rounded-full gradient-primary text-white font-bold py-6 hover:shadow-hover transition-all text-base"
                  >
                    {isEnrolling ? "Đang xử lý..." : "Đăng ký học"}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Syllabus / Syllabus Section */}
        <section className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,2.7fr)_minmax(0,1.3fr)]">
          <div className="min-w-0">
            {(() => {
              const themeColor = course.colorTheme && /^#?[0-9a-fA-F]{3,6}$/.test(course.colorTheme)
                ? course.colorTheme.startsWith("#") ? course.colorTheme : `#${course.colorTheme}`
                : "#7C3AED";
              
              const nextActiveLessonSlug = course.lessons?.find((l) => {
                const completed = user?.completedLessons.includes(l.slug);
                const isFree = l.isFree;
                const userIsPremium = user?.plan === "premium" || user?.plan === "popular";
                const isLocked = !isFree && !userIsPremium;
                return !completed && !isLocked;
              })?.slug || null;

              return (
                <>
                  <div className="mb-5 flex items-center gap-3 sm:mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300" style={{ backgroundColor: `${themeColor}18` }}>
                      <BookOpen className="h-5 w-5" style={{ color: themeColor }} />
                    </span>
                    <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">Nội dung khóa học</h2>
                  </div>

                  <div className="space-y-4">
                    {course.lessons.map((lesson, idx) => {
                      const completed = user?.completedLessons.includes(lesson.slug);
                      const isFree = lesson.isFree;
                      const userIsPremium = user?.plan === "premium" || user?.plan === "popular";
                      const isLocked = !isFree && !userIsPremium;
                      const isActivePlayable = lesson.slug === nextActiveLessonSlug;

                      let cardStyle: React.CSSProperties = {};
                      let accentBarStyle: React.CSSProperties = {};
                      let iconStyle: React.CSSProperties = {};
                      let iconElement: React.ReactNode = null;
                      let badgeElement: React.ReactNode = null;
                      let titleColorStyle: React.CSSProperties = {};

                      if (isLocked) {
                        cardStyle = {
                          backgroundColor: isLight ? "rgba(243, 244, 246, 0.65)" : "rgba(255, 255, 255, 0.035)",
                          borderColor: "rgba(156, 163, 175, 0.25)",
                          borderStyle: "dashed",
                          opacity: 0.65,
                          cursor: "not-allowed",
                        };
                        accentBarStyle = {
                          width: "4px",
                          backgroundColor: "#94A3B8",
                        };
                        iconStyle = {
                          backgroundColor: isLight ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.06)",
                          color: isLight ? "rgba(0, 0, 0, 0.35)" : "rgba(255, 255, 255, 0.45)",
                          border: isLight ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(255, 255, 255, 0.1)",
                        };
                        iconElement = <Lock className="h-4 w-4 shrink-0 text-slate-400" />;
                        badgeElement = (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                            <Lock className="h-2.5 w-2.5" />
                            Chưa mở khóa
                          </span>
                        );
                      } else if (completed) {
                        cardStyle = {
                          background: isLight ? "linear-gradient(135deg, rgba(240, 253, 250, 0.9), rgba(255,255,255,0.8))" : "linear-gradient(135deg, rgba(6,78,59,0.3), rgba(16,185,129,0.08))",
                          borderColor: "rgba(16, 185, 129, 0.22)",
                        };
                        accentBarStyle = {
                          width: "6px",
                          backgroundColor: "#10B981",
                        };
                        iconStyle = {
                          backgroundColor: "rgba(16, 185, 129, 0.12)",
                          color: "#10B981",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                        };
                        iconElement = <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
                        badgeElement = (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Hoàn thành
                          </span>
                        );
                        titleColorStyle = {
                          color: isLight ? "#064e3b" : "#a7f3d0",
                          opacity: 0.85,
                        };
                      } else if (isActivePlayable) {
                        cardStyle = {
                          background: isLight ? `linear-gradient(135deg, rgba(255, 255, 255, 0.99), ${themeColor}08)` : `linear-gradient(135deg, rgba(30,22,70,0.96), ${themeColor}18)`,
                          borderColor: themeColor,
                          borderWidth: "2px",
                          boxShadow: `0 16px 36px -12px ${themeColor}2e, 0 8px 20px -8px ${themeColor}1a`,
                          ["--hover-shadow" as any]: `0 24px 48px -12px ${themeColor}45`,
                        };
                        accentBarStyle = {
                          width: "8px",
                          background: `linear-gradient(180deg, ${themeColor}, #ec4899)`,
                        };
                        iconStyle = {
                          background: `linear-gradient(135deg, ${themeColor}, ${themeColor}bb)`,
                          color: "white",
                          boxShadow: `0 4px 12px ${themeColor}40`,
                        };
                        iconElement = <PlayCircle className="h-5 w-5 animate-pulse" />;
                        badgeElement = (
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black text-white animate-pulse shadow-sm"
                            style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            Học tiếp
                          </span>
                        );
                        titleColorStyle = {
                          color: themeColor,
                          fontWeight: 800,
                        };
                      } else {
                        cardStyle = {
                          background: isLight ? "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,248,251,0.86))" : "linear-gradient(135deg, rgba(27,18,70,0.92), rgba(18,12,56,0.82))",
                          borderColor: "rgba(229, 231, 235, 0.75)",
                        };
                        accentBarStyle = {
                          width: "4px",
                          backgroundColor: themeColor + "60",
                        };
                        iconStyle = {
                          backgroundColor: themeColor + "08",
                          color: themeColor,
                          border: `1px solid ${themeColor}20`,
                        };
                        iconElement = idx + 1;
                        badgeElement = isFree ? (
                          <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[10px] font-bold text-teal-600">
                            Học thử
                          </span>
                        ) : (
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold border"
                            style={{
                              backgroundColor: themeColor + "10",
                              borderColor: themeColor + "30",
                              color: themeColor,
                            }}
                          >
                            Nâng cao
                          </span>
                        );
                      }

                      const cardContent = (
                        <div className="flex w-full items-start gap-3 sm:gap-4">
                          {/* Left Accent Bar */}
                          <div
                            className="absolute left-0 top-0 bottom-0 transition-all duration-300 rounded-l-[1.6rem]"
                            style={accentBarStyle}
                          />

                          {/* Icon container */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold transition-all duration-300 sm:h-12 sm:w-12 ${
                              isActivePlayable ? "ring-4 ring-primary/10" : ""
                            }`}
                            style={iconStyle}
                          >
                            {iconElement}
                          </div>

                          {/* Text content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                className="font-heading text-base transition-colors group-hover:text-primary sm:text-lg"
                                style={titleColorStyle}
                              >
                                {lesson.title}
                              </h3>
                              {badgeElement}
                            </div>
                            <p className="mt-1.5 break-words [overflow-wrap:anywhere] text-sm font-medium leading-relaxed text-muted-foreground">
                              {lesson.summary}
                            </p>
                            <p className="mt-2 text-[11px] text-muted-foreground/80 font-semibold tracking-wide uppercase">
                              {lesson.estimatedMinutes} phút học • +{lesson.xpReward} XP
                            </p>
                          </div>
                        </div>
                      );

                      if (!course.enrolled && !isFree) {
                        // Lock advanced lessons if not enrolled
                        return (
                          <div
                            key={lesson.slug}
                            onClick={() => toast.info("Vui lòng bấm 'Đăng ký học' ở trên để mở khóa các bài học nâng cao!")}
                            className="relative cursor-pointer overflow-hidden rounded-[1.35rem] border p-4 pl-6 shadow-soft transition-all duration-300 hover:shadow-md sm:rounded-[1.6rem] sm:p-5 sm:pl-8"
                            style={cardStyle}
                          >
                            {cardContent}
                          </div>
                        );
                      }

                      if (isLocked) {
                        // Lock if premium and user is free
                        return (
                          <div
                            key={lesson.slug}
                            onClick={() => toast.warning("Bài học này thuộc gói nâng cao, vui lòng nâng cấp tài khoản!")}
                            className="relative cursor-not-allowed overflow-hidden rounded-[1.35rem] border p-4 pl-6 shadow-soft transition-all duration-300 hover:shadow-md sm:rounded-[1.6rem] sm:p-5 sm:pl-8"
                            style={cardStyle}
                          >
                            {cardContent}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={lesson.slug}
                          to={`/lesson/${lesson.slug}`}
                          className={`group relative block overflow-hidden rounded-[1.35rem] border p-4 pl-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 sm:rounded-[1.6rem] sm:p-5 sm:pl-8 ${
                            isActivePlayable
                              ? "hover:scale-[1.025] hover:[box-shadow:var(--hover-shadow)]"
                              : "hover:scale-[1.015] hover:shadow-hover"
                          }`}
                          style={cardStyle}
                        >
                          {cardContent}
                        </Link>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Right sidebar */}
          <aside className="min-w-0 max-w-full space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-card/85 p-5 shadow-card backdrop-blur-sm sm:rounded-[2rem] sm:p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-lg font-bold text-foreground">Bạn sẽ học được gì?</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  Kiến thức toàn diện chuẩn y khoa và tâm lý xã hội.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  Kỹ năng giao tiếp và đặt ranh giới cá nhân tự tin.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  Các tình huống tương tác thực tế giúp nhớ bài 150%.
                </li>
              </ul>
            </div>

            <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-card/85 p-5 shadow-card backdrop-blur-sm sm:rounded-[2rem] sm:p-6">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-lg font-bold text-foreground">Thông tin bổ sung</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2 border-border/50">
                  <span className="text-muted-foreground">Cấp độ</span>
                  <span className="font-semibold text-foreground">Mọi lứa tuổi</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-border/50">
                  <span className="text-muted-foreground">Ngôn ngữ</span>
                  <span className="font-semibold text-foreground">Tiếng Việt</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground">Chứng chỉ</span>
                  <span className="font-semibold text-foreground">Có cấp sau hoàn thành</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
