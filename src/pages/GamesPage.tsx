import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

const games = [
  { id: 'quiz', name: 'Quiz Challenge', desc: 'Trả lời câu hỏi kiến thức', emoji: '❓', color: 'bg-lavender/20' },
  { id: 'memory', name: 'Memory Card', desc: 'Lật thẻ tìm cặp giống nhau', emoji: '🃏', color: 'bg-pink/20' },
  { id: 'wordmatch', name: 'Word Match', desc: 'Nối từ với nghĩa đúng', emoji: '🔤', color: 'bg-teal/20' },
  { id: 'puzzle', name: 'Puzzle', desc: 'Xếp hình kiến thức', emoji: '🧩', color: 'bg-peach/20' },
  { id: 'scenario', name: 'Scenario Game', desc: 'Xử lý tình huống thực tế', emoji: '🎭', color: 'bg-mint/20' },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Trò chơi giáo dục</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Học qua chơi — vừa vui vừa bổ ích!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
      </div>
    </div>
  );
}
