import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircleQuestion, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    if (!user || !question.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest("/community/questions", {
        method: "POST",
        body: JSON.stringify({
          question: question.trim(),
        }),
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[1.75rem] p-5"
      style={{ background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0c1445 100%)" }}
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/15 blur-[60px]" />

      <div className="relative mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <MessageCircleQuestion className="h-5 w-5 text-white/70" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-white">{ANONYMOUS_INBOX_COPY.title}</h3>
            <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-300">
              {ANONYMOUS_INBOX_COPY.badge}
            </span>
          </div>
          <p className="text-xs text-white/45">{ANONYMOUS_INBOX_COPY.description}</p>
        </div>
      </div>

      <div className="relative space-y-3">
        <Textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={user ? ANONYMOUS_INBOX_COPY.placeholderLoggedIn : ANONYMOUS_INBOX_COPY.placeholderGuest}
          className="min-h-[110px] rounded-[1.2rem] border-white/10 bg-white/7 text-sm text-white placeholder:text-white/30 focus-visible:ring-indigo-500/50"
          style={{ background: "rgba(255,255,255,0.06)" }}
          disabled={!user || isSubmitting}
        />

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!user || !question.trim() || isSubmitting}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2 text-sm font-bold text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(79,70,229,0.55)] transition-all"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            {isSubmitting ? ANONYMOUS_INBOX_COPY.submitting : ANONYMOUS_INBOX_COPY.submit}
          </Button>
          <Link to={user ? "/profile" : "/login"} className="text-xs font-semibold text-white/40 transition-colors hover:text-white/70">
            {ANONYMOUS_INBOX_COPY.viewProfile}
          </Link>
        </div>

        {submitted && (
          <div className="rounded-[1rem] bg-emerald-500/15 px-4 py-2.5 text-sm text-emerald-300">
            {ANONYMOUS_INBOX_COPY.success}
          </div>
        )}

        <div className="rounded-[1rem] px-4 py-3" style={{ background: "rgba(255,255,255,0.04)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
            {ANONYMOUS_INBOX_COPY.helperTitle}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/35">
            {ANONYMOUS_INBOX_COPY.helperItems[0]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
