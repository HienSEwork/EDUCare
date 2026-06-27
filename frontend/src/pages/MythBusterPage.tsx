import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_MYTHS, type Myth } from "@/data/myths";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-myth-buster.svg";

const TIME_PER_QUESTION = 8;
const TOTAL_QUESTIONS = 20;
const STREAK_BONUS_AT = 5;
const STREAK_BONUS_SECONDS = 3;

type GamePhase = "intro" | "playing" | "result";
type Answer = "true" | "false" | null;

interface RoundQuestion extends Myth {
  answered: Answer;
  isCorrect: boolean | null;
  timeBonus: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getScoreLabel(correct: number, total: number): { label: string; emoji: string; color: string } {
  const pct = (correct / total) * 100;
  if (pct === 100) return { label: "Hoàn hảo! Bạn là chuyên gia!", emoji: "🏆", color: "#f77f00" };
  if (pct >= 80) return { label: "Xuất sắc! Kiến thức rất vững!", emoji: "🌟", color: "#06d6a0" };
  if (pct >= 60) return { label: "Khá tốt! Tiếp tục học thêm nhé!", emoji: "👍", color: "#4361ee" };
  if (pct >= 40) return { label: "Cần ôn thêm — bạn đang trên đà!", emoji: "💪", color: "#9b5de5" };
  return { label: "Còn nhiều điều thú vị đang chờ bạn!", emoji: "📚", color: "#ff5d8f" };
}

const CATEGORY_COLORS: Record<string, string> = {
  "Cơ thể": "#f77f00",
  "Cảm xúc": "#06d6a0",
  "Quan hệ": "#ff5d8f",
  "An toàn số": "#7209b7",
  "Giới tính": "#4361ee",
  "Kỹ năng sống": "#9b5de5",
};

export default function MythBusterPage() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [questions, setQuestions] = useState<RoundQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; explanation: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = useCallback(() => {
    const picked = shuffle(ALL_MYTHS).slice(0, TOTAL_QUESTIONS).map<RoundQuestion>((m) => ({
      ...m,
      answered: null,
      isCorrect: null,
      timeBonus: false,
    }));
    setQuestions(picked);
    setCurrentIndex(0);
    setTimeLeft(TIME_PER_QUESTION);
    setStreak(0);
    setShowFeedback(false);
    setLastAnswer(null);
    setPhase("playing");
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || showFeedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Time ran out → auto skip as wrong
          handleAnswer(null, true);
          return TIME_PER_QUESTION;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIndex, showFeedback]);

  const handleAnswer = useCallback(
    (answer: Answer, isTimeout = false) => {
      if (showFeedback) return;
      if (timerRef.current) clearInterval(timerRef.current);

      const q = questions[currentIndex];
      if (!q) return;

      const correct = !isTimeout && answer !== null && (answer === "true") === q.isTrue;

      setStreak((s) => (correct ? s + 1 : 0));
      setLastAnswer({ correct, explanation: q.explanation });
      setShowFeedback(true);

      setQuestions((prev) =>
        prev.map((item, idx) =>
          idx === currentIndex
            ? { ...item, answered: isTimeout ? "false" : answer, isCorrect: correct }
            : item,
        ),
      );

      setTimeout(() => {
        setShowFeedback(false);
        setLastAnswer(null);
        if (currentIndex + 1 >= TOTAL_QUESTIONS) {
          setPhase("result");
        } else {
          setCurrentIndex((i) => i + 1);
          setTimeLeft((t) => {
            if (correct && streak > 0 && (streak + 1) % STREAK_BONUS_AT === 0) {
              return Math.min(t + STREAK_BONUS_SECONDS, TIME_PER_QUESTION + STREAK_BONUS_SECONDS);
            }
            return TIME_PER_QUESTION;
          });
        }
      }, 2000);
    },
    [currentIndex, questions, showFeedback, streak],
  );

  const currentQuestion = questions[currentIndex];
  const correctCount = useMemo(
    () => questions.filter((q) => q.isCorrect === true).length,
    [questions],
  );

  const timerPct = (timeLeft / TIME_PER_QUESTION) * 100;
  const categoryColor = currentQuestion
    ? (CATEGORY_COLORS[currentQuestion.category] ?? "#9b5de5")
    : "#9b5de5";

  // ─── INTRO ───────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow="⚡ Mini Game · Đúng / Sai"
        title="Giải Mã Tin Đồn"
        description="20 câu hỏi Đúng/Sai siêu tốc về sức khỏe tuổi teen. Streak 5 câu liên tiếp = +3 giây thưởng!"
        stats={[
          { label: "Số câu", value: "20 câu" },
          { label: "Thời gian", value: "8 giây/câu" },
          { label: "Streak bonus", value: "+3 giây" },
        ]}
        rules={[
          { text: "Đọc câu phát biểu và chọn ĐÚNG hoặc SAI" },
          { text: "Mỗi câu chỉ có 8 giây để trả lời" },
          { text: "Đúng 5 câu liên tiếp được +3 giây thưởng" },
          { text: "Xem giải thích ngắn sau mỗi câu trả lời" },
        ]}
        startLabel="Bắt đầu thử thách!"
        onStart={startGame}
        bgGradient="linear-gradient(135deg,#1a0a00 0%,#2d1200 50%,#0a1a2d 100%)"
        accentColor="#f77f00"
        buttonIcon={<Zap className="h-5 w-5" />}
      />
    );
  }

  // ─── RESULT ──────────────────────────────────────────────────────────────
  if (phase === "result") {
    const scoreInfo = getScoreLabel(correctCount, TOTAL_QUESTIONS);
    const pct = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

    return (
      <div className="min-h-screen pb-16 pt-8">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-8 shadow-card text-center md:p-12">
              <div className="text-5xl">{scoreInfo.emoji}</div>
              <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl">{scoreInfo.label}</h1>
              <p className="mt-2 text-muted-foreground">
                Bạn trả lời đúng <strong>{correctCount}/{TOTAL_QUESTIONS}</strong> câu ({pct}%)
              </p>

              {/* Progress ring */}
              <div className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full shadow-card"
                style={{ background: `conic-gradient(${scoreInfo.color} ${pct}%, #e5e7eb ${pct}%)` }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background">
                  <span className="font-heading text-2xl font-bold" style={{ color: scoreInfo.color }}>
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  id="myth-buster-replay-btn"
                  className="gradient-primary text-primary-foreground"
                  onClick={startGame}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Chơi lại
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/games">
                    <ArrowRight className="mr-2 h-4 w-4" /> Chơi game khác
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/courses">
                    <BookOpen className="mr-2 h-4 w-4" /> Xem bài học
                  </Link>
                </Button>
              </div>
            </section>

            {/* Review section */}
            <section className="mt-8">
              <h2 className="mb-4 font-heading text-2xl font-bold">Xem lại kết quả</h2>
              <div className="grid gap-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`rounded-[1.6rem] border p-5 ${
                      q.isCorrect
                        ? "border-green-200/70 bg-green-50/80"
                        : "border-red-200/70 bg-red-50/80"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          q.isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}
                      >
                        {q.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Câu {idx + 1}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                            style={{ background: CATEGORY_COLORS[q.category] ?? "#9b5de5" }}
                          >
                            {q.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Đáp án: <strong>{q.isTrue ? "✅ Đúng" : "❌ Sai"}</strong>
                          </span>
                        </div>
                        <p className="mt-1 font-semibold">{q.statement}</p>
                        <p className="mt-1 text-sm text-foreground/70">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── PLAYING ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-3xl px-4">

        {/* Header bar */}
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/65 bg-card/84 px-5 py-3 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Trophy className="h-4 w-4 text-primary" />
            {correctCount} đúng
          </div>
          <div className="text-xs text-muted-foreground">
            Câu {currentIndex + 1}/{TOTAL_QUESTIONS}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-500">
            <Zap className="h-4 w-4" />
            Streak: {streak}
            {streak > 0 && streak % STREAK_BONUS_AT === 0 && (
              <span className="text-xs text-green-500">+{STREAK_BONUS_SECONDS}s!</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex) / TOTAL_QUESTIONS) * 100}%`,
              background: "linear-gradient(90deg,#9b5de5,#ff5d8f)",
            }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.section
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="rounded-[2.4rem] border border-white/65 bg-card/90 p-8 shadow-card"
          >
            {/* Category + Timer */}
            <div className="mb-6 flex items-center justify-between">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{ background: categoryColor }}
              >
                {currentQuestion?.category}
              </span>

              {/* Timer ring */}
              <div className="relative flex h-12 w-12 items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle
                    cx="22" cy="22" r="18" fill="none"
                    stroke={timeLeft <= 3 ? "#ef4444" : categoryColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(2 * Math.PI * 18).toFixed(1)}`}
                    strokeDashoffset={`${(2 * Math.PI * 18 * (1 - timerPct / 100)).toFixed(1)}`}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <span
                  className={`relative text-sm font-bold ${timeLeft <= 3 ? "text-red-500" : "text-foreground"}`}
                >
                  {timeLeft}
                </span>
              </div>
            </div>

            {/* Statement */}
            <h2 className="font-heading text-xl font-bold leading-snug md:text-2xl">
              {currentQuestion?.statement}
            </h2>

            {/* Answer buttons */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                id="myth-answer-true"
                disabled={showFeedback}
                onClick={() => handleAnswer("true")}
                className={`flex flex-col items-center justify-center gap-2 rounded-[1.6rem] border-2 py-6 font-bold transition-all hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${
                  showFeedback && lastAnswer
                    ? currentQuestion?.isTrue
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-red-300 bg-red-50 text-red-500"
                    : "border-green-200 bg-green-50/80 text-green-700 hover:border-green-400 hover:bg-green-100"
                }`}
              >
                <CheckCircle2 className="h-8 w-8" />
                <span className="text-lg">✅ Đúng</span>
              </button>

              <button
                id="myth-answer-false"
                disabled={showFeedback}
                onClick={() => handleAnswer("false")}
                className={`flex flex-col items-center justify-center gap-2 rounded-[1.6rem] border-2 py-6 font-bold transition-all hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${
                  showFeedback && lastAnswer
                    ? !currentQuestion?.isTrue
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-red-300 bg-red-50 text-red-500"
                    : "border-red-200 bg-red-50/80 text-red-600 hover:border-red-400 hover:bg-red-100"
                }`}
              >
                <XCircle className="h-8 w-8" />
                <span className="text-lg">❌ Sai</span>
              </button>
            </div>

            {/* Feedback overlay */}
            <AnimatePresence>
              {showFeedback && lastAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 rounded-[1.4rem] p-5 ${
                    lastAnswer.correct
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{lastAnswer.correct ? "✅" : "❌"}</span>
                    <div>
                      <p className="font-bold">
                        {lastAnswer.correct ? "Chính xác!" : "Chưa đúng rồi!"}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed">{lastAnswer.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </AnimatePresence>

        {/* Bottom hint */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Combo {STREAK_BONUS_AT} đúng liên tiếp → thêm {STREAK_BONUS_SECONDS} giây cho câu kế!
        </p>
      </div>
    </div>
  );
}
