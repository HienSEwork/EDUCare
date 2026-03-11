import { useAuth } from '@/contexts/AuthContext';
import { lessons } from '@/data/lessons';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Star, Trophy } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const completedCount = user.completedLessons.length;
  const totalLessons = lessons.length;
  const progress = Math.round((completedCount / totalLessons) * 100);

  const recentLessons = lessons
    .filter(l => user.completedLessons.includes(l.id))
    .slice(-3)
    .reverse();

  const nextLesson = lessons.find(l => !user.completedLessons.includes(l.id));

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold mb-2">Xin chào, {user.fullName}! 👋</h1>
          <p className="text-muted-foreground mb-8">Hãy tiếp tục hành trình học tập của bạn.</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Star, label: 'XP', value: user.xp, color: 'bg-pink/20 text-pink-foreground' },
              { icon: Flame, label: 'Streak', value: `${user.streak} ngày`, color: 'bg-peach/20 text-peach-foreground' },
              { icon: BookOpen, label: 'Bài học', value: `${completedCount}/${totalLessons}`, color: 'bg-lavender/20 text-lavender-foreground' },
              { icon: Trophy, label: 'Gói', value: user.plan.charAt(0).toUpperCase() + user.plan.slice(1), color: 'bg-teal/20 text-teal-foreground' },
            ].map(stat => (
              <div key={stat.label} className="gradient-card rounded-xl p-4 shadow-soft">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="gradient-card rounded-xl p-6 shadow-card mb-8">
            <h2 className="font-heading font-bold text-lg mb-3">Tiến độ khóa học</h2>
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-muted-foreground">{progress}% hoàn thành ({completedCount}/{totalLessons} bài)</p>
          </div>

          {/* Next lesson */}
          {nextLesson && (
            <div className="gradient-card rounded-xl p-6 shadow-card mb-8">
              <h2 className="font-heading font-bold text-lg mb-3">🎯 Bài học tiếp theo</h2>
              <Link to={`/lesson/${nextLesson.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {nextLesson.order}
                </div>
                <div>
                  <h3 className="font-semibold">{nextLesson.title}</h3>
                  <p className="text-xs text-muted-foreground">{nextLesson.isFree ? 'Miễn phí' : 'Gói Popular+'}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Recent */}
          {recentLessons.length > 0 && (
            <div className="gradient-card rounded-xl p-6 shadow-card mb-8">
              <h2 className="font-heading font-bold text-lg mb-3">📚 Bài học gần đây</h2>
              <div className="space-y-2">
                {recentLessons.map(l => (
                  <Link key={l.id} to={`/lesson/${l.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-mint-foreground">✅</span>
                    <span className="text-sm">{l.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Khóa học', to: '/courses', emoji: '📖' },
              { label: 'Trò chơi', to: '/games', emoji: '🎮' },
              { label: 'Blog', to: '/blog', emoji: '📝' },
              { label: 'Bảng xếp hạng', to: '/leaderboard', emoji: '🏆' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="gradient-card rounded-xl p-4 shadow-soft hover:shadow-hover transition-shadow text-center">
                <span className="text-2xl">{link.emoji}</span>
                <p className="text-sm font-medium mt-2">{link.label}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
