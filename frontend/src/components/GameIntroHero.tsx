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
  bgGradient = "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)",
  accentColor = "#06b6d4",
  buttonIcon,
}: GameIntroHeroProps) {
  return (
    <div className="min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: bgGradient }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-5xl px-4">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden bg-transparent border-none shadow-none p-0"
        >
          {/* Top layout: illustration + info */}
          <div className="flex flex-col lg:flex-row">
            {/* Illustration panel */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative flex items-center justify-center overflow-hidden bg-transparent lg:w-[48%]"
              style={{ minHeight: 300 }}
            >
              <img
                src={illustrationSrc}
                alt={`${title} illustration`}
                className="h-full w-full object-cover rounded-none"
                style={{ maxHeight: 380 }}
                draggable={false}
              />
            </motion.div>

            {/* Info panel */}
            <div className="flex flex-col justify-center p-8 lg:w-[52%] md:p-10">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex w-fit items-center gap-2 rounded-none border px-4 py-1.5 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-md"
                style={{ color: accentColor, borderColor: accentColor + "66", backgroundColor: accentColor + "15" }}
              >
                {eyebrow}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="mt-4 font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl"
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-3 text-sm leading-relaxed text-indigo-100/80 md:text-base font-medium"
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
                  <div key={s.label} className="rounded-none border border-white/10 bg-transparent p-3 text-center">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: accentColor }}>{s.label}</p>
                    <p className="mt-1 text-sm font-extrabold text-white">{s.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* How-to-play + CTA */}
          <div className="border-t border-indigo-500/20 bg-transparent p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
              {/* Rules */}
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: accentColor }}>Cách chơi</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {rules.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm font-medium text-indigo-100/90">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-none text-[11px] font-black text-slate-950 shadow-md"
                        style={{ background: accentColor }}
                      >
                        {i + 1}
                      </span>
                      <span>{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-start justify-end gap-3 lg:items-end">
                <Button
                  className="rounded-none px-8 py-6 text-base font-black text-slate-950 transition-all hover:brightness-110 active:scale-95 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
                  onClick={onStart}
                >
                  {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
                  {startLabel}
                </Button>
                <Button variant="outline" asChild className="rounded-none border-indigo-400/30 bg-indigo-950/50 text-indigo-200 hover:bg-indigo-900/80 text-xs font-bold">
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
