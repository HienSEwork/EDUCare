import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`game-page relative -mt-24 min-h-screen overflow-hidden pb-16 pt-32 font-body md:-mt-28 md:pb-20 md:pt-40 ${isLight ? "text-slate-800" : "text-slate-100"}`}
      style={{ background: isLight ? "linear-gradient(160deg, #fff8fb 0%, #fff 45%, #f5f0ff 100%)" : bgGradient }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute -left-40 top-10 h-[500px] w-[500px] rounded-full blur-[140px] ${isLight ? "bg-pink-300/25" : "bg-purple-600/20"}`} />
        <div className={`absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full blur-[150px] ${isLight ? "bg-sky-200/30" : "bg-cyan-500/15"}`} />
        <div className={`absolute bottom-10 left-1/3 h-[450px] w-[450px] rounded-full blur-[130px] ${isLight ? "bg-violet-200/25" : "bg-pink-500/15"}`} />
      </div>

      <div className="container mx-auto max-w-5xl px-4">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`overflow-hidden rounded-[2rem] border shadow-2xl backdrop-blur-xl ${isLight ? "border-pink-100 bg-white/80 shadow-pink-200/40" : "border-indigo-400/20 bg-[#100b31]/70 shadow-black/30"}`}
        >
          {/* Top layout: illustration + info */}
          <div className="flex flex-col lg:flex-row">
            {/* Illustration panel */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className={`relative flex min-h-[230px] items-center justify-center overflow-hidden p-4 sm:min-h-[300px] sm:p-6 lg:w-[48%] ${isLight ? "bg-gradient-to-br from-pink-50 to-violet-50" : "bg-white/[0.03]"}`}
            >
              <img
                src={illustrationSrc}
                alt={`${title} illustration`}
                className="h-full max-h-[340px] w-full rounded-[1.5rem] object-contain"
                draggable={false}
              />
            </motion.div>

            {/* Info panel */}
            <div className="flex flex-col justify-center p-5 sm:p-7 lg:w-[52%] lg:p-10">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm"
                style={{ color: accentColor, borderColor: accentColor + "66", backgroundColor: accentColor + "15" }}
              >
                {eyebrow}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className={`mt-4 font-heading text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl ${isLight ? "text-slate-900" : "text-white"}`}
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className={`mt-3 text-sm font-medium leading-relaxed md:text-base ${isLight ? "text-slate-600" : "text-indigo-100/80"}`}
              >
                {description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 grid grid-cols-1 gap-2 min-[380px]:grid-cols-3 sm:gap-3"
              >
                {stats.map((s) => (
                  <div key={s.label} className={`rounded-xl border p-3 text-center ${isLight ? "border-slate-200 bg-white/80" : "border-white/10 bg-white/[0.03]"}`}>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: accentColor }}>{s.label}</p>
                    <p className={`mt-1 text-sm font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>{s.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* How-to-play + CTA */}
          <div className={`border-t p-5 sm:p-7 lg:p-10 ${isLight ? "border-pink-100 bg-white/55" : "border-indigo-500/20 bg-white/[0.02]"}`}>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
              {/* Rules */}
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: accentColor }}>Cách chơi</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {rules.map((r, i) => (
                    <div key={i} className={`flex items-start gap-3 text-sm font-medium ${isLight ? "text-slate-600" : "text-indigo-100/90"}`}>
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-slate-950 shadow-md"
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
              <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row lg:flex-col lg:items-end">
                <Button
                  className="w-full rounded-xl px-8 py-6 text-base font-black text-slate-950 shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110 active:scale-95 sm:w-auto"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
                  onClick={onStart}
                >
                  {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
                  {startLabel}
                </Button>
                <Button variant="outline" asChild className={isLight ? "w-full rounded-xl border-pink-200 bg-white text-xs font-bold text-slate-600 hover:bg-pink-50 sm:w-auto" : "w-full rounded-xl border-indigo-400/30 bg-indigo-950/50 text-xs font-bold text-indigo-200 hover:bg-indigo-900/80 sm:w-auto"}>
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
