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

const BOARD_WIDTH = 620;
const BOARD_HEIGHT = 360;

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
        bgGradient="linear-gradient(160deg, #0a071e 0%, #170d2b 45%, #241405 100%)"
        accentColor="#f59e0b"
        buttonIcon={<Sparkles className="h-5 w-5" />}
      />
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

      <div className="container mx-auto max-w-6xl px-4">
        <section className="rounded-[2.4rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                {FLASH_GAME_COPY.eyebrow}
              </span>
              <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">{FLASH_GAME_COPY.title}</h1>
              <p className="mt-4 text-base leading-relaxed text-indigo-100/80 md:text-lg">{FLASH_GAME_COPY.description}</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: FLASH_GAME_COPY.controls, value: FLASH_GAME_COPY.controlsValue },
                { label: FLASH_GAME_COPY.time, value: `${timeLeft} ${FLASH_GAME_COPY.seconds}` },
                { label: FLASH_GAME_COPY.score, value: `${score} điểm` },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.6rem] border border-indigo-400/30 bg-indigo-950/60 p-4 shadow-xl backdrop-blur-md">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{item.label}</p>
                  <p className="mt-2 text-sm font-extrabold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)]">
          <div className="rounded-[2rem] border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
            <div
              className="relative mx-auto overflow-hidden rounded-[1.8rem] border border-indigo-400/30 bg-slate-950/80"
              style={{ width: BOARD_WIDTH, maxWidth: "100%", height: BOARD_HEIGHT }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)]" />

              {orbs.map((orb) => (
                <div
                  key={orb.id}
                  className={`absolute flex h-7 w-7 items-center justify-center rounded-full shadow-lg ${
                    orb.tone === "good" ? "bg-amber-400/90 text-slate-950 font-bold" : "bg-slate-700/80 text-rose-300"
                  }`}
                  style={{ left: orb.x, top: orb.y, transform: "translate(-50%, -50%)" }}
                >
                  {orb.tone === "good" ? <Sparkles className="h-4 w-4" /> : <span className="text-xs font-bold">!</span>}
                </div>
              ))}

              <div
                className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                style={{ left: playerX, top: playerY, transform: "translate(-50%, -50%)" }}
              >
                <Sparkles className="h-5 w-5" />
              </div>

              {!isRunning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{FLASH_GAME_COPY.gameOver}</p>
                  <h2 className="mt-3 font-heading text-4xl font-extrabold text-white">{score} điểm</h2>
                  <p className="mt-3 text-sm font-extrabold text-amber-300">{grade}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-black hover:brightness-110 shadow-lg shadow-cyan-500/20" onClick={resetGame}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {FLASH_GAME_COPY.playAgain}
              </Button>
              <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" asChild>
                <Link to="/games">{FLASH_GAME_COPY.backToGames}</Link>
              </Button>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{FLASH_GAME_COPY.objective}</p>
              <h2 className="mt-2 font-heading text-2xl font-extrabold text-white">{FLASH_GAME_COPY.objectiveTitle}</h2>
              <p className="mt-3 text-sm leading-relaxed text-indigo-100/80">{FLASH_GAME_COPY.objectiveDescription}</p>
            </div>

            <div className="rounded-[2rem] border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-indigo-950/80 border border-indigo-400/30">
                  <Trophy className="h-5 w-5 text-amber-400" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">{FLASH_GAME_COPY.quickRating}</p>
                  <h2 className="font-heading text-xl font-extrabold text-white">{grade}</h2>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  { label: FLASH_GAME_COPY.score, value: `${score}` },
                  { label: FLASH_GAME_COPY.timeRemaining, value: `${timeLeft} ${FLASH_GAME_COPY.seconds}` },
                  { label: FLASH_GAME_COPY.status, value: isRunning ? FLASH_GAME_COPY.playing : FLASH_GAME_COPY.ended },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.3rem] border border-indigo-400/20 bg-indigo-950/50 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-300">{item.label}</p>
                    <p className="mt-2 text-lg font-extrabold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
