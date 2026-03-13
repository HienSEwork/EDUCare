import { lessons } from '@/data/lessons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, BookOpen, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoursesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Khóa học: Hiểu về tuổi dậy thì</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">10 bài học giúp bạn hiểu rõ về sự thay đổi của cơ thể và cảm xúc.</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/20 text-mint-foreground text-sm">
            <Play className="w-4 h-4" />
            <span>Tất cả khóa học đều mở - Học ngay bây giờ!</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
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
      </div>
    </div>
  );
}
