import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Bell, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import logoImg from '@/assets/educare-logo.png';

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Khóa học', to: '/courses' },
  { label: 'Blog', to: '/blog' },
  { label: 'Trò chơi', to: '/games' },
  { label: 'Cộng đồng', to: '/community' },
  { label: 'About us', to: '/about' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl">
          <img src={logoImg} alt="EDUcare Logo" className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="h-8 w-40 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          )}

          {user ? (
            <>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink rounded-full" />
              </button>
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Link to="/dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
                </Link>
                <Link to="/profile" className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <User className="w-5 h-5 text-muted-foreground" />
                </Link>
                <button onClick={logout} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <LogOut className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <span className="hidden sm:block text-sm font-semibold text-foreground ml-1">
                {user.fullName.split(' ').pop()}
              </span>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gradient-primary text-primary-foreground">Đăng ký</Button>
              </Link>
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-foreground/70 hover:bg-muted">Dashboard</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-destructive hover:bg-muted">Đăng xuất</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="ghost" className="w-full" size="sm">Đăng nhập</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button size="sm" className="w-full gradient-primary text-primary-foreground">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
