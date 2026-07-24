import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Trophy } from "lucide-react";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-quiz.svg";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { QUIZ_COPY } from "@/content/uiCopy";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { QuizResultResponse, QuizSessionResponse, QuizSubmitAnswer } from "@/types/api";

type QuizMode = "quick" | "long";

function modeLabel(mode: QuizMode) {
  return mode === "long" ? QUIZ_COPY.modeLabel.long : QUIZ_COPY.modeLabel.quick;
}

function modeDescription(mode: QuizMode) {
  return mode === "long" ? QUIZ_COPY.modeDescription.long : QUIZ_COPY.modeDescription.quick;
}

export default function QuizPage() {
  const { user, syncUser } = useAuth();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "long" ? "long" : "quick";
  const [sessionNonce, setSessionNonce] = useState(0);
  const [gamePhase, setGamePhase] = useState<"intro" | "playing">("intro");

  const [session, setSession] = useState<QuizSessionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [result, setResult] = useState<QuizResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);

    void apiRequest<QuizSessionResponse>(`/quizzes/session?mode=${mode}`)
      .then((response) => {
        if (!active) {
          return;
        }

        setSession(response);
        setError(null);
      })
      .catch((requestError) => {
        if (!active) {
          return;
        }

        setError(requestError instanceof ApiError ? requestError.message : QUIZ_COPY.loadError);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [mode, sessionNonce]);

  const currentQuestion = session?.questions[currentIndex] ?? null;
  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value !== null && value !== undefined).length,
    [answers],
  );

  const quizAnswers = useMemo<QuizSubmitAnswer[]>(
    () =>
      (session?.questions ?? []).map((question) => ({
        questionId: question.id,
        selectedIndex: answers[question.id] ?? null,
      })),
    [answers, session],
  );

  const handleSelect = (selectedIndex: number) => {
    if (!currentQuestion || result) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: selectedIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!session) {
      return;
    }

    if (answeredCount !== session.totalQuestions) {
      toast.error(QUIZ_COPY.finishAllAnswers);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest<QuizResultResponse>("/quizzes/submit", {
        method: "POST",
        body: JSON.stringify({
          mode: session.mode,
          answers: quizAnswers,
        }),
      });

      setResult(response);

      if (response.user) {
        syncUser(response.user);
      }

      toast.success(QUIZ_COPY.completeTurn);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : QUIZ_COPY.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gamePhase === "intro") {
    const isLong = mode === "long";
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow={isLong ? "📚 Quiz · Bộ câu hỏi dài" : "⚡ Quiz · Siêu nhanh"}
        title={isLong ? "Trắc Nghiệm Chuyên Sâu" : "Quiz Siêu Tốc"}
        description={
          isLong
            ? "Bộ 20 câu hỏi kiến thức sức khỏe toàn diện. Suy nghĩ kỹ, trả lời đúng và kiếm điểm XP khủng!"
            : "10 câu hỏi nhanh về sức khỏe tuổi teen. Không giới hạn thời gian — thể hiện kiến thức của bạn!"
        }
        stats={
          isLong
            ? [
                { label: "Số câu", value: "20 câu" },
                { label: "Phần thưởng", value: "XP + Huy hiệu" },
                { label: "Độ khó", value: "Trung bình" },
              ]
            : [
                { label: "Số câu", value: "10 câu" },
                { label: "Phần thưởng", value: "XP + Điểm" },
                { label: "Tốc độ", value: "Siêu nhanh" },
              ]
        }
        rules={[
          { text: "Đọc câu hỏi và chọn đáp án đúng nhất" },
          { text: "Bạn có thể thay đổi đáp án trước khi nộp" },
          { text: "Trả lời hết tất cả câu hỏi rồi mới nộp bài" },
          { text: "Kết quả và điểm XP được cập nhật ngay!" },
        ]}
        startLabel={isLong ? "Bắt đầu làm bài!" : "Bắt đầu quiz!"}
        onStart={() => setGamePhase("playing")}
        bgGradient="linear-gradient(160deg, #071926 0%, #0d2c42 45%, #1f1254 100%)"
        accentColor="#06b6d4"
        buttonIcon={<Sparkles className="h-5 w-5" />}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-[2rem] bg-card/84 p-8 shadow-card">{QUIZ_COPY.loading}</div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-[2rem] border border-destructive/20 bg-destructive/10 p-8 text-destructive shadow-card">
            {error ?? QUIZ_COPY.loadError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      {/* Full Width Hero Banner */}
      <section className="w-full relative overflow-hidden mb-8">
        <div className="site-shell relative z-10 px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                {QUIZ_COPY.currentRound}
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight md:text-5xl text-white">{modeLabel(mode)}</h1>
              <p className="mt-4 text-base leading-relaxed text-indigo-100/80 md:text-lg">{modeDescription(mode)}</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: QUIZ_COPY.totalQuestions, value: `${session.totalQuestions} câu` },
                { label: QUIZ_COPY.answered, value: `${answeredCount}/${session.totalQuestions}` },
                { label: QUIZ_COPY.mode, value: mode === "long" ? QUIZ_COPY.deepPractice : QUIZ_COPY.quickCompact },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-indigo-400/30 bg-indigo-950/70 backdrop-blur-md p-4 shadow-xl">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{item.label}</p>
                  <p className="mt-1.5 text-sm font-extrabold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="site-shell px-4">

        {result ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-indigo-950/80 border border-indigo-400/30">
                  <Trophy className="h-6 w-6 text-amber-400" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{QUIZ_COPY.result}</p>
                  <h2 className="font-heading text-3xl font-extrabold text-white">
                    {QUIZ_COPY.correctAnswers(result.correctAnswers, result.totalQuestions)}
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-indigo-400/20 bg-indigo-950/50 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{QUIZ_COPY.roundScore}</p>
                  <p className="mt-2 text-2xl font-black text-white">{result.score}</p>
                </div>
                <div className="rounded-[1.5rem] border border-indigo-400/20 bg-indigo-950/50 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{QUIZ_COPY.totalQuizScore}</p>
                  <p className="mt-2 text-2xl font-black text-white">{result.user ? result.quizScore : QUIZ_COPY.loginToSave}</p>
                </div>
                <div className="rounded-[1.5rem] border border-indigo-400/20 bg-indigo-950/50 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{QUIZ_COPY.streak}</p>
                  <p className="mt-2 text-2xl font-black text-white">{result.user ? `${result.streak} ngày` : QUIZ_COPY.notSaved}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-black hover:brightness-110 shadow-lg shadow-cyan-500/20"
                  onClick={() => {
                    setSessionNonce((current) => current + 1);
                    setResult(null);
                    setAnswers({});
                    setCurrentIndex(0);
                  }}
                >
                  {QUIZ_COPY.replay}
                </Button>
                <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" asChild>
                  <Link to={`/games/quiz?mode=${mode === "quick" ? "long" : "quick"}`}>
                    {QUIZ_COPY.switchTo(mode === "quick" ? "long" : "quick")}
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" asChild>
                  <Link to="/community/leaderboard">{QUIZ_COPY.viewLeaderboard}</Link>
                </Button>
              </div>

              {!user ? (
                <div className="mt-6 rounded-[1.5rem] border border-indigo-400/30 bg-indigo-950/60 p-4 text-sm text-indigo-100">
                  {QUIZ_COPY.savePrompt}
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-indigo-950/80 border border-indigo-400/30">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">Review nhanh</p>
                  <h2 className="font-heading text-2xl font-extrabold text-white">{QUIZ_COPY.quickReview}</h2>
                </div>
              </div>

              <div className="space-y-3">
                {result.reviews.map((review, index) => {
                  const isCorrect = review.selectedIndex === review.correctIndex;

                  return (
                    <div key={review.questionId} className="rounded-[1.4rem] border border-indigo-400/20 bg-indigo-950/50 p-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                            isCorrect ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-slate-950"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-extrabold text-white">{review.question}</p>
                          <p className="mt-2 text-sm text-indigo-100/80">{review.explanation}</p>
                          <p className={`mt-2 text-sm font-extrabold ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                            {isCorrect ? QUIZ_COPY.correctAnswer : QUIZ_COPY.incorrectAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,1.2fr)]">
            <div className="rounded-[2rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{QUIZ_COPY.question(currentIndex + 1)}</p>
                  <h2 className="mt-2 font-heading text-3xl font-extrabold text-white">{currentQuestion?.question}</h2>
                </div>
                <span className="rounded-full bg-cyan-950/80 border border-cyan-400/40 px-3 py-1 text-xs font-extrabold text-cyan-300">
                  {currentQuestion?.category}
                </span>
              </div>

              <div className="space-y-3">
                {currentQuestion?.options.map((option, optionIndex) => {
                  const isSelected = answers[currentQuestion.id] === optionIndex;

                  return (
                    <button
                      key={`${currentQuestion.id}-${optionIndex}`}
                      onClick={() => handleSelect(optionIndex)}
                      className={`w-full rounded-[1.5rem] border p-4 text-left font-bold transition-all ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                          : "border-indigo-400/30 bg-indigo-950/50 text-white hover:border-cyan-400/60 hover:bg-indigo-900/70"
                      }`}
                    >
                      <span className="font-black">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} disabled={currentIndex === 0}>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {QUIZ_COPY.previousQuestion}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80"
                    onClick={() => setCurrentIndex((value) => Math.min(session.totalQuestions - 1, value + 1))}
                    disabled={currentIndex === session.totalQuestions - 1}
                  >
                    {QUIZ_COPY.nextQuestion}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {currentIndex === session.totalQuestions - 1 ? (
                  <Button className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-black hover:brightness-110 shadow-lg shadow-cyan-500/20" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? QUIZ_COPY.submitting : QUIZ_COPY.finishRound}
                  </Button>
                ) : null}
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{QUIZ_COPY.progress}</p>
                <h3 className="mt-2 font-heading text-2xl font-extrabold text-white">{answeredCount}/{session.totalQuestions} câu đã xong</h3>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-indigo-950 border border-indigo-500/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                    style={{ width: `${(answeredCount / session.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{QUIZ_COPY.questionList}</p>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {session.questions.map((question, index) => {
                    const answered = answers[question.id] !== undefined && answers[question.id] !== null;

                    return (
                      <button
                        key={question.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`flex h-12 items-center justify-center rounded-[1rem] text-sm font-extrabold transition-colors ${
                          index === currentIndex
                            ? "bg-cyan-500 text-slate-950 font-black shadow-lg"
                            : answered
                              ? "bg-indigo-950/80 border border-cyan-400/40 text-cyan-300"
                              : "bg-indigo-950/40 border border-indigo-400/20 text-slate-300 hover:bg-indigo-900/60"
                        }`}
                      >
                        {answered ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{QUIZ_COPY.otherMode}</p>
                <div className="mt-4 space-y-3">
                  <Link
                    to="/games/quiz?mode=quick"
                    className={`block rounded-[1.2rem] px-4 py-3 text-sm font-bold transition-all ${mode === "quick" ? "border border-cyan-400/40 bg-cyan-950/80 text-cyan-300" : "border border-indigo-400/20 bg-indigo-950/40 text-indigo-100"}`}
                  >
                    {QUIZ_COPY.modeLabel.quick}
                  </Link>
                  <Link
                    to="/games/quiz?mode=long"
                    className={`block rounded-[1.2rem] px-4 py-3 text-sm font-bold transition-all ${mode === "long" ? "border border-cyan-400/40 bg-cyan-950/80 text-cyan-300" : "border border-indigo-400/20 bg-indigo-950/40 text-indigo-100"}`}
                  >
                    {QUIZ_COPY.modeLabel.long}
                  </Link>
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}
