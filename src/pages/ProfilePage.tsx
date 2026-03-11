import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-2xl p-8 shadow-card text-center">
          <span className="text-6xl">🧑‍🎓</span>
          <h1 className="font-heading text-2xl font-bold mt-4">{user.fullName}</h1>
          <p className="text-muted-foreground text-sm">@{user.username}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Tuổi</p>
              <p className="text-sm font-medium">{user.age}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Gói</p>
              <p className="text-sm font-medium capitalize">{user.plan}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">XP</p>
              <p className="text-sm font-medium">{user.xp}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
