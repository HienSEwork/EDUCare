import { Link } from "react-router-dom";
import { Globe, MessageCircle, Send, Share2, Video } from "lucide-react";
import imgLogo from "@/assets/home/LOGO.jpg";
import { useTheme } from "@/contexts/ThemeContext";

const footerGroups = {
  explore: [
    { label: "Tất cả khóa học", to: "/courses" },
    { label: "Chủ đề", to: "/courses" },
    { label: "Kỹ năng", to: "/courses" },
    { label: "Blog", to: "/blog" },
  ],
  community: [
    { label: "Thảo luận", to: "/community" },
    { label: "Sự kiện", to: "/community" },
    { label: "Thành viên nổi bật", to: "/community/leaderboard" },
  ],
  support: [
    { label: "Trung tâm trợ giúp", to: "/about" },
    { label: "Liên hệ", to: "/contact" },
    { label: "Điều khoản sử dụng", to: "/about" },
    { label: "Chính sách bảo mật", to: "/about" },
  ],
} as const;

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer id="contact-footer" className={theme === "light" ? "border-t border-pink-200/80 bg-pink-50/60 py-16 text-slate-600" : "border-t border-indigo-900/60 bg-[#07041a] py-16 text-indigo-200/80"}>
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1.2fr]">

          {/* Column 1: Brand & Social */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={imgLogo}
                alt="EDUcare Logo"
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 shrink-0 rounded-full object-cover shadow-md border border-amber-300/80"
              />
              <span className={theme === "light" ? "font-heading text-2xl font-extrabold text-pink-600 tracking-wide" : "font-heading text-2xl font-extrabold text-white tracking-wide"}>
                EDUcare ✨
              </span>
            </div>
            <p className={theme === "light" ? "max-w-xs text-xs leading-relaxed text-slate-600 mb-5" : "max-w-xs text-xs leading-relaxed text-indigo-200/70 mb-5"}>
              Nền tảng học tập & phát triển toàn diện cho thế hệ trẻ Việt Nam.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { label: "FB", Icon: Globe },
                { label: "TT", Icon: Share2 },
                { label: "YT", Icon: Video },
                { label: "IG", Icon: MessageCircle },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className={theme === "light"
                    ? "flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-pink-200 text-pink-600 transition-all hover:bg-pink-600 hover:text-white hover:scale-110 shadow-sm"
                    : "flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-400/30 text-indigo-200 transition-all hover:bg-indigo-600 hover:border-cyan-300 hover:text-white hover:scale-110"
                  }
                >
                  <s.Icon className="h-4 w-4 stroke-[2]" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Link Columns */}
          <FooterColumn title="Khám phá" items={footerGroups.explore} theme={theme} />
          <FooterColumn title="Cộng đồng" items={footerGroups.community} theme={theme} />
          <FooterColumn title="Hỗ trợ" items={footerGroups.support} theme={theme} />

          {/* Newsletter Box */}
          <div className={theme === "light" ? "rounded-3xl p-5 border border-pink-200/80 bg-white shadow-[0_8px_30px_rgba(236,72,153,0.08)]" : "magic-card rounded-3xl p-5 border border-indigo-400/30"}>
            <p className={theme === "light" ? "text-xs font-heading font-extrabold uppercase tracking-widest text-pink-600 mb-2" : "text-xs font-heading font-extrabold uppercase tracking-widest text-amber-300 mb-2"}>Nhận bản tin ✨</p>
            <p className={theme === "light" ? "text-xs text-slate-500 mb-4" : "text-xs text-indigo-200/70 mb-4"}>Cập nhật khóa học mới và ưu đãi hấp dẫn mỗi tuần.</p>

            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="email"
                placeholder="Email của bạn"
                className={theme === "light"
                  ? "w-full rounded-2xl bg-pink-50/60 border border-pink-200 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:outline-none pr-10"
                  : "w-full rounded-2xl bg-indigo-950/90 border border-indigo-400/40 px-4 py-2.5 text-xs text-white placeholder-indigo-300/50 focus:border-amber-300 focus:outline-none pr-10"
                }
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-md hover:scale-105"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className={theme === "light" ? "mt-12 flex flex-col gap-4 border-t border-pink-200/60 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between" : "mt-12 flex flex-col gap-4 border-t border-indigo-900/50 pt-6 text-xs text-indigo-300/50 md:flex-row md:items-center md:justify-between"}>
          <p>© 2026 EDUcare. Tất cả quyền được bảo lưu.</p>
          <p className="max-w-md md:text-right">
            Khi cần hỗ trợ khẩn cấp, hãy tìm đến người lớn đáng tin cậy hoặc kênh hỗ trợ phù hợp gần bạn.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  theme,
}: {
  title: string;
  items: ReadonlyArray<{ label: string; to: string }>;
  theme?: string;
}) {
  return (
    <div>
      <h4 className={theme === "light" ? "font-heading text-sm font-extrabold text-slate-800 mb-3" : "font-heading text-sm font-extrabold text-white mb-3"}>{title}</h4>
      <div className="space-y-2.5">
        {items.map((item) => (
          <Link key={item.label} to={item.to} className={theme === "light" ? "block text-xs font-heading text-slate-600 transition-colors hover:text-pink-600" : "block text-xs font-heading text-indigo-200/70 transition-colors hover:text-cyan-300"}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
