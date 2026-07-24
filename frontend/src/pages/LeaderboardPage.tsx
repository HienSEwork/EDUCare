import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Crown, 
  Flame, 
  Star, 
  Trophy, 
  CheckCircle2, 
  Gift, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";

import { LEADERBOARD_PAGE_COPY } from "@/content/socialCopy";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarTone, getInitials } from "@/lib/avatarTheme";
import type { LeaderboardResponse } from "@/types/api";

import quizQuick3d from "@/assets/games/quiz-quick-3d.png";

// Laurel Wreath SVG Left Branch
function LaurelWreathLeft({ className = "w-7 h-16 text-amber-600/70" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 100" fill="none" stroke="currentColor">
      <path d="M 28,10 C 20,25 15,45 15,65 C 15,80 20,90 28,95" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 28,10 C 18,12 12,20 16,28 C 20,24 25,20 28,10" fill="currentColor" opacity="0.85" />
      <path d="M 24,28 C 12,32 8,42 14,48 C 18,44 22,38 24,28" fill="currentColor" opacity="0.85" />
      <path d="M 20,48 C 8,52 6,64 12,70 C 16,65 20,58 20,48" fill="currentColor" opacity="0.85" />
      <path d="M 20,68 C 10,74 10,84 18,88 C 20,82 22,76 20,68" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

// Laurel Wreath SVG Right Branch
function LaurelWreathRight({ className = "w-7 h-16 text-amber-600/70" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 100" fill="none" stroke="currentColor">
      <path d="M 12,10 C 20,25 25,45 25,65 C 25,80 20,90 12,95" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 12,10 C 22,12 28,20 24,28 C 20,24 15,20 12,10" fill="currentColor" opacity="0.85" />
      <path d="M 16,28 C 28,32 32,42 26,48 C 22,44 18,38 16,28" fill="currentColor" opacity="0.85" />
      <path d="M 20,48 C 32,52 34,64 28,70 C 24,65 20,58 20,48" fill="currentColor" opacity="0.85" />
      <path d="M 20,68 C 30,74 30,84 22,88 C 20,82 18,76 20,68" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardResponse["entries"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState("week");

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

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const top1 = entries[0];
  const top2 = entries[1];
  const top3 = entries[2];
  const listEntries = useMemo(() => entries.slice(3), [entries]);

  const currentUserEntry = useMemo(() => {
    if (!user) return null;
    return entries.find((entry) => entry.name === user.fullName) ?? null;
  }, [entries, user]);

  return (
    <div className="min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      {/* 1. HERO BANNER SECTION */}
      <section className="relative mb-14 w-full overflow-hidden">
        <div className="site-shell relative z-10 px-5 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            {/* Left Copy */}
            <motion.div
              className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Flame className="h-4 w-4 text-amber-300 animate-pulse" />
                <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-cyan-300">
                  Bảng xếp hạng Streak Online
                </span>
              </div>

              <h1 className="page-hero-title mt-3 text-white">
                <span className="block">Giữ streak đều,</span>
                <span className="block bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200 bg-clip-text text-transparent">
                  vững nhịp tiến bộ
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-indigo-100/80 md:text-lg md:leading-8 lg:mx-0">
                Học đều mỗi ngày, tiến xa hơn mỗi ngày! Bảng xếp hạng Streak Online vinh danh những học viên chăm chỉ và kiên trì nhất trong cộng đồng EDUcare.
              </p>

              {/* Action & Feature Highlights */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  to="/courses"
                  className="magic-btn-primary h-12 rounded-full px-7 text-sm font-extrabold text-slate-950 shadow-xl flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span>Tham gia thử thách</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex flex-wrap justify-center gap-2 text-xs font-bold text-indigo-200 lg:justify-start">
                  <div className="flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-900/40 px-3.5 py-2 backdrop-blur-md">
                    <Flame className="h-4 w-4 text-white" />
                    <span>Học đều mỗi ngày</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-900/40 px-3.5 py-2 backdrop-blur-md">
                    <Trophy className="h-4 w-4 text-white" />
                    <span>Vinh danh hàng tuần</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-900/40 px-3.5 py-2 backdrop-blur-md">
                    <Gift className="h-4 w-4 text-white" />
                    <span>Quà tặng hấp dẫn</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right 3D Trophy Banner Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mx-auto flex w-full max-w-[420px] items-center justify-center lg:mx-0 lg:justify-self-end"
            >
              <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl border border-indigo-400/30 bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-slate-950/80 p-6 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-amber-500/10" />
                <img 
                  src={quizQuick3d} 
                  alt="3D Trophy Leaderboard" 
                  className="h-64 w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] animate-pulse"
                  style={{ animationDuration: '4s' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="site-shell px-4">
        {error ? (
          <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {/* 2. TOP 1, 2, 3 PODIUM SECTION (Reference small photo style) */}
        {!isLoading && entries.length > 0 && (
          <section className="mb-14">
            <div className="grid gap-6 md:grid-cols-3 lg:gap-8 items-end max-w-5xl mx-auto">
              
              {/* TOP 2 PODIUM CARD (Left) */}
              {top2 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-b from-[#fce4ec] via-[#f3e5f5] to-[#e8eaf6] text-slate-950 border-2 border-slate-300 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center"
                >
                  {/* Medal Badge Top Left */}
                  <div className="absolute top-4 left-4 h-9 w-9 bg-slate-300 text-slate-950 font-black rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm z-20">
                    2
                  </div>
                  
                  {/* Silver Crown Floating Top Right */}
                  <div className="absolute top-4 right-4 text-slate-400">
                    <Crown className="h-6 w-6 fill-slate-300" />
                  </div>

                  {/* Avatar Container with Laurel Wreath */}
                  <div className="mt-3 relative flex items-center justify-center w-full my-2">
                    <LaurelWreathLeft className="w-8 h-20 text-indigo-400/80 -mr-2" />
                    <Avatar className="h-20 w-20 border-4 border-slate-300 shadow-xl z-10">
                      <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(top2.avatar || top2.name)} text-xl font-bold text-white`}>
                        {getInitials(top2.name)}
                      </AvatarFallback>
                    </Avatar>
                    <LaurelWreathRight className="w-8 h-20 text-indigo-400/80 -ml-2" />
                  </div>

                  {/* Username & VIP tag */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <h3 className="font-heading text-lg font-extrabold text-slate-950">{top2.name}</h3>
                    <span className="bg-purple-900 text-purple-100 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-400/40">VIP</span>
                  </div>

                  {/* Streak & XP */}
                  <div className="mt-2 flex items-center justify-center gap-1 text-sm font-black text-slate-900">
                    <span className="text-amber-500">🔥</span>
                    <span>{top2.streak} ngày streak</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-600 mt-0.5">{top2.xp} XP</div>

                  {/* Quote Motto */}
                  <p className="mt-3 text-xs italic text-slate-600 line-clamp-1 max-w-[200px]">
                    "Học hôm nay, thành công ngày mai!"
                  </p>

                  {/* Bottom 3-Column Mini Stats */}
                  <div className="mt-5 grid grid-cols-3 gap-2 w-full pt-4 border-t border-slate-300/80 text-center">
                    <div className="bg-white/60 rounded-xl p-2">
                      <BookOpen className="h-3.5 w-3.5 mx-auto text-indigo-600 mb-1" />
                      <div className="text-xs font-black text-slate-900">{Math.max(1, Math.round((top2.quizScore || 100) / 45))}</div>
                      <div className="text-[9px] text-slate-500 font-bold">Khóa học</div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-2">
                      <Clock className="h-3.5 w-3.5 mx-auto text-indigo-600 mb-1" />
                      <div className="text-xs font-black text-slate-900">{Math.round((top2.streak || 10) * 2.2)}h</div>
                      <div className="text-[9px] text-slate-500 font-bold">Thời gian học</div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-2">
                      <Star className="h-3.5 w-3.5 mx-auto text-indigo-600 mb-1" />
                      <div className="text-xs font-black text-slate-900">{(top2.quizScore || 0).toLocaleString()}</div>
                      <div className="text-[9px] text-slate-500 font-bold">Điểm tích lũy</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TOP 1 PODIUM CARD (Center - Elevated with 3D Gold Base) */}
              {top1 && (
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-gradient-to-b from-[#fff7d6] via-[#fff3be] to-[#ffe599] text-slate-950 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center z-20 transform lg:-translate-y-4"
                  >
                    {/* Gold Medal Badge Top Left */}
                    <div className="absolute top-4 left-4 h-9 w-9 bg-amber-400 text-slate-950 font-black rounded-full border-2 border-amber-200 shadow-md flex items-center justify-center text-sm z-20">
                      1
                    </div>

                    {/* Gold Crown Floating Top Right */}
                    <div className="absolute top-4 right-4 text-amber-600 animate-bounce">
                      <Crown className="h-7 w-7 fill-amber-400" />
                    </div>

                    {/* Avatar Container with Gold Laurel Wreath */}
                    <div className="mt-2 relative flex items-center justify-center w-full my-2">
                      <LaurelWreathLeft className="w-9 h-22 text-amber-600 -mr-2" />
                      <Avatar className="h-24 w-24 border-4 border-amber-400 shadow-2xl z-10">
                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(top1.avatar || top1.name)} text-2xl font-black text-white`}>
                          {getInitials(top1.name)}
                        </AvatarFallback>
                      </Avatar>
                      <LaurelWreathRight className="w-9 h-22 text-amber-600 -ml-2" />
                    </div>

                    {/* Username & VIP tag */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <h3 className="font-heading text-xl font-extrabold text-slate-950">{top1.name}</h3>
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">👑 VIP</span>
                    </div>

                    {/* Streak & XP */}
                    <div className="mt-2 flex items-center justify-center gap-1 text-base font-black text-slate-950">
                      <span className="text-amber-600 animate-pulse">🔥</span>
                      <span>{top1.streak} ngày streak</span>
                    </div>
                    <div className="text-xs font-black text-amber-800 mt-0.5">{top1.xp} XP</div>

                    {/* Quote Motto */}
                    <p className="mt-3 text-xs italic text-amber-900 font-semibold line-clamp-1 max-w-[220px]">
                      "Kiên trì là chìa khóa của mọi thành công!"
                    </p>

                    {/* Bottom 3-Column Mini Stats */}
                    <div className="mt-5 grid grid-cols-3 gap-2 w-full pt-4 border-t border-amber-300/80 text-center">
                      <div className="bg-white/70 rounded-xl p-2 shadow-sm">
                        <BookOpen className="h-3.5 w-3.5 mx-auto text-amber-700 mb-1" />
                        <div className="text-xs font-black text-slate-950">{Math.max(1, Math.round((top1.quizScore || 100) / 40))}</div>
                        <div className="text-[9px] text-amber-800 font-bold">Khóa học</div>
                      </div>
                      <div className="bg-white/70 rounded-xl p-2 shadow-sm">
                        <Clock className="h-3.5 w-3.5 mx-auto text-amber-700 mb-1" />
                        <div className="text-xs font-black text-slate-950">{Math.round((top1.streak || 10) * 2.5)}h</div>
                        <div className="text-[9px] text-amber-800 font-bold">Thời gian học</div>
                      </div>
                      <div className="bg-white/70 rounded-xl p-2 shadow-sm">
                        <Star className="h-3.5 w-3.5 mx-auto text-amber-700 mb-1" />
                        <div className="text-xs font-black text-slate-950">{(top1.quizScore || 0).toLocaleString()}</div>
                        <div className="text-[9px] text-amber-800 font-bold">Điểm tích lũy</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 3D Gold Oval Pedestal Base (Gờ Bệ Vàng 3D) */}
                  <div className="w-full max-w-[260px] h-6 rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-[0_12px_24px_rgba(245,158,11,0.6)] border-2 border-amber-200 mx-auto -mt-3 relative z-10" />
                </div>
              )}

              {/* TOP 3 PODIUM CARD (Right) */}
              {top3 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-b from-[#ffe0b2] via-[#fff3e0] to-[#ffcc80] text-slate-950 border-2 border-orange-300 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center"
                >
                  {/* Bronze Medal Badge Top Left */}
                  <div className="absolute top-4 left-4 h-9 w-9 bg-orange-300 text-slate-950 font-black rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm z-20">
                    3
                  </div>

                  {/* Crown Floating Top Right */}
                  <div className="absolute top-4 right-4 text-orange-500">
                    <Crown className="h-6 w-6 fill-orange-300" />
                  </div>

                  {/* Avatar Container with Laurel Wreath */}
                  <div className="mt-3 relative flex items-center justify-center w-full my-2">
                    <LaurelWreathLeft className="w-8 h-20 text-orange-600/80 -mr-2" />
                    <Avatar className="h-20 w-20 border-4 border-orange-300 shadow-xl z-10">
                      <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(top3.avatar || top3.name)} text-xl font-bold text-white`}>
                        {getInitials(top3.name)}
                      </AvatarFallback>
                    </Avatar>
                    <LaurelWreathRight className="w-8 h-20 text-orange-600/80 -ml-2" />
                  </div>

                  {/* Username & VIP tag */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <h3 className="font-heading text-lg font-extrabold text-slate-950">{top3.name}</h3>
                    <span className="bg-purple-900 text-purple-100 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-400/40">VIP</span>
                  </div>

                  {/* Streak & XP */}
                  <div className="mt-2 flex items-center justify-center gap-1 text-sm font-black text-slate-900">
                    <span className="text-amber-500">🔥</span>
                    <span>{top3.streak} ngày streak</span>
                  </div>
                  <div className="text-xs font-extrabold text-orange-950 mt-0.5">{top3.xp} XP</div>

                  {/* Quote Motto */}
                  <p className="mt-3 text-xs italic text-orange-950 font-semibold line-clamp-1 max-w-[200px]">
                    "Mỗi bài học là một bước tiến!"
                  </p>

                  {/* Bottom 3-Column Mini Stats */}
                  <div className="mt-5 grid grid-cols-3 gap-2 w-full pt-4 border-t border-orange-300/80 text-center">
                    <div className="bg-white/60 rounded-xl p-2">
                      <BookOpen className="h-3.5 w-3.5 mx-auto text-orange-700 mb-1" />
                      <div className="text-xs font-black text-slate-900">{Math.max(1, Math.round((top3.quizScore || 100) / 50))}</div>
                      <div className="text-[9px] text-slate-600 font-bold">Khóa học</div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-2">
                      <Clock className="h-3.5 w-3.5 mx-auto text-orange-700 mb-1" />
                      <div className="text-xs font-black text-slate-900">{Math.round((top3.streak || 10) * 1.8)}h</div>
                      <div className="text-[9px] text-slate-600 font-bold">Thời gian học</div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-2">
                      <Star className="h-3.5 w-3.5 mx-auto text-orange-700 mb-1" />
                      <div className="text-xs font-black text-slate-900">{(top3.quizScore || 0).toLocaleString()}</div>
                      <div className="text-[9px] text-slate-600 font-bold">Điểm tích lũy</div>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </section>
        )}

        {/* 3. MAIN CONTENT GRID (Left Ranking Table + Right 3 Sidebar Cards) */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* LEFT COLUMN: FULL RANKING TABLE */}
          <section className="bg-indigo-950/70 border border-indigo-400/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            {/* Header + Time Filter Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-indigo-400/20 pb-4">
              <div>
                <h2 className="font-heading text-xl font-extrabold text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-300" />
                  <span>Bảng xếp hạng Streak Online</span>
                </h2>
                <p className="text-xs text-indigo-200/70 mt-1">
                  Top 100 học viên có streak học tập liên tiếp cao nhất tuần này
                </p>
              </div>

              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="h-9 rounded-xl border border-indigo-400/30 bg-indigo-900/60 px-3 text-xs font-extrabold text-white outline-none cursor-pointer backdrop-blur-md"
              >
                <option value="week" className="bg-indigo-950 text-white">Tuần này</option>
                <option value="month" className="bg-indigo-950 text-white">Tháng này</option>
                <option value="all" className="bg-indigo-950 text-white">Tất cả thời gian</option>
              </select>
            </div>

            {/* Ranking Table List */}
            {isLoading ? (
              <div className="py-12 text-center text-sm text-indigo-200/70">Đang tải bảng xếp hạng...</div>
            ) : (
              <div className="space-y-2.5">
                {/* Table Header Row */}
                <div className="grid grid-cols-[40px_1fr_100px_90px_80px] gap-3 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-indigo-300/80 border-b border-indigo-400/20">
                  <span>#</span>
                  <span>Học viên</span>
                  <span className="text-center">Streak</span>
                  <span className="text-center">Thời gian</span>
                  <span className="text-right">Điểm</span>
                </div>

                {/* Ranking Item Rows */}
                {listEntries.map((entry, idx) => {
                  const rankNum = idx + 4;
                  return (
                    <motion.div
                      key={`${entry.name}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="grid grid-cols-[40px_1fr_100px_90px_80px] items-center gap-3 rounded-xl border border-indigo-400/15 bg-indigo-900/40 p-3.5 transition-all hover:bg-indigo-900/70 hover:border-indigo-400/40"
                    >
                      {/* Rank Number */}
                      <span className="font-heading text-sm font-extrabold text-indigo-200">
                        {rankNum}
                      </span>

                      {/* User Info */}
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Avatar className="h-10 w-10 border border-indigo-400/30 shrink-0">
                          <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(entry.avatar || entry.name)} text-xs font-bold text-white`}>
                            {getInitials(entry.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading text-sm font-bold text-white truncate">{entry.name}</span>
                            <span className="bg-amber-400/20 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-amber-400/30">VIP</span>
                          </div>
                        </div>
                      </div>

                      {/* Streak */}
                      <div className="text-center font-bold text-xs text-amber-300 flex items-center justify-center gap-1">
                        <span>{entry.streak} ngày</span>
                        <span>🔥</span>
                      </div>

                      {/* Study Time */}
                      <div className="text-center font-semibold text-xs text-indigo-200">
                        {200 + (100 - rankNum) * 5}h
                      </div>

                      {/* Score & Rank Trend Indicator */}
                      <div className="text-right font-extrabold text-xs text-white flex items-center justify-end gap-1.5">
                        <span>{(entry.quizScore || 1500).toLocaleString()}</span>
                        {idx % 3 === 0 ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />2</span>
                        ) : idx % 3 === 1 ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />1</span>
                        ) : (
                          <span className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5"><TrendingDown className="h-3 w-3" />1</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4 border-t border-indigo-400/20 text-xs text-indigo-200/70">
                  <span>Hiển thị 1 – 15 trong 100 học viên</span>
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 rounded-lg border border-indigo-400/20 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="h-7 w-7 rounded-lg bg-indigo-600 text-white font-bold text-xs">1</button>
                    <button className="h-7 w-7 rounded-lg border border-indigo-400/20 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60 font-bold text-xs">2</button>
                    <button className="h-7 w-7 rounded-lg border border-indigo-400/20 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60 font-bold text-xs">3</button>
                    <button className="p-1.5 rounded-lg border border-indigo-400/20 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: 3 SIDEBAR CARDS */}
          <aside className="space-y-6">
            
            {/* SIDEBAR CARD 1: CÁCH TÍNH STREAK */}
            <div className="bg-indigo-950/70 border border-indigo-400/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-amber-300" />
                <h3 className="font-heading text-base font-extrabold text-white">Cách tính Streak</h3>
              </div>

              <ul className="space-y-2.5 text-xs text-indigo-100/90 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Học ít nhất 15 phút mỗi ngày</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hoàn thành bài học hoặc bài kiểm tra</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Streak sẽ tăng 1 ngày khi hoàn thành điều kiện</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Nếu bỏ lỡ 1 ngày, streak sẽ trở về 0</span>
                </li>
              </ul>

              <Link to="/courses" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:underline">
                <span>Tìm hiểu thêm</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* SIDEBAR CARD 2: PHẦN THƯỞNG TOP ĐẦU */}
            <div className="bg-indigo-950/70 border border-indigo-400/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-amber-300" />
                <h3 className="font-heading text-base font-extrabold text-white">Phần thưởng top đầu 🏆</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <div className="font-extrabold text-xs text-amber-300">Top 1: Gói VIP 3 tháng</div>
                    <div className="text-[11px] text-indigo-200/80">+ Chứng nhận học viên xuất sắc</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center gap-3">
                  <span className="text-2xl">🔮</span>
                  <div>
                    <div className="font-extrabold text-xs text-purple-300">Top 2 – 3: Gói VIP 1 tháng</div>
                    <div className="text-[11px] text-indigo-200/80">+ Huy hiệu đặc biệt</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center gap-3">
                  <span className="text-2xl">💎</span>
                  <div>
                    <div className="font-extrabold text-xs text-cyan-300">Top 4 – 10: Giảm 50%</div>
                    <div className="text-[11px] text-indigo-200/80">Cho khóa học bất kỳ</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR CARD 3: STREAK CỦA BẠN (Current User Entry) */}
            <div className="bg-gradient-to-br from-indigo-900/90 via-purple-950/90 to-slate-950 border border-indigo-400/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-5 w-5 text-amber-300 animate-pulse" />
                <h3 className="font-heading text-base font-extrabold text-white">Streak của bạn</h3>
              </div>

              {user ? (
                <>
                  <div className="flex items-center gap-3.5 mb-4">
                    <Avatar className="h-14 w-14 border-2 border-amber-300 shadow-lg">
                      <AvatarFallback className={`bg-gradient-to-br ${getAvatarTone(user.avatar || user.fullName)} text-lg font-extrabold text-white`}>
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading text-base font-extrabold text-white">{user.fullName}</h4>
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded">VIP</span>
                      </div>
                      <p className="text-xs text-indigo-200/70">@{user.username}</p>
                    </div>
                  </div>

                  <div className="bg-indigo-900/60 border border-indigo-400/20 rounded-xl p-4 text-center mb-4">
                    <div className="text-3xl font-extrabold text-amber-300 flex items-center justify-center gap-1">
                      <span>{currentUserEntry?.streak ?? user.streak ?? 28}</span>
                      <span>ngày 🔥</span>
                    </div>
                    <div className="text-[11px] font-bold text-indigo-200/80 mt-1">Streak hiện tại</div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-[11px] font-bold text-indigo-200 mb-1.5">
                      <span>Học thêm 3 ngày nữa</span>
                      <span className="text-amber-300">Đạt mốc 30 ngày!</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-indigo-950 border border-indigo-400/30 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 w-[85%] rounded-full" />
                    </div>
                  </div>

                  <Link
                    to="/courses"
                    className="magic-btn-primary w-full h-12 rounded-xl text-xs font-extrabold text-slate-950 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <span>Tiếp tục học ngay</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-indigo-200/80 mb-4">Đăng nhập để theo dõi chuỗi Streak của bạn!</p>
                  <Link
                    to="/login"
                    className="magic-btn-primary w-full h-11 rounded-xl text-xs font-extrabold text-slate-950 flex items-center justify-center gap-2"
                  >
                    <span>Đăng nhập ngay</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
