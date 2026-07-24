import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Zap, Gamepad2, Sparkles, Search, Crown } from "lucide-react";

import { GAME_DISPLAY_BY_SLUG, GAMES_PAGE_COPY } from "@/content/pageCopy";
import { getGamePhoto } from "@/lib/contentMedia";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Game } from "@/types/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

function gameBadge(game: Game) {
  if (game.gameType === "FLASH") return "🎮 Game Tình Huống 3D";
  if (game.slug.includes("long")) return "🏆 Thách Thức Chuyên Sâu";
  return "⚡ Trắc Nghiệm Nhanh";
}

function getDisplayGame(game: Game) {
  const display = GAME_DISPLAY_BY_SLUG[game.slug as keyof typeof GAME_DISPLAY_BY_SLUG];
  return { ...game, title: display?.title ?? game.title, summary: display?.summary ?? game.summary };
}

/* ── Preferred display order by slug ── */
const GAME_ORDER = [
  "anh-sang-tu-tin",
  "emotion-sort",
  "myth-buster",
  "safe-swipe",
  "chat-detective",
  "red-flag-hunt",
  "teen-path",
  "quiz-quick",
  "quiz-long",
];

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    void apiRequest<Game[]>("/games")
      .then((response) => {
        const published = response.filter((item) => item.published);
        published.sort((a, b) => {
          const ai = GAME_ORDER.indexOf(a.slug);
          const bi = GAME_ORDER.indexOf(b.slug);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });
        setGames(published);
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : GAMES_PAGE_COPY.loadError);
      });
  }, []);

  const displayGames = games.map(getDisplayGame);

  const filteredGames = displayGames.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "3D") {
      return matchesSearch && (game.gameType === "FLASH" || game.slug.includes("anh-sang") || game.slug.includes("detective"));
    }
    if (selectedCategory === "QUIZ") {
      return matchesSearch && (game.slug.includes("quiz") || game.slug.includes("myth"));
    }
    if (selectedCategory === "ACTION") {
      return matchesSearch && (game.slug.includes("swipe") || game.slug.includes("emotion") || game.slug.includes("hunt") || game.slug.includes("path"));
    }
    return matchesSearch;
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
        style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
      >
        {/* Background Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
          <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
          <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Title Section */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <Gamepad2 className="h-4 w-4 text-amber-300" />
              <span>Đấu Trường Tri Thức – Trải Nghiệm 3D</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              Góc Trò Chơi Tương Tác <br />
              <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
                Học Tập & Tích Lũy Điểm XP
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto max-w-2xl text-sm md:text-base font-medium text-indigo-100/80 mt-4 leading-relaxed"
            >
              Rèn luyện kỹ năng xử lý tình huống thực tế, phân biệt tin đồn chuẩn y khoa và chinh phục bảng xếp hạng cùng cộng đồng EDUcare.
            </motion.p>
          </div>

          {/* Search & Category Filter Section (Transparent Background) */}
          <div className="flex flex-col gap-5 bg-transparent p-0 mb-10">
            {/* Search Bar Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trò chơi tình huống, trắc nghiệm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 w-full rounded-none border border-indigo-400/30 bg-slate-900/60 backdrop-blur-md pl-11 pr-10 text-sm shadow-inner transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none text-slate-100 placeholder:text-slate-400"
                />
              </div>

              <Link
                to="/community/leaderboard"
                className="inline-flex items-center gap-2 rounded-none border border-amber-400/40 bg-amber-950/40 px-5 py-3 text-xs font-black uppercase tracking-wider text-amber-300 hover:bg-amber-900/60 transition-all backdrop-blur-md shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Xem Bảng Xếp Hạng</span>
              </Link>
            </div>

            {/* Square Text-Only Category Filter Tabs (Radius=0, Transparent Glass) */}
            <div className="flex flex-col gap-2.5 border-t border-slate-700/50 pt-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Danh mục trò chơi:</span>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 flex-nowrap w-full scroll-smooth">
                {[
                  { id: "ALL", label: "Tất cả trò chơi" },
                  { id: "3D", label: "Chuyên sâu 3D" },
                  { id: "QUIZ", label: "Trắc nghiệm XP" },
                  { id: "ACTION", label: "Tình huống phản xạ" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-none text-xs font-extrabold tracking-wide uppercase transition-all duration-200 shrink-0 ${
                      selectedCategory === cat.id
                        ? "border-2 border-cyan-400 bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "border border-slate-700/70 bg-slate-900/60 backdrop-blur-md text-slate-300 hover:border-slate-500 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-auto max-w-md mb-8 rounded-none bg-rose-950/80 border border-rose-500/40 p-4 text-center text-sm font-semibold text-rose-200 backdrop-blur-md shadow-lg">
              {error}
            </div>
          )}

          {/* Modern 3D Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
            {filteredGames.map((game, index) => {
              const isImplemented = supportedPlayPaths.has(game.playPath);

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className={`group relative rounded-none border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] ${
                    !isImplemented ? "opacity-70" : ""
                  }`}
                >
                  <div>
                    {/* Game Cover 2D Art Thumbnail with Overlay Badges */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-none bg-slate-950/80 border border-slate-700/50 mb-5 p-2">
                      <img
                        src={getGamePhoto(game)}
                        alt={`Ảnh trò chơi ${game.title}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Top-Left EXP Bonus Label Badge */}
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-none border border-amber-400/50 bg-slate-950/90 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-300 backdrop-blur-md shadow-md">
                        <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span>+100 XP</span>
                      </span>

                      {/* Top-Right Category Badge Tag */}
                      <span className="absolute top-3 right-3 rounded-none border border-cyan-400/40 bg-slate-950/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300 backdrop-blur-md shadow-md">
                        {gameBadge(game)}
                      </span>
                    </div>

                    {/* Game Title & Summary */}
                    <div className="text-center">
                      <h3 className="font-heading text-lg md:text-xl font-extrabold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs md:text-sm font-medium text-indigo-100/80 mt-2 line-clamp-2 leading-relaxed">
                        {game.summary}
                      </p>
                    </div>
                  </div>

                  {/* Centered Action Button */}
                  <div className="mt-6 pt-4 border-t border-indigo-500/20 flex justify-center">
                    {isImplemented ? (
                      <Link
                        to={game.playPath}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 py-3 text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all text-center"
                      >
                        <Gamepad2 className="h-4 w-4" />
                        <span>Chơi ngay</span>
                      </Link>
                    ) : (
                      <span className="w-full text-center rounded-none border border-slate-700/60 bg-slate-800/40 py-2.5 text-[11px] font-bold text-slate-400">
                        Đang phát triển
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Garden Leaderboard CTA Banner */}
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-4xl rounded-none border border-indigo-500/30 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left max-w-lg">
                  <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-xs uppercase tracking-widest mb-1.5">
                    <Crown className="h-4 w-4 text-amber-400" />
                    <span>Sẵn sàng chinh phục bảng xếp hạng</span>
                  </div>
                  <h4 className="font-heading font-extrabold text-white text-lg sm:text-xl">
                    Leo Top XP & Nhận Huy Hiệu Vinh Danh
                  </h4>
                  <p className="text-xs sm:text-sm text-indigo-100/70 font-medium mt-1">
                    Hoàn thành các thử thách tình huống hàng ngày để duy trì chuỗi Streak và nhận phần thưởng đặc quyền.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/games/quiz?mode=quick"
                    className="inline-flex items-center gap-2 rounded-none bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Thử thách nhanh</span>
                  </Link>
                  <Link
                    to="/community/leaderboard"
                    className="inline-flex items-center gap-2 rounded-none border border-indigo-400/30 bg-indigo-950/50 px-6 py-3 text-xs font-black uppercase tracking-wider text-indigo-200 hover:bg-indigo-900/80 transition-all"
                  >
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <span>Xem Bảng Xếp Hạng</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

