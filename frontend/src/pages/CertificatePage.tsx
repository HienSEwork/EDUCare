import { useAuth } from "@/contexts/AuthContext";
import { lessons } from "@/data/lessons";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CertificatePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const allCompleted = user.completedLessons.length >= lessons.length;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        {allCompleted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="gradient-card rounded-2xl border-2 border-primary/30 p-8 shadow-card">
              <Award className="mx-auto mb-4 h-16 w-16 text-primary" />
              <h1 className="mb-2 font-heading text-3xl font-bold">Chúc mừng!</h1>
              <p className="mb-6 text-lg">Bạn đã hoàn thành khóa học <strong>"Hiểu về tuổi dậy thì"</strong></p>
              <div className="mb-6 rounded-xl bg-muted/50 p-6">
                <p className="mb-1 text-sm text-muted-foreground">Chứng chỉ dành cho</p>
                <p className="font-heading text-xl font-bold text-gradient">{user.fullName}</p>
                <p className="mt-2 text-sm text-muted-foreground">Hoàn thành {lessons.length}/{lessons.length} bài học</p>
                <p className="text-sm text-muted-foreground">Tổng XP: {user.xp}</p>
              </div>
              <Button className="gradient-primary text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> Tải chứng chỉ
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Award className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h1 className="mb-2 font-heading text-2xl font-bold">Chứng chỉ</h1>
            <p className="mb-4 text-muted-foreground">
              Hoàn thành tất cả {lessons.length} bài học để nhận chứng chỉ.
            </p>
            <p className="text-sm">Tiến độ: {user.completedLessons.length}/{lessons.length} bài học</p>
            <div className="mx-auto mt-3 h-3 max-w-xs overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${(user.completedLessons.length / lessons.length) * 100}%` }} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
