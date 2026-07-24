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
        bgGradient="linear-gradient(160deg, #07101f 0%, #0c1c38 45%, #121054 100%)"
        accentColor="#3b82f6"
        buttonIcon={<MessageCircle className="h-5 w-5" />}
      />
    );
  }

  // ── SELECT ─────────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="game-page min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
        style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
      >
        {/* Background Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
          <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
          <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
        </div>

        <div className="container mx-auto max-w-2xl px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-6 font-heading text-3xl font-extrabold text-white">Chọn kịch bản 🕵️</h1>
            <div className="grid gap-4">
              {CHAT_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  id={`chat-scenario-${s.id}`}
                  onClick={() => startScenario(s)}
                  className="group flex items-start gap-4 rounded-[1.8rem] border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-6 text-left shadow-xl transition-all hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-950/80 border border-indigo-400/30 text-2xl">
                    {s.strangerAvatar}
                  </span>
                  <div>
                    <p className="font-extrabold text-lg text-white">{s.title}</p>
                    <p className="mt-1 text-sm text-indigo-100/80 leading-relaxed">{s.description}</p>
                    <span className="mt-2 inline-block text-xs font-black uppercase tracking-wider text-cyan-300">Chơi ngay →</span>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="outline" className="mt-6 rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" onClick={() => setPhase("intro")}>← Quay lại</Button>
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
      <div className="game-page min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
        style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
      >
        {/* Background Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
          <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
          <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
        </div>

        <div className="container mx-auto max-w-2xl px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <section className={`rounded-[2.4rem] border p-8 shadow-2xl backdrop-blur-xl text-center md:p-12 ${isSecret ? "border-purple-500/40 bg-purple-950/60" : isGood ? "border-emerald-500/40 bg-emerald-950/60" : "border-rose-500/40 bg-rose-950/60"}`}>
              <div className="text-5xl">{isSecret ? "🔮" : isGood ? "✅" : "⚠️"}</div>
              <h1 className="mt-4 font-heading text-3xl font-extrabold text-white">{lastEnding?.title}</h1>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-950/80 border border-indigo-400/30 px-4 py-2 font-black text-amber-300">
                <Star className="h-4 w-4 text-amber-400 fill-current" /> {lastEnding?.points ?? 0} điểm
              </div>
              <p className="mt-4 text-indigo-100/90 text-sm leading-relaxed">
                {currentScene?.endingText}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button id="chat-detective-replay-btn" className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-black hover:brightness-110 shadow-lg shadow-cyan-500/20" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Chọn kịch bản khác
                </Button>
                <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" asChild><Link to="/games"><ArrowRight className="mr-2 h-4 w-4" /> Game khác</Link></Button>
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
    <div className="game-page min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto max-w-2xl px-4">
        {/* Chat header */}
        <div className="mb-4 flex items-center gap-3 rounded-[1.6rem] border border-indigo-400/30 bg-slate-900/70 backdrop-blur-xl px-4 py-3 shadow-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-950/80 border border-indigo-400/30 text-xl">{stranger?.avatar}</span>
          <div>
            <p className="font-extrabold text-sm text-white">{stranger?.name}</p>
            <p className="text-xs font-bold text-cyan-300">{isTyping ? "Đang nhập..." : "Trực tuyến"}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-amber-300">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-extrabold text-white">{totalScore}</span>
          </div>
        </div>

        {/* Chat messages */}
        <div className="min-h-[400px] max-h-[480px] overflow-y-auto rounded-[1.6rem] border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-4 shadow-2xl">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-3 flex ${msg.from === "player" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "stranger" && (
                  <span className="mr-2 mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-950 border border-indigo-400/30 text-sm">{stranger?.avatar}</span>
                )}
                <div
                  className={`max-w-[75%] rounded-[1.2rem] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.from === "player"
                      ? "rounded-br-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold shadow-lg"
                      : "rounded-bl-sm bg-slate-800/90 border border-indigo-400/30 text-white shadow-md"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.from === "player" && (
                  <span className="ml-2 mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-950 border border-cyan-400/30 text-sm">{playerSpeaker.avatar}</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex justify-start">
              <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-950 border border-indigo-400/30 text-sm">{stranger?.avatar}</span>
              <div className="rounded-[1.2rem] rounded-bl-sm bg-slate-800/90 border border-indigo-400/30 shadow-md">
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
              <p className="text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest">Bạn trả lời:</p>
              {currentScene.choices.map((choice) => (
                <button
                  key={choice.id}
                  id={`chat-choice-${choice.id}`}
                  onClick={() => handleChoice(choice.nextSceneId, choice.isGood)}
                  className="w-full rounded-[1.4rem] border border-indigo-400/30 bg-slate-900/80 px-5 py-4 text-left text-sm font-extrabold text-white shadow-lg transition-all hover:border-cyan-400 hover:bg-cyan-500 hover:text-slate-950"
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
