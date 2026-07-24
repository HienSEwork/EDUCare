import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpenText, ExternalLink, Award, PlayCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { apiRequest, ApiError } from "@/lib/api/client";
import type { BlogPost } from "@/types/api";
import { useTheme } from "@/contexts/ThemeContext";

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    void Promise.all([apiRequest<BlogPost>(`/blog-posts/${id}`), apiRequest<BlogPost[]>("/blog-posts")])
      .then(([currentPost, allPosts]) => {
        setPost(currentPost);
        setPosts(allPosts);
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : "Không thể tải bài viết.");
      });
  }, [id]);

  const relatedPosts = useMemo(() => posts.filter((item) => item.slug !== post?.slug).slice(0, 3), [post?.slug, posts]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className={theme === "light" ? "detail-panel px-6 py-4 text-destructive border border-pink-200 bg-white" : "detail-panel px-6 py-4 text-destructive"}>{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className={theme === "light" ? "detail-panel px-6 py-4 border border-pink-200 bg-white text-slate-700" : "detail-panel px-6 py-4 shadow-card"}>Đang tải bài viết...</p>
      </div>
    );
  }

  const isExpertPost = post.category === "Chuyên gia chia sẻ" || !!post.author;
  const isVideoPost = !!post.videoUrl;

  return (
    <div className={theme === "light" ? "min-h-screen pb-16 pt-8 bg-[#fdf6f9] text-slate-800 font-body" : "min-h-screen pb-16 pt-8 text-slate-100 font-body"}>
      <div className="site-shell px-4">
        <button
          onClick={() => navigate("/blog")}
          className={theme === "light" ? "mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-pink-600 transition-colors" : "mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại thư viện bài viết
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
          <article>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={theme === "light" ? "p-6 md:p-8 rounded-[2.2rem] border border-pink-200 bg-white shadow-[0_10px_30px_rgba(236,72,153,0.08)]" : "detail-panel p-6 md:p-8"}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 text-4xl shadow-sm border border-pink-200">
                  {post.emoji}
                </span>
                <span className={`rounded-full px-3.5 py-1 text-xs font-extrabold tracking-wide uppercase ${
                  isExpertPost ? "bg-amber-500/20 text-amber-600 border border-amber-500/30" : (theme === "light" ? "bg-pink-100 text-pink-600 font-bold" : "bg-primary/8 text-primary")
                }`}>
                  {post.category}
                </span>
                <span className={theme === "light" ? "text-sm text-slate-500" : "text-sm text-muted-foreground"}>{post.date}</span>
                <span className={theme === "light" ? "text-sm text-slate-500" : "text-sm text-muted-foreground"}>{post.readTime}</span>
              </div>

              <h1 className={theme === "light" ? "content-heading mt-6 max-w-4xl text-slate-800" : "content-heading mt-6 max-w-4xl"}>{post.title}</h1>

              {/* Author / Expert Info Banner */}
              {isExpertPost && (
                <div className={theme === "light" ? "mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-xs" : "mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 backdrop-blur-md"}>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/40">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                        {post.category === "Chuyên gia chia sẻ" ? "✨ TÁC GIẢ CHUYÊN GIA" : "TÁC GIẢ / NGUỒN BIÊN SOẠN"}
                      </span>
                    </div>
                    <h3 className={theme === "light" ? "font-heading text-lg font-extrabold text-slate-800 mt-0.5" : "font-heading text-lg font-extrabold text-foreground mt-0.5"}>
                      {post.author || "PGS.TS. Trần Thành Nam"}
                    </h3>
                    <p className={theme === "light" ? "text-xs text-slate-600 font-medium mt-0.5" : "text-xs text-muted-foreground font-medium mt-0.5"}>
                      {post.authorTitle || "Chủ nhiệm Khoa Các khoa học Giáo dục, Trường Đại học Giáo dục (ĐHQG Hà Nội)"}
                    </p>
                  </div>
                </div>
              )}

              {/* Embedded Video Player */}
              {isVideoPost && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-pink-300 bg-slate-950 p-2 shadow-xl">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <iframe
                      src={post.videoUrl!}
                      title={post.title}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 text-pink-400 font-bold">
                      <PlayCircle className="h-4 w-4" /> Xem video tương tác trực tiếp
                    </span>
                    <span>Tự động điều chỉnh âm lượng & toàn màn hình</span>
                  </div>
                </div>
              )}

              <div className={theme === "light" ? "mt-6 border-l-4 border-pink-500 bg-pink-50/60 px-5 py-5 rounded-r-xl" : "mt-6 border-l-4 border-primary/20 bg-background/62 px-5 py-5 rounded-r-xl"}>
                <p className={theme === "light" ? "text-base leading-7 text-slate-700 font-medium" : "text-base leading-7 text-muted-foreground font-medium"}>{post.excerpt}</p>
              </div>

              <div className="mt-8 space-y-5">
                {post.content.split("\n").map((line, index) => (
                  <p key={index} className={theme === "light" ? "max-w-none text-base leading-8 text-slate-700 md:text-[1.04rem]" : "max-w-none text-base leading-8 text-foreground/88 md:text-[1.04rem]"}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Source Citation Box */}
              {post.sourceUrl && (
                <div className={theme === "light" ? "mt-10 rounded-2xl border border-cyan-300 bg-cyan-50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" : "mt-10 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-cyan-600 shrink-0" />
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-cyan-700">Nguồn trích dẫn chính thức</p>
                      <p className={theme === "light" ? "text-sm font-bold text-slate-800 mt-0.5" : "text-sm font-bold text-foreground mt-0.5"}>
                        Được trích dẫn từ {post.sourceName || "Nguồn bài viết gốc"}
                      </p>
                    </div>
                  </div>
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-extrabold text-white uppercase tracking-wider shadow-md hover:bg-cyan-700 transition-all shrink-0"
                  >
                    <span>Xem bài gốc</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className={theme === "light" ? "rounded-[2rem] border border-pink-200 bg-white p-6 shadow-sm" : "rounded-[2rem] gradient-card p-6 shadow-card"}>
              <div className="flex items-center gap-3">
                <span className={theme === "light" ? "flex h-11 w-11 items-center justify-center rounded-[1rem] bg-pink-100 text-pink-600" : "flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10 text-primary"}>
                  <BookOpenText className="h-5 w-5" />
                </span>
                <div>
                  <p className={theme === "light" ? "text-xs font-semibold uppercase tracking-[0.18em] text-pink-600" : "text-xs font-semibold uppercase tracking-[0.18em] text-primary"}>Thông tin nhanh</p>
                  <h2 className={theme === "light" ? "font-heading text-xl font-bold text-slate-800" : "font-heading text-xl font-bold"}>Tóm tắt bài viết</h2>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-sm">
                <div className={theme === "light" ? "rounded-[1.2rem] bg-pink-50/70 border border-pink-100 p-4" : "rounded-[1.2rem] bg-background/76 p-4 shadow-soft"}>
                  <p className={theme === "light" ? "text-xs font-semibold uppercase tracking-[0.16em] text-pink-600" : "text-xs font-semibold uppercase tracking-[0.16em] text-primary"}>Chủ đề</p>
                  <p className={theme === "light" ? "mt-2 font-semibold text-slate-800" : "mt-2 font-semibold"}>{post.category}</p>
                </div>
                {post.author && (
                  <div className={theme === "light" ? "rounded-[1.2rem] bg-amber-50 border border-amber-200 p-4" : "rounded-[1.2rem] bg-background/76 p-4 shadow-soft"}>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Tác giả / Chuyên gia</p>
                    <p className="mt-2 font-semibold text-amber-800">{post.author}</p>
                  </div>
                )}
                <div className={theme === "light" ? "rounded-[1.2rem] bg-pink-50/70 border border-pink-100 p-4" : "rounded-[1.2rem] bg-background/76 p-4 shadow-soft"}>
                  <p className={theme === "light" ? "text-xs font-semibold uppercase tracking-[0.16em] text-pink-600" : "text-xs font-semibold uppercase tracking-[0.16em] text-primary"}>Thời lượng đọc</p>
                  <p className={theme === "light" ? "mt-2 font-semibold text-slate-800" : "mt-2 font-semibold"}>{post.readTime}</p>
                </div>
                <div className={theme === "light" ? "rounded-[1.2rem] bg-pink-50/70 border border-pink-100 p-4" : "rounded-[1.2rem] bg-background/76 p-4 shadow-soft"}>
                  <p className={theme === "light" ? "text-xs font-semibold uppercase tracking-[0.16em] text-pink-600" : "text-xs font-semibold uppercase tracking-[0.16em] text-primary"}>Ngày đăng</p>
                  <p className={theme === "light" ? "mt-2 font-semibold text-slate-800" : "mt-2 font-semibold"}>{post.date}</p>
                </div>
              </div>
            </div>

            <div className={theme === "light" ? "rounded-[2rem] border border-pink-200 bg-white p-6 shadow-sm" : "rounded-[2rem] gradient-card p-6 shadow-card"}>
              <p className={theme === "light" ? "text-xs font-semibold uppercase tracking-[0.2em] text-pink-600" : "text-xs font-semibold uppercase tracking-[0.2em] text-primary"}>Đọc tiếp</p>
              <div className="mt-4 space-y-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/blog/${item.slug}`}
                    className={theme === "light"
                      ? "block rounded-[1.2rem] bg-pink-50/50 border border-pink-100 p-4 transition-colors hover:bg-pink-100/60"
                      : "block rounded-[1.2rem] bg-background/76 p-4 shadow-soft transition-colors hover:bg-background"
                    }
                  >
                    <p className={theme === "light" ? "text-sm font-semibold leading-6 text-slate-800" : "text-sm font-semibold leading-6"}>{item.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className={theme === "light" ? "text-slate-500" : ""}>{item.category}</span>
                      <span className={theme === "light" ? "inline-flex items-center gap-1 font-bold text-pink-600" : "inline-flex items-center gap-1"}>
                        Xem
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
