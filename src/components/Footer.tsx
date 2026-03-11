import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-4">
              <span className="text-2xl">🎓</span>
              <span className="text-gradient">EDUcare</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Nền tảng học tập an toàn và thú vị cho học sinh 12-18 tuổi.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-3">Khám phá</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/courses" className="block hover:text-foreground transition-colors">Khóa học</Link>
              <Link to="/blog" className="block hover:text-foreground transition-colors">Blog</Link>
              <Link to="/games" className="block hover:text-foreground transition-colors">Trò chơi</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-3">Hỗ trợ</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/pricing" className="block hover:text-foreground transition-colors">Bảng giá</Link>
              <Link to="/leaderboard" className="block hover:text-foreground transition-colors">Bảng xếp hạng</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-3">Liên hệ</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 contact@educare.vn</p>
              <p>📞 Đường dây nóng: 111</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 EDUcare. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
