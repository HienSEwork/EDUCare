import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import LessonPage from "./pages/LessonPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import GamesPage from "./pages/GamesPage";
import FlashLightRunPage from "./pages/FlashLightRunPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import QuizPage from "./pages/QuizPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CertificatePage from "./pages/CertificatePage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CommunityPage from "./pages/CommunityPage";
import ChatRoomsPage from "./pages/ChatRoomsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function UserDashboardRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isAdmin) return <Navigate to="/admin/dashboard" replace />;

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
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {isAdminRoute ? null : <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/quiz" element={<QuizPage />} />
          <Route path="/games/flash-light-run" element={<FlashLightRunPage />} />
          <Route path="/pricing" element={<Navigate to="/courses" replace />} />
          <Route path="/leaderboard" element={<Navigate to="/community/leaderboard" replace />} />
          <Route path="/dashboard" element={<UserDashboardRoute />} />
          <Route path="/admin/dashboard" element={<AdminDashboardRoute />} />
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
      </main>
      {isAdminRoute ? null : <Footer />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
