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
      className="gradient-card rounded-[1.9rem] p-6 shadow-card"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MessageCircleQuestion className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-bold">{ANONYMOUS_INBOX_COPY.title}</h3>
            <span className="rounded-full bg-pink/20 px-2.5 py-1 text-xs font-semibold text-pink-foreground">
              {ANONYMOUS_INBOX_COPY.badge}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{ANONYMOUS_INBOX_COPY.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={user ? ANONYMOUS_INBOX_COPY.placeholderLoggedIn : ANONYMOUS_INBOX_COPY.placeholderGuest}
          className="min-h-[132px] rounded-[1.35rem] border-white/70 bg-white/75"
          disabled={!user || isSubmitting}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!user || !question.trim() || isSubmitting}
            className="gradient-primary rounded-[1.2rem] px-6 text-primary-foreground"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? ANONYMOUS_INBOX_COPY.submitting : ANONYMOUS_INBOX_COPY.submit}
          </Button>

          <Link to={user ? "/profile" : "/login"} className="text-sm font-semibold text-primary transition-opacity hover:opacity-80">
            {ANONYMOUS_INBOX_COPY.viewProfile}
          </Link>
        </div>

        {submitted ? (
          <div className="rounded-[1.2rem] bg-mint/20 px-4 py-3 text-sm text-mint-foreground">
            {ANONYMOUS_INBOX_COPY.success}
          </div>
        ) : null}

        <div className="rounded-[1.35rem] border border-white/60 bg-white/65 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {ANONYMOUS_INBOX_COPY.helperTitle}
          </p>
          <div className="mt-3 space-y-2">
            {ANONYMOUS_INBOX_COPY.helperItems.map((item) => (
              <p key={item} className="text-sm text-muted-foreground">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
