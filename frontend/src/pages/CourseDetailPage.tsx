import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2, Lock, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Course } from "@/types/api";
import { Button } from "@/components/ui/button";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-5xl px-4">
        <button
          onClick={() => navigate("/courses")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-6 shadow-card md:p-8">
          <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-soft">
                Khóa học
              </span>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-foreground/74 md:text-lg">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <span className="rounded-full bg-background/70 px-4 py-2 text-xs font-semibold text-foreground/70">
                  {lessonsCount} bài học
                </span>
                <span className="rounded-full bg-background/70 px-4 py-2 text-xs font-semibold text-foreground/70">
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
              className="flex flex-col items-center justify-center bg-white/70 rounded-[2rem] border border-white/80 p-6 shadow-soft"
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
        <section className="mt-10 grid gap-8 lg:grid-cols-[2.7fr_1.3fr]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </span>
              <h2 className="font-heading text-2xl font-bold text-foreground">Nội dung khóa học (Syllabus)</h2>
            </div>

            <div className="space-y-4">
              {course.lessons.map((lesson, idx) => {
                const completed = user?.completedLessons.includes(lesson.slug);
                const isFree = lesson.isFree;
                const userIsPremium = user?.plan === "premium" || user?.plan === "popular";
                const isLocked = !isFree && !userIsPremium;

                const cardContent = (
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${
                        completed ? "bg-mint/20 text-mint-foreground" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {completed ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-lg text-foreground">{lesson.title}</h3>
                        {isFree ? (
                          <span className="rounded-full bg-teal/12 px-2.5 py-0.5 text-[10px] font-bold text-teal-foreground">
                            Học thử
                          </span>
                        ) : (
                          <span className="rounded-full bg-pink/12 px-2.5 py-0.5 text-[10px] font-bold text-pink-foreground">
                            Nâng cao
                          </span>
                        )}
                        {completed && (
                          <span className="rounded-full bg-mint/12 px-2.5 py-0.5 text-[10px] font-bold text-mint-foreground">
                            Hoàn thành
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            Khóa
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{lesson.summary}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground/80">
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
                      className="rounded-[1.6rem] border border-white/60 bg-card/60 p-5 shadow-soft opacity-70 cursor-pointer hover:border-primary/20 transition-all"
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
                      className="rounded-[1.6rem] border border-white/60 bg-card/60 p-5 shadow-soft opacity-70 cursor-pointer hover:border-destructive/20 transition-all"
                    >
                      {cardContent}
                    </div>
                  );
                }

                return (
                  <Link
                    key={lesson.slug}
                    to={`/lesson/${lesson.slug}`}
                    className="block rounded-[1.6rem] border border-white/70 bg-card/90 p-5 shadow-soft hover:shadow-hover hover:border-primary/20 transition-all"
                  >
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] gradient-card p-6 shadow-card space-y-4">
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

            <div className="rounded-[2rem] gradient-card p-6 shadow-card space-y-4">
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
