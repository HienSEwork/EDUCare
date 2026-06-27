import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface GameStat {
  label: string;
  value: string;
}

export interface GameRule {
  text: string;
}

export interface GameIntroHeroProps {
  /** SVG illustration URL (import as ?url or from assets) */
  illustrationSrc: string;
  /** Short eyebrow label */
  eyebrow: string;
  /** Game title */
  title: string;
  /** One-line description */
  description: string;
  /** 3 stat chips below description */
  stats: GameStat[];
  /** How-to-play rules list */
  rules: GameRule[];
  /** CTA button label */
  startLabel: string;
  /** Called when user clicks start */
  onStart: () => void;
  /** Background gradient (CSS value) */
  bgGradient?: string;
  /** Accent color for eyebrow + stats label */
  accentColor?: string;
  /** Button icon slot */
  buttonIcon?: React.ReactNode;
}

export default function GameIntroHero({
  illustrationSrc,
  eyebrow,
  title,
  description,
  stats,
  rules,
  startLabel,
  onStart,
  bgGradient = "linear-gradient(135deg,rgba(155,93,229,0.12) 0%,rgba(246,241,255,0.96) 50%,rgba(6,214,160,0.10) 100%)",
  accentColor = "#9b5de5",
  buttonIcon,
}: GameIntroHeroProps) {
  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[2.4rem] border border-white/70 shadow-card"
          style={{ background: bgGradient }}
        >
          {/* Top layout: illustration + info */}
          <div className="flex flex-col lg:flex-row">
            {/* Illustration panel */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative flex items-center justify-center overflow-hidden bg-black/10 lg:w-[52%]"
              style={{ minHeight: 280 }}
            >
              <img
                src={illustrationSrc}
                alt={`${title} illustration`}
                className="h-full w-full object-cover"
                style={{ maxHeight: 340 }}
                draggable={false}
              />
              {/* Gradient fade into content side */}
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-white/20 to-transparent lg:block" />
            </motion.div>

            {/* Info panel */}
            <div className="flex flex-col justify-center p-8 lg:w-[48%] md:p-10">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] shadow-soft"
                style={{ color: accentColor }}
              >
                {eyebrow}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="mt-4 font-heading text-3xl font-bold leading-tight md:text-4xl"
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-3 text-sm leading-7 text-foreground/74 md:text-base"
              >
                {description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 grid grid-cols-3 gap-3"
              >
                {stats.map((s) => (
                  <div key={s.label} className="rounded-[1.4rem] border border-white/70 bg-white/76 p-3 shadow-soft text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: accentColor }}>{s.label}</p>
                    <p className="mt-1 text-sm font-bold">{s.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* How-to-play + CTA */}
          <div className="border-t border-white/50 p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
              {/* Rules */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accentColor }}>Cách chơi</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {rules.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ background: accentColor }}
                      >
                        {i + 1}
                      </span>
                      {r.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-start justify-end gap-3 lg:items-end">
                <Button
                  className="px-8 py-6 text-base font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
                  onClick={onStart}
                >
                  {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
                  {startLabel}
                </Button>
                <Button variant="outline" asChild className="text-sm">
                  <Link to="/games">← Về trang game</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
