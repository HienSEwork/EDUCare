import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpenText } from "lucide-react";
import { motion } from "framer-motion";

import { apiRequest, ApiError } from "@/lib/api/client";
import type { BlogPost } from "@/types/api";

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <p className="detail-panel px-6 py-4 text-destructive">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="detail-panel px-6 py-4 shadow-card">Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate("/blog")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại thư viện bài viết
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
          <article>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="detail-panel p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-16 w-16 items-center justify-center bg-[linear-gradient(135deg,rgba(255,231,239,0.9)_0%,rgba(234,244,255,0.9)_100%)] text-4xl shadow-soft">
                  {post.emoji}
                </span>
                <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">{post.category}</span>
                <span className="text-sm text-muted-foreground">{post.date}</span>
                <span className="text-sm text-muted-foreground">{post.readTime}</span>
              </div>

              <h1 className="mt-6 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-[2.85rem]">{post.title}</h1>

              <div className="mt-5 border-l-4 border-primary/20 bg-background/62 px-5 py-5">
                <p className="text-base leading-7 text-muted-foreground">{post.excerpt}</p>
              </div>

              <div className="mt-8 space-y-5">
                {post.content.split("\n").map((line, index) => (
                  <p key={index} className="max-w-none text-base leading-8 text-foreground/88 md:text-[1.04rem]">
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] gradient-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                  <BookOpenText className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Thông tin nhanh</p>
                  <h2 className="font-heading text-xl font-bold">Tóm tắt bài viết</h2>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-sm">
                <div className="rounded-[1.2rem] bg-background/76 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Chủ đề</p>
                  <p className="mt-2 font-semibold">{post.category}</p>
                </div>
                <div className="rounded-[1.2rem] bg-background/76 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Thời lượng đọc</p>
                  <p className="mt-2 font-semibold">{post.readTime}</p>
                </div>
                <div className="rounded-[1.2rem] bg-background/76 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Ngày đăng</p>
                  <p className="mt-2 font-semibold">{post.date}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] gradient-card p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Đọc tiếp</p>
              <div className="mt-4 space-y-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/blog/${item.slug}`}
                    className="block rounded-[1.2rem] bg-background/76 p-4 shadow-soft transition-colors hover:bg-background"
                  >
                    <p className="text-sm font-semibold leading-6">{item.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.category}</span>
                      <span className="inline-flex items-center gap-1">
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
