import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, MessageCircle, Send, Sparkles, Trash2, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { AssistantChatResponse, AssistantChatTurn } from "@/types/api";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "educare-gemini-chat";
const MAX_STORED_MESSAGES = 24;
const SUGGESTIONS = [
  "Mình đang bị áp lực học tập",
  "Làm sao để dùng EDUCare hiệu quả?",
  "Mình muốn tìm hiểu về tuổi dậy thì",
];

interface DisplayMessage extends AssistantChatTurn {
  id: string;
  failed?: boolean;
}

function loadMessages(): DisplayMessage[] {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as DisplayMessage[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && (item.role === "user" || item.role === "model") && typeof item.content === "string").slice(-MAX_STORED_MESSAGES)
      : [];
  } catch {
    return [];
  }
}

export default function GeminiChatWidget() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<DisplayMessage[]>(loadMessages);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const sendMessage = async (rawMessage = input) => {
    const message = rawMessage.trim();
    if (!message || sending) return;

    const history = messages
      .filter((item) => !item.failed)
      .slice(-12)
      .map(({ role, content }) => ({ role, content }));
    const userMessage: DisplayMessage = { id: crypto.randomUUID(), role: "user", content: message };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await apiRequest<AssistantChatResponse>("/assistant/chat", {
        method: "POST",
        signal: controller.signal,
        body: JSON.stringify({ message, history }),
      });
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: "model",
        content: response.reply || "Trợ lý chưa thể phản hồi lúc này.",
      }]);
    } catch (error) {
      if (controller.signal.aborted) return;
      const content = error instanceof ApiError
        ? error.message
        : "Không thể kết nối với trợ lý. Bạn vui lòng thử lại sau.";
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: "model",
        content,
        failed: true,
      }]);
    } finally {
      if (!controller.signal.aborted) setSending(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSending(false);
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="Trợ lý EDUcare AI"
          className={cn(
            "fixed inset-x-3 bottom-3 flex h-[min(76dvh,620px)] flex-col overflow-hidden rounded-[1.75rem] border shadow-[0_24px_80px_rgba(15,23,42,0.24)] sm:absolute sm:bottom-[76px] sm:left-auto sm:right-0 sm:h-[570px] sm:w-[390px]",
            isLight
              ? "border-pink-200 bg-white text-slate-800"
              : "border-amber-300/25 bg-[#120d35] text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
          )}
        >
          <header className={cn(
            "flex items-center justify-between gap-3 px-4 py-3.5",
            isLight
              ? "bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white"
              : "bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-[#211303]",
          )}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-heading text-base font-extrabold tracking-tight">EDUcare AI</h2>
                <p className={cn("flex items-center gap-1 text-[11px] font-semibold", isLight ? "text-white/85" : "text-[#3b2505]/75")}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Tư vấn chủ đề tuổi teen
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={clearChat} aria-label="Xóa cuộc trò chuyện" className="rounded-full p-2 transition hover:bg-white/20">
                <Trash2 className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng trợ lý" className="rounded-full p-2 transition hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className={cn("flex-1 space-y-3 overflow-y-auto px-4 py-4", isLight ? "bg-[#fff9fc]" : "bg-[#0e092a]")}>
            <div className="flex gap-2.5">
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", isLight ? "bg-pink-100 text-pink-600" : "bg-amber-300/15 text-amber-300")}>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className={cn("max-w-[82%] rounded-2xl rounded-tl-md border px-3.5 py-3 text-sm leading-6", isLight ? "border-pink-100 bg-white text-slate-700" : "border-indigo-400/20 bg-indigo-950/70 text-indigo-100")}>
                Chào bạn! Mình có thể trò chuyện về học tập, cảm xúc, tuổi dậy thì, các mối quan hệ và cách sử dụng EDUCare.
              </div>
            </div>

            {messages.length === 0 && (
              <div className="space-y-2 pl-10 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className={cn(
                      "block w-full rounded-xl border px-3 py-2 text-left text-xs font-semibold transition",
                      isLight ? "border-pink-200 bg-white text-pink-700 hover:bg-pink-50" : "border-amber-300/20 bg-amber-300/5 text-amber-100 hover:bg-amber-300/10",
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-2.5", message.role === "user" ? "justify-end" : "justify-start")}>
                {message.role === "model" && (
                  <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", isLight ? "bg-pink-100 text-pink-600" : "bg-amber-300/15 text-amber-300")}>
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                  message.role === "user"
                    ? isLight ? "rounded-tr-md bg-gradient-to-br from-pink-500 to-rose-500 text-white" : "rounded-tr-md bg-gradient-to-br from-amber-300 to-orange-400 text-[#281805]"
                    : message.failed
                      ? isLight ? "rounded-tl-md border border-red-200 bg-red-50 text-red-700" : "rounded-tl-md border border-red-400/20 bg-red-950/40 text-red-200"
                      : isLight ? "rounded-tl-md border border-pink-100 bg-white text-slate-700" : "rounded-tl-md border border-indigo-400/20 bg-indigo-950/70 text-indigo-100",
                )}>
                  {message.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-center gap-2.5">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", isLight ? "bg-pink-100 text-pink-600" : "bg-amber-300/15 text-amber-300")}>
                  <Bot className="h-4 w-4" />
                </div>
                <div className={cn("flex items-center gap-2 rounded-2xl rounded-tl-md px-3.5 py-3 text-xs", isLight ? "border border-pink-100 bg-white text-slate-500" : "border border-indigo-400/20 bg-indigo-950/70 text-indigo-200")}>
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Đang suy nghĩ...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className={cn("border-t p-3", isLight ? "border-pink-100 bg-white" : "border-indigo-400/15 bg-[#120d35]")}>
            <div className={cn("flex items-end gap-2 rounded-2xl border p-2 pl-3 transition focus-within:ring-2", isLight ? "border-pink-200 bg-pink-50/60 focus-within:border-pink-400 focus-within:ring-pink-200" : "border-indigo-400/25 bg-indigo-950/50 focus-within:border-amber-300/60 focus-within:ring-amber-300/10")}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value.slice(0, 1200))}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={sending}
                placeholder="Nhập điều bạn muốn chia sẻ..."
                aria-label="Tin nhắn gửi EDUcare AI"
                className="max-h-24 min-h-[38px] flex-1 resize-none bg-transparent py-2 text-sm leading-5 outline-none placeholder:text-slate-400 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Gửi tin nhắn"
                className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-40", isLight ? "bg-pink-500 text-white hover:bg-pink-600" : "bg-amber-300 text-[#251604] hover:bg-amber-200")}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className={cn("mt-1.5 text-center text-[10px]", isLight ? "text-slate-400" : "text-indigo-300/55")}>AI có thể trả lời chưa chính xác. Không thay thế chuyên gia.</p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Đóng trợ lý EDUcare AI" : "Mở trợ lý EDUcare AI"}
        aria-expanded={open}
        className={cn(
          "group relative flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-[0_12px_35px_rgba(236,72,153,0.35)] transition duration-300 hover:-translate-y-1 sm:h-16 sm:w-16",
          open && "hidden sm:flex",
          isLight
            ? "border-white bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 text-white"
            : "border-amber-200/60 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-[#281805] shadow-[0_12px_35px_rgba(251,191,36,0.28)]",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7 transition group-hover:scale-110" />}
        {!open && <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />}
      </button>
    </div>
  );
}
