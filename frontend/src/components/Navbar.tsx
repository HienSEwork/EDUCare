import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
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
import { ApiError, apiRequest } from "@/lib/api/client";
import { getAvatarTone, getInitials } from "@/lib/avatarTheme";
import { cn } from "@/lib/utils";
import { NAV_COPY } from "@/content/socialCopy";
import type { DashboardResponse, NotificationItem } from "@/types/api";

const DROPDOWN_CLOSE_DELAY = 800;
const DEFAULT_HEADER_SHELL_WIDTH = "max-w-[1080px]";
const AUTH_HEADER_SHELL_WIDTH = "max-w-[780px]";

const navGroups = [
  { label: NAV_COPY.home, to: "/" },
  { label: NAV_COPY.blog, items: [{ label: NAV_COPY.blogPosts, to: "/blog" }, { label: NAV_COPY.courses, to: "/courses" }] },
  { label: "Nâng cấp VIP 💎", to: "/pricing" },
  {
    label: NAV_COPY.community,
    items: [
      { label: NAV_COPY.games, to: "/games" },
      { label: NAV_COPY.leaderboard, to: "/community/leaderboard" },
      { label: NAV_COPY.discussion, to: "/community" },
      { label: NAV_COPY.chat, to: "/community/chat" },
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
  const location = useLocation();
  const closeTimerRef = useRef<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dashboardPath = user?.isAdmin ? "/admin/dashboard" : "/dashboard";
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
          "mx-auto flex w-full items-center rounded-full border border-white/60 bg-[linear-gradient(135deg,rgba(255,236,243,0.94)_0%,rgba(245,239,255,0.96)_52%,rgba(232,244,255,0.94)_100%)] px-4 shadow-[0_18px_46px_rgba(51,35,87,0.10)] lg:px-5",
          isAuthPage ? AUTH_HEADER_SHELL_WIDTH : DEFAULT_HEADER_SHELL_WIDTH,
        )}
      >
        <div className="flex min-h-[64px] w-full items-center gap-2 lg:min-h-[72px]">
          <div className="flex min-w-[148px] items-center">
            <Link
              to="/"
              aria-label="EDUcare"
              className="group inline-flex items-center rounded-full border border-white/78 bg-white/90 px-4 py-2.5 shadow-[0_12px_28px_rgba(67,43,104,0.12)] transition-transform hover:-translate-y-0.5"
            >
              <span className="bg-[linear-gradient(135deg,#6534e8_0%,#f04fa5_100%)] bg-clip-text font-heading text-[1.22rem] font-bold tracking-[-0.04em] text-transparent lg:text-[1.3rem]">
                EDUcare
              </span>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-0.5 pr-8 lg:flex xl:pr-10">
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
                      "flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors",
                      openDropdown === group.label ? "text-foreground" : "text-foreground/75 hover:text-foreground",
                    )}
                  >
                    {group.label}
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openDropdown === group.label && "rotate-180")} />
                  </button>

                  {openDropdown === group.label ? (
                    <div className="absolute left-0 top-full z-20 mt-3 min-w-[220px] rounded-[1.2rem] border border-white/75 bg-[linear-gradient(150deg,rgba(255,239,245,0.98)_0%,rgba(246,241,255,0.98)_55%,rgba(235,246,255,0.98)_100%)] p-2.5 shadow-[0_28px_80px_rgba(37,30,71,0.18)]">
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={cn(
                            "block rounded-[0.9rem] px-4 py-3 text-[15px] transition-colors hover:bg-white/55",
                            location.pathname === item.to ? "bg-white/65 font-semibold text-foreground" : "text-muted-foreground",
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
                    "rounded-full px-4 py-2 text-[15px] font-semibold transition-colors",
                    location.pathname === group.to ? "text-foreground" : "text-foreground/75 hover:text-foreground",
                  )}
                >
                  {group.label}
                </Link>
              ),
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                {!user.isAdmin ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="relative rounded-xl p-2 transition-colors hover:bg-white/55"
                        title={NAV_COPY.notifications}
                      >
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {notificationCount > 0 ? (
                          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[10px] font-semibold text-white">
                            {notificationCount > 9 ? "9+" : notificationCount}
                          </span>
                        ) : null}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[360px] rounded-[1.35rem] border-white/75 bg-[linear-gradient(150deg,rgba(255,239,245,0.98)_0%,rgba(246,241,255,0.98)_55%,rgba(235,246,255,0.98)_100%)] p-2 shadow-[0_24px_80px_rgba(37,30,71,0.18)]"
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
                    className="w-64 rounded-[1.2rem] border-white/75 bg-[linear-gradient(150deg,rgba(255,239,245,0.98)_0%,rgba(246,241,255,0.98)_55%,rgba(235,246,255,0.98)_100%)] p-2 shadow-[0_24px_80px_rgba(37,30,71,0.18)]"
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
                  <Button variant="ghost" size="sm" className="h-9 rounded-xl px-4 text-sm font-semibold">
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
        <div className="mx-auto mt-3 w-full max-w-[1080px] space-y-4 rounded-[2rem] border border-white/75 bg-[linear-gradient(150deg,rgba(255,239,245,0.97)_0%,rgba(246,241,255,0.98)_55%,rgba(235,246,255,0.97)_100%)] p-4 shadow-[0_18px_50px_rgba(51,35,87,0.16)] lg:hidden">
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
