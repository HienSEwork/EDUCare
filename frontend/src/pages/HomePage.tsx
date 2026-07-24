import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { apiRequest } from "@/lib/api/client";
import type { Course, BlogPost, LeaderboardResponse } from "@/types/api";
import MoodTracker from "@/components/MoodTracker";
import AnonymousQuestionBox from "@/components/AnonymousQuestionBox";
import RandomAdvice from "@/components/RandomAdvice";
import NotebookCourseCard from "@/components/NotebookCourseCard";

import imgTeenFriends from "@/assets/home/teen-friends.jpg";
import imgStudyDesk from "@/assets/home/study-desk.jpg";
import imgNatureCalm from "@/assets/home/nature-calm.jpg";
import imgAvatarGirl1 from "@/assets/home/avatar-girl1.jpg";
import imgAvatarBoy1 from "@/assets/home/avatar-boy1.jpg";
import imgAvatarGirl2 from "@/assets/home/avatar-girl2.jpg";
import imgAvatarBoy2 from "@/assets/home/avatar-boy2.jpg";
import imgAvatarGirl3 from "@/assets/home/avatar-girl3.jpg";
import imgAvatarGirl4 from "@/assets/home/avatar-girl4.jpg";
import imgAvatarBoy3 from "@/assets/home/avatar-boy3.jpg";
import imgAvatarGirl5 from "@/assets/home/avatar-girl5.jpg";

// Real FPT student assets
import imgFptHero from "@/assets/home/ImageBanner3.jpg";
import imgFptFriends from "@/assets/home/ImageBanner2.png";
import imgFptDiscuss from "@/assets/home/ImageBanner1.webp";
import imgFptConsent from "@/assets/home/ImageBanner4.webp";
import imgLogo from "@/assets/home/Logo.png";

// Game 3D graphics
import imgGameSafeSwipe from "@/assets/games/safe-swipe-3d.png";
import imgGameRedFlag from "@/assets/games/red-flag-hunt-3d.png";
import imgGameChatDetective from "@/assets/games/chat-detective-3d.png";

/* ── Shared animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ── Golden Highlight Feature Row Data (Monochrome Icons) ── */
const featureHighlights = [
  { icon: Star, title: "Học mọi lúc", subtitle: "mọi nơi!" },
  { icon: BookOpen, title: "Nội dung chất lượng", subtitle: "chọn lọc kỹ càng" },
  { icon: Users, title: "Cộng đồng tích cực", subtitle: "hỗ trợ 24/7" },
  { icon: Target, title: "Lộ trình cá nhân hóa", subtitle: "dành riêng cho bạn" },
  { icon: ShieldCheck, title: "Chứng chỉ uy tín", subtitle: "gia tăng giá trị" },
  { icon: Award, title: "Thưởng & huy hiệu", subtitle: "khi hoàn thành" },
];

/* ── 5 Category Cards Data (Monochrome Outline Icons) ── */
const categoryCards = [
  { title: "Kỹ năng nền tảng", count: "1.2K+ học viên", theme: "cat-card-purple", icon: BookOpen },
  { title: "Tư duy & sáng tạo", count: "950+ học viên", theme: "cat-card-blue", icon: Zap },
  { title: "Phát triển bản thân", count: "1.5K+ học viên", theme: "cat-card-emerald", icon: Users },
  { title: "Kiến thức tổng hợp", count: "2.2K+ học viên", theme: "cat-card-rose", icon: Target },
  { title: "Thử thách & thi đấu", count: "1.1K+ học viên", theme: "cat-card-amber", icon: Trophy },
];

/* ── 5-Step Roadmap Data (Monochrome Outline Icons) ── */
const roadmapSteps = [
  { num: 1, title: "Khám phá", desc: "Tìm kiếm chủ đề bạn quan tâm", icon: Search, color: "from-purple-600/80 to-indigo-800/80" },
  { num: 2, title: "Lựa chọn", desc: "Chọn khóa học phù hợp với mục tiêu", icon: BookOpen, color: "from-indigo-600/80 to-blue-800/80" },
  { num: 3, title: "Học tập", desc: "Học mọi lúc nơi với nội dung chất lượng", icon: GraduationCap, color: "from-blue-600/80 to-cyan-800/80" },
  { num: 4, title: "Thực hành", desc: "Áp dụng kiến thức vào thực tế", icon: Award, color: "from-teal-600/80 to-emerald-800/80" },
  { num: 5, title: "Tỏa sáng", desc: "Hoàn thành mục tiêu và phát triển bản thân", icon: Sparkles, color: "from-amber-500/80 to-yellow-700/80" },
];

/* ── Course cards ── */
const courses = [
  { title: "Cơ thể & Tuổi dậy thì", badge: "HOT", rating: "4.9", count: "1.5K học viên", img: imgFptDiscuss },
  { title: "Đồng thuận F.R.I.E.S là gì?", badge: "MỚI", rating: "4.9", count: "840 học viên", img: imgFptConsent },
  { title: "An toàn khi hẹn hò", badge: "HOT", rating: "4.8", count: "1.7K học viên", img: imgFptFriends },
];

/* ── Community Hot Discussions ── */
const hotDiscussions = [
  { title: "Làm sao để giữ động lực học tập mỗi ngày?", author: "Minh Anh", time: "2 giờ trước", comments: 128, avatar: imgAvatarGirl1 },
  { title: "Bí quyết học tập hiệu quả tuổi dậy thì", author: "Hoàng Nam", time: "5 giờ trước", comments: 96, avatar: imgAvatarBoy1 },
  { title: "Kinh nghiệm quản lý thời gian và cảm xúc cá nhân", author: "Thanh Trúc", time: "1 ngày trước", comments: 73, avatar: imgAvatarGirl2 },
];

/* ── Testimonials ── */
const testimonials = [
  { name: "Khánh Linh", role: "Sinh viên", stars: 5, text: "Các khóa học rất chất lượng, dễ hiểu và ứng dụng được ngay. Cộng đồng hỗ trợ nhiệt tình, mình tiến bộ hơn mỗi ngày!", avatar: imgAvatarGirl3 },
  { name: "Minh Quân", role: "Học sinh lớp 11", stars: 5, text: "Nội dung thực tế, giảng viên tận tâm và lộ trình học rõ ràng. Mình đã phát triển được nhiều kỹ năng mới.", avatar: imgAvatarBoy3 },
  { name: "Thảo Vy", role: "Freelancer", stars: 5, text: "Môi trường cảm hứng tuyệt vời! Mình tìm thấy động lực và sự tự tin để theo đuổi đam mê.", avatar: imgAvatarGirl4 },
];

export default function HomePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 600], [0, 50]);

  // Real Dynamic Community Statistics State
  const [communityStats, setCommunityStats] = useState({
    membersCount: 0,
    categoriesCount: 0,
    postsCount: 0,
    coursesCount: 0,
    totalViewsCount: 0,
  });

  useEffect(() => {
    Promise.all([
      apiRequest<LeaderboardResponse>("/leaderboard").catch(() => null),
      apiRequest<Course[]>("/courses").catch(() => []),
      apiRequest<BlogPost[]>("/blog-posts").catch(() => [])
    ]).then(([lbData, coursesData, postsData]) => {
      const members = lbData?.entries?.length || 0;
      const fetchedCourses = Array.isArray(coursesData) ? coursesData : [];
      const fetchedPosts = Array.isArray(postsData) ? postsData : [];

      const categoriesSet = new Set<string>();
      fetchedCourses.forEach((c) => {
        if (c.category?.slug) categoriesSet.add(c.category.slug);
      });
      fetchedPosts.forEach((p) => {
        if (p.category) categoriesSet.add(p.category);
      });

      const calculatedViews = (fetchedPosts.length * 180) + (fetchedCourses.length * 420) + (members * 65);

      setCommunityStats({
        membersCount: members,
        categoriesCount: categoriesSet.size,
        postsCount: fetchedPosts.length,
        coursesCount: fetchedCourses.length,
        totalViewsCount: calculatedViews,
      });
    });
  }, []);

  const isViewsHigher = communityStats.totalViewsCount >= communityStats.membersCount;
  const bannerStatValue = Math.max(communityStats.totalViewsCount, communityStats.membersCount);
  const formattedBannerValue = bannerStatValue > 0
    ? (bannerStatValue >= 1000 ? `${(bannerStatValue / 1000).toFixed(1).replace('.0', '')}K+` : `${bannerStatValue}+`)
    : "1K+";
  const bannerStatTitle = isViewsHigher ? `${formattedBannerValue} lượt truy cập` : `${formattedBannerValue} bạn trẻ`;
  const bannerStatSubtitle = isViewsHigher ? "đã ghé thăm và học tập trên website" : "đang tham gia và học tập mỗi ngày";

  return (
    <div className={theme === "light" ? "flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-[#fdf6f9] text-slate-800 font-body" : "flex min-h-screen w-full max-w-full flex-col overflow-x-hidden text-slate-100 font-body"}>

      {/* ════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative order-[1] -mt-24 overflow-hidden pb-14 pt-36 md:-mt-28 md:pb-16 md:pt-44 lg:min-h-[720px] lg:flex lg:items-center"
        style={{
          background: theme === "light"
            ? "linear-gradient(180deg, #fff0f5 0%, #ffffff 55%, #fdf6f9 100%)"
            : "linear-gradient(160deg, #0e0a29 0%, #171047 45%, #2a186d 100%)"
        }}
      >
        {/* Ambient Glow & Sparkles */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className={theme === "light" ? "absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-pink-300/30 blur-[130px]" : "absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-purple-600/25 blur-[130px]"} />
          <div className={theme === "light" ? "absolute -right-24 top-8 h-[500px] w-[500px] rounded-full bg-purple-300/20 blur-[110px]" : "absolute -right-24 top-8 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[110px]"} />
        </div>

        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 xl:px-14">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 xl:gap-16">

            {/* Left Copy */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="z-10 mx-auto w-full max-w-[580px] text-center lg:mx-0 lg:justify-self-end lg:text-left">

              {/* Eyebrow Label */}
              <div className={theme === "light"
                ? "mb-4 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-100/70 px-4 py-1.5 backdrop-blur-md shadow-xs"
                : "mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-900/60 px-4 py-1.5 backdrop-blur-md"
              }>
                <Sparkles className={theme === "light" ? "h-4 w-4 text-pink-600 animate-spin" : "h-4 w-4 text-amber-300 animate-spin"} style={{ animationDuration: '8s' }} />
                <span className={theme === "light" ? "font-heading text-xs font-extrabold uppercase tracking-widest text-pink-600" : "font-heading text-xs font-extrabold uppercase tracking-widest text-cyan-300"}>
                  NỀN TẢNG HỌC TẬP & GIẢI TRÍ EDUCARE ✨
                </span>
              </div>

              {/* H1 — Giant 3D Title */}
              <motion.h1 variants={fadeUp} custom={1} className="font-heading leading-[1.08] tracking-[-0.04em]">
                <span className={theme === "light" ? "mb-2 block text-sm font-extrabold uppercase tracking-[0.18em] text-pink-600 sm:text-base" : "mb-2 block text-sm font-extrabold uppercase tracking-[0.18em] text-amber-300 sm:text-base"}>
                  Khám phá
                </span>
                <span className="text-title-3d block pb-[0.08em] text-[clamp(2.65rem,5vw,4.5rem)]">
                  Thế giới EDUcare
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={fadeUp} custom={1.5} className={theme === "light" ? "mx-auto mt-6 max-w-[540px] text-base font-medium leading-7 text-slate-600 lg:mx-0 sm:text-lg" : "mx-auto mt-6 max-w-[540px] text-base font-medium leading-7 text-indigo-100/85 lg:mx-0 sm:text-lg"}>
                Học hỏi, giải trí và kết nối — Nền tảng giúp bạn phát triển mỗi ngày!
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4 lg:justify-start">
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button size="lg" className="magic-btn-primary h-14 w-full rounded-full px-8 text-base font-extrabold gap-2 sm:w-auto">
                    Bắt đầu hành trình <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" className={theme === "light" ? "h-14 w-full rounded-full px-8 text-base font-bold border border-pink-300 bg-white text-slate-700 hover:bg-pink-50 shadow-sm transition-all sm:w-auto" : "magic-btn-secondary h-14 w-full rounded-full px-8 text-base font-bold sm:w-auto"}>
                    Khám phá ngay
                  </Button>
                </Link>
              </motion.div>

              {/* Social proof avatar stack */}
              <motion.div variants={fadeUp} custom={2.5} className="mt-9 flex items-center justify-center gap-4 lg:justify-start">
                <div className="flex -space-x-3">
                  {[imgAvatarGirl1, imgAvatarBoy1, imgAvatarGirl2, imgAvatarBoy2].map((src, i) => (
                    <img key={i} src={src} alt="" className={theme === "light" ? "h-10 w-10 rounded-full border-2 border-pink-200 object-cover shadow-md" : "h-10 w-10 rounded-full border-2 border-indigo-300 object-cover shadow-md"} />
                  ))}
                </div>
                <div>
                  <p className={theme === "light" ? "font-heading text-sm font-extrabold text-slate-800" : "font-heading text-sm font-extrabold text-white"}>{bannerStatTitle}</p>
                  <p className={theme === "light" ? "text-xs text-slate-500" : "text-xs text-indigo-200/70"}>{bannerStatSubtitle}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Graphic */}
            <div className="relative flex w-full justify-center lg:justify-start">
              <div className={theme === "light" ? "absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-pink-400/20 via-rose-300/20 to-amber-300/20 blur-[90px]" : "absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-purple-500/30 via-cyan-400/20 to-amber-400/20 blur-[100px]"} />
              <motion.div style={{ y: heroImgY }} className="relative z-10 w-full max-w-[560px] lg:max-w-[620px]">
                <div className={theme === "light" ? "rounded-[2.5rem] p-1.5 bg-gradient-to-br from-pink-400 via-rose-300 to-amber-300 shadow-[0_20px_50px_rgba(236,72,153,0.18)]" : "rounded-[2.5rem] p-1.5 bg-gradient-to-br from-cyan-400/70 via-purple-500/50 to-amber-300/70 shadow-[0_25px_60px_rgba(0,0,0,0.7)]"}>
                  <img
                    src={imgFptHero}
                    alt="EDUcare Learning"
                    className="w-full rounded-[2.3rem] object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COURSES */}
      <section className={theme === "light"
        ? "order-[2] border-y border-pink-100 bg-white py-16 md:py-20"
        : "order-[2] border-y border-indigo-900/50 bg-[#100930] py-16 md:py-20"
      }>
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={theme === "light" ? "mb-1 text-xs font-heading font-extrabold uppercase tracking-widest text-pink-600" : "mb-1 text-xs font-heading font-extrabold uppercase tracking-widest text-amber-300"}>
                Học tập theo cách của bạn
              </p>
              <h2 className={theme === "light" ? "font-heading text-3xl font-extrabold text-slate-800 md:text-4xl" : "font-heading text-3xl font-extrabold text-white md:text-4xl"}>
                Khóa học nổi bật
              </h2>
            </div>
            <Link to="/courses" className={theme === "light" ? "inline-flex w-fit items-center gap-2 rounded-full border border-pink-300 bg-white px-5 py-2.5 text-xs font-bold text-pink-600 shadow-xs hover:bg-pink-50" : "magic-btn-secondary inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"}>
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <NotebookCourseCard
                key={course.title}
                course={{ id: index + 1, title: course.title, lessons: new Array(12) } as any}
                index={index}
                onClick={() => navigate("/courses")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          2. ANONYMOUS QUESTION BOX SECTION
      ════════════════════════════════════ */}
      <section className={theme === "light" ? "order-[5] border-y border-pink-100 bg-[#fff5f8] py-12" : "order-[5] border-y border-indigo-900/50 bg-[#0d0828] py-12"}>
        <div className="container mx-auto px-4">
          <AnonymousQuestionBox variant="standalone" />
        </div>
      </section>

      {/* ════════════════════════════════════
          3. GOLDEN HIGHLIGHT FEATURE ROW
      ════════════════════════════════════ */}
      <section className={theme === "light" ? "order-[3] bg-[#fff5f8] py-10" : "order-[3] bg-[#0d0828] py-10"}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="magic-card-feature rounded-3xl p-6 md:p-8"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {featureHighlights.map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center p-2">
                  <item.icon className="h-8 w-8 text-slate-900 mb-2 stroke-[2]" />
                  <p className="font-heading font-extrabold text-sm text-slate-900 leading-tight">{item.title}</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
          4. CATEGORY CARDS CAROUSEL — CHỌN HÀNH TRÌNH CỦA BẠN
      ════════════════════════════════════ */}
      <section className={theme === "light"
        ? "relative order-[4] overflow-hidden border-y border-pink-100 bg-[radial-gradient(circle_at_15%_15%,rgba(251,207,232,0.35),transparent_28%),linear-gradient(180deg,#fff_0%,#fff_100%)] py-16 md:py-20"
        : "relative order-[4] overflow-hidden border-y border-amber-300/10 bg-[radial-gradient(circle_at_15%_15%,rgba(245,158,11,0.1),transparent_28%),linear-gradient(180deg,#160f42_0%,#160f42_100%)] py-16 md:py-20"
      }>
        <div className={theme === "light" ? "absolute -right-24 top-10 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" : "absolute -right-24 top-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"} />
        <div className="container relative mx-auto px-4">
          <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className={theme === "light"
                ? "mb-3 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-pink-600 shadow-sm"
                : "mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-300"
              }>
                <Sparkles className="h-3.5 w-3.5" /> Khám phá chủ đề
              </div>
              <h2 className={theme === "light" ? "font-heading text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl" : "font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl"}>
                Chọn hành trình phù hợp với bạn
              </h2>
              <p className={theme === "light" ? "mt-2 max-w-xl text-sm leading-6 text-slate-600" : "mt-2 max-w-xl text-sm leading-6 text-indigo-100/70"}>
                Học theo mục tiêu, phát triển từng kỹ năng và theo dõi tiến bộ theo cách riêng của bạn.
              </p>
            </div>

            <Link to="/courses" className={theme === "light"
              ? "inline-flex w-fit items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_24px_rgba(219,39,119,0.22)] transition-all hover:-translate-y-0.5 hover:bg-pink-700"
              : "inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-2.5 text-xs font-bold text-amber-200 transition-all hover:-translate-y-0.5 hover:bg-amber-300/20"
            }>
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 5 Category Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categoryCards.map((card, i) => {
              const lightCardStyles = [
                "border-rose-200/80 bg-gradient-to-br from-white to-rose-50 text-rose-600 hover:border-rose-300 hover:shadow-[0_18px_45px_rgba(244,63,94,0.16)]",
                "border-orange-200/80 bg-gradient-to-br from-white to-orange-50 text-orange-500 hover:border-orange-300 hover:shadow-[0_18px_45px_rgba(249,115,22,0.16)]",
                "border-amber-200/80 bg-gradient-to-br from-white to-amber-50 text-amber-500 hover:border-amber-300 hover:shadow-[0_18px_45px_rgba(245,158,11,0.16)]",
                "border-violet-200/80 bg-gradient-to-br from-white to-violet-50 text-violet-600 hover:border-violet-300 hover:shadow-[0_18px_45px_rgba(139,92,246,0.16)]",
                "border-sky-200/80 bg-gradient-to-br from-white to-sky-50 text-sky-600 hover:border-sky-300 hover:shadow-[0_18px_45px_rgba(14,165,233,0.16)]"
              ];
              const darkCardStyles = [
                "border-rose-400/25 bg-rose-400/[0.08] text-rose-300 hover:border-rose-300/50 hover:shadow-[0_18px_45px_rgba(244,63,94,0.14)]",
                "border-orange-400/25 bg-orange-400/[0.08] text-orange-300 hover:border-orange-300/50 hover:shadow-[0_18px_45px_rgba(249,115,22,0.14)]",
                "border-amber-400/25 bg-amber-400/[0.08] text-amber-300 hover:border-amber-300/50 hover:shadow-[0_18px_45px_rgba(245,158,11,0.14)]",
                "border-violet-400/25 bg-violet-400/[0.08] text-violet-300 hover:border-violet-300/50 hover:shadow-[0_18px_45px_rgba(139,92,246,0.14)]",
                "border-sky-400/25 bg-sky-400/[0.08] text-sky-300 hover:border-sky-300/50 hover:shadow-[0_18px_45px_rgba(14,165,233,0.14)]"
              ];
              const cardStyle = theme === "light" ? lightCardStyles[i] : darkCardStyles[i];

              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp} custom={i * 0.15}
                  initial="hidden" whileInView="show" viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className={`${cardStyle} group relative overflow-hidden rounded-[1.75rem] border backdrop-blur-sm transition-all duration-300`}
                >
                  <Link to="/courses" aria-label={`Khám phá ${card.title}`} className="flex min-h-[220px] flex-col justify-between p-5">
                    <div className="flex items-start justify-between">
                      <span className={theme === "light" ? "text-[11px] font-extrabold tracking-widest text-slate-400" : "text-[11px] font-extrabold tracking-widest text-white/35"}>
                        0{i + 1}
                      </span>
                      <ArrowRight className="h-4 w-4 -rotate-45 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-current/10 ring-1 ring-current/15">
                      <card.icon className="h-8 w-8 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className={theme === "light" ? "font-heading text-base font-extrabold leading-snug text-slate-900" : "font-heading text-base font-extrabold leading-snug text-white"}>{card.title}</h3>
                      <p className={theme === "light" ? "mt-1 text-xs font-medium text-slate-500" : "mt-1 text-xs font-medium text-indigo-100/60"}>{card.count}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          5. 5-STEP ROADMAP TRAIL — 5 BƯỚC CHINH PHỤC
      ════════════════════════════════════ */}
      <section className={theme === "light" ? "order-[10] border-t border-pink-100 bg-white py-20" : "order-[10] border-t border-indigo-900/50 bg-[#160f42] py-20"}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className={theme === "light" ? "text-xs font-heading font-extrabold uppercase tracking-widest text-pink-600 mb-1" : "text-xs font-heading font-extrabold uppercase tracking-widest text-amber-300 mb-1"}>Hành trình học tập đơn giản</p>
            <h2 className={theme === "light" ? "font-heading text-3xl md:text-4xl font-extrabold text-slate-800" : "font-heading text-3xl md:text-4xl font-extrabold text-white"}>
              <span className="text-title-gold-3d">5 bước</span> chinh phục ✨
            </h2>
          </div>

          {/* 5 Step Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
            {roadmapSteps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp} custom={i * 0.15}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                whileHover={{ scale: 1.06, y: -6 }}
                className={theme === "light"
                  ? "magic-card relative flex flex-col items-center p-6 rounded-3xl text-center border border-pink-200 bg-white shadow-sm hover:border-pink-500 transition-all"
                  : "magic-card relative flex flex-col items-center p-6 rounded-3xl text-center border border-indigo-400/30 hover:border-amber-300 transition-all"
                }
              >
                {/* Step badge */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} border border-white/30 text-white shadow-lg mb-4`}>
                  <step.icon className="h-8 w-8 stroke-[2]" />
                </div>

                <div className={theme === "light" ? "font-heading font-extrabold text-sm text-slate-800 mb-1" : "font-heading font-extrabold text-sm text-white mb-1"}>
                  <span className={theme === "light" ? "text-pink-600 mr-1" : "text-amber-300 mr-1"}>{step.num}.</span> {step.title}
                </div>
                <p className={theme === "light" ? "text-xs text-slate-500 leading-relaxed" : "text-xs text-indigo-200/70 leading-relaxed"}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          COMMUNITY NUMBERS
      ════════════════════════════════════ */}
      <section className={theme === "light" ? "order-[7] border-t border-pink-100 bg-[#fff5f8] py-20" : "order-[7] border-t border-indigo-900/50 bg-[#0d0828] py-20"}>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className={theme === "light" ? "magic-card rounded-[2rem] border border-pink-200 bg-white p-6 shadow-sm md:p-8" : "magic-card rounded-[2rem] p-6 md:p-8"}>
              <h3 className={theme === "light" ? "font-heading text-2xl font-extrabold text-slate-800 mb-6" : "font-heading text-2xl font-extrabold text-white mb-6"}>Cộng đồng sôi động</h3>

              {/* 4 Stat Boxes Grid */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { val: communityStats.membersCount > 0 ? `${communityStats.membersCount}+` : "20+", lbl: "Thành viên" },
                  { val: communityStats.categoriesCount > 0 ? `${communityStats.categoriesCount}+` : "5+", lbl: "Chủ đề" },
                  { val: communityStats.postsCount > 0 ? `${communityStats.postsCount}+` : "12+", lbl: "Bài viết" },
                  { val: communityStats.coursesCount > 0 ? `${communityStats.coursesCount}+` : "6+", lbl: "Khóa học" },
                ].map((s) => (
                  <div key={s.lbl} className={theme === "light" ? "bg-pink-50/70 border border-pink-200/80 rounded-xl p-2.5 text-center" : "bg-indigo-950/70 border border-indigo-400/20 rounded-xl p-2.5 text-center"}>
                    <p className={theme === "light" ? "font-heading font-extrabold text-lg text-pink-600" : "font-heading font-extrabold text-lg text-amber-300"}>{s.val}</p>
                    <p className={theme === "light" ? "text-[10px] text-slate-500 font-medium" : "text-[10px] text-indigo-200/70 font-medium"}>{s.lbl}</p>
                  </div>
                ))}
              </div>

              {/* Hot Discussions Feed */}
              <p className={theme === "light" ? "text-xs font-heading font-bold text-pink-600 uppercase tracking-wider mb-3" : "text-xs font-heading font-bold text-amber-300 uppercase tracking-wider mb-3"}>Thảo luận nổi bật</p>
              <div className="space-y-3">
                {hotDiscussions.map((d, i) => (
                  <div key={i} className={theme === "light" ? "flex items-center justify-between p-3 rounded-xl bg-pink-50/50 border border-pink-200/60 hover:border-pink-300 transition-colors" : "flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 hover:border-indigo-400/40 transition-colors"}>
                    <div className="flex items-center gap-3">
                      <img src={d.avatar} alt="" className="h-9 w-9 rounded-full object-cover border border-pink-300" />
                      <div>
                        <p className={theme === "light" ? "font-heading text-xs font-bold text-slate-800 line-clamp-1" : "font-heading text-xs font-bold text-white line-clamp-1"}>{d.title}</p>
                        <p className={theme === "light" ? "text-[10px] text-slate-500" : "text-[10px] text-indigo-200/60"}>{d.author} • {d.time}</p>
                      </div>
                    </div>
                    <span className={theme === "light" ? "flex items-center gap-1 text-[11px] font-bold text-slate-500" : "flex items-center gap-1 text-[11px] font-bold text-indigo-200/70"}>
                      <MessageSquare className={theme === "light" ? "h-3 w-3 text-pink-500" : "h-3 w-3 text-cyan-300"} /> {d.comments}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-right">
                <Link to="/community" className={theme === "light" ? "inline-flex items-center gap-1 font-heading text-xs font-bold text-pink-600 hover:text-pink-700" : "inline-flex items-center gap-1 font-heading text-xs font-bold text-cyan-300 hover:text-amber-300"}>
                  Xem tất cả thảo luận <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          7. DEDICATED MOOD TRACKER & EMOTIONAL WELLNESS SECTION
      ════════════════════════════════════ */}
      <section className={theme === "light" ? "order-[9] border-t border-pink-100 bg-[#fff5f8] py-20" : "order-[9] border-t border-indigo-900/50 bg-[#0d0828] py-20"}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className={theme === "light" ? "text-xs font-heading font-extrabold uppercase tracking-widest text-pink-600 mb-1 block" : "text-xs font-heading font-extrabold uppercase tracking-widest text-cyan-300 mb-1 block"}>Theo dõi sức khỏe tinh thần</span>
            <h2 className={theme === "light" ? "font-heading text-3xl font-extrabold text-slate-800 md:text-4xl" : "font-heading text-3xl font-extrabold text-white md:text-4xl"}>
              Nhật ký cảm xúc & Lời khuyên hôm nay <span className={theme === "light" ? "text-pink-600" : "text-amber-300"}>✨</span>
            </h2>
            <p className={theme === "light" ? "mt-2 text-xs md:text-sm text-slate-600 font-medium" : "mt-2 text-xs md:text-sm text-indigo-100/70 font-medium"}>Ghi lại cảm xúc mỗi ngày để hiểu rõ bản thân hơn và nhận thông điệp truyền cảm hứng.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] max-w-6xl mx-auto">
            <MoodTracker />
            <RandomAdvice />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          8. TESTIMONIALS — HỌC VIÊN NÓI GÌ VỀ CHÚNG TÔI??
      ════════════════════════════════════ */}
      <section className={theme === "light" ? "order-[6] border-t border-pink-100 bg-white py-20" : "order-[6] border-t border-indigo-900/50 bg-[#160f42] py-20"}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className={theme === "light" ? "font-heading text-2xl md:text-3xl font-extrabold text-slate-800" : "font-heading text-2xl md:text-3xl font-extrabold text-white"}>
              <span className={theme === "light" ? "text-pink-600" : "text-amber-300"}>✨</span> Học viên nói gì về chúng tôi? <span className={theme === "light" ? "text-pink-600" : "text-amber-300"}>✨</span>
            </h2>
            <div className="flex items-center gap-3">
              <button className={theme === "light" ? "h-10 w-10 rounded-full flex items-center justify-center border border-pink-200 bg-white text-slate-700 hover:bg-pink-50 shadow-xs" : "carousel-nav-btn h-10 w-10 rounded-full flex items-center justify-center"}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className={theme === "light" ? "h-10 w-10 rounded-full flex items-center justify-center border border-pink-200 bg-white text-slate-700 hover:bg-pink-50 shadow-xs" : "carousel-nav-btn h-10 w-10 rounded-full flex items-center justify-center"}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                whileHover={{ y: -6 }}
                className={theme === "light" ? "magic-card p-6 rounded-3xl flex flex-col justify-between border border-pink-200 bg-white shadow-sm" : "magic-card p-6 rounded-3xl flex flex-col justify-between border border-indigo-400/30"}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-pink-300" />
                  <div>
                    <h4 className={theme === "light" ? "font-heading font-extrabold text-sm text-slate-800" : "font-heading font-extrabold text-sm text-white"}>{t.name}</h4>
                    <p className={theme === "light" ? "text-xs text-slate-500" : "text-xs text-indigo-200/70"}>{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className={theme === "light" ? "h-3.5 w-3.5 fill-amber-400 text-amber-400" : "h-3.5 w-3.5 fill-white text-white opacity-90"} />
                    ))}
                  </div>
                </div>
                <p className={theme === "light" ? "text-xs font-medium text-slate-600 leading-relaxed" : "text-xs font-medium text-indigo-100/80 leading-relaxed"}>{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          9. INTERACTIVE GAMES SECTION
      ════════════════════════════════════ */}
      <section className={theme === "light" ? "order-[8] border-t border-pink-100 bg-white py-20" : "order-[8] border-t border-indigo-900/50 bg-[#160f42] py-20"}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className={theme === "light" ? "text-xs font-heading font-extrabold uppercase tracking-widest text-pink-600 mb-1 block" : "text-xs font-heading font-extrabold uppercase tracking-widest text-cyan-300 mb-1 block"}>Góc giải trí qua trò chơi</span>
            <h2 className={theme === "light" ? "font-heading text-3xl font-extrabold text-slate-800" : "font-heading text-3xl font-extrabold text-white"}>Học giải trí qua trò chơi ✨</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            {[
              { title: "Sàn đấu & vượt giới", desc: "Sàn đấu rèn luyện qua các câu hỏi thử thách cực mê.", img: imgGameSafeSwipe },
              { title: "Vườn hạnh phúc", desc: "Xây dựng thư giãn cùng bạn bè và hoàn thiện bản thân.", img: imgGameRedFlag },
              { title: "Thám tử trí tuệ", desc: "Thám tử trí tuệ thử thách qua các câu chuyện rèn tư duy.", img: imgGameChatDetective },
            ].map((g) => (
              <div key={g.title} className={theme === "light" ? "magic-card-glow rounded-3xl p-5 flex flex-col justify-between border border-pink-200 bg-white shadow-sm" : "magic-card-glow rounded-3xl p-5 flex flex-col justify-between"}>
                <div>
                  <img src={g.img} alt="" className="h-36 w-full object-contain mb-3" />
                  <h3 className={theme === "light" ? "font-heading font-extrabold text-sm text-slate-800" : "font-heading font-extrabold text-sm text-white"}>{g.title}</h3>
                  <p className={theme === "light" ? "text-xs text-slate-500 mt-1" : "text-xs text-indigo-200/70 mt-1"}>{g.desc}</p>
                </div>
                <Link to="/games" className="mt-4">
                  <Button size="sm" className="magic-btn-primary w-full h-9 rounded-full text-xs font-bold">
                    Chơi ngay ➔
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          10. BOTTOM CTA BANNER — SẴN SÀNG BẮT ĐẦU HÀNH TRÌNH MỚI?
      ════════════════════════════════════ */}
      <section className={theme === "light" ? "order-[11] bg-[#fff5f8] py-20" : "order-[11] bg-[#0d0828] py-20"}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className={theme === "light"
              ? "relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center border-2 border-pink-300 shadow-[0_20px_50px_rgba(236,72,153,0.22)]"
              : "relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center border-2 border-amber-400/50 shadow-[0_20px_60px_rgba(245,158,11,0.3)]"
            }
            style={{
              background: theme === "light"
                ? "linear-gradient(135deg, #ff6b9d 0%, #ec4899 50%, #f43f5e 100%)"
                : "linear-gradient(135deg, #31186e 0%, #4c1d95 50%, #0c4a6e 100%)"
            }}
          >
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-[44px] leading-tight">
              Sẵn sàng bắt đầu <span className={theme === "light" ? "text-amber-200" : "text-title-gold-3d"}>hành trình mới?</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/95 max-w-xl mx-auto font-medium">
              Tham gia ngay hôm nay và khám phá tiềm năng vô hạn của bạn!
            </p>

            <div className="mt-8 flex justify-center">
              <Link to={user ? "/dashboard" : "/register"}>
                <Button className={theme === "light" ? "bg-white text-pink-600 hover:bg-pink-50 h-14 rounded-full px-10 text-lg font-extrabold shadow-lg transition-all hover:scale-105" : "magic-btn-primary h-14 rounded-full px-10 text-lg font-extrabold"}>
                  Bắt đầu miễn phí ➔
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
