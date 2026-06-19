import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, BookOpen, Flame, LayoutDashboard, Settings, Sparkles, Star } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import { PROFILE_PAGE_COPY } from "@/content/socialCopy";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarTone, getInitials } from "@/lib/avatarTheme";
import type { DashboardResponse } from "@/types/api";

function planLabel(plan: string) {
  if (plan === "free") return "Miễn phí";
  if (plan === "popular") return "Phổ biến";
  if (plan === "premium") return "Premium";
  return plan;
}

function formatExpiryDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch (e) {
    return "";
  }
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    const loadProfile = async () => {
      try {
        const response = await apiRequest<DashboardResponse>("/dashboard");
        if (!active) {
          return;
        }
        setData(response);
        setError(null);
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(requestError instanceof ApiError ? requestError.message : PROFILE_PAGE_COPY.loadError);
      }
    };

    void loadProfile();
    const intervalId = window.setInterval(() => void loadProfile(), 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [user]);

  const quickFavorites = useMemo(
    () => [
      { label: "Bài viết", to: "/blog" },
      { label: "Khóa học", to: "/courses" },
      { label: "Trò chơi", to: "/games" },
      { label: "Cộng đồng", to: "/community" },
    ],
    [],
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <section className="theme-section overflow-hidden rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.9)_0%,rgba(246,241,255,0.97)_50%,rgba(227,245,255,0.9)_100%)] p-6 shadow-card md:p-8">
            <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
              <div className="surface-panel rounded-[2rem] p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-28 w-28 border-4 border-white/70 shadow-card">
                    <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(user.avatar || user.fullName)} text-3xl font-bold text-foreground`}>
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">{PROFILE_PAGE_COPY.welcomeLabel}</p>
                  <h1 className="mt-2 font-heading text-3xl font-bold">{user.fullName}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">@{user.username}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <ProfileStat label={PROFILE_PAGE_COPY.stats.email} value={user.email} compact />
                  <ProfileStat label={PROFILE_PAGE_COPY.stats.age} value={String(user.age)} />
                  <ProfileStat 
                    label={PROFILE_PAGE_COPY.stats.plan} 
                    value={
                      planLabel(user.plan) + 
                      (user.subscriptionEndDate && user.plan !== "free"
                        ? ` (HSD: ${formatExpiryDate(user.subscriptionEndDate)})` 
                        : "")
                    } 
                  />
                  <ProfileStat label={PROFILE_PAGE_COPY.stats.xp} value={String(user.xp)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <HighlightCard icon={Flame} label="Streak" value={`${data?.summary.streak ?? user.streak} ngày`} />
                <HighlightCard icon={Sparkles} label="Điểm quiz" value={String(data?.summary.quizScore ?? user.quizScore)} />
                <HighlightCard icon={Star} label="Tiến độ" value={`${data?.summary.progressPercentage ?? 0}%`} />
              </div>
            </div>
          </section>

          {error ? (
            <div className="rounded-[1.8rem] border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <section id={PROFILE_PAGE_COPY.anchors.studySpace} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-panel rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{PROFILE_PAGE_COPY.studySpaceTitle}</p>
                  <h2 className="font-heading text-2xl font-bold">Lối vào nhanh cho hành trình của bạn</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{PROFILE_PAGE_COPY.studySpaceDescription}</p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <QuickLinkCard
                  to="/dashboard"
                  title="Bảng điều khiển học tập"
                  description="Theo dõi tiến độ bài đang học và nhịp hoàn thành gần đây."
                />
                <QuickLinkCard
                  to={data?.nextLesson ? `/lesson/${data.nextLesson.slug}` : "/courses"}
                  title={data?.nextLesson ? data.nextLesson.title : "Chọn bài tiếp theo"}
                  description={data?.nextLesson ? "Mở nhanh bài nên học tiếp." : "Bắt đầu từ chủ đề phù hợp với bạn."}
                />
              </div>
            </div>

            <div className="surface-panel-soft rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bài học gần đây</p>
                  <h2 className="font-heading text-2xl font-bold">Giữ nhịp tiến độ</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {(data?.recentLessons ?? []).slice(0, 4).map((lesson) => (
                  <Link
                    key={lesson.slug}
                    to={`/lesson/${lesson.slug}`}
                    className="block rounded-[1.35rem] border border-white/70 bg-white/74 px-4 py-4 shadow-soft transition-transform hover:-translate-y-0.5"
                  >
                    <p className="font-semibold">{lesson.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Bài {lesson.order}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section id={PROFILE_PAGE_COPY.anchors.favorites} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="surface-panel rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                  <Bookmark className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{PROFILE_PAGE_COPY.favoritesTitle}</p>
                  <h2 className="font-heading text-2xl font-bold">Những nơi nên quay lại</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{PROFILE_PAGE_COPY.favoritesDescription}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {quickFavorites.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-[1.35rem] border border-white/70 bg-white/74 px-4 py-4 text-sm font-semibold shadow-soft transition-transform hover:-translate-y-0.5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div id={PROFILE_PAGE_COPY.anchors.settings} className="surface-panel-soft rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{PROFILE_PAGE_COPY.settingsTitle}</p>
                  <h2 className="font-heading text-2xl font-bold">Cài đặt cá nhân</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{PROFILE_PAGE_COPY.settingsDescription}</p>

              <div className="mt-5 space-y-3">
                <div className="rounded-[1.35rem] border border-white/70 bg-white/74 px-4 py-4 shadow-soft">
                  <p className="font-semibold">Thông báo</p>
                  <p className="mt-1 text-sm text-muted-foreground">Thông báo mới sẽ hiển thị trực tiếp ở biểu tượng chuông cạnh avatar.</p>
                </div>
                <div className="rounded-[1.35rem] border border-white/70 bg-white/74 px-4 py-4 shadow-soft">
                  <p className="font-semibold">Tài khoản</p>
                  <p className="mt-1 text-sm text-muted-foreground">Các lối vào như hồ sơ, study space, yêu thích và đăng xuất nằm trong menu avatar.</p>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileStat({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className="rounded-[1.25rem] bg-white/72 p-4 shadow-soft">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 font-medium ${compact ? "break-all text-sm" : "text-sm"}`}>{value}</p>
    </div>
  );
}

function HighlightCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-panel rounded-[2rem] p-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1rem] bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{label}</p>
      <p className="mt-2 font-heading text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickLinkCard({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link to={to} className="rounded-[1.4rem] border border-white/70 bg-white/74 px-4 py-4 shadow-soft transition-transform hover:-translate-y-0.5">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </Link>
  );
}
