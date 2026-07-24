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
        className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-indigo-500/30 bg-slate-900/95 backdrop-blur-2xl shadow-2xl text-white"
      >
        {/* Top bar */}
        <div className="px-6 pt-6 pb-4">
          <span
            className="inline-block rounded-full px-3.5 py-1 text-xs font-black text-slate-950"
            style={{ background: catColor }}
          >
            {card.icon} {card.category}
          </span>
        </div>

        {/* Scenario */}
        <div className="flex flex-1 items-center px-8">
          <p className="font-heading text-xl font-extrabold leading-relaxed text-white md:text-2xl">
            {card.scenario}
          </p>
        </div>

        {/* Hint */}
        <div className="px-6 pb-6 pt-4">
          <p className="text-center text-xs font-bold text-slate-400">
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
        bgGradient="linear-gradient(160deg, #1f071a 0%, #380c2e 45%, #1f1254 100%)"
        accentColor="#ec4899"
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
              <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 60 ? "🛡️" : "📚"}</div>
              <h1 className="mt-4 font-heading text-3xl font-extrabold md:text-4xl text-white" style={{ color: label.color }}>{label.text}</h1>
              <p className="mt-2 text-indigo-100/80">Bạn đúng <strong className="text-cyan-300">{correctCount}/{totalPlayed}</strong> thẻ ({pct}%)</p>

              <div
                className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full shadow-2xl"
                style={{ background: `conic-gradient(${label.color} ${pct}%, #1e1b4b ${pct}%)` }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950">
                  <span className="font-heading text-2xl font-black" style={{ color: label.color }}>{pct}%</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button id="safe-swipe-replay-btn" className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-black hover:brightness-110 shadow-lg shadow-cyan-500/20" onClick={startGame}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Chơi lại
                </Button>
                <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" asChild><Link to="/games"><ArrowRight className="mr-2 h-4 w-4" /> Game khác</Link></Button>
              </div>
            </section>

            {/* Review */}
            <section className="mt-8">
              <h2 className="mb-4 font-heading text-2xl font-extrabold text-white">Xem lại kết quả</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {played.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`rounded-[1.6rem] border p-5 backdrop-blur-xl ${p.isCorrect ? "border-emerald-500/40 bg-emerald-950/40 text-slate-100" : "border-rose-500/40 bg-rose-950/40 text-slate-100"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${p.isCorrect ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-slate-950"}`}>
                        {p.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">Thẻ {idx + 1}</span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-black text-slate-950" style={{ background: CATEGORY_COLORS[p.category] ?? "#9b5de5" }}>
                            {p.category}
                          </span>
                          <span className="text-xs text-indigo-200">
                            Đáp án: <strong>{p.isSafe ? "✅ An toàn" : "⚠️ Nguy hiểm"}</strong>
                          </span>
                        </div>
                        <p className="mt-1 font-bold text-sm text-white">{p.scenario}</p>
                        <p className="mt-1 text-xs text-indigo-100/80">{p.explanation}</p>
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
    <div className="game-page min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between rounded-[1.6rem] border border-indigo-400/30 bg-slate-900/70 backdrop-blur-xl px-5 py-3 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-extrabold text-cyan-300">
            <Trophy className="h-4 w-4 text-amber-400" />
            {correctCount} đúng
          </div>
          <span className="text-xs font-extrabold text-indigo-200">Còn {deck.length} thẻ</span>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="font-extrabold text-white">{totalPlayed}</span>
            <span className="text-xs text-indigo-200">đã qua</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-indigo-950 border border-indigo-500/30">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#06b6d4,#10b981)" }} />
        </div>

        {/* Card stack */}
        <div className="relative h-[380px]">
          {topTwo.map((card, i) => (
            <SwipeCardUI key={card.id} card={card} onSwipe={handleSwipe} isTop={i === topTwo.length - 1} />
          ))}
          {topTwo.length === 0 && (
            <div className="flex h-full items-center justify-center rounded-[2rem] border border-dashed border-indigo-400/30 text-indigo-200">
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
              className={`mt-4 rounded-[1.4rem] p-5 border backdrop-blur-xl ${showFeedback.isCorrect ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-200" : "border-rose-500/40 bg-rose-950/80 text-rose-200"}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{showFeedback.isCorrect ? "✅" : "⚠️"}</span>
                <div>
                  <p className="font-extrabold text-white">{showFeedback.isCorrect ? "Chính xác!" : "Chưa đúng!"}</p>
                  <p className="mt-1 text-sm leading-relaxed text-indigo-100/90">{showFeedback.card.explanation}</p>
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
            className="flex items-center justify-center gap-3 rounded-[1.6rem] border-2 border-rose-500/40 bg-rose-950/50 py-5 font-extrabold text-rose-300 transition-all hover:-translate-y-1 hover:border-rose-400 hover:bg-rose-900/60 hover:shadow-lg disabled:opacity-60"
          >
            <ArrowLeft className="h-6 w-6" />
            <div>
              <div className="text-lg">⚠️ Nguy hiểm</div>
              <div className="text-xs font-bold opacity-70">Kéo trái</div>
            </div>
          </button>
          <button
            id="swipe-safe-btn"
            onClick={() => handleSwipe("safe")}
            disabled={!!showFeedback}
            className="flex items-center justify-center gap-3 rounded-[1.6rem] border-2 border-emerald-500/40 bg-emerald-950/50 py-5 font-extrabold text-emerald-300 transition-all hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-900/60 hover:shadow-lg disabled:opacity-60"
          >
            <div>
              <div className="text-lg">✅ An toàn</div>
              <div className="text-xs font-bold opacity-70">Kéo phải</div>
            </div>
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
