import { Link } from "react-router-dom";

const footerGroups = {
  content: [
    { label: "Khóa học", to: "/courses" },
    { label: "Bài viết", to: "/blog" },
    { label: "Trò chơi", to: "/games" },
  ],
  community: [
    { label: "Thảo luận", to: "/community" },
    { label: "Nhóm chat", to: "/community/chat" },
    { label: "Bảng xếp hạng", to: "/community/leaderboard" },
  ],
  company: [
    { label: "Giới thiệu", to: "/about" },
    { label: "Liên hệ", to: "/contact" },
  ],
} as const;

export default function Footer() {
  return (
    <footer id="contact-footer" className="mt-20 border-t border-gray-100 bg-slate-50 py-16 text-gray-600">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-pink-600">EDUcare</p>
            <h3 className="font-heading text-2xl font-extrabold text-gray-900 leading-tight">
              Đồng hành cùng tuổi teen theo cách gần gũi hơn.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
              Nơi bạn có thể học, đọc, chơi và trò chuyện trong một không gian nhẹ nhàng, an toàn và dễ quay lại mỗi ngày.
            </p>
          </div>

          <FooterColumn title="Nội dung" items={footerGroups.content} />
          <FooterColumn title="Cộng đồng" items={footerGroups.community} />

          <div className="rounded-3xl border border-pink-100/80 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">Liên hệ</p>
            <p className="mt-4 text-sm font-bold text-gray-700">hello@educare.vn</p>
            <p className="mt-1 text-sm font-bold text-gray-700">1900 6868</p>
            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
              {footerGroups.company.map((item) => (
                <Link key={item.to} to={item.to} className="block text-sm font-bold text-gray-700 transition-colors hover:text-pink-600">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 EDUcare. Thiết kế để đồng hành cùng hành trình lớn lên lành mạnh hơn.</p>
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
      <h4 className="font-heading text-base font-extrabold text-gray-900">{title}</h4>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="block text-sm text-gray-500 transition-colors hover:text-pink-600">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
