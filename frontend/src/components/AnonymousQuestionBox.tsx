import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Send, CheckCircle2, ShieldCheck, Sparkles, Mail, CornerDownRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ANONYMOUS_INBOX_COPY } from "@/content/experienceCopy";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ApiError, apiRequest } from "@/lib/api/client";

interface AnonymousQuestionBoxProps {
  variant?: "default" | "standalone";
}

const quickPrompts = [
  "Dậy thì muộn hay sớm có sao không?",
  "Đồng thuận F.R.I.E.S được hiểu như thế nào?",
  "Làm sao để đặt ranh giới an toàn khi hẹn hò?",
  "Cách giữ vệ sinh cơ thể tuổi dậy thì đúng chuẩn?",
];

/* Custom 3D Mailbox Graphic Component */
function MailboxGraphic({ flagUp, isReceiving }: { flagUp: boolean; isReceiving: boolean }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-4 select-none">
      {/* Sparkle burst behind mailbox when receiving letter */}
      <AnimatePresence>
        {isReceiving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.4 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-0 flex items-center justify-center"
          >
            <div className="h-48 w-48 rounded-full bg-amber-400/20 blur-2xl animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute text-amber-300 text-xs font-bold"
            >
              ✨ ✨ ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mailbox Frame */}
      <motion.div
        animate={isReceiving ? { y: [0, -10, 4, -2, 0], rotate: [0, -3, 3, -1, 0] } : { y: [0, -4, 0] }}
        transition={isReceiving ? { duration: 0.6 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-52 h-64 md:w-60 md:h-72 drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
      >
        <svg viewBox="0 0 240 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            {/* Gradients for 3D Mailbox */}
            <linearGradient id="mbBody" x1="0" y1="0" x2="240" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="mbRoof" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4338ca" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>

            <linearGradient id="mbDoor" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3730a3" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>

            <linearGradient id="goldGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            <filter id="glowSlot" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stand / Pole */}
          <rect x="110" y="210" width="20" height="70" rx="4" fill="#1e293b" />
          <rect x="105" y="270" width="30" height="10" rx="2" fill="#0f172a" />

          {/* Mailbox Dome Roof */}
          <path d="M 30 100 C 30 30, 210 30, 210 100 L 210 220 L 30 220 Z" fill="url(#mbBody)" stroke="#6366f1" strokeWidth="2.5" />

          {/* Top Arch Trim Accent */}
          <path d="M 30 100 C 30 35, 210 35, 210 100" fill="none" stroke="url(#goldGold)" strokeWidth="4" />

          {/* Front Face / Door */}
          <rect x="45" y="80" width="150" height="130" rx="16" fill="url(#mbDoor)" stroke="#4f46e5" strokeWidth="1.5" />

          {/* Mailbox Slot (Khe Thả Thư) */}
          <g>
            {/* Slot background */}
            <rect x="65" y="105" width="110" height="16" rx="8" fill="#090d16" stroke={isReceiving ? "#fde047" : "#4338ca"} strokeWidth="2" />

            {/* Glowing slot slit */}
            <rect x="70" y="111" width="100" height="4" rx="2" fill={isReceiving ? "#fef08a" : "#3b82f6"} filter={isReceiving ? "url(#glowSlot)" : undefined} />
          </g>

          {/* Decorative Slot Label: "HÒM THƯ BÍ MẬT" */}
          <rect x="75" y="132" width="90" height="18" rx="9" fill="#1e1b4b" stroke="url(#goldGold)" strokeWidth="1" />
          <text x="120" y="144" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
            HÒM THƯ BÍ MẬT
          </text>

          {/* Keyhole / Privacy Emblem */}
          <circle cx="120" cy="175" r="14" fill="#0f172a" stroke="url(#goldGold)" strokeWidth="1.5" />
          <path d="M 120 168 A 4 4 0 0 0 116 172 C 116 174 118 176 119 177 L 119 181 L 121 181 L 121 177 C 122 176 124 174 124 172 A 4 4 0 0 0 120 168 Z" fill="#fde047" />

          {/* Mailbox Flag (Cờ thông báo có thư) */}
          <motion.g
            animate={{ rotate: flagUp ? -85 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            style={{ originX: "205px", originY: "160px" }}
          >
            {/* Flagpole */}
            <rect x="202" y="110" width="6" height="55" rx="3" fill="#dc2626" />
            {/* Red Flag Head */}
            <path d="M 175 105 L 204 105 L 204 128 L 175 128 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
            <circle cx="189" cy="116" r="3" fill="#fef08a" />
          </motion.g>
        </svg>

        {/* Floating Mail Envelope graphic inside slot when receiving */}
        <AnimatePresence>
          {isReceiving && (
            <motion.div
              initial={{ y: -20, scale: 0.8, opacity: 0 }}
              animate={{ y: 20, scale: 0.3, opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, ease: "easeIn" }}
              className="absolute left-1/2 top-16 -translate-x-1/2 pointer-events-none"
            >
              <div className="flex items-center justify-center w-12 h-8 rounded-md bg-amber-300 text-slate-950 font-bold shadow-lg">
                <Mail className="h-5 w-5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status Pill below mailbox */}
      <div className="mt-2 flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-950/80 px-3.5 py-1 text-[11px] font-bold text-indigo-200 backdrop-blur-md">
        <span className={`h-2 w-2 rounded-full ${flagUp ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
        <span>{flagUp ? "Có câu hỏi mới trong hòm thư! 📬" : "Hòm thư bảo mật 100% ready"}</span>
      </div>
    </div>
  );
}

export default function AnonymousQuestionBox({ variant = "default" }: AnonymousQuestionBoxProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flagUp, setFlagUp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedText, setLastSubmittedText] = useState("");

  const inputAreaRef = useRef<HTMLDivElement>(null);
  const mailboxContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!user || !question.trim() || isSubmitting || isAnimating) return;

    const trimmedQuestion = question.trim();
    setLastSubmittedText(trimmedQuestion);

    try {
      setIsSubmitting(true);
      setIsAnimating(true);

      const apiPromise = apiRequest("/community/questions", {
        method: "POST",
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      await new Promise((res) => setTimeout(res, 1100));
      await apiPromise;

      setQuestion("");
      setFlagUp(true);
      setSubmitted(true);
      toast.success("Lá thư của bạn đã bay thẳng vào Hòm Thư Bí Mật thành công! 📬✨");

      setTimeout(() => setFlagUp(false), 8000);
    } catch (requestError) {
      toast.error(requestError instanceof ApiError ? requestError.message : ANONYMOUS_INBOX_COPY.sendError);
    } finally {
      setIsSubmitting(false);
      setIsAnimating(false);
    }
  };

  const charCount = question.length;
  const charLimit = 500;

  if (variant === "standalone") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={theme === "light"
          ? "relative overflow-hidden rounded-[2.5rem] p-6 md:p-10 border border-pink-200 bg-white shadow-[0_12px_40px_rgba(236,72,153,0.12)] text-slate-800"
          : "magic-card-glow relative overflow-hidden rounded-[2.5rem] p-6 md:p-10 border border-indigo-400/40 shadow-2xl text-white"
        }
      >
        {/* Header Title Banner */}
        <div className={theme === "light" ? "mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 pb-5" : "mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-indigo-400/20 pb-5"}>
          <div className="flex items-center gap-3">
            <div className={theme === "light" ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 border border-pink-200 text-pink-600 shadow-sm" : "flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-900/80 border border-indigo-400/40 text-amber-300 shadow-md"}>
              <Mail className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className={theme === "light" ? "inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-3 py-0.5 text-[10px] font-heading font-extrabold text-pink-600 uppercase" : "inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-3 py-0.5 text-[10px] font-heading font-extrabold text-cyan-300 uppercase"}>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% ẨN DANH • KHÔNG LƯU NICKNAME</span>
              </div>
              <h2 className={theme === "light" ? "font-heading text-xl md:text-2xl font-extrabold text-slate-800" : "font-heading text-xl md:text-2xl font-extrabold text-white"}>
                Hòm Thư Ẩn Danh & <span className={theme === "light" ? "text-pink-600" : "text-amber-300"}>Gỡ Rối Thầm Kín ✨</span>
              </h2>
            </div>
          </div>

          <p className={theme === "light" ? "text-xs text-slate-500 max-w-md" : "text-xs text-indigo-200/70 max-w-md"}>
            Những thắc mắc nhạy cảm về dậy thì, giới tính hay tình cảm? Viết lá thư và thả ngay vào Hòm Thư — đội ngũ EDUcare sẽ tư vấn riêng cho bạn!
          </p>
        </div>

        {/* Main 2-Column Content: Left Input Form + Right 3D Mailbox */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left Column — Textarea Form */}
          <div ref={inputAreaRef} className={theme === "light" ? "relative space-y-4 bg-pink-50/60 p-5 md:p-6 rounded-3xl border border-pink-200/70" : "relative space-y-4 bg-indigo-950/60 p-5 md:p-6 rounded-3xl border border-indigo-400/30 backdrop-blur-md"}>
            
            <AnimatePresence>
              {isAnimating && (
                <motion.div
                  initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: [1, 1, 0.9, 0],
                    scale: [1, 0.75, 0.4, 0.15],
                    x: [0, 80, 220, 320],
                    y: [0, -90, -110, -20],
                    rotate: [0, -12, 18, 30],
                  }}
                  transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-x-4 top-4 z-50 pointer-events-none"
                >
                  <div className="flex flex-col gap-2 rounded-2xl bg-amber-200 p-4 text-slate-950 shadow-2xl border-2 border-amber-400">
                    <div className="flex items-center justify-between border-b border-amber-400/60 pb-1.5 text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4" /> Lá thư ẩn danh gửi EDUcare
                      </span>
                      <span className="text-[10px] bg-amber-400/60 px-2 py-0.5 rounded-full">BÍ MẬT</span>
                    </div>
                    <p className="text-xs italic line-clamp-2 font-medium">
                      "{lastSubmittedText}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value.slice(0, charLimit))}
                placeholder={user ? "Nhập thắc mắc hoặc bí mật bạn cần tư vấn ẩn danh..." : "Vui lòng đăng nhập để thả thư vào Hòm Thư BÍ MẬT..."}
                disabled={!user || isSubmitting || isAnimating}
                rows={5}
                className={theme === "light"
                  ? "w-full resize-none rounded-2xl bg-white border border-pink-200 p-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-pink-500 transition-all"
                  : "w-full resize-none rounded-2xl bg-indigo-900/50 border border-indigo-400/30 p-4 text-sm text-white placeholder:text-indigo-300/40 focus-visible:ring-1 focus-visible:ring-amber-300 transition-all"
                }
              />
              <span className={theme === "light" ? "absolute bottom-3 right-4 text-[10px] font-bold text-slate-400" : "absolute bottom-3 right-4 text-[10px] font-bold text-indigo-300/60"}>
                {charCount}/{charLimit}
              </span>
            </div>

            {/* Quick Prompts */}
            <div>
              <p className={theme === "light" ? "text-[11px] font-heading font-extrabold text-pink-600 uppercase tracking-wider mb-2 flex items-center gap-1" : "text-[11px] font-heading font-extrabold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1"}>
                <Sparkles className="h-3.5 w-3.5" /> Gợi ý câu hỏi nhanh:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setQuestion(prompt)}
                    disabled={!user || isSubmitting || isAnimating}
                    className={theme === "light"
                      ? "rounded-full border border-pink-200 bg-white px-3 py-1 text-[11px] text-slate-700 hover:border-pink-500 hover:text-pink-600 hover:bg-pink-100/60 transition-all text-left shadow-xs"
                      : "rounded-full border border-indigo-400/30 bg-indigo-900/40 px-3 py-1 text-[11px] text-indigo-200 hover:border-amber-300 hover:text-white hover:bg-indigo-800/60 transition-all text-left"
                    }
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <motion.button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!user || !question.trim() || isSubmitting || isAnimating}
                whileHover={{ scale: !user || !question.trim() || isSubmitting || isAnimating ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="magic-btn-primary flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-extrabold disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
              >
                <Send className="h-4 w-4" />
                {isAnimating ? "Đang thả thư vào hòm..." : isSubmitting ? "Đang gửi..." : "Thả thư vào Hòm Ẩn Danh 📬"}
              </motion.button>

              {!user && (
                <Link to="/login" className={theme === "light" ? "text-xs font-bold text-pink-600 hover:underline" : "text-xs font-bold text-amber-300 hover:underline"}>
                  Đăng nhập ngay để gửi →
                </Link>
              )}
            </div>

            {/* Success State Notification */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-start justify-between gap-3 rounded-2xl p-4 bg-emerald-950/90 border border-emerald-400/50 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-emerald-300">Đã thả lá thư vào Hòm Thư thành công!</p>
                      <p className="text-[11px] text-emerald-200/80 mt-0.5">Câu hỏi của bạn đã được lưu ẩn danh. Đội ngũ EDUcare sẽ tư vấn sớm nhất.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-[10px] font-bold text-emerald-300 hover:underline shrink-0"
                  >
                    Gửi thư khác
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column — 3D Mailbox Visual Container */}
          <div ref={mailboxContainerRef} className={theme === "light" ? "flex flex-col items-center justify-center p-4 bg-pink-50/50 rounded-3xl border border-pink-200/60" : "flex flex-col items-center justify-center p-4 bg-indigo-950/40 rounded-3xl border border-indigo-400/20"}>
            <MailboxGraphic flagUp={flagUp} isReceiving={isAnimating} />
          </div>
        </div>
      </motion.div>
    );
  }

  /* Default Card Variant */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex flex-col overflow-hidden rounded-[1.75rem] magic-card border border-indigo-400/30 p-5"
    >
      <div className="flex flex-1 flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-900/60 border border-indigo-400/30">
            <Mail className="h-4 w-4 text-cyan-300" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-bold text-white">{ANONYMOUS_INBOX_COPY.title}</h3>
              <span className="shrink-0 rounded-full bg-indigo-900/80 px-2 py-0.5 text-[9px] font-bold uppercase text-cyan-300">
                {ANONYMOUS_INBOX_COPY.badge}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-indigo-200/60">
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
            disabled={!user || isSubmitting || isAnimating}
            rows={4}
            className="w-full resize-none rounded-2xl bg-indigo-950/60 border border-indigo-400/30 p-3.5 text-sm text-white placeholder:text-indigo-300/40 focus-visible:ring-1 focus-visible:ring-amber-300"
          />
          <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-indigo-300/50">
            {charCount}/{charLimit}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <motion.button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!user || !question.trim() || isSubmitting || isAnimating}
            whileHover={{ scale: !user || !question.trim() || isSubmitting || isAnimating ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="magic-btn-primary flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="h-3.5 w-3.5" />
            {isAnimating ? "Đang thả thư..." : isSubmitting ? ANONYMOUS_INBOX_COPY.submitting : ANONYMOUS_INBOX_COPY.submit}
          </motion.button>

          <Link
            to={user ? "/profile" : "/login"}
            className="text-[11px] font-semibold text-indigo-200/50 hover:text-white transition-colors"
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
              className="flex items-center gap-2 rounded-xl p-3 bg-emerald-950/70 border border-emerald-400/40"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <p className="text-xs text-emerald-200">{ANONYMOUS_INBOX_COPY.success}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
