import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RefreshCw, ArrowRight, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_EMOTION_CARDS, type EmotionCard } from "@/data/emotionCards";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-emotion-sort.svg";

type GamePhase = "intro" | "playing" | "result";

interface PlayedEmotion extends EmotionCard {
  placedCorrectly: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const TOTAL_CARDS = 20; // show 10 healthy + 10 unhealthy

function pointInRect(el: HTMLElement | null, x: number, y: number): boolean {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

function EmotionBubble({
  card,
  onDrop,
  isPlayed,
  onDragMove,
  onDragStop,
}: {
  card: EmotionCard;
  onDrop: (card: EmotionCard, zone: "healthy" | "unhealthy") => void;
  isPlayed: boolean;
  onDragMove: (x: number, y: number) => void;
  onDragStop: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const getPointerXY = (event: MouseEvent | TouchEvent | PointerEvent): { x: number; y: number } => {
    if (event instanceof TouchEvent && event.changedTouches.length > 0) {
      return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }
    return { x: (event as PointerEvent).clientX, y: (event as PointerEvent).clientY };
  };

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent) => {
      setIsDragging(false);
      onDragStop();
      const { x, y } = getPointerXY(event);
      if (pointInRect(document.getElementById("healthy-zone"), x, y)) {
        onDrop(card, "healthy");
      } else if (pointInRect(document.getElementById("unhealthy-zone"), x, y)) {
        onDrop(card, "unhealthy");
      }
    },
    [card, onDrop, onDragStop],
  );

  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {
      onDragMove(info.point.x, info.point.y);
    },
    [onDragMove],
  );

  if (isPlayed) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => setIsDragging(true)}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.15, zIndex: 50, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}
      animate={isDragging ? {} : { y: [0, -6, 0] }}
      transition={
        isDragging
          ? {}
          : { duration: 2 + (card.id % 3) * 0.5, repeat: Infinity, ease: "easeInOut", delay: (card.id % 5) * 0.3 }
      }
      className="relative flex cursor-grab flex-col items-center gap-1 rounded-[1.4rem] border-2 bg-slate-900/90 border-indigo-400/30 text-white px-3.5 py-3 shadow-xl backdrop-blur-md select-none active:cursor-grabbing hover:border-cyan-400"
      style={{ width: 110, touchAction: "none" }}
    >
      <span className="text-2xl">{card.emoji}</span>
      <span className="text-center text-xs font-extrabold leading-tight text-white">{card.label}</span>
    </motion.div>
  );
}

function DropZone({
  id,
  label,
  emoji,
  color,
  bg,
  count,
  isOver,
}: {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  count: number;
  isOver: boolean;
}) {
  return (
    <div
      id={id}
      className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-[1.8rem] border-4 border-dashed p-4 transition-all duration-150"
      style={{
        borderColor: isOver ? color : color + "55",
        background: isOver ? bg + "ee" : bg + "44",
        transform: isOver ? "scale(1.04)" : "scale(1)",
        boxShadow: isOver ? `0 0 0 4px ${color}33` : "none",
      }}
    >
      <span className={`text-4xl transition-transform duration-150 ${isOver ? "scale-125" : ""}`}>{emoji}</span>
      <p className="font-bold text-sm" style={{ color }}>{label}</p>
      <span className="text-2xl font-black" style={{ color }}>{count}</span>
    </div>
  );
}

export default function EmotionSortPage() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [deck, setDeck] = useState<EmotionCard[]>([]);
  const [played, setPlayed] = useState<PlayedEmotion[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; card: EmotionCard } | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [healthyCount, setHealthyCount] = useState(0);
  const [unhealthyCount, setUnhealthyCount] = useState(0);
  const [activeZone, setActiveZone] = useState<"healthy" | "unhealthy" | null>(null);

  const handleDragMove = useCallback((x: number, y: number) => {
    if (pointInRect(document.getElementById("healthy-zone"), x, y)) setActiveZone("healthy");
    else if (pointInRect(document.getElementById("unhealthy-zone"), x, y)) setActiveZone("unhealthy");
    else setActiveZone(null);
  }, []);

  const handleDragStop = useCallback(() => setActiveZone(null), []);

  const startGame = useCallback(() => {
    const healthy = shuffle(ALL_EMOTION_CARDS.filter((c) => c.isHealthy)).slice(0, TOTAL_CARDS / 2);
    const unhealthy = shuffle(ALL_EMOTION_CARDS.filter((c) => !c.isHealthy)).slice(0, TOTAL_CARDS / 2);
    setDeck(shuffle([...healthy, ...unhealthy]));
    setPlayed([]);
    setHealthyCount(0);
    setUnhealthyCount(0);
    setLastFeedback(null);
    setPhase("playing");
  }, []);

  const handleDrop = useCallback(
    (card: EmotionCard, zone: "healthy" | "unhealthy") => {
      const correct = card.isHealthy === (zone === "healthy");
      setPlayed((prev) => [...prev, { ...card, placedCorrectly: correct }]);
      setDeck((prev) => prev.filter((c) => c.id !== card.id));

      if (zone === "healthy") setHealthyCount((n) => n + 1);
      else setUnhealthyCount((n) => n + 1);

      setLastFeedback({ correct, card });
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
      feedbackTimeout.current = setTimeout(() => {
        setLastFeedback(null);
        if (played.length + 1 >= TOTAL_CARDS) setPhase("result");
      }, 1800);
    },
    [played.length],
  );

  useEffect(() => {
    return () => { if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current); };
  }, []);

  const playedIds = new Set(played.map((p) => p.id));
  const correctCount = played.filter((p) => p.placedCorrectly).length;
  const pct = played.length > 0 ? Math.round((correctCount / played.length) * 100) : 0;

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow="💚 Mini Game · Kéo thả"
        title="Dọn Rác Cảm Xúc"
        description="Kéo và thả từng hành vi/cảm xúc vào đúng rổ. Phân loại lành mạnh hay độc hại — bạn nhận ra được bao nhiêu?"
        stats={[
          { label: "Số thẻ", value: "20 thẻ" },
          { label: "Dạng chơi", value: "Kéo & thả" },
          { label: "Chủ đề", value: "Cảm xúc & hành vi" },
        ]}
        rules={[
          { text: "Kéo thẻ bong bóng vào đúng rổ bên trên" },
          { text: "Rổ 💚 = hành vi/cảm xúc LÀNH MẠNH" },
          { text: "Rổ ❌ = hành vi/cảm xúc ĐỘC HẠI" },
          { text: "Sau mỗi thẻ có phản hồi và giải thích" },
        ]}
        startLabel="Bắt đầu dọn dẹp!"
        onStart={startGame}
        bgGradient="linear-gradient(160deg, #052418 0%, #0c382b 45%, #1f1254 100%)"
        accentColor="#10b981"
        buttonIcon={<Heart className="h-5 w-5" />}
      />
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────
  if (phase === "result") {
    const label = pct >= 85 ? { text: "Bậc thầy cảm xúc! Tuyệt vời! 🌟", color: "#06d6a0" }
      : pct >= 70 ? { text: "Rất tốt! Cảm xúc của bạn khá cân bằng.", color: "#4361ee" }
      : pct >= 50 ? { text: "Ổn đấy! Hãy tìm hiểu thêm về cảm xúc lành mạnh.", color: "#f77f00" }
      : { text: "Cần học thêm về nhận diện cảm xúc nhé!", color: "#ef4444" };

    return (
      <div className="min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
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
              <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 60 ? "💙" : "📚"}</div>
              <h1 className="mt-4 font-heading text-3xl font-extrabold md:text-4xl text-white" style={{ color: label.color }}>{label.text}</h1>
              <p className="mt-2 text-indigo-100/80">Đúng <strong className="text-cyan-300">{correctCount}/{played.length}</strong> thẻ ({pct}%)</p>
              <div
                className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full shadow-2xl"
                style={{ background: `conic-gradient(${label.color} ${pct}%, #1e1b4b ${pct}%)` }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950">
                  <span className="font-heading text-2xl font-black" style={{ color: label.color }}>{pct}%</span>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button id="emotion-sort-replay-btn" className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-black hover:brightness-110 shadow-lg shadow-cyan-500/20" onClick={startGame}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Chơi lại
                </Button>
                <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" asChild><Link to="/games"><ArrowRight className="mr-2 h-4 w-4" /> Game khác</Link></Button>
              </div>
            </section>

            {/* Review */}
            <section className="mt-8">
              <h2 className="mb-4 font-heading text-2xl font-extrabold text-white">Xem lại kết quả</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {played.map((p) => (
                  <div
                    key={p.id}
                    className={`rounded-[1.6rem] border p-4 backdrop-blur-xl ${p.placedCorrectly ? "border-emerald-500/40 bg-emerald-950/40 text-slate-100" : "border-rose-500/40 bg-rose-950/40 text-slate-100"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${p.placedCorrectly ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-slate-950"}`}>
                        {p.placedCorrectly ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </span>
                      <div>
                        <p className="font-extrabold text-sm text-white">{p.emoji} {p.label}</p>
                        <p className="mt-0.5 text-xs text-indigo-200">
                          → {p.isHealthy ? "💚 Lành mạnh" : "❌ Độc hại"}
                        </p>
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

  // ── PLAYING ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between rounded-[1.6rem] border border-indigo-400/30 bg-slate-900/70 backdrop-blur-xl px-5 py-3 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-extrabold text-cyan-300">
            <Trophy className="h-4 w-4 text-amber-400" /> {correctCount} đúng
          </div>
          <span className="text-xs font-extrabold text-indigo-200">Còn {deck.length} thẻ</span>
          <span className="text-sm font-extrabold text-white">{played.length}/{TOTAL_CARDS}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-indigo-950 border border-indigo-500/30">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(played.length / TOTAL_CARDS) * 100}%`, background: "linear-gradient(90deg,#06d6a0,#3b82f6)" }} />
        </div>

        {/* Drop zones */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <DropZone id="healthy-zone" label="Lành mạnh" emoji="💚" color="#10b981" bg="#064e3b" count={healthyCount} isOver={activeZone === "healthy"} />
          <DropZone id="unhealthy-zone" label="Độc hại" emoji="❌" color="#f43f5e" bg="#881337" count={unhealthyCount} isOver={activeZone === "unhealthy"} />
        </div>

        {/* Cards area */}
        <div className="relative min-h-[240px] rounded-[1.8rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-4 shadow-2xl">
          <p className="mb-3 text-center text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Kéo thẻ vào rổ bên trên 👆
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {deck.map((card) => (
              <EmotionBubble
                key={card.id}
                card={card}
                onDrop={handleDrop}
                isPlayed={playedIds.has(card.id)}
                onDragMove={handleDragMove}
                onDragStop={handleDragStop}
              />
            ))}
            {deck.length === 0 && !lastFeedback && (
              <div className="flex flex-col items-center py-8 text-indigo-200">
                <span className="text-4xl">🎉</span>
                <p className="mt-2 font-extrabold text-white">Xong hết rồi!</p>
              </div>
            )}
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {lastFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 rounded-[1.4rem] border backdrop-blur-xl p-4 ${lastFeedback.correct ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-200" : "border-rose-500/40 bg-rose-950/80 text-rose-200"}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{lastFeedback.correct ? "✅" : "❌"}</span>
                <div>
                  <p className="font-extrabold text-white">{lastFeedback.correct ? "Chính xác!" : "Chưa đúng!"} — {lastFeedback.card.emoji} {lastFeedback.card.label}</p>
                  <p className="mt-1 text-sm text-indigo-100/90">{lastFeedback.card.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
