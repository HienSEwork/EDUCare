import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, FileText, Gamepad2, LogOut, Plus, Shield, Sparkles, Trash2, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ADMIN_COPY } from "@/content/uiCopy";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { AdminContentResponse, AdminDashboardResponse } from "@/types/api";

type AdminTab = "lessons" | "blogPosts" | "quizQuestions" | "games";

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
  const [activeTab, setActiveTab] = useState<AdminTab>("lessons");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    emoji: ADMIN_COPY.defaults.blogEmoji,
  });
  const [quizForm, setQuizForm] = useState({
    id: null as number | null,
    slug: "",
    question: "",
    options: ["", "", "", ""],
    correct: "0",
    explanation: "",
    category: ADMIN_COPY.defaults.quizCategory,
    difficulty: ADMIN_COPY.defaults.quizDifficulty,
    active: true,
  });
  const [gameForm, setGameForm] = useState({
    id: null as number | null,
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

  const loadData = async () => {
    setIsLoading(true);

    try {
      const [dashboardResponse, contentResponse] = await Promise.all([
        apiRequest<AdminDashboardResponse>("/admin/dashboard"),
        apiRequest<AdminContentResponse>("/admin/content"),
      ]);
      setDashboard(dashboardResponse);
      setContent(contentResponse);
      setError(null);
    } catch (requestError) {
      setError(fallbackMessage(requestError, ADMIN_COPY.loadError));
    } finally {
      setIsLoading(false);
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

  const createNew = () => {
    if (activeTab === "lessons") resetLessonForm();
    if (activeTab === "blogPosts") resetBlogForm();
    if (activeTab === "quizQuestions") resetQuizForm();
    if (activeTab === "games") resetGameForm();
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
            <Button className="h-12 w-full rounded-[1.25rem] gradient-primary text-primary-foreground" onClick={createNew}><Plus className="h-4 w-4" />{ADMIN_COPY.createNew}</Button>
            <Button variant="outline" className="h-12 w-full rounded-[1.25rem] border-white/80 bg-white/75" onClick={handleLogout}><LogOut className="h-4 w-4" />Đăng xuất</Button>
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
                <div className="rounded-[1.3rem] bg-primary/8 px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-primary/90">Gói premium</p><p className="mt-2 text-xl font-bold text-foreground">{dashboard.planDistribution.find((item) => item.plan === "PREMIUM")?.total ?? 0}</p></div>
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
