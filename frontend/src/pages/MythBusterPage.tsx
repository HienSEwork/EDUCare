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
        bgGradient="linear-gradient(160deg, #071e16 0%, #0c382b 45%, #0f1254 100%)"
        accentColor="#10b981"
        buttonIcon={<Zap className="h-5 w-5" />}
      />
    );
  }

  // ─── RESULT ──────────────────────────────────────────────────────────────
  if (phase === "result") {
    const scoreInfo = getScoreLabel(correctCount, TOTAL_QUESTIONS);
    const pct = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

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

        <div className="container mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <section className="rounded-[2.4rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl text-center md:p-12">
              <div className="text-5xl">{scoreInfo.emoji}</div>
              <h1 className="mt-4 font-heading text-3xl font-extrabold text-white md:text-4xl">{scoreInfo.label}</h1>
              <p className="mt-2 text-indigo-100/80">
                Bạn trả lời đúng <strong className="text-cyan-300">{correctCount}/{TOTAL_QUESTIONS}</strong> câu ({pct}%)
              </p>

              {/* Progress ring */}
              <div className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full shadow-2xl"
                style={{ background: `conic-gradient(${scoreInfo.color} ${pct}%, #1e1b4b ${pct}%)` }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950">
                  <span className="font-heading text-2xl font-black" style={{ color: scoreInfo.color }}>
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  id="myth-buster-replay-btn"
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-black hover:brightness-110 shadow-lg shadow-cyan-500/20"
                  onClick={startGame}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Chơi lại
                </Button>
                <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" asChild>
                  <Link to="/games">
                    <ArrowRight className="mr-2 h-4 w-4" /> Chơi game khác
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" asChild>
                  <Link to="/courses">
                    <BookOpen className="mr-2 h-4 w-4" /> Xem bài học
                  </Link>
                </Button>
              </div>
            </section>

            {/* Review section */}
            <section className="mt-8">
              <h2 className="mb-4 font-heading text-2xl font-extrabold text-white">Xem lại kết quả</h2>
              <div className="grid gap-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`rounded-[1.6rem] border p-5 backdrop-blur-xl ${
                      q.isCorrect
                        ? "border-emerald-500/40 bg-emerald-950/40 text-slate-100"
                        : "border-rose-500/40 bg-rose-950/40 text-slate-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                          q.isCorrect ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-slate-950"
                        }`}
                      >
                        {q.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">Câu {idx + 1}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-black text-slate-950"
                            style={{ background: CATEGORY_COLORS[q.category] ?? "#9b5de5" }}
                          >
                            {q.category}
                          </span>
                          <span className="text-xs text-indigo-200">
                            Đáp án: <strong>{q.isTrue ? "✅ Đúng" : "❌ Sai"}</strong>
                          </span>
                        </div>
                        <p className="mt-1 font-bold text-white">{q.statement}</p>
                        <p className="mt-1 text-sm text-indigo-100/80">{q.explanation}</p>
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
    <div className="game-page min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-3xl px-4">

        {/* Header bar */}
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[1.6rem] border border-indigo-400/30 bg-slate-900/70 backdrop-blur-xl px-5 py-3 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-extrabold text-cyan-300">
            <Trophy className="h-4 w-4 text-amber-400" />
            {correctCount} đúng
          </div>
          <div className="text-xs font-extrabold text-indigo-200">
            Câu {currentIndex + 1}/{TOTAL_QUESTIONS}
          </div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-amber-300">
            <Zap className="h-4 w-4" />
            Streak: {streak}
            {streak > 0 && streak % STREAK_BONUS_AT === 0 && (
              <span className="text-xs text-emerald-400">+{STREAK_BONUS_SECONDS}s!</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-indigo-950 border border-indigo-500/30">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex) / TOTAL_QUESTIONS) * 100}%`,
              background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",
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
            className="rounded-[2.4rem] border border-indigo-500/30 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl"
          >
            {/* Category + Timer */}
            <div className="mb-6 flex items-center justify-between">
              <span
                className="rounded-full px-3.5 py-1 text-xs font-black text-slate-950"
                style={{ background: categoryColor }}
              >
                {currentQuestion?.category}
              </span>

              {/* Timer ring */}
              <div className="relative flex h-12 w-12 items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#1e1b4b" strokeWidth="4" />
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
                  className={`relative text-sm font-black ${timeLeft <= 3 ? "text-rose-400" : "text-white"}`}
                >
                  {timeLeft}
                </span>
              </div>
            </div>

            {/* Statement */}
            <h2 className="font-heading text-xl font-extrabold leading-snug text-white md:text-2xl">
              {currentQuestion?.statement}
            </h2>

            {/* Answer buttons */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                id="myth-answer-true"
                disabled={showFeedback}
                onClick={() => handleAnswer("true")}
                className={`flex flex-col items-center justify-center gap-2 rounded-[1.6rem] border-2 py-6 font-extrabold transition-all hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${
                  showFeedback && lastAnswer
                    ? currentQuestion?.isTrue
                      ? "border-emerald-400 bg-emerald-950/80 text-emerald-300"
                      : "border-rose-400 bg-rose-950/80 text-rose-300"
                    : "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-900/60"
                }`}
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <span className="text-lg">✅ Đúng</span>
              </button>

              <button
                id="myth-answer-false"
                disabled={showFeedback}
                onClick={() => handleAnswer("false")}
                className={`flex flex-col items-center justify-center gap-2 rounded-[1.6rem] border-2 py-6 font-extrabold transition-all hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${
                  showFeedback && lastAnswer
                    ? !currentQuestion?.isTrue
                      ? "border-emerald-400 bg-emerald-950/80 text-emerald-300"
                      : "border-rose-400 bg-rose-950/80 text-rose-300"
                    : "border-rose-500/40 bg-rose-950/40 text-rose-300 hover:border-rose-400 hover:bg-rose-900/60"
                }`}
              >
                <XCircle className="h-8 w-8 text-rose-400" />
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
                  className={`mt-6 rounded-[1.4rem] p-5 border backdrop-blur-xl ${
                    lastAnswer.correct
                      ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-200"
                      : "border-rose-500/40 bg-rose-950/80 text-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{lastAnswer.correct ? "✅" : "❌"}</span>
                    <div>
                      <p className="font-extrabold text-white">
                        {lastAnswer.correct ? "Chính xác!" : "Chưa đúng rồi!"}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-indigo-100/90">{lastAnswer.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </AnimatePresence>

        {/* Bottom hint */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Combo {STREAK_BONUS_AT} đúng liên tiếp → thêm {STREAK_BONUS_SECONDS} giây cho câu kế!
        </p>
      </div>
    </div>
  );
}
