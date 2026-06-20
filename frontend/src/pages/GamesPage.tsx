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

  const featuredGames = useMemo(() => games.slice(0, 3).map(getDisplayGame), [games]);

  return (
    <div className="min-h-screen overflow-x-hidden pb-20">

      {/* ══════════════════════════════
          HERO — Garden sky atmosphere
      ══════════════════════════════ */}
      <section className="relative overflow-hidden pt-8">
        {/* Sky-to-indigo gradient background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 35%, #312e81 60%, #1d4ed8 85%, #0369a1 100%)",
          }}
        />

        {/* Radial glow blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[10%] top-[15%] h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]" />
          <div className="absolute right-[12%] top-[8%] h-48 w-48 rounded-full bg-sky-400/25 blur-[60px]" />
          <div className="absolute bottom-[10%] left-[40%] h-56 w-56 rounded-full bg-violet-500/15 blur-[90px]" />
        </div>

        {/* Floating poly shapes */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {POLY_SHAPES.map((s) => <PolyFloat key={s.id} shape={s} />)}
        </div>

        {/* Star dots */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            {STAR_DOTS.map((dot) => (
              <circle key={dot.id} cx={dot.x} cy={dot.y} r={dot.r} fill="white" opacity={dot.opacity}>
                <animate attributeName="opacity" values={`${dot.opacity};${dot.opacity * 2.5};${dot.opacity}`}
                  dur={`${dot.dur}s`} begin={`${dot.delay}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>
        </div>

        <div className="container relative mx-auto px-4 py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            {/* Left — headline */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-200 backdrop-blur-sm">
                <Gamepad2 className="h-3.5 w-3.5" />
                {GAMES_PAGE_COPY.eyebrow}
              </div>

              <h1 className="font-heading text-4xl font-bold leading-[1.06] tracking-[-0.03em] text-white md:text-5xl lg:text-6xl">
                <span className="block">{GAMES_PAGE_COPY.titleLine1}</span>
                <span className="mt-1 block bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
                  {GAMES_PAGE_COPY.titleLine2}
                </span>
              </h1>

              <p className="mt-5 max-w-[44rem] text-base leading-7 text-sky-100/75 md:text-lg">
                {GAMES_PAGE_COPY.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/games/quiz?mode=quick"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_6px_28px_rgba(99,102,241,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(99,102,241,0.55)]"
                >
                  <Zap className="h-4 w-4" />
                  {GAMES_PAGE_COPY.primaryAction}
                </Link>
                <Link
                  to="/community/leaderboard"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/18"
                >
                  <Trophy className="h-4 w-4" />
                  {GAMES_PAGE_COPY.secondaryAction}
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { label: "Trò chơi", val: `${games.length}+` },
                  { label: "Câu hỏi", val: "500+" },
                  { label: "Người chơi", val: "2K+" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="font-heading text-2xl font-bold text-white">{s.val}</span>
                    <span className="text-xs font-semibold text-sky-300/70">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — animated game card stack */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.65 }}
              className="relative flex items-center justify-center"
            >
              {/* Decorative stacked cards */}
              <div className="relative h-[360px] w-full max-w-[400px]">
                {/* Back card */}
                <motion.div
                  animate={{ rotate: [6, 8, 6], y: [0, -4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-[2rem] border border-white/15"
                  style={{ background: "linear-gradient(145deg, rgba(99,102,241,0.4), rgba(139,92,246,0.3))", backdropFilter: "blur(8px)" }}
                />
                {/* Mid card */}
                <motion.div
                  animate={{ rotate: [-3, -5, -3], y: [0, 6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-2 rounded-[1.8rem] border border-white/20"
                  style={{ background: "linear-gradient(145deg, rgba(14,165,233,0.35), rgba(56,189,248,0.25))", backdropFilter: "blur(8px)" }}
                />
                {/* Front card */}
                <div className="absolute inset-4 overflow-hidden rounded-[1.6rem] border border-white/25 shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
                  style={{ background: "linear-gradient(145deg, rgba(30,27,75,0.92), rgba(49,46,129,0.88))", backdropFilter: "blur(16px)" }}
                >
                  <div className="flex h-full flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-indigo-500/25 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-200">
                        Nổi bật
                      </span>
                      <Crown className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="mt-auto">
                      <div className="mb-3 flex gap-2">
                        {[Zap, Star, FlameKindling].map((Icon, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10"
                          >
                            <Icon className="h-4 w-4 text-white/80" strokeWidth={1.5} />
                          </motion.div>
                        ))}
                      </div>
                      <p className="font-heading text-xl font-bold text-white">Vườn Trò Chơi</p>
                      <p className="mt-1 text-xs text-white/50">Học qua trải nghiệm vui vẻ</p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-sky-400"
                            animate={{ width: ["20%", "75%", "20%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </div>
                        <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating icons around the stack */}
                {[
                  { Icon: Star, pos: "top-0 right-0", color: "text-yellow-300", bg: "bg-yellow-400/15", delay: 0 },
                  { Icon: Zap, pos: "bottom-8 -left-3", color: "text-sky-300", bg: "bg-sky-400/15", delay: 1 },
                  { Icon: Sparkles, pos: "-top-2 left-8", color: "text-violet-300", bg: "bg-violet-400/15", delay: 0.5 },
                ].map(({ Icon, pos, color, bg, delay }, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${pos} flex h-10 w-10 items-center justify-center rounded-2xl ${bg} backdrop-blur-sm`}
                    animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
                    transition={{ duration: 3 + i, delay, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.5} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave bottom divider */}
        <div className="relative -mb-1">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════
          GAME CARDS section
      ══════════════════════════════ */}
      <div className="container mx-auto px-4">
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

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredGames.map((game, index) => {
              const isImplemented = supportedPlayPaths.has(game.playPath);
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              const AccentIcon = accent.icon;

              return (
                <motion.article
                  key={game.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/86 shadow-card transition-[transform,box-shadow] hover:-translate-y-1.5 hover:shadow-hover"
                >
                  {/* Image area */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(135deg, ${accent.from}22 0%, ${accent.to}11 100%)` }}
                    />
                    <img
                      src={getGamePhoto(game)}
                      alt={`Ảnh minh họa trò chơi ${game.title}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Top badges */}
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                      <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary shadow-soft">
                        {gameBadge(game)}
                      </span>
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl shadow-soft"
                        style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
                      >
                        <AccentIcon className="h-4 w-4 text-white" strokeWidth={1.8} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Accent line */}
                    <div
                      className="mb-4 h-0.5 w-12 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
                    />
                    <h3 className="font-heading text-2xl font-bold">{game.title}</h3>
                    <p className="mt-3 min-h-[66px] text-sm leading-6 text-foreground/70">{game.summary}</p>

                    {isImplemented ? (
                      <Link
                        to={game.playPath}
                        className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                          boxShadow: `0 6px 20px ${accent.glow}`,
                        }}
                      >
                        {GAMES_PAGE_COPY.playAction}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="mt-5 inline-flex items-center rounded-full bg-muted px-6 py-3 text-sm font-semibold text-muted-foreground">
                        {GAMES_PAGE_COPY.developingAction}
                      </span>
                    )}
                  </div>
                </motion.article>
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
  );
}
