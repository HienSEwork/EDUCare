import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, GraduationCap, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

import heroIllustration from "@/assets/hero-illustration.png";
import { COURSES_PAGE_COPY } from "@/content/pageCopy";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Course } from "@/types/api";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [myLearning, setMyLearning] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const promises = [apiRequest<Course[]>("/courses")];
    if (user) {
      promises.push(apiRequest<Course[]>("/courses/my-learning"));
    }

    Promise.all(promises)
      .then(([allCourses, enrolledCourses]) => {
        setCourses(allCourses);
        if (enrolledCourses) {
          setMyLearning(enrolledCourses);
        }
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : COURSES_PAGE_COPY.loadError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

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
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-6 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                {COURSES_PAGE_COPY.eyebrow}
              </span>
              <h1 className="mt-5 max-w-[14ch] font-heading text-4xl font-bold leading-[1.06] tracking-[-0.03em] md:text-5xl">
                <span className="block">{COURSES_PAGE_COPY.titleLine1}</span>
                <span className="block">{COURSES_PAGE_COPY.titleLine2}</span>
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/74 md:text-lg">
                {COURSES_PAGE_COPY.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/74 p-5 shadow-soft"
            >
              <div className="mb-4 flex items-center justify-between rounded-full bg-background/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <span>Khám phá chủ đề</span>
                <span>{courses.length} khóa học</span>
              </div>
              <img src={heroIllustration} alt={COURSES_PAGE_COPY.imageAlt} className="mx-auto max-h-[220px] w-full object-contain" />
            </motion.div>
          </div>
        </section>

        {error ? <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

        {/* My Learning (Active Courses) */}
        {user && myLearning.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </span>
              <h2 className="font-heading text-2xl font-bold text-foreground">Khóa học của tôi (My Learning)</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myLearning.map((course, idx) => {
                const lessonsCount = course.lessons?.length ?? 0;
                const completedLessonsCount = course.lessons?.filter((l) => user.completedLessons.includes(l.slug)).length ?? 0;
                const progressPercent = lessonsCount > 0 ? Math.round((completedLessonsCount / lessonsCount) * 100) : 0;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col rounded-[2rem] border border-white/70 bg-card p-5 shadow-card hover:shadow-hover hover:border-primary/20 transition-all cursor-pointer"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-center gap-3">
                        <span className="rounded-full bg-mint/12 px-3 py-1 text-[10px] font-bold text-mint-foreground">
                          Đang học
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          {completedLessonsCount}/{lessonsCount} bài
                        </span>
                      </div>
                      <h3 className="mt-4 font-heading text-xl font-bold leading-snug line-clamp-1">{course.title}</h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-foreground">
                        <span>Tiến độ</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted w-full">
                        <div
                          className="h-full rounded-full gradient-primary transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Course Catalog (All Available Courses) */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </span>
            <h2 className="font-heading text-2xl font-bold text-foreground">Danh mục khóa học</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, idx) => {
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
                      <span className="rounded-full bg-background/88 px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                        {course.lessons?.length ?? 0} bài học
                      </span>
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
        </section>
      </div>
    </div>
  );
}