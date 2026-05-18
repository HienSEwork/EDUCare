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
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
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
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-4">
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-6 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-center lg:gap-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px]">
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                {BLOG_PAGE_COPY.eyebrow}
              </span>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.04] tracking-[-0.03em] md:text-[4.25rem]">
                <span className="block">{BLOG_PAGE_COPY.titleLine1}</span>
                <span className="mt-1 block">{BLOG_PAGE_COPY.titleLine2}</span>
              </h1>
              <p className="mt-5 max-w-[600px] text-base leading-7 text-foreground/74 md:text-lg">
                {BLOG_PAGE_COPY.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedCategory === category
                        ? "bg-foreground text-background"
                        : "bg-white/82 text-foreground/78 shadow-soft hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/72 p-6 shadow-soft lg:ml-auto lg:w-full lg:max-w-[620px]"
            >
              <img
                src={heroIllustration}
                alt={BLOG_PAGE_COPY.imageAlt}
                className="mx-auto max-h-[340px] w-full object-contain"
              />
            </motion.div>
          </div>
        </section>

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
