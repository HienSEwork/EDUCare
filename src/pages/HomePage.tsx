import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Gamepad2, Shield, Users, Star, TrendingUp } from 'lucide-react';
import heroImg from '@/assets/hero-illustration.png';
import MoodTracker from '@/components/MoodTracker';
import AnonymousQuestionBox from '@/components/AnonymousQuestionBox';
import RandomAdvice from '@/components/RandomAdvice';

const features = [
  { icon: BookOpen, title: 'Bài học chất lượng', desc: '10+ bài học được biên soạn bởi chuyên gia', color: 'bg-pink/30 text-pink-foreground' },
  { icon: Shield, title: 'An toàn & tin cậy', desc: 'Nội dung phù hợp lứa tuổi 12-18', color: 'bg-lavender/30 text-lavender-foreground' },
  { icon: Gamepad2, title: 'Học qua trò chơi', desc: 'Quiz, memory card, puzzle thú vị', color: 'bg-teal/30 text-teal-foreground' },
  { icon: Users, title: 'Cộng đồng', desc: 'Kết nối với bạn bè cùng trang lứa', color: 'bg-peach/30 text-peach-foreground' },
  { icon: Star, title: 'Gamification', desc: 'XP, streak, huy hiệu, chứng chỉ', color: 'bg-mint/30 text-mint-foreground' },
  { icon: TrendingUp, title: 'Theo dõi tiến độ', desc: 'Dashboard thông minh cho riêng bạn', color: 'bg-lavender/30 text-lavender-foreground' },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Left – Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-pink/20 text-pink-foreground text-sm font-medium mb-6">
                🌟 Nền tảng #1 cho tuổi teen Việt Nam
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Khám phá bản thân,{' '}
                <span className="text-gradient">tự tin trưởng thành</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-8">
                EDUcare giúp bạn hiểu về tuổi dậy thì, sức khỏe tinh thần và kỹ năng sống qua các bài học thú vị, trò chơi và quiz tương tác.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="gradient-primary text-primary-foreground px-8">
                      Vào Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="gradient-primary text-primary-foreground px-8">
                        🚀 Bắt đầu miễn phí
                      </Button>
                    </Link>
                    <Link to="/courses">
                      <Button size="lg" variant="outline" className="px-8">
                        📖 Khám phá khóa học
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* Right – Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 max-w-md md:max-w-lg"
            >
              <img src={heroImg} alt="Học sinh EDUcare cùng nhau học tập" className="w-full h-auto drop-shadow-xl" />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto md:mx-0 md:max-w-sm mt-12"
          >
            {[
              { num: '10+', label: 'Bài học' },
              { num: '5K+', label: 'Học sinh' },
              { num: '8+', label: 'Blog' },
            ].map(s => (
              <div key={s.label} className="text-center md:text-left">
                <div className="text-2xl md:text-3xl font-heading font-bold text-gradient">{s.num}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">🛠️ Công cụ dành cho bạn</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Khám phá các tính năng tương tác giúp bạn phát triển mỗi ngày.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MoodTracker />
            <AnonymousQuestionBox />
            <RandomAdvice />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">✨ Tại sao chọn EDUcare?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Chúng tôi tạo ra môi trường học tập an toàn, thú vị và hiệu quả.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="gradient-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">🎓 Sẵn sàng bắt đầu?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Tham gia cùng hàng ngàn học sinh đang học và phát triển mỗi ngày.</p>
          <Link to={user ? '/courses' : '/register'}>
            <Button size="lg" className="gradient-primary text-primary-foreground px-8">
              {user ? 'Xem khóa học' : 'Đăng ký ngay'}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
