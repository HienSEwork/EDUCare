import { useParams, useNavigate } from 'react-router-dom';
import { lessons } from '@/data/lessons';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson } = useAuth();

  const lesson = lessons.find(l => l.id === id);
  if (!lesson) return <div className="min-h-screen flex items-center justify-center"><p>Không tìm thấy bài học.</p></div>;

  const locked = !lesson.isFree && (!user || user.plan === 'free');
  if (locked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">🔒 Bài học này cần gói Popular hoặc Premium</p>
          <Button onClick={() => navigate('/pricing')} className="gradient-primary text-primary-foreground">Xem bảng giá</Button>
        </div>
      </div>
    );
  }

  const completed = user?.completedLessons.includes(lesson.id);
  const currentIndex = lessons.findIndex(l => l.id === id);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Quay lại khóa học
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-lavender/30 text-lavender-foreground text-xs font-medium">
              Bài {lesson.order} / {lessons.length}
            </span>
            {completed && (
              <span className="flex items-center gap-1 text-mint-foreground text-xs">
                <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl font-bold mb-6">{lesson.title}</h1>

          <div className="prose prose-sm max-w-none">
            {lesson.content.split('\n').map((line, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed mb-3">
                {line}
              </p>
            ))}
          </div>

          {user && !completed && (
            <div className="mt-8 text-center">
              <Button
                onClick={() => completeLesson(lesson.id)}
                className="gradient-primary text-primary-foreground px-8"
              >
                ✅ Hoàn thành bài học (+50 XP)
              </Button>
            </div>
          )}

          <div className="flex justify-between mt-12 pt-6 border-t border-border">
            {prev ? (
              <Button variant="ghost" onClick={() => navigate(`/lesson/${prev.id}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> {prev.title}
              </Button>
            ) : <div />}
            {next ? (
              <Button variant="ghost" onClick={() => navigate(`/lesson/${next.id}`)}>
                {next.title} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : <div />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
