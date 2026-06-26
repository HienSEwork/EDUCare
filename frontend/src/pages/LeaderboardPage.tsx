import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Flame, Medal, Star, Trophy } from "lucide-react";

import { LEADERBOARD_PAGE_COPY } from "@/content/socialCopy";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarTone, getInitials } from "@/lib/avatarTheme";
import type { GameLeaderboardResponse, LeaderboardResponse } from "@/types/api";

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

// ── Game score tabs ────────────────────────────────────────────────────────
const GAME_TABS = [
  { slug: "flash-light-run", label: "⚡ Ánh Sáng Tự Tin" },
  { slug: "myth-buster",     label: "🔎 Myth Buster" },
  { slug: "safe-swipe",      label: "📱 Safe Swipe" },
  { slug: "chat-detective",  label: "💬 Chat Detective" },
  { slug: "red-flag-hunt",   label: "🚩 Red Flag Hunt" },
  { slug: "emotion-sort",    label: "❤️ Emotion Sort" },
  { slug: "teen-path",       label: "🌿 Teen Path" },
] as const;

const DIFF_LABEL: Record<string, string> = { easy: "Dễ", medium: "Thường", hard: "Khó" };

function GameScoreSection() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [cache, setCache] = useState<Record<string, GameLeaderboardResponse>>({});
  const [loading, setLoading] = useState(false);

  const currentSlug = GAME_TABS[activeTab].slug;

  useEffect(() => {
    if (cache[currentSlug]) return;
    setLoading(true);
    apiRequest<GameLeaderboardResponse>(`/games/${currentSlug}/leaderboard`)
      .then((lb) => setCache((c) => ({ ...c, [currentSlug]: lb })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentSlug, cache]);

  const lb = cache[currentSlug];

  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="font-heading text-2xl font-bold">Bảng xếp hạng Game</h2>
        <p className="mt-1 text-sm text-muted-foreground">Thi đua điểm game — so sánh kỷ lục với cả cộng đồng</p>
      </div>

      {/* Tab bar */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {GAME_TABS.map((g, i) => (
          <button
            key={g.slug}
            onClick={() => setActiveTab(i)}
            className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style={{
              background: activeTab === i ? "linear-gradient(135deg,#9b5de5,#d946ef)" : undefined,
              color: activeTab === i ? "white" : undefined,
            }}
            data-active={activeTab === i ? "" : undefined}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="surface-panel rounded-[2rem] p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : !lb || lb.top.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có ai chơi game này. Hãy là người đầu tiên!</p>
        ) : (
          <>
            {/* Top 3 compact podium */}
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              {lb.top.slice(0, 3).map((e, i) => (
                <div key={i} className={`rounded-[1.6rem] border border-white/60 p-4 text-center bg-gradient-to-br ${podiumTone(i)}`}>
                  <div className="text-2xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                  <p className="mt-1 font-heading text-base font-bold truncate">{e.playerName}</p>
                  <p className="font-mono text-xl font-black text-primary">{e.score}</p>
                  <p className="text-xs text-muted-foreground">{DIFF_LABEL[e.difficulty] ?? e.difficulty}</p>
                  <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Flame className="h-3 w-3" />{e.streak} ngày streak
                  </div>
                </div>
              ))}
            </div>

            {/* Full list */}
            <div className="space-y-2">
              {lb.top.slice(3).map((e, i) => (
                <div
                  key={i + 3}
                  className="flex items-center gap-3 rounded-[1.2rem] border px-4 py-3"
                  style={{
                    background: e.isMe ? "rgba(155,93,229,0.06)" : undefined,
                    borderColor: e.isMe ? "rgba(155,93,229,0.3)" : undefined,
                  }}
                >
                  <span className="w-8 text-center text-sm font-bold text-muted-foreground">#{i + 4}</span>
                  <span className={`flex-1 truncate text-sm font-semibold ${e.isMe ? "text-primary" : ""}`}>
                    {e.playerName}{e.isMe ? " (bạn)" : ""}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Flame className="h-3 w-3" />{e.streak}</span>
                  <span className="text-xs text-muted-foreground">{DIFF_LABEL[e.difficulty] ?? e.difficulty}</span>
                  <span className="font-mono font-black text-primary">{e.score}</span>
                </div>
              ))}
            </div>

            {/* My best (outside top 10) */}
            {lb.myBest && (
              <div className="mt-4 rounded-[1.4rem] border border-primary/30 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Kỷ lục của bạn</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-bold text-muted-foreground">#{lb.myBest.rank}</span>
                  <span className="flex-1 text-sm font-semibold">{lb.myBest.playerName}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Flame className="h-3 w-3" />{lb.myBest.streak}</span>
                  <span className="text-xs text-muted-foreground">{DIFF_LABEL[lb.myBest.difficulty] ?? lb.myBest.difficulty}</span>
                  <span className="font-mono font-black text-primary">{lb.myBest.score}</span>
                </div>
              </div>
            )}

            {!user && (
              <p className="mt-3 text-xs text-muted-foreground">
                <Link to="/login" className="font-semibold text-primary hover:underline">Đăng nhập</Link> để lưu điểm và xuất hiện trên bảng xếp hạng.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
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
        if (!active) return;
        setEntries(response.entries);
        setError(null);
      } catch (requestError) {
        if (!active) return;
        setError(requestError instanceof ApiError ? requestError.message : LEADERBOARD_PAGE_COPY.loadError);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void loadLeaderboard();
    const intervalId = window.setInterval(() => void loadLeaderboard(), 10000);
    return () => { active = false; window.clearInterval(intervalId); };
  }, []);

  const podium = useMemo(() => entries.slice(0, 3), [entries]);
  const topStreak = entries[0]?.streak ?? 0;
  const topScore = Math.max(...entries.map((entry) => entry.quizScore), 0);
  const currentUserEntry = useMemo(() => {
    if (!user) return null;
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
                <Link to="/games" className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft">
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
          <div className="mt-6 rounded-[1.8rem] border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
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

        {/* Game score leaderboard */}
        <GameScoreSection />
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

function MetricCell({ label, value, icon, muted = false }: { label: string; value: string; icon?: ReactNode; muted?: boolean }) {
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
