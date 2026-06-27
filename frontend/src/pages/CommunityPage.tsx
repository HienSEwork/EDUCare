import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Eye, EyeOff, Heart, MessageCircle, Send, Share2, Trash2, Flag, AlertTriangle, Clock, TrendingUp, HelpCircle, X, Pin, ArrowLeft, Smile, BookOpen, Users, Shield, ImagePlus } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { CommunityPost, CommunityReply, CommunityCategory } from "@/types/api";
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

function renderInlineMarkdown(text: string): React.ReactNode[] {
  let tokens: Array<{ type: "text" | "bold" | "italic" | "link" | "image"; content: string; url?: string }> = [
    { type: "text", content: text }
  ];

  // 1. Inline images: ![alt](url)
  tokens = tokens.flatMap(token => {
    if (token.type !== "text") return token;
    const parts = [];
    const remaining = token.content;
    const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(remaining)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push({ type: "text" as const, content: remaining.substring(lastIndex, matchIndex) });
      }
      parts.push({ type: "image" as const, content: match[1], url: match[2] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < remaining.length) {
      parts.push({ type: "text" as const, content: remaining.substring(lastIndex) });
    }
    return parts.length > 0 ? parts : token;
  });

  // 2. Links: [text](url)
  tokens = tokens.flatMap(token => {
    if (token.type !== "text") return token;
    const parts = [];
    const remaining = token.content;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(remaining)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push({ type: "text" as const, content: remaining.substring(lastIndex, matchIndex) });
      }
      parts.push({ type: "link" as const, content: match[1], url: match[2] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < remaining.length) {
      parts.push({ type: "text" as const, content: remaining.substring(lastIndex) });
    }
    return parts.length > 0 ? parts : token;
  });

  // 3. Bold: **text**
  tokens = tokens.flatMap(token => {
    if (token.type !== "text") return token;
    const parts = [];
    const remaining = token.content;
    const regex = /\*\*([^*]+)\*\*/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(remaining)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push({ type: "text" as const, content: remaining.substring(lastIndex, matchIndex) });
      }
      parts.push({ type: "bold" as const, content: match[1] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < remaining.length) {
      parts.push({ type: "text" as const, content: remaining.substring(lastIndex) });
    }
    return parts.length > 0 ? parts : token;
  });

  // 4. Italic: *text*
  tokens = tokens.flatMap(token => {
    if (token.type !== "text") return token;
    const parts = [];
    const remaining = token.content;
    const regex = /\*([^*]+)\*/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(remaining)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push({ type: "text" as const, content: remaining.substring(lastIndex, matchIndex) });
      }
      parts.push({ type: "italic" as const, content: match[1] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < remaining.length) {
      parts.push({ type: "text" as const, content: remaining.substring(lastIndex) });
    }
    return parts.length > 0 ? parts : token;
  });

  return tokens.map((token, index) => {
    switch (token.type) {
      case "bold":
        return <strong key={index} className="font-extrabold text-foreground">{token.content}</strong>;
      case "italic":
        return <em key={index} className="italic text-foreground/90">{token.content}</em>;
      case "link":
        return (
          <a
            key={index}
            href={token.url || undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mint hover:underline font-semibold break-all"
          >
            {token.content}
          </a>
        );
      case "image":
        return (
          <img
            key={index}
            src={token.url}
            alt={token.content}
            className="inline-block rounded max-h-32 my-1"
          />
        );
      default:
        return token.content;
    }
  });
}

function parseMarkdownToJSX(text: string): React.ReactNode[] {
  if (!text) return [];

  const blocks = text.split(/\n\n+/);

  return blocks.map((block, blockIdx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith(">")) {
      const quoteText = trimmed.replace(/^>\s*/gm, "");
      return (
        <blockquote key={blockIdx} className="border-l-4 border-mint pl-4 my-2 italic text-muted-foreground bg-white/5 py-1.5 rounded-r">
          {renderInlineMarkdown(quoteText)}
        </blockquote>
      );
    }

    const imgRegex = /^!\[([^\]]*)\]\(([^)]+)\)$/;
    const imgMatch = trimmed.match(imgRegex);
    if (imgMatch) {
      return (
        <div key={blockIdx} className="my-3 flex justify-center">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="rounded-lg max-h-72 object-contain shadow-md border border-white/20"
          />
        </div>
      );
    }

    return (
      <p key={blockIdx} className="mb-2 leading-relaxed whitespace-pre-wrap">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });
}

interface ThreadedReply extends CommunityReply {
  children: ThreadedReply[];
}

function buildReplyTree(replies: CommunityReply[]): ThreadedReply[] {
  const map = new Map<number, ThreadedReply>();
  const roots: ThreadedReply[] = [];
  replies.forEach((reply) => {
    map.set(reply.id, { ...reply, children: [] });
  });
  replies.forEach((reply) => {
    const node = map.get(reply.id)!;
    if (reply.parentId) {
      const parent = map.get(reply.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });
  const sortTree = (nodes: ThreadedReply[]) => {
    nodes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    nodes.forEach((node) => sortTree(node.children));
  };
  sortTree(roots);
  return roots;
}

interface ReplyNodeProps {
  reply: ThreadedReply;
  depth: number;
  user: any;
  replyingTo: number | null;
  replyingToCommentId: number | null;
  replyContent: string;
  replyAnon: boolean;
  setReplyContent: (val: string) => void;
  setReplyAnon: (val: boolean) => void;
  onStartReply: (postId: number, replyId: number) => void;
  onSubmitReply: (postId: number) => void;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
  onReport: (postId: number | null, replyId: number | null) => void;
  postId: number;
  timeAgo: (val: string) => string;
}

function ReplyNode({
  reply,
  depth,
  user,
  replyingTo,
  replyingToCommentId,
  replyContent,
  replyAnon,
  setReplyContent,
  setReplyAnon,
  onStartReply,
  onSubmitReply,
  onLike,
  onDelete,
  onReport,
  postId,
  timeAgo
}: ReplyNodeProps) {
  const isReplyingThis = replyingTo === postId && replyingToCommentId === reply.id;
  return (
    <div className={`mt-3 ${depth > 0 ? "ml-4 border-l border-lavender/30 pl-3 md:pl-4" : "border-t border-white/40 pt-4"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint/25 text-xs font-bold text-mint-foreground">
            {reply.anonymous ? "?" : reply.author.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{reply.anonymous ? "Ẩn danh" : reply.author}</p>
              {reply.authorRole === "ADMIN" && (
                <span className="rounded-full bg-red-500/15 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-600">
                  Chuyên gia
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{timeAgo(reply.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={() => onStartReply(postId, reply.id)}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Trả lời
            </button>
          )}
          {user && reply.authorId === user.id ? (
            <button onClick={() => onDelete(reply.id)} className="rounded-lg p-1 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : user && reply.authorId !== user.id ? (
            <button
              onClick={() => onReport(null, reply.id)}
              className="rounded-lg p-1 text-muted-foreground hover:text-amber-500"
              title="Báo cáo vi phạm"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-2 text-sm leading-6 text-foreground/80 pl-1">{reply.content}</p>

      {reply.imageUrl && (
        <div className="mt-2 pl-1">
          <img
            src={reply.imageUrl}
            alt="Reply attachment"
            className="rounded-lg max-h-48 object-contain shadow-sm border border-white/20"
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => onLike(reply.id)}
          className={`flex items-center gap-1 text-xs transition-colors ${
            reply.liked ? "text-pink-foreground" : "text-muted-foreground hover:text-pink-foreground"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${reply.liked ? "fill-current" : ""}`} />
          {reply.likes > 0 ? reply.likes : "Thích"}
        </button>
      </div>

      <AnimatePresence>
        {isReplyingThis && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 detail-panel-muted p-3"
          >
            <Textarea
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
              placeholder={`Phản hồi bình luận của ${reply.anonymous ? "Ẩn danh" : reply.author}...`}
              className="detail-input min-h-20 resize-none text-xs"
              rows={2}
            />

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setReplyAnon(!replyAnon)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] transition-colors ${
                  replyAnon ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {replyAnon ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {replyAnon ? "Ẩn danh" : "Tên thật"}
              </button>

              <div className="flex gap-2">
                <Button
                  onClick={() => onStartReply(0, 0)}
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-[10px] px-3 h-7"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => onSubmitReply(postId)}
                  disabled={!replyContent.trim()}
                  size="sm"
                  className="rounded-full gradient-primary text-primary-foreground text-[10px] px-3 h-7"
                >
                  <Send className="mr-1 h-3 w-3" />
                  Gửi
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {reply.children && reply.children.map((child) => (
        <ReplyNode
          key={child.id}
          reply={child}
          depth={depth + 1}
          user={user}
          replyingTo={replyingTo}
          replyingToCommentId={replyingToCommentId}
          replyContent={replyContent}
          replyAnon={replyAnon}
          setReplyContent={setReplyContent}
          setReplyAnon={setReplyAnon}
          onStartReply={onStartReply}
          onSubmitReply={onSubmitReply}
          onLike={onLike}
          onDelete={onDelete}
          onReport={onReport}
          postId={postId}
          timeAgo={timeAgo}
        />
      ))}
    </div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<CommunityCategory | null>(null);
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [editorMode, setEditorMode] = useState<"write" | "preview">("write");
  const [anonymous, setAnonymous] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyAnon, setReplyAnon] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [newPostImagePreview, setNewPostImagePreview] = useState<string | null>(null);
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<"new" | "hot" | "unanswered">("new");
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
  const [linkPreview, setLinkPreview] = useState<{
    url: string;
    title: string;
    description: string;
    image: string | null;
  } | null>(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [dismissedUrl, setDismissedUrl] = useState<string | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<number | null>(null);
  const [reportingReplyId, setReportingReplyId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");

  const postImageInputRef = useRef<HTMLInputElement | null>(null);
  const replyImageInputRef = useRef<HTMLInputElement | null>(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);

  useEffect(() => {
    setVisibleCommentsCount(5);
  }, [activePost?.id]);

  const loadCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const data = await apiRequest<CommunityCategory[]>("/community/categories");
      setCategories(data);
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const loadPosts = useCallback(async (targetPage: number) => {
    if (!activeCategory) {
      setPosts([]);
      return;
    }
    try {
      setIsLoading(true);
      const pageSize = 10;
      const data = await apiRequest<CommunityPost[]>(
        `/community/posts?sortBy=${sortBy}&categoryId=${activeCategory.id}&page=${targetPage}&size=${pageSize}`
      );
      if (targetPage === 0) {
        setPosts(data);
      } else {
        setPosts((current) => [...current, ...data]);
      }
      setPage(targetPage);
      setHasMore(data.length === pageSize);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Không thể tải bài thảo luận.");
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, activeCategory]);

  useEffect(() => {
    void loadPosts(0);
  }, [sortBy, activeCategory, loadPosts]);

  const handleLoadMore = () => {
    void loadPosts(page + 1);
  };

  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = newPost.match(urlRegex);
    if (match && match[0]) {
      const detectedUrl = match[0];
      if (dismissedUrl === detectedUrl) {
        return;
      }
      if (!linkPreview || linkPreview.url !== detectedUrl) {
        const fetchPreview = async () => {
          setIsFetchingPreview(true);
          try {
            const preview = await apiRequest<{
              url: string;
              title: string;
              description: string;
              image: string | null;
            }>(`/community/link-preview?url=${encodeURIComponent(detectedUrl)}`);
            setLinkPreview(preview);
          } catch (e) {
            console.error("Failed to fetch link preview", e);
          } finally {
            setIsFetchingPreview(false);
          }
        };
        void fetchPreview();
      }
    } else {
      setLinkPreview(null);
      setDismissedUrl(null);
    }
  }, [newPost, linkPreview, dismissedUrl]);

  const handleOpenReportModal = (postId: number | null, replyId: number | null) => {
    setReportingPostId(postId);
    setReportingReplyId(replyId);
    setReportReason("");
    setReportModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      toast.error("Vui lòng chọn hoặc nhập lý do báo cáo.");
      return;
    }
    try {
      await apiRequest("/community/reports", {
        method: "POST",
        body: JSON.stringify({
          postId: reportingPostId,
          replyId: reportingReplyId,
          reason: reportReason.trim()
        })
      });
      toast.success("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ duyệt nội dung này sớm nhất có thể.");
      setReportModalOpen(false);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể gửi báo cáo.");
    }
  };

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
    setActivePost((current) => (current && current.id === nextPost.id ? nextPost : current));
  }, []);

  const handleTogglePin = async (postId: number) => {
    try {
      const updatedPost = await apiRequest<CommunityPost>(`/community/posts/${postId}/pin`, {
        method: "POST"
      });
      replacePost(updatedPost);
      toast.success(updatedPost.pinned ? "Đã ghim bài viết lên đầu." : "Đã bỏ ghim bài viết.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Thao tác ghim thất bại.");
    }
  };

  const insertMarkdown = (syntax: "bold" | "italic" | "quote" | "link") => {
    const textarea = document.getElementById("post-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    let newCursorStart = start;
    let newCursorEnd = end;

    switch (syntax) {
      case "bold":
        if (selected) {
          replacement = `**${selected}**`;
          newCursorStart = start + 2;
          newCursorEnd = end + 2;
        } else {
          replacement = "****";
          newCursorStart = start + 2;
          newCursorEnd = start + 2;
        }
        break;
      case "italic":
        if (selected) {
          replacement = `*${selected}*`;
          newCursorStart = start + 1;
          newCursorEnd = end + 1;
        } else {
          replacement = "**";
          newCursorStart = start + 1;
          newCursorEnd = start + 1;
        }
        break;
      case "quote":
        if (selected) {
          replacement = `\n> ${selected}\n`;
          newCursorStart = start + 3;
          newCursorEnd = end + 3;
        } else {
          replacement = "\n> ";
          newCursorStart = start + 3;
          newCursorEnd = start + 3;
        }
        break;
      case "link":
        if (selected) {
          replacement = `[${selected}](url)`;
          newCursorStart = start + selected.length + 3; // Position at "url"
          newCursorEnd = start + selected.length + 6;
        } else {
          replacement = "[Liên kết](url)";
          newCursorStart = start + 1;
          newCursorEnd = start + 8; // Highlight "Liên kết"
        }
        break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setNewPost(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "post" | "reply") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ chọn tệp hình ảnh.");
      return;
    }
    const url = URL.createObjectURL(file);
    if (type === "post") {
      setNewPostImage(file);
      setNewPostImagePreview(url);
    } else {
      setReplyImage(file);
      setReplyImagePreview(url);
    }
  };

  const handleRemoveImage = (type: "post" | "reply") => {
    if (type === "post") {
      setNewPostImage(null);
      setNewPostImagePreview(null);
      if (postImageInputRef.current) postImageInputRef.current.value = "";
    } else {
      setReplyImage(null);
      setReplyImagePreview(null);
      if (replyImageInputRef.current) replyImageInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!user || !newPost.trim() || !activeCategory) {
      return;
    }

    setIsUploadingImage(true);
    try {
      let uploadedImageUrl = null;
      if (newPostImage) {
        const formData = new FormData();
        formData.append("file", newPostImage);
        const uploadRes = await apiRequest<{ url: string }>("/media/upload", {
          method: "POST",
          body: formData,
        });
        uploadedImageUrl = uploadRes.url;
      }

      const createdPost = await apiRequest<CommunityPost>("/community/posts", {
        method: "POST",
        body: JSON.stringify({
          title: newPostTitle.trim() || null,
          content: newPost.trim(),
          anonymous,
          linkUrl: linkPreview?.url || null,
          linkTitle: linkPreview?.title || null,
          linkDescription: linkPreview?.description || null,
          linkImage: linkPreview?.image || null,
          categoryId: activeCategory.id,
          imageUrl: uploadedImageUrl
        }),
      });

      setPosts((current) => [createdPost, ...current]);
      setNewPost("");
      setNewPostTitle("");
      setNewPostImage(null);
      setNewPostImagePreview(null);
      if (postImageInputRef.current) postImageInputRef.current.value = "";
      setAnonymous(false);
      setLinkPreview(null);
      setDismissedUrl(null);
      setError(null);
      toast.success("Đã đăng bài thảo luận.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể đăng bài.");
    } finally {
      setIsUploadingImage(false);
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

    setIsUploadingImage(true);
    try {
      let uploadedImageUrl = null;
      if (replyImage) {
        const formData = new FormData();
        formData.append("file", replyImage);
        const uploadRes = await apiRequest<{ url: string }>("/media/upload", {
          method: "POST",
          body: formData,
        });
        uploadedImageUrl = uploadRes.url;
      }

      const nextPost = await apiRequest<CommunityPost>(`/community/posts/${postId}/replies`, {
        method: "POST",
        body: JSON.stringify({
          content: replyContent.trim(),
          anonymous: replyAnon,
          parentId: replyingToCommentId,
          imageUrl: uploadedImageUrl
        }),
      });

      replacePost(nextPost);
      setReplyContent("");
      setReplyAnon(false);
      setReplyingTo(null);
      setReplyingToCommentId(null);
      setReplyImage(null);
      setReplyImagePreview(null);
      if (replyImageInputRef.current) replyImageInputRef.current.value = "";
      setExpandedReplies((current) => new Set(current).add(postId));
      toast.success("Đã gửi phản hồi.");
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : "Không thể gửi phản hồi.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const nextPosts = await apiRequest<CommunityPost[]>(`/community/posts/${postId}`, {
        method: "DELETE",
      });
      setPosts(nextPosts);
      if (activePost && activePost.id === postId) {
        setActivePost(null);
      }
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
    const shareUrl = `${window.location.origin}/community?postId=${post.id}`;
    const text = `"${post.content.slice(0, 100)}${post.content.length > 100 ? "..." : ""}" - Chia sẻ từ ${post.anonymous ? "Ẩn danh" : post.author} trên EDUcare:\n${shareUrl}`;

    // Kiểm tra thiết bị di động để dùng native share của điện thoại
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: "Thảo luận EDUcare",
          text: text,
          url: shareUrl
        });
        return;
      } catch (e) {
        console.log("Native share cancelled or failed", e);
      }
    }

    // Trên máy tính hoặc khi native share bị hủy, sao chép thẳng vào clipboard
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Đã sao chép nội dung & liên kết! Bạn có thể dán (Ctrl+V) vào Zalo, Messenger để chia sẻ.");
    } catch (e) {
      toast.error("Không thể sao chép liên kết.");
    }
  };

  const categoryIconMap = (icon: string | null) => {
    switch (icon) {
      case "Smile":
        return <Smile className="h-5 w-5 md:h-6 md:w-6" />;
      case "BookOpen":
        return <BookOpen className="h-5 w-5 md:h-6 md:w-6" />;
      case "Users":
        return <Users className="h-5 w-5 md:h-6 md:w-6" />;
      case "Shield":
        return <Shield className="h-5 w-5 md:h-6 md:w-6" />;
      case "MessageCircle":
        return <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />;
      default:
        return <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />;
    }
  };

  const categoryColorMap = (theme: string | null) => {
    switch (theme) {
      case "emerald":
        return {
          bg: "bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/20",
          text: "text-emerald-600",
          pill: "bg-emerald-500 text-white",
          gradient: "from-emerald-50 to-teal-50",
          shadow: "shadow-emerald-500/5",
        };
      case "indigo":
        return {
          bg: "bg-indigo-500/10 hover:bg-indigo-500/15 border-indigo-500/20",
          text: "text-indigo-600",
          pill: "bg-indigo-500 text-white",
          gradient: "from-indigo-50 to-blue-50",
          shadow: "shadow-indigo-500/5",
        };
      case "amber":
        return {
          bg: "bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/20",
          text: "text-amber-600",
          pill: "bg-amber-500 text-white",
          gradient: "from-amber-50 to-orange-50",
          shadow: "shadow-amber-500/5",
        };
      case "rose":
        return {
          bg: "bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/20",
          text: "text-rose-600",
          pill: "bg-rose-500 text-white",
          gradient: "from-rose-50 to-pink-50",
          shadow: "shadow-rose-500/5",
        };
      case "violet":
        return {
          bg: "bg-violet-500/10 hover:bg-violet-500/15 border-violet-500/20",
          text: "text-violet-600",
          pill: "bg-violet-500 text-white",
          gradient: "from-violet-50 to-purple-50",
          shadow: "shadow-violet-500/5",
        };
      default:
        return {
          bg: "bg-primary/10 hover:bg-primary/15 border-primary/20",
          text: "text-primary",
          pill: "bg-primary text-white",
          gradient: "from-purple-50 to-pink-50",
          shadow: "shadow-primary/5",
        };
    }
  };

  if (isCategoriesLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto max-w-4xl px-4 space-y-6">
          <div className="rounded-[2.4rem] border border-white/60 bg-white/40 p-6 animate-pulse">
            <div className="h-4 bg-muted-foreground/15 rounded-full w-24 mb-4"></div>
            <div className="h-8 bg-muted-foreground/15 rounded-full w-3/4 mb-3"></div>
            <div className="h-4 bg-muted-foreground/15 rounded-full w-1/2"></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 rounded-[2rem] bg-white/30 border border-white/60 p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-muted-foreground/15"></div>
                <div className="h-5 bg-muted-foreground/15 rounded-full w-2/3"></div>
                <div className="h-3 bg-muted-foreground/15 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-4">
        {/* Banner Section */}
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] px-6 py-8 shadow-card md:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)] lg:items-end">
            <div>
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                Cộng đồng thảo luận
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight md:text-4xl">
                {activePost 
                  ? "Xem chi tiết bài thảo luận" 
                  : activeCategory 
                    ? `Chuyên mục: ${activeCategory.name}` 
                    : "Cùng chia sẻ, lắng nghe và kết nối."}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/74 md:text-base">
                {activePost 
                  ? "Đóng góp ý kiến và thảo luận một cách văn minh, tôn trọng lẫn nhau."
                  : activeCategory 
                    ? activeCategory.description 
                    : "Nơi chia sẻ tâm sự, định hướng học tập và trao đổi cùng các bạn học sinh và chuyên gia tâm lý."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {[
                { label: "Trạng thái", value: activeCategory ? "Chuyên mục con" : "Toàn hệ thống" },
                { label: "Đi nhanh", value: "Chat, bảng xếp hạng" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/70 bg-white/76 p-4 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Landing Grid */}
        {activeCategory === null && activePost === null ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Chọn chủ đề thảo luận</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {categories.map((cat) => {
                  const colors = categoryColorMap(cat.colorTheme);
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={() => setActiveCategory(cat)}
                      className={`cursor-pointer rounded-[2rem] border p-6 flex flex-col justify-between transition-all shadow-soft bg-white/90 hover:bg-white hover:shadow-md ${colors.bg}`}
                    >
                      <div className="space-y-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.pill}`}>
                          {categoryIconMap(cat.icon)}
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs font-bold text-primary">
                        <span>Vào thảo luận</span>
                        <span>→</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar layout */}
            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,243,234,0.98)_0%,rgba(246,243,255,0.96)_100%)] p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Phím tắt nhanh</p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Nhóm chat cộng đồng", to: "/community/chat" },
                    { label: "Bảng xếp hạng học giả", to: "/community/leaderboard" },
                    { label: "Trò chơi giải trí", to: "/games" },
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
        ) : null}

        {/* Category Feed View */}
        {activeCategory !== null && activePost === null ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
            <div className="space-y-6">
              {/* Back to Categories Link */}
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Quay lại danh mục thảo luận
              </button>

              {error ? <div className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

              {/* Thread Compose Box */}
              {user ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] gradient-card p-6 shadow-card border border-white/60">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
                      {anonymous ? "?" : user.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{anonymous ? "Ẩn danh" : user.fullName}</p>
                      <p className="text-xs text-muted-foreground">Chia sẻ một bài viết trong mục **{activeCategory.name}**</p>
                    </div>
                  </div>

                  {/* Title Field */}
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Tiêu đề thảo luận (Không bắt buộc)..."
                    className="w-full mb-3 rounded-xl border border-white/80 bg-background/50 px-4 py-2 text-sm outline-none focus:border-primary font-bold"
                  />

                  <div className="flex items-center justify-between border-b border-white/40 pb-2 mb-3">
                    <div className="flex gap-1.5">
                      {[
                        { syntax: "bold", label: "Đậm" },
                        { syntax: "italic", label: "Nghiêng" },
                        { syntax: "quote", label: "Trích dẫn" },
                        { syntax: "link", label: "Liên kết" },
                      ].map((item) => (
                        <button
                          key={item.syntax}
                          type="button"
                          onClick={() => insertMarkdown(item.syntax as any)}
                          className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-xs font-semibold transition-all text-foreground"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex rounded-lg bg-background/50 p-0.5 border border-white/20">
                      {["write", "preview"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setEditorMode(mode as any)}
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                            editorMode === mode ? "bg-white text-primary shadow-soft" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {mode === "write" ? "Soạn thảo" : "Xem trước"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {editorMode === "write" ? (
                    <Textarea
                      id="post-textarea"
                      value={newPost}
                      onChange={(event) => setNewPost(event.target.value)}
                      placeholder="Viết nội dung bài thảo luận ở đây..."
                      className="min-h-32 resize-none rounded-[1.5rem] bg-background/60"
                      rows={4}
                    />
                  ) : (
                    <div className="min-h-32 p-4 rounded-[1.5rem] bg-background/60 border border-white/20 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {newPost.trim() ? parseMarkdownToJSX(newPost) : <span className="text-muted-foreground italic">Nội dung xem trước sẽ hiển thị ở đây...</span>}
                    </div>
                  )}

                  {/* Image attachment preview */}
                  {newPostImagePreview && (
                    <div className="relative mt-3 w-fit">
                      <img
                        src={newPostImagePreview}
                        alt="Upload preview"
                        className="rounded-xl max-h-40 object-contain border"
                      />
                      <button
                        onClick={() => handleRemoveImage("post")}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {isFetchingPreview && (
                    <div className="mt-3 p-3 rounded-2xl border border-white/60 bg-white/20 animate-pulse text-xs text-muted-foreground">
                      Đang tải xem trước liên kết...
                    </div>
                  )}
                  {linkPreview && !isFetchingPreview && (
                    <div className="relative mt-3 p-3 rounded-2xl border border-white/60 bg-white/40 shadow-soft flex gap-3 group">
                      {linkPreview.image && (
                        <img
                          src={linkPreview.image}
                          alt={linkPreview.title}
                          className="w-20 h-20 rounded-xl object-cover border border-white/40 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Xem trước liên kết</p>
                        <h4 className="text-sm font-semibold text-foreground truncate mt-0.5">{linkPreview.title}</h4>
                        {linkPreview.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {linkPreview.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setDismissedUrl(linkPreview.url);
                          setLinkPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted text-muted-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAnonymous((current) => !current)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                          anonymous ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {anonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {anonymous ? "Ẩn danh" : "Đăng tên thật"}
                      </button>

                      <input
                        type="file"
                        ref={postImageInputRef}
                        onChange={(e) => handleImageSelect(e, "post")}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => postImageInputRef.current?.click()}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all border ${
                          newPostImagePreview 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : "bg-white hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ImagePlus className="h-4 w-4" />
                        {newPostImagePreview ? "Thay đổi ảnh" : "Đính kèm ảnh"}
                      </button>
                    </div>

                    <Button 
                      onClick={() => void handlePost()} 
                      disabled={!newPost.trim() || isUploadingImage} 
                      className="gap-2 rounded-full gradient-primary px-5 text-primary-foreground font-semibold"
                    >
                      <Send className="h-4 w-4" />
                      {isUploadingImage ? "Đang xử lý..." : "Đăng bài"}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-[2rem] gradient-card p-6 shadow-card border border-white/60">
                  <p className="text-muted-foreground">
                    Đăng nhập để chia sẻ câu chuyện và câu hỏi của bạn trong chuyên mục này.
                  </p>
                  <Link to="/login" className="mt-4 inline-block">
                    <Button className="rounded-full gradient-primary px-5 text-primary-foreground font-semibold">Đăng nhập</Button>
                  </Link>
                </div>
              )}

              {/* Sorting tabs */}
              <div className="flex gap-2 p-1.5 rounded-[1.5rem] border border-white/60 bg-white/40 shadow-soft w-fit mb-6">
                {[
                  { id: "new", label: "Mới nhất", icon: <Clock className="h-4 w-4" /> },
                  { id: "hot", label: "Nổi bật", icon: <TrendingUp className="h-4 w-4" /> },
                  { id: "unanswered", label: "Chuyên gia chưa giải đáp", icon: <HelpCircle className="h-4 w-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSortBy(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                      sortBy === tab.id
                        ? "bg-white text-primary shadow-soft"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Posts/Threads listing inside Category */}
              {isLoading && posts.length === 0 ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-48 rounded-[2rem] bg-white/40 border p-6"></div>
                  ))}
                </div>
              ) : (
                <>
                  <AnimatePresence>
                  {postsWithTopics.length === 0 ? (
                    <div className="rounded-[2rem] gradient-card px-6 py-16 text-center shadow-card border border-white/60">
                      <MessageCircle className="mx-auto mb-3 h-12 w-12 opacity-30" />
                      <p className="text-muted-foreground">Chưa có bài viết nào trong chủ đề này. Hãy là người mở đầu thảo luận nhé!</p>
                    </div>
                  ) : null}

                  {postsWithTopics.map((post) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`detail-panel p-6 relative rounded-[2rem] shadow-soft bg-white/95 border border-white/60 hover:shadow-md transition-all ${
                        post.pinned ? "border-2 border-mint/45 bg-mint/5" : ""
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender/30 font-bold text-lavender-foreground">
                            {post.anonymous ? "?" : post.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{post.anonymous ? "Ẩn danh" : post.author}</p>
                              {post.pinned && (
                                <span className="flex items-center gap-1 rounded-full bg-mint/15 border border-mint/20 px-2 py-0.5 text-[9px] font-bold text-mint-foreground">
                                  📌 Ghim
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {user?.isAdmin && (
                            <button
                              onClick={() => void handleTogglePin(post.id)}
                              className={`rounded-xl p-2 transition-colors ${
                                post.pinned ? "text-mint bg-mint/10" : "text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              <Pin className="h-4 w-4" />
                            </button>
                          )}
                          {user && post.authorId === user.id ? (
                            <button
                              onClick={() => void handleDeletePost(post.id)}
                              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : user && post.authorId !== user.id ? (
                            <button
                              onClick={() => handleOpenReportModal(post.id, null)}
                              className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-500"
                            >
                              <Flag className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {post.title && (
                        <h3 
                          onClick={() => setActivePost(post)}
                          className="text-lg font-bold text-foreground mb-2 cursor-pointer hover:text-primary transition-colors leading-snug"
                        >
                          {post.title}
                        </h3>
                      )}

                      <div 
                        onClick={() => setActivePost(post)}
                        className="text-sm leading-7 text-foreground/86 cursor-pointer hover:text-foreground line-clamp-4"
                      >
                        {parseMarkdownToJSX(post.content)}
                      </div>

                      {post.imageUrl && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-white/40 max-w-md cursor-pointer" onClick={() => setActivePost(post)}>
                          <img
                            src={post.imageUrl}
                            alt="Attached attachment"
                            className="w-full object-cover max-h-60"
                          />
                        </div>
                      )}

                      {post.linkUrl && (
                        <a
                          href={post.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 p-3 rounded-2xl border border-white/65 bg-white/40 hover:bg-white/60 transition-all flex gap-3 shadow-soft group cursor-pointer block"
                        >
                          {post.linkImage && (
                            <img
                              src={post.linkImage}
                              alt={post.linkTitle || ""}
                              className="w-20 h-20 rounded-xl object-cover border border-white/40 flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold text-primary/80 uppercase tracking-wider block">Liên kết</span>
                            <h4 className="text-sm font-semibold text-foreground truncate mt-0.5 group-hover:text-primary transition-colors">
                              {post.linkTitle || post.linkUrl}
                            </h4>
                          </div>
                        </a>
                      )}

                      <div className="mt-5 flex items-center gap-5 text-muted-foreground border-t border-white/20 pt-3">
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
                          onClick={() => setActivePost(post)}
                          className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {post.replies.length > 0 ? `${post.replies.length} bình luận` : "Bình luận"}
                        </button>

                        <button onClick={() => void handleShare(post)} className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                          <Share2 className="h-4 w-4" />
                          Chia sẻ
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
                {hasMore && posts.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      variant="outline"
                      className="rounded-full px-8 py-4 border-white/60 bg-white/40 hover:bg-white/80 transition-all font-semibold shadow-soft text-primary gap-2 h-auto"
                    >
                      {isLoading ? "Đang tải thêm..." : "Xem thêm bài viết"}
                    </Button>
                  </div>
                )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,232,241,0.96)_0%,rgba(243,240,255,0.96)_52%,rgba(231,246,255,0.96)_100%)] p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Thống kê chuyên mục</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-white/20">
                    <span className="text-muted-foreground">Bài đăng:</span>
                    <span className="font-bold text-foreground">{posts.length}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Phản hồi:</span>
                    <span className="font-bold text-foreground">
                      {posts.reduce((sum, p) => sum + p.replies.length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        ) : null}

        {/* Thread Detail View */}
        {activePost !== null ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
            <div className="space-y-6">
              {/* Go Back */}
              <button
                onClick={() => {
                  setActivePost(null);
                  void loadPosts(0);
                }}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Quay lại danh sách bài thảo luận
              </button>

              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`detail-panel p-6 rounded-[2rem] shadow-soft bg-white/95 border border-white/60 relative ${
                  activePost.pinned ? "border-2 border-mint/45 bg-mint/5" : ""
                }`}
              >
                {/* Author Info */}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender/30 font-bold text-lavender-foreground">
                      {activePost.anonymous ? "?" : activePost.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{activePost.anonymous ? "Ẩn danh" : activePost.author}</p>
                        {activePost.pinned && (
                          <span className="flex items-center gap-1 rounded-full bg-mint/15 border border-mint/20 px-2 py-0.5 text-[9px] font-bold text-mint-foreground">
                            📌 Ghim
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{timeAgo(activePost.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {user?.isAdmin && (
                      <button
                        onClick={() => void handleTogglePin(activePost.id)}
                        className={`rounded-xl p-2 transition-colors ${
                          activePost.pinned ? "text-mint bg-mint/10" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                    )}
                    {user && activePost.authorId === user.id ? (
                      <button
                        onClick={() => void handleDeletePost(activePost.id)}
                        className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : user && activePost.authorId !== user.id ? (
                      <button
                        onClick={() => handleOpenReportModal(activePost.id, null)}
                        className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-amber-500/10 hover:text-amber-500"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>

                {activePost.title && (
                  <h2 className="text-xl font-extrabold text-foreground mb-3 leading-snug">
                    {activePost.title}
                  </h2>
                )}

                <div className="text-sm leading-7 text-foreground/86 mb-4">{parseMarkdownToJSX(activePost.content)}</div>

                {activePost.imageUrl && (
                  <div className="my-4 overflow-hidden rounded-2xl border max-w-2xl">
                    <img
                      src={activePost.imageUrl}
                      alt="Thread attachment"
                      className="w-full object-contain max-h-96"
                    />
                  </div>
                )}

                {activePost.linkUrl && (
                  <a
                    href={activePost.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="my-3 p-3 rounded-2xl border border-white/65 bg-white/40 hover:bg-white/60 transition-all flex gap-3 shadow-soft block"
                  >
                    {activePost.linkImage && (
                      <img
                        src={activePost.linkImage}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-muted-foreground block">Liên kết ngoài</span>
                      <h4 className="text-sm font-semibold text-foreground truncate mt-0.5 hover:text-primary">
                        {activePost.linkTitle || activePost.linkUrl}
                      </h4>
                    </div>
                  </a>
                )}

                <div className="mt-5 flex items-center gap-5 text-muted-foreground border-t border-white/20 pt-3">
                  <button
                    onClick={() => void handlePostLike(activePost.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      activePost.liked ? "text-pink-foreground" : "hover:text-pink-foreground"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${activePost.liked ? "fill-current" : ""}`} />
                    {activePost.likes > 0 ? activePost.likes : "Thích"}
                  </button>

                  <button onClick={() => void handleShare(activePost)} className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary">
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                  </button>
                </div>
              </motion.article>

              {/* Replies Section Header */}
              <div className="border-b pb-2">
                <h3 className="font-bold text-base text-foreground">
                  Bình luận ({activePost.replies.length})
                </h3>
              </div>

              {/* Threaded Hierarchical Replies */}
              <div className="space-y-4">
                {activePost.replies.length === 0 ? (
                  <div className="rounded-[1.5rem] bg-white/40 p-8 text-center text-muted-foreground italic border border-white/60">
                    Chưa có bình luận nào. Hãy bắt đầu thảo luận nhé!
                  </div>
                ) : (
                  (() => {
                    const rootReplies = buildReplyTree(activePost.replies);
                    const visibleReplies = rootReplies.slice(0, visibleCommentsCount);
                    return (
                      <>
                        {visibleReplies.map((reply) => (
                          <ReplyNode
                            key={reply.id}
                            reply={reply}
                            depth={0}
                            user={user}
                            replyingTo={replyingTo}
                            replyingToCommentId={replyingToCommentId}
                            replyContent={replyContent}
                            replyAnon={replyAnon}
                            setReplyContent={setReplyContent}
                            setReplyAnon={setReplyAnon}
                            onStartReply={(postId, replyId) => {
                              setReplyingTo(postId);
                              setReplyingToCommentId(replyId);
                              setReplyContent("");
                            }}
                            onSubmitReply={handleReply}
                            onLike={handleReplyLike}
                            onDelete={handleDeleteReply}
                            onReport={handleOpenReportModal}
                            postId={activePost.id}
                            timeAgo={timeAgo}
                          />
                        ))}
                        {rootReplies.length > visibleCommentsCount && (
                          <div className="mt-4 flex justify-center">
                            <button
                              onClick={() => setVisibleCommentsCount((prev) => prev + 5)}
                              className="text-xs text-primary font-bold hover:underline bg-primary/10 px-4 py-2 rounded-full transition-all border border-primary/20 hover:bg-primary/15"
                            >
                              Xem thêm bình luận ({rootReplies.length - visibleCommentsCount} bình luận ẩn)
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()
                )}
              </div>

              {/* Top-Level Comment Input Box */}
              {user ? (
                <div className="rounded-[2rem] gradient-card p-4 border border-white/60 shadow-soft">
                  <h4 className="text-sm font-semibold mb-2">Để lại bình luận của bạn:</h4>
                  <Textarea
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                    placeholder="Nhập nội dung bình luận..."
                    className="detail-input min-h-24 resize-none text-sm bg-background/60"
                    rows={3}
                  />

                  {/* Reply attachment preview */}
                  {replyImagePreview && (
                    <div className="relative mt-2 w-fit">
                      <img
                        src={replyImagePreview}
                        alt="Reply preview"
                        className="rounded-lg max-h-24 object-contain border"
                      />
                      <button
                        onClick={() => handleRemoveImage("reply")}
                        className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5 hover:bg-destructive/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReplyAnon((current) => !current)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
                          replyAnon ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {replyAnon ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {replyAnon ? "Ẩn danh" : "Tên thật"}
                      </button>

                      <input
                        type="file"
                        ref={replyImageInputRef}
                        onChange={(e) => handleImageSelect(e, "reply")}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => replyImageInputRef.current?.click()}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors border ${
                          replyImagePreview 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" 
                            : "bg-white hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                        {replyImagePreview ? "Thay đổi ảnh" : "Đính kèm ảnh"}
                      </button>
                    </div>

                    <Button 
                      onClick={() => void handleReply(activePost.id)} 
                      disabled={!replyContent.trim() || isUploadingImage} 
                      size="sm" 
                      className="rounded-full gradient-primary text-primary-foreground font-semibold px-4"
                    >
                      <Send className="mr-2 h-3.5 w-3.5" />
                      {isUploadingImage ? "Đang gửi..." : "Gửi bình luận"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.5rem] bg-white/40 p-4 text-center border border-white/60">
                  <p className="text-sm text-muted-foreground">Đăng nhập để viết bình luận dưới bài viết này.</p>
                </div>
              )}
            </div>

            {/* Sidebar for Thread Detail */}
            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              {activePost.categoryId && categories.find(c => c.id === activePost.categoryId) && (() => {
                const cat = categories.find(c => c.id === activePost.categoryId)!;
                const colors = categoryColorMap(cat.colorTheme);
                return (
                  <div className={`rounded-[2rem] border p-6 shadow-card bg-white/95 ${colors.bg}`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                      Thuộc chuyên mục
                    </span>
                    <h4 className="text-lg font-bold text-foreground mt-1 flex items-center gap-2">
                      <span className={`h-8 w-8 rounded-lg ${colors.pill} flex items-center justify-center`}>
                        {categoryIconMap(cat.icon)}
                      </span>
                      {cat.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory(cat);
                        setActivePost(null);
                      }}
                      className="mt-4 text-xs font-bold text-primary hover:underline block"
                    >
                      Xem toàn bộ bài trong mục này →
                    </button>
                  </div>
                );
              })()}
            </aside>
          </section>
        ) : null}
      </div>

      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,245,245,0.98)_0%,rgba(253,250,255,0.98)_100%)] p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-heading text-lg font-bold text-foreground">Báo cáo nội dung vi phạm</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Hãy cho chúng tôi biết tại sao bạn muốn báo cáo nội dung này. Ý kiến của bạn giúp cộng đồng an toàn hơn.
              </p>
              
              <div className="space-y-2 mb-4">
                {[
                  "Ngôn từ không phù hợp hoặc thô tục",
                  "Quấy rối, bắt nạt hoặc thù ghét",
                  "Chia sẻ hình ảnh, liên kết không an toàn",
                  "Spam hoặc thông tin sai lệch",
                ].map((reasonOption) => (
                  <label
                    key={reasonOption}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      reportReason === reasonOption
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background/50 border-white/80 hover:bg-background"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reasonOption}
                      checked={reportReason === reasonOption}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-xs md:text-sm font-semibold">{reasonOption}</span>
                  </label>
                ))}
                
                <div className="pt-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Lý do khác:</p>
                  <input
                    type="text"
                    placeholder="Nhập lý do cụ thể..."
                    value={
                      [
                        "Ngôn từ không phù hợp hoặc thô tục",
                        "Quấy rối, bắt nạt hoặc thù ghét",
                        "Chia sẻ hình ảnh, liên kết không an toàn",
                        "Spam hoặc thông tin sai lệch",
                      ].includes(reportReason)
                        ? ""
                        : reportReason
                    }
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-background/50 px-3 py-2 text-xs md:text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  onClick={() => setReportModalOpen(false)}
                  variant="outline"
                  className="rounded-full px-5"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => void handleSubmitReport()}
                  disabled={!reportReason.trim()}
                  className="rounded-full gradient-primary text-primary-foreground px-5"
                >
                  Gửi báo cáo
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
