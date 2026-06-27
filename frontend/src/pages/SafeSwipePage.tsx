import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RefreshCw, Shield, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_SWIPE_CARDS, type SwipeCard } from "@/data/safeSwipeCards";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-safe-swipe.svg";

type GamePhase = "intro" | "playing" | "result";

interface PlayedCard extends SwipeCard {
  userChoice: "safe" | "unsafe";
  isCorrect: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const CATEGORY_COLORS: Record<string, string> = {
  "Mạng xã hội": "#7209b7",
  "Ngoài đời thực": "#f77f00",
  "Tin nhắn": "#4361ee",
  "Thông tin cá nhân": "#9b5de5",
  "Bạn bè": "#06d6a0",
};

function ScoreBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold">
        <span>{label}</span>
        <span style={{ color }}>{count}/{total}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function SwipeCardUI({ card, onSwipe, isTop }: { card: SwipeCard; onSwipe: (dir: "safe" | "unsafe") => void; isTop: boolean }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const safeOpacity = useTransform(x, [20, 100], [0, 1]);
  const unsafeOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = useCallback(() => {
    const xVal = x.get();
    if (xVal > 80) onSwipe("safe");
    else if (xVal < -80) onSwipe("unsafe");
    else x.set(0);
  }, [x, onSwipe]);

  const catColor = CATEGORY_COLORS[card.category] ?? "#9b5de5";

  return (
    <motion.div
      style={{ x, rotate, zIndex: isTop ? 10 : 5, touchAction: "none" }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: -300, right: 300 }}
      onDragEnd={handleDragEnd}
      animate={isTop ? {} : { scale: 0.95, y: 12 }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      {/* SAFE indicator */}
      <motion.div
        style={{ opacity: safeOpacity }}
        className="pointer-events-none absolute left-4 top-6 z-20 rotate-[-15deg] rounded-xl border-4 border-green-500 px-4 py-2"
      >
        <span className="text-2xl font-black text-green-500">AN TOÀN ✅</span>
      </motion.div>

      {/* UNSAFE indicator */}
      <motion.div
        style={{ opacity: unsafeOpacity }}
        className="pointer-events-none absolute right-4 top-6 z-20 rotate-[15deg] rounded-xl border-4 border-red-500 px-4 py-2"
      >
        <span className="text-2xl font-black text-red-500">NGUY HIỂM ⚠️</span>
      </motion.div>

      <div
        className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-card"
      >
        {/* Top bar */}
        <div className="px-6 pt-6 pb-4">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: catColor }}
          >
            {card.icon} {card.category}
          </span>
        </div>

        {/* Scenario */}
        <div className="flex flex-1 items-center px-8">
          <p className="font-heading text-xl font-bold leading-snug text-foreground md:text-2xl">
            {card.scenario}
          </p>
        </div>

        {/* Hint */}
        <div className="px-6 pb-6 pt-4">
          <p className="text-center text-xs text-muted-foreground">
            ← Kéo trái = Nguy hiểm &nbsp;|&nbsp; Kéo phải = An toàn →
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function SafeSwipePage() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [deck, setDeck] = useState<SwipeCard[]>([]);
  const [played, setPlayed] = useState<PlayedCard[]>([]);
  const [showFeedback, setShowFeedback] = useState<{ card: SwipeCard; isCorrect: boolean } | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback(() => {
    setDeck(shuffle(ALL_SWIPE_CARDS));
    setPlayed([]);
    setShowFeedback(null);
    setPhase("playing");
  }, []);

  const handleSwipe = useCallback(
    (dir: "safe" | "unsafe") => {
      const current = deck[deck.length - 1];
      if (!current) return;

      const correct = current.isSafe === (dir === "safe");
      const playedCard: PlayedCard = { ...current, userChoice: dir, isCorrect: correct };

      setShowFeedback({ card: current, isCorrect: correct });
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
      feedbackTimeout.current = setTimeout(() => {
        setShowFeedback(null);
        const newDeck = deck.slice(0, -1);
        setPlayed((p) => [...p, playedCard]);
        if (newDeck.length === 0) setPhase("result");
        else setDeck(newDeck);
      }, 1800);
    },
    [deck],
  );

  useEffect(() => () => { if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current); }, []);

  const correctCount = useMemo(() => played.filter((p) => p.isCorrect).length, [played]);
  const totalPlayed = played.length;
  const pct = totalPlayed > 0 ? Math.round((correctCount / totalPlayed) * 100) : 0;

  // ── INTRO ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow="🛡️ Mini Game · An toàn mạng"
        title="Ranh Giới An Toàn"
        description="30 tình huống thực tế — vuốt phải nếu an toàn, vuốt trái nếu nguy hiểm. Bạn nhận ra bao nhiêu cạm bẫy?"
        stats={[
          { label: "Số thẻ", value: "30 thẻ" },
          { label: "Chủ đề", value: "5 chủ đề" },
          { label: "Dạng chơi", value: "Vuốt thẻ" },
        ]}
        rules={[
          { text: "Đọc tình huống hiển thị trên thẻ" },
          { text: "Vuốt PHẢI (✅) nếu tình huống AN TOÀN" },
          { text: "Vuốt TRÁI (⚠️) nếu tình huống NGUY HIỂM" },
          { text: "Sau mỗi thẻ có giải thích ngay lập tức" },
        ]}
        startLabel="Bắt đầu ngay!"
        onStart={startGame}
        bgGradient="linear-gradient(135deg,#0d1117 0%,#1a1f2e 50%,#0f1923 100%)"
        accentColor="#9b5de5"
        buttonIcon={<Shield className="h-5 w-5" />}
      />
    );
  }


  // ── RESULT ─────────────────────────────────────────────────────────
  if (phase === "result") {
    const label = pct >= 90 ? { text: "Cực kỳ cảnh giác! Bạn như thám tử thật sự 🕵️", color: "#06d6a0" }
      : pct >= 70 ? { text: "Khá tốt! Thêm chút cẩn thận nữa là hoàn hảo.", color: "#4361ee" }
      : pct >= 50 ? { text: "Cần luyện thêm — một số bẫy đã qua mặt bạn.", color: "#f77f00" }
      : { text: "Hãy ôn lại các tình huống để tự bảo vệ tốt hơn!", color: "#ef4444" };

    return (
      <div className="min-h-screen pb-16 pt-8">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <section className="rounded-[2.4rem] border border-white/70 bg-[linear-gradient(135deg,rgba(240,230,255,0.9)_0%,rgba(246,241,255,0.96)_50%,rgba(220,255,245,0.9)_100%)] p-8 shadow-card text-center md:p-12">
              <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 60 ? "🛡️" : "📚"}</div>
              <h1 className="mt-4 font-heading text-3xl font-bold md:text-4xl" style={{ color: label.color }}>{label.text}</h1>
              <p className="mt-2 text-muted-foreground">Bạn đúng <strong>{correctCount}/{totalPlayed}</strong> thẻ ({pct}%)</p>

              <div
                className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full shadow-card"
                style={{ background: `conic-gradient(${label.color} ${pct}%, #e5e7eb ${pct}%)` }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background">
                  <span className="font-heading text-2xl font-bold" style={{ color: label.color }}>{pct}%</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button id="safe-swipe-replay-btn" className="gradient-primary text-primary-foreground" onClick={startGame}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Chơi lại
                </Button>
                <Button variant="outline" asChild><Link to="/games"><ArrowRight className="mr-2 h-4 w-4" /> Game khác</Link></Button>
              </div>
            </section>

            {/* Review */}
            <section className="mt-8">
              <h2 className="mb-4 font-heading text-2xl font-bold">Xem lại kết quả</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {played.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`rounded-[1.6rem] border p-5 ${p.isCorrect ? "border-green-200/70 bg-green-50/80" : "border-red-200/70 bg-red-50/80"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${p.isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                        {p.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Thẻ {idx + 1}</span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: CATEGORY_COLORS[p.category] ?? "#9b5de5" }}>
                            {p.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Đáp án: <strong>{p.isSafe ? "✅ An toàn" : "⚠️ Nguy hiểm"}</strong>
                          </span>
                        </div>
                        <p className="mt-1 font-semibold text-sm">{p.scenario}</p>
                        <p className="mt-1 text-xs text-foreground/70">{p.explanation}</p>
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

  // ── PLAYING ────────────────────────────────────────────────────────
  const topTwo = deck.slice(-2);
  const progress = ((ALL_SWIPE_CARDS.length - deck.length) / ALL_SWIPE_CARDS.length) * 100;

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between rounded-[1.6rem] border border-white/65 bg-card/84 px-5 py-3 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Trophy className="h-4 w-4 text-primary" />
            {correctCount} đúng
          </div>
          <span className="text-xs text-muted-foreground">Còn {deck.length} thẻ</span>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="font-semibold">{totalPlayed}</span>
            <span className="text-xs text-muted-foreground">đã qua</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#9b5de5,#06d6a0)" }} />
        </div>

        {/* Card stack */}
        <div className="relative h-[380px]">
          {topTwo.map((card, i) => (
            <SwipeCardUI key={card.id} card={card} onSwipe={handleSwipe} isTop={i === topTwo.length - 1} />
          ))}
          {topTwo.length === 0 && (
            <div className="flex h-full items-center justify-center rounded-[2rem] border border-dashed border-muted-foreground/30 text-muted-foreground">
              Đang xử lý...
            </div>
          )}
        </div>

        {/* Feedback overlay */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 rounded-[1.4rem] p-5 ${showFeedback.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{showFeedback.isCorrect ? "✅" : "⚠️"}</span>
                <div>
                  <p className="font-bold">{showFeedback.isCorrect ? "Chính xác!" : "Chưa đúng!"}</p>
                  <p className="mt-1 text-sm leading-relaxed">{showFeedback.card.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            id="swipe-unsafe-btn"
            onClick={() => handleSwipe("unsafe")}
            disabled={!!showFeedback}
            className="flex items-center justify-center gap-3 rounded-[1.6rem] border-2 border-red-200 bg-red-50/80 py-5 font-bold text-red-600 transition-all hover:-translate-y-1 hover:border-red-400 hover:shadow-lg disabled:opacity-60"
          >
            <ArrowLeft className="h-6 w-6" />
            <div>
              <div className="text-lg">⚠️ Nguy hiểm</div>
              <div className="text-xs font-normal opacity-70">Kéo trái</div>
            </div>
          </button>
          <button
            id="swipe-safe-btn"
            onClick={() => handleSwipe("safe")}
            disabled={!!showFeedback}
            className="flex items-center justify-center gap-3 rounded-[1.6rem] border-2 border-green-200 bg-green-50/80 py-5 font-bold text-green-700 transition-all hover:-translate-y-1 hover:border-green-400 hover:shadow-lg disabled:opacity-60"
          >
            <div>
              <div className="text-lg">✅ An toàn</div>
              <div className="text-xs font-normal opacity-70">Kéo phải</div>
            </div>
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
