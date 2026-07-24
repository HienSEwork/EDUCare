import { motion } from "framer-motion";
import type { Course } from "@/types/api";

import healthyWater from "@/assets/blog/healthy-water.jpg";
import sleepNight from "@/assets/blog/sleep-night.jpg";
import friendshipOutdoor from "@/assets/blog/friendship-outdoor.jpg";
import phoneSafety from "@/assets/blog/phone-safety.jpg";
import studyFocus from "@/assets/blog/study-focus.jpg";
import confidentTeen from "@/assets/blog/confident-teen.jpg";
import imgFptHero from "@/assets/home/ImageBanner3.jpg";
import imgFptFriends from "@/assets/home/ImageBanner2.png";
import imgFptDiscuss from "@/assets/home/ImageBanner1.webp";
import imgFptConsent from "@/assets/home/ImageBanner4.webp";
import quizQuick3d from "@/assets/games/quiz-quick-3d.png";
import safeSwipe3d from "@/assets/games/safe-swipe-3d.png";
import chatDetective3d from "@/assets/games/chat-detective-3d.png";
import redFlagHunt3d from "@/assets/games/red-flag-hunt-3d.png";
import emotionSort3d from "@/assets/games/emotion-sort-3d.png";
import teenPath3d from "@/assets/games/teen-path-3d.png";
import mythBuster3d from "@/assets/games/myth-buster-3d.png";
import flashRun3d from "@/assets/games/flash-run-3d.png";

interface NotebookCourseCardProps {
  course: Course;
  index?: number;
  onClick?: () => void;
}

const NOTEBOOK_THEMES = [
  {
    bg: "from-pink-500 via-rose-500 to-rose-600",
    border: "border-pink-300/40",
    badge: "12 bài học • Dễ hiểu",
    age: "Dành cho: 13-18 tuổi",
  },
  {
    bg: "from-indigo-500 via-purple-600 to-indigo-700",
    border: "border-indigo-300/40",
    badge: "10 bài học • Thực tế",
    age: "Dành cho: 13-18 tuổi",
  },
  {
    bg: "from-sky-400 via-blue-500 to-sky-600",
    border: "border-sky-300/40",
    badge: "14 bài học • Cơ bản",
    age: "Dành cho: 12-18 tuổi",
  },
  {
    bg: "from-amber-400 via-orange-500 to-amber-600",
    border: "border-amber-300/40",
    badge: "16 bài học • Cơ bản",
    age: "Dành cho: 10-18 tuổi",
  },
  {
    bg: "from-teal-400 via-emerald-500 to-teal-600",
    border: "border-teal-300/40",
    badge: "12 bài học • Ứng dụng",
    age: "Dành cho: 13-17 tuổi",
  },
  {
    bg: "from-purple-500 via-violet-600 to-purple-800",
    border: "border-purple-300/40",
    badge: "11 bài học • Thực hành",
    age: "Dành cho: 13-18 tuổi",
  },
];

// Exact 1-to-1 Course ID to Unique Cover Image Mapping
const COURSE_COVER_MAP: Record<string, string> = {
  "4": imgFptHero,          // Tự Tin Lớn Lên, Tự Chủ Khám Phá
  "5": friendshipOutdoor,   // Mối Quan Hệ Lành Mạnh
  "6": phoneSafety,         // Lướt Mạng Tỉnh Táo, Kết Nối Cực Chất
  "10": teenPath3d,         // Dậy Thì Thành Công: Cẩm Nang Upgrade Bản Thân!
  "11": emotionSort3d,      // Tâm Lý Tuổi Teen: Gỡ Rối Bão Cảm Xúc!
  "22": imgFptConsent,      // Yêu An Toàn, Tránh Thai Chủ Động
  "25": confidentTeen,      // Bản Đồ Bản Thân: Tự Tin Khám Phá Giới & Bản Dạng
  "27": redFlagHunt3d,      // Kỹ Năng Phòng Chống Xâm Hại & Tự Bảo Vệ
  "33": studyFocus,         // Chăm Sóc Cảm Xúc & Ứng Phó Áp Lực Bạn Bè
  "35": healthyWater,       // Sức Khỏe Tuổi Dậy Thì & Chăm Sóc Cơ Thể
  "37": imgFptDiscuss,      // Kỹ Năng Giao Tiếp & Giải Quyết Xung Đột
};

function getCourseCoverPhoto(course: Course, index: number): string {
  // 1. Direct ID Match
  if (course.id && COURSE_COVER_MAP[String(course.id)]) {
    return COURSE_COVER_MAP[String(course.id)];
  }

  // 2. Direct External Thumbnail check
  if (course.thumbnail && course.thumbnail.startsWith("http")) {
    return course.thumbnail;
  }

  // 3. Keyword Title Match
  const title = (course.title || "").toLowerCase();

  if (title.includes("tránh thai") || title.includes("yêu an toàn")) return imgFptConsent;
  if (title.includes("mối quan hệ") || title.includes("bạn bè")) return friendshipOutdoor;
  if (title.includes("chăm sóc cơ thể") || title.includes("sức khỏe tuổi")) return healthyWater;
  if (title.includes("dậy thì thành công") || title.includes("upgrade")) return teenPath3d;
  if (title.includes("gỡ rối") || title.includes("bão cảm xúc") || title.includes("tâm lý tuổi teen")) return emotionSort3d;
  if (title.includes("lướt mạng") || title.includes("kết nối cực chất")) return phoneSafety;
  if (title.includes("tự tin lớn lên") || title.includes("tự chủ khám phá")) return imgFptHero;
  if (title.includes("giao tiếp") || title.includes("xung đột")) return imgFptDiscuss;
  if (title.includes("áp lực bạn bè") || title.includes("chăm sóc cảm xúc")) return studyFocus;
  if (title.includes("xâm hại") || title.includes("tự bảo vệ")) return redFlagHunt3d;
  if (title.includes("khám phá giới") || title.includes("bản dạng")) return confidentTeen;

  const fallbackList = [
    imgFptConsent,
    friendshipOutdoor,
    healthyWater,
    teenPath3d,
    emotionSort3d,
    phoneSafety,
    imgFptHero,
    imgFptDiscuss,
    studyFocus,
    redFlagHunt3d,
    confidentTeen,
    safeSwipe3d,
    chatDetective3d,
    mythBuster3d,
  ];
  return fallbackList[index % fallbackList.length];
}

export default function NotebookCourseCard({ course, index = 0, onClick }: NotebookCourseCardProps) {
  // Determine color theme based on category so cards of the same topic have 1 consistent color
  const categoryIdentifier = course.category?.id ?? course.categoryId ?? course.category?.slug ?? course.category?.name;
  
  let themeIndex = index;
  if (categoryIdentifier !== undefined && categoryIdentifier !== null) {
    const rawString = String(categoryIdentifier);
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      hash = rawString.charCodeAt(i) + ((hash << 5) - hash);
    }
    themeIndex = Math.abs(hash);
  }

  const theme = NOTEBOOK_THEMES[themeIndex % NOTEBOOK_THEMES.length];
  const coverPhoto = getCourseCoverPhoto(course, index);

  const lessonCount = course.lessons?.length || 10;
  const badgeText = `${lessonCount} bài học • ${index % 2 === 0 ? "Thực tế" : "Dễ hiểu"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-[0_16px_32px_rgba(0,0,0,0.45)] border border-white/20 cursor-pointer select-none min-h-[310px]"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} z-0`} />

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none z-0" />

      {/* Spiral Binding Rings on Left Edge (Lò Xo Gáy Sổ 3D) */}
      <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between py-4 z-20 pointer-events-none w-5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="relative flex items-center">
            {/* Metal Ring */}
            <div className="h-3 w-5.5 rounded-full bg-gradient-to-r from-slate-200 via-white to-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.6)] border border-slate-400/70 transform -rotate-12" />
            {/* Punch Hole shadow */}
            <div className="absolute left-3 h-2 w-2 rounded-full bg-black/40 blur-[0.5px]" />
          </div>
        ))}
      </div>

      {/* Notebook Inner Content Container */}
      <div className="relative z-10 pl-6 flex flex-col justify-between h-full">
        {/* Top Header: Age Limit Badge */}
        <div>
          <p className="text-[11px] font-medium text-white/80 text-center tracking-wide">
            {theme.age}
          </p>

          {/* Course Title */}
          <h3 className="mt-2 text-center font-heading text-base font-extrabold text-white leading-snug drop-shadow-sm min-h-[44px] flex items-center justify-center line-clamp-2">
            {course.title}
          </h3>
        </div>

        {/* Center Illustration (Matching 2D/3D Cover Image Card) */}
        <div className="my-3 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.06, rotate: 1.5 }}
            className="relative h-28 w-full overflow-hidden rounded-xl border border-white/35 shadow-lg bg-black/30 z-10"
          >
            <img
              src={coverPhoto}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Subtle Inner Lighting Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none" />
          </motion.div>
        </div>

        {/* Bottom Bar: Lesson Tag + Text Badge */}
        <div className="flex items-center justify-between border-t border-white/20 pt-3">
          <span className="text-[11px] font-semibold text-white/95 tracking-tight">
            {badgeText}
          </span>

          <span className="text-[10px] font-extrabold text-white/90 uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-full">
            Lộ trình
          </span>
        </div>
      </div>
    </motion.div>
  );
}
