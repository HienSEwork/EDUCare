import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUp, BookOpenText, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import heroIllustration from "@/assets/hero-illustration.png";
import { BLOG_DISPLAY_BY_SLUG, BLOG_PAGE_COPY } from "@/content/pageCopy";
import { ApiError, apiRequest } from "@/lib/api/client";
import { getBlogPhoto } from "@/lib/contentMedia";
import type { BlogPost } from "@/types/api";
import { useTheme } from "@/contexts/ThemeContext";

const ALL_CATEGORY = BLOG_PAGE_COPY.allCategory;

const categoryLabels: Record<string, string> = {
  "cam xuc": "Cảm xúc",
  "hoc tap": "Học tập",
  "gia dinh": "Gia đình",
  "ky nang song": "Kỹ năng sống",
  "suc khoe": "Sức khỏe",
  "ho tro": "Hỗ trợ",
  "chuyen gia chia se": "Chuyên gia chia sẻ",
  "video chia se": "Video chia sẻ",
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatCategory(category: string) {
  return categoryLabels[normalizeText(category)] ?? category;
}

function getDisplayPost(post: BlogPost) {
  const display = BLOG_DISPLAY_BY_SLUG[post.slug as keyof typeof BLOG_DISPLAY_BY_SLUG];

  return {
    ...post,
    title: display?.title ?? post.title,
    excerpt: display?.excerpt ?? post.excerpt,
    category: display?.category ?? formatCategory(post.category),
  };
}

export default function BlogPage() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const selectedCategory = searchParams.get("category") || ALL_CATEGORY;
  const searchQuery = searchParams.get("q") || "";
  const [visibleCount, setVisibleCount] = useState(6);
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    void apiRequest<BlogPost[]>("/blog-posts")
      .then((data) => {
        setPosts(data);
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : BLOG_PAGE_COPY.loadError);
      });
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayPosts = useMemo(() => posts.map(getDisplayPost), [posts]);

  const categories = useMemo(
    () => [ALL_CATEGORY, ...new Set(displayPosts.map((post) => post.category))],
    [displayPosts],
  );

  const filteredPosts = useMemo(
    () => displayPosts.filter((post) => {
      const matchesCategory = selectedCategory === ALL_CATEGORY || post.category === selectedCategory;
      const normalizedQuery = normalizeText(searchQuery.trim());
      const matchesQuery = !normalizedQuery || normalizeText(`${post.title} ${post.excerpt} ${post.category}`).includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    }),
    [displayPosts, searchQuery, selectedCategory],
  );

  const setFilter = (key: "category" | "q", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || (key === "category" && value === ALL_CATEGORY)) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const moveSlider = (direction: -1 | 1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({ left: direction * Math.max(280, slider.clientWidth * 0.75), behavior: "smooth" });
  };

  return (
    <div
      className={theme === "light"
        ? "min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 bg-[#fdf6f9] text-slate-800 font-body"
        : "min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      }
      style={{
        background: theme === "light"
          ? "linear-gradient(180deg, #fff0f5 0%, #ffffff 50%, #fdf6f9 100%)"
          : "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)"
      }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}>
        <div className={theme === "light" ? "absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-pink-300/25 blur-[140px]" : "absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]"} />
        <div className={theme === "light" ? "absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-purple-300/20 blur-[150px]" : "absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]"} />
      </div>

      {/* Header Banner Section */}
      <section className="w-full relative overflow-hidden mb-8">
        <div className="site-shell relative z-10 px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-center lg:gap-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px]">
              <span className={theme === "light"
                ? "inline-flex rounded-full border border-pink-200 bg-pink-100/70 px-5 py-2 text-xs font-extrabold tracking-widest text-pink-600 uppercase backdrop-blur-md mb-4 shadow-xs"
                : "inline-flex rounded-full border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              }>
                {BLOG_PAGE_COPY.eyebrow}
              </span>
              <h1 className={theme === "light" ? "page-hero-title mt-4 text-slate-800" : "page-hero-title mt-4 text-white"}>
                <span className="block">{BLOG_PAGE_COPY.titleLine1}</span>
                <span className={theme === "light" ? "mt-1 block bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent" : "mt-1 block bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200 bg-clip-text text-transparent"}>
                  {BLOG_PAGE_COPY.titleLine2}
                </span>
              </h1>
              <p className={theme === "light" ? "mt-4 max-w-[600px] text-base leading-relaxed text-slate-600 md:text-lg" : "mt-4 max-w-[600px] text-base leading-relaxed text-indigo-100/80 md:text-lg"}>
                {BLOG_PAGE_COPY.description}
              </p>

              {/* Dynamic Statistics */}
              <div className={theme === "light" ? "mt-6 flex flex-wrap items-center gap-6 border-t border-pink-100 pt-4 mb-6" : "mt-6 flex flex-wrap items-center gap-6 border-t border-slate-700/50 pt-4 mb-6"}>
                <div>
                  <div className={theme === "light" ? "text-xl font-extrabold text-pink-600 md:text-2xl" : "text-xl font-extrabold text-cyan-300 md:text-2xl"}>{posts.length}</div>
                  <div className={theme === "light" ? "text-xs text-slate-500 font-semibold" : "text-xs text-indigo-200/70 font-semibold"}>Bài viết chia sẻ</div>
                </div>
                <div>
                  <div className={theme === "light" ? "text-xl font-extrabold text-slate-800 md:text-2xl" : "text-xl font-extrabold text-white md:text-2xl"}>{Math.max(1, categories.length - 1)}</div>
                  <div className={theme === "light" ? "text-xs text-slate-500 font-semibold" : "text-xs text-indigo-200/70 font-semibold"}>Chủ đề bài viết</div>
                </div>
              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 }}
              className="flex items-center justify-center lg:ml-auto lg:w-full lg:max-w-[620px]"
            >
              <img
                src={heroIllustration}
                alt={BLOG_PAGE_COPY.imageAlt}
                className="mx-auto max-h-[340px] w-full object-contain drop-shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="site-shell px-4">

        {error ? <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

        {/* Featured posts slider */}
        <section className="mt-8" aria-labelledby="featured-posts-title">
          <div className="mb-5 flex flex-col items-start gap-4 min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between">
            <div>
              <p className={theme === "light" ? "text-xs font-extrabold uppercase tracking-[0.16em] text-pink-600" : "text-xs font-extrabold uppercase tracking-[0.16em] text-amber-300"}>Nổi bật tuần này</p>
              <h2 id="featured-posts-title" className={theme === "light" ? "mt-1 font-heading text-2xl font-bold text-slate-900 sm:text-3xl" : "mt-1 font-heading text-2xl font-bold text-white sm:text-3xl"}>Bài viết dành cho bạn</h2>
            </div>
            <div className="flex self-end gap-2 min-[420px]:self-auto">
              {([-1, 1] as const).map((direction) => (
                <button
                  key={direction}
                  type="button"
                  onClick={() => moveSlider(direction)}
                  aria-label={direction === -1 ? "Bài viết trước" : "Bài viết tiếp theo"}
                  className={theme === "light" ? "flex h-11 w-11 items-center justify-center rounded-full border border-pink-200 bg-white text-slate-700 shadow-sm transition-all hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600" : "flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/25 bg-white/[0.06] text-amber-200 transition-all hover:bg-amber-300/15"}
                >
                  {direction === -1 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </div>

          <div ref={sliderRef} className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5">
            {displayPosts.map((post) => (
              <div key={post.slug} className="group w-[calc(100%-24px)] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)] py-3.5 cursor-pointer">
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <article className={theme === "light" ? "h-full overflow-hidden rounded-[1.6rem] border border-pink-100 bg-white shadow-md transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:border-pink-300 group-hover:shadow-xl" : "h-full overflow-hidden rounded-[1.6rem] border border-indigo-300/15 bg-[#150f3d] shadow-xl transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:border-amber-300/45 group-hover:shadow-amber-500/5"}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={getBlogPhoto(post)} alt={`Ảnh minh họa cho ${post.title}`} className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" />
                      <span className={theme === "light" ? "absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-pink-600 shadow-sm" : "absolute left-3 top-3 rounded-full bg-[#120c38]/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300"}>{post.category}</span>
                    </div>
                    <div className="p-5">
                      <div className={theme === "light" ? "flex items-center justify-between text-[11px] font-semibold text-slate-400" : "flex items-center justify-between text-[11px] font-semibold text-indigo-100/55"}>
                        <span>{post.date}</span><span>{post.readTime}</span>
                      </div>
                      <h3 className={theme === "light" ? "mt-3 line-clamp-2 font-heading text-lg font-bold leading-snug text-slate-900" : "mt-3 line-clamp-2 font-heading text-lg font-bold leading-snug text-white"}>Nổi bật · {post.title}</h3>
                      <span className={theme === "light" ? "mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-pink-600" : "mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300"}>{BLOG_PAGE_COPY.readAction}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Category sidebar + filtered list */}
        <section className="mt-10 grid items-start gap-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-9">
          <aside className={theme === "light" ? "rounded-[1.4rem] border border-pink-100 bg-white/90 p-3 shadow-[0_12px_36px_rgba(219,39,119,0.07)] lg:sticky lg:top-28 lg:rounded-[1.6rem]" : "rounded-[1.4rem] border border-indigo-300/15 bg-white/[0.05] p-3 backdrop-blur-sm lg:sticky lg:top-28 lg:rounded-[1.6rem]"}>
            <div className="px-3 pb-3 pt-2">
              <p className={theme === "light" ? "text-[11px] font-extrabold uppercase tracking-[0.16em] text-pink-600" : "text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-300"}>Danh mục</p>
              <h2 className={theme === "light" ? "mt-1 font-heading text-lg font-bold text-slate-900" : "mt-1 font-heading text-lg font-bold text-white"}>Khám phá chủ đề</h2>
            </div>
            <div className="relative lg:hidden">
              <select
                aria-label="Chọn danh mục bài viết"
                value={selectedCategory}
                onChange={(event) => setFilter("category", event.target.value)}
                className={theme === "light" ? "h-12 w-full appearance-none rounded-xl border border-pink-200 bg-pink-50/70 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-pink-400" : "h-12 w-full appearance-none rounded-xl border border-amber-300/20 bg-[#17103f] px-4 pr-10 text-sm font-semibold text-white outline-none focus:border-amber-300/50"}
              >
                {categories.map((category) => {
                  const count = category === ALL_CATEGORY ? displayPosts.length : displayPosts.filter((post) => post.category === category).length;
                  return <option key={category} value={category}>{category} ({count})</option>;
                })}
              </select>
              <ChevronRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
            </div>
            <div className="hidden lg:block lg:space-y-1">
              {categories.map((category) => {
                const count = category === ALL_CATEGORY ? displayPosts.length : displayPosts.filter((post) => post.category === category).length;
                const active = selectedCategory === category;
                return (
                  <button key={category} type="button" onClick={() => setFilter("category", category)} className={`flex shrink-0 items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors lg:w-full ${active ? (theme === "light" ? "bg-pink-600 text-white shadow-sm" : "bg-amber-300 text-slate-950") : (theme === "light" ? "bg-pink-50/50 text-slate-600 hover:bg-pink-50 hover:text-pink-600" : "bg-white/[0.025] text-indigo-100/75 hover:bg-white/[0.07] hover:text-white")}`}>
                    <span>{category}</span><span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/20" : "bg-black/[0.05] dark:bg-white/10"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <span className={theme === "light" ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600" : "flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300"}><BookOpenText className="h-5 w-5" /></span>
                <div>
                  <h2 className={theme === "light" ? "font-heading text-2xl font-bold text-slate-900" : "font-heading text-2xl font-bold text-white"}>{selectedCategory === ALL_CATEGORY ? BLOG_PAGE_COPY.listTitle : selectedCategory}</h2>
                  <p className={theme === "light" ? "text-sm text-slate-500" : "text-sm text-indigo-100/60"}>{filteredPosts.length} bài viết được tìm thấy</p>
                </div>
              </div>
              <div className={theme === "light" ? "flex h-11 w-full items-center gap-2 rounded-full border border-pink-200 bg-white px-4 focus-within:border-pink-400 sm:max-w-xs" : "flex h-11 w-full items-center gap-2 rounded-full border border-indigo-300/20 bg-white/[0.05] px-4 focus-within:border-amber-300/50 sm:max-w-xs"}>
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input value={searchQuery} onChange={(event) => setFilter("q", event.target.value)} placeholder="Tìm bài viết..." className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
                {searchQuery && <button type="button" onClick={() => setFilter("q", "")} aria-label="Xóa tìm kiếm" className="rounded-full p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                <div className="grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredPosts.slice(0, visibleCount).map((post, index) => (
                    <motion.div key={post.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(index * 0.035, 0.2) }} className="group py-3.5">
                      <Link to={`/blog/${post.slug}`} className="block h-full">
                        <article className={theme === "light" ? "flex h-full overflow-hidden rounded-[1.25rem] border border-pink-100 bg-white shadow-sm transition-all duration-300 transform group-hover:border-pink-300 sm:flex-col sm:rounded-[1.6rem] sm:group-hover:-translate-y-1.5 sm:group-hover:shadow-md" : "flex h-full overflow-hidden rounded-[1.25rem] border border-indigo-300/15 bg-[#150f3d] transition-all duration-300 transform group-hover:border-amber-300/40 sm:flex-col sm:rounded-[1.6rem] sm:group-hover:-translate-y-1.5 sm:group-hover:shadow-md"}>
                          <div className="relative w-[116px] shrink-0 overflow-hidden sm:aspect-[16/9] sm:w-full"><img src={getBlogPhoto(post)} alt={`Ảnh minh họa cho ${post.title}`} className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" /><span className={theme === "light" ? "absolute left-2 top-2 max-w-[100px] truncate rounded-full bg-white/95 px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide text-pink-600 shadow-sm sm:left-4 sm:top-4 sm:max-w-none sm:px-3 sm:text-[10px]" : "absolute left-2 top-2 max-w-[100px] truncate rounded-full bg-[#120c38]/90 px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide text-amber-300 sm:left-4 sm:top-4 sm:max-w-none sm:px-3 sm:text-[10px]"}>{post.category}</span></div>
                          <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-6">
                            <div className={theme === "light" ? "flex flex-wrap justify-between gap-1 text-[9px] font-semibold text-slate-400 sm:text-[11px]" : "flex flex-wrap justify-between gap-1 text-[9px] font-semibold text-indigo-100/55 sm:text-[11px]"}><span>{post.date}</span><span>{post.readTime}</span></div>
                            <h3 className={theme === "light" ? "mt-2 line-clamp-2 font-heading text-base font-bold leading-snug text-slate-900 sm:mt-3 sm:text-xl" : "mt-2 line-clamp-2 font-heading text-base font-bold leading-snug text-white sm:mt-3 sm:text-xl"}>{post.title}</h3>
                            <p className={theme === "light" ? "mt-3 hidden line-clamp-3 text-sm leading-6 text-slate-600 sm:block" : "mt-3 hidden line-clamp-3 text-sm leading-6 text-indigo-100/65 sm:block"}>{post.excerpt}</p>
                            <span className={theme === "light" ? "mt-auto inline-flex items-center gap-1 pt-2 text-xs font-extrabold text-pink-600 sm:mt-5 sm:gap-2 sm:pt-0 sm:text-sm" : "mt-auto inline-flex items-center gap-1 pt-2 text-xs font-extrabold text-amber-300 sm:mt-5 sm:gap-2 sm:pt-0 sm:text-sm"}>{BLOG_PAGE_COPY.readAction}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" /></span>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                {filteredPosts.length > visibleCount && (
                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className={theme === "light" 
                        ? "inline-flex items-center justify-center rounded-full border border-pink-200 bg-white px-8 py-3 text-sm font-bold text-pink-600 shadow-sm hover:border-pink-300 hover:bg-pink-50/50 transition-all duration-300"
                        : "inline-flex items-center justify-center rounded-full border border-indigo-300/20 bg-white/[0.03] px-8 py-3 text-sm font-bold text-amber-300 shadow-md hover:border-amber-300/30 hover:bg-white/[0.07] transition-all duration-300"
                      }
                    >
                      Tải thêm bài viết
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={theme === "light" ? "rounded-[1.6rem] border border-pink-100 bg-white p-10 text-center text-slate-500 shadow-sm" : "rounded-[1.6rem] border border-indigo-300/15 bg-white/[0.05] p-10 text-center text-indigo-100/60"}>{BLOG_PAGE_COPY.empty}</div>
            )}
          </div>
        </section>
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Về đầu trang"
          className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-lg hover:shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-primary/20"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
