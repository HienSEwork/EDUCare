import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Zap, Star, Heart, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import MoodTracker from "@/components/MoodTracker";
import AnonymousQuestionBox from "@/components/AnonymousQuestionBox";
import RandomAdvice from "@/components/RandomAdvice";

/* ── Shared variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.11, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Feature pill data ── */
const features = [
  { icon: BookOpen, label: "Lộ trình cá nhân hóa", bg: "bg-indigo-100", fg: "text-indigo-600" },
  { icon: Zap,      label: "Học mọi lúc",           bg: "bg-blue-100",   fg: "text-blue-600" },
  { icon: Users,    label: "Cộng đồng tích cực",    bg: "bg-cyan-100",   fg: "text-cyan-600" },
  { icon: Star,     label: "Kỹ năng thực tế",       bg: "bg-violet-100", fg: "text-violet-600" },
  { icon: Target,   label: "Tiến bộ mỗi ngày",      bg: "bg-sky-100",    fg: "text-sky-600" },
];

/* ── Journey steps ── */
const steps = [
  { emoji: "🔍", label: "Khám phá bản thân", bg: "from-blue-500 to-indigo-600" },
  { emoji: "🎯", label: "Đặt mục tiêu",      bg: "from-indigo-500 to-violet-600" },
  { emoji: "📖", label: "Học tập & rèn luyện",bg: "from-cyan-500 to-blue-600" },
  { emoji: "🚀", label: "Thực hành",          bg: "from-sky-500 to-indigo-600" },
  { emoji: "👑", label: "Tỏa sáng",           bg: "from-violet-500 to-purple-600" },
];

/* ── Course cards ── */
const courses = [
  {
    title: "Kỹ năng giao tiếp",
    badge: "Hot",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop&auto=format",
  },
  {
    title: "Quản lý thời gian",
    badge: "New",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&auto=format",
  },
  {
    title: "Tư duy tích cực",
    badge: "Hot",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format",
  },
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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  /* Parallax: hero image drifts slower than scroll */
  const heroImgY = useTransform(scrollY, [0, 600], [0, 80]);
  /* Parallax: blobs drift opposite direction */
  const blobY = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative -mt-24 overflow-hidden pb-0 pt-36 md:-mt-28 md:pt-44"
        style={{ background: "linear-gradient(160deg, #eef2ff 0%, #e0f2fe 40%, #ede9fe 100%)" }}
      >
        {/* Parallax blobs */}
        <motion.div style={{ y: blobY }} className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-300/60 to-indigo-400/40 blur-[120px]" />
          <div className="absolute -right-24 top-8 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-300/60 to-sky-400/40 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-t from-indigo-200/40 to-transparent blur-[80px]" />
          {/* Floating sparkles */}
          {[
            { top: "15%", left: "8%",  size: 10, color: "#818cf8", delay: 0 },
            { top: "25%", right: "6%", size: 14, color: "#7dd3fc", delay: 0.8 },
            { top: "60%", left: "5%",  size: 8,  color: "#38bdf8", delay: 1.4 },
            { top: "45%", right: "9%", size: 12, color: "#6366f1", delay: 0.4 },
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
          <div className="grid items-center gap-8 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:pb-0">

            {/* ── Left copy ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="z-10">

              {/* Eyebrow */}
              <motion.div variants={fadeUp} custom={0}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 backdrop-blur-sm shadow-sm"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  Nền tảng phát triển toàn diện cho teen
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1 variants={fadeUp} custom={1}
                className="font-heading text-5xl font-bold leading-[1.1] text-gray-900 md:text-[64px] lg:text-[72px]"
              >
                Hiểu mình hơn
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Tự tin tỏa sáng
                </span>
              </motion.h1>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-wrap gap-3">
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button size="lg"
                    className="group h-14 gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-8 text-base font-bold text-white shadow-[0_8px_32px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.04] hover:shadow-[0_12px_44px_rgba(79,70,229,0.52)]"
                  >
                    {user ? "Vào bảng học" : "Bắt đầu hành trình"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline"
                    className="h-14 rounded-full border-2 border-indigo-200 bg-white/60 px-8 text-base font-semibold backdrop-blur-sm hover:border-indigo-400 hover:bg-white/80"
                  >
                    Xem khóa học
                  </Button>
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={fadeUp} custom={3} className="mt-10 flex items-center gap-5">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-md" />
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-bold text-white shadow-md">
                    +999
                  </div>
                </div>
                <div>
                  <p className="font-heading text-lg font-bold text-gray-900">20K+ teen</p>
                  <p className="text-sm text-gray-500">đang đồng hành cùng EDUcare</p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Right: hero image with parallax ── */}
            <div className="relative hidden lg:flex lg:justify-end">
              {/* Glow circle behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-300/50 to-pink-300/50 blur-[80px]" />

              {/* Hero image — Unsplash teen/education */}
              <motion.div style={{ y: heroImgY }} className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=640&h=720&fit=crop&auto=format"
                  alt="Teens learning"
                  className="w-[440px] rounded-[2.5rem] object-cover shadow-[0_32px_100px_rgba(79,70,229,0.28)]"
                  style={{ maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}
                />
              </motion.div>

              {/* Floating card 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[-30px] top-20 z-20 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100">
                    <BookOpen className="h-4 w-4 text-indigo-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Kỹ năng giao tiếp</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute bottom-32 right-[-20px] z-20 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md"
              >
                <p className="text-xs font-bold text-pink-600">💜 Cộng đồng</p>
                <p className="mt-0.5 text-sm font-bold text-gray-800">500+ nhóm học tập</p>
                <p className="text-xs text-gray-500">95% hài lòng</p>
              </motion.div>

              {/* Quick nav pills (right side of hero like mockup) */}
              <div className="absolute right-[-100px] top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
                {[
                  { label: "Học tập", icon: "📚" },
                  { label: "Kỹ năng", icon: "⭐" },
                  { label: "Kết nối", icon: "💗" },
                  { label: "Phát triển", icon: "📊" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-2.5 shadow-md backdrop-blur-sm">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
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
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)]"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.bg}`}>
                  <f.icon className={`h-5 w-5 ${f.fg}`} strokeWidth={1.5} />
                </div>
                <span className="font-semibold text-gray-800">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave into courses */}
      <WaveDivider className="text-[#1e40af]" />

      {/* ════════════════════════════════════
          COURSES SPOTLIGHT
      ════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[380px_1fr]">

            {/* Left copy */}
            <div>
              <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-white/70"
              >
                Nổi bật
              </motion.p>
              <motion.h2 variants={fadeUp} custom={0.5} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="font-heading text-3xl font-bold leading-snug text-white md:text-4xl"
              >
                Khám phá<br />khóa học nổi bật
              </motion.h2>
              <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Link to="/courses"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Xem tất cả <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>

            {/* Course cards */}
            <div className="grid grid-cols-3 gap-4">
              {courses.map((c, i) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp} custom={i * 0.3}
                  initial="hidden" whileInView="show" viewport={{ once: true }}
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-shadow"
                >
                  <img src={c.img} alt={c.title} className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* badge */}
                  <span className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${c.badge === "Hot" ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"}`}>
                    {c.badge}
                  </span>
                  {/* bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-bold leading-tight text-white">{c.title}</p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-white/90 font-semibold">{c.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave out of courses */}
      <WaveDivider flip className="text-[#1e40af]" />

      {/* ════════════════════════════════════
          JOURNEY STEPS
      ════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-500">Lộ trình</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-gray-900 md:text-4xl">Hành trình của bạn</h2>
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
                    className={`flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${step.bg} text-3xl shadow-[0_8px_24px_rgba(0,0,0,0.18)]`}
                  >
                    {step.emoji}
                  </motion.div>
                  <p className="text-center text-sm font-bold text-gray-700">{step.label}</p>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="mx-4 hidden items-center md:flex">
                    <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-violet-300 to-pink-300" />
                    <ChevronRight className="h-4 w-4 -ml-1 text-violet-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TOOLS — Private zone (full-width dark)
      ════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #0c1445 100%)" }}
      >
        {/* ambient glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-10 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute -right-24 bottom-10 h-[350px] w-[350px] rounded-full bg-blue-500/15 blur-[90px]" />
          <div className="absolute left-1/2 top-0 h-[200px] w-[600px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />
        </div>

        <div className="container relative mx-auto px-4">
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10 text-center">
            {/* top bar label */}
            <div className="mb-6 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Khu vực riêng tư của bạn</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-white/40">Chỉ mình bạn</span>
              </div>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">Không gian cá nhân</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">Công cụ đồng hành</h2>
            <p className="mt-2 text-sm text-white/35">Riêng tư · An toàn · Không chia sẻ</p>
          </motion.div>

          {/* Cards grid */}
          <div className="grid gap-5 lg:grid-cols-3">
            <MoodTracker />
            <AnonymousQuestionBox />
            <RandomAdvice />
          </div>
        </div>
      </section>

      {/* Wave into community */}
      <WaveDivider className="text-[#1e3a8a]" />

      {/* ════════════════════════════════════
          COMMUNITY STATS + TESTIMONIAL
      ════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">

            {/* Stats card */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2rem] bg-white/10 p-8 backdrop-blur-sm border border-white/20"
            >
              {/* bg blob */}
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-[60px]" />
              <div className="flex items-center gap-2 text-white/70">
                <Heart className="h-4 w-4 fill-cyan-400 text-cyan-400" strokeWidth={0} />
                <span className="text-sm font-semibold">Cộng đồng EDUcare</span>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { val: "20K+", lbl: "Thành viên" },
                  { val: "500+", lbl: "Nhóm học tập" },
                  { val: "95%",  lbl: "Hài lòng" },
                ].map((s) => (
                  <div key={s.lbl}>
                    <p className="font-heading text-4xl font-bold text-white">{s.val}</p>
                    <p className="mt-1 text-sm text-white/60">{s.lbl}</p>
                  </div>
                ))}
              </div>
              {/* Avatar row */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop",
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60&h=60&fit=crop",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop",
                    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="h-9 w-9 rounded-full border-2 border-blue-800 object-cover" />
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-800 bg-white/20 text-xs font-bold text-white">
                    +999
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
                <div className="h-full w-full rounded-full bg-gradient-to-br from-pink-400 to-violet-500" />
              </div>
              <div>
                <p className="text-4xl text-violet-300">"</p>
                <p className="mt-1 text-lg font-medium leading-relaxed text-gray-700">
                  EDUcare đã giúp mình khám phá tiềm năng và kết nối với những người bạn tuyệt vời!
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop"
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
      <WaveDivider flip className="text-[#1e3a8a]" />

      {/* ════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center shadow-[0_24px_80px_rgba(79,70,229,0.28)]"
            style={{ background: "linear-gradient(135deg, #1e40af 0%, #4338ca 40%, #0ea5e9 100%)" }}
          >
            {/* Decorative blobs */}
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-sm" />
            <div className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-white/10 blur-sm" />
            {/* Floating stars */}
            {[
              { top: "20%", left: "8%", size: 20 },
              { top: "60%", left: "5%", size: 14 },
              { top: "30%", right: "7%", size: 18 },
              { top: "70%", right: "10%", size: 12 },
            ].map((s, i) => (
              <motion.span key={i} className="absolute text-white/40 select-none"
                style={{ top: s.top, left: "left" in s ? s.left : undefined, right: "right" in s ? s.right : undefined, fontSize: s.size }}
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
              >
                ✦
              </motion.span>
            ))}

            <div className="relative">
              <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                Sẵn sàng bắt đầu hành trình tỏa sáng?
              </h2>
              <p className="mt-3 text-white/80">Tham gia EDUcare ngay hôm nay!</p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="h-13 w-full max-w-xs rounded-full border-0 px-6 text-sm text-gray-800 shadow-lg outline-none ring-2 ring-transparent focus:ring-violet-300 sm:w-72"
                />
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button className="h-13 gap-2 rounded-full bg-white px-7 font-bold text-indigo-700 shadow-lg transition-all hover:scale-105 hover:bg-white/95 hover:shadow-xl">
                    Đăng ký miễn phí <ArrowRight className="h-4 w-4" />
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
