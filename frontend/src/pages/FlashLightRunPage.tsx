import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLASH_GAME_COPY } from "@/content/uiCopy";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-flash-run.svg";

type Orb = {
  id: number;
  x: number;
  y: number;
  value: number;
  tone: "good" | "bad";
};

const BOARD_WIDTH = 1140;
const BOARD_HEIGHT = 540;

function randomOrb(id: number): Orb {
  return {
    id,
    x: 30 + Math.random() * (BOARD_WIDTH - 60),
    y: 40 + Math.random() * (BOARD_HEIGHT - 80),
    value: Math.random() > 0.25 ? 10 : -8,
    tone: Math.random() > 0.25 ? "good" : "bad",
  };
}

export default function FlashLightRunPage() {
  const [playerX, setPlayerX] = useState(BOARD_WIDTH / 2);
  const [playerY, setPlayerY] = useState(BOARD_HEIGHT / 2);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [orbs, setOrbs] = useState<Orb[]>(() => Array.from({ length: 8 }, (_, index) => randomOrb(index + 1)));
  const [gamePhase, setGamePhase] = useState<"intro" | "playing">("intro");
  const pressedKeys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const GAME_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "];
    const onKeyDown = (event: KeyboardEvent) => {
      if (GAME_KEYS.includes(event.key)) event.preventDefault();
      pressedKeys.current[event.key] = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      pressedKeys.current[event.key] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gamePhase === "playing") {
      setIsRunning(true);
    }
  }, [gamePhase]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    let frame = 0;

    const tick = () => {
      setPlayerX((current) => {
        let next = current;

        if (pressedKeys.current.ArrowLeft || pressedKeys.current.a) {
          next -= 6;
        }
        if (pressedKeys.current.ArrowRight || pressedKeys.current.d) {
          next += 6;
        }

        return Math.max(18, Math.min(BOARD_WIDTH - 18, next));
      });

      setPlayerY((current) => {
        let next = current;

        if (pressedKeys.current.ArrowUp || pressedKeys.current.w) {
          next -= 6;
        }
        if (pressedKeys.current.ArrowDown || pressedKeys.current.s) {
          next += 6;
        }

        return Math.max(18, Math.min(BOARD_HEIGHT - 18, next));
      });

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    setOrbs((current) =>
      current.map((orb) => {
        const distance = Math.hypot(orb.x - playerX, orb.y - playerY);

        if (distance < 28) {
          setScore((value) => Math.max(0, value + orb.value));
          return randomOrb(orb.id);
        }

        return orb;
      }),
    );
  }, [isRunning, playerX, playerY]);

  const grade = useMemo(() => {
    if (score >= 140) {
      return FLASH_GAME_COPY.scoreLabels.high;
    }
    if (score >= 90) {
      return FLASH_GAME_COPY.scoreLabels.good;
    }
    if (score >= 50) {
      return FLASH_GAME_COPY.scoreLabels.medium;
    }
    return FLASH_GAME_COPY.scoreLabels.low;
  }, [score]);

  const resetGame = () => {
    setPlayerX(BOARD_WIDTH / 2);
    setPlayerY(BOARD_HEIGHT / 2);
    setScore(0);
    setTimeLeft(45);
    setIsRunning(true);
    setOrbs(Array.from({ length: 8 }, (_, index) => randomOrb(index + 1)));
    setGamePhase("playing");
  };

  if (gamePhase === "intro") {
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow="⚡ Mini Game · Arcade"
        title="Ánh Sáng Tự Tin"
        description="Thu thập các quả cầu sáng trong 45 giây! Điều hướng bằng phím mũi tên hoặc WASD, tránh các quả cầu tối và kiếm điểm cao nhất."
        stats={[
          { label: "Thời gian", value: "45 giây" },
          { label: "Điều khiển", value: "↑↓←→ / WASD" },
          { label: "Dạng chơi", value: "Arcade" },
        ]}
        rules={[
          { text: "Dùng phím mũi tên hoặc WASD để di chuyển" },
          { text: "Thu thập quả cầu vàng ✨: +10 điểm" },
          { text: "Tránh quả cầu xám !: -8 điểm" },
          { text: "Kiếm nhiều điểm nhất trong 45 giây!" },
        ]}
        startLabel="Bắt đầu chơi!"
        onStart={() => setGamePhase("playing")}
        bgGradient="linear-gradient(135deg,#0f0a1e 0%,#1a0533 50%,#0f0a1e 100%)"
        accentColor="#d946ef"
        buttonIcon={<Sparkles className="h-5 w-5" />}
      />
    );
  }

  return (
    <div
      className="min-h-screen pb-0 pt-0"
      style={{ background: "linear-gradient(135deg,#0f0a1e 0%,#1a0533 50%,#0f0a1e 100%)" }}
    >
      {/* HUD bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(15,10,30,0.85)", borderBottom: "1px solid rgba(217,70,239,0.18)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
            ⚡ {FLASH_GAME_COPY.eyebrow}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            {FLASH_GAME_COPY.score}
            <span className="ml-2 font-mono text-lg font-black text-fuchsia-300">{score}</span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            {FLASH_GAME_COPY.time}
            <span className={`ml-2 font-mono text-lg font-black ${timeLeft <= 10 ? "text-red-400" : "text-cyan-300"}`}>
              {timeLeft}s
            </span>
          </span>
          <button
            onClick={() => setGamePhase("intro")}
            className="rounded px-3 py-1.5 text-xs font-semibold text-white/40 hover:bg-white/10 hover:text-white/80 transition-all"
          >
            ✕ Thoát
          </button>
        </div>
      </div>

      {/* Game board — 1140px, square corners */}
      <div className="flex justify-center pt-4 px-4 pb-4">
        <div style={{ width: "100%", maxWidth: BOARD_WIDTH }}>
          <div
            className="relative overflow-hidden"
            style={{
              width: "100%",
              height: BOARD_HEIGHT,
              background: "radial-gradient(ellipse at 50% 30%,#2a0a4a 0%,#110827 60%,#0a0518 100%)",
              borderRadius: 0,
            }}
          >
            {/* Perspective grid floor */}
            <svg
              className="pointer-events-none absolute bottom-0 left-0 right-0"
              viewBox="0 0 1140 260"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ width: "100%", height: 260, opacity: 0.45 }}
            >
              {Array.from({ length: 14 }, (_, i) => {
                const x = (i / 13) * 1140;
                return (
                  <line key={`v${i}`} x1={x} y1={260} x2={570} y2={0} stroke="#9b5de5" strokeWidth="0.7" />
                );
              })}
              {Array.from({ length: 10 }, (_, i) => {
                const t = (i + 1) / 10;
                const y = 260 * t;
                const hw = 570 * (1 - t);
                return (
                  <line key={`h${i}`} x1={570 - hw} y1={y} x2={570 + hw} y2={y} stroke="#9b5de5" strokeWidth="0.5" />
                );
              })}
            </svg>

            {/* Stars */}
            {[24, 68, 140, 280, 440, 620, 800, 960, 1080, 180, 360, 700, 1020, 50, 900].map((cx, i) => (
              <div
                key={i}
                className="pointer-events-none absolute rounded-full bg-white"
                style={{
                  width: i % 3 === 0 ? 2.5 : 1.5,
                  height: i % 3 === 0 ? 2.5 : 1.5,
                  left: cx,
                  top: 20 + (i * 27) % 200,
                  opacity: 0.3 + (i % 4) * 0.15,
                }}
              />
            ))}

            {/* Orbs */}
            {orbs.map((orb) => (
              <div
                key={orb.id}
                className={`absolute flex h-9 w-9 items-center justify-center rounded-full ${
                  orb.tone === "good"
                    ? "bg-yellow-400/90 shadow-[0_0_16px_4px_rgba(250,204,21,0.55)]"
                    : "bg-slate-500/80 shadow-[0_0_10px_2px_rgba(148,163,184,0.3)]"
                }`}
                style={{ left: orb.x, top: orb.y, transform: "translate(-50%,-50%)" }}
              >
                {orb.tone === "good"
                  ? <Sparkles className="h-4 w-4 text-yellow-900" />
                  : <span className="text-xs font-black text-slate-300">!</span>}
              </div>
            ))}

            {/* Player */}
            <div
              className="absolute flex h-12 w-12 items-center justify-center rounded-full text-white"
              style={{
                left: playerX,
                top: playerY,
                transform: "translate(-50%,-50%)",
                background: "linear-gradient(135deg,#9b5de5,#f15bb5)",
                boxShadow: "0 0 24px 8px rgba(217,70,239,0.6), 0 0 6px 2px rgba(255,255,255,0.3)",
              }}
            >
              <Sparkles className="h-5 w-5" />
            </div>

            {/* Game over overlay */}
            {!isRunning && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "rgba(10,5,24,0.82)", backdropFilter: "blur(6px)" }}
              >
                <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-400">
                  {FLASH_GAME_COPY.gameOver}
                </p>
                <h2 className="mt-3 font-heading text-5xl font-black text-white">{score}</h2>
                <p className="mt-1 text-sm text-white/60">điểm</p>
                <p className="mt-3 rounded-full bg-fuchsia-500/20 px-5 py-2 text-sm font-semibold text-fuchsia-300">
                  {grade}
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 rounded-full bg-fuchsia-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-fuchsia-400 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" /> {FLASH_GAME_COPY.playAgain}
                  </button>
                  <Link
                    to="/games"
                    className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/70 hover:border-white/40 hover:text-white transition-colors"
                  >
                    {FLASH_GAME_COPY.backToGames}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ background: "rgba(15,10,30,0.7)", borderTop: "1px solid rgba(217,70,239,0.12)" }}
          >
            <span className="text-xs text-white/30">
              {FLASH_GAME_COPY.controls}: <span className="text-white/60 font-semibold">WASD / ↑↓←→</span>
            </span>
            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex items-center gap-1.5 rounded-full border border-fuchsia-500/40 px-4 py-1.5 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/15 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> {FLASH_GAME_COPY.playAgain}
              </button>
              <Link
                to="/games"
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white/40 hover:border-white/30 hover:text-white/70 transition-colors"
              >
                {FLASH_GAME_COPY.backToGames}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
