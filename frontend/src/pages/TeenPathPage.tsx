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
        bgGradient="linear-gradient(135deg,#1a0533 0%,#4a1060 50%,#c75000 100%)"
        accentColor="#9b5de5"
        buttonIcon={<BookOpen className="h-5 w-5" />}
      />
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────
  if (phase === "result" && currentNode?.isEnding) {
    const endingType = currentNode.endingType ?? "neutral";
    const color = ENDING_COLORS[endingType] ?? "#9b5de5";

    return (
      <div className="min-h-screen pb-16 pt-8">
        <div className="container mx-auto max-w-2xl px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <section
              className="rounded-[2.4rem] border p-8 shadow-card text-center md:p-12"
              style={{ background: bgStyle, borderColor: color + "44" }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-6xl"
              >
                {currentNode.endingEmoji}
              </motion.div>
              <h1 className="mt-4 font-heading text-3xl font-bold" style={{ color }}>
                {currentNode.endingTitle}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80 max-w-md mx-auto">
                {currentNode.endingText}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold">
                <Star className="h-4 w-4 text-yellow-500" />
                {unlockedEndings.size}/{TEEN_PATH_STORY.endings.length} kết cục đã mở
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button id="teen-path-replay-btn" className="gradient-primary text-primary-foreground" onClick={startGame}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Chơi lại
                </Button>
                <Button variant="outline" onClick={() => setPhase("intro")}>
                  Xem kết cục khác
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
  if (!currentNode) return null;

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          {history.length > 0 ? (
            <button onClick={handleBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Quay lại
            </button>
          ) : <div />}
          <span className="text-xs text-muted-foreground">
            <Star className="inline h-3 w-3 text-yellow-500 mr-1" />
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
              className="relative flex min-h-[200px] items-center justify-center rounded-[2rem] border border-white/70 overflow-hidden shadow-card mb-4"
              style={{ background: bgStyle }}
            >
              <div className="flex flex-col items-center gap-3 p-8">
                <motion.span
                  key={currentNodeId + "_avatar"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/80 bg-white/60 text-5xl shadow-card"
                >
                  {SPEAKER_EMOJI_MAP[currentNode.speaker] ?? "💬"}
                </motion.span>
                <p className="text-sm font-bold" style={{ color: "#4b5563" }}>
                  {speaker?.name ?? "Người kể chuyện"}
                </p>
              </div>
            </div>

            {/* Dialogue box */}
            <div className="rounded-[1.8rem] border border-white/70 bg-white/90 p-6 shadow-card min-h-[120px]">
              <p className="font-heading text-base leading-7 md:text-lg">
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
                  <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Bạn sẽ làm gì?
                  </p>
                  {currentNode.choices.map((choice) => (
                    <button
                      key={choice.id}
                      id={`teen-path-choice-${choice.id}`}
                      onClick={() => handleChoice(choice.nextNodeId)}
                      className="group w-full rounded-[1.4rem] border border-white/65 bg-white/80 px-5 py-4 text-left text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-card"
                    >
                      <div className="flex items-center gap-3">
                        {choice.icon && <span className="text-lg">{choice.icon}</span>}
                        <span>{choice.text}</span>
                        <ChevronRight className="ml-auto h-4 w-4 opacity-40 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip typewriter */}
            {!textDone && (
              <button
                className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
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
