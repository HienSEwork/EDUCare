import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length < 4) return { label: 'Yếu', color: 'bg-destructive', width: 'w-1/4' };
  if (pw.length < 6) return { label: 'Trung bình', color: 'bg-peach', width: 'w-2/4' };
  if (pw.length < 8) return { label: 'Khá', color: 'bg-teal', width: 'w-3/4' };
  return { label: 'Mạnh', color: 'bg-mint', width: 'w-full' };
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '', confirmPassword: '', age: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    const age = parseInt(form.age);
    if (isNaN(age) || age < 10 || age > 20) { setError('Độ tuổi phải từ 10 đến 20.'); return; }

    setLoading(true);
    const result = await register({ ...form, age });
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Đã xảy ra lỗi.');
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-card p-8"
      >
        <div className="text-center mb-6">
          <span className="text-4xl">🎓</span>
          <h1 className="font-heading text-2xl font-bold mt-2">Đăng ký EDUcare</h1>
          <p className="text-sm text-muted-foreground mt-1">Tạo tài khoản miễn phí</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Họ và tên</Label>
            <Input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Nguyễn Văn A" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" required />
          </div>
          <div>
            <Label>Username</Label>
            <Input value={form.username} onChange={e => update('username', e.target.value)} placeholder="username" required />
          </div>
          <div>
            <Label>Mật khẩu</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all rounded-full`} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Độ mạnh: {strength.label}</p>
              </div>
            )}
          </div>
          <div>
            <Label>Xác nhận mật khẩu</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <Label>Độ tuổi</Label>
            <Input type="number" value={form.age} onChange={e => update('age', e.target.value)} min={10} max={20} placeholder="15" required />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
        </p>
      </motion.div>
    </div>
  );
}
