import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, BookOpen, Flame, Shield, Star, Trophy } from "lucide-react";
import { DASHBOARD_COPY } from "@/content/uiCopy";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { DashboardResponse, Course } from "@/types/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function planLabel(plan: string) {
  if (plan === "free") return DASHBOARD_COPY.planLabels.free;
  if (plan === "popular") return DASHBOARD_COPY.planLabels.popular;
  if (plan === "premium") return DASHBOARD_COPY.planLabels.premium;
  return plan;
}

function notificationTypeLabel(type: string) {
  if (type.startsWith("chat_invite:")) return "Mời vào phòng chat";
  if (type === "system") return DASHBOARD_COPY.notificationTypes.system;
  if (type === "lesson") return DASHBOARD_COPY.notificationTypes.lesson;
  if (type === "community") return DASHBOARD_COPY.notificationTypes.community;
  if (type === "anonymous_question") return "Hộp thư ẩn danh";
  return type;
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [myLearning, setMyLearning] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.isAdmin) {
      return;
    }

    Promise.all([
      apiRequest<DashboardResponse>("/dashboard"),
      apiRequest<Course[]>("/courses/my-learning"),
    ])
      .then(([dashboardData, myCourses]) => {
        setData(dashboardData);
        setMyLearning(myCourses);
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : DASHBOARD_COPY.loadError);
      });
  }, [user]);

  const handleAcceptInvite = async (slug: string) => {
    try {
      await apiRequest(`/community/chat-rooms/${slug}/accept`, { method: "POST" });
      toast.success("Đã đồng ý tham gia nhóm chat.");
      const dashboardData = await apiRequest<DashboardResponse>("/dashboard");
      setData(dashboardData);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleRejectInvite = async (slug: string) => {
    try {
      await apiRequest(`/community/chat-rooms/${slug}/reject`, { method: "POST" });
      toast.success("Đã từ chối lời mời.");
      const dashboardData = await apiRequest<DashboardResponse>("/dashboard");
      setData(dashboardData);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Có lỗi xảy ra");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-3xl gradient-card p-8 shadow-card">{DASHBOARD_COPY.loading}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-destructive shadow-card">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-3xl gradient-card p-8 shadow-card">{DASHBOARD_COPY.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 rounded-[2rem] border border-primary/10 gradient-hero p-8 shadow-card">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
              <Shield className="h-4 w-4" />
              {DASHBOARD_COPY.eyebrow}
            </p>
            <h1 className="font-heading text-3xl font-bold">
              {DASHBOARD_COPY.greeting}, {user.fullName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{DASHBOARD_COPY.description}</p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Star, label: "XP", value: data.summary.xp, color: "bg-pink/20 text-pink-foreground" },
              { icon: Flame, label: DASHBOARD_COPY.stats.streak, value: `${data.summary.streak} ngày`, color: "bg-peach/20 text-peach-foreground" },
              { icon: BookOpen, label: DASHBOARD_COPY.stats.lessons, value: `${data.summary.completedLessons}/${data.summary.totalLessons}`, color: "bg-lavender/20 text-lavender-foreground" },
              { icon: Trophy, label: DASHBOARD_COPY.stats.plan, value: planLabel(data.summary.plan), color: "bg-teal/20 text-teal-foreground" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl gradient-card p-4 shadow-soft">
                <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold capitalize">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Enrolled Courses Progress */}
          <div className="mb-8 rounded-2xl gradient-card p-6 shadow-card">
            <h2 className="mb-4 font-heading text-lg font-bold">Khóa học của tôi (My Learning)</h2>
            {myLearning.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">Bạn chưa đăng ký khóa học nào.</p>
                <Link
                  to="/courses"
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition-all"
                >
                  Khám phá khóa học ngay
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myLearning.map((course) => {
                  const lessonsCount = course.lessons?.length ?? 0;
                  const completedLessonsCount = course.lessons?.filter((l) => user.completedLessons.includes(l.slug)).length ?? 0;
                  const progressPercent = lessonsCount > 0 ? Math.round((completedLessonsCount / lessonsCount) * 100) : 0;

                  return (
                    <Link
                      key={course.id}
                      to={`/course/${course.id}`}
                      className="group flex flex-col justify-between rounded-xl border border-white/60 bg-background/50 p-4 transition-all hover:bg-background/80 hover:shadow-soft"
                    >
                      <div>
                        <div className="flex justify-between items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                            Chi tiết →
                          </span>
                          <span className="text-xs text-muted-foreground font-semibold">
                            {completedLessonsCount}/{lessonsCount} bài học
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-foreground">
                          <span>Tiến độ</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted w-full">
                          <div
                            className="h-full rounded-full gradient-primary transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {data.nextLesson ? (
            <div className="mb-8 rounded-2xl gradient-card p-6 shadow-card">
              <h2 className="mb-3 font-heading text-lg font-bold">{DASHBOARD_COPY.nextLesson}</h2>
              <Link to={`/lesson/${data.nextLesson.slug}`} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary">
                  {data.nextLesson.order}
                </div>
                <div>
                  <h3 className="font-semibold">{data.nextLesson.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {data.nextLesson.isFree ? DASHBOARD_COPY.freeLesson : DASHBOARD_COPY.paidLesson}
                  </p>
                </div>
              </Link>
            </div>
          ) : null}

          <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl gradient-card p-6 shadow-card">
              <h2 className="mb-3 font-heading text-lg font-bold">{DASHBOARD_COPY.recentCompleted}</h2>
              <div className="space-y-2">
                {data.recentLessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{DASHBOARD_COPY.noRecentCompleted}</p>
                ) : (
                  data.recentLessons.map((lesson) => (
                    <Link key={lesson.slug} to={`/lesson/${lesson.slug}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                      <span className="text-mint-foreground">OK</span>
                      <div>
                        <span className="text-sm">{lesson.title}</span>
                        <p className="text-xs text-muted-foreground">
                          {lesson.completedAt ? new Date(lesson.completedAt).toLocaleString() : DASHBOARD_COPY.completed}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl gradient-card p-6 shadow-card">
              <div className="mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-lg font-bold">{DASHBOARD_COPY.notifications}</h2>
              </div>
              <div className="space-y-3">
                {data.notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{DASHBOARD_COPY.noNotifications}</p>
                ) : (
                  data.notifications.map((notification) => (
                    <div key={notification.id} className="rounded-2xl bg-background/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{notificationTypeLabel(notification.type)}</p>
                      <p className="mt-2 font-semibold">{notification.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                      {notification.type.startsWith("chat_invite:") && !notification.read ? (
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptInvite(notification.type.replace("chat_invite:", ""))}
                            className="bg-primary text-white text-xs px-3 py-1 h-8 rounded-xl hover:bg-primary/90"
                          >
                            Đồng ý
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectInvite(notification.type.replace("chat_invite:", ""))}
                            className="bg-transparent border-red-200 text-red-600 text-xs px-3 py-1 h-8 rounded-xl hover:bg-red-50 hover:text-red-700"
                          >
                            Từ chối
                          </Button>
                        </div>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {DASHBOARD_COPY.quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-2xl gradient-card p-4 text-center shadow-soft transition-shadow hover:shadow-hover">
                <p className="text-sm font-medium">{link.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
