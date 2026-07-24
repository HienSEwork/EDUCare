import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowRight, RefreshCw, ChevronRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEEN_PATH_STORY, SPEAKERS, type StoryNode } from "@/data/teenPathStory";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-teen-path.svg";

type GamePhase = "intro" | "playing" | "result";

const ENDING_EMOJIS: Record<string, string> = {
  good: "🏆",
  bad: "😔",
  secret: "🔮",
};

const ENDING_COLORS: Record<string, string> = {
  good: "#06d6a0",
  bad: "#ef4444",
  secret: "#9b5de5",
};

function TypewriterText({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed((d) => d + text[indexRef.current]);
        indexRef.current++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        onDone();
      }
    }, 25);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span>{displayed}</span>;
}

const SCENE_BACKGROUNDS: Record<string, string> = {
  n1: "linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)",
  n2: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
  n3_yes: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
  n3_question: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
  n3_parent: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
  n4_yes: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
  n5_drink: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
  n5_refuse: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
  n6_decline: "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)",
  n6_parent_approve: "linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)",
  n7_photo: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)",
  n8_help: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
  n9_firm: "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)",
  end_good_1: "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)",
  end_good_2: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
  end_bad_1: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)",
  end_bad_2: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
  end_neutral: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  end_secret: "linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)",
};

const SPEAKER_EMOJI_MAP: Record<string, string> = {
  narrator: "📖",
  minh: "👦",
  linh: "👧",
  me: "🙋",
  teacher: "👩‍🏫",
  parent: "👩",
};

export default function TeenPathPage() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [currentNodeId, setCurrentNodeId] = useState(TEEN_PATH_STORY.startNodeId);
  const [history, setHistory] = useState<string[]>([]);
  const [textDone, setTextDone] = useState(false);
  const [unlockedEndings, setUnlockedEndings] = useState<Set<string>>(new Set());
  const textDoneRef = useRef(false);

  const currentNode: StoryNode | undefined = TEEN_PATH_STORY.nodes[currentNodeId];

  const startGame = useCallback(() => {
    setCurrentNodeId(TEEN_PATH_STORY.startNodeId);
    setHistory([]);
    setTextDone(false);
    textDoneRef.current = false;
    setPhase("playing");
  }, []);

  const goToNode = useCallback((nodeId: string) => {
    setHistory((h) => [...h, currentNodeId]);
    setCurrentNodeId(nodeId);
    setTextDone(false);
    textDoneRef.current = false;
  }, [currentNodeId]);

  const handleChoice = useCallback(
    (nextNodeId: string) => {
      const nextNode = TEEN_PATH_STORY.nodes[nextNodeId];
      if (!nextNode) return;

      if (nextNode.isEnding) {
        setHistory((h) => [...h, currentNodeId]);
        setCurrentNodeId(nextNodeId);
        setTextDone(false);
        textDoneRef.current = false;
        setUnlockedEndings((prev) => new Set([...prev, nextNodeId]));
        // transition to result after typewriter
      } else {
        goToNode(nextNodeId);
      }
    },
    [currentNodeId, goToNode],
  );

  const handleTextDone = useCallback(() => {
    setTextDone(true);
    textDoneRef.current = true;
    if (currentNode?.isEnding) {
      setTimeout(() => setPhase("result"), 2000);
    } else if (!currentNode?.choices && currentNode?.nextNodeId) {
      // auto-advance narration nodes after 1.5s
      setTimeout(() => goToNode(currentNode.nextNodeId!), 1500);
    }
  }, [currentNode, goToNode]);

  const handleBack = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setCurrentNodeId(prev);
    setHistory((h) => h.slice(0, -1));
    setTextDone(false);
    textDoneRef.current = false;
  }, [history]);

  const speaker = currentNode ? SPEAKERS[currentNode.speaker] : null;
  const bgStyle = SCENE_BACKGROUNDS[currentNodeId] ?? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow="📖 Visual Novel · Phân nhánh"
        title="Ngã Rẽ Tuổi Teen"
        description="Câu chuyện tương tác với nhiều kết cục. Mỗi quyết định của bạn dẫn đến một hành trình khác — bạn mở khóa được bao nhiêu ending?"
        stats={[
          { label: "Loại game", value: "Visual Novel" },
          { label: "Kết cục", value: "Nhiều ending" },
          { label: "Kỹ năng", value: "Ra quyết định" },
        ]}
        rules={[
          { text: "Đọc câu chuyện hiện ra theo kiểu typewriter" },
          { text: "Chọn lựa chọn phù hợp tại mỗi ngã rẽ" },
          { text: "Mỗi lựa chọn dẫn đến hướng câu chuyện khác" },
          { text: "Thử lại nhiều lần để mở khóa mọi kết cục!" },
        ]}
        startLabel="Bắt đầu hành trình!"
        onStart={startGame}
        bgGradient="linear-gradient(160deg, #18072b 0%, #300c4f 45%, #1f1254 100%)"
        accentColor="#a855f7"
        buttonIcon={<BookOpen className="h-5 w-5" />}
      />
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────
  if (phase === "result" && currentNode?.isEnding) {
    const endingType = currentNode.endingType ?? "neutral";
    const color = ENDING_COLORS[endingType] ?? "#9b5de5";

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
            <section
              className="rounded-[2.4rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl text-center md:p-12"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-6xl"
              >
                {currentNode.endingEmoji}
              </motion.div>
              <h1 className="mt-4 font-heading text-3xl font-extrabold" style={{ color }}>
                {currentNode.endingTitle}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-indigo-100/90 max-w-md mx-auto">
                {currentNode.endingText}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-950/80 border border-indigo-400/30 px-4 py-2 text-sm font-extrabold text-white">
                <Star className="h-4 w-4 text-amber-400 fill-current" />
                {unlockedEndings.size}/{TEEN_PATH_STORY.endings.length} kết cục đã mở
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button id="teen-path-replay-btn" className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-black hover:brightness-110 shadow-lg shadow-cyan-500/20" onClick={startGame}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Chơi lại
                </Button>
                <Button variant="outline" className="rounded-2xl border-indigo-400/30 bg-indigo-950/50 text-white hover:bg-indigo-900/80" onClick={() => setPhase("intro")}>
                  Xem kết cục khác
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
  if (!currentNode) return null;

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
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          {history.length > 0 ? (
            <button onClick={handleBack} className="text-xs font-bold text-cyan-300 hover:underline transition-colors">
              ← Quay lại
            </button>
          ) : <div />}
          <span className="text-xs font-extrabold text-indigo-200">
            <Star className="inline h-3 w-3 text-amber-400 fill-current mr-1" />
            {unlockedEndings.size}/{TEEN_PATH_STORY.endings.length} ending
          </span>
        </div>

        {/* Scene panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* Visual panel */}
            <div
              className="relative flex min-h-[200px] items-center justify-center rounded-[2rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl mb-4"
            >
              <div className="flex flex-col items-center gap-3 p-8">
                <motion.span
                  key={currentNodeId + "_avatar"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-indigo-400/40 bg-slate-950/80 text-5xl shadow-xl"
                >
                  {SPEAKER_EMOJI_MAP[currentNode.speaker] ?? "💬"}
                </motion.span>
                <p className="text-sm font-extrabold text-cyan-300">
                  {speaker?.name ?? "Người kể chuyện"}
                </p>
              </div>
            </div>

            {/* Dialogue box */}
            <div className="rounded-[1.8rem] border border-indigo-500/30 bg-slate-900/70 backdrop-blur-xl p-6 shadow-2xl min-h-[120px]">
              <p className="font-heading text-base leading-relaxed text-white md:text-lg">
                <TypewriterText key={currentNodeId} text={currentNode.text} onDone={handleTextDone} />
              </p>
            </div>

            {/* Choices */}
            <AnimatePresence>
              {textDone && currentNode.choices && !currentNode.isEnding && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 space-y-3"
                >
                  <p className="text-center text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Bạn sẽ làm gì?
                  </p>
                  {currentNode.choices.map((choice) => (
                    <button
                      key={choice.id}
                      id={`teen-path-choice-${choice.id}`}
                      onClick={() => handleChoice(choice.nextNodeId)}
                      className="group w-full rounded-[1.4rem] border border-indigo-400/30 bg-slate-900/80 px-5 py-4 text-left text-sm font-extrabold text-white shadow-xl transition-all hover:border-cyan-400 hover:bg-cyan-500 hover:text-slate-950"
                    >
                      <div className="flex items-center gap-3">
                        {choice.icon && <span className="text-lg">{choice.icon}</span>}
                        <span>{choice.text}</span>
                        <ChevronRight className="ml-auto h-4 w-4 opacity-60 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip typewriter */}
            {!textDone && (
              <button
                className="mt-3 w-full text-center text-xs text-slate-400 hover:text-white transition-colors font-bold"
                onClick={() => {
                  setTextDone(true);
                  textDoneRef.current = true;
                }}
              >
                Bấm để bỏ qua animation ▼
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
