import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText } from "lucide-react";

import heroIllustration from "@/assets/hero-illustration.png";
import { BLOG_DISPLAY_BY_SLUG, BLOG_PAGE_COPY } from "@/content/pageCopy";
import { ApiError, apiRequest } from "@/lib/api/client";
import { getBlogPhoto } from "@/lib/contentMedia";
import type { BlogPost } from "@/types/api";

const ALL_CATEGORY = BLOG_PAGE_COPY.allCategory;

const categoryLabels: Record<string, string> = {
  "cam xuc": "Cảm xúc",
  "hoc tap": "Học tập",
  "gia dinh": "Gia đình",
  "ky nang song": "Kỹ năng sống",
  "suc khoe": "Sức khỏe",
  "ho tro": "Hỗ trợ",
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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [error, setError] = useState<string | null>(null);

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

  const displayPosts = useMemo(() => posts.map(getDisplayPost), [posts]);

  const categories = useMemo(
    () => [ALL_CATEGORY, ...new Set(displayPosts.map((post) => post.category))],
    [displayPosts],
  );

  const filteredPosts = useMemo(
    () =>
      selectedCategory === ALL_CATEGORY
        ? displayPosts
        : displayPosts.filter((post) => post.category === selectedCategory),
    [displayPosts, selectedCategory],
  );

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

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

      {/* Header Banner Section */}
      <section className="w-full relative overflow-hidden mb-8">
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-center lg:gap-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px]">
              <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                {BLOG_PAGE_COPY.eyebrow}
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] md:text-5xl text-white">
                <span className="block">{BLOG_PAGE_COPY.titleLine1}</span>
                <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200 bg-clip-text text-transparent">{BLOG_PAGE_COPY.titleLine2}</span>
              </h1>
              <p className="mt-4 max-w-[600px] text-base leading-relaxed text-indigo-100/80 md:text-lg">
                {BLOG_PAGE_COPY.description}
              </p>

              {/* Dynamic Statistics Querying Real Data */}
              <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-700/50 pt-4 mb-6">
                <div>
                  <div className="text-xl font-extrabold text-cyan-300 md:text-2xl">{posts.length}</div>
                  <div className="text-xs text-indigo-200/70 font-semibold">Bài viết chia sẻ</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white md:text-2xl">{Math.max(1, categories.length - 1)}</div>
                  <div className="text-xs text-indigo-200/70 font-semibold">Chủ đề bài viết</div>
                </div>
              </div>

              {/* Square Text-Only Category Filter Tabs (Radius=0) */}
              <div className="flex flex-wrap gap-2.5">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-none text-xs font-extrabold tracking-wide uppercase transition-all duration-200 shrink-0 ${
                      selectedCategory === category
                        ? "border-2 border-cyan-400 bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "border border-slate-700/70 bg-slate-900/60 backdrop-blur-md text-slate-300 hover:border-slate-500 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
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
                className="mx-auto max-h-[340px] w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">

        {error ? <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

        {featuredPost ? (
          <section className="mt-8">
            <Link to={`/blog/${featuredPost.slug}`}>
              <article className="group overflow-hidden rounded-[2.2rem] border border-white/70 bg-card/86 shadow-card transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-hover">
                <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="rounded-full bg-lavender/30 px-3 py-1 font-semibold text-lavender-foreground">
                        {featuredPost.category}
                      </span>
                      <span>{featuredPost.date}</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <h2 className="mt-4 font-heading text-3xl font-bold leading-tight">{featuredPost.title}</h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{featuredPost.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      {BLOG_PAGE_COPY.readAction}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="relative min-h-[280px] overflow-hidden bg-[linear-gradient(135deg,rgba(255,231,239,0.92)_0%,rgba(234,244,255,0.92)_100%)] lg:min-h-full">
                    <img
                      src={getBlogPhoto(featuredPost)}
                      alt={`Ảnh minh họa cho bài viết ${featuredPost.title}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/36 via-white/10 to-transparent" />
                  </div>
                </div>
              </article>
            </Link>
          </section>
        ) : null}

        <section className="mt-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
              <BookOpenText className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h2 className="font-heading text-2xl font-bold">{BLOG_PAGE_COPY.listTitle}</h2>
              <p className="text-sm text-muted-foreground">{BLOG_PAGE_COPY.listDescription}</p>
            </div>
          </div>

          {otherPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {otherPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <article className="group h-full overflow-hidden rounded-[2rem] border border-white/70 bg-card/86 shadow-card transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-hover">
                      <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,rgba(255,231,239,0.92)_0%,rgba(234,244,255,0.92)_100%)]">
                        <img
                          src={getBlogPhoto(post)}
                          alt={`Ảnh minh họa cho bài viết ${post.title}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-soft">
                            {post.category}
                          </span>
                          <span className="rounded-full bg-foreground/82 px-3 py-1 text-[11px] font-semibold text-background shadow-soft">
                            {post.readTime}
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/32 to-transparent" />
                      </div>

                      <div className="p-6">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{post.date}</p>
                        <h3 className="mt-3 font-heading text-xl font-bold leading-snug line-clamp-2">{post.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          {BLOG_PAGE_COPY.readAction}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] bg-card/82 p-8 text-center text-muted-foreground shadow-card">
              {BLOG_PAGE_COPY.empty}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
