import { lessons } from '@/data/lessons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, BookOpen, Play, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    price: 'Miễn phí',
    period: '',
    features: ['Xem 30% bài học', 'Đọc blog', 'Chơi game cơ bản'],
    color: 'border-teal',
    bg: 'bg-teal/10',
    popular: false,
  },
  {
    name: 'Popular',
    price: '29.000₫',
    period: '/ tháng',
    features: ['Tất cả bài học', 'Quiz tương tác', 'Game đầy đủ', 'Streak & XP', 'Chứng chỉ hoàn thành'],
    color: 'border-primary',
    bg: 'gradient-primary',
    popular: true,
  },
  {
    name: 'Premium',
    price: '49.000₫',
    period: '/ tháng',
    features: ['Mọi thứ trong Popular', 'AI trợ lý học tập', 'Game nâng cao', 'Nội dung nâng cao', 'Hỗ trợ ưu tiên'],
    color: 'border-pink',
    bg: 'bg-pink/10',
    popular: false,
  },
];

export default function CoursesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Khóa học: Hiểu về tuổi dậy thì</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">10 bài học giúp bạn hiểu rõ về sự thay đổi của cơ thể và cảm xúc.</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/20 text-mint-foreground text-sm font-semibold">
            <Play className="w-4 h-4" />
            <span>Tất cả khóa học đều mở - Học ngay bây giờ!</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-4 mb-20">
          {lessons.map((lesson, i) => {
            const completed = user?.completedLessons.includes(lesson.id);

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/lesson/${lesson.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-soft hover:shadow-hover transition-shadow">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${completed ? 'bg-mint/30 text-mint-foreground' : 'bg-lavender/30 text-lavender-foreground'}`}>
                      {completed ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold text-lg">{lesson.order}</span>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-lg">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {completed ? 'Đã hoàn thành ✓' : 'Nhấn để bắt đầu học'}
                      </p>
                    </div>
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">💎 Gói học tập</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Chọn gói phù hợp với nhu cầu học tập của bạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border-2 ${plan.color} p-6 ${plan.popular ? 'shadow-hover scale-105' : 'shadow-card'}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-bold">
                  Phổ biến nhất
                </span>
              )}
              <h3 className="font-heading text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={user ? '#' : '/register'}>
                <Button
                  className={`w-full ${plan.popular ? 'gradient-primary text-primary-foreground' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {user ? 'Chọn gói' : 'Đăng ký ngay'}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Thanh toán qua: MoMo • VNPay • ZaloPay
        </div>
      </div>
    </div>
  );
}
