import { useState } from 'react';
import { quizQuestions } from '@/data/quizzes';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function QuizPage() {
  const { user, addXp } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = quizQuestions[current];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < quizQuestions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      if (user) addXp(score * 10);
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center gradient-card rounded-2xl p-8 shadow-card max-w-md">
          <span className="text-6xl">🎉</span>
          <h2 className="font-heading text-2xl font-bold mt-4 mb-2">Hoàn thành Quiz!</h2>
          <p className="text-lg mb-1">Điểm: <span className="font-bold text-primary">{score}/{quizQuestions.length}</span></p>
          {user && <p className="text-sm text-muted-foreground mb-6">+{score * 10} XP</p>}
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setCurrent(0); setScore(0); setFinished(false); setSelected(null); setAnswered(false); }}>Chơi lại</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => navigate('/games')}>Quay lại</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Câu {current + 1} / {quizQuestions.length}</span>
            <span className="text-sm font-medium">Điểm: {score}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${((current + 1) / quizQuestions.length) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="gradient-card rounded-2xl p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold mb-6">{q.question}</h2>
              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  let optClass = 'border-border hover:border-primary/50 hover:bg-muted/50';
                  if (answered) {
                    if (idx === q.correct) optClass = 'border-mint bg-mint/20';
                    else if (idx === selected) optClass = 'border-destructive bg-destructive/10';
                  } else if (idx === selected) {
                    optClass = 'border-primary bg-primary/10';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${optClass}`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {opt}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-6 text-center">
                  <p className={`text-sm font-medium mb-3 ${selected === q.correct ? 'text-mint-foreground' : 'text-destructive'}`}>
                    {selected === q.correct ? '✅ Chính xác!' : '❌ Sai rồi!'}
                  </p>
                  <Button onClick={handleNext} className="gradient-primary text-primary-foreground">
                    {current < quizQuestions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả'}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
