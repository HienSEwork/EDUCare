import { useAuth } from '@/contexts/AuthContext';
import { lessons } from '@/data/lessons';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CertificatePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const allCompleted = user.completedLessons.length >= lessons.length;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        {allCompleted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="gradient-card rounded-2xl p-8 shadow-card border-2 border-primary/30">
              <Award className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="font-heading text-3xl font-bold mb-2">🎉 Chúc mừng!</h1>
              <p className="text-lg mb-6">Bạn đã hoàn thành khóa học <strong>"Hiểu về tuổi dậy thì"</strong></p>
              <div className="bg-muted/50 rounded-xl p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Chứng chỉ dành cho</p>
                <p className="text-xl font-heading font-bold text-gradient">{user.fullName}</p>
                <p className="text-sm text-muted-foreground mt-2">Hoàn thành {lessons.length}/{lessons.length} bài học</p>
                <p className="text-sm text-muted-foreground">Tổng XP: {user.xp}</p>
              </div>
              <Button className="gradient-primary text-primary-foreground">
                <Download className="w-4 h-4 mr-2" /> Tải chứng chỉ
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold mb-2">Chứng chỉ</h1>
            <p className="text-muted-foreground mb-4">
              Hoàn thành tất cả {lessons.length} bài học để nhận chứng chỉ.
            </p>
            <p className="text-sm">Tiến độ: {user.completedLessons.length}/{lessons.length} bài học</p>
            <div className="h-3 bg-muted rounded-full overflow-hidden max-w-xs mx-auto mt-3">
              <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${(user.completedLessons.length / lessons.length) * 100}%` }} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
