import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RANDOM_ADVICE_COPY } from "@/content/experienceCopy";

const categoryColors: Record<string, string> = {
  "Sức khỏe": "bg-mint/20 text-mint-foreground",
  "Kỹ năng sống": "bg-lavender/20 text-lavender-foreground",
  "Tinh thần": "bg-pink/20 text-pink-foreground",
  "An toàn": "bg-teal/20 text-teal-foreground",
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
      className="gradient-card rounded-[1.9rem] p-6 shadow-card"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">{RANDOM_ADVICE_COPY.title}</h3>
          <p className="text-sm text-muted-foreground">{RANDOM_ADVICE_COPY.description}</p>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={getRandomAdvice} disabled={isSpinning} className="gradient-primary rounded-[1.2rem] px-6 text-primary-foreground">
          <motion.span animate={isSpinning ? { rotate: 360 } : {}} transition={{ duration: 0.6, ease: "linear" }} className="inline-flex">
            <Sparkles className="h-4 w-4" />
          </motion.span>
          {isSpinning ? RANDOM_ADVICE_COPY.spinning : RANDOM_ADVICE_COPY.button}
        </Button>

        <AnimatePresence mode="wait">
          {current && !isSpinning ? (
            <motion.div
              key={current.text}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="mt-5 rounded-[1.35rem] bg-white/70 p-4 text-left"
            >
              <span className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColors[current.category] ?? "bg-muted"}`}>
                {current.category}
              </span>
              <p className="text-sm font-medium leading-relaxed">{current.text}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
