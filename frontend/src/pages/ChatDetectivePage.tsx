import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowRight, RefreshCw, Trophy, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHAT_SCENARIOS, type ChatScenario, type ChatScene } from "@/data/chatScenarios";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-chat-detective.svg";

type GamePhase = "intro" | "select" | "playing" | "result";

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/40"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

interface RevealedMessage {
  id: number;
  from: "stranger" | "player";
  text: string;
  shown: boolean;
}

export default function ChatDetectivePage() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [scenario, setScenario] = useState<ChatScenario | null>(null);
  const [currentScene, setCurrentScene] = useState<ChatScene | null>(null);
  const [messages, setMessages] = useState<RevealedMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [endingHistory, setEndingHistory] = useState<{ title: string; points: number; type: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const revealIndex = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const startScenario = useCallback((s: ChatScenario) => {
    setScenario(s);
    const startScene = s.scenes[s.startSceneId];
    setCurrentScene(startScene);
    setMessages([]);
    revealIndex.current = 0;
    setIsTyping(false);
    setPhase("playing");
  }, []);

  // Reveal messages one by one
  useEffect(() => {
    if (!currentScene || phase !== "playing") return;
    const sceneMsgs = currentScene.messages;

    function revealNext() {
      const idx = revealIndex.current;
      if (idx >= sceneMsgs.length) {
        setIsTyping(false);
        return;
      }
      const msg = sceneMsgs[idx];
      setIsTyping(msg.from === "stranger");
      timerRef.current = setTimeout(() => {
        setMessages((prev) => {
          const already = prev.find((m) => m.id === msg.id);
          if (already) return prev;
          return [...prev, { ...msg, shown: true }];
        });
        setIsTyping(false);
        revealIndex.current = idx + 1;
        timerRef.current = setTimeout(revealNext, 400);
      }, (msg.delay ?? 800));
    }
    revealNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene]);

  const handleChoice = useCallback(
    (nextSceneId: string, isGood: boolean) => {
      if (!scenario || !currentScene) return;

      const choiceText = currentScene.choices?.find((c) => c.nextSceneId === nextSceneId)?.text ?? "";
      setMessages((prev) => [...prev, { id: Date.now(), from: "player", text: choiceText, shown: true }]);

      const nextScene = scenario.scenes[nextSceneId];
      if (!nextScene) return;

      // If ending
      if (nextScene.isEnding) {
        const pts = nextScene.points ?? (isGood ? 100 : 0);
        setTotalScore((s) => s + pts);
        setEndingHistory((h) => [
          ...h,
          { title: nextScene.endingTitle ?? "Kết thúc", points: pts, type: nextScene.endingType ?? "neutral" },
        ]);

        // Show ending messages then transition
        setTimeout(() => {
          setCurrentScene(nextScene);
          revealIndex.current = 0;
          setTimeout(() => setPhase("result"), 3000);
        }, 1000);
        return;
      }

      setTimeout(() => {
        setCurrentScene(nextScene);
        revealIndex.current = 0;
      }, 600);
    },
    [scenario, currentScene],
  );

  const handleReset = useCallback(() => {
    setPhase("select");
    setScenario(null);
    setCurrentScene(null);
    setMessages([]);
    setTotalScore(0);
    setEndingHistory([]);
  }, []);

  const showChoices = !isTyping && currentScene && !currentScene.isEnding && messages.length > 0 &&
    messages[messages.length - 1]?.id === currentScene.messages[currentScene.messages.length - 1]?.id;

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow="🕵️ Mini Game · Chat simulator"
        title="Thám Tử Mạng"
        description="Nhập vai trong các cuộc trò chuyện nguy hiểm. Đọc kỹ từng tin nhắn và chọn cách phản hồi đúng đắn để vượt qua mọi tình huống!"
        stats={[
          { label: "Kịch bản", value: `${CHAT_SCENARIOS.length} tình huống` },
          { label: "Dạng chơi", value: "Chat simulator" },
          { label: "Kỹ năng", value: "Phán đoán" },
        ]}
        rules={[
          { text: "Chọn một kịch bản để bắt đầu" },
          { text: "Đọc từng tin nhắn xuất hiện theo thứ tự" },
          { text: "Chọn cách phản hồi phù hợp nhất" },
          { text: "Mỗi lựa chọn dẫn đến kết cục khác nhau" },
        ]}
        startLabel="Chọn kịch bản!"
        onStart={() => setPhase("select")}
        bgGradient="linear-gradient(135deg,#0a0d14 0%,#0f172a 50%,#0a0d14 100%)"
        accentColor="#0ea5e9"
        buttonIcon={<MessageCircle className="h-5 w-5" />}
      />
    );
  }

  // ── SELECT ─────────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="min-h-screen pb-16 pt-8">
        <div className="container mx-auto max-w-2xl px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-6 font-heading text-3xl font-bold">Chọn kịch bản 🕵️</h1>
            <div className="grid gap-4">
              {CHAT_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  id={`chat-scenario-${s.id}`}
                  onClick={() => startScenario(s)}
                  className="group flex items-start gap-4 rounded-[1.8rem] border border-white/70 bg-white/80 p-6 text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                    {s.strangerAvatar}
                  </span>
                  <div>
                    <p className="font-bold text-lg">{s.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                    <span className="mt-2 inline-block text-xs font-semibold text-primary">Chơi ngay →</span>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="outline" className="mt-6" onClick={() => setPhase("intro")}>← Quay lại</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────
  if (phase === "result") {
    const lastEnding = endingHistory[endingHistory.length - 1];
    const isGood = lastEnding?.type === "good";
    const isSecret = lastEnding?.type === "secret";

    return (
      <div className="min-h-screen pb-16 pt-8">
        <div className="container mx-auto max-w-2xl px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <section className={`rounded-[2.4rem] border p-8 shadow-card text-center md:p-12 ${isSecret ? "border-purple-200/70 bg-purple-50/80" : isGood ? "border-green-200/70 bg-green-50/80" : "border-red-200/70 bg-red-50/80"}`}>
              <div className="text-5xl">{isSecret ? "🔮" : isGood ? "✅" : "⚠️"}</div>
              <h1 className="mt-4 font-heading text-3xl font-bold">{lastEnding?.title}</h1>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 font-bold">
                <Star className="h-4 w-4 text-yellow-500" /> {lastEnding?.points ?? 0} điểm
              </div>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                {currentScene?.endingText}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button id="chat-detective-replay-btn" className="gradient-primary text-primary-foreground" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Chọn kịch bản khác
                </Button>
                <Button variant="outline" asChild><Link to="/games"><ArrowRight className="mr-2 h-4 w-4" /> Game khác</Link></Button>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────────
  const stranger = scenario ? { name: scenario.strangerName, avatar: scenario.strangerAvatar } : null;
  const playerSpeaker = { name: "Bạn", avatar: "🙋", color: "#06d6a0" };

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Chat header */}
        <div className="mb-4 flex items-center gap-3 rounded-[1.6rem] border border-white/65 bg-card/84 px-4 py-3 shadow-soft">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">{stranger?.avatar}</span>
          <div>
            <p className="font-bold text-sm">{stranger?.name}</p>
            <p className="text-xs text-muted-foreground">{isTyping ? "Đang nhập..." : "Trực tuyến"}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{totalScore}</span>
          </div>
        </div>

        {/* Chat messages */}
        <div className="min-h-[400px] max-h-[480px] overflow-y-auto rounded-[1.6rem] border border-white/65 bg-card/50 p-4 shadow-soft">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-3 flex ${msg.from === "player" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "stranger" && (
                  <span className="mr-2 mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm">{stranger?.avatar}</span>
                )}
                <div
                  className={`max-w-[75%] rounded-[1.2rem] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.from === "player"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-white text-foreground shadow-soft"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.from === "player" && (
                  <span className="ml-2 mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm">{playerSpeaker.avatar}</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex justify-start">
              <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm">{stranger?.avatar}</span>
              <div className="rounded-[1.2rem] rounded-bl-sm bg-white shadow-soft">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Choices */}
        <AnimatePresence>
          {showChoices && currentScene?.choices && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-2"
            >
              <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest">Bạn trả lời:</p>
              {currentScene.choices.map((choice) => (
                <button
                  key={choice.id}
                  id={`chat-choice-${choice.id}`}
                  onClick={() => handleChoice(choice.nextSceneId, choice.isGood)}
                  className="w-full rounded-[1.4rem] border border-white/65 bg-white/80 px-5 py-4 text-left text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-card"
                >
                  {choice.text}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
