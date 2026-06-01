import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ExternalLink, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Lesson, MicroLesson, MicroLessonBlock, User } from "@/types/api";
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

function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "").trim();
  const full = cleaned.length === 3 ? cleaned.split("").map((c) => c + c).join("") : cleaned;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(hex: string, target: "#ffffff" | "#000000", amount: number) {
  const a = Math.max(0, Math.min(1, amount));
  const c1 = hexToRgb(hex);
  const c2 = hexToRgb(target);
  const r = Math.round(c1.r * (1 - a) + c2.r * a);
  const g = Math.round(c1.g * (1 - a) + c2.g * a);
  const b = Math.round(c1.b * (1 - a) + c2.b * a);
  return rgbToHex(r, g, b);
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

function renderBlockContent(block: MicroLessonBlock, onInteractionCorrect?: () => void) {
  const data = safeJsonParse(block.contentJson);

  if (block.blockType === "hook") {
    return <h3 className="mt-2 text-xl font-bold leading-snug text-foreground">{data?.title ?? ""}</h3>;
  }

  if (block.blockType === "explanation") {
    return (
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-foreground/78">
        {(data?.bullets ?? []).map((item: string, idx: number) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.blockType === "scenario") {
    return (
      <div className="mt-3 space-y-2">
        {data?.title ? <p className="text-[15px] font-semibold text-foreground">{data.title}</p> : null}
        <p className="text-[15px] leading-7 text-foreground/78">{data?.body ?? ""}</p>
      </div>
    );
  }

  if (block.blockType === "interaction") {
    return (
      <div className="mt-3 space-y-3">
        <p className="text-[15px] font-semibold text-foreground">{data?.question ?? ""}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {(data?.choices ?? []).map((c: any, idx: number) => {
            const isCorrect = !!c?.correct;
            const tone = isCorrect ? "bg-mint/14 hover:bg-mint/22" : "bg-peach/14 hover:bg-peach/22";

            return (
              <button
                key={idx}
                className={`w-full rounded-[1.4rem] px-4 py-4 text-left text-[15px] font-semibold transition-colors ${tone}`}
                onClick={() => {
                  if (isCorrect) {
                    toast.success("Chuẩn rồi!");
                    if (onInteractionCorrect) onInteractionCorrect();
                  } else {
                    toast.error("Thử lại nhé.");
                  }
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 flex-1">{c?.text ?? ""}</span>
                  <span className="text-lg">{c?.emoji ?? (isCorrect ? "🙂" : "☹️")}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (block.blockType === "reflection") {
    return <p className="mt-3 text-[15px] font-semibold leading-7 text-foreground/85">{data?.question ?? ""}</p>;
  }

  if (block.blockType === "takeaway") {
    return (
      <ul className="mt-3 space-y-2 text-[15px] leading-7 text-foreground/82">
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
  const { user, completeLesson, syncUser } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeMicroIndex, setActiveMicroIndex] = useState(0);
  const [isPrevHovered, setIsPrevHovered] = useState(false);

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

  useEffect(() => {
    setActiveMicroIndex(0);
  }, [lesson?.slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeMicroIndex, id]);

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

  const [visibleBlocksCount, setVisibleBlocksCount] = useState(1);

  useEffect(() => {
    if (activeMicro?.completed) {
      setVisibleBlocksCount(activeBlocks.length);
    } else {
      setVisibleBlocksCount(1);
    }
  }, [activeMicro?.id, activeMicro?.completed, activeBlocks.length]);

  const handleComplete = async () => {
    if (!lesson) return;
    await completeLesson(lesson.slug);
    toast.success("Đã hoàn thành bài học.");
  };

  const handleCompleteMicro = async (microLessonId: number) => {
    try {
      const res = await apiRequest<{ user: User; awardedXp: number }>(
        `/progress/micro-lessons/${microLessonId}/complete`,
        { method: "POST" }
      );
      if (res.user) {
        syncUser(res.user);
      }
      toast.success(`Đã hoàn thành phần học! (+${res.awardedXp} XP)`);

      // Re-fetch current lesson to update micro completion status
      if (id) {
        const currentLesson = await apiRequest<Lesson>(`/lessons/${id}`);
        setLesson(currentLesson);
      }

      // Auto-advance to next micro lesson if available
      if (canNextMicro) {
        setActiveMicroIndex((v) => v + 1);
      }
    } catch (err) {
      toast.error("Không thể hoàn thành phần học. Vui lòng thử lại.");
    }
  };

  const courseHex =
    lesson?.courseColorTheme && /^#?[0-9a-fA-F]{3,6}$/.test(lesson.courseColorTheme)
      ? lesson.courseColorTheme.startsWith("#")
        ? lesson.courseColorTheme
        : `#${lesson.courseColorTheme}`
      : "#7C3AED";

  const accentStrong = mix(courseHex, "#000000", 0.35);
  const accentSoft = mix(courseHex, "#ffffff", 0.82);
  const accentBorder = mix(courseHex, "#ffffff", 0.55);

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
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại khóa học
        </button>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
          <article>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="detail-panel p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ backgroundColor: accentSoft, color: accentStrong }}
                >
                  Bài {lesson.order} / {lessons.length}
                </span>

                <span className="rounded-full bg-background/70 px-4 py-2 text-xs font-semibold text-foreground/70">
                  {lesson.estimatedMinutes} phút • {lesson.xpReward} XP
                </span>

                {completed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint/16 px-4 py-2 text-xs font-semibold text-mint-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    Đã hoàn thành
                  </span>
                ) : null}
              </div>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground">{lesson.title}</h1>

              <div className="mt-5 border-l-4 bg-background/62 px-5 py-5" style={{ borderColor: accentBorder }}>
                <p className="text-[15px] leading-7 text-foreground/74">{lesson.summary}</p>
              </div>

              <div className="mt-8 rounded-[1.6rem] border p-5 shadow-soft" style={{ backgroundColor: accentSoft, borderColor: accentBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: accentStrong }}>
                  Micro lesson {activeMicro ? activeMicro.order : "-"} / {microLessonsSorted.length || 0}
                </p>

                <h2 className="mt-3 line-clamp-2 font-heading text-2xl font-bold text-foreground">
                  {activeMicro ? activeMicro.title : "Chưa có micro lesson"}
                </h2>
              </div>

              {/* Timeline blocks (FIXED: no extra/offset line) */}
              <div className="mt-8 space-y-6">
                {activeMicro ? (
                  activeBlocks.slice(0, visibleBlocksCount).map((block, idx) => {
                    const isLastVisible = idx === visibleBlocksCount - 1;
                    const isLastBlock = idx === activeBlocks.length - 1;
                    const showContinueButton = isLastVisible && !isLastBlock && block.blockType !== "interaction";

                    return (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="relative md:pl-14"
                      >
                        {/* connector to next bubble - only if next is visible */}
                        {idx < visibleBlocksCount - 1 ? (
                          <div
                            className="absolute left-[19px] top-[60px] bottom-[-54px] w-px hidden md:block"
                            style={{
                              backgroundColor: accentBorder,
                            }}
                          />
                        ) : null}

                        {/* left timeline column */}
                        <div className="absolute left-0 top-6 hidden w-10 md:block">
                          {/* bubble */}
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-soft"
                            style={{ backgroundColor: accentStrong }}
                          >
                            {idx + 1}
                          </div>
                        </div>

                        {/* card */}
                        <div className="rounded-[1.8rem] border border-white/70 bg-card/90 p-5 shadow-card">
                          <p
                            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ backgroundColor: accentSoft, color: accentStrong }}
                          >
                            {blockLabel(block.blockType)}
                          </p>

                          {renderBlockContent(block, () => {
                            if (!isLastBlock) {
                              setVisibleBlocksCount((v) => Math.min(activeBlocks.length, v + 1));
                            }
                          })}

                          {showContinueButton ? (
                            <div className="mt-4 flex justify-end">
                              <Button
                                onClick={() => setVisibleBlocksCount((v) => Math.min(activeBlocks.length, v + 1))}
                                className="rounded-full px-5 py-2 text-xs font-semibold text-white transition-all shadow-soft"
                                style={{ backgroundColor: accentStrong }}
                              >
                                Tiếp tục <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-sm text-foreground/70">Bài học này chưa có micro lessons.</p>
                )}
              </div>

              {/* Complete Micro Lesson Button */}
              {user && activeMicro && !activeMicro.completed && visibleBlocksCount === activeBlocks.length ? (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => void handleCompleteMicro(activeMicro.id)}
                    className="rounded-full px-8 py-5 text-sm font-semibold text-white transition-all shadow-soft hover:shadow-hover"
                    style={{ backgroundColor: accentStrong }}
                  >
                    Hoàn thành phần học này (+10 XP)
                  </Button>
                </div>
              ) : null}

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
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Điều hướng bài học</p>
                  <h2 className="font-heading text-xl font-bold text-foreground">Di chuyển nhanh</h2>
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
                    <span className="min-w-0 max-w-[140px] truncate text-xs text-foreground/60">{prevLesson.title}</span>
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
                    <span className="min-w-0 max-w-[140px] truncate text-xs text-foreground/60">{nextLesson.title}</span>
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
                    className={`w-full rounded-[1.1rem] px-4 py-3 text-left text-sm transition-colors ${
                      idx === safeActiveMicroIndex ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                    }`}
                    style={{
                      backgroundColor: idx === safeActiveMicroIndex ? accentSoft : "rgba(255,255,255,0.72)",
                      border: idx === safeActiveMicroIndex ? `1px solid ${accentBorder}` : "1px solid rgba(255,255,255,0.65)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: idx === safeActiveMicroIndex ? accentStrong : "rgba(0, 0, 0, 0.06)",
                            color: idx === safeActiveMicroIndex ? "white" : "inherit",
                          }}
                        >
                          {ml.order}
                        </span>
                        <span className="min-w-0 truncate font-semibold">
                          {ml.title}
                        </span>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {ml.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                        ) : idx === safeActiveMicroIndex ? (
                          <PlayCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <span className="text-xs text-foreground/55 font-medium">{(ml.blocks?.length ?? 0)} cards</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button
                  variant="ghost"
                  disabled={!canPrevMicro}
                  onClick={() => setActiveMicroIndex((v) => Math.max(0, v - 1))}
                  className="h-10 w-full justify-center rounded-full px-3 transition-colors"
                  style={{
                    backgroundColor: isPrevHovered && canPrevMicro ? "hsl(var(--accent))" : "rgba(255,255,255,0.72)",
                    color: isPrevHovered && canPrevMicro ? "hsl(var(--accent-foreground))" : "inherit"
                  }}
                  onMouseEnter={() => setIsPrevHovered(true)}
                  onMouseLeave={() => setIsPrevHovered(false)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Micro trước
                </Button>

                <Button
                  disabled={!canNextMicro}
                  onClick={() => setActiveMicroIndex((v) => Math.min(microLessonsSorted.length - 1, v + 1))}
                  className="h-10 w-full justify-center rounded-full px-3 text-white"
                  style={{ backgroundColor: accentStrong }}
                >
                  Micro tiếp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lesson Sources Card */}
            {lesson.sources && lesson.sources.length > 0 ? (
              <div className="rounded-[2rem] gradient-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Tài liệu uy tín</p>
                    <h2 className="font-heading text-xl font-bold text-foreground">Tham khảo thêm</h2>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {lesson.sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-[1.1rem] bg-background/76 px-4 py-3 text-sm font-semibold text-foreground/80 hover:text-foreground transition-all hover:bg-background/90"
                    >
                      <span className="truncate">{source.sourceName}</span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-foreground/50" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </section>
      </div>
    </div>
  );
}