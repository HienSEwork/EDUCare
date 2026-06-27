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
        bgGradient="linear-gradient(135deg,rgba(255,230,240,0.92) 0%,rgba(246,241,255,0.96) 50%,rgba(227,245,255,0.92) 100%)"
        accentColor="#7c3aed"
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
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-6xl px-4">
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-6 shadow-card md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                {QUIZ_COPY.currentRound}
              </span>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-5xl">{modeLabel(mode)}</h1>
              <p className="mt-4 text-base leading-7 text-foreground/74 md:text-lg">{modeDescription(mode)}</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: QUIZ_COPY.totalQuestions, value: `${session.totalQuestions} câu` },
                { label: QUIZ_COPY.answered, value: `${answeredCount}/${session.totalQuestions}` },
                { label: QUIZ_COPY.mode, value: mode === "long" ? QUIZ_COPY.deepPractice : QUIZ_COPY.quickCompact },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-white/70 bg-white/76 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {result ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/70 bg-card/84 p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-primary/10">
                  <Trophy className="h-6 w-6 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{QUIZ_COPY.result}</p>
                  <h2 className="font-heading text-3xl font-bold">
                    {QUIZ_COPY.correctAnswers(result.correctAnswers, result.totalQuestions)}
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] bg-background/82 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{QUIZ_COPY.roundScore}</p>
                  <p className="mt-2 text-2xl font-bold">{result.score}</p>
                </div>
                <div className="rounded-[1.5rem] bg-background/82 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{QUIZ_COPY.totalQuizScore}</p>
                  <p className="mt-2 text-2xl font-bold">{result.user ? result.quizScore : QUIZ_COPY.loginToSave}</p>
                </div>
                <div className="rounded-[1.5rem] bg-background/82 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{QUIZ_COPY.streak}</p>
                  <p className="mt-2 text-2xl font-bold">{result.user ? `${result.streak} ngày` : QUIZ_COPY.notSaved}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="gradient-primary text-primary-foreground"
                  onClick={() => {
                    setSessionNonce((current) => current + 1);
                    setResult(null);
                    setAnswers({});
                    setCurrentIndex(0);
                  }}
                >
                  {QUIZ_COPY.replay}
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/games/quiz?mode=${mode === "quick" ? "long" : "quick"}`}>
                    {QUIZ_COPY.switchTo(mode === "quick" ? "long" : "quick")}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/community/leaderboard">{QUIZ_COPY.viewLeaderboard}</Link>
                </Button>
              </div>

              {!user ? (
                <div className="mt-6 rounded-[1.5rem] border border-primary/15 bg-primary/6 p-4 text-sm text-foreground/76">
                  {QUIZ_COPY.savePrompt}
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-card/84 p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Review nhanh</p>
                  <h2 className="font-heading text-2xl font-bold">{QUIZ_COPY.quickReview}</h2>
                </div>
              </div>

              <div className="space-y-3">
                {result.reviews.map((review, index) => {
                  const isCorrect = review.selectedIndex === review.correctIndex;

                  return (
                    <div key={review.questionId} className="rounded-[1.4rem] border border-border/70 bg-background/76 p-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            isCorrect ? "bg-mint/18 text-mint-foreground" : "bg-destructive/12 text-destructive"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold">{review.question}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{review.explanation}</p>
                          <p className={`mt-2 text-sm font-semibold ${isCorrect ? "text-mint-foreground" : "text-destructive"}`}>
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
            <div className="rounded-[2rem] border border-white/70 bg-card/84 p-6 shadow-card">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{QUIZ_COPY.question(currentIndex + 1)}</p>
                  <h2 className="mt-2 font-heading text-3xl font-bold">{currentQuestion?.question}</h2>
                </div>
                <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
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
                      className={`w-full rounded-[1.5rem] border p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/8 shadow-soft"
                          : "border-border/70 bg-background/76 hover:border-primary/35 hover:bg-background"
                      }`}
                    >
                      <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} disabled={currentIndex === 0}>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {QUIZ_COPY.previousQuestion}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentIndex((value) => Math.min(session.totalQuestions - 1, value + 1))}
                    disabled={currentIndex === session.totalQuestions - 1}
                  >
                    {QUIZ_COPY.nextQuestion}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {currentIndex === session.totalQuestions - 1 ? (
                  <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? QUIZ_COPY.submitting : QUIZ_COPY.finishRound}
                  </Button>
                ) : null}
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] border border-white/70 bg-card/84 p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{QUIZ_COPY.progress}</p>
                <h3 className="mt-2 font-heading text-2xl font-bold">{answeredCount}/{session.totalQuestions} câu đã xong</h3>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full gradient-primary transition-all"
                    style={{ width: `${(answeredCount / session.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-card/84 p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{QUIZ_COPY.questionList}</p>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {session.questions.map((question, index) => {
                    const answered = answers[question.id] !== undefined && answers[question.id] !== null;

                    return (
                      <button
                        key={question.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`flex h-12 items-center justify-center rounded-[1rem] text-sm font-semibold transition-colors ${
                          index === currentIndex
                            ? "bg-foreground text-background"
                            : answered
                              ? "bg-primary/10 text-primary"
                              : "bg-background/76 text-muted-foreground hover:bg-background"
                        }`}
                      >
                        {answered ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-card/84 p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{QUIZ_COPY.otherMode}</p>
                <div className="mt-4 space-y-3">
                  <Link
                    to="/games/quiz?mode=quick"
                    className={`block rounded-[1.2rem] px-4 py-3 text-sm font-semibold ${mode === "quick" ? "bg-primary/10 text-primary" : "bg-background/76"}`}
                  >
                    {QUIZ_COPY.modeLabel.quick}
                  </Link>
                  <Link
                    to="/games/quiz?mode=long"
                    className={`block rounded-[1.2rem] px-4 py-3 text-sm font-semibold ${mode === "long" ? "bg-primary/10 text-primary" : "bg-background/76"}`}
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
