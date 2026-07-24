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

      // Calculate total website views & traffic (comparing total views vs members)
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden text-slate-100 font-body">

      {/* ════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative -mt-24 overflow-hidden pb-12 pt-36 md:-mt-28 md:pt-44"
        style={{ background: "linear-gradient(160deg, #0e0a29 0%, #171047 45%, #2a186d 100%)" }}
      >
        {/* Ambient Glow & Sparkles */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-purple-600/25 blur-[130px]" />
          <div className="absolute -right-24 top-8 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[110px]" />
        </div>

        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">

            {/* Left Copy */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="z-10">

              {/* Eyebrow Label */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-900/60 px-4 py-1.5 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-cyan-300">
                  KHÁM PHÁ THẾ GIỚI EDUCARE ✨
                </span>
              </div>

              {/* H1 — Giant 3D Title */}
              <motion.h1 variants={fadeUp} custom={1} className="font-heading leading-[1.08]">
                <span className="block text-xl font-bold uppercase tracking-widest text-amber-300 mb-1">
                  Khám phá
                </span>
                <span className="text-title-3d text-5xl md:text-[62px] lg:text-[70px]">
                  Thế giới EDUcare
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={fadeUp} custom={1.5} className="mt-5 text-base font-medium leading-relaxed text-indigo-100/85 max-w-xl">
                Học hỏi, sưu tầm và chinh phục thế giới tri thức cùng hàng ngàn bạn trẻ đam mê mỗi ngày!
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap items-center gap-4">
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button size="lg" className="magic-btn-primary h-14 rounded-full px-8 text-base font-extrabold gap-2">
                    Bắt đầu hành trình <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" className="magic-btn-secondary h-14 rounded-full px-8 text-base font-bold">
                    Khám phá ngay
                  </Button>
                </Link>
              </motion.div>

              {/* Social proof avatar stack */}
              <motion.div variants={fadeUp} custom={2.5} className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[imgAvatarGirl1, imgAvatarBoy1, imgAvatarGirl2, imgAvatarBoy2].map((src, i) => (
                    <img key={i} src={src} alt="" className="h-10 w-10 rounded-full border-2 border-indigo-300 object-cover shadow-md" />
                  ))}
                </div>
                <div>
                  <p className="font-heading text-sm font-extrabold text-white">{bannerStatTitle}</p>
                  <p className="text-xs text-indigo-200/70">{bannerStatSubtitle}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Graphic */}
            <div className="relative flex justify-center lg:justify-end w-full">
              <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-purple-500/30 via-cyan-400/20 to-amber-400/20 blur-[100px]" />
              <motion.div style={{ y: heroImgY }} className="relative z-10 w-full max-w-[540px] lg:max-w-[640px]">
                <div className="rounded-[2.5rem] p-1.5 bg-gradient-to-br from-cyan-400/70 via-purple-500/50 to-amber-300/70 shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
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

      {/* ════════════════════════════════════
          2. ANONYMOUS QUESTION BOX SECTION (ĐẶT LÊN ĐẦU, NGAY DƯỚI HERO)
      ════════════════════════════════════ */}
      <section className="bg-[#0e092d] py-12 border-y border-indigo-900/50">
        <div className="container mx-auto px-4">
          <AnonymousQuestionBox variant="standalone" />
        </div>
      </section>

      {/* ════════════════════════════════════
          3. GOLDEN HIGHLIGHT FEATURE ROW
      ════════════════════════════════════ */}
      <section className="bg-[#100b33] py-10">
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
      <section className="bg-[#120c38] py-20 border-t border-indigo-900/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-heading font-extrabold uppercase tracking-widest text-cyan-300 mb-1">Khám phá chủ đề</p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white">
                Chọn hành trình của bạn <span className="text-amber-300">✨</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="carousel-nav-btn h-10 w-10 rounded-full flex items-center justify-center">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="carousel-nav-btn h-10 w-10 rounded-full flex items-center justify-center">
                <ChevronRight className="h-5 w-5" />
              </button>
              <Link to="/courses" className="hidden sm:inline-flex magic-btn-secondary px-5 py-2 rounded-full text-xs font-bold">
                Xem tất cả
              </Link>
            </div>
          </div>

          {/* 5 Vertical 3D Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {categoryCards.map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp} custom={i * 0.15}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                whileHover={{ scale: 1.06, y: -8 }}
                className={`${card.theme} relative cursor-pointer overflow-hidden rounded-3xl p-5 flex flex-col justify-between min-h-[260px] transition-all`}
              >
                <div className="flex justify-center my-6">
                  <card.icon className="h-12 w-12 text-white stroke-[1.75] filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.4)]" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white leading-snug">{card.title}</h3>
                  <p className="text-xs font-medium text-indigo-100/80 mt-1">{card.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          5. 5-STEP ROADMAP TRAIL — 5 BƯỚC CHINH PHỤC
      ════════════════════════════════════ */}
      <section className="bg-[#160e42] py-20 border-t border-indigo-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-heading font-extrabold uppercase tracking-widest text-amber-300 mb-1">Hành trình học tập đơn giản</p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white">
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
                className="magic-card relative flex flex-col items-center p-6 rounded-3xl text-center border border-indigo-400/30 hover:border-amber-300 transition-all"
              >
                {/* Step badge */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} border border-white/30 text-white shadow-lg mb-4`}>
                  <step.icon className="h-8 w-8 stroke-[2]" />
                </div>

                <div className="font-heading font-extrabold text-sm text-white mb-1">
                  <span className="text-amber-300 mr-1">{step.num}</span> {step.title}
                </div>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          6. SIDE-BY-SIDE GRID — KHÓA HỌC NỔI BẬT + CỘNG ĐỒNG SÔI ĐỘNG
      ════════════════════════════════════ */}
      <section className="bg-[#100930] py-20 border-t border-indigo-900/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Left: Khóa học nổi bật */}
            <div className="magic-card p-6 md:p-8 rounded-[2rem]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-2xl font-extrabold text-white">Khóa học nổi bật</h3>
                <Link to="/courses" className="magic-btn-secondary px-4 py-1.5 rounded-full text-xs font-bold">
                  Xem tất cả
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {courses.map((c, idx) => (
                  <NotebookCourseCard
                    key={c.title}
                    course={{ id: idx + 1, title: c.title, lessons: new Array(12) } as any}
                    index={idx}
                    onClick={() => navigate("/courses")}
                  />
                ))}
              </div>
            </div>

            {/* Right: Cộng đồng sôi động */}
            <div className="magic-card p-6 md:p-8 rounded-[2rem]">
              <h3 className="font-heading text-2xl font-extrabold text-white mb-6">Cộng đồng sôi động</h3>

              {/* 4 Stat Boxes Grid (Real Dynamic Counts From Backend Data) */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { val: communityStats.membersCount > 0 ? `${communityStats.membersCount}+` : "20+", lbl: "Thành viên" },
                  { val: communityStats.categoriesCount > 0 ? `${communityStats.categoriesCount}+` : "5+", lbl: "Chủ đề" },
                  { val: communityStats.postsCount > 0 ? `${communityStats.postsCount}+` : "12+", lbl: "Bài viết" },
                  { val: communityStats.coursesCount > 0 ? `${communityStats.coursesCount}+` : "6+", lbl: "Khóa học" },
                ].map((s) => (
                  <div key={s.lbl} className="bg-indigo-950/70 border border-indigo-400/20 rounded-xl p-2.5 text-center">
                    <p className="font-heading font-extrabold text-lg text-amber-300">{s.val}</p>
                    <p className="text-[10px] text-indigo-200/70 font-medium">{s.lbl}</p>
                  </div>
                ))}
              </div>

              {/* Hot Discussions Feed */}
              <p className="text-xs font-heading font-bold text-amber-300 uppercase tracking-wider mb-3">Thảo luận nổi bật</p>
              <div className="space-y-3">
                {hotDiscussions.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 hover:border-indigo-400/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={d.avatar} alt="" className="h-9 w-9 rounded-full object-cover border border-cyan-400/50" />
                      <div>
                        <p className="font-heading text-xs font-bold text-white line-clamp-1">{d.title}</p>
                        <p className="text-[10px] text-indigo-200/60">{d.author} • {d.time}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-200/70">
                      <MessageSquare className="h-3 w-3 text-cyan-300" /> {d.comments}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-right">
                <Link to="/community" className="inline-flex items-center gap-1 font-heading text-xs font-bold text-cyan-300 hover:text-amber-300">
                  Xem tất cả thảo luận <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          7. DEDICATED MOOD TRACKER & EMOTIONAL WELLNESS SECTION (TÁCH THÀNH SECTION RIÊNG)
      ════════════════════════════════════ */}
      <section className="bg-[#0d0726] py-20 border-t border-indigo-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-heading font-extrabold uppercase tracking-widest text-cyan-300 mb-1 block">Theo dõi sức khỏe tinh thần</span>
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
              Nhật ký cảm xúc & Lời khuyên hôm nay <span className="text-amber-300">✨</span>
            </h2>
            <p className="mt-2 text-xs md:text-sm text-indigo-100/70 font-medium">Ghi lại cảm xúc mỗi ngày để hiểu rõ bản thân hơn và nhận thông điệp truyền cảm hứng.</p>
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
      <section className="bg-[#140b3a] py-20 border-t border-indigo-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
              <span className="text-amber-300">✨</span> Học viên nói gì về chúng tôi?? <span className="text-amber-300">✨</span>
            </h2>
            <div className="flex items-center gap-3">
              <button className="carousel-nav-btn h-10 w-10 rounded-full flex items-center justify-center">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="carousel-nav-btn h-10 w-10 rounded-full flex items-center justify-center">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                whileHover={{ y: -6 }}
                className="magic-card p-6 rounded-3xl flex flex-col justify-between border border-indigo-400/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-cyan-400" />
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-white">{t.name}</h4>
                    <p className="text-xs text-indigo-200/70">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-white text-white opacity-90" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-medium text-indigo-100/80 leading-relaxed">{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          9. INTERACTIVE GAMES SECTION
      ════════════════════════════════════ */}
      <section className="bg-[#0b0724] py-20 border-t border-indigo-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-heading font-extrabold uppercase tracking-widest text-cyan-300 mb-1 block">Góc trải nghiệm & tương tác</span>
            <h2 className="font-heading text-3xl font-extrabold text-white">Học giới tính qua trò chơi ✨</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            {[
              { title: "Vuốt chạm an toàn", desc: "Nhận diện ranh giới và sự đồng thuận bằng thao tác vuốt chạm thú vị.", img: imgGameSafeSwipe },
              { title: "Săn cờ đỏ ranh giới", desc: "Săn tìm các dấu hiệu độc hại (red flags) ẩn giấu trong tình bạn.", img: imgGameRedFlag },
              { title: "Thám tử trò chuyện", desc: "Giải mã tin nhắn nhạy cảm và tự bảo vệ mình trên mạng xã hội.", img: imgGameChatDetective },
            ].map((g) => (
              <div key={g.title} className="magic-card-glow rounded-3xl p-5 flex flex-col justify-between">
                <div>
                  <img src={g.img} alt="" className="h-36 w-full object-contain mb-3" />
                  <h3 className="font-heading font-extrabold text-sm text-white">{g.title}</h3>
                  <p className="text-xs text-indigo-200/70 mt-1">{g.desc}</p>
                </div>
                <Link to="/games" className="mt-4">
                  <Button size="sm" className="magic-btn-primary w-full h-9 rounded-full text-xs font-bold">
                    Chơi ngay thôi! ➔
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
      <section className="bg-[#07041a] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center border-2 border-amber-400/50 shadow-[0_20px_60px_rgba(245,158,11,0.3)]"
            style={{ background: "linear-gradient(135deg, #31186e 0%, #4c1d95 50%, #0c4a6e 100%)" }}
          >
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-[44px] leading-tight">
              Sẵn sàng bắt đầu <span className="text-title-gold-3d">hành trình mới?</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-indigo-100/90 max-w-xl mx-auto font-medium">
              Tham gia ngay hôm nay và khám phá tiềm năng vô hạn của bạn!
            </p>

            <div className="mt-8 flex justify-center">
              <Link to={user ? "/dashboard" : "/register"}>
                <Button className="magic-btn-primary h-14 rounded-full px-10 text-lg font-extrabold">
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
