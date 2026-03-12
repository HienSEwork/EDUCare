import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const moods = [
  { emoji: '😄', label: 'Vui vẻ', color: 'bg-mint/30', advice: 'Tuyệt vời! Hãy chia sẻ niềm vui với bạn bè nhé!' },
  { emoji: '😊', label: 'Bình thường', color: 'bg-lavender/30', advice: 'Một ngày ổn định. Hãy thử làm điều bạn yêu thích!' },
  { emoji: '😐', label: 'Trung lập', color: 'bg-muted', advice: 'Không sao cả. Hãy thử đi dạo hoặc nghe nhạc nhé.' },
  { emoji: '😔', label: 'Buồn', color: 'bg-peach/30', advice: 'Buồn là bình thường. Hãy nói chuyện với ai đó bạn tin tưởng.' },
  { emoji: '😡', label: 'Tức giận', color: 'bg-pink/30', advice: 'Hít thở sâu 5 lần. Cảm xúc này sẽ qua thôi.' },
];

export default function MoodTracker() {
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<{ mood: number; date: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('educare_mood_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSelect = (index: number) => {
    setSelected(index);
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...history.filter(h => h.date !== today), { mood: index, date: today }].slice(-7);
    setHistory(newHistory);
    localStorage.setItem('educare_mood_history', JSON.stringify(newHistory));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="gradient-card rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎭</span>
        <h3 className="font-heading font-bold text-lg">Mood Tracker</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Hôm nay bạn cảm thấy thế nào?</p>

      <div className="flex justify-between gap-2 mb-4">
        {moods.map((mood, i) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(i)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              selected === i ? `${mood.color} ring-2 ring-primary` : 'hover:bg-muted/50'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[10px] text-muted-foreground">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl p-3 ${moods[selected].color}`}
          >
            <p className="text-sm font-medium">{moods[selected].advice}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length > 1 && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">7 ngày gần đây:</p>
          <div className="flex gap-1">
            {history.slice(-7).map((h, i) => (
              <span key={i} className="text-lg">{moods[h.mood].emoji}</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
