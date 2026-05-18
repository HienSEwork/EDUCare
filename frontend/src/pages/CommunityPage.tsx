import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Eye, EyeOff, Heart, MessageCircle, Send, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { CommunityPost } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const topicCatalog = [
  { label: "Cảm xúc", keywords: ["cam xuc", "buon", "lo lang", "ap luc", "met moi"] },
  { label: "Tình bạn", keywords: ["ban be", "tinh ban", "ban than", "xung dot"] },
  { label: "Gia đình", keywords: ["gia dinh", "bo me", "cha me", "nguoi than"] },
  { label: "Học tập", keywords: ["hoc tap", "thi cu", "diem so", "truong hoc", "lop"] },
  { label: "An toàn", keywords: ["an toan", "bao luc", "quay roi", "mang xa hoi", "bi mat"] },
  { label: "Tự tin", keywords: ["tu tin", "ban than", "the hien", "noi truoc dam dong"] },
] as const;

function detectTopics(content: string) {
  const normalized = normalizeText(content);
  const matched = topicCatalog
    .filter((topic) => topic.keywords.some((keyword) => normalized.includes(keyword)))
    .map((topic) => topic.label);

  return matched.length > 0 ? matched.slice(0, 3) : ["Chia sẻ cá nhân"];
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyAnon, setReplyAnon] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      const data = await apiRequest<CommunityPost[]>("/community/posts");
      setPosts(data);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Không thể tải bài thảo luận.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const postsWithTopics = useMemo(
    () => posts.map((post) => ({ ...post, topics: detectTopics(post.content) })),
    [posts],
  );

  const topicCounts = useMemo(() => {
    const counts = new Map<string, number>();

    postsWithTopics.forEach((post) => {
      post.topics.forEach((topic) => {
        counts.set(topic, (counts.get(topic) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [postsWithTopics]);

  const replacePost = useCallback((nextPost: CommunityPost) => {
    setPosts((current) => current.map((post) => (post.id === nextPost.id ? nextPost : post)));
  }, []);

  const handlePost = async () => {
    if (!user || !newPost.trim()) {
      return;
    }

    try {
      const createdPost = await apiRequest<CommunityPost>("/community/posts", {
        method: "POST",
        body: JSON.stringify({
          content: newPost.trim(),
          anonymous,
        }),
      });

      setPosts((current) => [createdPost, ...current]);
      setNewPost("");
      setAnonymous(false);
      setError(null);
      toast.success("Đã đăng bài thảo luận.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể đăng bài.");
    }
  };

  const handlePostLike = async (postId: number) => {
    if (!user) {
      toast.error("Đăng nhập để thích bài viết.");
      return;
    }

    try {
      const nextPost = await apiRequest<CommunityPost>(`/community/posts/${postId}/likes`, {
        method: "POST",
      });
      replacePost(nextPost);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể thích bài viết.");
    }
  };

  const handleReplyLike = async (replyId: number) => {
    if (!user) {
      toast.error("Đăng nhập để thích bình luận.");
      return;
    }

    try {
      const nextPost = await apiRequest<CommunityPost>(`/community/replies/${replyId}/likes`, {
        method: "POST",
      });
      replacePost(nextPost);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể thích bình luận.");
    }
  };

  const handleReply = async (postId: number) => {
    if (!user || !replyContent.trim()) {
      return;
    }

    try {
      const nextPost = await apiRequest<CommunityPost>(`/community/posts/${postId}/replies`, {
        method: "POST",
        body: JSON.stringify({
          content: replyContent.trim(),
          anonymous: replyAnon,
        }),
      });

      replacePost(nextPost);
      setReplyContent("");
      setReplyAnon(false);
      setReplyingTo(null);
      setExpandedReplies((current) => new Set(current).add(postId));
      toast.success("Đã gửi phản hồi.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể gửi phản hồi.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const nextPosts = await apiRequest<CommunityPost[]>(`/community/posts/${postId}`, {
        method: "DELETE",
      });
      setPosts(nextPosts);
      toast.success("Đã xóa bài viết.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể xóa bài viết.");
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    try {
      const nextPost = await apiRequest<CommunityPost>(`/community/replies/${replyId}`, {
        method: "DELETE",
      });
      replacePost(nextPost);
      toast.success("Đã xóa bình luận.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể xóa bình luận.");
    }
  };

  const handleShare = async (post: CommunityPost) => {
    const text = `"${post.content.slice(0, 120)}${post.content.length > 120 ? "..." : ""}" - ${post.anonymous ? "Ẩn danh" : post.author} trên EDUcare`;

    if (navigator.share) {
      await navigator.share({ title: "Thảo luận EDUcare", text });
      return;
    }

    await navigator.clipboard.writeText(text);
    toast.success("Đã sao chép nội dung chia sẻ.");
  };

  const toggleReplies = (postId: number) => {
    setExpandedReplies((current) => {
      const next = new Set(current);

      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }

      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-[2rem] gradient-card p-6 shadow-card">Đang tải không gian thảo luận...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-4">
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] px-6 py-8 shadow-card md:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)] lg:items-end">
            <div>
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                Không gian thảo luận
              </span>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-5xl">
                Cùng chia sẻ, lắng nghe và góp ý nhẹ nhàng.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/74 md:text-lg">
                Nơi để học sinh chia sẻ điều mình đang nghĩ, hỏi điều mình chưa rõ và nhận phản hồi tích cực từ cộng đồng.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                { label: "Bài đang có", value: `${posts.length} chủ đề` },
                { label: "Chủ đề nổi bật", value: `${topicCounts.length} nhóm` },
                { label: "Đi nhanh", value: "Chat, game, bảng xếp hạng" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/70 bg-white/76 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
          <div className="space-y-6">
            {error ? <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

            {user ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] gradient-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
                    {anonymous ? "?" : user.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{anonymous ? "Bài viết ẩn danh" : user.fullName}</p>
                    <p className="text-sm text-muted-foreground">Chia sẻ điều bạn đang quan tâm với cộng đồng.</p>
                  </div>
                </div>

                <Textarea
                  value={newPost}
                  onChange={(event) => setNewPost(event.target.value)}
                  placeholder="Ví dụ: Gần đây mình hay áp lực chuyện học và khó tập trung, mọi người có cách nào để cân bằng lại không?"
                  className="min-h-32 resize-none rounded-[1.5rem] bg-background/60"
                  rows={4}
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setAnonymous((current) => !current)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                      anonymous ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {anonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {anonymous ? "Đang ở chế độ ẩn danh" : "Đăng với tên thật"}
                  </button>

                  <Button onClick={() => void handlePost()} disabled={!newPost.trim()} className="gap-2 rounded-full gradient-primary px-5 text-primary-foreground">
                    <Send className="h-4 w-4" />
                    Đăng thảo luận
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-[2rem] gradient-card p-6 shadow-card">
                <p className="text-muted-foreground">
                  Đăng nhập để bắt đầu thảo luận, gửi phản hồi và tham gia sâu hơn vào cộng đồng EDUcare.
                </p>
                <Link to="/login" className="mt-4 inline-flex">
                  <Button className="rounded-full gradient-primary px-5 text-primary-foreground">Đăng nhập</Button>
                </Link>
              </div>
            )}

            <AnimatePresence>
              {postsWithTopics.length === 0 ? (
                <div className="rounded-[2rem] gradient-card px-6 py-16 text-center shadow-card">
                  <MessageCircle className="mx-auto mb-3 h-12 w-12 opacity-30" />
                  <p className="text-muted-foreground">Chưa có chủ đề nào. Bạn có thể là người mở đầu cuộc trò chuyện hôm nay.</p>
                </div>
              ) : null}

              {postsWithTopics.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="detail-panel p-6"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender/30 font-bold text-lavender-foreground">
                        {post.anonymous ? "?" : post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{post.anonymous ? "Ẩn danh" : post.author}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
                      </div>
                    </div>

                    {user && post.authorId === user.id ? (
                      <button
                        onClick={() => void handleDeletePost(post.id)}
                        className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.topics.map((topic) => (
                      <span key={topic} className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/86">{post.content}</p>

                  <div className="mt-5 flex items-center gap-5 text-muted-foreground">
                    <button
                      onClick={() => void handlePostLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        post.liked ? "text-pink-foreground" : "hover:text-pink-foreground"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                      {post.likes > 0 ? post.likes : "Thích"}
                    </button>

                    <button
                      onClick={() => {
                        setReplyingTo((current) => (current === post.id ? null : post.id));
                        setReplyContent("");
                      }}
                      className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.replies.length > 0 ? `${post.replies.length} phản hồi` : "Phản hồi"}
                    </button>

                    <button onClick={() => void handleShare(post)} className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                      <Share2 className="h-4 w-4" />
                      Chia sẻ
                    </button>
                  </div>

                  {post.replies.length > 0 ? (
                    <button onClick={() => toggleReplies(post.id)} className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      {expandedReplies.has(post.id) ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {expandedReplies.has(post.id) ? "Thu gọn" : "Xem"} {post.replies.length} phản hồi
                    </button>
                  ) : null}

                  <AnimatePresence>
                    {expandedReplies.has(post.id)
                      ? post.replies.map((reply) => (
                          <motion.div
                            key={reply.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 mt-4 detail-panel-muted p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint/25 text-xs font-bold text-mint-foreground">
                                  {reply.anonymous ? "?" : reply.author.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{reply.anonymous ? "Ẩn danh" : reply.author}</p>
                                  <p className="text-xs text-muted-foreground">{timeAgo(reply.createdAt)}</p>
                                </div>
                              </div>

                              {user && reply.authorId === user.id ? (
                                <button onClick={() => void handleDeleteReply(reply.id)} className="rounded-lg p-1 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              ) : null}
                            </div>

                            <p className="mt-3 text-sm leading-6 text-foreground/80">{reply.content}</p>

                            <button
                              onClick={() => void handleReplyLike(reply.id)}
                              className={`mt-3 flex items-center gap-1 text-xs transition-colors ${
                                reply.liked ? "text-pink-foreground" : "text-muted-foreground hover:text-pink-foreground"
                              }`}
                            >
                              <Heart className={`h-3.5 w-3.5 ${reply.liked ? "fill-current" : ""}`} />
                              {reply.likes > 0 ? reply.likes : "Thích"}
                            </button>
                          </motion.div>
                        ))
                      : null}
                  </AnimatePresence>

                  <AnimatePresence>
                    {replyingTo === post.id && user ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 detail-panel-muted p-4"
                      >
                        <Textarea
                          value={replyContent}
                          onChange={(event) => setReplyContent(event.target.value)}
                          placeholder="Viết phản hồi của bạn..."
                          className="detail-input min-h-24 resize-none text-sm"
                          rows={3}
                        />

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <button
                            onClick={() => setReplyAnon((current) => !current)}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
                              replyAnon ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {replyAnon ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            {replyAnon ? "Ẩn danh" : "Tên thật"}
                          </button>

                          <Button onClick={() => void handleReply(post.id)} disabled={!replyContent.trim()} size="sm" className="rounded-full gradient-primary text-primary-foreground">
                            <Send className="mr-2 h-3.5 w-3.5" />
                            Gửi phản hồi
                          </Button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,232,241,0.96)_0%,rgba(243,240,255,0.96)_52%,rgba(231,246,255,0.96)_100%)] p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Chủ đề được nhắc đến</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {topicCounts.length > 0 ? (
                  topicCounts.map((topic) => (
                    <span key={topic.label} className="rounded-full bg-white/84 px-3 py-2 text-sm font-medium shadow-soft">
                      {topic.label}
                      <span className="ml-2 text-xs text-muted-foreground">{topic.total}</span>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Các chủ đề sẽ hiện ra khi cộng đồng bắt đầu chia sẻ nhiều hơn.</p>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,rgba(239,244,255,0.98)_0%,rgba(255,240,246,0.96)_100%)] p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bài mới từ cộng đồng</p>
              <div className="mt-4 space-y-3">
                {postsWithTopics.slice(0, 5).map((post) => (
                  <div key={post.id} className="rounded-[1.4rem] border border-white/70 bg-white/82 p-4 shadow-soft">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{post.anonymous ? "Ẩn danh" : post.author}</p>
                      <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/76">{post.content}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.topics.slice(0, 2).map((topic) => (
                        <span key={topic} className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,243,234,0.98)_0%,rgba(246,243,255,0.96)_100%)] p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Đi nhanh đến</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Trò chơi cộng đồng", to: "/games" },
                  { label: "Bảng xếp hạng", to: "/community/leaderboard" },
                  { label: "Nhóm chat", to: "/community/chat" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block rounded-[1.3rem] bg-white/82 px-4 py-3 text-sm font-semibold shadow-soft transition-colors hover:bg-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
