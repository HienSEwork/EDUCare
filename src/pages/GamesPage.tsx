import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star } from 'lucide-react';
import { leaderboardData } from '@/data/leaderboard';
import { useAuth } from '@/contexts/AuthContext';

const games = [
  { id: 'quiz', name: 'Quiz Challenge', desc: 'Trả lời câu hỏi kiến thức', emoji: '❓', color: 'bg-lavender/20' },
  { id: 'memory', name: 'Memory Card', desc: 'Lật thẻ tìm cặp giống nhau', emoji: '🃏', color: 'bg-pink/20' },
  { id: 'wordmatch', name: 'Word Match', desc: 'Nối từ với nghĩa đúng', emoji: '🔤', color: 'bg-teal/20' },
  { id: 'puzzle', name: 'Puzzle', desc: 'Xếp hình kiến thức', emoji: '🧩', color: 'bg-peach/20' },
  { id: 'scenario', name: 'Scenario Game', desc: 'Xử lý tình huống thực tế', emoji: '🎭', color: 'bg-mint/20' },
];

export default function GamesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Trò chơi giáo dục</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Học qua chơi — vừa vui vừa bổ ích!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={game.id === 'quiz' ? '/games/quiz' : '#'}>
                <div className="gradient-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all text-center">
                  <div className={`w-16 h-16 rounded-2xl ${game.color} flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-3xl">{game.emoji}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1">{game.name}</h3>
                  <p className="text-sm text-muted-foreground">{game.desc}</p>
                  {game.id !== 'quiz' && (
                    <span className="inline-block mt-3 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Sắp ra mắt</span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">🏆 Bảng xếp hạng</h2>
            <p className="text-muted-foreground">Top học viên tuần này</p>
          </div>

          {/* Top 3 podium */}
          <div className="flex justify-center items-end gap-4 mb-8">
            {[1, 0, 2].map(idx => {
              const entry = leaderboardData[idx];
              const isFirst = idx === 0;
              return (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`text-center ${isFirst ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}
                >
                  <span className="text-4xl">{entry.avatar}</span>
                  <p className="font-heading font-bold text-sm mt-1">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.xp} XP</p>
                  <div className={`mt-2 rounded-t-xl flex items-center justify-center font-bold ${
                    isFirst ? 'h-24 w-20 bg-pink/30 text-pink-foreground' :
                    idx === 1 ? 'h-16 w-16 bg-lavender/30 text-lavender-foreground' :
                    'h-12 w-16 bg-teal/30 text-teal-foreground'
                  }`}>
                    #{entry.rank}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Full list */}
          <div className="gradient-card rounded-2xl shadow-card overflow-hidden">
            {leaderboardData.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 p-4 ${i !== leaderboardData.length - 1 ? 'border-b border-border' : ''}`}
              >
                <span className={`w-8 text-center font-bold ${entry.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </span>
                <span className="text-2xl">{entry.avatar}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{entry.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {entry.xp} XP</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {entry.streak} ngày</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {user && (
              <div className="border-t-2 border-primary/30 bg-primary/5 p-4 flex items-center gap-4">
                <span className="w-8 text-center font-bold text-primary">—</span>
                <span className="text-2xl">🧑‍🎓</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.fullName} (Bạn)</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {user.xp} XP</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {user.streak} ngày</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
