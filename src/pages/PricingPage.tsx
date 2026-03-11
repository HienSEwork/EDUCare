import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Bảng giá</h1>
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
