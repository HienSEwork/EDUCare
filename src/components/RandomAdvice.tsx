import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const advices = [
  { text: 'Hãy uống đủ nước mỗi ngày – cơ thể bạn cần ít nhất 2 lít nước! 💧', category: 'Sức khỏe' },
  { text: 'Nói "không" khi bạn không thoải mái là hoàn toàn ổn. Đó là quyền của bạn! 🛡️', category: 'Kỹ năng sống' },
  { text: 'Ngủ đủ 8-10 tiếng mỗi đêm giúp não bộ hoạt động tốt hơn! 😴', category: 'Sức khỏe' },
  { text: 'Hãy viết ra 3 điều bạn biết ơn mỗi ngày – nó giúp bạn hạnh phúc hơn! ✨', category: 'Tinh thần' },
  { text: 'Không ai hoàn hảo cả. Sai lầm là cách tốt nhất để học hỏi! 🌱', category: 'Tinh thần' },
  { text: 'Tập thể dục 30 phút mỗi ngày giúp giảm stress rất hiệu quả! 🏃', category: 'Sức khỏe' },
  { text: 'Hãy nói chuyện với ai đó khi bạn cảm thấy buồn – đừng giữ trong lòng! 💜', category: 'Tinh thần' },
  { text: 'Mật khẩu mạnh cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số! 🔒', category: 'An toàn' },
  { text: 'So sánh bản thân với người khác chỉ khiến bạn mệt mỏi. Hãy là phiên bản tốt nhất của chính mình! 🌟', category: 'Tinh thần' },
  { text: 'Ăn sáng đầy đủ giúp bạn tập trung tốt hơn trong giờ học! 🥗', category: 'Sức khỏe' },
  { text: 'Hạn chế dùng điện thoại trước khi ngủ 30 phút để ngủ ngon hơn! 📵', category: 'Sức khỏe' },
  { text: 'Bạn bè tốt là những người tôn trọng bạn và không ép bạn làm điều bạn không muốn! 🤝', category: 'Kỹ năng sống' },
  { text: 'Thay đổi cảm xúc ở tuổi teen là bình thường – do hormone thay đổi! 🧠', category: 'Sức khỏe' },
  { text: 'Đặt mục tiêu nhỏ mỗi ngày giúp bạn tiến bộ từng bước! 🎯', category: 'Kỹ năng sống' },
  { text: 'Không bao giờ chia sẻ mật khẩu hoặc địa chỉ nhà cho người lạ trên mạng! 🚫', category: 'An toàn' },
];

const categoryColors: Record<string, string> = {
  'Sức khỏe': 'bg-mint/20 text-mint-foreground',
  'Kỹ năng sống': 'bg-lavender/20 text-lavender-foreground',
  'Tinh thần': 'bg-pink/20 text-pink-foreground',
  'An toàn': 'bg-teal/20 text-teal-foreground',
};

export default function RandomAdvice() {
  const [current, setCurrent] = useState<typeof advices[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const getRandomAdvice = () => {
    setIsSpinning(true);
    setTimeout(() => {
      let next: typeof advices[0];
      do {
        next = advices[Math.floor(Math.random() * advices.length)];
      } while (next === current && advices.length > 1);
      setCurrent(next);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="gradient-card rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="font-heading font-bold text-lg">Lời khuyên hôm nay</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Nhấn nút để nhận lời khuyên bổ ích ngẫu nhiên!
      </p>

      <div className="text-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={getRandomAdvice}
            disabled={isSpinning}
            className="gradient-primary text-primary-foreground rounded-xl px-6 py-3 text-base font-semibold"
          >
            <motion.span
              animate={isSpinning ? { rotate: 360 } : {}}
              transition={{ duration: 0.6, ease: 'linear' }}
              className="inline-block mr-2"
            >
              🎲
            </motion.span>
            {isSpinning ? 'Đang chọn...' : 'Nhận lời khuyên'}
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {current && !isSpinning && (
            <motion.div
              key={current.text}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="mt-5 bg-muted/50 rounded-xl p-4 text-left"
            >
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-2 ${categoryColors[current.category] || 'bg-muted'}`}>
                {current.category}
              </span>
              <p className="text-sm font-medium leading-relaxed">{current.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
