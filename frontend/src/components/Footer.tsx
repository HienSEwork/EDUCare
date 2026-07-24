import { Link } from "react-router-dom";
import { Globe, MessageCircle, Send, Share2, Video } from "lucide-react";
import imgLogo from "@/assets/home/Logo.png";

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
  return (
    <footer id="contact-footer" className="border-t border-indigo-900/60 bg-[#07041a] py-16 text-indigo-200/80">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1.2fr]">

          {/* Column 1: Brand & Social */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={imgLogo}
                alt="EDUcare Logo"
                className="h-11 w-11 shrink-0 rounded-full object-cover shadow-md border border-amber-300/80"
              />
              <span className="font-heading text-2xl font-extrabold text-white tracking-wide">
                EDUcare ✨
              </span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-indigo-200/70 mb-5">
              Nền tảng học tập & phát triển toàn diện cho thế hệ trẻ Việt Nam.
            </p>

            {/* Social icons (Monochrome Outline Icons) */}
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-400/30 text-indigo-200 transition-all hover:bg-indigo-600 hover:border-cyan-300 hover:text-white hover:scale-110"
                >
                  <s.Icon className="h-4 w-4 stroke-[2]" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Link Columns */}
          <FooterColumn title="Khám phá" items={footerGroups.explore} />
          <FooterColumn title="Cộng đồng" items={footerGroups.community} />
          <FooterColumn title="Hỗ trợ" items={footerGroups.support} />

          {/* Newsletter Box */}
          <div className="magic-card rounded-3xl p-5 border border-indigo-400/30">
            <p className="text-xs font-heading font-extrabold uppercase tracking-widest text-amber-300 mb-2">Nhận bản tin ✨</p>
            <p className="text-xs text-indigo-200/70 mb-4">Cập nhật khóa học mới và ưu đãi hấp dẫn mỗi tuần.</p>

            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full rounded-2xl bg-indigo-950/90 border border-indigo-400/40 px-4 py-2.5 text-xs text-white placeholder-indigo-300/50 focus:border-amber-300 focus:outline-none pr-10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-bold shadow-md hover:scale-105"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-indigo-900/50 pt-6 text-xs text-indigo-300/50 md:flex-row md:items-center md:justify-between">
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
}: {
  title: string;
  items: ReadonlyArray<{ label: string; to: string }>;
}) {
  return (
    <div>
      <h4 className="font-heading text-sm font-extrabold text-white mb-3">{title}</h4>
      <div className="space-y-2.5">
        {items.map((item) => (
          <Link key={item.label} to={item.to} className="block text-xs font-heading text-indigo-200/70 transition-colors hover:text-cyan-300">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
