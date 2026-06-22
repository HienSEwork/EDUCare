import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ANONYMOUS_INBOX_COPY } from "@/content/experienceCopy";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";

export default function AnonymousQuestionBox() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user || !question.trim() || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await apiRequest("/community/questions", {
        method: "POST",
        body: JSON.stringify({ question: question.trim() }),
      });
      setQuestion("");
      setSubmitted(true);
      toast.success(ANONYMOUS_INBOX_COPY.success);
      window.setTimeout(() => setSubmitted(false), 3500);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : ANONYMOUS_INBOX_COPY.sendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = question.length;
  const charLimit = 500;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex flex-col overflow-hidden rounded-[1.75rem]"
      style={{
        background: "linear-gradient(145deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0.05) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Accent top bar — blue gradient */}
      <div
        className="h-1 w-full rounded-t-[1.75rem]"
        style={{ background: "linear-gradient(90deg,#3b82f6,#6366f1,#8b5cf6)" }}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            <Lock className="h-4 w-4 text-blue-300" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-bold text-white">{ANONYMOUS_INBOX_COPY.title}</h3>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                style={{ background: "rgba(99,102,241,0.25)", color: "#a5b4fc" }}
              >
                {ANONYMOUS_INBOX_COPY.badge}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-white/40">
              {ANONYMOUS_INBOX_COPY.description}
            </p>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, charLimit))}
            placeholder={user ? ANONYMOUS_INBOX_COPY.placeholderLoggedIn : ANONYMOUS_INBOX_COPY.placeholderGuest}
            disabled={!user || isSubmitting}
            rows={4}
            className="w-full resize-none rounded-[1rem] text-sm text-white placeholder:text-white/25 focus-visible:ring-1 focus-visible:ring-blue-500/60"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          />
          {/* char counter */}
          <span
            className="absolute bottom-2 right-3 text-[10px] font-semibold"
            style={{ color: charCount > charLimit * 0.9 ? "#f87171" : "rgba(255,255,255,0.25)" }}
          >
            {charCount}/{charLimit}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <motion.button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!user || !question.trim() || isSubmitting}
            whileHover={{ scale: !user || !question.trim() || isSubmitting ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              boxShadow: "0 4px 18px rgba(59,130,246,0.35)",
            }}
          >
            <Send className="h-3.5 w-3.5" />
            {isSubmitting ? ANONYMOUS_INBOX_COPY.submitting : ANONYMOUS_INBOX_COPY.submit}
          </motion.button>

          <Link
            to={user ? "/profile" : "/login"}
            className="text-[11px] font-semibold text-white/30 transition-colors hover:text-white/60"
          >
            {ANONYMOUS_INBOX_COPY.viewProfile}
          </Link>
        </div>

        {/* Success state */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="flex items-center gap-2 rounded-[0.9rem] px-4 py-2.5"
              style={{ background: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-xs text-emerald-300">{ANONYMOUS_INBOX_COPY.success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper note */}
        <div
          className="rounded-[0.9rem] px-3 py-2.5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
            {ANONYMOUS_INBOX_COPY.helperTitle}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/30">
            {ANONYMOUS_INBOX_COPY.helperItems[0]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
