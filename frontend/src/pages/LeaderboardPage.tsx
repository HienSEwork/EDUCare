import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Flame, Medal, Star, Trophy } from "lucide-react";

import { LEADERBOARD_PAGE_COPY } from "@/content/socialCopy";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarTone, getInitials } from "@/lib/avatarTheme";
import type { LeaderboardResponse } from "@/types/api";

function podiumIcon(index: number) {
  if (index === 0) return Crown;
  if (index === 1) return Medal;
  return Trophy;
}

function podiumTone(index: number) {
  if (index === 0) return "from-[#fff0c7] via-white to-[#fff7de]";
  if (index === 1) return "from-[#eef0ff] via-white to-[#f7f8ff]";
  return "from-[#ffe3d6] via-white to-[#fff1ea]";
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardResponse["entries"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadLeaderboard = async () => {
      try {
        const response = await apiRequest<LeaderboardResponse>("/leaderboard");
        if (!active) {
          return;
        }
        setEntries(response.entries);
        setError(null);
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(requestError instanceof ApiError ? requestError.message : LEADERBOARD_PAGE_COPY.loadError);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadLeaderboard();
    const intervalId = window.setInterval(() => void loadLeaderboard(), 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const podium = useMemo(() => entries.slice(0, 3), [entries]);
  const topStreak = entries[0]?.streak ?? 0;
  const topScore = Math.max(...entries.map((entry) => entry.quizScore), 0);
  const currentUserEntry = useMemo(() => {
    if (!user) {
      return null;
    }

    return entries.find((entry) => entry.name === user.fullName) ?? null;
  }, [entries, user]);

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-6xl px-4">
        <section className="theme-section rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.92)_0%,rgba(246,241,255,0.97)_50%,rgba(227,245,255,0.92)_100%)] p-6 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                {LEADERBOARD_PAGE_COPY.eyebrow}
              </span>
              <h1 className="mt-5 max-w-[12ch] font-heading text-4xl font-bold leading-[1.06] tracking-[-0.03em] md:text-5xl">
                {LEADERBOARD_PAGE_COPY.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/76 md:text-lg">
                {LEADERBOARD_PAGE_COPY.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/games"
                  className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
                >
                  {LEADERBOARD_PAGE_COPY.playAction}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label={LEADERBOARD_PAGE_COPY.stats.members} value={`${entries.length} người`} />
              <StatCard label={LEADERBOARD_PAGE_COPY.stats.topStreak} value={`${topStreak} ngày`} />
              <StatCard label={LEADERBOARD_PAGE_COPY.stats.topScore} value={`${topScore} điểm`} />
            </div>
          </div>
        </section>

        {error ? (
          <div className="mt-6 rounded-[1.8rem] border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-8 rounded-[2rem] bg-card/84 p-8 shadow-card">{LEADERBOARD_PAGE_COPY.loading}</div>
        ) : entries.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-card/84 p-8 shadow-card">{LEADERBOARD_PAGE_COPY.empty}</div>
        ) : (
          <>
            <section className="mt-8 grid gap-5 lg:grid-cols-3">
              {podium.map((entry, index) => {
                const Icon = podiumIcon(index);

                return (
                  <motion.article
                    key={`${entry.name}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className={`rounded-[2rem] border border-white/70 bg-gradient-to-br ${podiumTone(index)} p-6 shadow-card`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-white/82 shadow-soft">
                        <Icon className="h-6 w-6 text-primary" />
                      </span>
                      <span className="rounded-full bg-white/84 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {LEADERBOARD_PAGE_COPY.podiumLabels[index]}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 border-4 border-white/75 shadow-soft">
                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(entry.avatar || entry.name)} text-2xl font-bold text-foreground`}>
                          {getInitials(entry.name)}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="mt-4 font-heading text-2xl font-bold">{entry.name}</h2>
                      <p className="mt-2 text-sm text-muted-foreground">Giữ nhịp đều mỗi ngày để streak và vị trí luôn vững hơn.</p>
                    </div>

                    <div className="mt-6 grid gap-3">
                      <div className="rounded-[1.4rem] bg-white/82 p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{LEADERBOARD_PAGE_COPY.currentStreak}</p>
                        <p className="mt-2 text-2xl font-bold">{entry.streak} ngày</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-[1.4rem] bg-white/82 p-4 text-center">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{LEADERBOARD_PAGE_COPY.quizScore}</p>
                          <p className="mt-2 text-lg font-bold">{entry.quizScore}</p>
                        </div>
                        <div className="rounded-[1.4rem] bg-white/82 p-4 text-center">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{LEADERBOARD_PAGE_COPY.xp}</p>
                          <p className="mt-2 text-lg font-bold">{entry.xp}</p>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="surface-panel rounded-[2rem] p-6">
                <h2 className="font-heading text-2xl font-bold">{LEADERBOARD_PAGE_COPY.listTitle}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{LEADERBOARD_PAGE_COPY.listDescription}</p>

                <div className="mt-5 space-y-3">
                  {entries.map((entry, index) => (
                    <div
                      key={`${entry.name}-${index}`}
                      className="grid items-center gap-4 rounded-[1.5rem] border border-border/60 bg-background/78 p-4 md:grid-cols-[72px_96px_repeat(4,minmax(0,1fr))]"
                    >
                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Hạng</p>
                        <p className="mt-2 text-2xl font-bold text-primary">#{index + 1}</p>
                      </div>

                      <div className="flex justify-center">
                        <Avatar className="h-16 w-16 border border-white/70 shadow-soft">
                          <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(entry.avatar || entry.name)} text-lg font-bold text-foreground`}>
                            {getInitials(entry.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <MetricCell label="Thành viên" value={entry.name} />
                      <MetricCell label="Tiêu chí" value="Streak ưu tiên trước, sau đó đến score." muted />
                      <MetricCell label="Streak" value={`${entry.streak} ngày`} icon={<Flame className="h-4 w-4" />} />
                      <MetricCell label="Score" value={String(entry.quizScore)} icon={<Trophy className="h-4 w-4" />} />
                      <MetricCell label="XP" value={String(entry.xp)} icon={<Star className="h-4 w-4" />} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="surface-panel-soft rounded-[2rem] p-6">
                  <h2 className="font-heading text-xl font-bold">{LEADERBOARD_PAGE_COPY.formulaTitle}</h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-foreground/76">
                    {LEADERBOARD_PAGE_COPY.formulaItems.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>

                {user ? (
                  <div className="surface-panel-soft rounded-[2rem] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{LEADERBOARD_PAGE_COPY.yourStatsTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{LEADERBOARD_PAGE_COPY.yourStatsDescription}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <Avatar className="h-16 w-16 border border-white/75 shadow-soft">
                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(user.avatar || user.fullName)} text-lg font-bold text-foreground`}>
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-heading text-2xl font-bold">{user.fullName}</h2>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <StatMini label="Streak" value={String(currentUserEntry?.streak ?? user.streak)} />
                      <StatMini label="Score" value={String(currentUserEntry?.quizScore ?? user.quizScore)} />
                      <StatMini label="XP" value={String(currentUserEntry?.xp ?? user.xp)} />
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/70 bg-white/76 p-4 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] bg-white/82 p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{label}</p>
      <p className="mt-2 text-lg font-bold">{value}</p>
    </div>
  );
}

function MetricCell({
  label,
  value,
  icon,
  muted = false,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="text-center text-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{label}</p>
      <p className={`mt-2 inline-flex min-h-[44px] items-center justify-center gap-1 text-center font-semibold ${muted ? "leading-6 text-muted-foreground" : ""}`}>
        {icon}
        {value}
      </p>
    </div>
  );
}
