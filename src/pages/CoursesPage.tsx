import { lessons } from '@/data/lessons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, CheckCircle2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoursesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Khóa học: Hiểu về tuổi dậy thì</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">10 bài học giúp bạn hiểu rõ về sự thay đổi của cơ thể và cảm xúc.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {lessons.map((lesson, i) => {
            const completed = user?.completedLessons.includes(lesson.id);
            const locked = !lesson.isFree && (!user || user.plan === 'free');

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {locked ? (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border opacity-60">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold">
                      {lesson.order}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold">{lesson.title}</h3>
                      <p className="text-xs text-muted-foreground">Cần gói Popular hoặc Premium</p>
                    </div>
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                ) : (
                  <Link to={`/lesson/${lesson.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-soft hover:shadow-hover transition-shadow">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${completed ? 'bg-mint/30 text-mint-foreground' : 'bg-lavender/30 text-lavender-foreground'}`}>
                        {completed ? <CheckCircle2 className="w-5 h-5" /> : lesson.order}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold">{lesson.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {completed ? 'Đã hoàn thành ✓' : lesson.isFree ? 'Miễn phí' : 'Đã mở khóa'}
                        </p>
                      </div>
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
