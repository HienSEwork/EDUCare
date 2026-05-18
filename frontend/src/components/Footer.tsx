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
    <footer id="contact-footer" className="mt-20 border-t border-white/50 bg-transparent">
      <div className="container mx-auto px-4 pb-10 pt-6">
        <div className="theme-section overflow-hidden rounded-[2.4rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,232,241,0.9)_0%,rgba(245,241,255,0.96)_50%,rgba(227,245,255,0.88)_100%)] p-8 shadow-card md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.9fr]">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">EDUcare</p>
              <h3 className="font-heading text-3xl font-bold">Đồng hành cùng tuổi teen theo cách gần gũi hơn.</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                Nơi bạn có thể học, đọc, chơi và trò chuyện trong một không gian nhẹ nhàng, an toàn và dễ quay lại mỗi ngày.
              </p>
            </div>

            <FooterColumn title="Nội dung" items={footerGroups.content} />
            <FooterColumn title="Cộng đồng" items={footerGroups.community} />

            <div className="surface-panel-soft rounded-[1.8rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Liên hệ</p>
              <p className="mt-4 text-sm text-muted-foreground">hello@educare.vn</p>
              <p className="mt-2 text-sm text-muted-foreground">1900 6868</p>
              <div className="mt-5 space-y-2">
                {footerGroups.company.map((item) => (
                  <Link key={item.to} to={item.to} className="block text-sm font-semibold text-foreground/80 transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/55 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© 2026 EDUcare. Thiết kế để đồng hành cùng hành trình lớn lên lành mạnh hơn.</p>
            <p>Khi cần hỗ trợ khẩn cấp, hãy tìm đến người lớn đáng tin cậy hoặc kênh hỗ trợ phù hợp gần bạn.</p>
          </div>
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
      <h4 className="font-heading text-lg font-bold">{title}</h4>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
