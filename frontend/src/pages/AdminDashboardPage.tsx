import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, FileText, Gamepad2, LogOut, Plus, Shield, Sparkles, Trash2, Users, AlertTriangle, HelpCircle, Smile } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ADMIN_COPY } from "@/content/uiCopy";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { AdminContentResponse, AdminDashboardResponse, CommunityReport, AnonymousQuestion, ChatStickerResponse } from "@/types/api";

type AdminTab = "lessons" | "blogPosts" | "quizQuestions" | "games" | "reports" | "questions" | "stickers";

type EditableLesson = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  order: number;
  isFree: boolean;
};

type EditableBlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  emoji: string;
};

type EditableQuizQuestion = {
  id: number;
  slug: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: string;
  active: boolean;
};

type EditableGame = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  gameType: string;
  playPath: string;
  coverImage: string | null;
  accentColor: string | null;
  published: boolean;
};

function fallbackMessage(error: unknown, message: string) {
  return error instanceof ApiError ? error.message : message;
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
  }).format(date);
}

function planLabel(plan: string) {
  return plan === "PREMIUM" ? "Premium" : "Miễn phí";
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [content, setContent] = useState<AdminContentResponse | null>(null);
  const [stickers, setStickers] = useState<ChatStickerResponse[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>("lessons");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<AnonymousQuestion | null>(null);
  const [answerText, setAnswerText] = useState("");

  const [stickerForm, setStickerForm] = useState({
    id: null as number | null,
    name: "",
    url: "",
    type: "STICKER" as "STICKER" | "GIF",
    category: "study",
    keywordsString: "",
  });

  useEffect(() => {
    setSelectedReport(null);
    setSelectedQuestion(null);
    setAnswerText("");
  }, [activeTab]);
  const [lessonForm, setLessonForm] = useState({
    id: null as number | null,
    slug: "",
    title: "",
    summary: "",
    content: "",
    order: "",
    isFree: true,
  });
  const [blogForm, setBlogForm] = useState({
    id: null as number | null,
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    readTimeMinutes: "5",
    emoji: ADMIN_COPY.defaults.blogEmoji as string,
  });
  const [quizForm, setQuizForm] = useState({
    id: null as number | null,
    slug: "",
    question: "",
    options: ["", "", "", ""],
    correct: "0",
    explanation: "",
    category: ADMIN_COPY.defaults.quizCategory as string,
    difficulty: ADMIN_COPY.defaults.quizDifficulty as string,
    active: true,
  });
  const [gameForm, setGameForm] = useState({
    id: null as number | null,
    slug: "",
    title: "",
    summary: "",
    description: "",
    gameType: "QUIZ" as string,
    playPath: "",
    coverImage: "hero-illustration.png",
    accentColor: "#9b5de5",
    published: true,
  });

  const loadData = async () => {
    setIsLoading(true);

    try {
      const [dashboardResponse, contentResponse, reportsResponse, questionsResponse, stickersResponse] = await Promise.all([
        apiRequest<AdminDashboardResponse>("/admin/dashboard"),
        apiRequest<AdminContentResponse>("/admin/content"),
        apiRequest<CommunityReport[]>("/community/admin/reports"),
        apiRequest<AnonymousQuestion[]>("/community/admin/questions"),
        apiRequest<ChatStickerResponse[]>("/community/stickers"),
      ]);
      setDashboard(dashboardResponse);
      setContent(contentResponse);
      setReports(reportsResponse);
      setQuestions(questionsResponse);
      setStickers(stickersResponse);
      setError(null);
    } catch (requestError) {
      setError(fallbackMessage(requestError, ADMIN_COPY.loadError));
    } finally {
      setIsLoading(false);
    }
  };

  const resolveReport = async (reportId: number, deleteContent: boolean) => {
    setIsSaving(true);
    try {
      await apiRequest(`/community/admin/reports/${reportId}/resolve?deleteContent=${deleteContent}`, {
        method: "PUT",
      });
      toast.success(deleteContent ? "Đã xóa nội dung vi phạm thành công." : "Đã bác bỏ báo cáo.");
      await loadData();
      setSelectedReport(null);
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, "Không thể xử lý báo cáo."));
    } finally {
      setIsSaving(false);
    }
  };

  const answerQuestion = async (questionId: number) => {
    if (!answerText.trim()) return;
    setIsSaving(true);
    try {
      await apiRequest(`/community/admin/questions/${questionId}/answer`, {
        method: "POST",
        body: JSON.stringify({ answer: answerText.trim() }),
      });
      toast.success("Đã gửi câu trả lời cho câu hỏi ẩn danh thành công.");
      await loadData();
      setSelectedQuestion(null);
      setAnswerText("");
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, "Không thể gửi câu trả lời."));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetLessonForm = () => setLessonForm({ id: null, slug: "", title: "", summary: "", content: "", order: "", isFree: true });
  const resetBlogForm = () =>
    setBlogForm({
      id: null,
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      readTimeMinutes: "5",
      emoji: ADMIN_COPY.defaults.blogEmoji,
    });
  const resetQuizForm = () =>
    setQuizForm({
      id: null,
      slug: "",
      question: "",
      options: ["", "", "", ""],
      correct: "0",
      explanation: "",
      category: ADMIN_COPY.defaults.quizCategory,
      difficulty: ADMIN_COPY.defaults.quizDifficulty,
      active: true,
    });
  const resetGameForm = () =>
    setGameForm({
      id: null,
      slug: "",
      title: "",
      summary: "",
      description: "",
      gameType: "QUIZ",
      playPath: "",
      coverImage: "hero-illustration.png",
      accentColor: "#9b5de5",
      published: true,
    });

  const resetStickerForm = () =>
    setStickerForm({
      id: null,
      name: "",
      url: "",
      type: "STICKER",
      category: "study",
      keywordsString: "",
    });

  const createNew = () => {
    if (activeTab === "lessons") resetLessonForm();
    if (activeTab === "blogPosts") resetBlogForm();
    if (activeTab === "quizQuestions") resetQuizForm();
    if (activeTab === "games") resetGameForm();
    if (activeTab === "stickers") resetStickerForm();
  };

  const saveSticker = async () => {
    setIsSaving(true);
    try {
      const keywords = stickerForm.keywordsString
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const saved = await apiRequest<ChatStickerResponse>(
        stickerForm.id ? `/admin/stickers/${stickerForm.id}` : "/admin/stickers",
        {
          method: stickerForm.id ? "PUT" : "POST",
          body: JSON.stringify({
            name: stickerForm.name,
            url: stickerForm.url,
            type: stickerForm.type,
            category: stickerForm.category,
            keywords,
          }),
        }
      );
      toast.success("Đã lưu nhãn dán/GIF thành công.");
      await loadData();
      setStickerForm({
        id: saved.id,
        name: saved.name,
        url: saved.url,
        type: saved.type,
        category: saved.category,
        keywordsString: saved.keywords ? saved.keywords.join(", ") : "",
      });
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, "Không thể lưu nhãn dán/GIF."));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSticker = async () => {
    if (!stickerForm.id) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhãn dán/GIF này?")) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/stickers/${stickerForm.id}`, { method: "DELETE" });
      toast.success("Đã xóa nhãn dán/GIF thành công.");
      resetStickerForm();
      await loadData();
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, "Không thể xóa nhãn dán/GIF."));
    } finally {
      setIsSaving(false);
    }
  };

  const saveLesson = async () => {
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${lessonForm.id ? `lessons/${lessonForm.id}` : "lessons"}`, {
        method: lessonForm.id ? "PUT" : "POST",
        body: JSON.stringify({
          slug: lessonForm.slug,
          title: lessonForm.title,
          summary: lessonForm.summary,
          content: lessonForm.content,
          order: lessonForm.order ? Number(lessonForm.order) : null,
          isFree: lessonForm.isFree,
        }),
      });
      toast.success(ADMIN_COPY.actions.saveSuccess.lesson);
      await loadData();
      const item = saved as EditableLesson;
      setLessonForm({ id: item.id, slug: item.slug, title: item.title, summary: item.summary, content: item.content, order: String(item.order), isFree: item.isFree });
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, ADMIN_COPY.errors.saveLesson));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLesson = async () => {
    if (!lessonForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/lessons/${lessonForm.id}`, { method: "DELETE" });
      toast.success(ADMIN_COPY.actions.deleteSuccess.lesson);
      resetLessonForm();
      await loadData();
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, ADMIN_COPY.errors.deleteLesson));
    } finally {
      setIsSaving(false);
    }
  };

  const saveBlog = async () => {
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${blogForm.id ? `blog-posts/${blogForm.id}` : "blog-posts"}`, {
        method: blogForm.id ? "PUT" : "POST",
        body: JSON.stringify({
          slug: blogForm.slug,
          title: blogForm.title,
          excerpt: blogForm.excerpt,
          content: blogForm.content,
          category: blogForm.category,
          date: blogForm.date,
          readTimeMinutes: Number(blogForm.readTimeMinutes) || 5,
          emoji: blogForm.emoji,
        }),
      });
      toast.success(ADMIN_COPY.actions.saveSuccess.blogPost);
      await loadData();
      const item = saved as EditableBlogPost;
      setBlogForm({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category,
        date: item.date,
        readTimeMinutes: item.readTime.replace(/\D/g, "") || "5",
        emoji: item.emoji,
      });
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, ADMIN_COPY.errors.saveBlogPost));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBlog = async () => {
    if (!blogForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/blog-posts/${blogForm.id}`, { method: "DELETE" });
      toast.success(ADMIN_COPY.actions.deleteSuccess.blogPost);
      resetBlogForm();
      await loadData();
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, ADMIN_COPY.errors.deleteBlogPost));
    } finally {
      setIsSaving(false);
    }
  };

  const saveQuiz = async () => {
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${quizForm.id ? `quiz-questions/${quizForm.id}` : "quiz-questions"}`, {
        method: quizForm.id ? "PUT" : "POST",
        body: JSON.stringify({
          slug: quizForm.slug,
          question: quizForm.question,
          options: quizForm.options.map((item) => item.trim()).filter(Boolean),
          correct: Number(quizForm.correct) || 0,
          explanation: quizForm.explanation,
          category: quizForm.category,
          difficulty: quizForm.difficulty,
          active: quizForm.active,
        }),
      });
      toast.success(ADMIN_COPY.actions.saveSuccess.quizQuestion);
      await loadData();
      const item = saved as EditableQuizQuestion;
      setQuizForm({
        id: item.id,
        slug: item.slug,
        question: item.question,
        options: [...item.options, "", "", "", ""].slice(0, 4),
        correct: String(item.correct),
        explanation: item.explanation ?? "",
        category: item.category,
        difficulty: item.difficulty,
        active: item.active,
      });
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, ADMIN_COPY.errors.saveQuizQuestion));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteQuiz = async () => {
    if (!quizForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/quiz-questions/${quizForm.id}`, { method: "DELETE" });
      toast.success(ADMIN_COPY.actions.deleteSuccess.quizQuestion);
      resetQuizForm();
      await loadData();
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, ADMIN_COPY.errors.deleteQuizQuestion));
    } finally {
      setIsSaving(false);
    }
  };

  const saveGame = async () => {
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${gameForm.id ? `games/${gameForm.id}` : "games"}`, {
        method: gameForm.id ? "PUT" : "POST",
        body: JSON.stringify({
          slug: gameForm.slug,
          title: gameForm.title,
          summary: gameForm.summary,
          description: gameForm.description,
          gameType: gameForm.gameType,
          playPath: gameForm.playPath,
          coverImage: gameForm.coverImage,
          accentColor: gameForm.accentColor,
          published: gameForm.published,
        }),
      });
      toast.success(ADMIN_COPY.actions.saveSuccess.game);
      await loadData();
      const item = saved as EditableGame;
      setGameForm({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        description: item.description,
        gameType: item.gameType,
        playPath: item.playPath,
        coverImage: item.coverImage ?? "",
        accentColor: item.accentColor ?? "#9b5de5",
        published: item.published,
      });
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, ADMIN_COPY.errors.saveGame));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteGame = async () => {
    if (!gameForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/games/${gameForm.id}`, { method: "DELETE" });
      toast.success(ADMIN_COPY.actions.deleteSuccess.game);
      resetGameForm();
      await loadData();
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, ADMIN_COPY.errors.deleteGame));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[linear-gradient(135deg,rgba(255,238,244,0.94)_0%,rgba(245,241,255,0.96)_48%,rgba(232,246,255,0.92)_100%)] p-6">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 px-8 py-6 shadow-[0_24px_80px_rgba(77,34,122,0.14)]">{ADMIN_COPY.loading}</div>
      </div>
    );
  }

  if (error || !dashboard || !content) {
    return (
      <div className="flex h-screen items-center justify-center bg-[linear-gradient(135deg,rgba(255,238,244,0.94)_0%,rgba(245,241,255,0.96)_48%,rgba(232,246,255,0.92)_100%)] p-6">
        <div className="max-w-xl rounded-[2rem] border border-destructive/20 bg-white/90 px-8 py-6 text-destructive shadow-[0_24px_80px_rgba(77,34,122,0.14)]">{error ?? ADMIN_COPY.loadError}</div>
      </div>
    );
  }

  const tabs = [
    {
      id: "lessons" as const,
      label: ADMIN_COPY.tabs.lessons,
      caption: "Quản lý chương học, thứ tự và quyền truy cập.",
      icon: BookOpen,
      count: content.metrics.lessons,
    },
    {
      id: "blogPosts" as const,
      label: ADMIN_COPY.tabs.blogPosts,
      caption: "Tối ưu thư viện bài viết theo chủ đề và thời lượng đọc.",
      icon: FileText,
      count: content.metrics.blogPosts,
    },
    {
      id: "quizQuestions" as const,
      label: ADMIN_COPY.tabs.quizQuestions,
      caption: "Theo dõi chất lượng câu hỏi và vùng kiến thức.",
      icon: Sparkles,
      count: content.metrics.quizQuestions,
    },
    {
      id: "games" as const,
      label: ADMIN_COPY.tabs.games,
      caption: "Cập nhật danh mục trò chơi và đường dẫn vào game.",
      icon: Gamepad2,
      count: content.metrics.games,
    },
    {
      id: "stickers" as const,
      label: "Nhãn dán / GIF",
      caption: "Quản lý kho nhãn dán và ảnh động GIF của phòng chat.",
      icon: Smile,
      count: stickers.length,
    },
    {
      id: "reports" as const,
      label: "Báo cáo vi phạm",
      caption: "Duyệt hoặc bác bỏ nội dung bị báo cáo.",
      icon: AlertTriangle,
      count: reports.filter((r) => r.status === "PENDING").length,
    },
    {
      id: "questions" as const,
      label: "Câu hỏi ẩn danh",
      caption: "Trả lời các câu hỏi ẩn danh từ học sinh.",
      icon: HelpCircle,
      count: questions.filter((q) => !q.answer || q.answer.trim() === "").length,
    },
  ];

  const stats = [
    { label: "Người dùng", value: dashboard.summary.totalUsers, help: `${dashboard.summary.totalAdmins} admin`, icon: Users },
    { label: "Câu hỏi quiz", value: dashboard.summary.totalQuizQuestions, help: `${dashboard.summary.totalQuizAttempts} lượt chơi`, icon: Sparkles },
    { label: "Hoàn thành bài học", value: dashboard.summary.lessonCompletions, help: `${dashboard.summary.communityPosts} bài thảo luận`, icon: BookOpen },
    { label: "Kho nội dung", value: content.metrics.lessons + content.metrics.blogPosts + content.metrics.games, help: `${dashboard.summary.anonymousQuestions} câu hỏi ẩn danh`, icon: Shield },
  ];

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const renderList = () => {
    if (activeTab === "lessons") {
      return content.lessons.map((lesson) => (
        <button
          key={lesson.id}
          onClick={() => setLessonForm({ id: lesson.id, slug: lesson.slug, title: lesson.title, summary: lesson.summary, content: lesson.content, order: String(lesson.order), isFree: lesson.isFree })}
          className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all ${lessonForm.id === lesson.id ? "border-primary/30 bg-primary/10 shadow-[0_18px_40px_rgba(120,63,217,0.12)]" : "border-white/70 bg-white/72 hover:bg-white/88"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{lesson.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{lesson.slug} · Bài {lesson.order}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{lesson.isFree ? "Miễn phí" : "Giới hạn"}</span>
          </div>
        </button>
      ));
    }

    if (activeTab === "blogPosts") {
      return content.blogPosts.map((post) => (
        <button
          key={post.id}
          onClick={() => setBlogForm({ id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, date: post.date, readTimeMinutes: post.readTime.replace(/\D/g, "") || "5", emoji: post.emoji })}
          className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all ${blogForm.id === post.id ? "border-primary/30 bg-primary/10 shadow-[0_18px_40px_rgba(120,63,217,0.12)]" : "border-white/70 bg-white/72 hover:bg-white/88"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{post.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{post.category} · {formatDate(post.date)}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.readTime}</span>
          </div>
        </button>
      ));
    }

    if (activeTab === "quizQuestions") {
      return content.quizQuestions.map((question) => (
        <button
          key={question.id}
          onClick={() => setQuizForm({ id: question.id, slug: question.slug, question: question.question, options: [...question.options, "", "", "", ""].slice(0, 4), correct: String(question.correct), explanation: question.explanation ?? "", category: question.category, difficulty: question.difficulty, active: question.active })}
          className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all ${quizForm.id === question.id ? "border-primary/30 bg-primary/10 shadow-[0_18px_40px_rgba(120,63,217,0.12)]" : "border-white/70 bg-white/72 hover:bg-white/88"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="line-clamp-2 text-base font-semibold text-foreground">{question.question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{question.category} · {question.difficulty}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{question.active ? "Đang dùng" : "Ẩn"}</span>
          </div>
        </button>
      ));
    }

    if (activeTab === "games") {
      return content.games.map((game) => (
        <button
          key={game.id}
          onClick={() => setGameForm({ id: game.id, slug: game.slug, title: game.title, summary: game.summary, description: game.description, gameType: game.gameType, playPath: game.playPath, coverImage: game.coverImage ?? "", accentColor: game.accentColor ?? "#9b5de5", published: game.published })}
          className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all ${gameForm.id === game.id ? "border-primary/30 bg-primary/10 shadow-[0_18px_40px_rgba(120,63,217,0.12)]" : "border-white/70 bg-white/72 hover:bg-white/88"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{game.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{game.gameType} · {game.playPath}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{game.published ? "Hiển thị" : "Nháp"}</span>
          </div>
        </button>
      ));
    }

    if (activeTab === "reports") {
      return reports.map((report) => (
        <button
          key={report.id}
          onClick={() => setSelectedReport(report)}
          className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all ${
            selectedReport?.id === report.id
              ? "border-primary/30 bg-primary/10 shadow-[0_18px_40px_rgba(120,63,217,0.12)]"
              : "border-white/70 bg-white/72 hover:bg-white/88"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-base font-semibold text-foreground">
                Lý do: {report.reason}
              </p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {report.contentPreview}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Bởi: {report.reporterName} · {formatDate(report.createdAt)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                report.status === "PENDING"
                  ? "bg-amber-100 text-amber-800"
                  : report.status === "RESOLVED"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {report.status === "PENDING"
                ? "Chờ duyệt"
                : report.status === "RESOLVED"
                ? "Đã xử lý"
                : "Đã bác bỏ"}
            </span>
          </div>
        </button>
      ));
    }

    if (activeTab === "questions") {
      return questions.map((q) => (
        <button
          key={q.id}
          onClick={() => {
            setSelectedQuestion(q);
            setAnswerText(q.answer || "");
          }}
          className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all ${
            selectedQuestion?.id === q.id
              ? "border-primary/30 bg-primary/10 shadow-[0_18px_40px_rgba(120,63,217,0.12)]"
              : "border-white/70 bg-white/72 hover:bg-white/88"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-base font-semibold text-foreground">
                {q.question}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Gửi lúc: {formatDate(q.createdAt)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                !q.answer || q.answer.trim() === ""
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {!q.answer || q.answer.trim() === "" ? "Chưa trả lời" : "Đã trả lời"}
            </span>
          </div>
        </button>
      ));
    }

    if (activeTab === "stickers") {
      return stickers.map((st) => (
        <button
          key={st.id}
          onClick={() =>
            setStickerForm({
              id: st.id,
              name: st.name,
              url: st.url,
              type: st.type,
              category: st.category,
              keywordsString: st.keywords ? st.keywords.join(", ") : "",
            })
          }
          className={`w-full rounded-[1.4rem] border px-4 py-3 text-left transition-all ${
            stickerForm.id === st.id
              ? "border-primary/30 bg-primary/10 shadow-[0_18px_40px_rgba(120,63,217,0.12)]"
              : "border-white/70 bg-white/72 hover:bg-white/88"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-white/60 p-1">
              <img src={st.url} alt={st.name} className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-foreground">{st.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                Chủ đề: {st.category} · Từ khóa: {st.keywords?.join(", ")}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              {st.type}
            </span>
          </div>
        </button>
      ));
    }

    return null;
  };

  const renderEditor = () => {
    if (activeTab === "lessons") {
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">{ADMIN_COPY.editor.lessons}</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">{lessonForm.id ? ADMIN_COPY.titles.updateLesson : ADMIN_COPY.titles.createLesson}</h2>
            </div>
            {lessonForm.id ? (
              <Button variant="outline" size="sm" onClick={deleteLesson} disabled={isSaving}>
                <Trash2 className="mr-2 h-4 w-4" />
                {ADMIN_COPY.actions.delete}
              </Button>
            ) : null}
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Slug</Label><Input value={lessonForm.slug} onChange={(event) => setLessonForm((current) => ({ ...current, slug: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.order}</Label><Input type="number" value={lessonForm.order} onChange={(event) => setLessonForm((current) => ({ ...current, order: event.target.value }))} /></div>
            </div>
            <div><Label>{ADMIN_COPY.fields.title}</Label><Input value={lessonForm.title} onChange={(event) => setLessonForm((current) => ({ ...current, title: event.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.shortDescription}</Label><Textarea value={lessonForm.summary} onChange={(event) => setLessonForm((current) => ({ ...current, summary: event.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.content}</Label><Textarea className="min-h-[260px]" value={lessonForm.content} onChange={(event) => setLessonForm((current) => ({ ...current, content: event.target.value }))} /></div>
            <label className="flex items-center gap-3 rounded-[1.25rem] border border-white/70 bg-white/78 px-4 py-3"><input type="checkbox" checked={lessonForm.isFree} onChange={(event) => setLessonForm((current) => ({ ...current, isFree: event.target.checked }))} /><span className="text-sm font-semibold">{ADMIN_COPY.fields.freeAccess}</span></label>
            <Button className="gradient-primary text-primary-foreground" onClick={saveLesson} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
          </div>
        </>
      );
    }

    if (activeTab === "blogPosts") {
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">{ADMIN_COPY.editor.blogPosts}</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">{blogForm.id ? ADMIN_COPY.titles.updateBlogPost : ADMIN_COPY.titles.createBlogPost}</h2>
            </div>
            {blogForm.id ? (
              <Button variant="outline" size="sm" onClick={deleteBlog} disabled={isSaving}>
                <Trash2 className="mr-2 h-4 w-4" />
                {ADMIN_COPY.actions.delete}
              </Button>
            ) : null}
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Slug</Label><Input value={blogForm.slug} onChange={(event) => setBlogForm((current) => ({ ...current, slug: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.category}</Label><Input value={blogForm.category} onChange={(event) => setBlogForm((current) => ({ ...current, category: event.target.value }))} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2"><Label>{ADMIN_COPY.fields.title}</Label><Input value={blogForm.title} onChange={(event) => setBlogForm((current) => ({ ...current, title: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.emoji}</Label><Input value={blogForm.emoji} onChange={(event) => setBlogForm((current) => ({ ...current, emoji: event.target.value }))} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>{ADMIN_COPY.fields.publishDate}</Label><Input type="date" value={blogForm.date} onChange={(event) => setBlogForm((current) => ({ ...current, date: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.readTimeMinutes}</Label><Input type="number" value={blogForm.readTimeMinutes} onChange={(event) => setBlogForm((current) => ({ ...current, readTimeMinutes: event.target.value }))} /></div>
            </div>
            <div><Label>{ADMIN_COPY.fields.shortDescription}</Label><Textarea value={blogForm.excerpt} onChange={(event) => setBlogForm((current) => ({ ...current, excerpt: event.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.content}</Label><Textarea className="min-h-[260px]" value={blogForm.content} onChange={(event) => setBlogForm((current) => ({ ...current, content: event.target.value }))} /></div>
            <Button className="gradient-primary text-primary-foreground" onClick={saveBlog} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
          </div>
        </>
      );
    }

    if (activeTab === "quizQuestions") {
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">{ADMIN_COPY.editor.quizQuestions}</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">{quizForm.id ? ADMIN_COPY.titles.updateQuizQuestion : ADMIN_COPY.titles.createQuizQuestion}</h2>
            </div>
            {quizForm.id ? (
              <Button variant="outline" size="sm" onClick={deleteQuiz} disabled={isSaving}>
                <Trash2 className="mr-2 h-4 w-4" />
                {ADMIN_COPY.actions.delete}
              </Button>
            ) : null}
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2"><Label>Slug</Label><Input value={quizForm.slug} onChange={(event) => setQuizForm((current) => ({ ...current, slug: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.correctAnswer}</Label><Input type="number" min="0" max="3" value={quizForm.correct} onChange={(event) => setQuizForm((current) => ({ ...current, correct: event.target.value }))} /></div>
            </div>
            <div><Label>{ADMIN_COPY.fields.question}</Label><Textarea value={quizForm.question} onChange={(event) => setQuizForm((current) => ({ ...current, question: event.target.value }))} /></div>
            <div className="grid gap-4 md:grid-cols-2">
              {quizForm.options.map((option, index) => (
                <div key={index}>
                  <Label>{ADMIN_COPY.fields.option} {String.fromCharCode(65 + index)}</Label>
                  <Input value={option} onChange={(event) => setQuizForm((current) => ({ ...current, options: current.options.map((item, optionIndex) => optionIndex === index ? event.target.value : item) }))} />
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>{ADMIN_COPY.fields.category}</Label><Input value={quizForm.category} onChange={(event) => setQuizForm((current) => ({ ...current, category: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.difficulty}</Label><Input value={quizForm.difficulty} onChange={(event) => setQuizForm((current) => ({ ...current, difficulty: event.target.value }))} /></div>
            </div>
            <div><Label>{ADMIN_COPY.fields.explanation}</Label><Textarea value={quizForm.explanation} onChange={(event) => setQuizForm((current) => ({ ...current, explanation: event.target.value }))} /></div>
            <label className="flex items-center gap-3 rounded-[1.25rem] border border-white/70 bg-white/78 px-4 py-3"><input type="checkbox" checked={quizForm.active} onChange={(event) => setQuizForm((current) => ({ ...current, active: event.target.checked }))} /><span className="text-sm font-semibold">{ADMIN_COPY.fields.activeQuiz}</span></label>
            <Button className="gradient-primary text-primary-foreground" onClick={saveQuiz} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
          </div>
        </>
      );
    }

    if (activeTab === "games") {
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">{ADMIN_COPY.editor.games}</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">{gameForm.id ? ADMIN_COPY.titles.updateGame : ADMIN_COPY.titles.createGame}</h2>
            </div>
            {gameForm.id ? (
              <Button variant="outline" size="sm" onClick={deleteGame} disabled={isSaving}>
                <Trash2 className="mr-2 h-4 w-4" />
                {ADMIN_COPY.actions.delete}
              </Button>
            ) : null}
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Slug</Label><Input value={gameForm.slug} onChange={(event) => setGameForm((current) => ({ ...current, slug: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.gameType}</Label><Input value={gameForm.gameType} onChange={(event) => setGameForm((current) => ({ ...current, gameType: event.target.value }))} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>{ADMIN_COPY.fields.title}</Label><Input value={gameForm.title} onChange={(event) => setGameForm((current) => ({ ...current, title: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.playPath}</Label><Input value={gameForm.playPath} onChange={(event) => setGameForm((current) => ({ ...current, playPath: event.target.value }))} /></div>
            </div>
            <div><Label>{ADMIN_COPY.fields.summary}</Label><Textarea value={gameForm.summary} onChange={(event) => setGameForm((current) => ({ ...current, summary: event.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.content}</Label><Textarea className="min-h-[220px]" value={gameForm.description} onChange={(event) => setGameForm((current) => ({ ...current, description: event.target.value }))} /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>{ADMIN_COPY.fields.coverImage}</Label><Input value={gameForm.coverImage} onChange={(event) => setGameForm((current) => ({ ...current, coverImage: event.target.value }))} /></div>
              <div><Label>{ADMIN_COPY.fields.accentColor}</Label><Input value={gameForm.accentColor} onChange={(event) => setGameForm((current) => ({ ...current, accentColor: event.target.value }))} /></div>
          </div>
          <label className="flex items-center gap-3 rounded-[1.25rem] border border-white/70 bg-white/78 px-4 py-3"><input type="checkbox" checked={gameForm.published} onChange={(event) => setGameForm((current) => ({ ...current, published: event.target.checked }))} /><span className="text-sm font-semibold">{ADMIN_COPY.fields.publishFrontend}</span></label>
          <Button className="gradient-primary text-primary-foreground" onClick={saveGame} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
        </div>
      </>
      );
    }

    if (activeTab === "reports") {
      if (!selectedReport) {
        return (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 opacity-30 mb-2" />
            <p>Chọn một báo cáo vi phạm từ danh sách bên trái để xử lý.</p>
          </div>
        );
      }

      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">
                Chi tiết báo cáo vi phạm
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">
                Xử lý báo cáo #{selectedReport.id}
              </h2>
            </div>
          </div>
          <div className="mt-6 space-y-5">
            <div className="rounded-[1.35rem] border border-white/70 bg-white/78 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Nội dung bị báo cáo</p>
              <p className="mt-2 text-base leading-relaxed text-foreground whitespace-pre-wrap">
                {selectedReport.contentPreview}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Người báo cáo</Label>
                <Input value={selectedReport.reporterName} readOnly className="bg-muted" />
              </div>
              <div>
                <Label>Thời gian báo cáo</Label>
                <Input value={formatDate(selectedReport.createdAt)} readOnly className="bg-muted" />
              </div>
            </div>

            <div>
              <Label>Lý do báo cáo</Label>
              <Input value={selectedReport.reason} readOnly className="bg-muted" />
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Input
                value={
                  selectedReport.status === "PENDING"
                    ? "Chờ duyệt"
                    : selectedReport.status === "RESOLVED"
                    ? "Đã xử lý (Xóa nội dung)"
                    : "Đã bác bỏ"
                }
                readOnly
                className="bg-muted font-semibold"
              />
            </div>

            {selectedReport.status === "PENDING" && (
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Button
                  className="gradient-primary text-primary-foreground rounded-full px-6"
                  onClick={() => void resolveReport(selectedReport.id, true)}
                  disabled={isSaving}
                >
                  {isSaving ? "Đang xử lý..." : "Xóa nội dung vi phạm"}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-white/80 bg-white/75"
                  onClick={() => void resolveReport(selectedReport.id, false)}
                  disabled={isSaving}
                >
                  {isSaving ? "Đang xử lý..." : "Bác bỏ báo cáo"}
                </Button>
              </div>
            )}
          </div>
        </>
      );
    }

    if (activeTab === "questions") {
      if (!selectedQuestion) {
        return (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <HelpCircle className="h-12 w-12 opacity-30 mb-2" />
            <p>Chọn một câu hỏi ẩn danh từ danh sách bên trái để phản hồi.</p>
          </div>
        );
      }

      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">
                Câu hỏi ẩn danh từ học sinh
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">
                Trả lời câu hỏi #{selectedQuestion.id}
              </h2>
            </div>
          </div>
          <div className="mt-6 space-y-5">
            <div className="rounded-[1.35rem] border border-white/70 bg-white/78 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Câu hỏi</p>
              <p className="mt-2 text-base leading-relaxed text-foreground whitespace-pre-wrap">
                {selectedQuestion.question}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Gửi lúc: {formatDate(selectedQuestion.createdAt)}
              </p>
            </div>

            <div>
              <Label>{ADMIN_COPY.fields.content}</Label>
              <Textarea
                className="min-h-[160px] rounded-[1.35rem]"
                placeholder="Nhập câu trả lời của chuyên gia/admin..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                className="gradient-primary text-primary-foreground rounded-full px-6"
                onClick={() => void answerQuestion(selectedQuestion.id)}
                disabled={isSaving || !answerText.trim()}
              >
                {isSaving ? "Đang gửi..." : "Gửi câu trả lời"}
              </Button>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "stickers") {
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">
                Quản lý Nhãn dán & GIF
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">
                {stickerForm.id ? "Cập nhật nhãn dán / GIF" : "Thêm nhãn dán / GIF mới"}
              </h2>
            </div>
            {stickerForm.id ? (
              <Button variant="outline" size="sm" onClick={deleteSticker} disabled={isSaving}>
                <Trash2 className="mr-2 h-4 w-4" />
                {ADMIN_COPY.actions.delete}
              </Button>
            ) : null}
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Tên hiển thị</Label>
                <Input
                  value={stickerForm.name}
                  onChange={(event) =>
                    setStickerForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ví dụ: Gấu học bài, Cười lớn..."
                />
              </div>
              <div>
                <Label>Phân loại (Type)</Label>
                <select
                  value={stickerForm.type}
                  onChange={(event) =>
                    setStickerForm((current) => ({
                      ...current,
                      type: event.target.value as "STICKER" | "GIF",
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="STICKER">STICKER (Ảnh tĩnh)</option>
                  <option value="GIF">GIF (Ảnh động)</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Đường dẫn hình ảnh (URL)</Label>
              <Input
                value={stickerForm.url}
                onChange={(event) =>
                  setStickerForm((current) => ({ ...current, url: event.target.value }))
                }
                placeholder="https://..."
              />
              {stickerForm.url && (
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/70 bg-white/40 p-3">
                  <span className="text-xs text-muted-foreground font-semibold">Preview:</span>
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-white/80 p-1">
                    <img
                      src={stickerForm.url}
                      alt="Preview"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/100x100?text=Error";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Chủ đề (Category)</Label>
                <select
                  value={stickerForm.category}
                  onChange={(event) =>
                    setStickerForm((current) => ({ ...current, category: event.target.value }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="study">📚 Học tập (study)</option>
                  <option value="motivation">🔥 Động lực (motivation)</option>
                  <option value="emotion">🥺 Cảm xúc (emotion)</option>
                  <option value="funny">😂 Vui nhộn (funny)</option>
                  <option value="congrats">🎉 Chúc mừng (congrats)</option>
                </select>
              </div>
              <div>
                <Label>Từ khóa tìm kiếm (Keywords - ngăn cách bằng dấu phẩy)</Label>
                <Input
                  value={stickerForm.keywordsString}
                  onChange={(event) =>
                    setStickerForm((current) => ({
                      ...current,
                      keywordsString: event.target.value,
                    }))
                  }
                  placeholder="gau, hoc tap, study, cute"
                />
              </div>
            </div>

            <Button
              className="gradient-primary text-primary-foreground mt-2"
              onClick={saveSticker}
              disabled={isSaving || !stickerForm.name.trim() || !stickerForm.url.trim()}
            >
              {isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}
            </Button>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="h-screen overflow-hidden bg-[linear-gradient(135deg,rgba(255,238,244,0.94)_0%,rgba(245,241,255,0.96)_48%,rgba(232,246,255,0.92)_100%)]">
      <div className="grid h-full xl:grid-cols-[284px_minmax(0,1fr)]">
        <aside className="flex h-screen flex-col border-r border-white/60 bg-[linear-gradient(180deg,rgba(255,247,250,0.84)_0%,rgba(245,241,255,0.88)_100%)] p-5 backdrop-blur-md">
          <div className="rounded-[2rem] border border-white/70 bg-white/72 p-5 shadow-[0_20px_60px_rgba(77,34,122,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">EDUcare admin</p>
            <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">Dashboard quản trị</h1>
            <p className="mt-2 text-sm leading-6 text-foreground/70">Theo dõi dữ liệu, chỉnh sửa nội dung và kiểm soát toàn bộ hệ thống từ một màn hình.</p>
          </div>

          <div className="mt-5 rounded-[2rem] border border-white/70 bg-white/68 p-4 shadow-[0_20px_60px_rgba(77,34,122,0.1)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/90">Tài khoản đang dùng</p>
            <div className="mt-3 rounded-[1.5rem] bg-primary/8 px-4 py-3">
              <p className="text-base font-semibold text-foreground">{user?.fullName ?? "Quản trị viên"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Quản trị hệ thống</p>
            </div>
          </div>

          <div className="mt-5 flex-1 overflow-y-auto pr-1">
            <div className="space-y-3">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full rounded-[1.6rem] border px-4 py-4 text-left transition-all ${activeTab === tab.id ? "border-primary/25 bg-foreground text-background shadow-[0_24px_60px_rgba(35,18,63,0.22)]" : "border-white/70 bg-white/68 hover:bg-white/84"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-[1rem] ${activeTab === tab.id ? "bg-white/12" : "bg-primary/10"}`}>
                        <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? "text-background" : "text-primary"}`} />
                      </div>
                      <div>
                        <p className="font-semibold">{tab.label}</p>
                        <p className={`mt-1 text-xs leading-5 ${activeTab === tab.id ? "text-background/72" : "text-muted-foreground"}`}>{tab.caption}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activeTab === tab.id ? "bg-white/12 text-background" : "bg-primary/10 text-primary"}`}>{tab.count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {activeTab !== "reports" && activeTab !== "questions" && (
              <Button className="h-12 w-full rounded-[1.25rem] gradient-primary text-primary-foreground" onClick={createNew}>
                <Plus className="h-4 w-4" />
                {ADMIN_COPY.createNew}
              </Button>
            )}
            <Button variant="outline" className="h-12 w-full rounded-[1.25rem] border-white/80 bg-white/75" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </aside>

        <main className="flex h-screen min-w-0 flex-col overflow-hidden">
          <header className="border-b border-white/60 px-6 py-6 lg:px-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-[0_12px_30px_rgba(77,34,122,0.08)]"><Shield className="h-4 w-4" />{ADMIN_COPY.eyebrow}</div>
                <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-foreground">{activeTabMeta.label}</h2>
                <p className="mt-3 text-base leading-7 text-foreground/72">{activeTabMeta.caption}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.6rem] border border-white/70 bg-white/70 p-4 shadow-[0_18px_50px_rgba(77,34,122,0.08)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10"><stat.icon className="h-5 w-5 text-primary" /></div>
                    <p className="mt-4 text-3xl font-bold leading-none text-foreground">{stat.value}</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{stat.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.help}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 gap-6 px-6 py-6 lg:px-8 xl:grid-cols-[420px_minmax(0,1fr)]">
            <section className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/68 shadow-[0_24px_80px_rgba(77,34,122,0.1)]">
              <div className="border-b border-white/70 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">{ADMIN_COPY.sections.management}</p>
                <h3 className="mt-2 text-2xl font-bold text-foreground">{activeTabMeta.label}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/68">Chọn một mục trong danh sách để cập nhật nhanh hoặc tạo mới từ sidebar bên trái.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 border-b border-white/70 px-5 py-4">
                <div className="rounded-[1.3rem] bg-primary/8 px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-primary/90">Người dùng mới</p><p className="mt-2 text-xl font-bold text-foreground">{dashboard.recentUsers.length}</p></div>
                <div className="rounded-[1.3rem] bg-primary/8 px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-primary/90">Gói premium</p><p className="mt-2 text-xl font-bold text-foreground">{dashboard.planDistribution.find((item) => item.plan === "premium")?.total ?? 0}</p></div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5"><div className="space-y-3">{renderList()}</div></div>
            </section>

            <div className="grid min-h-0 gap-6 2xl:grid-cols-[minmax(0,1.2fr)_360px]">
              <section className="min-h-0 overflow-y-auto rounded-[2rem] border border-white/70 bg-white/74 p-6 shadow-[0_24px_80px_rgba(77,34,122,0.1)]">{renderEditor()}</section>

              <aside className="min-h-0 overflow-y-auto space-y-6">
                <section className="rounded-[2rem] border border-white/70 bg-white/68 p-5 shadow-[0_24px_80px_rgba(77,34,122,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">Người dùng mới</p>
                  <div className="mt-4 space-y-3">
                    {dashboard.recentUsers.slice(0, 4).map((recentUser) => (
                      <div key={recentUser.id} className="rounded-[1.35rem] border border-white/70 bg-white/78 px-4 py-3">
                        <p className="font-semibold text-foreground">{recentUser.fullName}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{recentUser.email}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>{planLabel(recentUser.plan)}</span><span>{formatDate(recentUser.createdAt)}</span></div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/70 bg-white/68 p-5 shadow-[0_24px_80px_rgba(77,34,122,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">Mức độ hoàn thành</p>
                  <div className="mt-4 space-y-3">
                    {dashboard.lessonCompletion.slice(0, 4).map((item) => (
                      <div key={item.slug} className="rounded-[1.35rem] bg-primary/8 px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div><p className="font-semibold text-foreground">{item.title}</p><p className="mt-1 text-sm text-muted-foreground">{item.slug}</p></div>
                          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-primary">{item.total} lượt</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/70 bg-white/68 p-5 shadow-[0_24px_80px_rgba(77,34,122,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/90">Nhóm chat nổi bật</p>
                  <div className="mt-4 space-y-3">
                    {dashboard.chatRooms.slice(0, 4).map((room) => (
                      <div key={room.slug} className="rounded-[1.35rem] border border-white/70 bg-white/78 px-4 py-3">
                        <p className="font-semibold text-foreground">{room.name}</p>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground"><span>{room.slug}</span><span>{room.messageCount} tin nhắn</span></div>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
