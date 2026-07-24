import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  BookOpen, FileText, Gamepad2, LogOut, Plus, Shield, Sparkles, Trash2, Users,
  Home, MessageSquare, BarChart2, Settings, Search,
  Trophy, HelpCircle, Database, TrendingUp, ArrowUpRight,
  HardDrive, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, X, Smile, FolderClosed,
  Compass, Lock, Heart, ShieldCheck, Award, Flame, EyeOff, Handshake,
  HeartHandshake, Phone, Lightbulb, Frown, Brain, LifeBuoy, Key,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ADMIN_COPY } from "@/content/uiCopy";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { AdminContentResponse, AdminDashboardResponse, AdminUserListResponse, AdminUserResponse, CommunityReport, AnonymousQuestion, ChatStickerResponse, Course, Category, Lesson, LessonSource, MicroLesson, MicroLessonBlock, SubscriptionPlan } from "@/types/api";

type SidebarTab = "overview" | "courses" | "lessons" | "blogPosts" | "quizQuestions" | "games" | "students" | "plans" | "discussions" | "reports" | "settings" | "questions" | "stickers";
type CrudTab = "courses" | "lessons" | "blogPosts" | "quizQuestions" | "games" | "stickers" | "reports" | "questions";

type EditableLesson = { id: number; slug: string; title: string; summary: string; content: string; order: number; isFree: boolean };
type EditableBlogPost = { id: number; slug: string; title: string; excerpt: string; content: string; category: string; date: string; readTime: string; emoji: string; videoUrl?: string | null };
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
  { id: "courses", label: "Khóa học", Icon: FolderClosed },
  { id: "blogPosts", label: "Bài viết", Icon: FileText },
  { id: "quizQuestions", label: "Quiz", Icon: Sparkles },
  { id: "students", label: "Học viên", Icon: Users },
  { id: "plans", label: "Quản lý gói VIP", Icon: Trophy },
  { id: "discussions", label: "Thảo luận", Icon: MessageSquare },
  { id: "games", label: "Kho nội dung", Icon: Database },
  { id: "stickers", label: "Nhãn dán & GIF", Icon: Smile },
  { id: "reports", label: "Báo cáo vi phạm", Icon: AlertTriangle },
  { id: "questions", label: "Câu hỏi ẩn danh", Icon: HelpCircle },
  { id: "settings", label: "Cài đặt", Icon: Settings },
];

const CRUD_TABS = new Set<SidebarTab>(["courses", "lessons", "blogPosts", "quizQuestions", "games", "stickers", "reports", "questions"]);

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [content, setContent] = useState<AdminContentResponse | null>(null);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("overview");
  const [activeTab, setActiveTab] = useState<CrudTab>("courses");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listSearch, setListSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ label: string; onConfirm: () => void } | null>(null);
  const [isListPanelCollapsed, setIsListPanelCollapsed] = useState(true);

  // Students tab state
  const [students, setStudents] = useState<AdminUserListResponse | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPlanFilter, setStudentPlanFilter] = useState<"" | "free" | "popular" | "premium">("");
  const [studentRoleFilter, setStudentRoleFilter] = useState<"" | "student" | "admin">("");
  const [studentLoading, setStudentLoading] = useState(false);
  const [editUser, setEditUser] = useState<AdminUserResponse | null>(null);
  const [editPlan, setEditPlan] = useState("");
  const [editRole, setEditRole] = useState("");
  const [userSaving, setUserSaving] = useState(false);

  // VIP plans state
  const [plansList, setPlansList] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editPlanObj, setEditPlanObj] = useState<SubscriptionPlan | null>(null);
  const [planForm, setPlanForm] = useState({
    id: "",
    name: "",
    price: "",
    durationDays: "",
    description: "",
    active: true,
    startDate: "",
    endDate: "",
    planType: "REGULAR" as "REGULAR" | "TRIAL" | "PROMOTION"
  });

  // Custom states from HEAD
  const [stickers, setStickers] = useState<ChatStickerResponse[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<AnonymousQuestion | null>(null);
  const [answerText, setAnswerText] = useState("");

  // Import course states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [selectedImportCategoryId, setSelectedImportCategoryId] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState("");

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
  }, [sidebarTab]);

  const COURSE_CATEGORIES = [
    { id: 1, name: "🌸 Cơ thể & Dậy thì", slug: "day-thi" },
    { id: 2, name: "🛑 Đồng thuận & Ranh giới", slug: "ranh-gioi" },
    { id: 3, name: "🧠 Cảm xúc & Stress", slug: "cam-xuc" },
    { id: 4, name: "🛡️ An toàn số & MXH", slug: "an-toan" },
    { id: 5, name: "💬 Mối quan hệ lành mạnh", slug: "moi-quan-he" }
  ];

  const [categories, setCategories] = useState<any[]>(COURSE_CATEGORIES);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("HelpCircle");
  const [newCategoryColor, setNewCategoryColor] = useState("#4361ee");

  useEffect(() => {
    if (newCategoryName) {
      const generated = newCategoryName.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setNewCategorySlug(generated);
    }
  }, [newCategoryName]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseForm, setCourseForm] = useState({
    id: null as number | null,
    title: "",
    description: "",
    thumbnail: "",
    colorTheme: "#4361ee",
    order: "",
    categoryId: "1"
  });

  const uploadContentFile = async (file: File, field: string) => {
    setUploadingField(field);
    try {
      const body = new FormData();
      body.append("file", file);
      const result = await apiRequest<{ url: string }>("/media/upload", { method: "POST", body });
      toast.success("Tải file lên Cloudinary thành công");
      return result.url;
    } catch (error) {
      toast.error(fallbackMessage(error, "Không thể tải file lên Cloudinary"));
      return null;
    } finally {
      setUploadingField(null);
    }
  };

  const [lessonForm, setLessonForm] = useState({
    id: null as number | null,
    slug: "",
    title: "",
    summary: "",
    content: "",
    order: "",
    isFree: true,
    courseId: "" as string | number,
    xpReward: "100",
    estimatedMinutes: "10",
    teaserVideoId: "",
    fullVideoId: ""
  });

  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string | number>("all");
  const [editingLessonInCourse, setEditingLessonInCourse] = useState<Lesson | null>(null);

  const [sources, setSources] = useState<LessonSource[]>([]);
  const [newSource, setNewSource] = useState({ sourceName: "", sourceUrl: "", sourceType: "website" });

  const [microLessons, setMicroLessons] = useState<MicroLesson[]>([]);
  const [selectedMicroLesson, setSelectedMicroLesson] = useState<MicroLesson | null>(null);
  const [newMicroLessonTitle, setNewMicroLessonTitle] = useState("");

  const [editingBlock, setEditingBlock] = useState<MicroLessonBlock | null>(null);
  const [blockForm, setBlockForm] = useState({
    id: null as number | null,
    blockType: "explanation" as MicroLessonBlock["blockType"],
    contentJson: ""
  });
  const [blockFields, setBlockFields] = useState<any>({});
  const [activeScenarioNodeKey, setActiveScenarioNodeKey] = useState<string>("step1");
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const selectBlockForEdit = (block: MicroLessonBlock) => {
    setEditingBlock(block);
    setBlockForm({
      id: block.id,
      blockType: block.blockType,
      contentJson: block.contentJson
    });
    try {
      const parsed = JSON.parse(block.contentJson) || {};
      if (block.blockType === "fill-blank") {
        const correctAnswers = Object.values(parsed.blanks || {}).map((b: any) => b.correct);
        const existingWords = parsed.words || [];
        parsed.distractors = existingWords.filter((w: string) => !correctAnswers.includes(w));
      }
      setBlockFields(parsed);
      if (block.blockType === "scenario-choice") {
        setActiveScenarioNodeKey(parsed.startNode || "step1");
      }
    } catch {
      setBlockFields({});
    }
  };

  const selectLessonForEdit = async (lesson: Lesson) => {
    setLessonForm({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      summary: lesson.summary,
      content: lesson.content,
      order: String(lesson.order),
      isFree: lesson.isFree,
      courseId: lesson.courseId ?? "",
      xpReward: String(lesson.xpReward ?? 100),
      estimatedMinutes: String(lesson.estimatedMinutes ?? 10),
      teaserVideoId: lesson.teaserVideoId ?? "",
      fullVideoId: lesson.fullVideoId ?? ""
    });

    try {
      const fullLesson = await apiRequest<Lesson>(`/lessons/${lesson.slug}`);
      setSources(fullLesson.sources || []);
      setMicroLessons(fullLesson.microLessons || []);
      setSelectedMicroLesson(null);
    } catch (err) {
      setSources([]);
      setMicroLessons([]);
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      id: null,
      title: "",
      description: "",
      thumbnail: "",
      colorTheme: "#4361ee",
      order: "",
      categoryId: ""
    });
    setEditingLessonInCourse(null);
  };

  const saveCourse = async () => {
    if (!courseForm.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề khóa học");
      return;
    }
    setIsSaving(true);
    try {
      await apiRequest<Course>(
        `/admin/courses${courseForm.id ? `/${courseForm.id}` : ""}`,
        {
          method: courseForm.id ? "PUT" : "POST",
          body: JSON.stringify({
            title: courseForm.title,
            description: courseForm.description,
            thumbnail: courseForm.thumbnail,
            colorTheme: courseForm.colorTheme,
            order: courseForm.order ? Number(courseForm.order) : null,
            categoryId: courseForm.categoryId ? Number(courseForm.categoryId) : null
          })
        }
      );
      const coursesRes = await apiRequest<Course[]>("/admin/courses");
      setCourses(coursesRes);
      resetCourseForm();
      toast.success(courseForm.id ? "Cập nhật khóa học thành công" : "Tạo khóa học thành công");
    } catch (err) {
      toast.error(fallbackMessage(err, "Không thể lưu khóa học"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportCourse = async () => {
    if (!importJsonText.trim()) {
      toast.error("Vui lòng dán dữ liệu JSON trước");
      return;
    }

    let courseData: any;
    try {
      courseData = JSON.parse(importJsonText);
    } catch (e: any) {
      toast.error(`Định dạng JSON không hợp lệ: ${e.message}`);
      return;
    }

    // Check if it is a phpMyAdmin JSON export (an array of tables)
    if (Array.isArray(courseData)) {
      // Find tables
      const findTableData = (tableName: string) => {
        const tableObj = courseData.find((item: any) => item.type === "table" && item.name === tableName);
        return tableObj ? (tableObj.data || []) : [];
      };

      const rawCourses = findTableData("courses");
      const rawLessons = findTableData("lessons");
      const rawSources = findTableData("lesson_sources");
      const rawMicroLessons = findTableData("micro_lessons");
      const rawBlocks = findTableData("micro_lesson_blocks");

      if (rawCourses.length === 0) {
        toast.error("Không tìm thấy bảng 'courses' hoặc dữ liệu khóa học trong file JSON");
        return;
      }

      // We take the first course from the export
      const rawCourse = rawCourses[0];
      const oldCourseId = String(rawCourse.id);

      // Map to nested format
      courseData = {
        title: rawCourse.title,
        description: rawCourse.description,
        thumbnail: rawCourse.thumbnail,
        colorTheme: rawCourse.color_theme || rawCourse.colorTheme,
        order: rawCourse.course_order || rawCourse.orderIndex,
        lessons: rawLessons
          .filter((l: any) => String(l.course_id || l.courseId) === oldCourseId)
          .map((l: any) => {
            const oldLessonId = String(l.id);
            return {
              title: l.title,
              slug: l.slug,
              summary: l.summary,
              content: l.content,
              order: l.lesson_order || l.orderIndex,
              isFree: l.is_free === "1" || l.is_free === 1 || l.is_free === true || l.isFree === true,
              xpReward: l.xp_reward || l.xpReward,
              estimatedMinutes: l.estimated_minutes || l.estimatedMinutes,
              teaserVideoId: l.teaser_video_id || l.teaserVideoId,
              fullVideoId: l.full_video_id || l.fullVideoId,
              sources: rawSources
                .filter((s: any) => String(s.lesson_id || s.lessonId) === oldLessonId)
                .map((s: any) => ({
                  sourceName: s.source_name || s.sourceName,
                  sourceUrl: s.source_url || s.sourceUrl,
                  sourceType: s.source_type || s.sourceType
                })),
              microLessons: rawMicroLessons
                .filter((ml: any) => String(ml.lesson_id || ml.lessonId) === oldLessonId)
                .map((ml: any) => {
                  const oldMlId = String(ml.id);
                  return {
                    title: ml.title,
                    order: ml.micro_order || ml.orderIndex,
                    blocks: rawBlocks
                      .filter((b: any) => String(b.micro_lesson_id || b.microLessonId) === oldMlId)
                      .map((b: any) => ({
                        blockType: b.block_type || b.blockType,
                        contentJson: b.content_json || b.contentJson,
                        orderIndex: b.order_index || b.orderIndex
                      }))
                  };
                })
            };
          })
      };
    }

    if (!courseData.title) {
      toast.error("Thiếu trường 'title' cho khóa học ở gốc JSON");
      return;
    }

    setIsImporting(true);
    setImportProgress("Đang tạo khóa học...");

    try {
      // 1. Create course
      const catId = selectedImportCategoryId ? Number(selectedImportCategoryId) : (courseData.categoryId ? Number(courseData.categoryId) : null);
      const courseResponse = await apiRequest<any>("/admin/courses", {
        method: "POST",
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description || "",
          thumbnail: courseData.thumbnail || "",
          colorTheme: courseData.colorTheme || "#7c3aed",
          order: courseData.order ? Number(courseData.order) : null,
          categoryId: catId
        })
      });
      const newCourseId = courseResponse.id;

      // 2. Iterate lessons
      const lessons = courseData.lessons || [];
      for (let lIdx = 0; lIdx < lessons.length; lIdx++) {
        const lesson = lessons[lIdx];
        setImportProgress(`Đang tạo bài học ${lIdx + 1}/${lessons.length}: ${lesson.title || "Chưa có tên"}...`);

        const lessonResponse = await apiRequest<any>("/admin/lessons", {
          method: "POST",
          body: JSON.stringify({
            title: lesson.title || `Bài học ${lIdx + 1}`,
            slug: lesson.slug || (lesson.title ? lesson.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") : `bai-hoc-${lIdx + 1}`),
            summary: lesson.summary || "",
            content: lesson.content || "",
            order: lesson.order || (lIdx + 1),
            isFree: lesson.isFree ?? true,
            courseId: newCourseId,
            xpReward: lesson.xpReward || 10,
            estimatedMinutes: lesson.estimatedMinutes || 10,
            teaserVideoId: lesson.teaserVideoId || "",
            fullVideoId: lesson.fullVideoId || ""
          })
        });
        const newLessonId = lessonResponse.id;

        // 3. Create sources
        const sources = lesson.sources || [];
        for (let sIdx = 0; sIdx < sources.length; sIdx++) {
          const src = sources[sIdx];
          await apiRequest(`/admin/lessons/${newLessonId}/sources`, {
            method: "POST",
            body: JSON.stringify({
              sourceName: src.sourceName || "Tài liệu",
              sourceUrl: src.sourceUrl || "",
              sourceType: src.sourceType || "website"
            })
          });
        }

        // 4. Create micro-lessons
        const microLessons = lesson.microLessons || [];
        for (let mIdx = 0; mIdx < microLessons.length; mIdx++) {
          const ml = microLessons[mIdx];
          setImportProgress(`Đang tạo chương nhỏ ${mIdx + 1}/${microLessons.length} cho bài học "${lesson.title}"...`);

          const mlResponse = await apiRequest<any>(`/admin/lessons/${newLessonId}/micro-lessons`, {
            method: "POST",
            body: JSON.stringify({
              title: ml.title || `Chương ${mIdx + 1}`,
              order: ml.order || (mIdx + 1)
            })
          });
          const newMlId = mlResponse.id;

          // 5. Create blocks
          const blocks = ml.blocks || [];
          for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
            const block = blocks[bIdx];
            const contentJsonStr = typeof block.contentJson === "string"
              ? block.contentJson
              : JSON.stringify(block.contentJson || {});

            await apiRequest(`/admin/micro-lessons/${newMlId}/blocks`, {
              method: "POST",
              body: JSON.stringify({
                blockType: block.blockType || "explanation",
                contentJson: contentJsonStr,
                orderIndex: block.orderIndex || (bIdx + 1)
              })
            });
          }
        }
      }

      toast.success(`Nhập thành công khóa học "${courseData.title}" cùng toàn bộ các bài học, chương nhỏ và slide!`);
      setShowImportModal(false);
      setImportJsonText("");
      setSelectedImportCategoryId("");
      await loadData(true);
    } catch (err: any) {
      toast.error(`Có lỗi xảy ra trong quá trình nhập: ${err.message || "Lỗi mạng hoặc dữ liệu không hợp lệ"}`);
    } finally {
      setIsImporting(false);
      setImportProgress("");
    }
  };

  const deleteCourse = async () => {
    if (!courseForm.id) return;
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/courses/${courseForm.id}`, { method: "DELETE" });
      toast.success("Xóa khóa học thành công");
      const coursesRes = await apiRequest<Course[]>("/admin/courses");
      setCourses(coursesRes);
      resetCourseForm();
    } catch (err) {
      toast.error(fallbackMessage(err, "Không thể xóa khóa học"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSource = async (lessonId: number) => {
    if (!newSource.sourceName || !newSource.sourceUrl) {
      toast.error("Vui lòng điền tên tài liệu và URL");
      return;
    }
    try {
      const saved = await apiRequest<LessonSource>(`/admin/lessons/${lessonId}/sources`, {
        method: "POST",
        body: JSON.stringify(newSource)
      });
      setSources(prev => [...prev, saved]);
      setNewSource({ sourceName: "", sourceUrl: "", sourceType: "website" });
      toast.success("Thêm tài liệu thành công");
    } catch (err) {
      toast.error("Lỗi khi thêm tài liệu");
    }
  };

  const handleDeleteSource = async (sourceId: number) => {
    try {
      await apiRequest<void>(`/admin/lessons/sources/${sourceId}`, { method: "DELETE" });
      setSources(prev => prev.filter(s => s.id !== sourceId));
      toast.success("Xóa tài liệu thành công");
    } catch (err) {
      toast.error("Lỗi khi xóa tài liệu");
    }
  };

  const handleAddMicroLesson = async (lessonId: number) => {
    if (!newMicroLessonTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề chương học nhỏ");
      return;
    }
    try {
      const saved = await apiRequest<MicroLesson>(`/admin/lessons/${lessonId}/micro-lessons`, {
        method: "POST",
        body: JSON.stringify({ title: newMicroLessonTitle, order: null })
      });
      setMicroLessons(prev => [...prev, saved]);
      setNewMicroLessonTitle("");
      toast.success("Thêm chương nhỏ thành công");
    } catch (err) {
      toast.error("Lỗi khi thêm chương nhỏ");
    }
  };

  const handleDeleteMicroLesson = async (id: number) => {
    try {
      await apiRequest<void>(`/admin/micro-lessons/${id}`, { method: "DELETE" });
      setMicroLessons(prev => prev.filter(ml => ml.id !== id));
      if (selectedMicroLesson?.id === id) {
        setSelectedMicroLesson(null);
      }
      toast.success("Xóa chương nhỏ thành công");
    } catch (err) {
      toast.error("Lỗi khi xóa chương nhỏ");
    }
  };

  const handleSaveBlock = async (microLessonId: number) => {
    if (!blockForm.blockType) {
      toast.error("Vui lòng chọn loại block");
      return;
    }

    // Ngăn chặn trùng lặp các loại slide độc bản (chỉ được phép có 1 slide mỗi loại trong một chương)
    const uniqueTypes = new Set(["hook", "takeaway", "sorting", "interaction", "reflection", "scenario-choice"]);
    if (uniqueTypes.has(blockForm.blockType) && selectedMicroLesson) {
      const alreadyExists = (selectedMicroLesson.blocks || []).some(
        b => b.blockType === blockForm.blockType && b.id !== blockForm.id
      );
      if (alreadyExists) {
        toast.error(`Chương này đã có slide loại "${blockForm.blockType}". Mỗi chương học nhỏ chỉ được phép có tối đa một slide thuộc loại này!`);
        return;
      }
    }

    let finalBlockFields = { ...blockFields };
    if (blockForm.blockType === "fill-blank") {
      const correctAnswers = Object.values(blockFields.blanks || {}).map((b: any) => b.correct);
      const distractors = blockFields.distractors || [];
      const combinedWords = [...correctAnswers, ...distractors];

      const words = combinedWords.filter((w: string) => w.trim() !== "");

      const { distractors: _, ...cleanFields } = finalBlockFields;
      finalBlockFields = {
        ...cleanFields,
        words
      };
    }

    const finalContentJson = JSON.stringify(finalBlockFields);
    setIsSaving(true);
    try {
      const saved = await apiRequest<MicroLessonBlock>(
        blockForm.id
          ? `/admin/micro-lessons/blocks/${blockForm.id}`
          : `/admin/micro-lessons/${microLessonId}/blocks`,
        {
          method: blockForm.id ? "PUT" : "POST",
          body: JSON.stringify({
            blockType: blockForm.blockType,
            contentJson: finalContentJson,
            orderIndex: null
          })
        }
      );

      setMicroLessons(prev => prev.map(ml => {
        if (ml.id === microLessonId) {
          const blocks = ml.blocks || [];
          const exists = blocks.some(b => b.id === saved.id);
          const newBlocks = exists
            ? blocks.map(b => b.id === saved.id ? saved : b)
            : [...blocks, saved];
          return { ...ml, blocks: newBlocks };
        }
        return ml;
      }));

      if (selectedMicroLesson && selectedMicroLesson.id === microLessonId) {
        const blocks = selectedMicroLesson.blocks || [];
        const exists = blocks.some(b => b.id === saved.id);
        const newBlocks = exists
          ? blocks.map(b => b.id === saved.id ? saved : b)
          : [...blocks, saved];
        setSelectedMicroLesson({ ...selectedMicroLesson, blocks: newBlocks });
      }

      setEditingBlock(null);
      setBlockForm({ id: null, blockType: "explanation", contentJson: "" });
      setBlockFields({});
      toast.success("Lưu block thành công");
    } catch (err) {
      toast.error("Lỗi khi lưu block");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlock = async (microLessonId: number, blockId: number) => {
    try {
      await apiRequest<void>(`/admin/micro-lessons/blocks/${blockId}`, { method: "DELETE" });

      setMicroLessons(prev => prev.map(ml => {
        if (ml.id === microLessonId) {
          return { ...ml, blocks: (ml.blocks || []).filter(b => b.id !== blockId) };
        }
        return ml;
      }));

      if (selectedMicroLesson && selectedMicroLesson.id === microLessonId) {
        setSelectedMicroLesson({
          ...selectedMicroLesson,
          blocks: (selectedMicroLesson.blocks || []).filter(b => b.id !== blockId)
        });
      }
      toast.success("Xóa block thành công");
    } catch (err) {
      toast.error("Lỗi khi xóa block");
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index || !selectedMicroLesson) return;

    const blocks = [...(selectedMicroLesson.blocks || [])];
    const draggedItem = blocks[draggedItemIndex];

    blocks.splice(draggedItemIndex, 1);
    blocks.splice(index, 0, draggedItem);

    const updatedMicroLesson = { ...selectedMicroLesson, blocks };
    setSelectedMicroLesson(updatedMicroLesson);

    setMicroLessons(prev => prev.map(ml => ml.id === selectedMicroLesson.id ? updatedMicroLesson : ml));
    setDraggedItemIndex(null);

    try {
      const blockIds = blocks.map(b => b.id);
      await apiRequest<void>(`/admin/micro-lessons/${selectedMicroLesson.id}/blocks/reorder`, {
        method: "PUT",
        body: JSON.stringify({ blockIds })
      });
      toast.success("Đã cập nhật thứ tự slide thành công");
    } catch (err) {
      toast.error("Lỗi khi đồng bộ thứ tự slide");
    }
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  function extractYoutubeId(url: string | null | undefined): string {
    if (!url) return "";
    if (url.length === 11) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  }

  const [blogForm, setBlogForm] = useState({ id: null as number | null, slug: "", title: "", excerpt: "", content: "", category: "", date: new Date().toISOString().slice(0, 10), readTimeMinutes: "5", emoji: "", videoUrl: "" });
  const [quizForm, setQuizForm] = useState({ id: null as number | null, slug: "", question: "", options: ["", "", "", ""], correct: "0", explanation: "", category: ADMIN_COPY.defaults.quizCategory as string, difficulty: ADMIN_COPY.defaults.quizDifficulty as string, active: true });
  const [gameForm, setGameForm] = useState({ id: null as number | null, slug: "", title: "", summary: "", description: "", gameType: "QUIZ", playPath: "", coverImage: "hero-illustration.png", accentColor: "#9b5de5", published: true });

  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [d, c, reportsResponse, questionsResponse, stickersResponse, coursesResponse, categoriesResponse] = await Promise.all([
        apiRequest<AdminDashboardResponse>("/admin/dashboard"),
        apiRequest<AdminContentResponse>("/admin/content"),
        apiRequest<CommunityReport[]>("/community/admin/reports"),
        apiRequest<AnonymousQuestion[]>("/community/admin/questions"),
        apiRequest<ChatStickerResponse[]>("/community/stickers"),
        apiRequest<Course[]>("/admin/courses").catch(() => []),
        apiRequest<any[]>("/admin/categories").catch(() => []),
      ]);
      setDashboard(d);
      setContent(c);
      setReports(reportsResponse);
      setQuestions(questionsResponse);
      setStickers(stickersResponse);
      setCourses(coursesResponse || []);
      setCategories(categoriesResponse && categoriesResponse.length > 0 ? categoriesResponse : COURSE_CATEGORIES);
      setError(null);
    } catch (err) {
      setError(fallbackMessage(err, ADMIN_COPY.loadError));
    } finally {
      setIsLoading(false);
    }
  };

  const startAddCategory = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategorySlug("");
    setNewCategoryIcon("HelpCircle");
    setNewCategoryColor("#4361ee");
    setShowNewCategoryModal(true);
  };

  const startEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setNewCategoryName(cat.name);
    setNewCategorySlug(cat.slug);
    setNewCategoryIcon(cat.icon || "HelpCircle");
    setNewCategoryColor(cat.colorTheme || "#4361ee");
    setShowNewCategoryModal(true);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    if (!newCategorySlug.trim()) {
      toast.error("Vui lòng nhập đường dẫn tĩnh");
      return;
    }
    setIsSaving(true);
    try {
      if (editingCategory) {
        // Edit category
        const updatedCat = await apiRequest<any>(`/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: newCategoryName.trim(),
            slug: newCategorySlug.trim(),
            icon: newCategoryIcon,
            colorTheme: newCategoryColor
          })
        });
        setCategories(p => p.map(cat => cat.id === updatedCat.id ? updatedCat : cat));
        await loadData(true);
        toast.success("Cập nhật danh mục thành công");
      } else {
        // Create new category
        const newCat = await apiRequest<any>("/admin/categories", {
          method: "POST",
          body: JSON.stringify({
            name: newCategoryName.trim(),
            slug: newCategorySlug.trim(),
            icon: newCategoryIcon,
            colorTheme: newCategoryColor
          })
        });
        toast.success("Thêm danh mục mới thành công");
        setCategories(p => [...p, newCat]);
        setCourseForm(p => ({ ...p, categoryId: String(newCat.id) }));
      }
      setShowNewCategoryModal(false);
      setNewCategoryName("");
      setNewCategorySlug("");
      setNewCategoryIcon("HelpCircle");
      setNewCategoryColor("#4361ee");
      setEditingCategory(null);
    } catch (err) {
      toast.error(fallbackMessage(err, "Không thể lưu danh mục. Lỗi có thể do đường dẫn tĩnh đã tồn tại."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (catId: number, catName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${catName}"? Tất cả các khóa học thuộc danh mục này sẽ chuyển sang trạng thái "Chưa phân loại".`)) {
      setIsSaving(true);
      try {
        await apiRequest(`/admin/categories/${catId}`, { method: "DELETE" });
        toast.success("Xóa danh mục thành công");
        setCategories(p => p.filter(cat => cat.id !== catId));
        void loadData(true);
      } catch (err) {
        toast.error(fallbackMessage(err, "Không thể xóa danh mục."));
      } finally {
        setIsSaving(false);
      }
    }
  };

  const resolveReport = async (reportId: number, deleteContent: boolean) => {
    setIsSaving(true);
    try {
      await apiRequest(`/community/admin/reports/${reportId}/resolve?deleteContent=${deleteContent}`, {
        method: "PUT",
      });
      toast.success(deleteContent ? "Đã xóa nội dung vi phạm thành công." : "Đã bác bỏ báo cáo.");
      await loadData(true);
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
      await loadData(true);
      setSelectedQuestion(null);
      setAnswerText("");
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, "Không thể gửi câu trả lời."));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const loadStudents = useCallback(async (q: string, plan: string, role: string) => {
    setStudentLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (plan) params.set("plan", plan);
      if (role) params.set("role", role);
      const data = await apiRequest<AdminUserListResponse>(`/admin/users${params.toString() ? `?${params}` : ""}`);
      setStudents(data);
    } catch { /* silently keep previous list */ }
    finally { setStudentLoading(false); }
  }, []);

  useEffect(() => {
    if (sidebarTab === "students") {
      void loadStudents(studentSearch, studentPlanFilter, studentRoleFilter);
    }
  }, [sidebarTab, studentSearch, studentPlanFilter, studentRoleFilter, loadStudents]);

  const loadPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const data = await apiRequest<SubscriptionPlan[]>("/admin/plans");
      setPlansList(data || []);
    } catch {
      toast.error("Không thể tải danh sách gói cước.");
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sidebarTab === "plans") {
      void loadPlans();
    }
  }, [sidebarTab, loadPlans]);

  const resetPlanForm = () => setPlanForm({
    id: "",
    name: "",
    price: "",
    durationDays: "",
    description: "",
    active: true,
    startDate: "",
    endDate: "",
    planType: "REGULAR"
  });

  const formatToLocalDatetime = (isoStr: string | null | undefined) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "";
      const tzOffset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    } catch (e) {
      return "";
    }
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditPlanObj(plan);
    setPlanForm({
      id: plan.id,
      name: plan.name,
      price: plan.price.toString(),
      durationDays: plan.durationDays.toString(),
      description: plan.description || "",
      active: plan.active,
      startDate: formatToLocalDatetime(plan.startDate),
      endDate: formatToLocalDatetime(plan.endDate),
      planType: plan.planType || "REGULAR"
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.id.trim() || !planForm.name.trim() || !planForm.price.trim() || !planForm.durationDays.trim()) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }
    const priceNum = Number(planForm.price);
    const daysNum = Number(planForm.durationDays);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Giá cước phải là số và không được âm.");
      return;
    }
    if (isNaN(daysNum) || daysNum < 1) {
      toast.error("Số ngày hiệu lực phải lớn hơn hoặc bằng 1.");
      return;
    }

    if (planForm.startDate && planForm.endDate) {
      if (new Date(planForm.startDate) > new Date(planForm.endDate)) {
        toast.error("Ngày bắt đầu ưu đãi phải trước ngày kết thúc.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const body = {
        id: planForm.id.trim(),
        name: planForm.name.trim(),
        price: priceNum,
        durationDays: daysNum,
        description: planForm.description.trim(),
        active: planForm.active,
        startDate: planForm.startDate ? new Date(planForm.startDate).toISOString() : null,
        endDate: planForm.endDate ? new Date(planForm.endDate).toISOString() : null,
        planType: planForm.planType
      };

      if (editPlanObj) {
        await apiRequest(`/admin/plans/${editPlanObj.id}`, {
          method: "PUT",
          body: JSON.stringify(body)
        });
        toast.success("Cập nhật gói cước thành công.");
      } else {
        await apiRequest("/admin/plans", {
          method: "POST",
          body: JSON.stringify(body)
        });
        toast.success("Thêm gói cước mới thành công.");
      }
      setShowPlanModal(false);
      resetPlanForm();
      setEditPlanObj(null);
      void loadPlans();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Có lỗi xảy ra khi lưu gói cước.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = (planId: string) => {
    setConfirmDelete({
      label: `Bạn có chắc chắn muốn xóa gói cước "${planId}"?`,
      onConfirm: async () => {
        try {
          await apiRequest(`/admin/plans/${planId}`, { method: "DELETE" });
          toast.success("Xóa gói cước thành công.");
          void loadPlans();
        } catch (err) {
          toast.error(err instanceof ApiError ? err.message : "Có lỗi xảy ra khi xóa gói cước.");
        }
      }
    });
  };

  const resetLessonForm = () => setLessonForm({
    id: null,
    slug: "",
    title: "",
    summary: "",
    content: "",
    order: "",
    isFree: true,
    courseId: "",
    xpReward: "100",
    estimatedMinutes: "10",
    teaserVideoId: "",
    fullVideoId: ""
  });
  const resetBlogForm = () => setBlogForm({ id: null, slug: "", title: "", excerpt: "", content: "", category: "", date: new Date().toISOString().slice(0, 10), readTimeMinutes: "5", emoji: "", videoUrl: "" });
  const resetQuizForm = () => setQuizForm({ id: null, slug: "", question: "", options: ["", "", "", ""], correct: "0", explanation: "", category: ADMIN_COPY.defaults.quizCategory, difficulty: ADMIN_COPY.defaults.quizDifficulty, active: true });
  const resetGameForm = () => setGameForm({ id: null, slug: "", title: "", summary: "", description: "", gameType: "QUIZ", playPath: "", coverImage: "hero-illustration.png", accentColor: "#9b5de5", published: true });

  const handleNav = (tab: SidebarTab) => {
    setSidebarTab(tab);
    setListSearch("");
    setEditingLessonInCourse(null);
    if (CRUD_TABS.has(tab)) setActiveTab(tab as CrudTab);
  };

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
    if (activeTab === "courses") resetCourseForm();
    else if (activeTab === "lessons") {
      resetLessonForm();
      setSources([]);
      setMicroLessons([]);
      setSelectedMicroLesson(null);
    }
    else if (activeTab === "blogPosts") resetBlogForm();
    else if (activeTab === "quizQuestions") resetQuizForm();
    else if (activeTab === "games") resetGameForm();
    else if (activeTab === "stickers") resetStickerForm();
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
      await loadData(true);
      toast.success("Đã lưu nhãn dán/GIF thành công.");
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
    setIsSaving(true);
    try {
      await apiRequest<void>(`/admin/stickers/${stickerForm.id}`, { method: "DELETE" });
      toast.success("Đã xóa nhãn dán/GIF thành công.");
      resetStickerForm();
      await loadData(true);
    } catch (requestError) {
      toast.error(fallbackMessage(requestError, "Không thể xóa nhãn dán/GIF."));
    } finally {
      setIsSaving(false);
    }
  };

  const saveLesson = async () => {
    if (!lessonForm.slug.trim() || !lessonForm.title.trim() || !lessonForm.summary.trim() || !lessonForm.content.trim()) {
      toast.error("Vui lòng điền đầy đủ Slug, Tiêu đề, Mô tả và Nội dung");
      return;
    }
    setIsSaving(true);
    try {
      const saved = await apiRequest<Lesson>(`/admin/${lessonForm.id ? `lessons/${lessonForm.id}` : "lessons"}`, {
        method: lessonForm.id ? "PUT" : "POST",
        body: JSON.stringify({
          slug: lessonForm.slug,
          title: lessonForm.title,
          summary: lessonForm.summary,
          content: lessonForm.content,
          order: lessonForm.order ? Number(lessonForm.order) : null,
          isFree: lessonForm.isFree,
          courseId: lessonForm.courseId ? Number(lessonForm.courseId) : null,
          xpReward: lessonForm.xpReward ? Number(lessonForm.xpReward) : 100,
          estimatedMinutes: lessonForm.estimatedMinutes ? Number(lessonForm.estimatedMinutes) : 10,
          teaserVideoId: lessonForm.teaserVideoId,
          fullVideoId: lessonForm.fullVideoId
        }),
      });
      await loadData(true);
      toast.success(ADMIN_COPY.actions.saveSuccess.lesson);
      const item = saved;
      setLessonForm({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        content: item.content,
        order: String(item.order),
        isFree: item.isFree,
        courseId: item.courseId ?? "",
        xpReward: String(item.xpReward ?? 100),
        estimatedMinutes: String(item.estimatedMinutes ?? 10),
        teaserVideoId: item.teaserVideoId ?? "",
        fullVideoId: item.fullVideoId ?? ""
      });
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
      await loadData(true);
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.deleteLesson)); }
    finally { setIsSaving(false); }
  };

  const saveBlog = async () => {
    if (!blogForm.slug.trim() || !blogForm.title.trim() || !blogForm.excerpt.trim() || !blogForm.content.trim() || !blogForm.category.trim()) {
      toast.error("Vui lòng điền đầy đủ Slug, Tiêu đề, Danh mục, Tóm tắt và Nội dung");
      return;
    }
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${blogForm.id ? `blog-posts/${blogForm.id}` : "blog-posts"}`, {
        method: blogForm.id ? "PUT" : "POST",
        body: JSON.stringify({ slug: blogForm.slug, title: blogForm.title, excerpt: blogForm.excerpt, content: blogForm.content, category: blogForm.category, date: blogForm.date, readTimeMinutes: Number(blogForm.readTimeMinutes) || 5, emoji: "", videoUrl: blogForm.videoUrl || null }),
      });
      await loadData(true);
      toast.success(ADMIN_COPY.actions.saveSuccess.blogPost);
      const item = saved as EditableBlogPost;
      setBlogForm({ id: item.id, slug: item.slug, title: item.title, excerpt: item.excerpt, content: item.content, category: item.category, date: item.date, readTimeMinutes: item.readTime.replace(/\D/g, "") || "5", emoji: "", videoUrl: item.videoUrl ?? "" });
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
      await loadData(true);
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.deleteBlogPost)); }
    finally { setIsSaving(false); }
  };

  const saveQuiz = async () => {
    const filledOptions = quizForm.options.filter(o => o.trim());
    if (!quizForm.slug.trim() || !quizForm.question.trim() || filledOptions.length < 2 || !quizForm.category.trim()) {
      toast.error("Vui lòng điền Slug, Câu hỏi, ít nhất 2 đáp án và Danh mục");
      return;
    }
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${quizForm.id ? `quiz-questions/${quizForm.id}` : "quiz-questions"}`, {
        method: quizForm.id ? "PUT" : "POST",
        body: JSON.stringify({ slug: quizForm.slug, question: quizForm.question, options: quizForm.options.map(o => o.trim()).filter(Boolean), correct: Number(quizForm.correct) || 0, explanation: quizForm.explanation, category: quizForm.category, difficulty: quizForm.difficulty, active: quizForm.active }),
      });
      await loadData(true);
      toast.success(ADMIN_COPY.actions.saveSuccess.quizQuestion);
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
      await loadData(true);
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.deleteQuizQuestion)); }
    finally { setIsSaving(false); }
  };

  const saveGame = async () => {
    if (!gameForm.slug.trim() || !gameForm.title.trim() || !gameForm.summary.trim() || !gameForm.playPath.trim()) {
      toast.error("Vui lòng điền đầy đủ Slug, Tiêu đề, Tóm tắt và Đường dẫn game");
      return;
    }
    setIsSaving(true);
    try {
      const saved = await apiRequest(`/admin/${gameForm.id ? `games/${gameForm.id}` : "games"}`, {
        method: gameForm.id ? "PUT" : "POST",
        body: JSON.stringify({ slug: gameForm.slug, title: gameForm.title, summary: gameForm.summary, description: gameForm.description, gameType: gameForm.gameType, playPath: gameForm.playPath, coverImage: gameForm.coverImage, accentColor: gameForm.accentColor, published: gameForm.published }),
      });
      await loadData(true);
      toast.success(ADMIN_COPY.actions.saveSuccess.game);
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
      await loadData(true);
    } catch (err) { toast.error(fallbackMessage(err, ADMIN_COPY.errors.deleteGame)); }
    finally { setIsSaving(false); }
  };

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  const openEditUser = (u: AdminUserResponse) => {
    setEditUser(u);
    setEditPlan(u.plan);
    setEditRole(u.role);
  };

  const saveUser = async () => {
    if (!editUser) return;
    setUserSaving(true);
    try {
      await apiRequest(`/admin/users/${editUser.id}`, {
        method: "PUT",
        body: JSON.stringify({ plan: editPlan.toUpperCase(), role: editRole.toUpperCase() }),
      });
      toast.success("Đã cập nhật học viên");
      setEditUser(null);
      void loadStudents(studentSearch, studentPlanFilter, studentRoleFilter);
    } catch (err) { toast.error(fallbackMessage(err, "Không thể cập nhật")); }
    finally { setUserSaving(false); }
  };

  const deleteUserById = async (id: string, name: string) => {
    setConfirmDelete({
      label: name,
      onConfirm: async () => {
        try {
          await apiRequest<void>(`/admin/users/${id}`, { method: "DELETE" });
          toast.success("Đã xóa học viên");
          void loadStudents(studentSearch, studentPlanFilter, studentRoleFilter);
        } catch (err) { toast.error(fallbackMessage(err, "Không thể xóa")); }
        finally { setConfirmDelete(null); }
      },
    });
  };

  /* ── Filtered list data ── */
  const q = listSearch.toLowerCase();
  const filteredCourses = useMemo(() => courses.filter(c => c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)) ?? [], [courses, q]);
  const filteredLessons = useMemo(() => {
    let list = content?.lessons || [];
    if (selectedCourseFilter && selectedCourseFilter !== "all") {
      list = list.filter(l => String(l.courseId) === String(selectedCourseFilter));
    }
    return list.filter(l => l.title.toLowerCase().includes(q) || l.slug.includes(q)) ?? [];
  }, [content, q, selectedCourseFilter]);
  const filteredPosts = useMemo(() => content?.blogPosts.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) ?? [], [content, q]);
  const filteredQuiz = useMemo(() => content?.quizQuestions.filter(qz => qz.question.toLowerCase().includes(q) || qz.category.toLowerCase().includes(q)) ?? [], [content, q]);
  const filteredGames = useMemo(() => content?.games.filter(g => g.title.toLowerCase().includes(q) || g.slug.includes(q)) ?? [], [content, q]);
  const filteredStickers = useMemo(() => stickers.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) ?? [], [stickers, q]);
  const filteredReports = useMemo(() => reports.filter(r => r.reason.toLowerCase().includes(q) || r.contentPreview.toLowerCase().includes(q)) ?? [], [reports, q]);
  const filteredQuestions = useMemo(() => questions.filter(qs => qs.question.toLowerCase().includes(q) || (qs.answer && qs.answer.toLowerCase().includes(q))) ?? [], [questions, q]);

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
    if (activeTab === "courses" || activeTab === "lessons") {
      if (editingLessonInCourse !== null) {
        const courseLessons = content?.lessons.filter(l => String(l.courseId) === String(courseForm.id)) || [];
        const filteredCourseLessons = courseLessons.filter(l =>
          l.title.toLowerCase().includes(listSearch.toLowerCase()) ||
          l.slug.toLowerCase().includes(listSearch.toLowerCase())
        );

        return (
          <div className="space-y-1.5 animate-fadeIn">
            <button
              onClick={() => {
                setEditingLessonInCourse(null);
                setListSearch("");
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all flex items-center gap-1.5 mb-2 shrink-0 shadow-sm border border-purple-100"
            >
              ← Quay lại danh sách Khóa học
            </button>
            {filteredCourseLessons.length === 0 ? (
              <p className="py-8 text-center text-xs text-gray-400 italic">Không tìm thấy bài học nào</p>
            ) : (
              filteredCourseLessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={async () => {
                    await selectLessonForEdit(lesson);
                    setEditingLessonInCourse(lesson);
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${editingLessonInCourse.id === lesson.id ? "border-purple-200 bg-purple-50" : "border-gray-100 bg-white hover:bg-gray-50"}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-gray-800">{lesson.title}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">Bài {lesson.order} · {lesson.slug}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        );
      }

      if (filteredCourses.length === 0) return <p className="py-8 text-center text-xs text-gray-400">{listSearch ? "Không tìm thấy kết quả" : "Chưa có khóa học nào"}</p>;
      return filteredCourses.map(course => (
        <button key={course.id} onClick={() => {
          setCourseForm({ id: course.id, title: course.title, description: course.description ?? "", thumbnail: course.thumbnail ?? "", colorTheme: course.colorTheme ?? "#4361ee", order: String(course.order ?? ""), categoryId: course.category?.id ? String(course.category.id) : "" });
          setEditingLessonInCourse(null);
        }}
          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${courseForm.id === course.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">{course.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{course.category?.name || "Chưa phân loại"} · {course.lessons?.length || 0} bài học</p>
            </div>
          </div>
        </button>
      ));
    }

    if (activeTab === "blogPosts") {
      if (filteredPosts.length === 0) return <p className="py-8 text-center text-xs text-gray-400">{listSearch ? "Không tìm thấy kết quả" : "Chưa có bài viết nào"}</p>;
      return filteredPosts.map(post => (
        <button key={post.id} onClick={() => setBlogForm({ id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, date: post.date, readTimeMinutes: post.readTime.replace(/\D/g, "") || "5", emoji: "", videoUrl: post.videoUrl ?? "" })}
          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${blogForm.id === post.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">{post.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{post.category} · {formatDate(post.date)}</p>
            </div>
            <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">{post.readTime}</span>
          </div>
        </button>
      ));
    }

    if (activeTab === "quizQuestions") {
      if (filteredQuiz.length === 0) return <p className="py-8 text-center text-xs text-gray-400">{listSearch ? "Không tìm thấy kết quả" : "Chưa có câu hỏi nào"}</p>;
      return filteredQuiz.map(qz => (
        <button key={qz.id} onClick={() => setQuizForm({ id: qz.id, slug: qz.slug, question: qz.question, options: [...qz.options, "", "", "", ""].slice(0, 4), correct: String(qz.correct), explanation: qz.explanation ?? "", category: qz.category, difficulty: qz.difficulty, active: qz.active })}
          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${quizForm.id === qz.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold text-gray-800">{qz.question}</p>
              <p className="mt-0.5 text-xs text-gray-500">{qz.category} · {qz.difficulty}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${qz.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>{qz.active ? "Đang dùng" : "Ẩn"}</span>
          </div>
        </button>
      ));
    }

    if (activeTab === "games") {
      if (filteredGames.length === 0) return <p className="py-8 text-center text-xs text-gray-400">{listSearch ? "Không tìm thấy kết quả" : "Chưa có trò chơi nào"}</p>;
      return filteredGames.map(game => (
        <button key={game.id} onClick={() => setGameForm({ id: game.id, slug: game.slug, title: game.title, summary: game.summary, description: game.description, gameType: game.gameType, playPath: game.playPath, coverImage: game.coverImage ?? "", accentColor: game.accentColor ?? "#9b5de5", published: game.published })}
          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${gameForm.id === game.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">{game.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{game.gameType} · {game.playPath}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${game.published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>{game.published ? "Hiển thị" : "Nháp"}</span>
          </div>
        </button>
      ));
    }

    if (activeTab === "stickers") {
      if (filteredStickers.length === 0) return <p className="py-8 text-center text-xs text-gray-400">Không tìm thấy nhãn dán/GIF nào</p>;
      return filteredStickers.map(st => (
        <button key={st.id} onClick={() => setStickerForm({ id: st.id, name: st.name, url: st.url, type: st.type, category: st.category, keywordsString: st.keywords ? st.keywords.join(", ") : "" })}
          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${stickerForm.id === st.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white/60 p-1">
              <img src={st.url} alt={st.name} className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">{st.name}</p>
              <p className="mt-0.5 text-xs text-gray-500 truncate">Chủ đề: {st.category} · Từ khóa: {st.keywords?.join(", ")}</p>
            </div>
            <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600">{st.type}</span>
          </div>
        </button>
      ));
    }

    if (activeTab === "reports") {
      if (filteredReports.length === 0) return <p className="py-8 text-center text-xs text-gray-400">Không tìm thấy báo cáo nào</p>;
      return filteredReports.map((report) => (
        <button
          key={report.id}
          onClick={() => setSelectedReport(report)}
          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${selectedReport?.id === report.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"
            }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-semibold text-gray-800">
                Lý do: {report.reason}
              </p>
              <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                {report.contentPreview}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                Bởi: {report.reporterName} · {formatDate(report.createdAt)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${report.status === "PENDING"
                ? "bg-amber-50 text-amber-600"
                : report.status === "RESOLVED"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-gray-100 text-gray-400"
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
      if (filteredQuestions.length === 0) return <p className="py-8 text-center text-xs text-gray-400">Không tìm thấy câu hỏi nào</p>;
      return filteredQuestions.map((q) => (
        <button
          key={q.id}
          onClick={() => {
            setSelectedQuestion(q);
            setAnswerText(q.answer || "");
          }}
          className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${selectedQuestion?.id === q.id ? "border-purple-200 bg-purple-50" : "border-gray-100 hover:bg-gray-50"
            }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-semibold text-gray-800">
                {q.question}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                Gửi lúc: {formatDate(q.createdAt)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${!q.answer || q.answer.trim() === ""
                ? "bg-amber-50 text-amber-600"
                : "bg-emerald-50 text-emerald-600"
                }`}
            >
              {!q.answer || q.answer.trim() === "" ? "Chưa trả lời" : "Đã trả lời"}
            </span>
          </div>
        </button>
      ));
    }

    return null;
  };

  const renderBlockFieldEditor = () => {
    if (!blockForm.blockType) return null;

    if (blockForm.blockType === "hook") {
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Tiêu đề Hook (Câu hỏi/Lời dẫn thu hút)</Label>
            <Input
              value={blockFields.title || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, title: e.target.value }))}
              placeholder="Bạn có biết...?"
              className="text-xs"
            />
          </div>
        </div>
      );
    }

    if (blockForm.blockType === "explanation") {
      const bullets = blockFields.bullets || [];
      return (
        <div className="space-y-3">
          <Label className="text-xs">Các ý giải thích (Gạch đầu dòng)</Label>
          {bullets.map((bullet: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={bullet}
                onChange={e => {
                  const newBullets = [...bullets];
                  newBullets[idx] = e.target.value;
                  setBlockFields((p: any) => ({ ...p, bullets: newBullets }));
                }}
                placeholder={`Gạch đầu dòng ${idx + 1}`}
                className="text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-700 h-8 px-2"
                onClick={() => {
                  const newBullets = bullets.filter((_: any, i: number) => i !== idx);
                  setBlockFields((p: any) => ({ ...p, bullets: newBullets }));
                }}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setBlockFields((p: any) => ({ ...p, bullets: [...(p.bullets || []), ""] }))}
          >
            + Thêm ý gạch đầu dòng
          </Button>
        </div>
      );
    }

    if (blockForm.blockType === "scenario") {
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Tiêu đề Tình huống</Label>
            <Input
              value={blockFields.title || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, title: e.target.value }))}
              placeholder="VD: Quyết định khó khăn"
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Nội dung Tình huống</Label>
            <Textarea
              value={blockFields.body || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, body: e.target.value }))}
              placeholder="Mô tả tình huống thực tế xảy ra..."
              className="text-xs min-h-[80px]"
            />
          </div>
        </div>
      );
    }

    if (blockForm.blockType === "interaction") {
      const choices = blockFields.choices || [{ text: "", correct: true, emoji: "💚" }, { text: "", correct: false, emoji: "🛑" }];
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Câu hỏi trắc nghiệm</Label>
            <Input
              value={blockFields.question || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, question: e.target.value }))}
              placeholder="Đặt câu hỏi lựa chọn hành vi..."
              className="text-xs"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-xs">Các phương án trả lời (Tick vào đáp án đúng)</Label>
            {choices.map((choice: any, idx: number) => (
              <div key={idx} className="space-y-2 rounded-lg border border-gray-100 p-2.5 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500">Phương án {idx + 1}</span>
                  {choices.length > 2 && (
                    <button
                      onClick={() => {
                        const newChoices = choices.filter((_: any, i: number) => i !== idx);
                        setBlockFields((p: any) => ({ ...p, choices: newChoices }));
                      }}
                      className="text-[9px] text-red-500 hover:underline"
                    >
                      Xóa phương án
                    </button>
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_80px_60px]">
                  <Input
                    value={choice.text || ""}
                    onChange={e => {
                      const newChoices = [...choices];
                      newChoices[idx] = { ...newChoices[idx], text: e.target.value };
                      setBlockFields((p: any) => ({ ...p, choices: newChoices }));
                    }}
                    placeholder="Nội dung trả lời..."
                    className="text-xs h-8"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!choice.correct}
                      onChange={e => {
                        const newChoices = choices.map((c: any, i: number) => ({
                          ...c,
                          correct: i === idx ? e.target.checked : false
                        }));
                        setBlockFields((p: any) => ({ ...p, choices: newChoices }));
                      }}
                    />
                    <span className="text-[10px] font-medium">Đúng</span>
                  </div>
                  <Input
                    value={choice.emoji || ""}
                    onChange={e => {
                      const newChoices = [...choices];
                      newChoices[idx] = { ...newChoices[idx], emoji: e.target.value };
                      setBlockFields((p: any) => ({ ...p, choices: newChoices }));
                    }}
                    placeholder="Emoji"
                    className="text-xs h-8"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setBlockFields((p: any) => ({ ...p, choices: [...choices, { text: "", correct: false, emoji: "💬" }] }))}
            >
              + Thêm phương án
            </Button>
          </div>
        </div>
      );
    }

    if (blockForm.blockType === "reflection") {
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Câu hỏi Suy ngẫm</Label>
            <Textarea
              value={blockFields.question || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, question: e.target.value }))}
              placeholder="Bạn nghĩ sao về điều này...?"
              className="text-xs min-h-[80px]"
            />
          </div>
        </div>
      );
    }

    if (blockForm.blockType === "takeaway") {
      const items = blockFields.items || [];
      return (
        <div className="space-y-3">
          <Label className="text-xs">Các điều cần nhớ (Takeaways)</Label>
          {items.map((item: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={item}
                onChange={e => {
                  const newItems = [...items];
                  newItems[idx] = e.target.value;
                  setBlockFields((p: any) => ({ ...p, items: newItems }));
                }}
                placeholder={`Điều cần nhớ ${idx + 1}`}
                className="text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-700 h-8 px-2"
                onClick={() => {
                  const newItems = items.filter((_: any, i: number) => i !== idx);
                  setBlockFields((p: any) => ({ ...p, items: newItems }));
                }}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setBlockFields((p: any) => ({ ...p, items: [...(p.items || []), ""] }))}
          >
            + Thêm điều cần nhớ
          </Button>
        </div>
      );
    }

    if (blockForm.blockType === "sorting") {
      const items = blockFields.items || [];
      const leftBox = blockFields.leftBox || { title: "" };
      const rightBox = blockFields.rightBox || { title: "" };
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Hướng dẫn phân loại *</Label>
            <Input
              value={blockFields.instruction || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, instruction: e.target.value }))}
              placeholder="VD: Hãy phân loại các hành vi vào đúng hộp:"
              className="text-xs"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Tiêu đề Hộp trái (Left Box)</Label>
              <Input
                value={leftBox.title || ""}
                onChange={e => setBlockFields((p: any) => ({ ...p, leftBox: { ...leftBox, title: e.target.value } }))}
                placeholder="VD: Lành mạnh"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Tiêu đề Hộp phải (Right Box)</Label>
              <Input
                value={rightBox.title || ""}
                onChange={e => setBlockFields((p: any) => ({ ...p, rightBox: { ...rightBox, title: e.target.value } }))}
                placeholder="VD: Không lành mạnh"
                className="text-xs"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-xs">Các thẻ phân loại</Label>
            {items.map((item: any, idx: number) => (
              <div key={idx} className="space-y-2 rounded-lg border border-gray-100 p-2.5 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500">Thẻ {idx + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => {
                        const newItems = items.filter((_: any, i: number) => i !== idx);
                        setBlockFields((p: any) => ({ ...p, items: newItems }));
                      }}
                      className="text-[9px] text-red-500 hover:underline font-semibold"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
                  <Input
                    value={item.text || ""}
                    onChange={e => {
                      const newItems = [...items];
                      newItems[idx] = { ...newItems[idx], text: e.target.value };
                      setBlockFields((p: any) => ({ ...p, items: newItems }));
                    }}
                    placeholder="Nội dung thẻ..."
                    className="text-xs h-8"
                  />
                  <select
                    value={item.correctBox || "left"}
                    onChange={e => {
                      const newItems = [...items];
                      newItems[idx] = { ...newItems[idx], correctBox: e.target.value };
                      setBlockFields((p: any) => ({ ...p, items: newItems }));
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-700 outline-none h-8"
                  >
                    <option value="left">Hộp bên trái</option>
                    <option value="right">Hộp bên phải</option>
                  </select>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setBlockFields((p: any) => ({ ...p, items: [...items, { text: "", correctBox: "left" }] }))}
            >
              + Thêm thẻ phân loại
            </Button>
          </div>
        </div>
      );
    }

    if (blockForm.blockType === "matching") {
      const pairs = blockFields.pairs || [];
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Hướng dẫn ghép cặp *</Label>
            <Input
              value={blockFields.instruction || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, instruction: e.target.value }))}
              placeholder="VD: Ghép cặp các khái niệm cảm xúc dậy thì và định nghĩa tương ứng:"
              className="text-xs"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-bold text-gray-700">Danh sách các cặp ghép</Label>
            {pairs.map((pair: any, idx: number) => (
              <div key={idx} className="space-y-2 rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-600">Cặp thứ {idx + 1}</span>
                  {pairs.length > 1 && (
                    <button
                      onClick={() => {
                        const newPairs = pairs.filter((_: any, i: number) => i !== idx);
                        setBlockFields((p: any) => ({ ...p, pairs: newPairs }));
                      }}
                      className="text-[9px] text-red-500 hover:underline font-semibold"
                    >
                      Xóa cặp này
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-[10px] text-gray-400">Vế trái (Khái niệm)</Label>
                    <Input
                      value={pair.left || ""}
                      onChange={e => {
                        const newPairs = [...pairs];
                        newPairs[idx] = { ...newPairs[idx], left: e.target.value };
                        setBlockFields((p: any) => ({ ...p, pairs: newPairs }));
                      }}
                      placeholder="VD: Hormone dậy thì"
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-gray-400">Vế phải (Định nghĩa)</Label>
                    <Input
                      value={pair.right || ""}
                      onChange={e => {
                        const newPairs = [...pairs];
                        newPairs[idx] = { ...newPairs[idx], right: e.target.value };
                        setBlockFields((p: any) => ({ ...p, pairs: newPairs }));
                      }}
                      placeholder="VD: Chất hóa học kích hoạt cảm xúc"
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setBlockFields((p: any) => ({ ...p, pairs: [...pairs, { left: "", right: "" }] }))}
            >
              + Thêm cặp mới
            </Button>
          </div>
        </div>
      );
    }

    if (blockForm.blockType === "fill-blank") {
      const blanks = blockFields.blanks || {};
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Hướng dẫn điền chỗ trống *</Label>
            <Input
              value={blockFields.instruction || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, instruction: e.target.value }))}
              placeholder="VD: Điền các từ thích hợp để hoàn thành đoạn văn..."
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Đoạn văn chứa ô trống *</Label>
            <Textarea
              value={blockFields.sentence || ""}
              onChange={e => setBlockFields((p: any) => ({ ...p, sentence: e.target.value }))}
              placeholder="VD: Ở tuổi dậy thì, các [blank1] tăng vọt kích hoạt vùng [blank2]..."
              className="text-xs min-h-[80px]"
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Mẹo: Sử dụng cấu trúc <strong>[blank1]</strong>, <strong>[blank2]</strong>... để tạo các ô điền từ.
            </p>
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-bold text-gray-700">Đáp án cho các ô trống</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {Object.keys(blanks).length === 0 ? (
                <p className="text-[10px] text-gray-400 italic">Chưa có ô trống nào. Hãy thêm ở dưới.</p>
              ) : (
                Object.keys(blanks).map((key) => (
                  <div key={key} className="flex gap-2 items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-mono text-purple-600 shrink-0 font-bold bg-purple-50 px-2 py-1 rounded-lg">
                      [{key}]
                    </span>
                    <Input
                      value={blanks[key]?.correct || ""}
                      onChange={e => {
                        const newBlanks = { ...blanks };
                        newBlanks[key] = { correct: e.target.value };
                        setBlockFields((p: any) => ({ ...p, blanks: newBlanks }));
                      }}
                      placeholder="Nhập từ đáp án chính xác..."
                      className="text-xs h-7 flex-1"
                    />
                    <button
                      onClick={() => {
                        const newBlanks = { ...blanks };
                        delete newBlanks[key];
                        setBlockFields((p: any) => ({ ...p, blanks: newBlanks }));
                      }}
                      className="text-[10px] text-red-500 hover:underline font-semibold shrink-0"
                    >
                      Xóa
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] h-7"
                onClick={() => {
                  const currentKeys = Object.keys(blanks);
                  const nextIndex = currentKeys.length + 1;
                  const newBlanks = { ...blanks };
                  newBlanks[`blank${nextIndex}`] = { correct: "" };
                  setBlockFields((p: any) => ({ ...p, blanks: newBlanks }));
                }}
              >
                + Thêm ô trống mới
              </Button>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-3">
            <Label className="text-xs font-bold text-gray-700">Danh sách các từ gây nhiễu (Distractors)</Label>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {(blockFields.distractors || []).length === 0 ? (
                <p className="text-[10px] text-gray-400 italic">Chưa có từ nhiễu nào. Hãy thêm từ nhiễu để tăng độ khó cho trò chơi.</p>
              ) : (
                (blockFields.distractors || []).map((w: string, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                      Nhiễu {idx + 1}
                    </span>
                    <Input
                      value={w}
                      onChange={e => {
                        const newDistractors = [...(blockFields.distractors || [])];
                        newDistractors[idx] = e.target.value;
                        setBlockFields((p: any) => ({ ...p, distractors: newDistractors }));
                      }}
                      placeholder="VD: bắt buộc, áp đặt..."
                      className="text-xs h-7 flex-1"
                    />
                    <button
                      onClick={() => {
                        const newDistractors = (blockFields.distractors || []).filter((_: any, i: number) => i !== idx);
                        setBlockFields((p: any) => ({ ...p, distractors: newDistractors }));
                      }}
                      className="text-[10px] text-red-500 hover:underline font-semibold shrink-0"
                    >
                      Xóa
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] h-7 text-amber-600 border-amber-200"
                onClick={() => {
                  const newDistractors = [...(blockFields.distractors || []), ""];
                  setBlockFields((p: any) => ({ ...p, distractors: newDistractors }));
                }}
              >
                + Thêm từ nhiễu mới
              </Button>
            </div>
          </div>

          {/* Current Word Pool Preview */}
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-gray-500">
                Bể từ vựng thiết lập ({[...Object.values(blanks).map((b: any) => b.correct).filter(Boolean), ...(blockFields.distractors || []).filter(Boolean)].length} từ)
              </Label>
              <span className="text-[9px] text-purple-600 font-semibold italic bg-purple-50 px-2 py-0.5 rounded-lg">
                💡 Tự động sáo trộn ở phía học sinh
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              {[...Object.values(blanks).map((b: any) => b.correct).filter(Boolean), ...(blockFields.distractors || []).filter(Boolean)].map((w: string, idx: number) => {
                const isCorrect = Object.values(blanks).some((b: any) => b.correct === w);
                return (
                  <span
                    key={idx}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shadow-sm ${isCorrect ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (blockForm.blockType === "scenario-choice") {
      const nodes = blockFields.nodes || {};
      const nodeKeys = Object.keys(nodes);
      const startNode = blockFields.startNode || "step1";

      const activeNodeKey = nodeKeys.includes(activeScenarioNodeKey)
        ? activeScenarioNodeKey
        : (nodeKeys[0] || "step1");

      if (!nodes[activeNodeKey]) {
        nodes[activeNodeKey] = { text: "", choices: [] };
      }

      const activeNode = nodes[activeNodeKey];
      const choices = activeNode.choices || [];

      return (
        <div className="space-y-4">
          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 text-xs text-purple-800 space-y-1">
            🌳 <strong>Bộ dựng kịch bản phiêu lưu nhánh (Visual Decision Tree):</strong>
            <p className="text-[11px] text-purple-700/80">Nhấn vào từng phân cảnh ở &quot;Bản đồ các bước&quot; để biên soạn nội dung và các lựa chọn rẽ nhánh đi kèm.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold text-gray-700">Tiêu đề cuộc phiêu lưu *</Label>
              <Input
                value={blockFields.title || ""}
                onChange={e => setBlockFields((p: any) => ({ ...p, title: e.target.value }))}
                placeholder="VD: Cuộc phiêu lưu: Đón nhận cảm xúc..."
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700">Bước khởi đầu cuộc phiêu lưu *</Label>
              <select
                value={startNode}
                onChange={e => setBlockFields((p: any) => ({ ...p, startNode: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none h-9 font-semibold"
              >
                {nodeKeys.map(k => (
                  <option key={k} value={k}>{k === startNode ? `👑 ${k} (Khởi đầu)` : k}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Visual Step Map / Node List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-gray-700">🗺️ Bản đồ các phân cảnh ({nodeKeys.length})</Label>
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] h-6 px-2 text-purple-600 border-purple-200 hover:bg-purple-50"
                onClick={() => {
                  const stepName = prompt("Nhập tên mã phân cảnh mới (ví dụ: step3, fail_pester):");
                  if (!stepName) return;
                  const cleaned = stepName.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
                  if (!cleaned) {
                    toast.error("Tên mã không hợp lệ (chỉ cho phép chữ thường, số và dấu gạch dưới)");
                    return;
                  }
                  if (nodes[cleaned]) {
                    toast.error("Tên mã phân cảnh đã tồn tại");
                    return;
                  }
                  const newNodes = { ...nodes };
                  newNodes[cleaned] = { text: "", choices: [] };
                  setBlockFields((p: any) => ({ ...p, nodes: newNodes }));
                  setActiveScenarioNodeKey(cleaned);
                  toast.success(`Đã tạo phân cảnh "${cleaned}"!`);
                }}
              >
                + Thêm phân cảnh mới
              </Button>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {nodeKeys.map(k => {
                const node = nodes[k] || { text: "", choices: [] };
                const isStart = k === startNode;
                const isCurrent = k === activeNodeKey;
                const isEnd = (node.choices || []).length === 0;

                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setActiveScenarioNodeKey(k)}
                    className={`flex-shrink-0 w-[140px] text-left p-2.5 rounded-xl border transition-all select-none ${isCurrent
                      ? "border-purple-500 bg-purple-50/30 ring-2 ring-purple-500/20 shadow-md"
                      : "border-gray-150 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-gray-800 truncate block flex-1 font-mono">{k}</span>
                      {isStart ? (
                        <span className="text-[8px] bg-yellow-100 text-yellow-800 px-1 rounded font-bold shrink-0">👑</span>
                      ) : isEnd ? (
                        <span className="text-[8px] bg-red-50 text-red-700 px-1 rounded font-bold shrink-0">🏁</span>
                      ) : (
                        <span className="text-[8px] bg-blue-50 text-blue-700 px-1 rounded font-bold shrink-0">🔗</span>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-400 line-clamp-2 min-h-[24px]">
                      {node.text ? node.text : <em className="text-gray-350">Chưa nhập nội dung...</em>}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between border-t border-gray-100 pt-1 text-[8px] text-gray-500">
                      <span>{isEnd ? "Điểm kết" : `${(node.choices || []).length} lựa chọn`}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Node Editor */}
          <div className="border-2 border-purple-200 rounded-xl p-4 bg-white space-y-4 shadow-sm relative">
            <div className="absolute top-0 right-0 transform translate-y-[-50%] mr-4 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
              ✍️ Đang soạn thảo: <span className="font-mono">{activeNodeKey}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-700">Định dạng phân cảnh:</span>
                {activeNodeKey === startNode ? (
                  <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-lg font-bold">
                    👑 Màn khởi đầu kịch bản
                  </span>
                ) : (activeNode.choices || []).length === 0 ? (
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-lg font-bold">
                    🏁 Điểm kết câu chuyện (Học sinh dừng chân)
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-lg font-bold">
                    🔗 Nhánh dẫn dắt trung gian
                  </span>
                )}
              </div>

              {nodeKeys.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa phân cảnh "${activeNodeKey}"? Các lựa chọn dẫn tới phân cảnh này ở những bước khác có thể bị ảnh hưởng.`)) {
                      const newNodes = { ...nodes };
                      delete newNodes[activeNodeKey];
                      const remainingKeys = Object.keys(newNodes);
                      setBlockFields((p: any) => ({
                        ...p,
                        nodes: newNodes,
                        startNode: p.startNode === activeNodeKey ? (remainingKeys[0] || "step1") : p.startNode
                      }));
                      setActiveScenarioNodeKey(remainingKeys[0] || "step1");
                      toast.success(`Đã xóa phân cảnh "${activeNodeKey}"`);
                    }
                  }}
                  className="text-[10px] text-red-500 hover:underline font-bold"
                >
                  🗑️ Xóa phân cảnh này
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-gray-700">Nội dung dẫn dắt hoặc kể câu chuyện *</Label>
                <Textarea
                  value={activeNode.text || ""}
                  onChange={e => {
                    const newNodes = { ...nodes };
                    newNodes[activeNodeKey] = { ...newNodes[activeNodeKey], text: e.target.value };
                    setBlockFields((p: any) => ({ ...p, nodes: newNodes }));
                  }}
                  placeholder="VD: Bạn cùng lớp từ chối rủ đi hiệu sách. Cảm giác ngượng ngùng dâng lên..."
                  className="text-xs min-h-[90px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-gray-700">Các lựa chọn hành động cho học sinh ({choices.length})</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-6 px-2 text-purple-600 border-purple-200"
                    onClick={() => {
                      const newNodes = { ...nodes };
                      newNodes[activeNodeKey] = {
                        ...newNodes[activeNodeKey],
                        choices: [...choices, { text: "", nextNode: nodeKeys[0] || "step1" }]
                      };
                      setBlockFields((p: any) => ({ ...p, nodes: newNodes }));
                    }}
                  >
                    + Thêm lựa chọn
                  </Button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {choices.length === 0 ? (
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-250">
                      <p className="text-[11px] text-gray-400 italic">Không có nút lựa chọn rẽ nhánh.</p>
                      <p className="text-[9px] text-gray-400 mt-1">Học sinh khi đi tới phân cảnh này sẽ thấy thông báo hoàn thành hoặc nút thử lại.</p>
                    </div>
                  ) : (
                    choices.map((choice: any, cIdx: number) => (
                      <div key={cIdx} className="space-y-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-150">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-gray-400">NÚT BẤM {cIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newNodes = { ...nodes };
                              const newChoices = choices.filter((_: any, i: number) => i !== cIdx);
                              newNodes[activeNodeKey] = { ...newNodes[activeNodeKey], choices: newChoices };
                              setBlockFields((p: any) => ({ ...p, nodes: newNodes }));
                            }}
                            className="text-[9px] text-red-500 hover:underline font-semibold"
                          >
                            Xóa lựa chọn
                          </button>
                        </div>
                        <Input
                          value={choice.text || ""}
                          onChange={e => {
                            const newNodes = { ...nodes };
                            const newChoices = [...choices];
                            newChoices[cIdx] = { ...newChoices[cIdx], text: e.target.value };
                            newNodes[activeNodeKey] = { ...newNodes[activeNodeKey], choices: newChoices };
                            setBlockFields((p: any) => ({ ...p, nodes: newNodes }));
                          }}
                          placeholder="Văn bản trên nút bấm (VD: Tự suy diễn: Chắc bạn ghét mình...)"
                          className="text-xs h-8 bg-white"
                        />
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-dashed border-gray-200">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-500 font-bold">👉 Hướng đi tới:</span>
                            <select
                              value={choice.nextNode || ""}
                              onChange={e => {
                                const newNodes = { ...nodes };
                                const newChoices = [...choices];
                                newChoices[cIdx] = { ...newChoices[cIdx], nextNode: e.target.value };
                                newNodes[activeNodeKey] = { ...newNodes[activeNodeKey], choices: newChoices };
                                setBlockFields((p: any) => ({ ...p, nodes: newNodes }));
                              }}
                              className="rounded-lg border border-gray-250 bg-white px-2 py-0.5 text-[11px] text-gray-700 outline-none h-7 font-mono"
                            >
                              {nodeKeys.map(k => (
                                <option key={k} value={k}>{k}</option>
                              ))}
                            </select>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[9px] h-6 text-purple-600 border-purple-200 hover:bg-purple-50"
                            onClick={() => {
                              const choiceTextClean = (choice.text || "buoc_moi").toLowerCase().trim()
                                .replace(/[^a-z0-9\s]/g, "")
                                .replace(/\s+/g, "_");
                              const defaultName = choiceTextClean ? `step_${choiceTextClean.slice(0, 15)}` : "buoc_moi";
                              const targetName = prompt("Nhập tên mã cho phân cảnh mới để liên kết tới:", defaultName);
                              if (!targetName) return;
                              const cleaned = targetName.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
                              if (!cleaned) {
                                toast.error("Tên mã bước không hợp lệ");
                                return;
                              }
                              if (nodes[cleaned]) {
                                toast.error("Tên mã bước đã tồn tại trong kịch bản");
                                return;
                              }

                              const newNodes = { ...nodes };
                              newNodes[cleaned] = { text: "", choices: [] };

                              const newChoices = [...choices];
                              newChoices[cIdx] = { ...newChoices[cIdx], nextNode: cleaned };
                              newNodes[activeNodeKey] = { ...newNodes[activeNodeKey], choices: newChoices };

                              setBlockFields((p: any) => ({ ...p, nodes: newNodes }));
                              setActiveScenarioNodeKey(cleaned);
                              toast.success(`Đã tạo nhanh phân cảnh "${cleaned}" và liên kết thành công!`);
                            }}
                          >
                            🆕 Tạo nhanh bước đi tới
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Label className="text-xs">Dữ liệu JSON cấu hình thô</Label>
        <Textarea
          className="font-mono text-xs min-h-[120px]"
          value={JSON.stringify(blockFields, null, 2)}
          onChange={e => {
            try {
              setBlockFields(JSON.parse(e.target.value));
            } catch { }
          }}
        />
      </div>
    );
  };

  const renderPhonePreview = () => {
    if (!blockForm.blockType) return null;
    return (
      <div className="w-[280px] border-4 border-gray-800 rounded-[28px] bg-slate-950 overflow-hidden shadow-xl shrink-0 h-[430px] flex flex-col select-none">
        <div className="h-5 bg-gray-800 flex justify-center items-center">
          <div className="w-12 h-2.5 bg-black rounded-full"></div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-[#1a1b2f] to-[#0d0e15] p-3 overflow-y-auto text-white flex flex-col justify-center">
          <div className="text-[9px] text-center uppercase tracking-widest text-purple-400 font-bold mb-3">
            Mobile Mock Preview
          </div>

          {blockForm.blockType === "hook" && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center shadow-lg">
              <span className="text-2xl text-purple-400">✨</span>
              <p className="mt-2 text-xs font-bold text-white leading-relaxed">
                {blockFields.title || "Nhập câu hỏi thu hút..."}
              </p>
            </div>
          )}

          {blockForm.blockType === "explanation" && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg space-y-2">
              <h4 className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span>💡</span> Hiểu nhanh
              </h4>
              <ul className="space-y-1.5 text-[10px] text-slate-200">
                {(blockFields.bullets || ["Nhập các ý giải thích ở bên trái..."]).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-400">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {blockForm.blockType === "scenario" && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg space-y-1.5">
              <h4 className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <span>🎬</span> Tình huống thực tế
              </h4>
              <p className="text-[10px] font-bold text-white">{blockFields.title || "Tiêu đề tình huống..."}</p>
              <p className="text-[9px] leading-relaxed text-slate-300 italic">
                {blockFields.body || "Mô tả tình huống..."}
              </p>
            </div>
          )}

          {blockForm.blockType === "interaction" && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg space-y-2">
              <h4 className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                <span>🎮</span> Thử thách trắc nghiệm
              </h4>
              <p className="text-[10px] font-bold text-white">{blockFields.question || "Nhập câu hỏi..."}</p>
              <div className="space-y-1.5">
                {(blockFields.choices || [{ text: "Phương án A", correct: true, emoji: "💚" }, { text: "Phương án B", correct: false, emoji: "🛑" }]).map((c: any, i: number) => (
                  <div key={i} className="w-full text-left bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[9px] flex items-center justify-between">
                    <span>{c.text || `Phương án ${i + 1}`}</span>
                    <span>{c.emoji || "💬"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {blockForm.blockType === "reflection" && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg space-y-2 text-center">
              <span className="text-xl text-pink-400">💭</span>
              <p className="text-[10px] font-semibold text-slate-200">
                {blockFields.question || "Nhập câu hỏi gợi suy ngẫm..."}
              </p>
              <textarea readOnly placeholder="Học viên sẽ trả lời tại đây..." className="w-full bg-black/20 border border-white/10 rounded-lg p-1.5 text-[9px] text-slate-300 outline-none resize-none h-12"></textarea>
            </div>
          )}

          {blockForm.blockType === "takeaway" && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-xl p-3 shadow-lg space-y-1.5">
              <h4 className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span>✅</span> Điều cần nhớ
              </h4>
              <ul className="space-y-1 text-[10px] text-slate-200">
                {(blockFields.items || ["Nhập điều ghi nhớ..."]).map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-400">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="h-3 bg-gray-800 flex justify-center items-center">
          <div className="w-16 h-0.5 bg-white/30 rounded-full"></div>
        </div>
      </div>
    );
  };

  const renderPresetIcon = (name: string) => {
    const size = "h-4 w-4";
    if (name === "Compass") return <Compass className={size} />;
    if (name === "ShieldCheck") return <ShieldCheck className={size} />;
    if (name === "HelpCircle") return <HelpCircle className={size} />;
    if (name === "Lock") return <Lock className={size} />;
    if (name === "Heart") return <Heart className={size} />;
    if (name === "BookOpen") return <BookOpen className={size} />;
    if (name === "Smile") return <Smile className={size} />;
    if (name === "Trophy") return <Trophy className={size} />;
    if (name === "MessageSquare") return <MessageSquare className={size} />;
    if (name === "Users") return <Users className={size} />;
    if (name === "Award") return <Award className={size} />;
    if (name === "Flame") return <Flame className={size} />;
    if (name === "EyeOff") return <EyeOff className={size} />;
    if (name === "Handshake") return <Handshake className={size} />;
    if (name === "HeartHandshake") return <HeartHandshake className={size} />;
    if (name === "Phone") return <Phone className={size} />;
    if (name === "Lightbulb") return <Lightbulb className={size} />;
    if (name === "Frown") return <Frown className={size} />;
    if (name === "Brain") return <Brain className={size} />;
    if (name === "LifeBuoy") return <LifeBuoy className={size} />;
    if (name === "Key") return <Key className={size} />;
    return <HelpCircle className={size} />;
  };

  const getBlockTypeLabel = (type: string, label: string) => {
    if (!selectedMicroLesson) return label;
    const exists = (selectedMicroLesson.blocks || []).some(
      b => b.blockType === type && b.id !== editingBlock?.id
    );
    return exists ? `${label} (Đã có)` : label;
  };

  const getBlockSummaryText = (blockType: string, contentJson: string) => {
    try {
      const data = JSON.parse(contentJson);
      if (blockType === "hook") return `🎯 ${data.title || "Chưa nhập câu dẫn"}`;
      if (blockType === "explanation") return `💡 Giải thích: ${(data.bullets || []).join(" · ")}`;
      if (blockType === "scenario") return `🎬 Tình huống: ${data.title || ""} - ${data.body || ""}`;
      if (blockType === "interaction") return `❓ Trắc nghiệm: ${data.question || ""} (${(data.choices || []).length} đáp án)`;
      if (blockType === "reflection") return `💭 Suy ngẫm: ${data.question || ""}`;
      if (blockType === "takeaway") return `✅ Kết luận: ${(data.items || []).join(" · ")}`;
      if (blockType === "sorting") return `📦 Phân loại: ${data.instruction || ""} (${(data.items || []).length} thẻ)`;
      if (blockType === "scenario-choice") return `🧭 Phiêu lưu: ${data.title || ""}`;
      if (blockType === "matching") return `🧩 Ghép cặp: ${data.instruction || ""} (${(data.pairs || []).length} cặp)`;
      if (blockType === "fill-blank") return `📝 Điền ô trống: ${data.instruction || ""}`;
      return contentJson;
    } catch {
      return contentJson;
    }
  };

  const renderLessonEditorContent = () => {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Bài học</p>
            <h2 className="mt-1 text-xl font-bold text-gray-800">{lessonForm.id ? "Cập nhật bài học" : "Tạo bài học mới"}</h2>
          </div>
          {lessonForm.id ? (
            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete({ label: lessonForm.title, onConfirm: deleteLesson })} disabled={isSaving}>
              <Trash2 className="mr-1.5 h-4 w-4" />Xóa
            </Button>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Khóa học thuộc về</Label>
              <select value={lessonForm.courseId} onChange={e => setLessonForm(p => ({ ...p, courseId: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none">
                <option value="">-- Chọn khóa học --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Thứ tự sắp xếp (Bài số)</Label>
              <Input type="number" value={lessonForm.order} onChange={e => setLessonForm(p => ({ ...p, order: e.target.value }))} placeholder="VD: 1" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Tiêu đề bài học *</Label>
              <Input value={lessonForm.title} onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))} placeholder="Nhập tiêu đề bài học..." />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input value={lessonForm.slug} onChange={e => setLessonForm(p => ({ ...p, slug: e.target.value }))} placeholder="VD: gioi-han-ca-nhan" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Điểm thưởng XP</Label>
              <Input type="number" value={lessonForm.xpReward} onChange={e => setLessonForm(p => ({ ...p, xpReward: e.target.value }))} placeholder="100" />
            </div>
            <div>
              <Label>Thời gian ước lượng (Phút)</Label>
              <Input type="number" value={lessonForm.estimatedMinutes} onChange={e => setLessonForm(p => ({ ...p, estimatedMinutes: e.target.value }))} placeholder="10" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>YouTube Teaser Video URL / ID</Label>
              <Input
                value={lessonForm.teaserVideoId}
                onChange={e => {
                  const val = e.target.value;
                  setLessonForm(p => ({ ...p, teaserVideoId: extractYoutubeId(val) }));
                }}
                placeholder="Nhập ID hoặc dán link YouTube..."
              />
              {lessonForm.teaserVideoId && <p className="mt-1 text-[10px] text-gray-400">Đã nhận diện ID: {lessonForm.teaserVideoId}</p>}
            </div>
            <div>
              <Label>YouTube Full Video URL / ID</Label>
              <Input
                value={lessonForm.fullVideoId}
                onChange={e => {
                  const val = e.target.value;
                  setLessonForm(p => ({ ...p, fullVideoId: extractYoutubeId(val) }));
                }}
                placeholder="Nhập ID hoặc dán link YouTube..."
              />
              {lessonForm.fullVideoId && <p className="mt-1 text-[10px] text-gray-400">Đã nhận diện ID: {lessonForm.fullVideoId}</p>}
            </div>
          </div>

          <div>
            <Label>Tóm tắt ngắn bài học</Label>
            <Textarea value={lessonForm.summary} onChange={e => setLessonForm(p => ({ ...p, summary: e.target.value }))} placeholder="Nhập tóm tắt ngắn..." />
          </div>

          <div>
            <Label>Nội dung giới thiệu bài học</Label>
            <Textarea className="min-h-[140px]" value={lessonForm.content} onChange={e => setLessonForm(p => ({ ...p, content: e.target.value }))} placeholder="Nhập nội dung bài viết giới thiệu..." />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 bg-gray-50">
            <input type="checkbox" checked={lessonForm.isFree} onChange={e => setLessonForm(p => ({ ...p, isFree: e.target.checked }))} />
            <span className="text-sm font-semibold">Cho phép học viên miễn phí truy cập (Học thử)</span>
          </label>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={resetLessonForm}>Hủy</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveLesson} disabled={isSaving}>{isSaving ? "Đang lưu..." : "Lưu thông tin cơ bản"}</Button>
          </div>
        </div>

        {lessonForm.id && (
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">🔗 Tài liệu tham khảo của bài học</h3>

            {sources.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-xs text-gray-500">
                  <thead className="bg-gray-50 text-[10px] uppercase text-gray-700 font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-2">Tên tài liệu</th>
                      <th className="px-4 py-2">Link liên kết</th>
                      <th className="px-4 py-2 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sources.map(src => (
                      <tr key={src.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{src.sourceName}</td>
                        <td className="px-4 py-2 max-w-[200px] truncate"><a href={src.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{src.sourceUrl}</a></td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => handleDeleteSource(src.id)} className="text-red-500 hover:underline font-semibold text-[10px]">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Chưa có nguồn tài liệu tham khảo nào cho bài học này.</p>
            )}

            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_80px] items-end rounded-xl border border-dashed border-gray-200 p-4">
              <div>
                <Label className="text-[10px]">Tên nguồn</Label>
                <Input value={newSource.sourceName} onChange={e => setNewSource(p => ({ ...p, sourceName: e.target.value }))} placeholder="VD: Scarleteen - Consent basics" className="h-8 text-xs" />
              </div>
              <div>
                <Label className="text-[10px]">Đường dẫn (URL)</Label>
                <Input value={newSource.sourceUrl} onChange={e => setNewSource(p => ({ ...p, sourceUrl: e.target.value }))} placeholder="https://..." className="h-8 text-xs" />
              </div>
              <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700 h-8 text-xs" onClick={() => handleAddSource(lessonForm.id!)}>+ Thêm</Button>
            </div>
          </div>
        )}

        {lessonForm.id && (
          <div className="border-t border-gray-100 pt-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">📱 Trình thiết kế bước học nhỏ & câu hỏi tương tác</h3>
              <p className="text-xs text-gray-400">Tạo các chương nhỏ dạng slide và nội dung câu hỏi/trắc nghiệm tương tác cho học viên học trên thiết bị di động.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Danh sách chương nhỏ</p>
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {microLessons.map(ml => (
                    <div key={ml.id} className="group flex items-center justify-between gap-1">
                      <button
                        onClick={() => {
                          setSelectedMicroLesson(ml);
                          setEditingBlock(null);
                        }}
                        className={`flex-1 text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${selectedMicroLesson?.id === ml.id ? "bg-purple-600 text-white border-purple-600" : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"}`}
                      >
                        {ml.title}
                      </button>
                      <button onClick={() => handleDeleteMicroLesson(ml.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 text-[10px] transition-all" title="Xóa chương nhỏ">✕</button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-dashed border-gray-100">
                  <Input value={newMicroLessonTitle} onChange={e => setNewMicroLessonTitle(e.target.value)} placeholder="Tên chương mới..." className="h-8 text-xs" />
                  <Button size="sm" variant="outline" className="w-full text-[10px] h-7 border-purple-200 text-purple-600 hover:bg-purple-50" onClick={() => handleAddMicroLesson(lessonForm.id!)}>+ Thêm chương nhỏ</Button>
                </div>
              </div>

              <div>
                {selectedMicroLesson ? (
                  <div className="space-y-6">
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wide">Đang biên tập chương nhỏ</p>
                      <h4 className="text-sm font-bold text-purple-950 mt-0.5">{selectedMicroLesson.title}</h4>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="space-y-6">
                        {editingBlock === null && (
                          <div className="space-y-3 animate-fadeIn">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Các khối nội dung (Blocks)</p>

                            {(selectedMicroLesson.blocks || []).length > 0 ? (
                              <div className="space-y-2">
                                {(selectedMicroLesson.blocks || []).map((b, idx) => (
                                  <div
                                    key={b.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none ${draggedItemIndex === idx
                                      ? "opacity-40 border-dashed border-purple-300 bg-purple-50/10"
                                      : editingBlock?.id === b.id
                                        ? "border-purple-200 bg-purple-50/30"
                                        : "border-gray-100 bg-white hover:border-purple-100 hover:shadow-sm"
                                      }`}
                                  >
                                    <div className="flex items-start gap-2.5 min-w-0">
                                      <span className="text-gray-300 font-bold self-center select-none text-xs">⠿</span>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">Slide {idx + 1}</span>
                                          <span className="text-xs font-semibold text-gray-800">{b.blockType}</span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-gray-500 truncate max-w-[300px] font-sans font-medium">{getBlockSummaryText(b.blockType, b.contentJson)}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0 self-center">
                                      <button onClick={(e) => { e.stopPropagation(); selectBlockForEdit(b); }} className="text-[11px] text-purple-600 hover:underline font-semibold">Sửa</button>
                                      <button onClick={(e) => { e.stopPropagation(); handleDeleteBlock(selectedMicroLesson.id, b.id); }} className="text-[11px] text-red-500 hover:underline font-semibold">Xóa</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic bg-gray-50 rounded-xl p-4 border border-gray-100">Chưa có slide nội dung nào. Vui lòng thêm block bên dưới.</p>
                            )}
                          </div>
                        )}

                        <div className="rounded-xl border border-gray-200 p-4 space-y-4 bg-white shadow-sm">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <p className="text-xs font-bold text-purple-700">{editingBlock ? "📝 ĐANG BIÊN TẬP SLIDE" : "✨ THÊM SLIDE MỚI"}</p>
                            {editingBlock && (
                              <button
                                onClick={() => {
                                  setEditingBlock(null);
                                  setBlockForm({ id: null, blockType: "explanation", contentJson: "" });
                                  setBlockFields({});
                                }}
                                className="text-[10px] text-purple-600 hover:underline font-bold flex items-center gap-1"
                              >
                                ← Quay lại danh sách slide
                              </button>
                            )}
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <Label className="text-[10px]">Loại Slide</Label>
                              <select
                                value={blockForm.blockType}
                                onChange={e => {
                                  const type = e.target.value as MicroLessonBlock["blockType"];
                                  setBlockForm(p => ({ ...p, blockType: type }));
                                  if (type === "hook") setBlockFields({ title: "" });
                                  else if (type === "explanation") setBlockFields({ bullets: [""] });
                                  else if (type === "scenario") setBlockFields({ title: "", body: "" });
                                  else if (type === "interaction") setBlockFields({ question: "", choices: [{ text: "", correct: true, emoji: "💚" }, { text: "", correct: false, emoji: "🛑" }] });
                                  else if (type === "sorting") setBlockFields({ instruction: "", leftBox: { title: "Lành mạnh (Green Flag)" }, rightBox: { title: "Độc hại (Red Flag)" }, items: [{ text: "", correctBox: "left" }] });
                                  else if (type === "reflection") setBlockFields({ question: "" });
                                  else if (type === "takeaway") setBlockFields({ items: [""] });
                                  else if (type === "matching") setBlockFields({ instruction: "", pairs: [{ left: "", right: "" }] });
                                  else if (type === "fill-blank") setBlockFields({ instruction: "", sentence: "", blanks: {} });
                                  else if (type === "scenario-choice") setBlockFields({ title: "Cuộc phiêu lưu mới", startNode: "step1", nodes: { step1: { text: "Nội dung khởi đầu...", choices: [] } } });
                                  else setBlockFields({});
                                }}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none"
                              >
                                <option value="hook">{getBlockTypeLabel("hook", "Hook (Khởi động)")}</option>
                                <option value="explanation">Explanation (Hiểu nhanh)</option>
                                <option value="scenario">Scenario (Tình huống)</option>
                                <option value="interaction">{getBlockTypeLabel("interaction", "Interaction (Trắc nghiệm)")}</option>
                                <option value="sorting">{getBlockTypeLabel("sorting", "Sorting (Phân loại)")}</option>
                                <option value="reflection">{getBlockTypeLabel("reflection", "Reflection (Suy ngẫm)")}</option>
                                <option value="takeaway">{getBlockTypeLabel("takeaway", "Takeaway (Kết luận)")}</option>
                                <option value="matching">{getBlockTypeLabel("matching", "Matching (Ghép cặp)")}</option>
                                <option value="fill-blank">{getBlockTypeLabel("fill-blank", "Fill in the blank (Điền chỗ trống)")}</option>
                                <option value="scenario-choice">{getBlockTypeLabel("scenario-choice", "Scenario Choice (Kịch bản nhánh)")}</option>
                              </select>
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-3">
                            {renderBlockFieldEditor()}
                          </div>

                          <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingBlock(null);
                                setBlockForm({ id: null, blockType: "explanation", contentJson: "" });
                                setBlockFields({});
                              }}
                              className="text-xs h-8"
                            >
                              Hủy
                            </Button>
                            <Button
                              size="sm"
                              className="bg-purple-600 text-white hover:bg-purple-700 text-xs h-8"
                              onClick={() => handleSaveBlock(selectedMicroLesson.id)}
                            >
                              Lưu Slide
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Mobile View</p>
                        {renderPhonePreview()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center p-6">
                    <span className="text-3xl text-gray-300">📱</span>
                    <p className="mt-3 text-xs font-semibold text-gray-500">Chọn hoặc tạo một chương học nhỏ ở cột trái để bắt đầu thiết kế Slide nội dung.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEditor = () => {
    if (activeTab === "courses") {
      if (editingLessonInCourse !== null) {
        return (
          <div className="space-y-4 animate-fadeIn">
            {renderLessonEditorContent()}
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Khóa học</p>
              <h2 className="mt-1 text-xl font-bold text-gray-800">{courseForm.id ? "Cập nhật khóa học" : "Tạo khóa học mới"}</h2>
            </div>
            {courseForm.id ? (
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete({ label: courseForm.title, onConfirm: deleteCourse })} disabled={isSaving}>
                <Trash2 className="mr-1.5 h-4 w-4" />Xóa
              </Button>
            ) : null}
          </div>
          <div className="space-y-4">
            <div>
              <Label>Tiêu đề khóa học *</Label>
              <Input value={courseForm.title} onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))} placeholder="Nhập tiêu đề khóa học..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Danh mục *</Label>
                <div className="flex gap-1.5 items-center">
                  <select
                    value={courseForm.categoryId}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === "NEW_CATEGORY") {
                        startAddCategory();
                      } else {
                        setCourseForm(p => ({ ...p, categoryId: val }));
                      }
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none"
                  >
                    <option value="">-- Không chọn / Chưa phân loại --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                    <option value="NEW_CATEGORY" className="text-purple-600 font-semibold bg-purple-50">+ Thêm danh mục mới...</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryManagerModal(true)}
                    className="h-8 w-8 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-200 transition-all shrink-0"
                    title="⚙️ Quản lý danh mục"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <Label>Thứ tự sắp xếp</Label>
                <Input type="number" value={courseForm.order} onChange={e => setCourseForm(p => ({ ...p, order: e.target.value }))} placeholder="Thứ tự hiển thị..." />
                <p className="mt-1 text-[10px] text-gray-400">Quyết định thứ tự hiển thị của khóa học trên trang chủ (số nhỏ hơn đứng trước).</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Ảnh Thumbnail</Label>
                <Input value={courseForm.thumbnail} onChange={e => setCourseForm(p => ({ ...p, thumbnail: e.target.value }))} placeholder="URL ảnh" />
                <Input className="mt-2" type="file" accept="image/*" disabled={uploadingField === "course-thumbnail"} onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadContentFile(file, "course-thumbnail"); if (url) setCourseForm(p => ({ ...p, thumbnail: url })); }} />
              </div>
              <div>
                <Label>Màu chủ đạo (Hex)</Label>
                <div className="flex gap-2">
                  <input type="color" value={courseForm.colorTheme.startsWith("#") ? courseForm.colorTheme : `#${courseForm.colorTheme}`} onChange={e => setCourseForm(p => ({ ...p, colorTheme: e.target.value }))} className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-gray-200 p-0.5" />
                  <Input value={courseForm.colorTheme} onChange={e => setCourseForm(p => ({ ...p, colorTheme: e.target.value }))} placeholder="Màu theme (VD: #4361ee)" />
                </div>
              </div>
            </div>
            <div>
              <Label>Mô tả khóa học</Label>
              <Textarea className="min-h-[120px]" value={courseForm.description} onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))} placeholder="Nhập mô tả chi tiết khóa học..." />
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <Button variant="outline" onClick={resetCourseForm} disabled={isSaving}>Hủy</Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveCourse} disabled={isSaving}>{isSaving ? "Đang lưu..." : "Lưu lại"}</Button>
            </div>
          </div>

          {courseForm.id && (() => {
            const courseLessons = content?.lessons.filter(l => String(l.courseId) === String(courseForm.id)) || [];
            return (
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">📚 Danh sách bài học thuộc khóa này ({courseLessons.length})</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 h-8 text-xs font-semibold"
                    onClick={() => {
                      resetLessonForm();
                      setLessonForm(p => ({
                        ...p,
                        courseId: courseForm.id!,
                        id: null,
                        slug: "",
                        title: "",
                        summary: "",
                        content: "",
                        order: "",
                        isFree: true,
                        xpReward: "100",
                        estimatedMinutes: "10",
                        teaserVideoId: "",
                        fullVideoId: ""
                      }));
                      setSources([]);
                      setMicroLessons([]);
                      setSelectedMicroLesson(null);
                      setEditingLessonInCourse({ id: 0, title: "Bài học mới", slug: "", summary: "", content: "", order: 1, isFree: true, courseId: courseForm.id! } as any);
                    }}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Thêm bài học mới
                  </Button>
                </div>

                {courseLessons.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {courseLessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-xs font-bold text-gray-800 truncate">{lesson.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Bài {lesson.order} · {lesson.slug}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-600 hover:text-purple-700 font-bold text-xs h-7 px-2 shrink-0 bg-white shadow-sm border border-gray-100"
                          onClick={async () => {
                            await selectLessonForEdit(lesson);
                            setEditingLessonInCourse(lesson);
                          }}
                        >
                          Sửa slide & Quiz
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Khóa học này chưa có bài học nào. Hãy thêm bài học mới để bắt đầu xây dựng nội dung.</p>
                )}
              </div>
            );
          })()}
        </div>
      );
    }

    if (activeTab === "lessons") {
      if (courseForm.id === null) {
        return (
          <div className="flex h-[300px] flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl text-gray-300">📚</span>
            <p className="mt-3 text-xs font-semibold text-gray-500">Vui lòng chọn một khóa học ở danh sách bên trái để bắt đầu quản lý bài học.</p>
          </div>
        );
      }

      if (editingLessonInCourse !== null) {
        return (
          <div className="space-y-4">
            {renderLessonEditorContent()}
          </div>
        );
      }

      const courseLessons = content?.lessons.filter(l => String(l.courseId) === String(courseForm.id)) || [];
      return (
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Quản lý bài học</p>
            <h2 className="mt-1 text-xl font-bold text-gray-800">Khóa học: {courseForm.title}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">📚 Danh sách bài học ({courseLessons.length})</h3>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs font-semibold"
                onClick={() => {
                  resetLessonForm();
                  setLessonForm(p => ({
                    ...p,
                    courseId: courseForm.id!,
                    id: null,
                    slug: "",
                    title: "",
                    summary: "",
                    content: "",
                    order: "",
                    isFree: true,
                    xpReward: "100",
                    estimatedMinutes: "10",
                    teaserVideoId: "",
                    fullVideoId: ""
                  }));
                  setSources([]);
                  setMicroLessons([]);
                  setSelectedMicroLesson(null);
                  setEditingLessonInCourse({ id: 0, title: "Bài học mới", slug: "", summary: "", content: "", order: 1, isFree: true, courseId: courseForm.id! } as any);
                }}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Thêm bài học mới
              </Button>
            </div>

            {courseLessons.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {courseLessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-gray-800 truncate">{lesson.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Bài {lesson.order} · {lesson.slug}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 font-bold text-xs h-7 px-2 shrink-0 bg-white shadow-sm border border-gray-100"
                      onClick={async () => {
                        await selectLessonForEdit(lesson);
                        setEditingLessonInCourse(lesson);
                      }}
                    >
                      Sửa slide & Quiz
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Khóa học này chưa có bài học nào. Hãy thêm bài học mới để bắt đầu.</p>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === "blogPosts") return (
      <>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">{ADMIN_COPY.editor.blogPosts}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-800">{blogForm.id ? ADMIN_COPY.titles.updateBlogPost : ADMIN_COPY.titles.createBlogPost}</h2>
          </div>
          {blogForm.id ? <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete({ label: blogForm.title, onConfirm: deleteBlog })} disabled={isSaving}><Trash2 className="mr-1.5 h-4 w-4" />{ADMIN_COPY.actions.delete}</Button> : null}
        </div>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Slug</Label><Input value={blogForm.slug} onChange={e => setBlogForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.category}</Label><Input value={blogForm.category} onChange={e => setBlogForm(p => ({ ...p, category: e.target.value }))} /></div>
          </div>
          <div><Label>{ADMIN_COPY.fields.title}</Label><Input value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>{ADMIN_COPY.fields.publishDate}</Label><Input type="date" value={blogForm.date} onChange={e => setBlogForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div><Label>{ADMIN_COPY.fields.readTimeMinutes}</Label><Input type="number" value={blogForm.readTimeMinutes} onChange={e => setBlogForm(p => ({ ...p, readTimeMinutes: e.target.value }))} /></div>
          </div>
          <div><Label>{ADMIN_COPY.fields.shortDescription}</Label><Textarea value={blogForm.excerpt} onChange={e => setBlogForm(p => ({ ...p, excerpt: e.target.value }))} /></div>
          <div><Label>{ADMIN_COPY.fields.content}</Label><Textarea className="min-h-[240px]" value={blogForm.content} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Chèn ảnh vào nội dung</Label><Input type="file" accept="image/*" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadContentFile(file, "blog-image"); if (url) setBlogForm(p => ({ ...p, content: `${p.content}\n\n![Ảnh bài viết](${url})` })); }} /></div>
            <div><Label>Video bài viết</Label><Input value={blogForm.videoUrl} onChange={e => setBlogForm(p => ({ ...p, videoUrl: e.target.value }))} placeholder="URL video" /><Input className="mt-2" type="file" accept="video/*" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadContentFile(file, "blog-video"); if (url) setBlogForm(p => ({ ...p, videoUrl: url })); }} /></div>
          </div>
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
          {quizForm.id ? <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete({ label: quizForm.question.slice(0, 40), onConfirm: deleteQuiz })} disabled={isSaving}><Trash2 className="mr-1.5 h-4 w-4" />{ADMIN_COPY.actions.delete}</Button> : null}
        </div>
        <div className="mt-5 space-y-4">
          <div><Label>Slug</Label><Input value={quizForm.slug} onChange={e => setQuizForm(p => ({ ...p, slug: e.target.value }))} /></div>
          <div><Label>{ADMIN_COPY.fields.question}</Label><Textarea value={quizForm.question} onChange={e => setQuizForm(p => ({ ...p, question: e.target.value }))} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            {quizForm.options.map((opt, idx) => (
              <div key={idx}>
                <Label className="flex items-center gap-2">
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${quizForm.correct === String(idx) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>{String.fromCharCode(65 + idx)}</span>
                  {ADMIN_COPY.fields.option} {String.fromCharCode(65 + idx)}
                  {quizForm.correct === String(idx) && <span className="ml-auto text-[11px] font-semibold text-green-600">✓ Đúng</span>}
                </Label>
                <Input value={opt} onChange={e => setQuizForm(p => ({ ...p, options: p.options.map((o, i) => i === idx ? e.target.value : o) }))} />
              </div>
            ))}
          </div>
          <div>
            <Label>{ADMIN_COPY.fields.correctAnswer}</Label>
            <div className="mt-1.5 flex gap-2">
              {quizForm.options.map((opt, idx) => (
                <button key={idx} type="button"
                  onClick={() => setQuizForm(p => ({ ...p, correct: String(idx) }))}
                  className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-all ${quizForm.correct === String(idx) ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"}`}>
                  {String.fromCharCode(65 + idx)}
                  {opt.trim() && <span className="ml-1 text-[11px] font-normal truncate hidden lg:inline">· {opt.slice(0, 12)}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>{ADMIN_COPY.fields.category}</Label><Input value={quizForm.category} onChange={e => setQuizForm(p => ({ ...p, category: e.target.value }))} /></div>
            <div>
              <Label>{ADMIN_COPY.fields.difficulty}</Label>
              <select value={quizForm.difficulty} onChange={e => setQuizForm(p => ({ ...p, difficulty: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>
          </div>
          <div><Label>{ADMIN_COPY.fields.explanation}</Label><Textarea value={quizForm.explanation} onChange={e => setQuizForm(p => ({ ...p, explanation: e.target.value }))} /></div>
          <label className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"><input type="checkbox" checked={quizForm.active} onChange={e => setQuizForm(p => ({ ...p, active: e.target.checked }))} /><span className="text-sm font-semibold">{ADMIN_COPY.fields.activeQuiz}</span></label>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveQuiz} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
        </div>
      </>
    );

    if (activeTab === "games") {
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">{ADMIN_COPY.editor.games}</p>
              <h2 className="mt-1 text-xl font-bold text-gray-800">{gameForm.id ? ADMIN_COPY.titles.updateGame : ADMIN_COPY.titles.createGame}</h2>
            </div>
            {gameForm.id ? <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete({ label: gameForm.title, onConfirm: deleteGame })} disabled={isSaving}><Trash2 className="mr-1.5 h-4 w-4" />{ADMIN_COPY.actions.delete}</Button> : null}
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
              <div><Label>{ADMIN_COPY.fields.coverImage}</Label><Input value={gameForm.coverImage} onChange={e => setGameForm(p => ({ ...p, coverImage: e.target.value }))} /><Input className="mt-2" type="file" accept="image/*" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadContentFile(file, "game-cover"); if (url) setGameForm(p => ({ ...p, coverImage: url })); }} /></div>
              <div><Label>{ADMIN_COPY.fields.accentColor}</Label><Input value={gameForm.accentColor} onChange={e => setGameForm(p => ({ ...p, accentColor: e.target.value }))} /></div>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"><input type="checkbox" checked={gameForm.published} onChange={e => setGameForm(p => ({ ...p, published: e.target.checked }))} /><span className="text-sm font-semibold">{ADMIN_COPY.fields.publishFrontend}</span></label>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveGame} disabled={isSaving}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
          </div>
        </>
      );
    }

    if (activeTab === "stickers") {
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">NHÃN DÁN & GIF</p>
              <h2 className="mt-1 text-xl font-bold text-gray-800">{stickerForm.id ? "Cập nhật Nhãn dán / GIF" : "Thêm mới Nhãn dán / GIF"}</h2>
            </div>
            {stickerForm.id ? <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete({ label: stickerForm.name, onConfirm: deleteSticker })} disabled={isSaving}><Trash2 className="mr-1.5 h-4 w-4" />{ADMIN_COPY.actions.delete}</Button> : null}
          </div>
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Tên hiển thị</Label><Input value={stickerForm.name} onChange={e => setStickerForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div>
                <Label>Loại</Label>
                <select className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" value={stickerForm.type} onChange={e => setStickerForm(p => ({ ...p, type: e.target.value as "STICKER" | "GIF" }))}>
                  <option value="STICKER">STICKER</option>
                  <option value="GIF">GIF</option>
                </select>
              </div>
            </div>
            <div><Label>Đường dẫn hình ảnh (URL)</Label><Input value={stickerForm.url} onChange={e => setStickerForm(p => ({ ...p, url: e.target.value }))} /><Input className="mt-2" type="file" accept="image/*" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadContentFile(file, "sticker"); if (url) setStickerForm(p => ({ ...p, url })); }} /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Chủ đề (Category)</Label>
                <select className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" value={stickerForm.category} onChange={e => setStickerForm(p => ({ ...p, category: e.target.value }))}>
                  <option value="study">Học tập (study)</option>
                  <option value="motivation">Động lực (motivation)</option>
                  <option value="emotion">Cảm xúc (emotion)</option>
                  <option value="funny">Vui nhộn (funny)</option>
                  <option value="congrats">Chúc mừng (congrats)</option>
                </select>
              </div>
              <div><Label>Từ khóa (phân cách bằng dấu phẩy)</Label><Input value={stickerForm.keywordsString} onChange={e => setStickerForm(p => ({ ...p, keywordsString: e.target.value }))} placeholder="gau, hoc tap, study, cute" /></div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={saveSticker} disabled={isSaving || !stickerForm.name.trim() || !stickerForm.url.trim()}>{isSaving ? ADMIN_COPY.actions.saving : ADMIN_COPY.actions.save}</Button>
          </div>
        </>
      );
    }

    if (activeTab === "reports") {
      if (!selectedReport) {
        return (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <AlertTriangle className="h-12 w-12 opacity-30 mb-2" />
            <p className="text-sm">Chọn một báo cáo vi phạm từ danh sách bên trái để xử lý.</p>
          </div>
        );
      }
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Báo cáo vi phạm</p>
              <h2 className="mt-1 text-xl font-bold text-gray-800">Xử lý báo cáo #{selectedReport.id}</h2>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Nội dung bị báo cáo</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{selectedReport.contentPreview}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Người báo cáo</Label>
                <Input value={selectedReport.reporterName} readOnly className="bg-gray-50 border-gray-100 text-gray-700" />
              </div>
              <div>
                <Label>Thời gian báo cáo</Label>
                <Input value={formatDate(selectedReport.createdAt)} readOnly className="bg-gray-50 border-gray-100 text-gray-700" />
              </div>
            </div>
            <div>
              <Label>Lý do báo cáo</Label>
              <Input value={selectedReport.reason} readOnly className="bg-gray-50 border-gray-100 text-gray-700" />
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
                className="bg-gray-50 border-gray-100 font-semibold text-gray-800"
              />
            </div>
            {selectedReport.status === "PENDING" && (
              <div className="flex items-center gap-3 pt-2">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => void resolveReport(selectedReport.id, true)} disabled={isSaving}>
                  {isSaving ? "Đang xử lý..." : "Xóa nội dung vi phạm"}
                </Button>
                <Button variant="outline" onClick={() => void resolveReport(selectedReport.id, false)} disabled={isSaving}>
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
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <HelpCircle className="h-12 w-12 opacity-30 mb-2" />
            <p className="text-sm">Chọn một câu hỏi ẩn danh từ danh sách bên trái để phản hồi.</p>
          </div>
        );
      }
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Hỏi đáp ẩn danh</p>
              <h2 className="mt-1 text-xl font-bold text-gray-800">Trả lời câu hỏi #{selectedQuestion.id}</h2>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Câu hỏi</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{selectedQuestion.question}</p>
              <p className="mt-2 text-[10px] text-gray-400">Gửi lúc: {formatDate(selectedQuestion.createdAt)}</p>
            </div>
            <div>
              <Label>Nội dung câu trả lời</Label>
              <Textarea
                className="min-h-[120px] rounded-xl"
                placeholder="Nhập câu trả lời của chuyên gia/admin..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => void answerQuestion(selectedQuestion.id)} disabled={isSaving || !answerText.trim()}>
                {isSaving ? "Đang gửi..." : "Gửi câu trả lời"}
              </Button>
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  /* ── Sidebar & main title helpers ── */
  const crudTitle: Record<CrudTab, string> = {
    courses: "Quản lý khóa học",
    lessons: "Quản lý bài học",
    blogPosts: "Quản lý bài viết",
    quizQuestions: "Quản lý Quiz",
    games: "Kho trò chơi",
    stickers: "Nhãn dán & GIF",
    reports: "Báo cáo vi phạm",
    questions: "Câu hỏi ẩn danh"
  };
  const pageTitle = sidebarTab === "overview" ? "Dashboard" : sidebarTab === "students" ? "Học viên" : sidebarTab === "plans" ? "Quản lý gói VIP" : sidebarTab === "discussions" ? "Thảo luận" : sidebarTab === "reports" ? "Báo cáo" : sidebarTab === "settings" ? "Cài đặt" : crudTitle[activeTab];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7fb]">

      {/* ══ SIDEBAR ══ */}
      <aside className="flex w-[208px] shrink-0 flex-col border-r border-gray-100 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-[13px] font-bold tracking-wide text-purple-600">EDUCARE ADMIN</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
          {SIDEBAR_NAV.map(({ id, label, Icon }) => {
            const active = sidebarTab === id;
            const count = id === "lessons" ? content.metrics.lessons
              : id === "blogPosts" ? content.metrics.blogPosts
                : id === "quizQuestions" ? content.metrics.quizQuestions
                  : id === "games" ? content.metrics.games
                    : id === "students" ? dashboard.summary.totalUsers
                      : id === "stickers" ? stickers.length
                        : id === "reports" ? reports.filter(r => r.status === "PENDING").length
                          : id === "questions" ? questions.filter(qs => !qs.answer || qs.answer.trim() === "").length
                            : undefined;
            return (
              <button key={id} onClick={() => handleNav(id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${active ? "bg-purple-600 font-semibold text-white" : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {count !== undefined && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mx-2.5 mb-3 border-t border-gray-100 pt-3">
          <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600">
            <LogOut className="h-3.5 w-3.5" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex min-h-14 items-center gap-4 border-b border-gray-100 bg-white px-5 py-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-500">EDUCare Admin</p>
            <h1 className="text-base font-bold text-gray-800">{pageTitle}</h1>
          </div>
          <button onClick={() => navigate("/")} className="ml-auto flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700">
            <Home className="h-3.5 w-3.5" /> Trang chủ
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

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
              {/* Header */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-gray-800">
                  Quản lý học viên
                  {students && <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-semibold text-gray-500">{students.total}</span>}
                </h1>
              </div>

              {/* Search + filters */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-sm">
                  <Search className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    placeholder="Tìm theo tên, email, username..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                  />
                  {studentSearch && (
                    <button onClick={() => setStudentSearch("")} className="text-gray-400 hover:text-gray-600"><X className="h-3.5 w-3.5" /></button>
                  )}
                </div>

                {/* Plan filter chips */}
                <div className="flex gap-1.5">
                  {(["", "free", "popular", "premium"] as const).map(p => (
                    <button key={p} onClick={() => setStudentPlanFilter(p)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${studentPlanFilter === p ? "bg-purple-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {p === "" ? "Tất cả" : p === "free" ? "Miễn phí" : p === "popular" ? "Popular" : "Premium"}
                    </button>
                  ))}
                </div>

                {/* Role filter */}
                <div className="flex gap-1.5">
                  {(["", "student", "admin"] as const).map(r => (
                    <button key={r} onClick={() => setStudentRoleFilter(r)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${studentRoleFilter === r ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {r === "" ? "Mọi vai trò" : r === "student" ? "Học viên" : "Admin"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                {studentLoading ? (
                  <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Đang tải...</div>
                ) : !students || students.users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Users className="mb-3 h-10 w-10 opacity-30" />
                    <p className="text-sm font-medium">{studentSearch || studentPlanFilter || studentRoleFilter ? "Không tìm thấy kết quả" : "Chưa có học viên"}</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        <th className="px-5 py-3.5 text-left">Học viên</th>
                        <th className="px-5 py-3.5 text-left hidden md:table-cell">Tên đăng nhập</th>
                        <th className="px-5 py-3.5 text-center">Gói</th>
                        <th className="px-5 py-3.5 text-center hidden sm:table-cell">Vai trò</th>
                        <th className="px-5 py-3.5 text-right hidden lg:table-cell">XP</th>
                        <th className="px-5 py-3.5 text-right hidden xl:table-cell">Ngày tạo</th>
                        <th className="px-5 py-3.5 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {students.users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600 text-sm">
                                {u.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-800">{u.fullName}</p>
                                <p className="truncate text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs">@{u.username}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${u.plan === "premium" ? "bg-amber-50 text-amber-600" :
                              u.plan === "popular" ? "bg-blue-50 text-blue-600" :
                                "bg-green-50 text-green-600"
                              }`}>{planLabel(u.plan)}</span>
                          </td>
                          <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>
                              {u.role === "admin" ? "Admin" : "Học viên"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right hidden lg:table-cell font-semibold text-gray-700">{u.xp}</td>
                          <td className="px-5 py-3.5 text-right hidden xl:table-cell text-xs text-gray-400">{formatDate(u.createdAt)}</td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditUser(u)}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                Sửa
                              </button>
                              <button onClick={() => void deleteUserById(u.id, u.fullName)}
                                className="rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── VIP PLANS ── */}
          {sidebarTab === "plans" && (
            <div>
              {/* Header */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Quản lý gói VIP
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-600 border border-purple-100">
                    {plansList.length}
                  </span>
                </h1>
                <Button
                  onClick={() => {
                    resetPlanForm();
                    setEditPlanObj(null);
                    setShowPlanModal(true);
                  }}
                  className="rounded-xl bg-purple-600 font-bold text-xs text-white hover:bg-purple-700 flex items-center gap-1 h-9 px-3.5 shadow-sm active:scale-[0.98] transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Thêm gói cước mới
                </Button>
              </div>

              {/* Table */}
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                {plansLoading ? (
                  <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Đang tải...</div>
                ) : plansList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Trophy className="mb-3 h-10 w-10 opacity-30 text-purple-500" />
                    <p className="text-sm font-medium">Chưa cấu hình gói cước nào</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50/50">
                        <th className="px-5 py-3.5 text-left">Mã gói cước</th>
                        <th className="px-5 py-3.5 text-left">Tên gói cước</th>
                        <th className="px-5 py-3.5 text-left">Giá cước</th>
                        <th className="px-5 py-3.5 text-left">Thời hạn (Ngày)</th>
                        <th className="px-5 py-3.5 text-left">Phân loại</th>
                        <th className="px-5 py-3.5 text-center">Trạng thái</th>
                        <th className="px-5 py-3.5 text-left">Mô tả</th>
                        <th className="px-5 py-3.5 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {plansList.map((plan) => (
                        <tr key={plan.id} className="text-gray-700 hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 font-bold text-gray-900 text-xs">{plan.id}</td>
                          <td className="px-5 py-4 font-semibold text-gray-800">{plan.name}</td>
                          <td className="px-5 py-4 font-extrabold text-purple-700">
                            {plan.price === 0 ? "Miễn phí" : `${Number(plan.price).toLocaleString("vi-VN")}đ`}
                          </td>
                          <td className="px-5 py-4 font-medium text-slate-600">{plan.durationDays} ngày</td>
                          <td className="px-5 py-4 text-left">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${plan.planType === 'TRIAL'
                                ? "bg-violet-50 text-violet-600 border border-violet-100"
                                : plan.planType === 'PROMOTION'
                                  ? "bg-amber-50 text-amber-600 border border-amber-100"
                                  : "bg-blue-50 text-blue-600 border border-blue-100"
                              }`}>
                              {plan.planType === 'TRIAL'
                                ? "Dùng thử"
                                : plan.planType === 'PROMOTION'
                                  ? "Khuyến mãi"
                                  : "Đăng ký mua"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${plan.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-500 border border-gray-200"
                              }`}>
                              {plan.active ? "Đang chạy" : "Đã ẩn"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500 max-w-xs truncate" title={plan.description || ""}>
                            {plan.description || "—"}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditPlan(plan)}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeletePlan(plan.id)}
                                className="rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── EDIT USER MODAL ── */}
          {editUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">Chỉnh sửa học viên</p>
                    <h2 className="mt-1 text-lg font-bold text-gray-800">{editUser.fullName}</h2>
                    <p className="text-xs text-gray-500">{editUser.email}</p>
                  </div>
                  <button onClick={() => setEditUser(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
                </div>

                {/* Stats row */}
                <div className="mb-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "XP", value: editUser.xp },
                    { label: "Streak", value: editUser.streak },
                    { label: "Quiz Score", value: editUser.quizScore },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-gray-50 px-3 py-2 text-center">
                      <p className="text-base font-bold text-gray-800">{s.value}</p>
                      <p className="text-[11px] text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Gói tài khoản</Label>
                    <select value={editPlan} onChange={e => setEditPlan(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                      <option value="free">Miễn phí (Free)</option>
                      <option value="popular">Popular</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div>
                    <Label>Vai trò</Label>
                    <select value={editRole} onChange={e => setEditRole(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100">
                      <option value="student">Học viên (Student)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button variant="outline" className="flex-1" onClick={() => setEditUser(null)} disabled={userSaving}>Hủy</Button>
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white" onClick={saveUser} disabled={userSaving}>
                      {userSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PLAN CRUD MODAL ── */}
          {showPlanModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-155">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">
                      {editPlanObj ? "Chỉnh sửa gói VIP" : "Thêm gói cước VIP mới"}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-gray-800">
                      {editPlanObj ? editPlanObj.name : "Thông tin gói cước"}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowPlanModal(false);
                      setEditPlanObj(null);
                      resetPlanForm();
                    }}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePlan} className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold">Mã gói cước (Plan ID) *</Label>
                    <Input
                      placeholder="Ví dụ: VIP_3M, VIP_2Y"
                      value={planForm.id}
                      onChange={(e) => setPlanForm({ ...planForm, id: e.target.value })}
                      disabled={!!editPlanObj}
                      className="mt-1 rounded-xl focus:ring-purple-500/20"
                      required
                    />
                    {!editPlanObj && (
                      <p className="text-[10px] text-gray-400 mt-1 italic">
                        * Lưu ý: Mã ID này là duy nhất và không thể thay đổi sau khi tạo.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Tên gói cước hiển thị *</Label>
                    <Input
                      placeholder="Ví dụ: Học viên VIP 3 Tháng"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      className="mt-1 rounded-xl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-semibold">Giá cước (VNĐ) *</Label>
                      <Input
                        type="number"
                        placeholder="Ví dụ: 79000"
                        value={planForm.price}
                        onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                        className="mt-1 rounded-xl"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold">Số ngày hiệu lực *</Label>
                      <Input
                        type="number"
                        placeholder="Ví dụ: 90"
                        value={planForm.durationDays}
                        onChange={(e) => setPlanForm({ ...planForm, durationDays: e.target.value })}
                        className="mt-1 rounded-xl"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Trạng thái hoạt động *</Label>
                    <select
                      value={planForm.active ? "true" : "false"}
                      onChange={(e) => setPlanForm({ ...planForm, active: e.target.value === "true" })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="true">Bật (Hoạt động & hiển thị trên bảng giá)</option>
                      <option value="false">Tắt (Ẩn khỏi bảng giá & ngừng cho dùng thử)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Phân loại gói cước *</Label>
                    <select
                      value={planForm.planType}
                      onChange={(e) => setPlanForm({ ...planForm, planType: e.target.value as any })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="REGULAR">Gói cước đăng ký mua (REGULAR)</option>
                      <option value="TRIAL">Gói dùng thử tự động (TRIAL)</option>
                      <option value="PROMOTION">Gói khuyến mãi đặc biệt (PROMOTION)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold">Bắt đầu ưu đãi (Tùy chọn)</Label>
                      <Input
                        type="datetime-local"
                        value={planForm.startDate}
                        onChange={(e) => setPlanForm({ ...planForm, startDate: e.target.value })}
                        onClick={(e) => {
                          try {
                            e.currentTarget.showPicker();
                          } catch (err) { }
                        }}
                        className="mt-1 rounded-xl text-xs cursor-pointer"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold">Kết thúc ưu đãi (Tùy chọn)</Label>
                      <Input
                        type="datetime-local"
                        value={planForm.endDate}
                        onChange={(e) => setPlanForm({ ...planForm, endDate: e.target.value })}
                        onClick={(e) => {
                          try {
                            e.currentTarget.showPicker();
                          } catch (err) { }
                        }}
                        className="mt-1 rounded-xl text-xs cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Mô tả chi tiết</Label>
                    <Textarea
                      placeholder="Nhập mô tả các tính năng hoặc ưu đãi đi kèm của gói cước này..."
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      className="mt-1 rounded-xl min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 rounded-xl h-10 text-xs font-bold"
                      onClick={() => {
                        setShowPlanModal(false);
                        setEditPlanObj(null);
                        resetPlanForm();
                      }}
                      disabled={isSaving}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 text-xs font-bold"
                      disabled={isSaving}
                    >
                      {isSaving ? "Đang lưu..." : (editPlanObj ? "Lưu thay đổi" : "Tạo gói cước")}
                    </Button>
                  </div>
                </form>
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
          {sidebarTab === "settings" && (
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
                {activeTab !== "reports" && activeTab !== "questions" && (
                  <div className="flex items-center gap-2">
                    {activeTab === "courses" && (
                      <Button
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 h-9 text-xs font-semibold"
                        onClick={() => setShowImportModal(true)}
                      >
                        📥 Nhập từ file JSON
                      </Button>
                    )}
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white h-9 text-xs font-semibold" onClick={createNew}>
                      <Plus className="mr-1.5 h-4 w-4" />Tạo mới
                    </Button>
                  </div>
                )}
              </div>
              {/* If we are editing a lesson, we hide the left list panel to maximize editing workspace based on collapsed state */}
              {(() => {
                const isEditingLesson = (activeTab === "courses" || activeTab === "lessons") && editingLessonInCourse !== null;
                const shouldHideListPanel = isEditingLesson && isListPanelCollapsed;
                return (
                  <div className={`grid gap-5 ${shouldHideListPanel ? "grid-cols-1" : "lg:grid-cols-[340px_minmax(0,1fr)]"}`}>
                    {/* List panel */}
                    {!shouldHideListPanel && (
                      <div className="flex flex-col rounded-2xl bg-white shadow-sm overflow-hidden">
                        {/* Search */}
                        <div className="border-b border-gray-100 px-4 py-3 space-y-2">
                          {activeTab === "lessons" && (
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lọc theo khóa học</span>
                              <select
                                value={selectedCourseFilter}
                                onChange={e => {
                                  setSelectedCourseFilter(e.target.value);
                                  setListSearch("");
                                }}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-purple-400"
                              >
                                <option value="all">-- Tất cả khóa học --</option>
                                {courses.map(c => (
                                  <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                            <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            <input
                              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                              placeholder="Tìm kiếm..."
                              value={listSearch}
                              onChange={e => setListSearch(e.target.value)}
                            />
                            {listSearch && (
                              <button onClick={() => setListSearch("")} className="text-gray-400 hover:text-gray-600">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="mt-2 text-[11px] text-gray-400">
                            {(activeTab === "courses" || activeTab === "lessons") ? (
                              editingLessonInCourse !== null ? (
                                `${(content?.lessons.filter(l => String(l.courseId) === String(courseForm.id)) || []).length} bài học`
                              ) : `${filteredCourses.length} khóa học`
                            ) : activeTab === "blogPosts" ? `${filteredPosts.length} bài viết`
                              : activeTab === "quizQuestions" ? `${filteredQuiz.length} câu hỏi`
                                : activeTab === "stickers" ? `${filteredStickers.length} nhãn dán`
                                  : activeTab === "reports" ? `${filteredReports.length} báo cáo`
                                    : activeTab === "questions" ? `${filteredQuestions.length} câu hỏi`
                                      : `${filteredGames.length} mục`}
                          </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[calc(100vh-260px)]">{renderList()}</div>
                      </div>
                    )}
                    {/* Editor panel */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm max-h-[calc(100vh-180px)] overflow-y-auto">{renderEditor()}</div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── CONFIRM DELETE MODAL ── */}
          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-800">Xác nhận xóa</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Bạn có chắc muốn xóa <span className="font-semibold text-gray-700">"{confirmDelete.label}"</span>? Hành động này không thể hoàn tác.
                </p>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Hủy</Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => { confirmDelete.onConfirm(); setConfirmDelete(null); }}>
                    <Trash2 className="mr-1.5 h-4 w-4" />Xóa
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── CREATE NEW CATEGORY MODAL ── */}
          {showNewCategoryModal && (() => {
            const PRESET_COLORS = [
              { value: "#f77f00", label: "Cam rực rỡ" },
              { value: "#4361ee", label: "Xanh dương" },
              { value: "#06d6a0", label: "Xanh ngọc" },
              { value: "#7209b7", label: "Tím hoàng hôn" },
              { value: "#ff5d8f", label: "Hồng ngọt" },
              { value: "#ef476f", label: "Đỏ san hô" },
              { value: "#8338ec", label: "Tím oải hương" },
              { value: "#ffd166", label: "Vàng nắng" }
            ];

            const PRESET_ICONS = [
              { name: "Compass", label: "La bàn" },
              { name: "ShieldCheck", label: "Khiên bảo vệ" },
              { name: "HelpCircle", label: "Thắc mắc" },
              { name: "Lock", label: "Bảo mật" },
              { name: "Heart", label: "Trái tim" },
              { name: "BookOpen", label: "Sách mở" },
              { name: "Smile", label: "Nụ cười" },
              { name: "Trophy", label: "Cúp" },
              { name: "MessageSquare", label: "Giao tiếp" },
              { name: "Users", label: "Nhóm bạn" },
              { name: "Award", label: "Khen thưởng" },
              { name: "Flame", label: "Năng lượng" },
              { name: "EyeOff", label: "Riêng tư" },
              { name: "Handshake", label: "Đồng thuận" },
              { name: "HeartHandshake", label: "Tin cậy" }
            ];

            return (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {editingCategory ? "Cập nhật các thông tin hiển thị của danh mục" : "Tạo một danh mục phân loại khóa học mới"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Tên danh mục *</Label>
                      <Input
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        placeholder="VD: 🧠 Cảm xúc & Stress"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Đường dẫn tĩnh (Slug) *</Label>
                      <Input
                        value={newCategorySlug}
                        onChange={e => setNewCategorySlug(e.target.value)}
                        placeholder="VD: cam-xuc-stress"
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Chọn biểu tượng (Icon) *</Label>
                      <div className="grid grid-cols-5 gap-1.5 mt-1 border border-gray-100 p-2 rounded-xl bg-gray-50/50 max-h-[140px] overflow-y-auto">
                        {PRESET_ICONS.map(ico => {
                          const isSelected = newCategoryIcon === ico.name;
                          return (
                            <button
                              key={ico.name}
                              type="button"
                              onClick={() => setNewCategoryIcon(ico.name)}
                              className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-xs gap-1 transition-all ${isSelected ? "border-purple-600 bg-purple-50 text-purple-700 font-semibold" : "border-transparent bg-white hover:border-gray-200 hover:bg-gray-50 text-gray-400"}`}
                              title={ico.label}
                            >
                              {renderPresetIcon(ico.name)}
                              <span className="text-[8px] truncate max-w-full scale-90">{ico.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Chọn màu chủ đạo (Color) *</Label>
                      <div className="flex flex-wrap items-center gap-2 mt-1 border border-gray-100 p-2.5 rounded-xl bg-gray-50/50">
                        {PRESET_COLORS.map(c => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setNewCategoryColor(c.value)}
                            className={`h-6 w-6 rounded-full border-2 transition-all shrink-0 ${newCategoryColor === c.value ? "border-purple-600 scale-110 shadow-sm" : "border-transparent"}`}
                            style={{ backgroundColor: c.value }}
                            title={c.label}
                          />
                        ))}
                        <div className="h-6 w-px bg-gray-200 mx-1" />
                        <input
                          type="color"
                          value={newCategoryColor}
                          onChange={e => setNewCategoryColor(e.target.value)}
                          className="h-6 w-6 cursor-pointer rounded-full border border-gray-200 p-0.5 shrink-0"
                          title="Tùy chọn màu khác"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setShowNewCategoryModal(false);
                        setNewCategoryName("");
                        setNewCategorySlug("");
                        setNewCategoryIcon("HelpCircle");
                        setNewCategoryColor("#4361ee");
                        setEditingCategory(null);
                        setCourseForm(p => ({ ...p, categoryId: p.categoryId === "NEW_CATEGORY" ? "1" : p.categoryId }));
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleCreateCategory}
                      disabled={isSaving}
                    >
                      {isSaving ? "Đang lưu..." : (editingCategory ? "Lưu thay đổi" : "Tạo danh mục")}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── CATEGORY MANAGER MODAL ── */}
          {showCategoryManagerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Quản lý danh mục</h3>
                    <p className="text-xs text-gray-400">Danh sách các danh mục phân loại khóa học hiện tại</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1"
                    onClick={() => {
                      startAddCategory();
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Thêm danh mục
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-[250px] max-h-[50vh] pr-1">
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                          <th className="p-3 w-16">Màu & Icon</th>
                          <th className="p-3">Tên danh mục</th>
                          <th className="p-3">Slug</th>
                          <th className="p-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {categories.map(cat => (
                          <tr key={cat.id} className="hover:bg-gray-50/50">
                            <td className="p-3">
                              <span
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
                                style={{ backgroundColor: cat.colorTheme || "#4361ee" }}
                              >
                                {renderPresetIcon(cat.icon || "HelpCircle")}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-gray-800">{cat.name}</td>
                            <td className="p-3 text-gray-400 font-mono text-[10px]">{cat.slug}</td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => startEditCategory(cat)}
                                className="text-purple-600 hover:text-purple-800 font-semibold text-xs transition-colors"
                              >
                                Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                className="text-red-600 hover:text-red-800 font-semibold text-xs transition-colors"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-gray-100 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setShowCategoryManagerModal(false)}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── IMPORT COURSE JSON MODAL ── */}
          {showImportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
                <div className="border-b border-gray-100 pb-3 shrink-0">
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
                    📥 Nhập cấu trúc Khóa học từ JSON
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Dán dữ liệu cấu trúc khóa học (Khóa học, bài học, chương nhỏ và slide) dạng JSON do AI tạo ra để tự động nhập dữ liệu vào hệ thống.
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Dán mã JSON khóa học *</Label>
                    <Textarea
                      value={importJsonText}
                      onChange={e => setImportJsonText(e.target.value)}
                      placeholder={`{\n  "title": "Khóa học Giáo dục Giới tính mới",\n  "description": "Mô tả khóa học...",\n  "colorTheme": "#7c3aed",\n  "lessons": [\n    {\n      "title": "Bài học 1: Đồng thuận là gì?",\n      "slug": "dong-thuan-la-gi",\n      "xpReward": 10,\n      "estimatedMinutes": 10,\n      "microLessons": [\n        {\n          "title": "Chương 1: Khởi động",\n          "blocks": [\n            {\n              "blockType": "hook",\n              "contentJson": {\n                "title": "Chào mừng bạn"\n              }\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}`}
                      className="font-mono text-[10px] min-h-[400px] rounded-xl border-gray-250 leading-normal"
                      disabled={isImporting}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">Gán vào Danh mục (Tùy chọn)</Label>
                      <select
                        value={selectedImportCategoryId}
                        onChange={e => setSelectedImportCategoryId(e.target.value)}
                        className="w-full mt-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-purple-400"
                        disabled={isImporting}
                      >
                        <option value="">-- Giữ nguyên hoặc không chọn --</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <p className="text-[10px] text-gray-400 italic">
                        * Mẹo: Bạn có thể sao chép toàn bộ dữ liệu cấu trúc khóa học do AI tạo ra và dán vào đây để khởi tạo tức thì toàn bộ bài học và các trò chơi đi kèm.
                      </p>
                    </div>
                  </div>

                  {isImporting && (
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-2 animate-pulse">
                      <div className="flex items-center gap-2">
                        <span className="animate-spin text-purple-600 text-xs">🌀</span>
                        <p className="text-xs font-bold text-purple-800">Đang tiến hành nhập dữ liệu...</p>
                      </div>
                      <p className="text-[10px] text-purple-600 font-mono">{importProgress}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setShowImportModal(false);
                      setImportJsonText("");
                      setSelectedImportCategoryId("");
                    }}
                    disabled={isImporting}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    onClick={handleImportCourse}
                    disabled={isImporting}
                  >
                    {isImporting ? "Đang nhập dữ liệu..." : "Bắt đầu nhập khóa học"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── FLOATING SIDEBAR TOGGLE DRAWER HANDLE ── */}
          {(() => {
            const isEditingLesson = (activeTab === "courses" || activeTab === "lessons") && editingLessonInCourse !== null;
            if (!isEditingLesson) return null;
            return (
              <button
                type="button"
                onClick={() => setIsListPanelCollapsed(!isListPanelCollapsed)}
                className="fixed left-[220px] top-[45%] z-50 flex h-14 w-8 items-center justify-center rounded-r-2xl bg-purple-600 text-white shadow-xl hover:bg-purple-700 transition-all border-y border-r border-purple-500 cursor-pointer focus:outline-none hover:w-9"
                title={isListPanelCollapsed ? "Hiện danh sách khóa học" : "Ẩn danh sách khóa học"}
              >
                {isListPanelCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
