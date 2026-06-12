export type UserPlan = "free" | "popular" | "premium";
export type UserRole = "student" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  age: number;
  plan: UserPlan;
  xp: number;
  streak: number;
  quizScore: number;
  avatar: string | null;
  role: UserRole;
  isAdmin: boolean;
  completedLessons: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface ProgressResponse {
  user: User;
  awardedXp: number;
}

export type MicroLessonBlock = {
  id: number;
  blockType: "hook" | "explanation" | "scenario" | "interaction" | "reflection" | "takeaway" | "sorting" | "flashcard" | "scenario-choice" | "matching" | "fill-blank";
  contentJson: string;       // backend trả string JSON (mình map kiểu String ở entity)
  orderIndex: number;
};

export type MicroLesson = {
  id: number;
  title: string;
  order: number;             // microOrder bên backend
  completed?: boolean;
  blocks: MicroLessonBlock[];
};

export interface LessonSource {
  id: number;
  sourceName: string;
  sourceUrl: string;
  sourceType?: string | null;
}

export type Lesson = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  order: number;
  isFree: boolean;

  // new fields
  courseId: number | null;
  xpReward: number;
  estimatedMinutes: number;
  microLessons: MicroLesson[];
  courseColorTheme?: string | null;
  sources?: LessonSource[];
};

export interface RecommendQuestion {
  id: number;
  emoji: string;
  question: string;
  reason: string;
  targetTag: string | null;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  colorTheme: string;
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  colorTheme: string | null;
  order: number | null;
  lessons: Lesson[];
  enrolled?: boolean;
  category: Category | null;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  emoji: string;
}

export interface Game {
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
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizPlayQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
  difficulty: string;
}

export interface QuizSessionResponse {
  mode: "quick" | "long";
  totalQuestions: number;
  questions: QuizPlayQuestion[];
}

export interface QuizSubmitAnswer {
  questionId: number;
  selectedIndex: number | null;
}

export interface QuizReview {
  questionId: number;
  question: string;
  selectedIndex: number | null;
  correctIndex: number;
  explanation: string;
}

export interface QuizResultResponse {
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  awardedXp: number;
  streak: number;
  quizScore: number;
  reviews: QuizReview[];
  user: User | null;
}

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardResponse {
  summary: {
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    xp: number;
    streak: number;
    quizScore: number;
    plan: UserPlan;
  };
  recentLessons: Array<{
    slug: string;
    title: string;
    order: number;
    completedAt: string | null;
  }>;
  nextLesson: {
    slug: string;
    title: string;
    order: number;
    isFree: boolean;
  } | null;
  notifications: NotificationItem[];
}

export interface AdminDashboardResponse {
  summary: {
    totalUsers: number;
    totalAdmins: number;
    premiumUsers: number;
    averageXp: number;
    lessonCompletions: number;
    communityPosts: number;
    anonymousQuestions: number;
    totalQuizQuestions: number;
    totalGames: number;
    totalQuizAttempts: number;
  };
  recentUsers: Array<{
    id: string;
    fullName: string;
    email: string;
    username: string;
    plan: UserPlan;
    role: UserRole;
    xp: number;
    createdAt: string;
  }>;
  planDistribution: Array<{
    plan: UserPlan;
    total: number;
  }>;
  lessonCompletion: Array<{
    slug: string;
    title: string;
    total: number;
  }>;
  chatRooms: Array<{
    slug: string;
    name: string;
    messageCount: number;
  }>;
}

export interface AdminQuizQuestion {
  id: number;
  slug: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: string;
  active: boolean;
}

export interface AdminContentResponse {
  metrics: {
    lessons: number;
    blogPosts: number;
    quizQuestions: number;
    games: number;
  };
  lessons: Lesson[];
  blogPosts: BlogPost[];
  quizQuestions: AdminQuizQuestion[];
  games: Game[];
}

export interface LessonUpsertRequest {
  slug: string;
  title: string;
  summary: string;
  content: string;
  order: number | null;
  isFree: boolean;
}

export interface BlogPostUpsertRequest {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTimeMinutes: number;
  emoji: string;
}

export interface QuizQuestionUpsertRequest {
  slug: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: string;
  active: boolean;
}

export interface GameUpsertRequest {
  slug: string;
  title: string;
  summary: string;
  description: string;
  gameType: string;
  playPath: string;
  coverImage: string;
  accentColor: string;
  published: boolean;
}

export interface CommunityReply {
  id: number;
  author: string;
  authorId: string | null;
  content: string;
  anonymous: boolean;
  likes: number;
  liked: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: number;
  author: string;
  authorId: string | null;
  content: string;
  anonymous: boolean;
  likes: number;
  liked: boolean;
  createdAt: string;
  replies: CommunityReply[];
}

export interface ChatRoom {
  id: number;
  slug: string;
  name: string;
  description: string;
  messageCount: number;
}

export interface ChatMessage {
  id: number;
  author: string;
  authorId: string | null;
  content: string;
  createdAt: string;
}

export interface AnonymousQuestion {
  id: number;
  question: string;
  answer: string;
  likes: number;
  liked: boolean;
  createdAt: string;
}

export interface MoodEntry {
  id: number;
  moodCode: "HAPPY" | "OKAY" | "NEUTRAL" | "SAD" | "ANXIOUS";
  note: string | null;
  entryDate: string;
}

export interface LeaderboardResponse {
  entries: Array<{
    name: string;
    xp: number;
    streak: number;
    quizScore: number;
    avatar: string;
  }>;
}
