import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudDrizzle, Meh, Smile, SmilePlus, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import { MOOD_TRACKER_COPY } from "@/content/experienceCopy";
import type { MoodEntry } from "@/types/api";

const moodIcons = {
  HAPPY:   SmilePlus,
  OKAY:    Smile,
  NEUTRAL: Meh,
  SAD:     CloudDrizzle,
  ANXIOUS: Zap,
} as const;

/* Gradient scale: dark/black → vibrant pink
   ANXIOUS = near black (#1a1a2e / dark navy)
   SAD     = dark slate-blue
   NEUTRAL = cool muted indigo
   OKAY    = soft rose-purple
   HAPPY   = vivid warm pink
*/
const moodTheme: Record<string, {
  bg: string;          // card background gradient
  pill: string;        // button gradient (active)
  pillIdle: string;    // button idle bg
  icon: string;        // icon color
  label: string;       // label text color when active
  ring: string;        // ring shadow
  adviceBg: string;    // advice box bg
  historyDot: string;  // dot for history
}> = {
  ANXIOUS: {
    bg:         "linear-gradient(145deg, #0d0d1a 0%, #1a1a2e 60%, #16213e 100%)",
    pill:       "linear-gradient(135deg, #1a1a2e, #0d0d1a)",
    pillIdle:   "rgba(255,255,255,0.06)",
    icon:       "#a0aec0",
    label:      "#e2e8f0",
    ring:       "0 0 0 2px #4a5568",
    adviceBg:   "rgba(255,255,255,0.05)",
    historyDot: "#718096",
  },
  SAD: {
    bg:         "linear-gradient(145deg, #1a202c 0%, #2d3561 60%, #263063 100%)",
    pill:       "linear-gradient(135deg, #2d3561, #1a202c)",
    pillIdle:   "rgba(255,255,255,0.07)",
    icon:       "#90cdf4",
    label:      "#bee3f8",
    ring:       "0 0 0 2px #4299e1",
    adviceBg:   "rgba(66,153,225,0.08)",
    historyDot: "#4299e1",
  },
  NEUTRAL: {
    bg:         "linear-gradient(145deg, #1e1b4b 0%, #312e81 55%, #3730a3 100%)",
    pill:       "linear-gradient(135deg, #312e81, #1e1b4b)",
    pillIdle:   "rgba(255,255,255,0.08)",
    icon:       "#a5b4fc",
    label:      "#c7d2fe",
    ring:       "0 0 0 2px #6366f1",
    adviceBg:   "rgba(99,102,241,0.12)",
    historyDot: "#6366f1",
  },
  OKAY: {
    bg:         "linear-gradient(145deg, #4a1942 0%, #7c3aed 45%, #db2777 100%)",
    pill:       "linear-gradient(135deg, #7c3aed, #db2777)",
    pillIdle:   "rgba(255,255,255,0.10)",
    icon:       "#f9a8d4",
    label:      "#fce7f3",
    ring:       "0 0 0 2px #ec4899",
    adviceBg:   "rgba(236,72,153,0.10)",
    historyDot: "#ec4899",
  },
  HAPPY: {
    bg:         "linear-gradient(145deg, #be185d 0%, #ec4899 45%, #f472b6 100%)",
    pill:       "linear-gradient(135deg, #ec4899, #f9a8d4)",
    pillIdle:   "rgba(255,255,255,0.15)",
    icon:       "#fff",
    label:      "#fff",
    ring:       "0 0 0 2px rgba(255,255,255,0.5)",
    adviceBg:   "rgba(255,255,255,0.15)",
    historyDot: "#fff",
  },
};

const defaultTheme = {
  bg:         "linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0c1445 100%)",
  adviceBg:   "rgba(255,255,255,0.06)",
  historyDot: "#4a5568",
};

export default function MoodTracker() {
  const { user } = useAuth();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) { setHistory([]); setSelectedCode(null); return; }
    void apiRequest<MoodEntry[]>("/community/moods")
      .then((entries) => {
        setHistory(entries);
        const today = new Date().toISOString().slice(0, 10);
        const todayEntry = entries.find((e) => e.entryDate === today);
        setSelectedCode(todayEntry?.moodCode ?? null);
      })
      .catch(() => { setHistory([]); setSelectedCode(null); });
  }, [user]);

  const activeMood = useMemo(
    () => MOOD_TRACKER_COPY.moods.find((m) => m.code === selectedCode) ?? null,
    [selectedCode],
  );

  const theme = selectedCode ? (moodTheme[selectedCode] ?? null) : null;
  const cardBg = theme?.bg ?? defaultTheme.bg;

  const handleSelect = async (moodCode: MoodEntry["moodCode"]) => {
    if (!user || isSaving) return;
    setSelectedCode(moodCode);
    try {
      setIsSaving(true);
      const nextHistory = await apiRequest<MoodEntry[]>("/community/moods", {
        method: "POST",
        body: JSON.stringify({ moodCode, note: null }),
      });
      setHistory(nextHistory);
      toast.success(MOOD_TRACKER_COPY.saved);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : MOOD_TRACKER_COPY.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[1.75rem] p-5"
      animate={{ background: cardBg }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: cardBg }}
    >
      {/* Subtle inner glow that shifts with mood */}
      <AnimatePresence>
        {theme && (
          <motion.div
            key={selectedCode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
            style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)" }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <Sparkles className="h-5 w-5 text-white/70" />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-white">{MOOD_TRACKER_COPY.title}</h3>
          <p className="text-xs text-white/50">
            {user ? MOOD_TRACKER_COPY.descriptionLoggedIn : MOOD_TRACKER_COPY.descriptionGuest}
          </p>
        </div>
      </div>

      {/* Mood buttons — 5 pills, dark→pink spectrum */}
      <div className="relative grid grid-cols-5 gap-2">
        {MOOD_TRACKER_COPY.moods.map((mood, i) => {
          const Icon = moodIcons[mood.code];
          const isActive = selectedCode === mood.code;
          const t = moodTheme[mood.code];

          return (
            <motion.button
              key={mood.code}
              type="button"
              onClick={() => void handleSelect(mood.code)}
              disabled={!user || isSaving}
              whileHover={{ scale: user ? 1.08 : 1, y: user ? -2 : 0 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center gap-1.5 rounded-2xl py-3 text-center transition-all"
              style={{
                background: isActive ? t.pill : t.pillIdle,
                boxShadow: isActive ? t.ring : "none",
              }}
              animate={{
                background: isActive ? t.pill : t.pillIdle,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* shimmer ring on active */}
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-2xl"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: [0, 0.4, 0], scale: [0.85, 1.1, 1.2] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ border: "1px solid rgba(255,255,255,0.5)" }}
                />
              )}
              <Icon
                className="h-5 w-5 transition-colors"
                style={{ color: isActive ? t.icon : "rgba(255,255,255,0.45)" }}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className="text-[10px] font-bold leading-none transition-colors"
                style={{ color: isActive ? t.label : "rgba(255,255,255,0.4)" }}
              >
                {mood.shortLabel}
              </span>
              {/* spectrum color dot bottom */}
              <span
                className="mt-0.5 h-1 w-4 rounded-full opacity-60"
                style={{
                  background: [
                    "#1a1a2e", // ANXIOUS
                    "#2d3561", // SAD
                    "#312e81", // NEUTRAL
                    "#7c3aed", // OKAY
                    "#ec4899", // HAPPY
                  ][i],
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Advice text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCode ?? "empty"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="relative mt-4 rounded-[1.25rem] px-4 py-3 text-sm"
          style={{ background: theme?.adviceBg ?? defaultTheme.adviceBg }}
        >
          <p className="leading-relaxed text-white/70">
            {activeMood
              ? activeMood.advice
              : (user ? MOOD_TRACKER_COPY.emptyStateLoggedIn : MOOD_TRACKER_COPY.loginHint)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* History dots */}
      {history.length > 0 && (
        <div className="relative mt-3 flex items-center justify-between rounded-[1rem] px-3 py-2" style={{ background: "rgba(255,255,255,0.05)" }}>
          <span className="text-[11px] text-white/35">{MOOD_TRACKER_COPY.recentTitle}</span>
          <div className="flex items-center gap-1.5">
            {history.slice(-7).map((entry) => {
              const Icon = moodIcons[entry.moodCode];
              const dot = moodTheme[entry.moodCode]?.historyDot ?? defaultTheme.historyDot;
              return (
                <Icon key={entry.id} className="h-3.5 w-3.5" style={{ color: dot }} strokeWidth={1.5} />
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
