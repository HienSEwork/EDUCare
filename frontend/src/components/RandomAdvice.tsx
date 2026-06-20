import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RANDOM_ADVICE_COPY } from "@/content/experienceCopy";

const categoryColors: Record<string, string> = {
  "Sức khỏe":    "bg-emerald-500/20 text-emerald-300",
  "Kỹ năng sống":"bg-blue-500/20 text-blue-300",
  "Tinh thần":   "bg-violet-500/20 text-violet-300",
  "An toàn":     "bg-cyan-500/20 text-cyan-300",
};

export default function RandomAdvice() {
  const [current, setCurrent] = useState<(typeof RANDOM_ADVICE_COPY.advices)[number] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const getRandomAdvice = () => {
    setIsSpinning(true);
    window.setTimeout(() => {
      let next: (typeof RANDOM_ADVICE_COPY.advices)[number];
      do {
        next = RANDOM_ADVICE_COPY.advices[Math.floor(Math.random() * RANDOM_ADVICE_COPY.advices.length)];
      } while (next === current && RANDOM_ADVICE_COPY.advices.length > 1);
      setCurrent(next);
      setIsSpinning(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[1.75rem] p-5"
      style={{ background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0c1445 100%)" }}
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-violet-500/15 blur-[70px]" />

      <div className="relative mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <Sparkles className="h-5 w-5 text-white/70" />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-white">{RANDOM_ADVICE_COPY.title}</h3>
          <p className="text-xs text-white/45">{RANDOM_ADVICE_COPY.description}</p>
        </div>
      </div>

      <div className="relative text-center">
        <Button
          onClick={getRandomAdvice}
          disabled={isSpinning}
          className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-2 text-sm font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:scale-[1.04] hover:shadow-[0_6px_30px_rgba(124,58,237,0.55)] transition-all"
        >
          <motion.span
            animate={isSpinning ? { rotate: 360 } : {}}
            transition={{ duration: 0.6, ease: "linear" }}
            className="mr-1.5 inline-flex"
          >
            <Sparkles className="h-4 w-4" />
          </motion.span>
          {isSpinning ? RANDOM_ADVICE_COPY.spinning : RANDOM_ADVICE_COPY.button}
        </Button>

        <AnimatePresence mode="wait">
          {current && !isSpinning && (
            <motion.div
              key={current.text}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="mt-4 rounded-[1.25rem] p-4 text-left"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <span className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${categoryColors[current.category] ?? "bg-white/10 text-white/60"}`}>
                {current.category}
              </span>
              <p className="text-sm font-medium leading-relaxed text-white/75">{current.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!current && !isSpinning && (
          <p className="mt-6 text-xs text-white/25">Nhấn để nhận gợi ý đầu tiên của bạn</p>
        )}
      </div>
    </motion.div>
  );
}
