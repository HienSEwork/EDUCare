import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CloudDrizzle, Meh, Smile, SmilePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import { MOOD_TRACKER_COPY } from "@/content/experienceCopy";
import type { MoodEntry } from "@/types/api";

const moodIcons = {
  HAPPY: SmilePlus,
  OKAY: Smile,
  NEUTRAL: Meh,
  SAD: CloudDrizzle,
  ANXIOUS: Sparkles,
} as const;

const moodColors = {
  HAPPY: "bg-mint/20 text-mint-foreground border-mint/30",
  OKAY: "bg-lavender/20 text-lavender-foreground border-lavender/30",
  NEUTRAL: "bg-muted text-foreground border-border/70",
  SAD: "bg-peach/20 text-peach-foreground border-peach/30",
  ANXIOUS: "bg-pink/20 text-pink-foreground border-pink/30",
} as const;

export default function MoodTracker() {
  const { user } = useAuth();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setSelectedCode(null);
      return;
    }

    void apiRequest<MoodEntry[]>("/community/moods")
      .then((entries) => {
        setHistory(entries);
        const today = new Date().toISOString().slice(0, 10);
        const todayEntry = entries.find((entry) => entry.entryDate === today);
        setSelectedCode(todayEntry?.moodCode ?? null);
      })
      .catch(() => {
        setHistory([]);
        setSelectedCode(null);
      });
  }, [user]);

  const activeMood = useMemo(
    () => MOOD_TRACKER_COPY.moods.find((mood) => mood.code === selectedCode) ?? null,
    [selectedCode],
  );

  const handleSelect = async (moodCode: MoodEntry["moodCode"]) => {
    if (!user || isSaving) {
      return;
    }

    setSelectedCode(moodCode);

    try {
      setIsSaving(true);
      const nextHistory = await apiRequest<MoodEntry[]>("/community/moods", {
        method: "POST",
        body: JSON.stringify({
          moodCode,
          note: null,
        }),
      });
      setHistory(nextHistory);
      toast.success(MOOD_TRACKER_COPY.saved);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : MOOD_TRACKER_COPY.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="gradient-card rounded-[1.9rem] p-6 shadow-card"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">{MOOD_TRACKER_COPY.title}</h3>
          <p className="text-sm text-muted-foreground">
            {user ? MOOD_TRACKER_COPY.descriptionLoggedIn : MOOD_TRACKER_COPY.descriptionGuest}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {MOOD_TRACKER_COPY.moods.map((mood) => {
          const Icon = moodIcons[mood.code];
          const isActive = selectedCode === mood.code;

          return (
            <button
              key={mood.code}
              type="button"
              onClick={() => void handleSelect(mood.code)}
              disabled={!user || isSaving}
              className={`flex flex-col items-center gap-2 rounded-[1.25rem] border p-3 text-center transition-all ${
                isActive
                  ? `${moodColors[mood.code]} ring-2 ring-primary/35 shadow-soft`
                  : "border-white/70 bg-white/70 hover:bg-white/85"
              } ${!user ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-semibold">{mood.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {activeMood ? (
        <div className="mt-5 rounded-[1.35rem] bg-white/70 p-4 text-sm text-muted-foreground">
          {activeMood.advice}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.35rem] bg-white/70 p-4 text-sm text-muted-foreground">
          {user ? MOOD_TRACKER_COPY.emptyStateLoggedIn : MOOD_TRACKER_COPY.loginHint}
        </div>
      )}

      {history.length > 0 ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/60 bg-white/60 px-4 py-3 text-xs text-muted-foreground">
          <span>{MOOD_TRACKER_COPY.recentTitle}</span>
          <div className="flex items-center gap-2">
            {history.slice(-5).map((entry) => {
              const Icon = moodIcons[entry.moodCode];
              return <Icon key={entry.id} className="h-4 w-4" />;
            })}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
