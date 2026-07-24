import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Heart,
  Shield,
  Sparkles,
  Target,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  GraduationCap,
  Bot,
  School,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api/client";
import type { PublicStatsResponse } from "@/types/api";

import avatarBoy1 from "@/assets/home/avatar-boy1.jpg";
import avatarBoy2 from "@/assets/home/avatar-boy2.jpg";
import avatarBoy3 from "@/assets/home/avatar-boy3.jpg";
import avatarGirl1 from "@/assets/home/avatar-girl1.jpg";
import avatarGirl2 from "@/assets/home/avatar-girl2.jpg";

const coreValues = [
  {
    icon: ShieldCheck,
    title: "Chuẩn Y Khoa & An Toàn",
    description: "Nội dung được thẩm định kỹ lưỡng bởi chuyên gia y tế & tâm lý học đường, đảm bảo chính xác và an toàn tuyệt đối.",
    color: "#06b6d4",
  },
  {
    icon: Heart,
    title: "Đồng Hành Không Phán Xét",
    description: "Tạo không gian cởi mở, lắng nghe tôn trọng và giải đáp mọi thắc mắc nhạy cảm một cách tinh tế.",
    color: "#ec4899",
  },
  {
    icon: Compass,
    title: "Game Hóa Tương Tác",
    description: "Truyền tải kiến thức tự nhiên qua mini game 3D, trắc nghiệm phản xạ và kịch bản tương tác sinh động.",
    color: "#f59e0b",
  },
  {
    icon: Shield,
    title: "Bảo Mật Quyền Riêng Tư",
    description: "Cam kết bảo vệ dữ liệu người dùng 100%, tạo môi trường trải nghiệm hoàn toàn ẩn danh và an tâm.",
    color: "#10b981",
  },
] as const;

const teamMembers = [
  {
    name: "Nguyễn Đỗ Anh Khoa",
    role: "CEO & Trưởng Dự Án",
    avatar: avatarBoy1,
    quote: "Định hướng chiến lược và quản lý tổng thể dự án EDUcare, mang nguồn tri thức chuẩn y khoa tới thế hệ trẻ.",
    badge: "CEO - Leader",
  },
  {
    name: "Nguyễn Ngọc Hiển",
    role: "Tech Lead",
    avatar: avatarBoy2,
    quote: "Xây dựng kiến trúc hệ thống mượt mà, bảo mật cao và vận hành toàn bộ hạ tầng kỹ thuật của dự án.",
    badge: "Tech Lead",
  },
  {
    name: "Mai Văn Chí Khanh",
    role: "Marketing & Brand Lead",
    avatar: avatarGirl1,
    quote: "Phụ trách chiến lược truyền thông, nhận diện thương hiệu và lan tỏa giá trị EDUcare tới cộng đồng tuổi teen.",
    badge: "Marketing Lead",
  },
  {
    name: "Lê Thế Vinh",
    role: "Content & Full-Stack Dev",
    avatar: avatarBoy3,
    quote: "Thu thập & biên soạn nội dung y tế chuẩn xác, đồng thời tham gia lập trình phát triển các tính năng nền tảng.",
    badge: "Content & Dev",
  },
  {
    name: "Nguyễn Trường Thịnh",
    role: "Content & System Dev",
    avatar: avatarGirl2,
    quote: "Nghiên cứu thu thập tư liệu giáo dục giới tính và phát triển tích hợp các mô-đun chức năng hệ thống.",
    badge: "Content & Dev",
  },
] as const;

export default function AboutPage() {
  const [stats, setStats] = useState<PublicStatsResponse | null>(null);

  useEffect(() => {
    apiRequest<PublicStatsResponse>("/public/stats")
      .then((data) => setStats(data))
      .catch(() => null);
  }, []);

  const totalUsersText = stats ? `${stats.totalUsers}+` : "104+";
  const totalLessonsText = stats ? `${stats.totalLessons}+` : "50+";
  const totalPostsText = stats ? `${stats.totalBlogPosts}+` : "6+";
  const totalCoursesText = stats ? `${stats.totalCourses}+` : "4+";

  const milestones = [
    {
      stage: "02/2026",
      badge: "Khởi Động",
      title: "Khởi Động & Xây Dựng Dự Án",
      description: "Chính thức khởi động dự án từ tháng 2/2026, lên kế hoạch chi tiết, dựng thiết kế giao diện web cơ bản và đăng tải các khóa học khởi đầu.",
      color: "#06b6d4",
    },
    {
      stage: "Hiện Nay",
      badge: "Vận Hành Thực Tế",
      title: "Hệ Sinh Thái Vận Hành Hoàn Chỉnh",
      description: `Website đã đi vào hoạt động với ${totalCoursesText} khóa học chuẩn y khoa, ${totalLessonsText} bài học & micro-lessons, ${totalPostsText} bài viết kiến thức, mini game 3D và tiếp cận ${totalUsersText} người dùng đồng hành thực tế từ Database.`,
      color: "#10b981",
    },
    {
      stage: "Tương Lai",
      badge: "Mở Rộng Strategic",
      title: "Ứng Dụng AI & Kết Nối Trường Học",
      description: "Phát triển tính năng trợ lý AI tư vấn tâm lý 24/7, co-work & mở rộng hợp tác với các trường học trên toàn quốc, tổ chức các sự kiện & workshop kỹ năng sống trực tiếp.",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto space-y-14 px-4 max-w-6xl">
        {/* Hero Header Section */}
        <section className="text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex rounded-none border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              ✨ DỰ ÁN EDUCARE · VỀ CHÚNG TÔI
            </span>
            <h1 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              Hệ Sinh Thái Giáo Dục Giới Tính <br />
              <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
                & Kỹ Năng Sống Cho Tuổi Teen
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-indigo-100/80 font-medium">
              EDUcare ra đời với mục tiêu xóa bỏ định kiến, mang đến nguồn kiến thức chuẩn y khoa, dễ tiếp cận và nhân văn — đồng hành cùng thế hệ trẻ tự tin làm chủ sức khỏe & hạnh phúc bản thân.
            </p>
          </motion.div>

          {/* Dynamic Stats Chips Grid (Queried from DB) */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
            {[
              { label: "Người Dùng Tiếp Cận", value: totalUsersText },
              { label: "Bài Học Chuẩn Y Khoa", value: totalLessonsText },
              { label: "Bài Viết Chia Sẻ", value: totalPostsText },
              { label: "Khóa Học Trên Nền Tảng", value: totalCoursesText },
            ].map((stat) => (
              <div key={stat.label} className="rounded-none border border-indigo-400/30 bg-slate-900/60 backdrop-blur-md p-4 text-center shadow-lg hover:border-cyan-400/50 transition-all">
                <p className="text-2xl md:text-3xl font-black text-cyan-300">{stat.value}</p>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-indigo-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-none border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-none bg-indigo-950/80 border border-cyan-400/40 text-cyan-300">
                  <Target className="h-6 w-6" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300">Sứ Mệnh Chiến Lược</span>
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-white">Xóa Bỏ Rào Cản – Trang Bị Tri Thức</h3>
              <p className="mt-4 leading-relaxed text-indigo-100/80 text-sm md:text-base font-medium">
                Xây dựng môi trường học tập cởi mở, trang bị kỹ năng chăm sóc sức khỏe sinh sản, tâm lý học đường và bảo vệ bản thân trên không gian mạng một cách khoa học, văn minh và không phán xét.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-500/20 flex items-center gap-2 text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Nội dung đã kiểm duyệt y tế</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-none border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-none bg-indigo-950/80 border border-amber-400/40 text-amber-300">
                  <Sparkles className="h-6 w-6" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">Tầm Nhìn Dài Hạn</span>
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-white">Nền Tảng Giáo Dục Số 1 Cho Tuổi Teen</h3>
              <p className="mt-4 leading-relaxed text-indigo-100/80 text-sm md:text-base font-medium">
                Trở thành hệ sinh thái giáo dục sức khỏe sinh sản & kỹ năng sống tương tác hàng đầu tại Việt Nam, cầu nối tin cậy giữa nhà trường, gia đình và thế hệ trẻ trên hành trình trưởng thành.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-500/20 flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Tiên phong ứng dụng Gamification & AI</span>
            </div>
          </motion.div>
        </section>

        {/* Core Values Section */}
        <section>
          <div className="mb-8 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300">NGUYÊN TẮC HOẠT ĐỘNG</span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-white md:text-4xl">Giá Trị Cốt Lõi Của Dự Án</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-none border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl hover:border-cyan-400/50 transition-all"
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-none border shadow-md"
                  style={{ backgroundColor: value.color + "18", borderColor: value.color + "55" }}
                >
                  <value.icon className="h-7 w-7" style={{ color: value.color }} />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-white">{value.title}</h3>
                <p className="mt-3 text-xs md:text-sm leading-relaxed text-indigo-100/80 font-medium">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Members Section (5 Members Horizontal Row) */}
        <section>
          <div className="mb-10 text-center">
            <span className="inline-flex rounded-none border border-indigo-400/30 bg-indigo-950/60 px-4 py-1.5 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-2">
              <Users className="h-3.5 w-3.5 mr-1.5" /> ĐỘI NGŨ THỰC HIỆN (5 THÀNH VIÊN)
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">Đội Ngũ Phía Sau Dự Án EDUcare</h2>
            <p className="mt-2 text-sm text-indigo-100/70 max-w-2xl mx-auto font-medium">
              Sự kết hợp giữa điều hành chiến lược, kỹ thuật công nghệ, truyền thông marketing và thu thập phát triển nội dung.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group rounded-none border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between hover:border-cyan-400/60 transition-all duration-300"
              >
                <div>
                  {/* Member Avatar */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-none border border-slate-700/50 mb-4 bg-slate-950">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 rounded-none border border-cyan-400/40 bg-slate-950/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                      {member.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-[11px] font-extrabold text-indigo-300 mt-1 uppercase tracking-wider">{member.role}</p>
                  <p className="mt-2.5 text-xs leading-relaxed text-indigo-100/80 font-medium italic">
                    "{member.quote}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Project Roadmap Timeline (3 Stages) */}
        <section className="rounded-none border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300">HÀNH TRÌNH DỰ ÁN</span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-white">Cột Mốc & Kế Hoạch Phát Triển</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {milestones.map((item) => (
              <div key={item.stage} className="relative rounded-none border border-indigo-400/20 bg-indigo-950/40 p-6 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-cyan-400">{item.stage}</span>
                    <span className="rounded-none border border-cyan-400/30 bg-cyan-950/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-white">{item.title}</h3>
                  <p className="mt-3 text-xs md:text-sm text-indigo-100/80 font-medium leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call To Action Banner */}
        <section className="text-center">
          <div className="mx-auto max-w-4xl rounded-none border border-indigo-500/30 bg-slate-900/60 p-10 backdrop-blur-xl shadow-2xl">
            <h2 className="font-heading font-extrabold text-white text-2xl md:text-3xl">
              Sẵn Sàng Khám Phá Kiến Thức & Trải Nghiệm Cùng EDUcare?
            </h2>
            <p className="text-sm md:text-base text-indigo-100/80 font-medium mt-3 max-w-2xl mx-auto">
              Bắt đầu bài học thử nghiệm đầu tiên hoặc tham gia các thử thách Mini Game tình huống 3D ngay hôm nay.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button className="rounded-none bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-8 py-6 text-sm font-black text-white uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all" asChild>
                <Link to="/courses">
                  <GraduationCap className="mr-2 h-5 w-5" /> Khám phá khóa học
                </Link>
              </Button>
              <Button variant="outline" className="rounded-none border-indigo-400/30 bg-indigo-950/50 px-8 py-6 text-sm font-black text-indigo-200 hover:bg-indigo-900/80 uppercase tracking-wider" asChild>
                <Link to="/games">
                  <span>Trải nghiệm Mini Game</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
