import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const GamesPage = lazy(() => import("./pages/GamesPage"));
const FlashLightRunPage = lazy(() => import("./pages/FlashLightRunPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const CertificatePage = lazy(() => import("./pages/CertificatePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ChatRoomsPage = lazy(() => import("./pages/ChatRoomsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const PaymentCallbackPage = lazy(() => import("./pages/PaymentCallbackPage"));
const VideoGalleryPage = lazy(() => import("./pages/VideoGalleryPage"));
const MythBusterPage = lazy(() => import("./pages/MythBusterPage"));
const SafeSwipePage = lazy(() => import("./pages/SafeSwipePage"));
const ChatDetectivePage = lazy(() => import("./pages/ChatDetectivePage"));
const RedFlagHuntPage = lazy(() => import("./pages/RedFlagHuntPage"));
const EmotionSortPage = lazy(() => import("./pages/EmotionSortPage"));
const TeenPathPage = lazy(() => import("./pages/TeenPathPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function UserDashboardRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isAdmin) return <Navigate to="/domain/dashboard" replace />;

  return <DashboardPage />;
}

function AdminDashboardRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen" />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  return <AdminDashboardPage />;
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/domain");

  return (
    <div className="flex min-h-screen flex-col w-full max-w-full overflow-x-hidden">
      {isAdminRoute ? null : <Navbar />}
      <main className="theme-content flex-1 w-full max-w-full overflow-x-hidden">
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground" role="status">
                Đang tải nội dung...
              </div>
            }
          >
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/quiz" element={<QuizPage />} />
          <Route path="/games/flash-light-run" element={<FlashLightRunPage />} />
          <Route path="/games/myth-buster" element={<MythBusterPage />} />
          <Route path="/games/safe-swipe" element={<SafeSwipePage />} />
          <Route path="/games/chat-detective" element={<ChatDetectivePage />} />
          <Route path="/games/red-flag-hunt" element={<RedFlagHuntPage />} />
          <Route path="/games/emotion-sort" element={<EmotionSortPage />} />
          <Route path="/games/teen-path" element={<TeenPathPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment/callback" element={<PaymentCallbackPage />} />
          <Route path="/videos" element={<VideoGalleryPage />} />
          <Route path="/leaderboard" element={<Navigate to="/community/leaderboard" replace />} />
          <Route path="/dashboard" element={<UserDashboardRoute />} />
          <Route path="/domain/dashboard" element={<AdminDashboardRoute />} />
          <Route path="/certificate" element={<CertificatePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/leaderboard" element={<LeaderboardPage />} />
          <Route path="/community/chat" element={<ChatRoomsPage />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      {isAdminRoute ? null : <Footer />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppShell />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
