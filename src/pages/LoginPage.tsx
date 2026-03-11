import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(emailOrUsername, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Đã xảy ra lỗi.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-card p-8"
      >
        <div className="text-center mb-6">
          <span className="text-4xl">🎓</span>
          <h1 className="font-heading text-2xl font-bold mt-2">Đăng nhập EDUcare</h1>
          <p className="text-sm text-muted-foreground mt-1">Chào mừng bạn trở lại!</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email hoặc Username</Label>
            <Input
              value={emailOrUsername}
              onChange={e => setEmailOrUsername(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <Label>Mật khẩu</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">Đăng ký</Link>
        </p>
      </motion.div>
    </div>
  );
}
