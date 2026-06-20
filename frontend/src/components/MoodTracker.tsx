import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudDrizzle, Meh, Smile, SmilePlus, Zap } from "lucide-react";
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

/*
  Spectrum: ANXIOUS(near-black) → SAD(dark blue) → NEUTRAL(indigo) → OKAY(purple-rose) → HAPPY(vivid pink)
  Each mood has:
    - bg        : card background when selected
    - btnActive : button bg gradient when active
    - btnIdle   : button bg when idle
    - iconActive: icon color when active
    - iconIdle  : icon color when idle
    - textActive: label color when active
    - glow      : drop shadow glow color for active button
    - dot       : spectrum dot color below each button
    - adviceBg  : advice box background
    - tag       : mood name badge bg/text
*/
const MOODS = [
  {
    code: "ANXIOUS",
    dot:        "#374151",
    btnActive:  "linear-gradient(135deg,#111827,#1f2937)",
    btnIdle:    "rgba(255,255,255,0.08)",
    iconActive: "#9ca3af",
    iconIdle:   "rgba(255,255,255,0.35)",
    textActive: "#d1d5db",
    glow:       "rgba(55,65,81,0.7)",
    adviceBg:   "rgba(17,24,39,0.55)",
    tag:        "bg-gray-700/60 text-gray-300",
    cardBg:     "linear-gradient(145deg,#0d0d1a,#111827,#1a202c)",
  },
  {
    code: "SAD",
    dot:        "#3b82f6",
    btnActive:  "linear-gradient(135deg,#1d4ed8,#2563eb)",
    btnIdle:    "rgba(255,255,255,0.08)",
    iconActive: "#93c5fd",
    iconIdle:   "rgba(255,255,255,0.35)",
    textActive: "#bfdbfe",
    glow:       "rgba(37,99,235,0.7)",
    adviceBg:   "rgba(29,78,216,0.18)",
    tag:        "bg-blue-500/25 text-blue-200",
    cardBg:     "linear-gradient(145deg,#0c1a3a,#1e3a8a,#1d4ed8)",
  },
  {
    code: "NEUTRAL",
    dot:        "#6366f1",
    btnActive:  "linear-gradient(135deg,#4338ca,#6366f1)",
    btnIdle:    "rgba(255,255,255,0.08)",
    iconActive: "#a5b4fc",
    iconIdle:   "rgba(255,255,255,0.35)",
    textActive: "#c7d2fe",
    glow:       "rgba(99,102,241,0.7)",
    adviceBg:   "rgba(67,56,202,0.20)",
    tag:        "bg-indigo-500/25 text-indigo-200",
    cardBg:     "linear-gradient(145deg,#1e1b4b,#312e81,#4338ca)",
  },
  {
    code: "OKAY",
    dot:        "#a855f7",
    btnActive:  "linear-gradient(135deg,#7c3aed,#a855f7)",
    btnIdle:    "rgba(255,255,255,0.09)",
    iconActive: "#e9d5ff",
    iconIdle:   "rgba(255,255,255,0.35)",
    textActive: "#f3e8ff",
    glow:       "rgba(168,85,247,0.7)",
    adviceBg:   "rgba(124,58,237,0.18)",
    tag:        "bg-purple-500/25 text-purple-200",
    cardBg:     "linear-gradient(145deg,#2e1065,#6d28d9,#a855f7)",
  },
  {
    code: "HAPPY",
    dot:        "#ec4899",
    btnActive:  "linear-gradient(135deg,#db2777,#ec4899)",
    btnIdle:    "rgba(255,255,255,0.11)",
    iconActive: "#ffffff",
    iconIdle:   "rgba(255,255,255,0.35)",
    textActive: "#fff",
    glow:       "rgba(236,72,153,0.75)",
    adviceBg:   "rgba(236,72,153,0.18)",
    tag:        "bg-pink-500/25 text-pink-200",
    cardBg:     "linear-gradient(145deg,#831843,#db2777,#f472b6)",
  },
] as const;

const DEFAULT_CARD_BG = "linear-gradient(145deg,#0f172a,#1e1b4b,#0c1445)";
const DEFAULT_ADVICE_BG = "rgba(255,255,255,0.06)";

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

  const activeMoodDef = MOODS.find((m) => m.code === selectedCode) ?? null;
  const cardBg = activeMoodDef?.cardBg ?? DEFAULT_CARD_BG;
  const adviceBg = activeMoodDef?.adviceBg ?? DEFAULT_ADVICE_BG;

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
      animate={{ background: cardBg }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: cardBg }}
      className="relative overflow-hidden rounded-[1.75rem] p-6 lg:p-7"
    >
      {/* Radial glow that shifts with mood */}
      <AnimatePresence>
        {activeMoodDef && (
          <motion.div
            key={selectedCode}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="pointer-events-none absolute right-0 top-0 h-[260px] w-[260px] rounded-full blur-[90px]"
            style={{ background: activeMoodDef.dot, opacity: 0.18 }}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="relative mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {/* mood tag badge */}
            <AnimatePresence mode="wait">
              {activeMoodDef ? (
                <motion.span
                  key={selectedCode}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${activeMoodDef.tag}`}
                >
                  {activeMood?.label ?? ""}
                </motion.span>
              ) : (
                <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/30">
                  Hôm nay
                </span>
              )}
            </AnimatePresence>
          </div>
          <h3 className="mt-1 font-heading text-xl font-bold text-white">
            {MOOD_TRACKER_COPY.title}
          </h3>
          <p className="mt-0.5 text-xs text-white/45">
            {user ? MOOD_TRACKER_COPY.descriptionLoggedIn : MOOD_TRACKER_COPY.descriptionGuest}
          </p>
        </div>

        {/* Spectrum legend strip */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {MOODS.map((m) => (
              <span
                key={m.code}
                className="h-2 w-5 rounded-full transition-all duration-500"
                style={{
                  background: m.dot,
                  opacity: selectedCode === m.code ? 1 : 0.35,
                  transform: selectedCode === m.code ? "scaleY(1.6)" : "scaleY(1)",
                }}
              />
            ))}
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-white/25">
            Tối → Vui
          </span>
        </div>
      </div>

      {/* ── Mood buttons ── */}
      <div className="relative grid grid-cols-5 gap-2.5">
        {MOODS.map((moodDef) => {
          const copy = MOOD_TRACKER_COPY.moods.find((m) => m.code === moodDef.code)!;
          const Icon = moodIcons[moodDef.code];
          const isActive = selectedCode === moodDef.code;

          return (
            <motion.button
              key={moodDef.code}
              type="button"
              onClick={() => void handleSelect(moodDef.code as MoodEntry["moodCode"])}
              disabled={!user || isSaving}
              whileHover={{ scale: user ? 1.07 : 1, y: user ? -3 : 0 }}
              whileTap={{ scale: 0.93 }}
              className="relative flex flex-col items-center gap-2 rounded-2xl py-4 transition-all"
              style={{
                background: isActive ? moodDef.btnActive : moodDef.btnIdle,
                boxShadow: isActive ? `0 0 0 1.5px rgba(255,255,255,0.2), 0 8px 24px ${moodDef.glow}` : "none",
              }}
              animate={{ background: isActive ? moodDef.btnActive : moodDef.btnIdle }}
              transition={{ duration: 0.3 }}
            >
              {/* Active pulse ring */}
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-2xl"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.25 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  style={{ background: moodDef.dot, filter: "blur(4px)" }}
                />
              )}

              <Icon
                className="relative h-6 w-6 transition-all duration-300"
                style={{ color: isActive ? moodDef.iconActive : moodDef.iconIdle }}
                strokeWidth={isActive ? 2.2 : 1.4}
              />
              <span
                className="relative text-[10px] font-bold leading-none tracking-wide transition-colors duration-300"
                style={{ color: isActive ? moodDef.textActive : "rgba(255,255,255,0.35)" }}
              >
                {copy.shortLabel}
              </span>

              {/* Spectrum dot */}
              <span
                className="relative h-1 w-5 rounded-full transition-all duration-300"
                style={{
                  background: moodDef.dot,
                  opacity: isActive ? 1 : 0.3,
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* ── Advice box ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCode ?? "_empty"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative mt-5 rounded-[1.25rem] px-5 py-4"
          style={{ background: adviceBg, border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-sm leading-relaxed text-white/75">
            {activeMood?.advice ?? (user ? MOOD_TRACKER_COPY.emptyStateLoggedIn : MOOD_TRACKER_COPY.loginHint)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ── History strip ── */}
      {history.length > 0 && (
        <div
          className="relative mt-4 flex items-center justify-between rounded-[1rem] px-4 py-2.5"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[11px] font-semibold text-white/30">{MOOD_TRACKER_COPY.recentTitle}</span>
          <div className="flex items-center gap-2">
            {history.slice(-7).map((entry) => {
              const Icon = moodIcons[entry.moodCode];
              const def = MOODS.find((m) => m.code === entry.moodCode);
              return (
                <Icon
                  key={entry.id}
                  className="h-3.5 w-3.5 transition-colors"
                  style={{ color: def?.dot ?? "#4a5568" }}
                  strokeWidth={1.5}
                />
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
