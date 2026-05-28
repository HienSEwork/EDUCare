import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Lesson, MicroLesson, MicroLessonBlock } from "@/types/api";
import { Button } from "@/components/ui/button";

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function sortBlocks(blocks: MicroLessonBlock[]) {
  return blocks.slice().sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}

function sortMicroLessons(microLessons: MicroLesson[]) {
  return microLessons.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function blockLabel(blockType: MicroLessonBlock["blockType"]) {
  switch (blockType) {
    case "hook":
      return "Hook";
    case "explanation":
      return "Hiểu nhanh";
    case "scenario":
      return "Tình huống thực tế";
    case "interaction":
      return "Bạn sẽ làm gì?";
    case "reflection":
      return "Suy ngẫm";
    case "takeaway":
      return "Điều cần nhớ";
    default:
      return blockType;
  }
}

function renderBlockContent(block: MicroLessonBlock) {
  const data = safeJsonParse(block.contentJson);

  if (block.blockType === "hook") {
    return <h3 className="mt-2 text-xl font-bold">{data?.title ?? ""}</h3>;
  }

  if (block.blockType === "explanation") {
    return (
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        {(data?.bullets ?? []).map((item: string, idx: number) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.blockType === "scenario") {
    return (
      <div className="mt-3 space-y-2">
        {data?.title ? <p className="text-sm font-semibold">{data.title}</p> : null}
        <p className="text-sm leading-7 text-muted-foreground">{data?.body ?? ""}</p>
      </div>
    );
  }

  if (block.blockType === "interaction") {
    return (
      <div className="mt-3 space-y-3">
        <p className="text-sm font-semibold">{data?.question ?? ""}</p>
        {(data?.choices ?? []).map((c: any, idx: number) => (
          <button
            key={idx}
            className="w-full rounded-[1.2rem] bg-background/76 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-background"
            onClick={() => {
              if (c?.correct) toast.success("Chuẩn rồi!");
              else toast.error("Thử lại nhé.");
            }}
          >
            {c?.text ?? ""}
          </button>
        ))}
      </div>
    );
  }

  if (block.blockType === "reflection") {
    return <p className="mt-3 text-sm font-medium text-foreground/90">{data?.question ?? ""}</p>;
  }

  if (block.blockType === "takeaway") {
    return (
      <ul className="mt-3 space-y-2 text-sm text-foreground/88">
        {(data?.items ?? []).map((item: string, idx: number) => (
          <li key={idx}>• {item}</li>
        ))}
      </ul>
    );
  }

  return (
    <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-background/70 p-4 text-xs text-muted-foreground">
      {block.contentJson}
    </pre>
  );
}

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  // micro lesson navigation
  const [activeMicroIndex, setActiveMicroIndex] = useState(0);

  // ALWAYS call hooks before any return
  useEffect(() => {
    if (!id) return;

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

  // reset micro index when lesson changes
  useEffect(() => {
    setActiveMicroIndex(0);
  }, [lesson?.slug]);

  const currentIndex = useMemo(() => lessons.findIndex((item) => item.slug === id), [id, lessons]);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const locked = lesson ? !lesson.isFree && (!user || user.plan === "free") : false;
  const completed = lesson ? user?.completedLessons.includes(lesson.slug) : false;

  const microLessonsSorted = useMemo(() => sortMicroLessons(lesson?.microLessons ?? []), [lesson?.microLessons]);
  const safeActiveMicroIndex = Math.min(activeMicroIndex, Math.max(0, microLessonsSorted.length - 1));
  const activeMicro = microLessonsSorted[safeActiveMicroIndex] ?? null;
  const activeBlocks = useMemo(() => (activeMicro ? sortBlocks(activeMicro.blocks ?? []) : []), [activeMicro]);

  const canPrevMicro = safeActiveMicroIndex > 0;
  const canNextMicro = safeActiveMicroIndex < microLessonsSorted.length - 1;

  const handleComplete = async () => {
    if (!lesson) return;
    await completeLesson(lesson.slug);
    toast.success("Đã hoàn thành bài học.");
  };

  // ---- returns AFTER hooks ----
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

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-6xl px-4">
        <button
          onClick={() => navigate("/courses")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại khóa học
        </button>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
          <article>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="detail-panel p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-lavender/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-lavender-foreground">
                  Bài {lesson.order} / {lessons.length}
                </span>

                <span className="rounded-full bg-background/70 px-4 py-2 text-xs font-semibold text-muted-foreground">
                  {lesson.estimatedMinutes} phút • {lesson.xpReward} XP
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

              {/* MicroLesson controls (moved on top) */}
              <div className="mt-8 rounded-[1.6rem] border border-white/70 bg-white/55 p-5 shadow-soft">
                {/* Top row: buttons */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Micro lesson {activeMicro ? activeMicro.order : "-"} / {microLessonsSorted.length || 0}
                  </p>

                  <div className="flex flex-nowrap items-center gap-2">
                    <Button
                      variant="ghost"
                      disabled={!canPrevMicro}
                      onClick={() => setActiveMicroIndex((v) => Math.max(0, v - 1))}
                      className="h-10 whitespace-nowrap rounded-full bg-background/76 px-4"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Micro trước
                    </Button>

                    <Button
                      disabled={!canNextMicro}
                      onClick={() => setActiveMicroIndex((v) => Math.min(microLessonsSorted.length - 1, v + 1))}
                      className="h-10 whitespace-nowrap rounded-full gradient-primary px-4 text-primary-foreground"
                    >
                      Micro tiếp theo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Bottom row: title */}
                <h2 className="mt-3 line-clamp-2 font-heading text-2xl font-bold">
                  {activeMicro ? activeMicro.title : "Chưa có micro lesson"}
                </h2>
              </div>
              <div className="mt-8 space-y-5">
                {activeMicro ? (
                  activeBlocks.map((block, idx) => (
                    <div key={block.id} className="relative">
                      <div className="absolute -left-2 top-6 hidden md:flex">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {idx + 1}
                        </div>
                      </div>

                      <div className="rounded-[1.8rem] border border-white/70 bg-card/84 p-5 shadow-card md:pl-12">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{blockLabel(block.blockType)}</p>
                        {renderBlockContent(block)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Bài học này chưa có micro lessons.</p>
                )}
              </div>

              {user && !completed ? (
                <div className="mt-10 border-t border-border/70 pt-6">
                  <Button onClick={() => void handleComplete()} className="rounded-full gradient-primary px-8 text-primary-foreground">
                    Hoàn thành bài học (+{lesson.xpReward} XP)
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
                {prevLesson ? (
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/lesson/${prevLesson.slug}`)}
                    className="w-full justify-between rounded-[1.1rem] bg-background/76 px-4 py-6"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Bài trước
                    </span>
                    <span className="max-w-[140px] truncate text-xs text-muted-foreground">{prevLesson.title}</span>
                  </Button>
                ) : null}

                {nextLesson ? (
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/lesson/${nextLesson.slug}`)}
                    className="w-full justify-between rounded-[1.1rem] bg-background/76 px-4 py-6"
                  >
                    <span className="inline-flex items-center gap-2">
                      Bài tiếp theo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="max-w-[140px] truncate text-xs text-muted-foreground">{nextLesson.title}</span>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] gradient-card p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Danh sách micro lessons</p>

              <div className="mt-4 space-y-3">
                {microLessonsSorted.map((ml, idx) => (
                  <button
                    key={ml.id}
                    onClick={() => setActiveMicroIndex(idx)}
                    className={`w-full rounded-[1.1rem] px-4 py-3 text-left text-sm transition-colors ${idx === safeActiveMicroIndex ? "bg-foreground text-background" : "bg-background/76 hover:bg-background"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate font-medium">
                        {ml.order}. {ml.title}
                      </span>
                      <span className="text-xs opacity-70">{(ml.blocks?.length ?? 0)} cards</span>
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