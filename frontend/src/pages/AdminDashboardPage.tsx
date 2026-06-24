import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  BookOpen, FileText, Gamepad2, LogOut, Plus, Shield, Sparkles, Trash2, Users,
  Home, MessageSquare, BarChart2, Settings, Bell, Search, Crown,
  Trophy, HelpCircle, Database, TrendingUp, ArrowUpRight, Menu,
  HardDrive, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ADMIN_COPY } from "@/content/uiCopy";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { AdminContentResponse, AdminDashboardResponse } from "@/types/api";

type SidebarTab = "overview" | "lessons" | "blogPosts" | "quizQuestions" | "games" | "students" | "discussions" | "reports" | "settings";
type CrudTab = "lessons" | "blogPosts" | "quizQuestions" | "games";

type EditableLesson = { id: number; slug: string; title: string; summary: string; content: string; order: number; isFree: boolean };
type EditableBlogPost = { id: number; slug: string; title: string; excerpt: string; content: string; category: string; date: string; readTime: string; emoji: string };
type EditableQuizQuestion = { id: number; slug: string; question: string; options: string[]; correct: number; explanation: string; category: string; difficulty: string; active: boolean };
type EditableGame = { id: number; slug: string; title: string; summary: string; description: string; gameType: string; playPath: string; coverImage: string | null; accentColor: string | null; published: boolean };

function fallbackMessage(error: unknown, message: string) {
  return error instanceof ApiError ? error.message : message;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function planLabel(plan: string) {
  return plan === "PREMIUM" ? "Premium" : "Miễn phí";
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80, H = 32;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 6) - 3}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  return <span className="text-lg">🥉</span>;
}

const DONUT_COLORS = ["#818cf8", "#34d399", "#f472b6", "#fbbf24", "#94a3b8"];

const ACTIVITY_ICONS: { bg: string; color: string; Icon: React.ElementType }[] = [
  { bg: "#f3e8ff", color: "#7c3aed", Icon: Users },
  { bg: "#dbeafe", color: "#3b82f6", Icon: BookOpen },
  { bg: "#d1fae5", color: "#10b981", Icon: HelpCircle },
  { bg: "#fee2e2", color: "#ef4444", Icon: MessageSquare },
  { bg: "#fef3c7", color: "#f59e0b", Icon: Sparkles },
];

const ACTIVITY_TITLES = [
  { title: "Học viên mới đăng ký khóa học", desc: "Tham gia khóa học" },
  { title: "Admin tạo bài học mới", desc: "Cập nhật nội dung khóa học" },
  { title: "Câu hỏi mới được đặt", desc: "Cần giải đáp từ chuyên gia" },
  { title: "Hệ thống gửi email thông báo", desc: "Thông báo khóa học mới" },
  { title: "Admin cập nhật khóa học", desc: "Cải thiện trải nghiệm học viên" },
];

const TIME_AGO = ["2 phút trước", "15 phút trước", "1 giờ trước", "2 giờ trước", "3 giờ trước"];

const SIDEBAR_NAV: { id: SidebarTab; label: string; Icon: React.ElementType }[] = [
  { id: "overview", label: "Tổng quan", Icon: Home },
  { id: "lessons", label: "Khóa học", Icon: BookOpen },
  { id: "blogPosts", label: "Bài học", Icon: FileText },
  { id: "quizQuestions", label: "Quiz", Icon: Sparkles },
  { id: "students", label: "Học viên", Icon: Users },
  { id: "discussions", label: "Thảo luận", Icon: MessageSquare },
  { id: "games", label: "Kho nội dung", Icon: Database },
  { id: "reports", label: "Báo cáo", Icon: BarChart2 },
  { id: "settings", label: "Cài đặt", Icon: Settings },
];

const CRUD_TABS = new Set<SidebarTab>(["lessons", "blogPosts", "quizQuestions", "games"]);

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [content, setContent] = useState<AdminContentResponse | null>(null);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("overview");
  const [activeTab, setActiveTab] = useState<CrudTab>("lessons");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lessonForm, setLessonForm] = useState({ id: null as number | null, slug: "", title: "", summary: "", content: "", order: "", isFree: true });
  const [blogForm, setBlogForm] = useState({ id: null as number | null, slug: "", title: "", excerpt: "", content: "", category: "", date: new Date().toISOString().slice(0, 10), readTimeMinutes: "5", emoji: ADMIN_COPY.defaults.blogEmoji });
  const [quizForm, setQuizForm] = useState({ id: null as number | null, slug: "", question: "", options: ["", "", "", ""], correct: "0", explanation: "", category: ADMIN_COPY.defaults.quizCategory, difficulty: ADMIN_COPY.defaults.quizDifficulty, active: true });
  const [gameForm, setGameForm] = useState({ id: null as number | null, slug: "", title: "", summary: "", description: "", gameType: "QUIZ", playPath: "", coverImage: "hero-illustration.png", accentColor: "#9b5de5", published: true });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [d, c] = await Promise.all([
        apiRequest<AdminDashboardResponse>("/admin/dashboard"),
        apiRequest<AdminContentResponse>("/admin/content"),
      ]);
      setDashboard(d);
      setContent(c);
      setError(null);
    } catch (err) {
      setError(fallbackMessage(err, ADMIN_COPY.loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const resetLessonForm = () => setLessonForm({ id: null, slug: "", title: "", summary: "", content: "", order: "", isFree: true });
  const resetBlogForm = () => setBlogForm({ id: null, slug: "", title: "", excerpt: "", content: "", category: "", date: new Date().toISOString().slice(0, 10), readTimeMinutes: "5", emoji: ADMIN_COPY.defaults.blogEmoji });
  const resetQuizForm = () => setQuizForm({ id: null, slug: "", question: "", options: ["", "", "", ""], correct: "0", explanation: "", category: ADMIN_COPY.defaults.quizCategory, difficulty: ADMIN_COPY.defaults.quizDifficulty, active: true });
  const resetGameForm = () => setGameForm({ id: null, slug: "", title: "", summary: "", description: "", gameType: "QUIZ", playPath: "", coverImage: "hero-illustration.png", accentColor: "#9b5de5", published: true });

  const handleNav = (tab: SidebarTab) => {
    setSidebarTab(tab);
    if (CRUD_TABS.has(tab)) setActiveTab(tab as CrudTab);
  };

  const createNew = () => {
    if (activeTab === "lessons") resetLessonForm();
    else if (activeTab === "blogPosts") resetBlogForm();
    else if (activeTab === "quizQuestions") resetQuizForm();
    else resetGameForm();
  };

  const saveLesson = async () => {
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${lessonForm.id ? `lessons/${lessonForm.id}` : "lessons"}`, {
        method: lessonForm.id ? "PUT" : "POST",
        body: JSON.stringify({ slug: lessonForm.slug, title: lessonForm.title, summary: lessonForm.summary, content: lessonForm.content, order: lessonForm.order ? Number(lessonForm.order) : null, isFree: lessonForm.isFree }),
      });
      toast.success(ADMIN_COPY.actions.saveSuccess.lesson);
      await loadData();
      const item = saved as EditableLesson;
      setLessonForm({ id: item.id, slug: item.slug, title: item.title, summary: item.summary, content: item.content, order: String(item.order), isFree: item.isFree });
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.saveLesson)); }
    finally { setIsSaving(false); }
  };

  const deleteLesson = async () => {
    if (!lessonForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/lessons/${lessonForm.id}`, { method: "DELETE" });
      toast.success(ADMIN_COPY.actions.deleteSuccess.lesson);
      resetLessonForm();
      await loadData();
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.deleteLesson)); }
    finally { setIsSaving(false); }
  };

  const saveBlog = async () => {
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${blogForm.id ? `blog-posts/${blogForm.id}` : "blog-posts"}`, {
        method: blogForm.id ? "PUT" : "POST",
        body: JSON.stringify({ slug: blogForm.slug, title: blogForm.title, excerpt: blogForm.excerpt, content: blogForm.content, category: blogForm.category, date: blogForm.date, readTimeMinutes: Number(blogForm.readTimeMinutes) || 5, emoji: blogForm.emoji }),
      });
      toast.success(ADMIN_COPY.actions.saveSuccess.blogPost);
      await loadData();
      const item = saved as EditableBlogPost;
      setBlogForm({ id: item.id, slug: item.slug, title: item.title, excerpt: item.excerpt, content: item.content, category: item.category, date: item.date, readTimeMinutes: item.readTime.replace(/\D/g, "") || "5", emoji: item.emoji });
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.saveBlogPost)); }
    finally { setIsSaving(false); }
  };

  const deleteBlog = async () => {
    if (!blogForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/blog-posts/${blogForm.id}`, { method: "DELETE" });
      toast.success(ADMIN_COPY.actions.deleteSuccess.blogPost);
      resetBlogForm();
      await loadData();
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.deleteBlogPost)); }
    finally { setIsSaving(false); }
  };

  const saveQuiz = async () => {
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${quizForm.id ? `quiz-questions/${quizForm.id}` : "quiz-questions"}`, {
        method: quizForm.id ? "PUT" : "POST",
        body: JSON.stringify({ slug: quizForm.slug, question: quizForm.question, options: quizForm.options.map(o => o.trim()).filter(Boolean), correct: Number(quizForm.correct) || 0, explanation: quizForm.explanation, category: quizForm.category, difficulty: quizForm.difficulty, active: quizForm.active }),
      });
      toast.success(ADMIN_COPY.actions.saveSuccess.quizQuestion);
      await loadData();
      const item = saved as EditableQuizQuestion;
      setQuizForm({ id: item.id, slug: item.slug, question: item.question, options: [...item.options, "", "", "", ""].slice(0, 4), correct: String(item.correct), explanation: item.explanation ?? "", category: item.category, difficulty: item.difficulty, active: item.active });
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.saveQuizQuestion)); }
    finally { setIsSaving(false); }
  };

  const deleteQuiz = async () => {
    if (!quizForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/quiz-questions/${quizForm.id}`, { method: "DELETE" });
      toast.success(ADMIN_COPY.actions.deleteSuccess.quizQuestion);
      resetQuizForm();
      await loadData();
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.deleteQuizQuestion)); }
    finally { setIsSaving(false); }
  };

  const saveGame = async () => {
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${gameForm.id ? `games/${gameForm.id}` : "games"}`, {
        method: gameForm.id ? "PUT" : "POST",
        body: JSON.stringify({ slug: gameForm.slug, title: gameForm.title, summary: gameForm.summary, description: gameForm.description, gameType: gameForm.gameType, playPath: gameForm.playPath, coverImage: gameForm.coverImage, accentColor: gameForm.accentColor, published: gameForm.published }),
      });
      toast.success(ADMIN_COPY.actions.saveSuccess.game);
      await loadData();
      const item = saved as EditableGame;
      setGameForm({ id: item.id, slug: item.slug, title: item.title, summary: item.summary, description: item.description, gameType: item.gameType, playPath: item.playPath, coverImage: item.coverImage ?? "", accentColor: item.accentColor ?? "#9b5de5", published: item.published });
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.saveGame)); }
    finally { setIsSaving(false); }
  };

  const deleteGame = async () => {
    if (!gameForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/games/${gameForm.id}`, { method: "DELETE" });
      toast.success(ADMIN_COPY.actions.deleteSuccess.game);
      resetGameForm();
      await loadData();
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.deleteGame)); }
    finally { setIsSaving(false); }
  };

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f6fa]">
        <div className="rounded-2xl bg-white px-8 py-6 shadow-sm text-gray-600">{ADMIN_COPY.loading}</div>
      </div>
    );
  }

  if (error || !dashboard || !content) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f6fa]">
        <div className="max-w-xl rounded-2xl bg-white px-8 py-6 text-red-600 shadow-sm">{error ?? ADMIN_COPY.loadError}</div>
      </div>
    );
  }

  /* ── Derived data ── */
  const today = new Date();
  const ago7 = new Date(today); ago7.setDate(ago7.getDate() - 7);
  const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  const dateRange = `${fmtDate(ago7)} - ${fmtDate(today)}`;

  const base = Math.max(20, Math.floor(dashboard.summary.lessonCompletions / 7));
  const chartData = [1, 0.7, 0.9, 1.2, 0.8, 1.1, 1.0].map((v, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (6 - i));
    const luotHoc = Math.round(base * v * 2.5);
    return { date: `${d.getDate()}/${d.getMonth() + 1}`, "Lượt học": luotHoc, "Lượt hoàn thành": Math.round(luotHoc * 0.42) };
  });

  const totalContent = content.metrics.lessons + content.metrics.blogPosts + content.metrics.quizQuestions + content.metrics.games;
  const donutData = [
    { name: "Bài học", value: content.metrics.lessons },
    { name: "Bài viết", value: content.metrics.blogPosts },
    { name: "Câu quiz", value: content.metrics.quizQuestions },
    { name: "Trò chơi", value: content.metrics.games },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: "Khóa học", value: content.metrics.lessons, pct: "+12%", color: "#7c3aed", bg: "#f3e8ff", Icon: BookOpen, trend: [40, 45, 38, 52, 48, 55, content.metrics.lessons] },
    { label: "Người dùng", value: dashboard.summary.totalUsers, pct: "+5%", color: "#3b82f6", bg: "#dbeafe", Icon: Users, trend: [3, 4, 3, 5, 4, 6, dashboard.summary.totalUsers] },
    { label: "Bài kiểm tra", value: dashboard.summary.totalQuizQuestions, pct: "+8%", color: "#10b981", bg: "#d1fae5", Icon: Trophy, trend: [42, 44, 48, 50, 51, 53, dashboard.summary.totalQuizQuestions] },
    { label: "Lượt hỏi đáp", value: dashboard.summary.anonymousQuestions, pct: "+15%", color: "#f97316", bg: "#ffedd5", Icon: HelpCircle, trend: [30, 35, 38, 42, 40, 45, dashboard.summary.anonymousQuestions] },
  ];

  const popularLessons = dashboard.lessonCompletion.slice(0, 3);
  const maxCompletion = Math.max(...popularLessons.map(l => l.total), 1);
  const topStudents = [...dashboard.recentUsers].sort((a, b) => b.xp - a.xp).slice(0, 3);
  const activityItems = dashboard.recentUsers.slice(0, 5).map((u, i) => ({
    ...(ACTIVITY_TITLES[i] ?? { title: `${u.fullName} hoạt động`, desc: u.email }),
    iconDef: ACTIVITY_ICONS[i % ACTIVITY_ICONS.length],
    time: TIME_AGO[i] ?? `${i + 1} giờ trước`,
  }));

  /* ── List & Editor renderers (CRUD) ── */
  const renderList = () => {
    if (activeTab === "lessons") return content.lessons.map(lesson => (
      <button key={lesson.id} onClick={() => setLessonForm({ id: lesson.id, slug: lesson.slug, title: lesson.title, summary: lesson.summary, content: lesson.content, order: String(lesson.order), isFree: lesson.isFree })}
        className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${lessonForm.id === lesson.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{lesson.title}</p>
            <p className="mt-0.5 text-xs text-gray-500">{lesson.slug} · Bài {lesson.order}</p>
          </div>
          <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600">{lesson.isFree ? "Miễn phí" : "Giới hạn"}</span>
        </div>
      </button>
    ));

    if (activeTab === "blogPosts") return content.blogPosts.map(post => (
      <button key={post.id} onClick={() => setBlogForm({ id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, date: post.date, readTimeMinutes: post.readTime.replace(/\D/g, "") || "5", emoji: post.emoji })}
        className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${blogForm.id === post.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{post.title}</p>
            <p className="mt-0.5 text-xs text-gray-500">{post.category} · {formatDate(post.date)}</p>
          </div>
          <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600">{post.readTime}</span>
        </div>
      </button>
    ));

    if (activeTab === "quizQuestions") return content.quizQuestions.map(q => (
      <button key={q.id} onClick={() => setQuizForm({ id: q.id, slug: q.slug, question: q.question, options: [...q.options, "", "", "", ""].slice(0, 4), correct: String(q.correct), explanation: q.explanation ?? "", category: q.category, difficulty: q.difficulty, active: q.active })}
        className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${quizForm.id === q.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold text-gray-800">{q.question}</p>
            <p className="mt-0.5 text-xs text-gray-500">{q.category} · {q.difficulty}</p>
          </div>
          <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600">{q.active ? "Đang dùng" : "Ẩn"}</span>
        </div>
      </button>
    ));

    return content.games.map(game => (
      <button key={game.id} onClick={() => setGameForm({ id: game.id, slug: game.slug, title: game.title, summary: game.summary, description: game.description, gameType: game.gameType, playPath: game.playPath, coverImage: game.coverImage ?? "", accentColor: game.accentColor ?? "#9b5de5", published: game.published })}
        className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${gameForm.id === game.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{game.title}</p>
            <p className="mt-0.5 text-xs text-gray-500">{game.gameType} · {game.playPath}</p>
          </div>
          <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600">{game.published ? "Hiển thị" : "Nháp"}</span>
        </div>
      </button>
    ));
  };

  const renderEditor = () => {
    if (activeTab === "lessons") return (
      <>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">{ADMIN_COPY.editor.lessons}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-800">{lessonForm.id ? ADMIN_COPY.titles.updateLesson : ADMIN_COPY.titles.createLesson}</h2>
          </div>
          {lessonForm.id ? <Button variant="outline" size="sm" onClick={deleteLesson} disabled={isSaving}><Trash2 className="mr-1.5 h-4 w-4" />{ADMIN_COPY.actions.delete}</Button> : null}
        </div>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Slug</Label><Input value={lessonForm.slug} onChange={e => setLessonForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.order}</Label><Input type="number" value={lessonForm.order} onChange={e => setLessonForm(p => ({ ...p, order: e.target.value }))} /></div>
          </div>
          <div><Label>{ADMIN_COPY.fields.title}</Label><Input value={lessonForm.title} onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div><Label>{ADMIN_COPY.fields.shortDescription}</Label><Textarea value={lessonForm.summary} onChange={e => setLessonForm(p => ({ ...p, summary: e.target.value }))} /></div>
          <div><Label>{ADMIN_COPY.fields.content}</Label><Textarea className="min-h-[240px]" value={lessonForm.content} onChange={e => setLessonForm(p => ({ ...p, content: e.target.value }))} /></div>
          <label className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"><input type="checkbox" checked={lessonForm.isFree} onChange={e => setLessonForm(p => ({ ...p, isFree: e.target.checked }))} /><span className="text-sm font-semibold">{ADMIN_COPY.fields.freeAccess}</span></label>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveLesson} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
        </div>
      </>
    );

    if (activeTab === "blogPosts") return (
      <>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">{ADMIN_COPY.editor.blogPosts}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-800">{blogForm.id ? ADMIN_COPY.titles.updateBlogPost : ADMIN_COPY.titles.createBlogPost}</h2>
          </div>
          {blogForm.id ? <Button variant="outline" size="sm" onClick={deleteBlog} disabled={isSaving}><Trash2 className="mr-1.5 h-4 w-4" />{ADMIN_COPY.actions.delete}</Button> : null}
        </div>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Slug</Label><Input value={blogForm.slug} onChange={e => setBlogForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.category}</Label><Input value={blogForm.category} onChange={e => setBlogForm(p => ({ ...p, category: e.target.value }))} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2"><Label>{ADMIN_COPY.fields.title}</Label><Input value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.emoji}</Label><Input value={blogForm.emoji} onChange={e => setBlogForm(p => ({ ...p, emoji: e.target.value }))} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>{ADMIN_COPY.fields.publishDate}</Label><Input type="date" value={blogForm.date} onChange={e => setBlogForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.readTimeMinutes}</Label><Input type="number" value={blogForm.readTimeMinutes} onChange={e => setBlogForm(p => ({ ...p, readTimeMinutes: e.target.value }))} /></div>
          </div>
          <div><Label>{ADMIN_COPY.fields.shortDescription}</Label><Textarea value={blogForm.excerpt} onChange={e => setBlogForm(p => ({ ...p, excerpt: e.target.value }))} /></div>
          <div><Label>{ADMIN_COPY.fields.content}</Label><Textarea className="min-h-[240px]" value={blogForm.content} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))} /></div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveBlog} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
        </div>
      </>
    );

    if (activeTab === "quizQuestions") return (
      <>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">{ADMIN_COPY.editor.quizQuestions}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-800">{quizForm.id ? ADMIN_COPY.titles.updateQuizQuestion : ADMIN_COPY.titles.createQuizQuestion}</h2>
          </div>
          {quizForm.id ? <Button variant="outline" size="sm" onClick={deleteQuiz} disabled={isSaving}><Trash2 className="mr-1.5 h-4 w-4" />{ADMIN_COPY.actions.delete}</Button> : null}
        </div>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2"><Label>Slug</Label><Input value={quizForm.slug} onChange={e => setQuizForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.correctAnswer}</Label><Input type="number" min="0" max="3" value={quizForm.correct} onChange={e => setQuizForm(p => ({ ...p, correct: e.target.value }))} /></div>
          </div>
          <div><Label>{ADMIN_COPY.fields.question}</Label><Textarea value={quizForm.question} onChange={e => setQuizForm(p => ({ ...p, question: e.target.value }))} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            {quizForm.options.map((opt, idx) => (
              <div key={idx}><Label>{ADMIN_COPY.fields.option} {String.fromCharCode(65 + idx)}</Label><Input value={opt} onChange={e => setQuizForm(p => ({ ...p, options: p.options.map((o, i) => i === idx ? e.target.value : o) }))} /></div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>{ADMIN_COPY.fields.category}</Label><Input value={quizForm.category} onChange={e => setQuizForm(p => ({ ...p, category: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.difficulty}</Label><Input value={quizForm.difficulty} onChange={e => setQuizForm(p => ({ ...p, difficulty: e.target.value }))} /></div>
          </div>
          <div><Label>{ADMIN_COPY.fields.explanation}</Label><Textarea value={quizForm.explanation} onChange={e => setQuizForm(p => ({ ...p, explanation: e.target.value }))} /></div>
          <label className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"><input type="checkbox" checked={quizForm.active} onChange={e => setQuizForm(p => ({ ...p, active: e.target.checked }))} /><span className="text-sm font-semibold">{ADMIN_COPY.fields.activeQuiz}</span></label>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveQuiz} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
        </div>
      </>
    );

    return (
      <>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">{ADMIN_COPY.editor.games}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-800">{gameForm.id ? ADMIN_COPY.titles.updateGame : ADMIN_COPY.titles.createGame}</h2>
          </div>
          {gameForm.id ? <Button variant="outline" size="sm" onClick={deleteGame} disabled={isSaving}><Trash2 className="mr-1.5 h-4 w-4" />{ADMIN_COPY.actions.delete}</Button> : null}
        </div>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Slug</Label><Input value={gameForm.slug} onChange={e => setGameForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.gameType}</Label><Input value={gameForm.gameType} onChange={e => setGameForm(p => ({ ...p, gameType: e.target.value }))} /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>{ADMIN_COPY.fields.title}</Label><Input value={gameForm.title} onChange={e => setGameForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.playPath}</Label><Input value={gameForm.playPath} onChange={e => setGameForm(p => ({ ...p, playPath: e.target.value }))} /></div>
          </div>
          <div><Label>{ADMIN_COPY.fields.summary}</Label><Textarea value={gameForm.summary} onChange={e => setGameForm(p => ({ ...p, summary: e.target.value }))} /></div>
          <div><Label>{ADMIN_COPY.fields.content}</Label><Textarea className="min-h-[200px]" value={gameForm.description} onChange={e => setGameForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>{ADMIN_COPY.fields.coverImage}</Label><Input value={gameForm.coverImage} onChange={e => setGameForm(p => ({ ...p, coverImage: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.accentColor}</Label><Input value={gameForm.accentColor} onChange={e => setGameForm(p => ({ ...p, accentColor: e.target.value }))} /></div>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"><input type="checkbox" checked={gameForm.published} onChange={e => setGameForm(p => ({ ...p, published: e.target.checked }))} /><span className="text-sm font-semibold">{ADMIN_COPY.fields.publishFrontend}</span></label>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveGame} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
        </div>
      </>
    );
  };

  /* ── Sidebar & main title helpers ── */
  const crudTitle: Record<CrudTab, string> = { lessons: "Quản lý bài học", blogPosts: "Quản lý bài viết", quizQuestions: "Quản lý Quiz", games: "Kho trò chơi" };
  const pageTitle = sidebarTab === "overview" ? "Dashboard" : sidebarTab === "students" ? "Học viên" : sidebarTab === "discussions" ? "Thảo luận" : sidebarTab === "reports" ? "Báo cáo" : sidebarTab === "settings" ? "Cài đặt" : crudTitle[activeTab];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa]">

      {/* ══ SIDEBAR ══ */}
      <aside className="flex w-[220px] shrink-0 flex-col bg-white shadow-[2px_0_12px_rgba(0,0,0,0.06)]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-[13px] font-bold tracking-wide text-purple-600">EDUCARE ADMIN</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {SIDEBAR_NAV.map(({ id, label, Icon }) => {
            const active = sidebarTab === id;
            const count = id === "lessons" ? content.metrics.lessons
              : id === "blogPosts" ? content.metrics.blogPosts
              : id === "quizQuestions" ? content.metrics.quizQuestions
              : id === "games" ? content.metrics.games
              : id === "students" ? dashboard.summary.totalUsers
              : undefined;
            return (
              <button key={id} onClick={() => handleNav(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${active ? "bg-purple-600 font-semibold text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {count !== undefined && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Premium card */}
        <div className="mx-3 mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-4 text-white">
          <Crown className="h-5 w-5 text-yellow-300" />
          <p className="mt-2 text-[13px] font-bold leading-snug">Nâng cấp gói Premium</p>
          <p className="mt-1 text-[11px] text-purple-200 leading-snug">Mở khóa tính năng nâng cao và trải nghiệm không giới hạn.</p>
          <button onClick={handleLogout} className="mt-3 w-full rounded-xl bg-white py-1.5 text-[12px] font-bold text-purple-600 hover:bg-purple-50 transition-colors">Nâng cấp ngay</button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center gap-4 border-b border-gray-100 bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-base font-bold text-gray-800">{pageTitle}</span>
          </div>

          {/* Search */}
          <div className="ml-4 flex max-w-xs flex-1 items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input className="flex-1 bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400" placeholder="Tìm kiếm nhanh..." readOnly />
            <span className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-gray-400">⌘ K</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Bell */}
            <button className="relative rounded-xl border border-gray-100 bg-white p-2 text-gray-500 hover:bg-gray-50 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[9px] font-bold text-white">3</span>
            </button>

            {/* User */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                {(user?.fullName ?? "A").charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.fullName ?? "EDUCare Admin"}</p>
                <p className="text-xs text-gray-500 leading-tight">{user?.email ?? "admin@educare.vn"}</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden lg:flex text-gray-500">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── OVERVIEW ── */}
          {sidebarTab === "overview" && (
            <div>
              {/* Welcome + date */}
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Chào mừng trở lại, <span className="text-purple-600">{user?.fullName ?? "EDUCare Admin"}</span>! 👋
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">Tổng quan hoạt động hệ thống của bạn hôm nay.</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {dateRange}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Stat cards */}
              <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {statCards.map(card => (
                  <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: card.bg }}>
                        <card.Icon className="h-6 w-6" style={{ color: card.color }} />
                      </div>
                      <Sparkline data={card.trend} color={card.color} />
                    </div>
                    <p className="mt-4 text-xs font-medium text-gray-500">{card.label}</p>
                    <p className="mt-0.5 text-3xl font-bold text-gray-800">{card.value}</p>
                    <p className="mt-2 flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                      <ArrowUpRight className="h-3.5 w-3.5" />{card.pct} so với tuần trước
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_280px_280px]">
                {/* Line chart */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-gray-800">Hoạt động học tập</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-5 rounded-full bg-blue-400" />Lượt học</span>
                        <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-5 rounded-full bg-emerald-400" />Lượt hoàn thành</span>
                      </div>
                      <button className="flex items-center gap-1 rounded-lg border border-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">7 ngày qua <ChevronDown className="h-3 w-3 text-gray-400" /></button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                      <Line type="monotone" dataKey="Lượt học" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 3, fill: "#60a5fa", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Lượt hoàn thành" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3, fill: "#34d399", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Donut chart */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-bold text-gray-800">Phân bố khóa học</h3>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <PieChart width={150} height={150}>
                        <Pie data={donutData} cx={70} cy={70} innerRadius={44} outerRadius={65} dataKey="value" stroke="none">
                          {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
                      </PieChart>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-gray-800">{totalContent}</span>
                        <span className="text-[11px] text-gray-400">Tổng</span>
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      {donutData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2 text-xs">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          <span className="flex-1 text-gray-600">{item.name}</span>
                          <span className="font-semibold text-gray-700">{item.value}</span>
                          <span className="w-10 text-right text-gray-400">{totalContent > 0 ? `${Math.round(item.value / totalContent * 100)}%` : "0%"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity feed */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold text-gray-800">Hoạt động mới nhất</h3>
                  <div className="space-y-3.5">
                    {activityItems.map((item, i) => {
                      const { Icon } = item.iconDef;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: item.iconDef.bg }}>
                            <Icon className="h-4 w-4" style={{ color: item.iconDef.color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-[12px] font-semibold text-gray-800">{item.title}</p>
                            <p className="line-clamp-1 text-[11px] text-gray-400">{item.desc}</p>
                          </div>
                          <span className="shrink-0 text-[10px] text-gray-400 pt-0.5">{item.time}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button className="mt-4 w-full text-center text-xs font-semibold text-purple-600 hover:underline">Xem tất cả hoạt động</button>
                </div>
              </div>

              {/* Bottom row */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Popular courses */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800">Khóa học phổ biến</h3>
                    <button className="text-xs font-semibold text-purple-600 hover:underline">Xem tất cả</button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        <th className="pb-3 text-left w-5">#</th>
                        <th className="pb-3 text-left">Khóa học</th>
                        <th className="pb-3 text-right">Học viên</th>
                        <th className="pb-3 text-right">Tiến độ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {popularLessons.map((lesson, i) => (
                        <tr key={lesson.slug} className="text-sm">
                          <td className="py-3 text-xs font-medium text-gray-400">{i + 1}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                                <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                              </div>
                              <span className="line-clamp-1 text-xs font-medium text-gray-700">{lesson.title}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-xs text-gray-500 whitespace-nowrap">{lesson.total} học viên</td>
                          <td className="py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="h-1.5 w-14 overflow-hidden rounded-full bg-gray-100">
                                <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.round((lesson.total / maxCompletion) * 100)}%` }} />
                              </div>
                              <span className="text-[11px] text-gray-400">{Math.round((lesson.total / maxCompletion) * 100)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {popularLessons.length === 0 && (
                        <tr><td colSpan={4} className="py-6 text-center text-xs text-gray-400">Chưa có dữ liệu</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Top students */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800">Top học viên tích cực</h3>
                    <button className="text-xs font-semibold text-purple-600 hover:underline">Xem tất cả</button>
                  </div>
                  <div className="space-y-3">
                    {topStudents.map((student, i) => (
                      <div key={student.id} className="flex items-center gap-3">
                        <MedalIcon rank={i + 1} />
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                          {student.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-xs font-semibold text-gray-800">{student.fullName}</p>
                          <p className="text-[11px] text-gray-400">{Math.max(1, Math.floor(student.xp / 50))} khóa học</p>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-purple-600">{student.xp} điểm</span>
                      </div>
                    ))}
                    {topStudents.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Chưa có dữ liệu</p>}
                  </div>
                </div>

                {/* System stats */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold text-gray-800">Thống kê hệ thống</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500"><HardDrive className="h-4 w-4 text-gray-400" />Tổng dung lượng</div>
                      <span className="text-sm font-bold text-gray-800">2.45 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500"><Database className="h-4 w-4 text-gray-400" />Dung lượng đã dùng</div>
                      <span className="text-sm font-bold text-gray-800">1.23 GB</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500"><TrendingUp className="h-4 w-4 text-gray-400" />Tỷ lệ sử dụng</div>
                        <span className="text-sm font-bold text-gray-800">50.2%</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: "50.2%" }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500"><FileText className="h-4 w-4 text-gray-400" />Số lượng file</div>
                      <span className="text-sm font-bold text-gray-800">1,234 files</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STUDENTS ── */}
          {sidebarTab === "students" && (
            <div>
              <h1 className="mb-5 text-xl font-bold text-gray-800">Quản lý học viên</h1>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="space-y-2">
                  {dashboard.recentUsers.map(u => (
                    <div key={u.id} className="flex items-center gap-4 rounded-xl border border-gray-50 p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600">
                        {u.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{u.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email} · @{u.username}</p>
                      </div>
                      <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600">{planLabel(u.plan)}</span>
                      <span className="text-xs font-semibold text-gray-600 hidden sm:block">{u.xp} XP</span>
                      <span className="text-xs text-gray-400 hidden md:block">{formatDate(u.createdAt)}</span>
                    </div>
                  ))}
                  {dashboard.recentUsers.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Không có học viên</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── DISCUSSIONS ── */}
          {sidebarTab === "discussions" && (
            <div>
              <h1 className="mb-5 text-xl font-bold text-gray-800">Thảo luận & Chat rooms</h1>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="space-y-2">
                  {dashboard.chatRooms.map(room => (
                    <div key={room.slug} className="flex items-center gap-4 rounded-xl border border-gray-50 p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{room.name}</p>
                        <p className="text-xs text-gray-500">{room.slug}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-600">{room.messageCount} tin nhắn</span>
                    </div>
                  ))}
                  {dashboard.chatRooms.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Không có chat room nào</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── PLACEHOLDER PAGES ── */}
          {(sidebarTab === "reports" || sidebarTab === "settings") && (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm">
              <div className="text-center">
                <p className="text-3xl mb-3">🚧</p>
                <p className="text-sm font-semibold text-gray-500">Tính năng đang phát triển</p>
              </div>
            </div>
          )}

          {/* ── CRUD VIEWS ── */}
          {CRUD_TABS.has(sidebarTab) && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">{crudTitle[activeTab]}</h1>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={createNew}>
                  <Plus className="mr-1.5 h-4 w-4" />Tạo mới
                </Button>
              </div>
              <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Danh sách ({activeTab === "lessons" ? content.lessons.length : activeTab === "blogPosts" ? content.blogPosts.length : activeTab === "quizQuestions" ? content.quizQuestions.length : content.games.length})</p>
                  <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1 space-y-1.5">{renderList()}</div>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm max-h-[calc(100vh-180px)] overflow-y-auto">{renderEditor()}</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
