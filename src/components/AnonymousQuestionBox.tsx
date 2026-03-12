import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircleQuestion, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Question {
  id: string;
  text: string;
  answer: string | null;
  likes: number;
  liked: boolean;
  createdAt: string;
}

const presetAnswers: Record<string, string> = {
  'dậy thì': 'Tuổi dậy thì thường bắt đầu từ 9-14 tuổi ở nữ và 10-15 tuổi ở nam. Mỗi người phát triển khác nhau nên đừng lo lắng nếu bạn sớm hay muộn hơn bạn bè nhé!',
  'stress': 'Stress ở tuổi teen rất phổ biến. Hãy thử tập thể dục, viết nhật ký, hoặc nói chuyện với người bạn tin tưởng. Nếu stress kéo dài, hãy tìm đến chuyên gia nhé!',
  'bạn bè': 'Tình bạn tốt cần sự tôn trọng và tin tưởng lẫn nhau. Nếu bạn cảm thấy bị áp lực từ bạn bè, hãy nhớ rằng bạn có quyền nói "không" nhé.',
  'internet': 'An toàn trên internet rất quan trọng! Không chia sẻ thông tin cá nhân, mật khẩu với ai. Nếu gặp nội dung khó chịu, hãy báo cho người lớn.',
  'cảm xúc': 'Thay đổi cảm xúc ở tuổi teen là hoàn toàn bình thường. Hormone đang thay đổi và điều đó ảnh hưởng đến tâm trạng. Hãy kiên nhẫn với bản thân nhé!',
  'tự tin': 'Tự tin bắt đầu từ việc chấp nhận bản thân. Hãy tập trung vào điểm mạnh của mình và nhớ rằng không ai hoàn hảo cả!',
};

function getAutoAnswer(question: string): string {
  const lower = question.toLowerCase();
  for (const [key, answer] of Object.entries(presetAnswers)) {
    if (lower.includes(key)) return answer;
  }
  return 'Cảm ơn câu hỏi của bạn! Đây là một câu hỏi hay. Hãy tham khảo các bài học trên EDUcare để tìm hiểu thêm, hoặc nói chuyện với người lớn bạn tin tưởng nhé! 💜';
}

export default function AnonymousQuestionBox() {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('educare_anon_questions');
    if (saved) setQuestions(JSON.parse(saved));
  }, []);

  const saveQuestions = (q: Question[]) => {
    setQuestions(q);
    localStorage.setItem('educare_anon_questions', JSON.stringify(q));
  };

  const handleSubmit = () => {
    if (!question.trim()) return;
    const newQ: Question = {
      id: Date.now().toString(),
      text: question.trim(),
      answer: getAutoAnswer(question),
      likes: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    };
    saveQuestions([newQ, ...questions].slice(0, 20));
    setQuestion('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleLike = (id: string) => {
    saveQuestions(
      questions.map(q =>
        q.id === id ? { ...q, likes: q.liked ? q.likes - 1 : q.likes + 1, liked: !q.liked } : q
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="gradient-card rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageCircleQuestion className="w-6 h-6 text-primary" />
        <h3 className="font-heading font-bold text-lg">Hộp thư bí mật</h3>
        <span className="text-xs bg-pink/20 text-pink-foreground px-2 py-0.5 rounded-full">Ẩn danh</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Hỏi bất cứ điều gì bạn muốn – hoàn toàn ẩn danh và an toàn!
      </p>

      <div className="flex gap-2 mb-4">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Nhập câu hỏi của bạn..."
          className="flex-1 h-10 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button onClick={handleSubmit} size="icon" className="gradient-primary text-primary-foreground rounded-xl shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-mint/20 text-mint-foreground rounded-xl p-3 mb-4 text-sm"
          >
            ✅ Câu hỏi đã được gửi ẩn danh! Xem phản hồi bên dưới.
          </motion.div>
        )}
      </AnimatePresence>

      {questions.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {questions.length} câu hỏi gần đây
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {questions.slice(0, 5).map(q => (
                  <div key={q.id} className="bg-muted/50 rounded-xl p-3">
                    <p className="text-sm font-medium mb-1">❓ {q.text}</p>
                    {q.answer && (
                      <p className="text-sm text-muted-foreground bg-background/50 rounded-lg p-2 mt-2">
                        💜 {q.answer}
                      </p>
                    )}
                    <button
                      onClick={() => handleLike(q.id)}
                      className={`flex items-center gap-1 mt-2 text-xs ${q.liked ? 'text-pink-foreground' : 'text-muted-foreground'}`}
                    >
                      <Heart className={`w-3 h-3 ${q.liked ? 'fill-current' : ''}`} />
                      {q.likes}
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
