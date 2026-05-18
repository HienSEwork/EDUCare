import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Lesson } from "@/types/api";
import { Button } from "@/components/ui/button";

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    void Promise.all([apiRequest<Lesson[]>("/lessons"), apiRequest<Lesson>(`/lessons/${id}`)])
      .then(([lessonList, currentLesson]) => {
        setLessons(lessonList);
        setLesson(currentLesson);
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : "Không tìm thấy bài học.");
      });
  }, [id]);

  const currentIndex = useMemo(() => lessons.findIndex((item) => item.slug === id), [id, lessons]);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="detail-panel px-6 py-4 text-destructive">{error}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="detail-panel px-6 py-4">Đang tải bài học...</p>
      </div>
    );
  }

  const locked = !lesson.isFree && (!user || user.plan === "free");

  if (locked) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="detail-panel max-w-xl px-8 py-10 text-center">
          <p className="mb-4 text-lg">Bài học này dành cho tài khoản đã mở nội dung nâng cao.</p>
          <Button onClick={() => navigate("/courses")} className="rounded-full gradient-primary text-primary-foreground">
            Xem lộ trình khóa học
          </Button>
        </div>
      </div>
    );
  }

  const completed = user?.completedLessons.includes(lesson.slug);

  const handleComplete = async () => {
    await completeLesson(lesson.slug);
    toast.success("Đã hoàn thành bài học.");
  };

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-5xl px-4">
        <button
          onClick={() => navigate("/courses")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại khóa học
        </button>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
          <article>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="detail-panel p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-lavender/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-lavender-foreground">
                  Bài {lesson.order} / {lessons.length}
                </span>
                {completed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint/16 px-4 py-2 text-xs font-semibold text-mint-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    Đã hoàn thành
                  </span>
                ) : null}
              </div>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight">{lesson.title}</h1>

              <div className="mt-5 border-l-4 border-primary/18 bg-background/62 px-5 py-5">
                <p className="text-base leading-7 text-muted-foreground">{lesson.summary}</p>
              </div>

              <div className="mt-8 space-y-5">
                {lesson.content.split("\n").map((line, index) => (
                  <p key={index} className="text-base leading-8 text-foreground/88">
                    {line}
                  </p>
                ))}
              </div>

              {user && !completed ? (
                <div className="mt-10 border-t border-border/70 pt-6">
                  <Button onClick={() => void handleComplete()} className="rounded-full gradient-primary px-8 text-primary-foreground">
                    Hoàn thành bài học (+50 XP)
                  </Button>
                </div>
              ) : null}
            </motion.div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] gradient-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                  <PlayCircle className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Điều hướng bài học</p>
                  <h2 className="font-heading text-xl font-bold">Di chuyển nhanh</h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {prev ? (
                  <Button variant="ghost" onClick={() => navigate(`/lesson/${prev.slug}`)} className="w-full justify-between rounded-[1.1rem] bg-background/76 px-4 py-6">
                    <span className="inline-flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Bài trước
                    </span>
                    <span className="max-w-[140px] truncate text-xs text-muted-foreground">{prev.title}</span>
                  </Button>
                ) : null}

                {next ? (
                  <Button variant="ghost" onClick={() => navigate(`/lesson/${next.slug}`)} className="w-full justify-between rounded-[1.1rem] bg-background/76 px-4 py-6">
                    <span className="inline-flex items-center gap-2">
                      Bài tiếp theo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="max-w-[140px] truncate text-xs text-muted-foreground">{next.title}</span>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] gradient-card p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Danh sách bài</p>
              <div className="mt-4 space-y-3">
                {lessons.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => navigate(`/lesson/${item.slug}`)}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                      item.slug === lesson.slug ? "bg-foreground text-background" : "bg-background/76 hover:bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{item.title}</span>
                      {user?.completedLessons.includes(item.slug) ? <CheckCircle2 className="h-4 w-4 text-mint-foreground" /> : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
