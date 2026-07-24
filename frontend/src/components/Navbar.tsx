import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import { getAvatarTone, getInitials } from "@/lib/avatarTheme";
import { cn } from "@/lib/utils";
import { NAV_COPY } from "@/content/socialCopy";
import type { DashboardResponse, NotificationItem } from "@/types/api";
import { toast } from "sonner";

// Brand Logo image
import imgLogo from "@/assets/home/Logo.png";

const DROPDOWN_CLOSE_DELAY = 800;
const DEFAULT_HEADER_SHELL_WIDTH = "max-w-[1080px]";
const AUTH_HEADER_SHELL_WIDTH = "max-w-[780px]";

const navGroups = [
  { label: NAV_COPY.home, to: "/" },
  { label: NAV_COPY.blog, items: [{ label: NAV_COPY.blogPosts, to: "/blog" }, { label: NAV_COPY.courses, to: "/courses" }, { label: "Thư viện Video", to: "/videos" }] },
  { label: "Nâng cấp VIP", to: "/pricing" },
  {
    label: NAV_COPY.community,
    items: [
      { label: NAV_COPY.games, to: "/games" },
      { label: NAV_COPY.leaderboard, to: "/community/leaderboard" },
      { label: NAV_COPY.discussion, to: "/community" },
    ],
  },
  {
    label: NAV_COPY.about,
    items: [
      { label: NAV_COPY.intro, to: "/about" },
      { label: NAV_COPY.contact, to: "/contact" },
    ],
  },
] as const;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const closeTimerRef = useRef<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dashboardPath = user?.isAdmin ? "/domain/dashboard" : "/dashboard";
  const dropdownThemeClass = theme === "light"
    ? "border-pink-200/90 bg-[linear-gradient(150deg,rgba(255,255,255,0.99)_0%,rgba(253,232,240,0.99)_52%,rgba(255,247,250,0.99)_100%)] shadow-[0_20px_60px_rgba(219,39,119,0.16)]"
    : "border-amber-400/40 bg-[linear-gradient(150deg,rgba(30,22,5,0.99)_0%,rgba(73,50,7,0.99)_52%,rgba(38,27,5,0.99)_100%)] text-amber-50 shadow-[0_20px_60px_rgba(245,158,11,0.2)] [&_.text-foreground]:text-amber-50 [&_.text-muted-foreground]:text-amber-100/70";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (!user || user.isAdmin) {
      setNotificationCount(0);
      setNotifications([]);
      return;
    }

    let active = true;

    const loadNotifications = async () => {
      try {
        const response = await apiRequest<DashboardResponse>("/dashboard");
        if (!active) {
          return;
        }
        setNotifications(response.notifications);
        setNotificationCount(response.notifications.filter((item) => !item.read).length);
      } catch (error) {
        if (!active) {
          return;
        }
        if (error instanceof ApiError && error.status === 401) {
          setNotificationCount(0);
          setNotifications([]);
        }
      }
    };

    void loadNotifications();
    const intervalId = window.setInterval(() => void loadNotifications(), 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [user]);

  const handleAcceptInvite = async (slug: string) => {
    try {
      await apiRequest(`/community/chat-rooms/${slug}/accept`, { method: "POST" });
      toast.success("Đã đồng ý tham gia nhóm chat.");
      const response = await apiRequest<DashboardResponse>("/dashboard");
      setNotifications(response.notifications);
      setNotificationCount(response.notifications.filter((item) => !item.read).length);
      window.dispatchEvent(new Event("chat_room_update"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleRejectInvite = async (slug: string) => {
    try {
      await apiRequest(`/community/chat-rooms/${slug}/reject`, { method: "POST" });
      toast.success("Đã từ chối lời mời.");
      const response = await apiRequest<DashboardResponse>("/dashboard");
      setNotifications(response.notifications);
      setNotificationCount(response.notifications.filter((item) => !item.read).length);
      window.dispatchEvent(new Event("chat_room_update"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Có lỗi xảy ra");
    }
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => () => clearCloseTimer(), []);

  const latestNotifications = notifications.slice(0, 6);

  return (
    <nav className="sticky top-4 z-50 bg-transparent px-3 sm:px-4">
      <div
        data-ui="floating-header-shell"
        className={cn(
          "mx-auto flex w-full items-center rounded-full border px-4 backdrop-blur-xl transition-all duration-300 lg:px-5",
          theme === "light"
            ? "border-pink-200/80 bg-white/95 text-slate-800 shadow-[0_10px_35px_rgba(236,72,153,0.12)]"
            : "border-indigo-400/30 bg-[#161038]/85 text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
          DEFAULT_HEADER_SHELL_WIDTH,
        )}
      >
        <div className="flex min-h-[64px] w-full items-center gap-2 lg:min-h-[72px]">
          <div className="flex items-center">
            <Link
              to="/"
              aria-label="EDUcare — Giáo dục giới tính"
              className={cn(
                "group inline-flex items-center gap-2.5 rounded-full border p-1.5 pr-4 backdrop-blur-md transition-all hover:scale-105",
                theme === "light"
                  ? "border-pink-300/60 bg-pink-50/80 shadow-[0_4px_16px_rgba(236,72,153,0.15)]"
                  : "border-indigo-300/40 bg-[#251a59]/90 shadow-[0_6px_20px_rgba(129,140,248,0.25)]"
              )}
            >
              <img
                src={imgLogo}
                alt="EDUcare Logo"
                className="h-11 w-11 shrink-0 rounded-full object-cover shadow-sm border border-amber-300/60 contrast-[1.12] saturate-[1.3]"
              />
              <span className={cn(
                "font-heading text-lg font-bold tracking-wide transition-colors",
                theme === "light" ? "text-pink-600 group-hover:text-pink-700" : "text-white group-hover:text-amber-300"
              )}>
                EDUcare
              </span>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-1 pr-6 lg:flex xl:pr-8">
            {navGroups.map((group) =>
              "items" in group ? (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => {
                    clearCloseTimer();
                    setOpenDropdown(group.label);
                  }}
                  onMouseLeave={() => {
                    clearCloseTimer();
                    closeTimerRef.current = window.setTimeout(
                      () => setOpenDropdown((current) => (current === group.label ? null : current)),
                      DROPDOWN_CLOSE_DELAY,
                    );
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      clearCloseTimer();
                      setOpenDropdown((current) => (current === group.label ? null : group.label));
                    }}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 font-heading text-[14px] font-semibold tracking-wide transition-colors",
                      theme === "light"
                        ? openDropdown === group.label ? "text-pink-600 bg-pink-100/70" : "text-slate-700 hover:text-pink-600 hover:bg-pink-50"
                        : openDropdown === group.label ? "text-amber-300 bg-white/10" : "text-indigo-100/90 hover:text-white hover:bg-white/10",
                    )}
                  >
                    {group.label}
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openDropdown === group.label && "rotate-180")} />
                  </button>

                  {openDropdown === group.label ? (
                    <div className={cn(
                      "absolute left-0 top-full z-20 mt-3 min-w-[220px] rounded-[1.2rem] border p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl",
                      theme === "light"
                        ? "border-pink-200 bg-[linear-gradient(150deg,rgba(255,255,255,0.99),rgba(253,232,240,0.99))] text-slate-800"
                        : "border-amber-400/40 bg-[linear-gradient(150deg,rgba(30,22,5,0.99),rgba(73,50,7,0.99))] text-amber-50"
                    )}>
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={cn(
                            "block rounded-[0.9rem] px-4 py-2.5 font-heading text-[14px] font-semibold transition-colors",
                            theme === "light"
                              ? location.pathname === item.to ? "bg-pink-100/80 text-pink-600 font-bold" : "text-slate-700 hover:bg-pink-50 hover:text-pink-600"
                              : location.pathname === item.to ? "bg-amber-400/20 text-amber-300 font-bold" : "text-amber-50/90 hover:bg-amber-400/15 hover:text-amber-300"
                          )}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={group.to}
                  to={group.to}
                  className={cn(
                    "rounded-full px-4 py-2 font-heading text-[14px] font-semibold tracking-wide transition-colors",
                    theme === "light"
                      ? location.pathname === group.to ? "text-pink-600 bg-pink-100/70 font-bold" : "text-slate-700 hover:text-pink-600 hover:bg-pink-50"
                      : location.pathname === group.to ? "text-amber-300 bg-white/10 font-bold" : "text-indigo-100/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {group.label}
                </Link>
              ),
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
                theme === "light"
                  ? "bg-pink-100/80 text-pink-600 hover:bg-pink-200 hover:scale-110 shadow-sm"
                  : "bg-indigo-900/60 text-amber-300 hover:bg-indigo-800 hover:scale-110 shadow-sm"
              )}
              title={theme === "light" ? "Chuyển sang Giao diện Tối (Dark)" : "Chuyển sang Giao diện Sáng (Light)"}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {user ? (
              <>
                {!user.isAdmin ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="relative rounded-xl p-2 text-indigo-200 transition-colors hover:bg-white/15 hover:text-white"
                        title={NAV_COPY.notifications}
                      >
                        <Bell className="h-5 w-5" />
                        {notificationCount > 0 ? (
                          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white shadow-md">
                            {notificationCount > 9 ? "9+" : notificationCount}
                          </span>
                        ) : null}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className={cn("w-[360px] rounded-[1.35rem] p-2 backdrop-blur-md", dropdownThemeClass)}
                    >
                      <DropdownMenuLabel className="px-3 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">{NAV_COPY.notifications}</p>
                            <p className="text-xs text-muted-foreground">Cập nhật mới từ bài học, cộng đồng, chat và phản hồi riêng.</p>
                          </div>
                          <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
                            {notificationCount > 0 ? `${notificationCount} mới` : "Ổn định"}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/70" />
                      <div className="max-h-[380px] overflow-y-auto px-1 py-1">
                        {latestNotifications.length === 0 ? (
                          <div className="rounded-[1rem] bg-white/65 px-4 py-4 text-sm text-muted-foreground">
                            Hiện chưa có thông báo mới.
                          </div>
                        ) : (
                          latestNotifications.map((notification) => (
                            <div key={notification.id} className="mb-2 rounded-[1rem] bg-white/66 px-4 py-3 shadow-soft last:mb-0">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                                {!notification.read ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" /> : null}
                              </div>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">{notification.message}</p>
                              {notification.type.startsWith("chat_invite:") && !notification.read ? (
                                <div className="mt-2 flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptInvite(notification.type.replace("chat_invite:", ""))}
                                    className="bg-primary text-white text-xs px-3 py-1 h-7 rounded-lg hover:bg-primary/90"
                                  >
                                    Đồng ý
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectInvite(notification.type.replace("chat_invite:", ""))}
                                    className="bg-transparent border-red-200 text-red-600 text-xs px-3 py-1 h-7 rounded-lg hover:bg-red-50 hover:text-red-700"
                                  >
                                    Từ chối
                                  </Button>
                                </div>
                              ) : null}
                              <p className="mt-2 text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-2 py-1.5 shadow-soft transition-colors hover:bg-white/88">
                      <Avatar className="h-10 w-10 border border-white/70 shadow-soft">
                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(user.fullName)} text-sm font-bold text-foreground`}>
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold text-foreground">{user.fullName.split(" ").pop()}</p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {user.isAdmin ? NAV_COPY.admin : user.username}
                        </p>
                      </div>
                      <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={cn("w-64 rounded-[1.2rem] p-2 backdrop-blur-md", dropdownThemeClass)}
                  >
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border border-white/70">
                          <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(user.fullName)} text-sm font-bold text-foreground`}>
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                          {user.isAdmin ? (
                            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                              <Shield className="h-3 w-3" />
                              {NAV_COPY.admin}
                            </p>
                          ) : (
                            <div className="flex gap-1.5 flex-wrap mt-1">
                              {user.plan === "popular" && (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-primary shadow-soft">
                                  VIP ⚡
                                </span>
                              )}
                              {user.plan === "premium" && (
                                <span className="inline-flex items-center rounded-full bg-pink-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-pink-600 shadow-soft">
                                  PREMIUM 💎
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/70" />
                    <DropdownMenuItem asChild className="rounded-[0.9rem] px-3 py-3">
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        {NAV_COPY.profile}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-[0.9rem] px-3 py-3">
                      <Link to={dashboardPath}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {NAV_COPY.studySpace}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-[0.9rem] px-3 py-3">
                      <Link to="/profile#favorites">
                        <Heart className="mr-2 h-4 w-4" />
                        {NAV_COPY.favorites}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-[0.9rem] px-3 py-3">
                      <Link to="/profile#settings">
                        <Settings className="mr-2 h-4 w-4" />
                        {NAV_COPY.settings}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/70" />
                    <DropdownMenuItem
                      className="rounded-[0.9rem] px-3 py-3 text-destructive focus:bg-destructive/10 focus:text-destructive"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {NAV_COPY.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden items-center sm:flex">
                <Link to="/login">
                  <Button size="sm" className="magic-btn-primary h-10 rounded-full px-6 text-sm font-extrabold shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
                    {NAV_COPY.login}
                  </Button>
                </Link>
              </div>
            )}

            <button className="rounded-xl p-2 transition-colors hover:bg-muted lg:hidden" onClick={() => setMobileOpen((value) => !value)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="mx-auto mt-3 w-full max-w-[1080px] space-y-4 rounded-[2rem] border border-sky-200/50 bg-[linear-gradient(150deg,rgba(240,249,255,0.97)_0%,rgba(224,242,254,0.98)_55%,rgba(240,249,255,0.97)_100%)] p-4 shadow-[0_16px_50px_rgba(14,116,144,0.12)] backdrop-blur-md lg:hidden">
          {navGroups.map((group) =>
            "items" in group ? (
              <div key={group.label}>
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{group.label}</p>
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground/75 hover:bg-muted hover:text-foreground">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={group.to} to={group.to} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground/75 hover:bg-muted hover:text-foreground">
                {group.label}
              </Link>
            ),
          )}

          {user ? (
            <>
              {!user.isAdmin ? (
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground/75 hover:bg-muted">
                  {NAV_COPY.profile}
                </Link>
              ) : null}
              <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground/75 hover:bg-muted">
                {NAV_COPY.studySpace}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-muted"
              >
                {NAV_COPY.logout}
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="ghost" className="w-full" size="sm">
                  {NAV_COPY.login}
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
