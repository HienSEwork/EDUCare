import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Zap, Star, Gamepad2, Sparkles, Crown, FlameKindling } from "lucide-react";

import { GAME_DISPLAY_BY_SLUG, GAMES_PAGE_COPY } from "@/content/pageCopy";
import { getGamePhoto } from "@/lib/contentMedia";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Game } from "@/types/api";

const supportedPlayPaths = new Set([
  "/games/quiz?mode=quick",
  "/games/quiz?mode=long",
  "/games/flash-light-run",
  "/games/myth-buster",
  "/games/safe-swipe",
  "/games/chat-detective",
  "/games/red-flag-hunt",
  "/games/emotion-sort",
  "/games/teen-path",
]);

/* ── Floating polygon shapes for garden atmosphere ── */
const POLY_SHAPES = [
  { id: 1, points: "50,5 95,27 95,73 50,95 5,73 5,27", color: "#818cf8", size: 80, x: "8%", y: "12%", delay: 0, dur: 7 },
  { id: 2, points: "50,0 100,38 82,100 18,100 0,38", color: "#34d399", size: 60, x: "85%", y: "8%", delay: 1.5, dur: 9 },
  { id: 3, points: "0,50 50,0 100,50 50,100", color: "#f472b6", size: 50, x: "15%", y: "72%", delay: 0.8, dur: 8 },
  { id: 4, points: "50,5 95,27 95,73 50,95 5,73 5,27", color: "#38bdf8", size: 44, x: "78%", y: "68%", delay: 2, dur: 11 },
  { id: 5, points: "0,50 50,0 100,50 50,100", color: "#fbbf24", size: 36, x: "50%", y: "6%", delay: 0.4, dur: 6 },
  { id: 6, points: "50,0 100,50 50,100 0,50", color: "#a78bfa", size: 28, x: "92%", y: "42%", delay: 3, dur: 10 },
  { id: 7, points: "50,5 95,27 95,73 50,95 5,73 5,27", color: "#fb7185", size: 22, x: "4%", y: "44%", delay: 1.2, dur: 8.5 },
];

/* Stars / sparkle dots scattered in bg */
const STAR_DOTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: `${5 + (i * 83) % 90}%`,
  y: `${3 + (i * 47) % 88}%`,
  r: 1.5 + (i % 3) * 1,
  opacity: 0.15 + (i % 4) * 0.08,
  dur: 3 + (i % 5),
  delay: (i * 0.4) % 4,
}));

function PolyFloat({ shape }: { shape: typeof POLY_SHAPES[0] }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: shape.x, top: shape.y, width: shape.size, height: shape.size, opacity: 0.22 }}
      animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0] }}
      transition={{ duration: shape.dur, delay: shape.delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 100 100" width={shape.size} height={shape.size}>
        <polygon points={shape.points} fill={shape.color} />
      </svg>
    </motion.div>
  );
}

function gameBadge(game: Game) {
  if (game.gameType === "FLASH") return GAMES_PAGE_COPY.flashBadge;
  if (game.slug.includes("long")) return GAMES_PAGE_COPY.longQuizBadge;
  return GAMES_PAGE_COPY.quickQuizBadge;
}

function getDisplayGame(game: Game) {
  const display = GAME_DISPLAY_BY_SLUG[game.slug as keyof typeof GAME_DISPLAY_BY_SLUG];
  return { ...game, title: display?.title ?? game.title, summary: display?.summary ?? game.summary };
}

const CARD_ACCENTS = [
  { from: "#6366f1", to: "#818cf8", glow: "rgba(99,102,241,0.35)", icon: Zap },
  { from: "#0ea5e9", to: "#38bdf8", glow: "rgba(14,165,233,0.35)", icon: Star },
  { from: "#8b5cf6", to: "#a78bfa", glow: "rgba(139,92,246,0.35)", icon: FlameKindling },
];

import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void apiRequest<Game[]>("/games")
      .then((response) => {
        setGames(response.filter((item) => item.published));
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : GAMES_PAGE_COPY.loadError);
      });
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen overflow-x-hidden pb-20">

        {/* ══════════════════════════════
            GAME CARDS GRID (Poki Style)
        ══════════════════════════════ */}
        <div className="container mx-auto px-3 py-6 md:px-6 md:py-8 lg:max-w-[1400px]">
          {error && <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

          <section className="mt-4 pb-4">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{GAMES_PAGE_COPY.sectionEyebrow}</p>
                <h2 className="mt-2 font-heading text-3xl font-bold">{GAMES_PAGE_COPY.sectionTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{GAMES_PAGE_COPY.sectionDescription}</p>
              </div>
              <Link to="/community/leaderboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                <Trophy className="h-4 w-4" />
                {GAMES_PAGE_COPY.openLeaderboard}
              </Link>
            </div>

            {/* Poki-style dense grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4 auto-rows-[140px] md:auto-rows-[160px]">
              {games.map(getDisplayGame).map((game, index) => {
                const isImplemented = supportedPlayPaths.has(game.playPath);

                // Assign dynamic sizes based on index/slug to make it look masonry-like
                let spanClass = "col-span-2 row-span-1"; // default 2x1 rectangle
                
                if (index === 0) spanClass = "col-span-2 row-span-2"; // 2x2 large square
                else if (index === 1 || index === 4) spanClass = "col-span-2 row-span-2 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-2"; // very large banner
                else if (index % 3 === 0) spanClass = "col-span-1 row-span-1"; // small square
                else if (index % 5 === 0) spanClass = "col-span-2 row-span-2 md:col-span-1 md:row-span-2"; // tall rectangle
                else spanClass = "col-span-2 row-span-1 md:col-span-2 md:row-span-1"; // wide rectangle

                return (
                  <Link
                    to={isImplemented ? game.playPath : "#"}
                    key={game.id}
                    className={`group relative overflow-hidden rounded-[1.2rem] md:rounded-[1.6rem] bg-black shadow-card transition-transform duration-300 hover:scale-[1.02] hover:z-10 hover:shadow-hover ${spanClass} ${!isImplemented ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <img
                      src={getGamePhoto(game)}
                      alt={`Ảnh trò chơi ${game.title}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <h3 className="font-heading text-lg font-bold text-white leading-tight drop-shadow-md">
                        {game.title}
                      </h3>
                      {isImplemented ? (
                        <span className="mt-1 inline-flex items-center text-xs font-semibold text-white/90">
                          {GAMES_PAGE_COPY.playAction} <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      ) : (
                        <span className="mt-1 text-xs font-semibold text-white/70">
                          {GAMES_PAGE_COPY.developingAction}
                        </span>
                      )}
                    </div>
                    
                    {/* Badges on Top Left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary shadow-soft">
                        {gameBadge(game)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Garden CTA banner ── */}
          <section className="mt-8 overflow-hidden rounded-[2rem] border border-indigo-200/40"
            style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #1d4ed8 100%)" }}>
            <div className="relative px-8 py-12 text-center">
              {/* Poly deco */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {POLY_SHAPES.slice(0, 4).map((s) => (
                  <motion.div
                    key={s.id}
                    className="absolute"
                    style={{ left: s.x, top: s.y, width: s.size * 0.6, height: s.size * 0.6, opacity: 0.15 }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: s.dur * 3, repeat: Infinity, ease: "linear" }}
                  >
                    <svg viewBox="0 0 100 100" width={s.size * 0.6} height={s.size * 0.6}>
                      <polygon points={s.points} fill={s.color} />
                    </svg>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                    <Crown className="h-7 w-7 text-yellow-300" />
                  </div>
                </div>
                <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
                  Sẵn sàng chinh phục bảng xếp hạng?
                </h2>
                <p className="mt-3 text-sky-200/80">
                  Chơi đều mỗi ngày, giữ streak và leo top cùng cộng đồng EDUcare.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/games/quiz?mode=quick"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-[0_6px_24px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-0.5"
                  >
                    <Zap className="h-4 w-4" />
                    Chơi ngay
                  </Link>
                  <Link
                    to="/community/leaderboard"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    <Trophy className="h-4 w-4" />
                    Xem bảng xếp hạng
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
}
