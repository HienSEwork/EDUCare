import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles, Trophy, Zap, ArrowLeft, Medal, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api/client";
import type { GameLeaderboardResponse, GameScoreSubmitResponse } from "@/types/api";

// ── Difficulty ─────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Dễ", emoji: "🌱", desc: "60s · 10 quả · chậm",
    orbCount: 10, speedMin: 0.55, speedMax: 1.1,
    duration: 60, badRatio: 0.14, bonusRatio: 0.10,
    playerSpeed: 5.0, color: "#22c55e",
  },
  medium: {
    label: "Thường", emoji: "⚡", desc: "45s · 14 quả · chuẩn",
    orbCount: 14, speedMin: 0.9, speedMax: 1.7,
    duration: 45, badRatio: 0.26, bonusRatio: 0.08,
    playerSpeed: 5.5, color: "#a855f7",
  },
  hard: {
    label: "Khó", emoji: "🔥", desc: "35s · 20 quả · nhanh",
    orbCount: 20, speedMin: 1.4, speedMax: 2.6,
    duration: 35, badRatio: 0.36, bonusRatio: 0.06,
    playerSpeed: 6.2, color: "#ef4444",
  },
} as const;

// ── Constants ──────────────────────────────────────────────────────────────
const BOARD_W = 1140;
const BOARD_H = 520;
const PLAYER_R = 22;
const COMBO_THRESHOLD = 3;
const LS_KEY = "educare:flash-light-run:scores";
const LS_CHAR_KEY = "educare:character";

// ── Tiers ──────────────────────────────────────────────────────────────────
const TIERS = [
  { label: "Tập sự",     min: 0,   color: "#64748b", desc: "Cứ thử lại — ánh sáng chờ bạn!" },
  { label: "Bắt nhịp",  min: 50,  color: "#06d6a0", desc: "Bạn đang tìm được nhịp của mình." },
  { label: "Tỏa sáng",  min: 100, color: "#f59e0b", desc: "Sự tự tin đang bùng cháy trong bạn!" },
  { label: "Huyền thoại", min: 175, color: "#d946ef", desc: "Bạn chính là ánh sáng tự tin đó." },
] as const;

// ── Local scores ───────────────────────────────────────────────────────────
interface LocalEntry { score: number; difficulty: string; date: string }
function readLocal(): LocalEntry[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
}
function writeLocal(score: number, diff: string): LocalEntry[] {
  const all = readLocal();
  all.push({ score, difficulty: diff, date: new Date().toLocaleDateString("vi-VN") });
  all.sort((a, b) => b.score - a.score);
  const top = all.slice(0, 10);
  localStorage.setItem(LS_KEY, JSON.stringify(top));
  return top;
}

// ── Orb ───────────────────────────────────────────────────────────────────
type OrbTone = "good" | "bonus" | "bad";
interface OrbState { id: number; x: number; y: number; vx: number; vy: number; tone: OrbTone; value: number; r: number }

function makeOrb(id: number, diff: Difficulty): OrbState {
  const cfg = DIFFICULTY_CONFIG[diff];
  const bonus = Math.random() < cfg.bonusRatio;
  const good = bonus || Math.random() > cfg.badRatio;
  const speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);
  const angle = Math.random() * Math.PI * 2;
  const r = bonus ? 22 : 16;
  return {
    id,
    x: r * 3 + Math.random() * (BOARD_W - r * 6),
    y: r * 3 + Math.random() * (BOARD_H - r * 6),
    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
    tone: bonus ? "bonus" : good ? "good" : "bad",
    value: bonus ? 25 : good ? 10 : -8, r,
  };
}

// ── Character SVGs ─────────────────────────────────────────────────────────
type Char = "boy" | "girl";

function BoyIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="27" r="14" fill="#dbeafe" />
      <ellipse cx="22" cy="16" rx="13" ry="7.5" fill="#2563eb" />
      <rect x="7" y="19" width="30" height="5" rx="2.5" fill="#1d4ed8" />
      <circle cx="22" cy="13" r="1.5" fill="#93c5fd" />
      <rect x="7" y="22" width="14" height="3" rx="1.5" fill="#1d4ed8" />
      <circle cx="17" cy="28" r="2" fill="#1e293b" />
      <circle cx="27" cy="28" r="2" fill="#1e293b" />
      <circle cx="17.7" cy="27.3" r="0.7" fill="white" />
      <circle cx="27.7" cy="27.3" r="0.7" fill="white" />
      <path d="M17 33 Q22 37 27 33" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="13.5" cy="32" r="2.5" fill="#fca5a5" opacity="0.5" />
      <circle cx="30.5" cy="32" r="2.5" fill="#fca5a5" opacity="0.5" />
    </svg>
  );
}

function GirlIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="24" r="16" fill="#fbcfe8" />
      <path d="M36 19 Q44 16 43 28 Q42 34 37 31" fill="#f472b6" />
      <path d="M37 31 Q41 33 40 39" stroke="#db2777" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M8 23 Q10 11 22 11 Q34 11 36 23" fill="#ec4899" />
      <circle cx="22" cy="27" r="13" fill="#fce7f3" />
      <circle cx="17" cy="27" r="2" fill="#1e293b" />
      <circle cx="27" cy="27" r="2" fill="#1e293b" />
      <circle cx="17.7" cy="26.3" r="0.7" fill="white" />
      <circle cx="27.7" cy="26.3" r="0.7" fill="white" />
      <line x1="15" y1="25" x2="14" y2="23" stroke="#1e293b" strokeWidth="0.9" />
      <line x1="17" y1="24.5" x2="17" y2="22.5" stroke="#1e293b" strokeWidth="0.9" />
      <line x1="19" y1="25" x2="19.5" y2="23" stroke="#1e293b" strokeWidth="0.9" />
      <path d="M17 32 Q22 36 27 32" stroke="#db2777" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="13.5" cy="31" r="2.5" fill="#fca5a5" opacity="0.6" />
      <circle cx="30.5" cy="31" r="2.5" fill="#fca5a5" opacity="0.6" />
    </svg>
  );
}

// ── Grid floor ─────────────────────────────────────────────────────────────
function GridFloor() {
  return (
    <svg className="pointer-events-none absolute bottom-0 left-0 w-full" viewBox="0 0 1140 280" preserveAspectRatio="none" style={{ height: 280, opacity: 0.28 }}>
      {Array.from({ length: 16 }, (_, i) => {
        const x = (i / 15) * 1140;
        return <line key={`v${i}`} x1={x} y1={280} x2={570} y2={0} stroke="#9b5de5" strokeWidth="0.9" />;
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const t = (i + 1) / 10;
        const y = 280 * t;
        const hw = 570 * (1 - t);
        return <line key={`h${i}`} x1={570 - hw} y1={y} x2={570 + hw} y2={y} stroke="#9b5de5" strokeWidth="0.55" />;
      })}
    </svg>
  );
}

type Phase = "idle" | "playing" | "ended";
const DIFF_LABELS: Record<string, string> = { easy: "Dễ", medium: "Thường", hard: "Khó" };

// ── Page ───────────────────────────────────────────────────────────────────
export default function FlashLightRunPage() {
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [character, setCharacter] = useState<Char>(() =>
    (localStorage.getItem(LS_CHAR_KEY) as Char) || (user?.gender === "FEMALE" ? "girl" : "boy"),
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG.medium.duration);
  const [combo, setCombo] = useState(0);
  const [orbsDisplay, setOrbsDisplay] = useState<OrbState[]>(() =>
    Array.from({ length: DIFFICULTY_CONFIG.medium.orbCount }, (_, i) => makeOrb(i, "medium")),
  );
  const [playerPos, setPlayerPos] = useState({ x: BOARD_W / 2, y: BOARD_H / 2 });
  const [localScores, setLocalScores] = useState<LocalEntry[]>(() => readLocal());
  const [onlineLeaderboard, setOnlineLeaderboard] = useState<GameLeaderboardResponse | null>(null);
  const [lastRank, setLastRank] = useState<number | null>(null);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const phaseRef = useRef<Phase>("idle");
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const timeRef = useRef(DIFFICULTY_CONFIG.medium.duration);
  const playerRef = useRef({ x: BOARD_W / 2, y: BOARD_H / 2 });
  const mouseTargetRef = useRef({ x: BOARD_W / 2, y: BOARD_H / 2 });
  const orbsRef = useRef<OrbState[]>(orbsDisplay);
  const keysRef = useRef<Record<string, boolean>>({});
  const boardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const lastNowRef = useRef(0);
  const lastSecRef = useRef(0);
  const diffRef = useRef<Difficulty>("medium");

  useEffect(() => { diffRef.current = difficulty; }, [difficulty]);

  // Keyboard
  useEffect(() => {
    const KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];
    const onDown = (e: KeyboardEvent) => { if (KEYS.includes(e.key)) e.preventDefault(); keysRef.current[e.key] = true; };
    const onUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  // Online leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const lb = await apiRequest<GameLeaderboardResponse>("/games/flash-light-run/leaderboard");
      setOnlineLeaderboard(lb);
    } catch { /* offline graceful */ }
  }, []);

  useEffect(() => { void fetchLeaderboard(); }, [fetchLeaderboard]);

  const endGame = useCallback(async (finalScore: number, diff: Difficulty) => {
    const saved = writeLocal(finalScore, diff);
    setLocalScores(saved);
    if (user) {
      setIsSubmitting(true);
      try {
        const res = await apiRequest<GameScoreSubmitResponse>("/games/flash-light-run/score", {
          method: "POST",
          body: JSON.stringify({ score: finalScore, difficulty: diff }),
        });
        setLastRank(res.rank);
        setIsPersonalBest(res.personalBest);
        setOnlineLeaderboard(res.leaderboard);
      } catch { await fetchLeaderboard(); }
      finally { setIsSubmitting(false); }
    } else {
      await fetchLeaderboard();
    }
  }, [user, fetchLeaderboard]);

  const startGame = useCallback((diff?: Difficulty) => {
    cancelAnimationFrame(frameRef.current);
    const d = diff ?? diffRef.current;
    const cfg = DIFFICULTY_CONFIG[d];
    const fresh = Array.from({ length: cfg.orbCount }, (_, i) => makeOrb(i, d));
    scoreRef.current = 0; comboRef.current = 0; timeRef.current = cfg.duration;
    playerRef.current = { x: BOARD_W / 2, y: BOARD_H / 2 };
    mouseTargetRef.current = { x: BOARD_W / 2, y: BOARD_H / 2 };
    orbsRef.current = fresh;
    setScore(0); setCombo(0); setTimeLeft(cfg.duration);
    setPlayerPos({ x: BOARD_W / 2, y: BOARD_H / 2 });
    setOrbsDisplay(fresh);
    setLastRank(null); setIsPersonalBest(false);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;
    const cfg = DIFFICULTY_CONFIG[diffRef.current];
    const now = performance.now();
    lastNowRef.current = now; lastSecRef.current = now;

    const loop = (ts: number) => {
      if (phaseRef.current !== "playing") return;
      const dt = Math.min((ts - lastNowRef.current) / 16.67, 3);
      lastNowRef.current = ts;

      if (ts - lastSecRef.current >= 1000) {
        lastSecRef.current += 1000;
        timeRef.current -= 1;
        setTimeLeft(timeRef.current);
        if (timeRef.current <= 0) {
          phaseRef.current = "ended";
          setPhase("ended");
          void endGame(scoreRef.current, diffRef.current);
          return;
        }
      }

      const k = keysRef.current;
      const kspd = cfg.playerSpeed * dt;

      // Keyboard adjusts mouse target
      let tx = mouseTargetRef.current.x;
      let ty = mouseTargetRef.current.y;
      if (k.ArrowRight || k.d) tx += kspd;
      if (k.ArrowLeft  || k.a) tx -= kspd;
      if (k.ArrowDown  || k.s) ty += kspd;
      if (k.ArrowUp    || k.w) ty -= kspd;
      tx = Math.max(PLAYER_R, Math.min(BOARD_W - PLAYER_R, tx));
      ty = Math.max(PLAYER_R, Math.min(BOARD_H - PLAYER_R, ty));
      mouseTargetRef.current = { x: tx, y: ty };

      // Player chases target
      const { x: px0, y: py0 } = playerRef.current;
      const dx = tx - px0, dy = ty - py0;
      const dist = Math.hypot(dx, dy);
      const maxSpd = cfg.playerSpeed * 1.5 * dt;
      let px = px0, py = py0;
      if (dist > 0.5) {
        const move = Math.min(dist, maxSpd);
        px = px0 + (dx / dist) * move;
        py = py0 + (dy / dist) * move;
      }
      px = Math.max(PLAYER_R, Math.min(BOARD_W - PLAYER_R, px));
      py = Math.max(PLAYER_R, Math.min(BOARD_H - PLAYER_R, py));
      playerRef.current = { x: px, y: py };

      let anyHit = false;
      const nextOrbs = orbsRef.current.map((orb) => {
        let ox = orb.x + orb.vx * dt;
        let oy = orb.y + orb.vy * dt;
        let vx = orb.vx, vy = orb.vy;
        if (ox < orb.r) { ox = orb.r; vx = Math.abs(vx); }
        if (ox > BOARD_W - orb.r) { ox = BOARD_W - orb.r; vx = -Math.abs(vx); }
        if (oy < orb.r) { oy = orb.r; vy = Math.abs(vy); }
        if (oy > BOARD_H - orb.r) { oy = BOARD_H - orb.r; vy = -Math.abs(vy); }
        const d2 = Math.hypot(ox - px, oy - py);
        if (d2 < PLAYER_R + orb.r) {
          const mul = orb.tone !== "bad" && comboRef.current >= COMBO_THRESHOLD ? 2 : 1;
          scoreRef.current = Math.max(0, scoreRef.current + orb.value * mul);
          comboRef.current = orb.tone !== "bad" ? comboRef.current + 1 : 0;
          anyHit = true;
          return makeOrb(orb.id, diffRef.current);
        }
        return { ...orb, x: ox, y: oy, vx, vy };
      });

      orbsRef.current = nextOrbs;
      setPlayerPos({ x: px, y: py });
      setOrbsDisplay([...nextOrbs]);
      if (anyHit) { setScore(scoreRef.current); setCombo(comboRef.current); }

      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase, endGame]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phaseRef.current !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseTargetRef.current = {
      x: Math.max(PLAYER_R, Math.min(BOARD_W - PLAYER_R, (e.clientX - rect.left) * (BOARD_W / rect.width))),
      y: Math.max(PLAYER_R, Math.min(BOARD_H - PLAYER_R, (e.clientY - rect.top) * (BOARD_H / rect.height))),
    };
  };

  const exitGame = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    phaseRef.current = "idle";
    setPhase("idle");
    setScore(0); setCombo(0);
    setTimeLeft(DIFFICULTY_CONFIG[diffRef.current].duration);
  }, []);

  const setCharAndSave = (c: Char) => { setCharacter(c); localStorage.setItem(LS_CHAR_KEY, c); };

  const currentTier = [...TIERS].reverse().find((t) => score >= t.min) ?? TIERS[0];
  const comboActive = combo >= COMBO_THRESHOLD;
  const isPlaying = phase === "playing";
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const bestLocalScore = Math.max(0, ...localScores.map((s) => s.score));

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "linear-gradient(160deg,#0c0820 0%,#1a0533 55%,#0c0820 100%)" }}>

      {/* HUD */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-2" style={{ background: "rgba(12,8,32,0.94)", borderBottom: "1px solid rgba(155,93,229,0.2)" }}>
        <div className="flex items-center gap-3">
          <Link to="/games" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white/45 hover:bg-white/8 hover:text-white/80 transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Games
          </Link>
          <span className="h-3.5 w-px bg-white/12" />
          <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">⚡ Ánh Sáng Tự Tin</span>
          {isPlaying && (
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: `${cfg.color}22`, color: cfg.color }}>
              {cfg.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isPlaying && comboActive && (
              <motion.span key={combo} initial={{ scale: 1.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 rounded-full bg-yellow-400/18 px-3 py-1 text-xs font-black text-yellow-300">
                <Zap className="h-3 w-3" /> COMBO ×2
              </motion.span>
            )}
          </AnimatePresence>
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Điểm <span className="ml-1 font-mono text-base font-black text-fuchsia-300">{score}</span></span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
            Thời gian <span className={`ml-1 font-mono text-base font-black ${timeLeft <= 10 ? "text-red-400" : "text-cyan-300"}`}>{timeLeft}s</span>
          </span>
          {isPlaying && (
            <button onClick={exitGame} className="rounded px-3 py-1.5 text-xs font-semibold text-white/28 hover:bg-white/8 hover:text-white/65 transition-all">✕ Thoát</button>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="flex flex-1 flex-col items-center px-4 pt-3">
        <div style={{ width: "100%", maxWidth: BOARD_W }}>
          <div
            ref={boardRef}
            className="relative overflow-hidden"
            style={{ width: "100%", height: BOARD_H, borderRadius: 0, background: "radial-gradient(ellipse at 50% 20%,#2e0d55 0%,#130929 55%,#080318 100%)", cursor: isPlaying ? "none" : "default" }}
            onMouseMove={handleMouseMove}
          >
            <GridFloor />

            {/* Stars */}
            {[18,72,155,290,465,635,815,980,1095,195,375,720,1040,58,910,255,520,785,330,660].map((cx, i) => (
              <div key={i} className="pointer-events-none absolute rounded-full bg-white" style={{ width: i % 4 === 0 ? 2.5 : 1.5, height: i % 4 === 0 ? 2.5 : 1.5, left: cx, top: 10 + ((i * 29) % 230), opacity: 0.12 + (i % 5) * 0.07 }} />
            ))}

            {/* Orbs */}
            {phase !== "idle" && orbsDisplay.map((orb) => (
              <div
                key={orb.id}
                className={`absolute flex items-center justify-center rounded-full ${
                  orb.tone === "bonus" ? "bg-yellow-300 shadow-[0_0_22px_8px_rgba(250,204,21,0.75)]"
                  : orb.tone === "good" ? "bg-yellow-400/90 shadow-[0_0_14px_4px_rgba(250,204,21,0.5)]"
                  : "bg-slate-500/70 shadow-[0_0_10px_2px_rgba(148,163,184,0.22)]"
                }`}
                style={{ left: orb.x, top: orb.y, width: orb.r * 2, height: orb.r * 2, transform: "translate(-50%,-50%)" }}
              >
                {orb.tone !== "bad" ? <Sparkles className={orb.tone === "bonus" ? "h-5 w-5 text-yellow-900" : "h-3.5 w-3.5 text-yellow-900"} /> : <span className="text-xs font-black text-slate-200">✕</span>}
              </div>
            ))}

            {/* Player */}
            {phase !== "idle" && (
              <div className="absolute flex items-center justify-center" style={{ left: playerPos.x, top: playerPos.y, width: PLAYER_R * 2, height: PLAYER_R * 2, transform: "translate(-50%,-50%)", filter: "drop-shadow(0 0 14px rgba(217,70,239,0.7))", zIndex: 5 }}>
                {character === "girl" ? <GirlIcon size={PLAYER_R * 2} /> : <BoyIcon size={PLAYER_R * 2} />}
              </div>
            )}

            {/* ── IDLE overlay ──────────────────────────────────────── */}
            {phase === "idle" && (
              <div className="absolute inset-0 flex" style={{ background: "rgba(6,2,16,0.96)" }}>
                {/* Left */}
                <div className="flex flex-1 flex-col justify-center overflow-y-auto px-9 py-5">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-fuchsia-400">⚡ Arcade · Tâm lý học tuổi teen</p>
                  <h2 className="mb-2 font-heading text-3xl font-black text-white leading-tight">Ánh Sáng Tự Tin</h2>
                  <p className="mb-4 text-sm leading-6 text-white/60 max-w-[480px]">
                    Trong thế giới nội tâm của mình, mỗi ánh sáng vàng là một khoảnh khắc tự tin —
                    khi bạn tin vào bản thân, dám thử, dám bước. Thu thập chúng và vượt qua
                    những đám mây nghi ngờ đang cản đường bạn tỏa sáng.
                  </p>

                  {/* Instructions */}
                  <div className="mb-4 grid grid-cols-2 gap-1.5">
                    {[
                      { n: 1, text: "Di chuột hoặc WASD / ↑↓←→ để di chuyển" },
                      { n: 2, text: "Quả vàng ✨ +10đ · Quả lớn ⭐ +25đ" },
                      { n: 3, text: "Quả xám ✕ mất 8 điểm — hãy né!" },
                      { n: 4, text: "Combo 3+ liên tiếp → ×2 điểm ⚡" },
                      { n: 5, text: "Các quả di chuyển & nảy tường liên tục" },
                      { n: 6, text: "Hết giờ — điểm cao nhất được lưu!" },
                    ].map((s) => (
                      <div key={s.n} className="flex items-start gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(155,93,229,0.08)", border: "1px solid rgba(155,93,229,0.15)" }}>
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/30 text-[10px] font-black text-fuchsia-200">{s.n}</span>
                        <span className="text-[13px] font-medium leading-5 text-white/88">{s.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Settings row */}
                  <div className="mb-4 flex flex-wrap gap-4">
                    {/* Difficulty */}
                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Độ khó</p>
                      <div className="flex gap-1.5">
                        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                          const c = DIFFICULTY_CONFIG[d];
                          return (
                            <button key={d} onClick={() => setDifficulty(d)} className="rounded-lg px-3 py-2 text-xs font-bold transition-all" style={{ background: difficulty === d ? `${c.color}22` : "rgba(255,255,255,0.04)", border: `1px solid ${difficulty === d ? c.color + "55" : "rgba(255,255,255,0.08)"}`, color: difficulty === d ? c.color : "#ffffff50" }}>
                              {c.emoji} {c.label}
                              <span className="block text-[10px] font-normal opacity-55">{c.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Character */}
                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Nhân vật</p>
                      <div className="flex gap-1.5">
                        {([{ c: "boy" as Char, label: "Bé trai", color: "#3b82f6" }, { c: "girl" as Char, label: "Bé gái", color: "#ec4899" }]).map(({ c, label, color }) => (
                          <button key={c} onClick={() => setCharAndSave(c)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all" style={{ background: character === c ? `${color}18` : "rgba(255,255,255,0.04)", border: `1px solid ${character === c ? color + "44" : "rgba(255,255,255,0.08)"}`, color: character === c ? color : "#ffffff44" }}>
                            {c === "boy" ? <BoyIcon size={28} /> : <GirlIcon size={28} />}
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button onClick={() => startGame(difficulty)} className="w-fit rounded-full px-10 py-3.5 text-base font-black text-white transition-all hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg,#9b5de5,#d946ef)", boxShadow: "0 0 28px rgba(217,70,239,0.4)" }}>
                    ⚡ Bắt đầu chơi!
                  </button>
                </div>

                {/* Right: leaderboard */}
                <div className="flex w-64 flex-col py-5 pr-5" style={{ borderLeft: "1px solid rgba(155,93,229,0.14)" }}>
                  <div className="flex items-center gap-2 mb-3 pl-4">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-yellow-400">Top điểm</span>
                  </div>
                  <div className="space-y-1.5 pl-4 overflow-y-auto">
                    {(onlineLeaderboard?.top ?? []).length > 0
                      ? onlineLeaderboard!.top.slice(0, 8).map((e, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: e.isMe ? "rgba(217,70,239,0.12)" : "rgba(255,255,255,0.04)" }}>
                            <span className="w-5 text-center text-sm">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                            <span className="flex-1 truncate text-xs font-semibold text-white/80">{e.playerName}</span>
                            <span className="font-mono text-xs font-black text-fuchsia-300">{e.score}</span>
                          </div>
                        ))
                      : localScores.slice(0, 8).map((s, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg bg-white/4 px-2.5 py-1.5">
                            <span className="w-5 text-center text-sm">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                            <span className="flex-1 truncate text-xs text-white/65">Bạn</span>
                            <span className="font-mono text-xs font-black text-fuchsia-300">{s.score}</span>
                          </div>
                        ))
                    }
                    {(onlineLeaderboard?.top ?? []).length === 0 && localScores.length === 0 && (
                      <p className="text-xs text-white/25">Chưa có kết quả nào.</p>
                    )}
                  </div>
                  <div className="mt-auto pl-4 pt-4">
                    <p className="text-[10px] text-white/20 leading-5">
                      Kỷ lục của bạn: <span className="font-bold text-white/40">{bestLocalScore} điểm</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── ENDED overlay ─────────────────────────────────────── */}
            {phase === "ended" && (
              <div className="absolute inset-0 flex" style={{ background: "rgba(6,2,16,0.9)", backdropFilter: "blur(6px)" }}>
                {/* Left */}
                <div className="flex flex-1 flex-col items-center justify-center px-10 py-6 text-center">
                  <motion.div initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Trophy className="mx-auto mb-3 h-12 w-12 text-yellow-400" />
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-400">
                      Kết thúc!{isPersonalBest ? " 🎉 Kỷ lục cá nhân mới!" : ""}
                    </p>
                    <h2 className="font-mono text-6xl font-black text-white">{score}</h2>
                    <p className="mt-1 text-xs text-white/40">điểm · {DIFF_LABELS[difficulty]}</p>

                    <div className="mx-auto mt-3 w-fit rounded-full px-5 py-1.5 text-sm font-bold" style={{ background: `${currentTier.color}22`, color: currentTier.color }}>
                      {currentTier.label} — {currentTier.desc}
                    </div>

                    {lastRank !== null && lastRank > 0 && (
                      <p className="mt-2 text-xs text-white/45">Xếp hạng #{lastRank} toàn cầu</p>
                    )}

                    {/* Tier progress */}
                    <div className="mt-4 flex justify-center gap-1.5">
                      {TIERS.map((t) => (
                        <div key={t.label} className="rounded-lg px-2.5 py-1.5 text-xs" style={{ background: score >= t.min ? `${t.color}18` : "rgba(255,255,255,0.04)", border: `1px solid ${score >= t.min ? t.color + "44" : "rgba(255,255,255,0.06)"}`, color: score >= t.min ? t.color : "#ffffff25" }}>
                          <div className="font-bold">{t.label}</div>
                          <div style={{ opacity: 0.55 }}>{t.min}+</div>
                        </div>
                      ))}
                    </div>

                    {isSubmitting && <p className="mt-3 text-xs text-white/28">Đang lưu điểm...</p>}

                    <div className="mt-5 flex justify-center gap-3">
                      <button onClick={() => startGame(difficulty)} className="flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#9b5de5,#d946ef)" }}>
                        <RotateCcw className="h-4 w-4" /> Chơi lại
                      </button>
                      <Link to="/games" className="flex items-center gap-2 rounded-full border border-white/16 px-7 py-2.5 text-sm font-semibold text-white/55 hover:text-white/80 transition-colors">
                        ← Games
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Right: leaderboard */}
                <div className="flex w-72 flex-col py-5 pr-5" style={{ borderLeft: "1px solid rgba(155,93,229,0.14)" }}>
                  <div className="flex items-center gap-2 mb-3 pl-4">
                    <Medal className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-yellow-400">Bảng xếp hạng</span>
                  </div>
                  <div className="space-y-1.5 pl-4 overflow-y-auto flex-1">
                    {(onlineLeaderboard?.top ?? []).length > 0
                      ? onlineLeaderboard!.top.slice(0, 8).map((e, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: e.isMe ? "rgba(217,70,239,0.14)" : "rgba(255,255,255,0.04)", border: e.isMe ? "1px solid rgba(217,70,239,0.28)" : "1px solid transparent" }}>
                            <span className="w-5 text-center text-sm">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                            <span className={`flex-1 truncate text-xs font-semibold ${e.isMe ? "text-fuchsia-200" : "text-white/80"}`}>{e.playerName}{e.isMe ? " ←" : ""}</span>
                            <span className="flex items-center gap-0.5 text-[10px] text-white/28"><Flame className="h-2.5 w-2.5" />{e.streak}</span>
                            <span className={`font-mono text-xs font-black ${e.isMe ? "text-yellow-300" : "text-fuchsia-300"}`}>{e.score}</span>
                          </div>
                        ))
                      : localScores.slice(0, 8).map((s, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg bg-white/4 px-2.5 py-1.5">
                            <span className="w-5 text-center text-sm">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                            <span className="flex-1 truncate text-xs text-white/65">Bạn</span>
                            <span className="font-mono text-xs font-black text-fuchsia-300">{s.score}</span>
                          </div>
                        ))
                    }
                  </div>
                  {onlineLeaderboard?.myBest && (
                    <div className="mt-3 ml-4 rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(217,70,239,0.1)", border: "1px solid rgba(217,70,239,0.2)" }}>
                      <p className="font-bold text-fuchsia-300">Kỷ lục của bạn</p>
                      <p className="text-white/50">#{onlineLeaderboard.myBest.rank} · {onlineLeaderboard.myBest.score} điểm · {DIFF_LABELS[onlineLeaderboard.myBest.difficulty]}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-5 py-2" style={{ background: "rgba(12,8,32,0.75)", borderTop: "1px solid rgba(155,93,229,0.1)" }}>
            <span className="text-xs text-white/28">Di chuột hoặc <span className="font-semibold text-white/50">WASD / ↑↓←→</span> · Combo 3+ → <span className="font-semibold text-yellow-400/65">×2 điểm</span></span>
            {isPlaying && (
              <button onClick={() => startGame(difficulty)} className="flex items-center gap-1.5 rounded-full border border-fuchsia-500/28 px-4 py-1.5 text-xs font-semibold text-fuchsia-300/60 transition-colors hover:bg-fuchsia-500/10 hover:text-fuchsia-200">
                <RotateCcw className="h-3 w-3" /> Bắt đầu lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
