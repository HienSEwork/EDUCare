import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";

import { GAME_DISPLAY_BY_SLUG, GAMES_PAGE_COPY } from "@/content/pageCopy";
import { getGamePhoto } from "@/lib/contentMedia";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Game } from "@/types/api";

const supportedPlayPaths = new Set([
  "/games/quiz?mode=quick",
  "/games/quiz?mode=long",
  "/games/flash-light-run",
]);

function gameBadge(game: Game) {
  if (game.gameType === "FLASH") {
    return GAMES_PAGE_COPY.flashBadge;
  }

  if (game.slug.includes("long")) {
    return GAMES_PAGE_COPY.longQuizBadge;
  }

  return GAMES_PAGE_COPY.quickQuizBadge;
}

function getDisplayGame(game: Game) {
  const display = GAME_DISPLAY_BY_SLUG[game.slug as keyof typeof GAME_DISPLAY_BY_SLUG];

  return {
    ...game,
    title: display?.title ?? game.title,
    summary: display?.summary ?? game.summary,
  };
}

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
  const heroImage = featuredGames[0]
    ? getGamePhoto(featuredGames[0])
    : getGamePhoto({ slug: "quiz-quick", title: "Quiz nhanh", gameType: "QUIZ" });

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-4">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,224,234,0.9)_0%,rgba(245,241,255,0.96)_50%,rgba(226,244,255,0.9)_100%)] shadow-[0_24px_80px_rgba(66,35,95,0.10)]">
          <div className="grid gap-10 px-6 py-10 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:py-12">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                {GAMES_PAGE_COPY.eyebrow}
              </span>

              <h1 className="mt-5 max-w-[14ch] font-heading text-4xl font-bold leading-[1.06] tracking-[-0.03em] md:text-5xl">
                <span className="block">{GAMES_PAGE_COPY.titleLine1}</span>
                <span className="block">{GAMES_PAGE_COPY.titleLine2}</span>
              </h1>

              <p className="mt-4 max-w-[42rem] text-base leading-7 text-foreground/72 md:text-lg">
                {GAMES_PAGE_COPY.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/games/quiz?mode=quick"
                  className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  {GAMES_PAGE_COPY.primaryAction}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/community/leaderboard"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-6 py-3 text-sm font-semibold text-foreground shadow-soft transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {GAMES_PAGE_COPY.secondaryAction}
                  <Trophy className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/58 p-5 shadow-[0_24px_60px_rgba(54,36,92,0.12)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between rounded-full border border-white/70 bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <span>{GAMES_PAGE_COPY.heroPanelTitle}</span>
                  <span>{games.length} {GAMES_PAGE_COPY.heroPanelCountSuffix}</span>
                </div>

                <img
                  src={heroImage}
                  alt={GAMES_PAGE_COPY.heroImageAlt}
                  className="h-[320px] w-full rounded-[1.8rem] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {error ? <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

        <section className="mt-12">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{GAMES_PAGE_COPY.sectionEyebrow}</p>
              <h2 className="mt-2 font-heading text-3xl font-bold">{GAMES_PAGE_COPY.sectionTitle}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{GAMES_PAGE_COPY.sectionDescription}</p>
            </div>
            <Link to="/community/leaderboard" className="text-sm font-semibold text-primary hover:underline">
              {GAMES_PAGE_COPY.openLeaderboard}
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredGames.map((game, index) => {
              const isImplemented = supportedPlayPaths.has(game.playPath);

              return (
                <motion.article
                  key={game.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/86 shadow-card transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-hover"
                >
                  <div
                    className="relative aspect-[16/10] overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${game.accentColor ?? "#9b5de5"}18 0%, rgba(255,255,255,0.86) 100%)` }}
                  >
                    <img
                      src={getGamePhoto(game)}
                      alt={`Ảnh minh họa cho trò chơi ${game.title}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                      <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-soft">
                        {gameBadge(game)}
                      </span>
                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-soft"
                        style={{ backgroundColor: game.accentColor ?? "#9b5de5" }}
                      >
                        EDUcare
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/36 to-transparent" />
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold">{game.title}</h3>
                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-foreground/74">{game.summary}</p>

                    {isImplemented ? (
                      <Link
                        to={game.playPath}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                      >
                        {GAMES_PAGE_COPY.playAction}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="mt-6 inline-flex items-center rounded-full bg-muted px-5 py-3 text-sm font-semibold text-muted-foreground">
                        {GAMES_PAGE_COPY.developingAction}
                      </span>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
