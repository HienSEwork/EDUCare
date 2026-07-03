import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Zap, Star, Heart, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import MoodTracker from "@/components/MoodTracker";
import AnonymousQuestionBox from "@/components/AnonymousQuestionBox";
import RandomAdvice from "@/components/RandomAdvice";

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

// Real FPT student assets uploaded by user
import imgFptHero from "@/assets/home/ImageBanner3.jpg";
import imgFptFriends from "@/assets/home/ImageBanner2.png";
import imgFptDiscuss from "@/assets/home/ImageBanner1.webp";
import imgFptConsent from "@/assets/home/ImageBanner4.webp";
import imgLogo from "@/assets/home/Logo.png";

// Game 3D graphics for USP highlight
import imgGameSafeSwipe from "@/assets/games/safe-swipe-3d.png";
import imgGameRedFlag from "@/assets/games/red-flag-hunt-3d.png";
import imgGameChatDetective from "@/assets/games/chat-detective-3d.png";

/* ── Shared variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.11, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ── Feature pill data — Sex Education Pillars ── */
const features = [
  { icon: BookOpen, label: "Ẩn danh & An toàn", bg: "bg-rose-100", fg: "text-rose-600" },
  { icon: Zap, label: "Hỏi không ngại", bg: "bg-teal-100", fg: "text-teal-600" },
  { icon: Users, label: "Hiểu cơ thể mình", bg: "bg-violet-100", fg: "text-violet-600" },
  { icon: Star, label: "Tình cảm lành mạnh", bg: "bg-orange-100", fg: "text-orange-600" },
  { icon: Target, label: "Tự tin là chính mình", bg: "bg-cyan-100", fg: "text-cyan-600" },
];

/* ── Puberty & Growth Map steps ── */
const steps = [
  { emoji: "🤔", label: "Tò mò & Thắc mắc", bg: "from-pink-400 to-rose-500" },
  { emoji: "🔍", label: "Tìm hiểu & Khám phá", bg: "from-purple-400 to-violet-500" },
  { emoji: "💬", label: "Chia sẻ & Kết nối", bg: "from-teal-400 to-emerald-500" },
  { emoji: "💪", label: "Tự tin & Ranh giới", bg: "from-orange-400 to-amber-500" },
  { emoji: "🌈", label: "Tỏa sáng là chính mình", bg: "from-cyan-400 to-sky-500" },
];

/* ── Sex-Ed Focus Course cards ── */
const courses = [
  { title: "Cơ thể & Tuổi dậy thì", badge: "Hot", rating: "4.9", img: imgFptDiscuss },
  { title: "Đồng thuận F.R.I.E.S là gì?", badge: "New", rating: "4.9", img: imgFptConsent },
  { title: "An toàn khi hẹn hò", badge: "Hot", rating: "4.8", img: imgFptFriends },
];

/* ── Wave SVG divider ── */
function WaveDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <div className={`pointer-events-none overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
      <svg viewBox="0 0 1440 72" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-20">
        <path
          d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/* ── Main component ── */
export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ctaQuestion, setCtaQuestion] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  /* Parallax: hero image drifts slower than scroll */
  const heroImgY = useTransform(scrollY, [0, 600], [0, 80]);
  /* Parallax: blobs drift opposite direction */
  const blobY = useTransform(scrollY, [0, 600], [0, -60]);

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctaQuestion.trim()) return;
    if (user) {
      navigate(`/community?question=${encodeURIComponent(ctaQuestion.trim())}`);
    } else {
      navigate(`/register?question=${encodeURIComponent(ctaQuestion.trim())}`);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ════════════════════════════════════
          HERO — CONFIDENTIAL SAFE SPACE
      ════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative -mt-24 overflow-hidden pb-8 pt-36 md:-mt-28 md:pt-44"
        style={{ background: "linear-gradient(160deg, #fff5f7 0%, #f0fdfa 40%, #faf5ff 100%)" }}
      >
        {/* Parallax blobs */}
        <motion.div style={{ y: blobY }} className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-pink-300/40 to-rose-400/20 blur-[120px]" />
          <div className="absolute -right-24 top-8 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-300/30 to-mint-400/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-t from-lavender-200/30 to-transparent blur-[80px]" />
          {/* Floating sparkles */}
          {[
            { top: "15%", left: "8%", size: 10, color: "#f43f5e", delay: 0 },
            { top: "25%", right: "6%", size: 14, color: "#0d9488", delay: 0.8 },
            { top: "60%", left: "5%", size: 8, color: "#a855f7", delay: 1.4 },
            { top: "45%", right: "9%", size: 12, color: "#fb7185", delay: 0.4 },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-70"
              style={{ top: s.top, left: "left" in s ? s.left : undefined, right: "right" in s ? s.right : undefined, width: s.size, height: s.size, background: s.color }}
              animate={{ y: [0, -14, 0], scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        <div className="container mx-auto px-4">
          <div className="grid items-center gap-8 pb-16 lg:grid-cols-[0.95fr_1.05fr] lg:pb-0">

            {/* ── Left copy ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="z-10">

              {/* Eyebrow */}
              <motion.div variants={fadeUp} custom={0}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-2 backdrop-blur-sm shadow-sm"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-rose-600">
                  🔒 Không gian an toàn về giới tính & tâm sinh lý
                </span>
              </motion.div>

              {/* Logo pill next to slogan */}
              <div className="flex flex-wrap items-center gap-3.5 mb-4">
                <div className="inline-flex items-center rounded-full border border-pink-200/80 bg-white/90 p-1 shadow-sm">
                  <img
                    src={imgLogo}
                    alt="EDUcare Logo"
                    className="h-14 w-14 shrink-0 rounded-full object-cover shadow-sm border border-pink-100 contrast-[1.12] saturate-[1.3]"
                  />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-teal-600">
                  Giáo dục giới tính
                </span>
              </div>

              {/* H1 */}
              <motion.h1 variants={fadeUp} custom={1}
                className="font-heading text-5xl font-extrabold leading-[1.1] text-gray-900 md:text-[56px] lg:text-[64px]"
              >
                Hiểu mình hơn
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Tự tin tỏa sáng
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p variants={fadeUp} custom={1.5}
                className="mt-6 text-base font-medium leading-relaxed text-gray-600 max-w-xl"
                style={{ textWrap: "pretty" }}
              >
                Có những câu hỏi thầm kín bạn ngại mở lời, những bối rối không biết tâm sự cùng ai?
                <br />
                Hãy chia sẻ cùng chúng tôi — Mọi bí mật của bạn sẽ được giữ kín tuyệt đối.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button size="lg"
                    className="group h-14 gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 text-base font-bold text-white shadow-[0_8px_32px_rgba(244,63,94,0.25)] transition-all hover:scale-[1.04] hover:shadow-[0_12px_44px_rgba(244,63,94,0.35)]"
                  >
                    Chia sẻ ẩn danh ngay
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline"
                    className="h-14 rounded-full border-2 border-pink-200 bg-white/60 px-8 text-base font-semibold backdrop-blur-sm hover:border-pink-400 hover:bg-white/80"
                  >
                    Khám phá bài học
                  </Button>
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={fadeUp} custom={2.5} className="mt-10 flex items-center gap-5">
                <div className="flex -space-x-3">
                  {[imgAvatarGirl1, imgAvatarBoy1, imgAvatarGirl2, imgAvatarBoy2].map((src, i) => (
                    <img key={i} src={src} alt="" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-md" />
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-pink-500 to-rose-400 text-xs font-bold text-white shadow-md">
                    +99
                  </div>
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-gray-900">Không gian chia sẻ</p>
                  <p className="text-xs text-gray-500">đang đồng hành cùng hàng ngàn teen Việt</p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Right: hero image with parallax & floating elements ── */}
            <div className="relative flex justify-center lg:justify-end w-full">
              {/* Large ambient glow behind image to fill background space */}
              <div className="absolute -inset-4 w-[110%] h-[110%] rounded-full bg-gradient-to-br from-pink-300/20 via-rose-300/10 to-teal-300/20 blur-[90px]" />

              {/* Hero image — Vietnamese student assets (enlarged for landscape banner) */}
              <motion.div style={{ y: heroImgY }} className="relative z-10 w-full max-w-[540px] lg:max-w-[660px]">
                <img
                  src={imgFptHero}
                  alt="FPT Students learning together"
                  className="w-full rounded-[2.5rem] object-cover shadow-card border-4 border-white/60"
                />
              </motion.div>

              {/* Floating card 1 - sits elegantly on the left edge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[-20px] lg:left-[-50px] top-6 z-20 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100">
                    <BookOpen className="h-4 w-4 text-pink-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Cơ thể tuổi dậy thì</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 2 - sits elegantly on the bottom right edge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute bottom-6 right-[-20px] lg:right-[-40px] z-20 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md"
              >
                <p className="text-xs font-bold text-pink-600">💜 Cộng đồng</p>
                <p className="mt-0.5 text-sm font-bold text-gray-800">500+ nhóm thảo luận</p>
                <p className="text-xs text-gray-500">95% hài lòng</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <WaveDivider className="text-white" />
      </section>

      {/* ════════════════════════════════════
          FEATURE PILLS
      ════════════════════════════════════ */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                variants={fadeUp} custom={i * 0.4}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                whileHover={{ scale: 1.06, y: -4 }}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_30px_rgba(244,63,94,0.12)]"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.fg}`} strokeWidth={1.5} />
                </div>
                <span className="font-bold text-gray-800 text-sm">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave into courses */}
      <WaveDivider className="text-pink-500" />

      {/* ════════════════════════════════════
          COURSES SPOTLIGHT — SEX-ED HANDBOOKS
      ════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-teal-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[380px_1fr]">

            {/* Left copy */}
            <div>
              <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-white/80"
              >
                Chuyên đề
              </motion.p>
              <motion.h2 variants={fadeUp} custom={0.5} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-heading text-3xl font-extrabold leading-snug text-white md:text-4xl"
              >
                Khám phá<br />chuyên đề nổi bật
              </motion.h2>
              <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Link to="/courses"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Xem tất cả <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>

            {/* Course cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c, i) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp} custom={i * 0.3}
                  initial="hidden" whileInView="show" viewport={{ once: true }}
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-shadow"
                >
                  <img src={c.img} alt={c.title} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  {/* badge */}
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${c.badge === "Hot" ? "bg-rose-500 text-white shadow-soft" : "bg-teal-500 text-white shadow-soft"}`}>
                    {c.badge}
                  </span>
                  {/* bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-base font-extrabold leading-tight text-white">{c.title}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-white/90 font-bold">{c.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave out of courses */}
      <WaveDivider flip className="text-teal-600" />

      {/* ════════════════════════════════════
          JOURNEY STEPS — PUBERTY ROADMAP
      ════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12 text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-500">Lớn khôn</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-gray-900 md:text-4xl">Bản đồ lớn khôn của bạn</h2>
          </motion.div>

          <div className="flex flex-wrap items-start justify-center gap-6 md:flex-nowrap md:gap-0">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <motion.div
                  variants={fadeUp} custom={i * 0.2}
                  initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.12, rotate: 4 }}
                    className={`flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${step.bg} text-3xl shadow-[0_8px_24px_rgba(0,0,0,0.12)]`}
                  >
                    {step.emoji}
                  </motion.div>
                  <p className="text-center text-sm font-bold text-gray-700">{step.label}</p>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="mx-4 hidden items-center md:flex">
                    <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-pink-300 to-teal-300" />
                    <ChevronRight className="h-4 w-4 -ml-1 text-teal-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          INTERACTIVE GAMES SECTION (USP & SIGNATURE)
      ════════════════════════════════════ */}
      <section className="bg-slate-50 py-16 border-t border-b border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex rounded-full bg-pink-100 px-4 py-1 text-xs font-extrabold uppercase tracking-[0.22em] text-pink-600 shadow-sm mb-3">
              Góc trải nghiệm tương tác
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-gray-900 md:text-3xl leading-tight">
              Học giới tính qua trò chơi
            </h2>
            <p className="mt-3 text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
              Vừa chơi game vừa gỡ rối những thắc mắc thầm kín một cách tự nhiên. Khám phá các thử thách độc bản, thiết kế riêng giúp bạn tự tin gạt bỏ lúng túng.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                title: "Vuốt chạm an toàn",
                desc: "Nhận diện ranh giới và sự đồng thuận trong các mối quan hệ bằng thao tác vuốt chạm thú vị.",
                img: imgGameSafeSwipe,
                color: "from-pink-400/10 via-rose-400/5 to-transparent",
                border: "border-pink-200/50 hover:border-pink-400",
                badge: "Hot",
                badgeBg: "bg-pink-500",
              },
              {
                title: "Săn cờ đỏ ranh giới",
                desc: "Săn tìm các dấu hiệu độc hại (red flags) ẩn giấu trong tình bạn và tình cảm tuổi học trò.",
                img: imgGameRedFlag,
                color: "from-purple-400/10 via-violet-400/5 to-transparent",
                border: "border-purple-200/50 hover:border-purple-400",
                badge: "New",
                badgeBg: "bg-purple-500",
              },
              {
                title: "Thám tử trò chuyện",
                desc: "Giải mã tin nhắn nhạy cảm, học cách nhận diện cạm bẫy và tự bảo vệ mình trên mạng xã hội.",
                img: imgGameChatDetective,
                color: "from-teal-400/10 via-cyan-400/5 to-transparent",
                border: "border-teal-200/50 hover:border-teal-400",
                badge: "Hot",
                badgeBg: "bg-teal-500",
              },
            ].map((g, idx) => (
              <motion.div
                key={g.title}
                variants={fadeUp} custom={idx * 0.25}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group flex flex-col justify-between overflow-hidden rounded-[1.8rem] border-2 ${g.border} bg-white p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all`}
              >
                <div>
                  <div className={`relative h-40 md:h-44 w-full rounded-2xl bg-gradient-to-br ${g.color} p-3 flex items-center justify-center overflow-hidden`}>
                    <span className={`absolute left-3 top-3 rounded-full ${g.badgeBg} px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm`}>
                      {g.badge}
                    </span>
                    <img
                      src={g.img}
                      alt={g.title}
                      className="max-h-[110px] md:max-h-[125px] object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                    />
                  </div>
                  <h3
                    style={{ textWrap: "pretty" }}
                    className="mt-4 font-heading text-[15px] md:text-base font-extrabold text-gray-900 group-hover:text-pink-600 transition-colors"
                  >
                    {g.title}
                  </h3>
                  <p
                    style={{ textWrap: "pretty" }}
                    className="mt-2 text-[12px] md:text-[13px] text-gray-500 leading-relaxed font-medium"
                  >
                    {g.desc}
                  </p>
                </div>
                <div className="mt-4.5 pt-3 border-t border-gray-50">
                  <Link to="/games">
                    <Button variant="ghost" className="w-full h-9 rounded-full bg-slate-50 font-bold text-xs text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                      Chơi ngay thôi!
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave into Private Zone */}
      <WaveDivider className="text-[#2d1b33]" />

      {/* ════════════════════════════════════
          TOOLS — Private zone (full-width dark)
      ════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #2d1b33 0%, #1a2233 45%, #1f2b3d 100%)" }}
      >
        {/* ambient glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-10 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-[100px]" />
          <div className="absolute -right-24 bottom-10 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[90px]" />
          <div className="absolute left-1/2 top-0 h-[200px] w-[600px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[80px]" />
        </div>

        <div className="container relative mx-auto px-4">
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mb-10 flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between"
          >
            <div>
              {/* breadcrumb bar */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-pink-400" />
                  <span className="h-2 w-2 rounded-full bg-teal-400/60" />
                  <span className="h-2 w-2 rounded-full bg-purple-400/30" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400/80">Góc riêng tư của bạn</span>
                <div className="flex items-center gap-1.5 rounded-full border border-pink-400/20 bg-pink-500/10 px-2.5 py-0.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
                  <span className="text-[10px] font-bold text-white/70">Bảo mật tuyệt đối</span>
                </div>
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
                Nhật ký &<br className="hidden sm:block" /> Câu hỏi ẩn danh
              </h2>
              <p className="mt-2 text-sm text-white/60 font-medium">Hãy chia sẻ cùng chúng tôi — Những bí mật của bạn chúng tôi sẽ giữ kín tuyệt đối.</p>
            </div>
            {/* decorative divider right */}
            <div className="hidden h-px flex-1 bg-gradient-to-r from-pink-500/30 to-transparent md:block" />
          </motion.div>

          {/* 2-col layout: MoodTracker left (wider) | right column stacked */}
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left — MoodTracker */}
            <MoodTracker />

            {/* Right — stacked AnonymousQuestionBox + RandomAdvice */}
            <div className="flex flex-col gap-5">
              <AnonymousQuestionBox />
              <RandomAdvice />
            </div>
          </div>
        </div>
      </section>

      {/* Wave into community */}
      <WaveDivider className="text-pink-100/80" />

      {/* ════════════════════════════════════
          COMMUNITY STATS + TESTIMONIAL
      ════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-pink-100/90 via-purple-100/80 to-teal-100/90 py-20 border-t border-b border-purple-200/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">

            {/* Stats card */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2rem] bg-white p-8 border border-purple-100/60 shadow-lg shadow-purple-100/20"
            >
              {/* bg blob */}
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-[60px]" />
              <div className="flex items-center gap-2 text-gray-700">
                <Heart className="h-4 w-4 fill-pink-400 text-pink-400" strokeWidth={0} />
                <span className="text-sm font-bold">Cộng đồng EDUcare</span>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { val: "20K+", lbl: "Thành viên" },
                  { val: "500+", lbl: "Nhóm thảo luận" },
                  { val: "95%", lbl: "Hài lòng" },
                ].map((s) => (
                  <div key={s.lbl}>
                    <p className="font-heading text-4xl font-extrabold text-pink-600">{s.val}</p>
                    <p className="mt-1 text-sm text-gray-500">{s.lbl}</p>
                  </div>
                ))}
              </div>
              {/* Avatar row */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[imgAvatarGirl3, imgAvatarGirl4, imgAvatarBoy3, imgAvatarGirl5].map((src, i) => (
                    <img key={i} src={src} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-pink-100 text-xs font-extrabold text-pink-600">
                    +99
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial card */}
            <motion.div
              variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl"
            >
              {/* decorative heart */}
              <div className="absolute -right-8 -top-8 h-40 w-40 opacity-10">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-pink-400 to-rose-500" />
              </div>
              <div>
                <p className="text-4xl text-pink-400">"</p>
                <p className="mt-1 text-lg font-bold leading-relaxed text-gray-700">
                  EDUcare đã giúp mình gỡ rối những thay đổi nhạy cảm của cơ thể tuổi dậy thì, đồng thời hiểu rõ thế nào là ranh giới đồng thuận mà không sợ bị bất kỳ ai phán xét.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={imgAvatarGirl1}
                    alt="Minh Anh"
                    className="h-12 w-12 rounded-full object-cover shadow-md"
                  />
                  <div>
                    <p className="font-bold text-gray-800">Minh Anh</p>
                    <p className="text-sm text-gray-500">Học sinh lớp 11</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wave out of community */}
      <WaveDivider flip className="text-teal-100/80" />

      {/* ════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center shadow-[0_20px_50px_rgba(244,63,94,0.1)]"
            style={{ background: "linear-gradient(135deg, #fbcfe8 0%, #e9d5ff 50%, #99f6e4 100%)" }}
          >
            {/* Decorative blobs */}
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/40 blur-sm" />
            <div className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-white/40 blur-sm" />
            {/* Floating stars */}
            {[
              { top: "20%", left: "8%", size: 20 },
              { top: "60%", left: "5%", size: 14 },
              { top: "30%", right: "7%", size: 18 },
              { top: "70%", right: "10%", size: 12 },
            ].map((s, i) => (
              <motion.span key={i} className="absolute text-pink-500/30 select-none"
                style={{ top: s.top, left: "left" in s ? s.left : undefined, right: "right" in s ? s.right : undefined, fontSize: s.size }}
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
              >
                ✦
              </motion.span>
            ))}

            <div className="relative">
              <h2 className="font-heading text-3xl font-extrabold text-gray-900 md:text-[40px] tracking-tight leading-tight">
                Hãy chia sẻ cùng chúng tôi!
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                Những bối rối tuổi dậy thì, những thắc mắc thầm kín không biết tỏ cùng ai?
                <br />
                Đừng giữ trong lòng — những bí mật của bạn chúng tôi sẽ giữ kín tuyệt đối.
              </p>

              <div className="mt-8 flex justify-center">
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button className="h-14 gap-2.5 rounded-full bg-white px-10 text-base font-extrabold text-pink-600 shadow-lg transition-all hover:scale-105 hover:bg-white/95 hover:shadow-xl">
                    Bắt đầu hành trình ngay 🚀
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
