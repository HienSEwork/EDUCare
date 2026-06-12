import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ExternalLink, PlayCircle, Lock, Trophy } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Lesson, MicroLesson, MicroLessonBlock, User } from "@/types/api";
import { Button } from "@/components/ui/button";

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function sortBlocks(blocks: MicroLessonBlock[]) {
  return blocks.slice().sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}

function sortMicroLessons(microLessons: MicroLesson[]) {
  return microLessons.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "").trim();
  const full = cleaned.length === 3 ? cleaned.split("").map((c) => c + c).join("") : cleaned;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(hex: string, target: string, amount: number) {
  const a = Math.max(0, Math.min(1, amount));
  const c1 = hexToRgb(hex);
  const c2 = hexToRgb(target);
  const r = Math.round(c1.r * (1 - a) + c2.r * a);
  const g = Math.round(c1.g * (1 - a) + c2.g * a);
  const b = Math.round(c1.b * (1 - a) + c2.b * a);
  return rgbToHex(r, g, b);
}

function blockLabel(blockType: MicroLessonBlock["blockType"]) {
  switch (blockType) {
    case "hook":
      return "Hook";
    case "explanation":
      return "Hiểu nhanh";
    case "scenario":
      return "Tình huống thực tế";
    case "interaction":
      return "Thử thách trắc nghiệm";
    case "sorting":
      return "Phân loại hành vi";
    case "flashcard":
      return "Thẻ nhớ lật 3D";
    case "scenario-choice":
      return "Chọn cuộc phiêu lưu";
    case "matching":
      return "Ghép cặp từ khóa";
    case "fill-blank":
      return "Xếp chữ điền từ";
    case "reflection":
      return "Suy ngẫm";
    case "takeaway":
      return "Điều cần nhớ";
    default:
      return blockType;
  }
}

function isAssessmentMicro(ml: any) {
  if (!ml) return false;
  if (ml.order === 99) return true;
  const titleLower = (ml.title ?? "").toLowerCase();
  if (titleLower.includes("kiểm tra") || titleLower.includes("assessment") || titleLower.includes("test")) return true;
  return (ml.blocks ?? []).some((b: any) => ["scenario-choice", "matching", "fill-blank"].includes(b.blockType));
}

function SortingBlock({
  data,
  onComplete,
  isCompleted,
  onIncorrect,
}: {
  data: any;
  onComplete: () => void;
  isCompleted?: boolean;
  onIncorrect?: () => void;
}) {
  const [items] = useState<any[]>(() => data?.items ?? []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [greenList, setGreenList] = useState<string[]>([]);
  const [redList, setRedList] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);
  const [isDone, setIsDone] = useState(isCompleted ?? false);

  const greenBoxRef = useRef<HTMLButtonElement>(null);
  const redBoxRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isOverGreen, setIsOverGreen] = useState(false);
  const [isOverRed, setIsOverRed] = useState(false);

  const leftBoxTitle = data?.leftBox?.title ?? "Lành mạnh (Green Flag)";
  const rightBoxTitle = data?.rightBox?.title ?? "Độc hại (Red Flag)";
  const instruction = data?.instruction ?? "Kéo thẻ hoặc click phân loại hành vi sau:";

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (isCompleted) {
      setIsDone(true);
      const lefts = items.filter((i) => i.correctBox === "left").map((i) => i.text);
      const rights = items.filter((i) => i.correctBox === "right").map((i) => i.text);
      setGreenList(lefts);
      setRedList(rights);
    }
  }, [isCompleted, items]);

  const handleClassify = (target: "left" | "right") => {
    if (isDone || !currentItem) return;

    if (currentItem.correctBox === target) {
      if (target === "left") {
        setGreenList((prev) => [...prev, currentItem.text]);
      } else {
        setRedList((prev) => [...prev, currentItem.text]);
      }
      toast.success("Chính xác!", { duration: 1000 });
      if (currentIndex + 1 >= items.length) {
        setIsDone(true);
        onComplete();
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      setIsWrong(true);
      if (onIncorrect) {
        onIncorrect();
      } else {
        toast.error("Chưa chính xác rồi. Hãy thử lại!", { duration: 1500 });
      }
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <p className="text-[14px] font-semibold text-foreground/80">{instruction}</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Box (Green Flag) */}
        <button
          ref={greenBoxRef}
          onClick={() => handleClassify("left")}
          disabled={isDone}
          className={`flex flex-col items-center justify-start rounded-[1.6rem] border-2 border-dashed p-4 text-center transition-all min-h-[120px] w-full ${isDone
            ? "cursor-default opacity-90 border-mint/60 bg-mint/8 text-mint-foreground"
            : isOverGreen
              ? "border-mint bg-mint/22 shadow-lg scale-[1.02] ring-4 ring-mint/20 text-mint-foreground"
              : "border-mint/60 bg-mint/8 hover:bg-mint/16 text-mint-foreground"
            }`}
        >
          <span className="text-2xl mb-2">💚</span>
          <span className="text-xs font-bold">{leftBoxTitle}</span>
          <div className="mt-3 space-y-1.5 w-full">
            {greenList.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-mint/14 px-2 py-1 text-[11px] font-semibold truncate text-center"
              >
                {item}
              </div>
            ))}
          </div>
        </button>

        {/* Right Box (Red Flag) */}
        <button
          ref={redBoxRef}
          onClick={() => handleClassify("right")}
          disabled={isDone}
          className={`flex flex-col items-center justify-start rounded-[1.6rem] border-2 border-dashed p-4 text-center transition-all min-h-[120px] w-full ${isDone
            ? "cursor-default opacity-90 border-peach/60 bg-peach/8 text-peach-foreground"
            : isOverRed
              ? "border-peach bg-peach/22 shadow-lg scale-[1.02] ring-4 ring-peach/20 text-peach-foreground"
              : "border-peach/60 bg-peach/8 hover:bg-peach/16 text-peach-foreground"
            }`}
        >
          <span className="text-2xl mb-2">❤️</span>
          <span className="text-xs font-bold">{rightBoxTitle}</span>
          <div className="mt-3 space-y-1.5 w-full">
            {redList.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-peach/14 px-2 py-1 text-[11px] font-semibold truncate text-center"
              >
                {item}
              </div>
            ))}
          </div>
        </button>
      </div>

      {!isDone && currentItem ? (
        <div className="relative pt-2 flex flex-col items-center">
          <motion.div
            ref={cardRef}
            animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            drag={true}
            dragSnapToOrigin={true}
            onDrag={(_, info) => {
              const dragX = info.point.x - window.scrollX;
              const dragY = info.point.y - window.scrollY;

              let overG = false;
              let overR = false;

              if (greenBoxRef.current) {
                const rect = greenBoxRef.current.getBoundingClientRect();
                const pointerInside =
                  dragX >= rect.left &&
                  dragX <= rect.right &&
                  dragY >= rect.top &&
                  dragY <= rect.bottom;
                if (pointerInside) {
                  overG = true;
                }
              }

              if (redBoxRef.current) {
                const rect = redBoxRef.current.getBoundingClientRect();
                const pointerInside =
                  dragX >= rect.left &&
                  dragX <= rect.right &&
                  dragY >= rect.top &&
                  dragY <= rect.bottom;
                if (pointerInside) {
                  overR = true;
                }
              }

              setIsOverGreen(overG);
              setIsOverRed(overR);
            }}
            onDragEnd={(_, info) => {
              setIsOverGreen(false);
              setIsOverRed(false);

              const dragX = info.point.x - window.scrollX;
              const dragY = info.point.y - window.scrollY;

              if (greenBoxRef.current) {
                const rect = greenBoxRef.current.getBoundingClientRect();
                const pointerInside =
                  dragX >= rect.left &&
                  dragX <= rect.right &&
                  dragY >= rect.top &&
                  dragY <= rect.bottom;

                if (pointerInside) {
                  handleClassify("left");
                  return;
                }
              }

              if (redBoxRef.current) {
                const rect = redBoxRef.current.getBoundingClientRect();
                const pointerInside =
                  dragX >= rect.left &&
                  dragX <= rect.right &&
                  dragY >= rect.top &&
                  dragY <= rect.bottom;

                if (pointerInside) {
                  handleClassify("right");
                  return;
                }
              }
            }}
            className="w-full max-w-sm cursor-grab active:cursor-grabbing rounded-[1.6rem] border border-border/80 bg-background/90 p-6 text-center shadow-soft hover:shadow-card transition-shadow duration-200"
          >
            <p className="text-[15px] font-bold text-foreground leading-snug mb-4">{currentItem.text}</p>
            <p className="text-[10px] text-foreground/50 font-semibold mb-3">
              Kéo thẻ thả trực tiếp vào hai hộp phía trên để phân loại
            </p>
            <div className="flex justify-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full bg-mint/10 text-mint-foreground hover:bg-mint/20 text-xs font-bold px-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClassify("left");
                }}
              >
                Lành mạnh
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full bg-peach/10 text-peach-foreground hover:bg-peach/20 text-xs font-bold px-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClassify("right");
                }}
              >
                Độc hại
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="rounded-[1.6rem] bg-mint/10 p-5 text-center border border-mint/20 shadow-soft w-full">
          <p className="text-[14px] font-bold text-mint-foreground">🎉 Bạn đã phân loại xuất sắc tất cả hành vi!</p>
        </div>
      )}
    </div>
  );
}

function FlashcardBlock({
  data,
  onComplete,
  isCompleted,
}: {
  data: any;
  onComplete: () => void;
  isCompleted?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(isCompleted ?? false);
  const [rating, setRating] = useState<string | null>(null);

  const front = data?.front ?? "Mặt trước";
  const back = data?.back ?? "Mặt sau";
  const notes = data?.notes ?? "";

  useEffect(() => {
    if (isCompleted) {
      setRated(true);
    } else {
      setRated(false);
    }
  }, [isCompleted]);

  const handleRate = (level: "easy" | "medium" | "hard") => {
    setRating(level);
    setRated(true);
    toast.success(`Ghi nhận mức độ gợi nhớ: ${level === "easy" ? "Dễ" : level === "medium" ? "Trung bình" : "Khó"}`);
    onComplete();
  };

  return (
    <div className="mt-4 flex flex-col items-center w-full">
      <div
        onClick={() => setFlipped(!flipped)}
        className="perspective-1000 w-full max-w-sm h-52 cursor-pointer relative"
      >
        <div
          className={`w-full h-full duration-500 preserve-3d relative transition-transform ${flipped ? "rotate-y-180" : ""
            }`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center rounded-[1.8rem] border border-border bg-card p-6 text-center shadow-card">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.16em] mb-3">Câu hỏi / Thuật ngữ</span>
            <p className="text-base font-bold text-foreground leading-relaxed px-2">{front}</p>
            <span className="absolute bottom-4 text-[10px] text-foreground/40 font-semibold animate-pulse">Bấm để lật thẻ ↺</span>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center rounded-[1.8rem] border border-primary/20 bg-background p-6 text-center shadow-card">
            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-[0.16em] mb-2">Giải nghĩa / Đáp án</span>
            <div className="overflow-y-auto max-h-24 px-2 mb-2 w-full">
              <p className="text-sm font-semibold text-foreground leading-relaxed">{back}</p>
              {notes ? <p className="mt-2 text-xs text-foreground/60 italic">{notes}</p> : null}
            </div>
            <span className="absolute bottom-4 text-[10px] text-foreground/40 font-semibold">Bấm để lật lại ↺</span>
          </div>
        </div>
      </div>

      {flipped && !rated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 w-full max-w-sm text-center"
        >
          <p className="text-xs font-bold text-foreground/60 mb-2.5">Bạn tự đánh giá mức độ ghi nhớ:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-peach/40 text-peach-foreground hover:bg-peach/14 text-xs font-bold py-5"
              onClick={(e) => {
                e.stopPropagation();
                handleRate("hard");
              }}
            >
              😰 Khó
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-yellow-300 text-yellow-800 hover:bg-yellow-50 text-xs font-bold py-5"
              onClick={(e) => {
                e.stopPropagation();
                handleRate("medium");
              }}
            >
              😐 T.Bình
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-mint/40 text-mint-foreground hover:bg-mint/14 text-xs font-bold py-5"
              onClick={(e) => {
                e.stopPropagation();
                handleRate("easy");
              }}
            >
              😊 Dễ
            </Button>
          </div>
        </motion.div>
      )}

      {rated && (
        <div className="mt-4 rounded-xl bg-mint/10 border border-mint/20 px-4 py-2.5 text-center w-full max-w-sm">
          <p className="text-xs font-bold text-mint-foreground">
            ✓ Đã ghi nhận gợi nhớ: <span className="uppercase">{rating === "easy" ? "Dễ" : rating === "medium" ? "Trung bình" : "Khó"}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function InteractionBlock({
  data,
  onComplete,
  isCompleted,
  onIncorrect,
}: {
  data: any;
  onComplete: () => void;
  isCompleted?: boolean;
  onIncorrect?: () => void;
}) {
  const question = data?.question ?? "";
  const choices = data?.choices ?? [];

  const [isDone, setIsDone] = useState(isCompleted ?? false);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }
  }, [isCompleted]);

  const handleSelect = (isCorrect: boolean) => {
    if (isDone) return;

    if (isCorrect) {
      toast.success("Chính xác!");
      setIsDone(true);
      onComplete();
    } else {
      setWrongAttempt(true);
      if (onIncorrect) {
        onIncorrect();
      } else {
        toast.error("Thử lại nhé.");
      }
      setTimeout(() => setWrongAttempt(false), 500);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <p className="text-[15px] font-semibold text-foreground">{question}</p>

      <motion.div
        animate={wrongAttempt ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="grid gap-3 md:grid-cols-2"
      >
        {choices.map((c: any, idx: number) => {
          const isCorrect = !!c?.correct;
          const tone = isDone
            ? isCorrect
              ? "bg-mint/18 border-mint/40 text-mint-foreground"
              : "bg-background/40 border-border/40 opacity-40"
            : "bg-background/88 border-border/80 hover:border-primary/45 hover:bg-background";

          return (
            <button
              key={idx}
              disabled={isDone}
              className={`w-full rounded-[1.4rem] border px-4 py-4 text-left text-[14px] font-semibold transition-colors shadow-sm ${tone}`}
              onClick={() => handleSelect(isCorrect)}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 flex-1">{c?.text ?? ""}</span>
                <span className="text-lg">{c?.emoji ?? (isCorrect ? "🙂" : "☹️")}</span>
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

function ScenarioChoiceBlock({
  data,
  onComplete,
  isCompleted,
  onIncorrect,
}: {
  data: any;
  onComplete: () => void;
  isCompleted?: boolean;
  onIncorrect?: () => void;
}) {
  const nodes = data?.nodes ?? {};
  const startNode = data?.startNode ?? "start";

  const successNodeKey = useMemo(() => {
    return Object.keys(nodes).find((key) => nodes[key].isEnd && nodes[key].isSuccess) || startNode;
  }, [nodes, startNode]);

  const [localNodeKey, setLocalNodeKey] = useState(startNode);
  const [localDone, setLocalDone] = useState(false);

  const currentNodeKey = isCompleted ? successNodeKey : localNodeKey;
  const isDone = isCompleted || localDone;

  const currentNode = nodes[currentNodeKey];

  const handleChoice = (nextNodeKey: string) => {
    if (isDone) return;

    const nextNode = nodes[nextNodeKey];
    if (!nextNode) return;

    if (nextNode.isEnd) {
      if (nextNode.isSuccess) {
        setLocalNodeKey(nextNodeKey);
        setLocalDone(true);
        toast.success("Tuyệt vời! Bạn đã hoàn thành cuộc phiêu lưu.");
        onComplete();
      } else {
        setLocalNodeKey(nextNodeKey);
        if (onIncorrect) {
          onIncorrect();
        } else {
          toast.error("Lựa chọn chưa chính xác.");
        }
      }
    } else {
      setLocalNodeKey(nextNodeKey);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <span className="text-[13px] font-bold text-foreground/50">
        🎭 Quyết định của bạn sẽ dẫn tới kết quả khác nhau
      </span>

      <div className="p-4 rounded-2xl bg-background/58 border border-white/70 min-h-[80px]">
        <p className="text-[15px] leading-7 text-foreground/80">{currentNode?.text}</p>
      </div>

      {currentNode?.isEnd ? (
        <div className="flex justify-center pt-2">
          {currentNode.isSuccess ? (
            <div className="rounded-[1.6rem] bg-mint/10 px-5 py-3 text-center border border-mint/20 shadow-soft w-full">
              <p className="text-[14px] font-bold text-mint-foreground">🎉 Chúc mừng! Thử thách hoàn thành xuất sắc.</p>
            </div>
          ) : (
            <Button
              onClick={() => {
                setLocalNodeKey(startNode);
                setLocalDone(false);
              }}
              className="rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-6 py-2"
            >
              Quay lại bắt đầu thử cách khác ↺
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 pt-2">
          {(currentNode?.choices ?? []).map((choice: any, idx: number) => (
            <button
              key={idx}
              disabled={isDone}
              onClick={() => handleChoice(choice.nextNode)}
              className="w-full text-left p-4 rounded-[1.4rem] border border-border/80 bg-background/70 hover:border-primary/40 hover:bg-background transition-all text-[14px] font-semibold text-foreground/90 shadow-soft"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchingBlock({
  data,
  onComplete,
  isCompleted,
  onIncorrect,
}: {
  data: any;
  onComplete: () => void;
  isCompleted?: boolean;
  onIncorrect?: () => void;
}) {
  const pairs = data?.pairs ?? [];
  const instruction = data?.instruction ?? "Ghép các khái niệm sau:";

  const [shuffledLeft] = useState<string[]>(() => {
    const lefts = pairs.map((p: any) => p.left);
    return lefts.slice().sort(() => Math.random() - 0.5);
  });
  const [shuffledRight] = useState<string[]>(() => {
    const rights = pairs.map((p: any) => p.right);
    return rights.slice().sort(() => Math.random() - 0.5);
  });

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [localMatchedLefts, setLocalMatchedLefts] = useState<Set<string>>(new Set());
  const [localMatchedRights, setLocalMatchedRights] = useState<Set<string>>(new Set());
  const [errorLeft, setErrorLeft] = useState<string | null>(null);
  const [errorRight, setErrorRight] = useState<string | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [localDone, setLocalDone] = useState(false);

  const isDone = isCompleted || localDone;

  const matchedLefts = useMemo(() => {
    if (isCompleted) {
      return new Set<string>(pairs.map((p: any) => p.left));
    }
    return localMatchedLefts;
  }, [isCompleted, pairs, localMatchedLefts]);

  const matchedRights = useMemo(() => {
    if (isCompleted) {
      return new Set<string>(pairs.map((p: any) => p.right));
    }
    return localMatchedRights;
  }, [isCompleted, pairs, localMatchedRights]);

  const handleLeftClick = (text: string) => {
    if (isDone || matchedLefts.has(text) || errorLeft) return;
    if (selectedLeft === text) {
      setSelectedLeft(null);
      return;
    }

    setSelectedLeft(text);
    if (selectedRight) {
      checkMatch(text, selectedRight);
    }
  };

  const handleRightClick = (text: string) => {
    if (isDone || matchedRights.has(text) || errorRight) return;
    if (selectedRight === text) {
      setSelectedRight(null);
      return;
    }

    setSelectedRight(text);
    if (selectedLeft) {
      checkMatch(selectedLeft, text);
    }
  };

  const checkMatch = (leftText: string, rightText: string) => {
    const matchedPair = pairs.find((p: any) => p.left === leftText && p.right === rightText);

    if (matchedPair) {
      toast.success("Ghép cặp đúng!");
      const nextLefts = new Set(localMatchedLefts).add(leftText);
      const nextRights = new Set(localMatchedRights).add(rightText);
      setLocalMatchedLefts(nextLefts);
      setLocalMatchedRights(nextRights);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (nextLefts.size === pairs.length) {
        setLocalDone(true);
        onComplete();
      }
    } else {
      setErrorLeft(leftText);
      setErrorRight(rightText);
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongAttempt(true);

      if (onIncorrect) {
        onIncorrect();
      } else {
        toast.error("Ghép cặp chưa chính xác.");
      }

      setTimeout(() => {
        setErrorLeft(null);
        setErrorRight(null);
        setWrongAttempt(false);
      }, 800);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <p className="text-[14px] font-semibold text-foreground/80">{instruction}</p>

      {isDone ? (
        <div className="rounded-[1.6rem] bg-mint/10 p-5 text-center border border-mint/20 shadow-soft w-full">
          <p className="text-[14px] font-bold text-mint-foreground">🎉 Bạn đã ghép đôi chính xác tất cả định nghĩa!</p>
        </div>
      ) : (
        <motion.div
          animate={wrongAttempt ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2.5">
            {shuffledLeft.map((text) => {
              const isMatched = matchedLefts.has(text);
              const isSelected = selectedLeft === text;
              const isFailed = errorLeft === text;

              let styleClass = "border-border/80 bg-background/70 hover:border-primary/45";
              if (isMatched) styleClass = "border-mint/60 bg-mint/8 text-mint-foreground opacity-60 cursor-default";
              else if (isFailed) styleClass = "border-peach bg-peach/20 text-peach-foreground";
              else if (isSelected) styleClass = "border-primary bg-primary/8 shadow-soft ring-2 ring-primary/20";

              return (
                <button
                  key={text}
                  disabled={isMatched || isDone}
                  onClick={() => handleLeftClick(text)}
                  className={`w-full text-left p-3.5 rounded-xl border text-[13px] font-semibold transition-all shadow-sm ${styleClass}`}
                >
                  {text}
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5">
            {shuffledRight.map((text) => {
              const isMatched = matchedRights.has(text);
              const isSelected = selectedRight === text;
              const isFailed = errorRight === text;

              let styleClass = "border-border/80 bg-background/70 hover:border-primary/45";
              if (isMatched) styleClass = "border-mint/60 bg-mint/8 text-mint-foreground opacity-60 cursor-default";
              else if (isFailed) styleClass = "border-peach bg-peach/20 text-peach-foreground";
              else if (isSelected) styleClass = "border-primary bg-primary/8 shadow-soft ring-2 ring-primary/20";

              return (
                <button
                  key={text}
                  disabled={isMatched || isDone}
                  onClick={() => handleRightClick(text)}
                  className={`w-full text-left p-3.5 rounded-xl border text-[13px] font-semibold transition-all shadow-sm leading-relaxed ${styleClass}`}
                >
                  {text}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function FillBlankBlock({
  data,
  onComplete,
  isCompleted,
  onIncorrect,
}: {
  data: any;
  onComplete: () => void;
  isCompleted?: boolean;
  onIncorrect?: () => void;
}) {
  const sentence = data?.sentence ?? "";
  const blanks = data?.blanks ?? {};
  const instruction = data?.instruction ?? "Điền vào chỗ trống:";
  const wordPool = data?.words ?? [];

  const [localFilled, setLocalFilled] = useState<Record<string, string>>({});
  const [localSuccess, setLocalSuccess] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  const isSuccess = isCompleted || localSuccess;

  const filled = useMemo(() => {
    if (isCompleted) {
      const preFilled: Record<string, string> = {};
      Object.keys(blanks).forEach((key) => {
        preFilled[key] = blanks[key].correct;
      });
      return preFilled;
    }
    return localFilled;
  }, [isCompleted, blanks, localFilled]);

  const handleWordClick = (word: string) => {
    if (isSuccess) return;

    const isUsed = Object.values(filled).includes(word);
    if (isUsed) return;

    const blankKeys = Object.keys(blanks);
    const firstEmptyKey = blankKeys.find((key) => !filled[key]);

    if (firstEmptyKey) {
      setLocalFilled((prev) => ({
        ...prev,
        [firstEmptyKey]: word,
      }));
    }
  };

  const handleBlankClick = (blankKey: string) => {
    if (isSuccess) return;

    if (filled[blankKey]) {
      setLocalFilled((prev) => {
        const next = { ...prev };
        delete next[blankKey];
        return next;
      });
    }
  };

  const handleCheck = () => {
    const blankKeys = Object.keys(blanks);
    let allCorrect = true;

    for (const key of blankKeys) {
      if (filled[key] !== blanks[key].correct) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setLocalSuccess(true);
      toast.success("Chính xác tuyệt đối!");
      onComplete();
    } else {
      setWrongAttempt(true);
      if (onIncorrect) {
        onIncorrect();
      } else {
        toast.error("Đáp án chưa đúng rồi.");
      }
      setTimeout(() => {
        setWrongAttempt(false);
      }, 600);
    }
  };

  const parseSentence = () => {
    const parts = sentence.split(/(\[blank\d+\])/g);
    return parts.map((part: string, index: number) => {
      const match = part.match(/^\[(blank\d+)\]$/);
      if (match) {
        const key = match[1];
        const word = filled[key];
        const hasValue = !!word;

        return (
          <button
            key={index}
            disabled={isSuccess}
            onClick={() => handleBlankClick(key)}
            className={`inline-flex items-center justify-center min-w-[70px] h-[34px] px-3.5 mx-1.5 rounded-xl border-2 transition-all font-bold text-[14px] ${isSuccess
              ? "border-mint bg-mint/10 text-mint-foreground"
              : wrongAttempt
                ? "border-peach bg-peach/10 text-peach-foreground"
                : hasValue
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-dashed border-foreground/30 hover:border-primary/50 text-foreground/40"
              }`}
          >
            {hasValue ? word : blanks[key].placeholder ?? "..."}
          </button>
        );
      }
      return <span key={index} className="text-[15px] font-semibold text-foreground/80 leading-7">{part}</span>;
    });
  };

  const allFilled = Object.keys(blanks).every((key) => !!filled[key]);

  return (
    <div className="mt-4 space-y-5">
      <p className="text-[14px] font-semibold text-foreground/80">{instruction}</p>

      <motion.div
        animate={wrongAttempt ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="p-5 rounded-2xl bg-background/58 border border-white/70 shadow-sm leading-relaxed"
      >
        <div className="flex flex-wrap items-center leading-loose">
          {parseSentence()}
        </div>
      </motion.div>

      {isSuccess ? (
        <div className="rounded-[1.6rem] bg-mint/10 p-5 text-center border border-mint/20 shadow-soft w-full">
          <p className="text-[14px] font-bold text-mint-foreground">🎉 Bạn đã điền từ hoàn toàn chính xác!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2.5 justify-center py-2 border-t border-dashed border-foreground/10 pt-4">
            {wordPool.map((word: string) => {
              const isUsed = Object.values(filled).includes(word);
              return (
                <button
                  key={word}
                  disabled={isUsed || isSuccess}
                  onClick={() => handleWordClick(word)}
                  className={`px-4 py-2.5 rounded-full border text-[13px] font-bold transition-all shadow-sm ${isUsed
                    ? "bg-foreground/5 text-foreground/20 border-foreground/10 cursor-not-allowed"
                    : "bg-background/88 border-border/80 hover:border-primary/40 text-foreground/85 active:scale-95"
                    }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {allFilled && (
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleCheck}
                className="rounded-full bg-primary text-white hover:gradient-primary px-8 py-3 text-xs font-bold shadow-soft"
              >
                Kiểm tra kết quả
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function renderBlockContent(
  block: MicroLessonBlock,
  onInteractionCorrect?: () => void,
  isCompleted?: boolean,
  onIncorrect?: () => void
) {
  const data = safeJsonParse(block.contentJson);

  if (block.blockType === "hook") {
    return <h3 className="mt-2 text-xl font-bold leading-snug text-foreground">{data?.title ?? ""}</h3>;
  }

  if (block.blockType === "explanation") {
    return (
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-foreground/78">
        {(data?.bullets ?? []).map((item: string, idx: number) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.blockType === "scenario") {
    return (
      <div className="mt-3 space-y-2">
        {data?.title ? <p className="text-[15px] font-semibold text-foreground">{data.title}</p> : null}
        <p className="text-[15px] leading-7 text-foreground/78">{data?.body ?? ""}</p>
      </div>
    );
  }

  if (block.blockType === "interaction") {
    return (
      <InteractionBlock
        data={data}
        onComplete={onInteractionCorrect ?? (() => { })}
        isCompleted={isCompleted}
        onIncorrect={onIncorrect ?? (() => { })}
      />
    );
  }

  if (block.blockType === "scenario-choice") {
    return (
      <ScenarioChoiceBlock
        data={data}
        onComplete={onInteractionCorrect ?? (() => { })}
        isCompleted={isCompleted}
        onIncorrect={onIncorrect ?? (() => { })}
      />
    );
  }

  if (block.blockType === "matching") {
    return (
      <MatchingBlock
        data={data}
        onComplete={onInteractionCorrect ?? (() => { })}
        isCompleted={isCompleted}
        onIncorrect={onIncorrect ?? (() => { })}
      />
    );
  }

  if (block.blockType === "fill-blank") {
    return (
      <FillBlankBlock
        data={data}
        onComplete={onInteractionCorrect ?? (() => { })}
        isCompleted={isCompleted}
        onIncorrect={onIncorrect ?? (() => { })}
      />
    );
  }

  if (block.blockType === "sorting") {
    return (
      <SortingBlock
        data={data}
        onComplete={onInteractionCorrect ?? (() => { })}
        isCompleted={isCompleted}
        onIncorrect={onIncorrect ?? (() => { })}
      />
    );
  }

  if (block.blockType === "flashcard") {
    return (
      <FlashcardBlock
        data={data}
        onComplete={onInteractionCorrect ?? (() => { })}
        isCompleted={isCompleted}
      />
    );
  }

  if (block.blockType === "reflection") {
    return <p className="mt-3 text-[15px] font-semibold leading-7 text-foreground/85">{data?.question ?? ""}</p>;
  }

  if (block.blockType === "takeaway") {
    return (
      <ul className="mt-3 space-y-2 text-[15px] leading-7 text-foreground/82">
        {(data?.items ?? []).map((item: string, idx: number) => (
          <li key={idx}>• {item}</li>
        ))}
      </ul>
    );
  }

  return (
    <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-background/70 p-4 text-xs text-muted-foreground">
      {block.contentJson}
    </pre>
  );
}

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson, syncUser } = useAuth();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeMicroIndex, setActiveMicroIndex] = useState(0);
  const [isPrevHovered, setIsPrevHovered] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLesson(null);

    void Promise.all([apiRequest<Lesson[]>("/lessons"), apiRequest<Lesson>(`/lessons/${id}`)])
      .then(([lessonList, currentLesson]) => {
        setLessons(lessonList);
        setLesson(currentLesson);
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : "Không tìm thấy bài học.");
      });
  }, [id]);

  useEffect(() => {
    setActiveMicroIndex(0);
  }, [lesson?.slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeMicroIndex, id]);

  const courseLessons = useMemo(() => {
    if (!lesson || !lessons) return [];
    return lessons.filter((l) => l.courseId === lesson.courseId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [lessons, lesson]);

  const currentIndex = useMemo(() => {
    if (!lesson) return -1;
    return courseLessons.findIndex((item) => item.slug === id);
  }, [id, courseLessons, lesson]);

  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  const locked = lesson ? !lesson.isFree && (!user || user.plan === "free") : false;
  const completed = lesson ? user?.completedLessons.includes(lesson.slug) : false;

  const microLessonsSorted = useMemo(() => sortMicroLessons(lesson?.microLessons ?? []), [lesson?.microLessons]);
  const safeActiveMicroIndex = Math.min(activeMicroIndex, Math.max(0, microLessonsSorted.length - 1));
  const activeMicro = microLessonsSorted[safeActiveMicroIndex] ?? null;
  const activeBlocks = useMemo(() => (activeMicro ? sortBlocks(activeMicro.blocks ?? []) : []), [activeMicro]);

  const allContentMicrosCompleted = useMemo(() => {
    return microLessonsSorted.every((ml) => isAssessmentMicro(ml) || ml.completed);
  }, [microLessonsSorted]);

  const canPrevMicro = safeActiveMicroIndex > 0;
  const nextMicro = microLessonsSorted[safeActiveMicroIndex + 1] ?? null;
  const isNextMicroLocked = nextMicro && isAssessmentMicro(nextMicro) && !allContentMicrosCompleted;
  const canNextMicro = safeActiveMicroIndex < microLessonsSorted.length - 1 && !isNextMicroLocked;

  const [completedBlockIds, setCompletedBlockIds] = useState<Set<number>>(new Set());
  const [testLives, setTestLives] = useState(3);
  const [testGameOver, setTestGameOver] = useState(false);
  const [replayMode, setReplayMode] = useState(false);
  const [resetNonce, setResetNonce] = useState(0);
  const [visibleBlocksCount, setVisibleBlocksCount] = useState(1);

  const isAssessment = isAssessmentMicro(activeMicro);
  const isLastMicro = safeActiveMicroIndex === microLessonsSorted.length - 1;

  const totalContentMicros = useMemo(() => {
    return microLessonsSorted.filter((ml) => !isAssessmentMicro(ml)).length;
  }, [microLessonsSorted]);

  const allInteractiveBlocksCompleted = useMemo(() => {
    return activeBlocks.every((block) => {
      const isInteractive = ["interaction", "sorting", "flashcard", "scenario-choice", "matching", "fill-blank"].includes(block.blockType);
      return !isInteractive || completedBlockIds.has(block.id);
    });
  }, [activeBlocks, completedBlockIds]);

  useEffect(() => {
    setTestLives(3);
    setTestGameOver(false);
    setReplayMode(false);

    if (activeMicro) {
      if (activeMicro.completed) {
        setCompletedBlockIds(new Set(activeBlocks.map((b) => b.id)));
        setVisibleBlocksCount(activeBlocks.length);
      } else {
        setCompletedBlockIds(new Set());
        setVisibleBlocksCount(1);
      }
    } else {
      setCompletedBlockIds(new Set());
      setVisibleBlocksCount(1);
    }
  }, [activeMicro?.id, activeMicro?.completed, activeBlocks]);

  const handleIncorrectAnswer = () => {
    if (!isAssessment) {
      toast.error("Chưa chính xác rồi. Hãy thử lại nhé! 🥺");
      return;
    }
    setTestLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setTestGameOver(true);
        toast.error("Bài kiểm tra kết thúc! Bạn đã hết mạng.");
      } else {
        toast.error(`Chưa chính xác! Bạn còn ${nextLives} mạng.`);
      }
      return nextLives;
    });
  };

  const handleBlockCompleted = (blockId: number) => {
    setCompletedBlockIds((prev) => {
      const next = new Set(prev);
      next.add(blockId);
      return next;
    });

    const currentIdx = activeBlocks.findIndex((b) => b.id === blockId);
    if (currentIdx !== -1 && currentIdx === visibleBlocksCount - 1) {
      setVisibleBlocksCount((v) => Math.min(activeBlocks.length, v + 1));
    }
  };

  const handleCompleteMicro = async (microLessonId: number) => {
    try {
      const res = await apiRequest<{ user: User; awardedXp: number }>(
        `/progress/micro-lessons/${microLessonId}/complete`,
        { method: "POST" }
      );
      if (res.user) {
        syncUser(res.user);
      }

      let updatedLesson = lesson;
      if (id) {
        updatedLesson = await apiRequest<Lesson>(`/lessons/${id}`);
        setLesson(updatedLesson);
      }

      const sortedList = sortMicroLessons(updatedLesson?.microLessons ?? []);
      const currentIndex = activeMicroIndex;
      const isLastMicro = currentIndex >= sortedList.length - 1;

      if (!isLastMicro) {
        toast.success(`Đã hoàn thành phần học! (+${res.awardedXp} XP)`);
      }

      if (isLastMicro) {
        if (updatedLesson && res.user && !res.user.completedLessons.includes(updatedLesson.slug)) {
          await completeLesson(updatedLesson.slug);
          setTimeout(() => {
            toast.success(
              `🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ bài học: ${updatedLesson.title}! (+${updatedLesson.xpReward} XP)`,
              { duration: 5000 }
            );
          }, 1000);
        }
      } else if (currentIndex < sortedList.length - 1) {
        setActiveMicroIndex(currentIndex + 1);
      }
    } catch (err) {
      toast.error("Không thể hoàn thành phần học. Vui lòng thử lại.");
    }
  };

  const isCompletingRef = useRef(false);

  useEffect(() => {
    isCompletingRef.current = false;
  }, [activeMicro?.id]);

  useEffect(() => {
    if (
      user &&
      activeMicro &&
      isAssessment &&
      allInteractiveBlocksCompleted &&
      visibleBlocksCount === activeBlocks.length &&
      (!activeMicro.completed || !completed) &&
      !replayMode &&
      !testGameOver &&
      !isCompletingRef.current
    ) {
      isCompletingRef.current = true;
      handleCompleteMicro(activeMicro.id)
        .finally(() => {
          isCompletingRef.current = false;
        });
    }
  }, [
    user,
    activeMicro?.id,
    isAssessment,
    allInteractiveBlocksCompleted,
    visibleBlocksCount,
    activeBlocks.length,
    completed,
    activeMicro?.completed,
    replayMode,
    testGameOver
  ]);

  const courseHex =
    lesson?.courseColorTheme && /^#?[0-9a-fA-F]{3,6}$/.test(lesson.courseColorTheme)
      ? lesson.courseColorTheme.startsWith("#")
        ? lesson.courseColorTheme
        : `#${lesson.courseColorTheme}`
      : "#7C3AED";

  const accentStrong = mix(courseHex, "#000000", 0.35);
  const accentSoft = mix(courseHex, "#ffffff", 0.82);
  const accentBorder = mix(courseHex, "#ffffff", 0.55);

  const renderCompletedSummary = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="detail-panel p-8 text-center flex flex-col items-center justify-center space-y-6 border border-mint/20 bg-mint/5"
      >
        <div className="relative">
          <span className="text-6xl animate-bounce inline-block">🏆</span>
          <span className="absolute -top-1 -right-1 text-2xl">✨</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Bạn đã chinh phục Thử thách!</h2>
          <p className="text-[15px] text-foreground/74 max-w-md mx-auto leading-relaxed">
            Chúc mừng bạn đã hoàn thành xuất sắc tất cả các trò chơi kiểm tra năng lực của bài học này và ghi nhớ kiến thức sâu sắc.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Button
            onClick={() => {
              setReplayMode(true);
              setTestLives(3);
              setTestGameOver(false);
              setCompletedBlockIds(new Set());
              setVisibleBlocksCount(1);
              setResetNonce((n) => n + 1);
            }}
            className="rounded-full px-6 py-5 text-xs font-bold border border-primary text-primary bg-background hover:bg-primary/5 transition-all shadow-soft"
          >
            Chơi lại thử thách ↺
          </Button>

          {nextLesson ? (
            <Button
              onClick={() => navigate(`/lesson/${nextLesson.slug}`)}
              className="rounded-full px-6 py-5 text-xs font-bold text-white transition-all shadow-soft animate-pulse"
              style={{ backgroundColor: accentStrong }}
            >
              Đi đến bài học tiếp theo <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (lesson.courseId) {
                  navigate(`/course/${lesson.courseId}`);
                } else {
                  navigate("/courses");
                }
              }}
              className="rounded-full px-6 py-5 text-xs font-bold text-white transition-all shadow-soft"
              style={{ backgroundColor: accentStrong }}
            >
              Quay lại lộ trình khóa học
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  const renderGameOverView = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="detail-panel p-8 text-center flex flex-col items-center justify-center space-y-6 border border-peach/20 bg-peach/5"
      >
        <div className="relative">
          <span className="text-6xl inline-block">😢</span>
          <span className="absolute -top-1 -right-1 text-2xl">💔</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Hết lượt mất rồi!</h2>
          <p className="text-[15px] text-foreground/74 max-w-md mx-auto leading-relaxed">
            Bạn đã sử dụng hết 3 mạng trong bài kiểm tra này. Hãy ôn lại kiến thức và thử lại từ đầu nhé!
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => {
              setTestLives(3);
              setTestGameOver(false);
              setCompletedBlockIds(new Set());
              setVisibleBlocksCount(1);
              setResetNonce((n) => n + 1);
            }}
            className="rounded-full px-8 py-5 text-xs font-bold text-white transition-all shadow-soft"
            style={{ backgroundColor: accentStrong }}
          >
            Làm lại từ đầu ↺
          </Button>
        </div>
      </motion.div>
    );
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="detail-panel px-6 py-4 text-destructive">{error}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="detail-panel px-6 py-4">Đang tải bài học...</p>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="detail-panel max-w-xl px-8 py-10 text-center">
          <p className="mb-4 text-lg">Bài học này dành cho tài khoản đã mở nội dung nâng cao.</p>
          <Button onClick={() => {
            if (lesson.courseId) {
              navigate(`/course/${lesson.courseId}`);
            } else {
              navigate("/courses");
            }
          }} className="rounded-full gradient-primary text-primary-foreground">
            Xem lộ trình khóa học
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-6xl px-4">
        <button
          onClick={() => {
            if (lesson.courseId) {
              navigate(`/course/${lesson.courseId}`);
            } else {
              navigate("/courses");
            }
          }}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại khóa học
        </button>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)]">
          <article>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="detail-panel p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ backgroundColor: accentSoft, color: accentStrong }}
                >
                  Bài {currentIndex !== -1 ? currentIndex + 1 : 1} / {courseLessons.length || 1}
                </span>

                <span className="rounded-full bg-background/70 px-4 py-2 text-xs font-semibold text-foreground/70">
                  {lesson.estimatedMinutes} phút • {lesson.xpReward} XP
                </span>

                {completed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint/16 px-4 py-2 text-xs font-semibold text-mint-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    Đã hoàn thành
                  </span>
                ) : null}
              </div>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground">{lesson.title}</h1>

              <div className="mt-5 border-l-4 bg-background/62 px-5 py-5" style={{ borderColor: accentBorder }}>
                <p className="text-[15px] leading-7 text-foreground/74">{lesson.summary}</p>
              </div>

              <div
                className="mt-8 rounded-[1.8rem] border p-6 shadow-soft transition-all duration-300 relative overflow-hidden"
                style={
                  isAssessment
                    ? {
                      background: `linear-gradient(135deg, ${accentSoft}, ${mix(accentSoft, "#FFFBEB", 0.5)})`,
                      borderColor: "#F59E0B",
                      borderWidth: "2px",
                      boxShadow: "0 10px 30px -5px rgba(245, 158, 11, 0.12)",
                    }
                    : {
                      backgroundColor: accentSoft,
                      borderColor: accentBorder,
                    }
                }
              >
                {isAssessment && (
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
                )}

                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  {isAssessment ? (
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-amber-500 animate-pulse" />
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-600 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Thử thách tổng kết
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: accentStrong }}>
                      Micro lesson {activeMicro ? activeMicro.order : "-"} / {totalContentMicros || 0}
                    </p>
                  )}
                </div>

                <h2 className="line-clamp-2 font-heading text-2xl font-bold text-foreground">
                  {activeMicro ? activeMicro.title : "Chưa có micro lesson"}
                </h2>
              </div>

              {isAssessment && (!activeMicro.completed || replayMode) && !testGameOver && (
                <div className="mt-4 flex items-center justify-between p-4 rounded-[1.2rem] bg-background/60 border border-white/80 shadow-soft">
                  <span className="text-sm font-bold text-foreground/75 flex items-center gap-1.5">
                    🎮 Thử thách sinh tồn (Đồng bộ 3 mạng):
                  </span>
                  <div className="flex gap-1.5 items-center">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 1 }}
                        animate={i >= testLives ? { scale: [1, 1.4, 0.9, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        className="text-2xl"
                      >
                        {i < testLives ? "❤️" : "🖤"}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline blocks */}
              <div className="mt-8 space-y-6">
                {activeMicro ? (
                  isAssessment && activeMicro.completed && !replayMode ? (
                    renderCompletedSummary()
                  ) : isAssessment && testGameOver ? (
                    renderGameOverView()
                  ) : (
                    activeBlocks.slice(0, visibleBlocksCount).map((block, idx) => {
                      const isLastVisible = idx === visibleBlocksCount - 1;
                      const isLastBlock = idx === activeBlocks.length - 1;
                      const showContinueButton =
                        isLastVisible &&
                        !isLastBlock &&
                        !["interaction", "sorting", "flashcard", "scenario-choice", "matching", "fill-blank"].includes(block.blockType);

                      return (
                        <motion.div
                          key={`${block.id}-${resetNonce}`}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="relative md:pl-14"
                        >
                          {idx < visibleBlocksCount - 1 ? (
                            <div
                              className="absolute left-[19px] top-[60px] bottom-[-54px] w-px hidden md:block"
                              style={{
                                backgroundColor: accentBorder,
                              }}
                            />
                          ) : null}

                          <div className="absolute left-0 top-6 hidden w-10 md:block">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-soft"
                              style={{ backgroundColor: accentStrong }}
                            >
                              {idx + 1}
                            </div>
                          </div>

                          <div className="rounded-[1.8rem] border border-white/70 bg-card/90 p-5 shadow-card">
                            <p
                              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                              style={{ backgroundColor: accentSoft, color: accentStrong }}
                            >
                              {blockLabel(block.blockType)}
                            </p>

                            {renderBlockContent(
                              block,
                              () => handleBlockCompleted(block.id),
                              completedBlockIds.has(block.id),
                              handleIncorrectAnswer
                            )}

                            {showContinueButton ? (
                              <div className="mt-4 flex justify-end">
                                <Button
                                  onClick={() => setVisibleBlocksCount((v) => Math.min(activeBlocks.length, v + 1))}
                                  className="rounded-full px-5 py-2 text-xs font-semibold text-white transition-all shadow-soft"
                                  style={{ backgroundColor: accentStrong }}
                                >
                                  Tiếp tục <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </motion.div>
                      );
                    })
                  )
                ) : (
                  <p className="text-sm text-foreground/70">Bài học này chưa có micro lessons.</p>
                )}
              </div>

              {/* Complete Micro Lesson Button */}
              {user && activeMicro && !isAssessment && (!activeMicro.completed || replayMode) && !testGameOver && visibleBlocksCount === activeBlocks.length && allInteractiveBlocksCompleted ? (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => {
                      if (replayMode) {
                        toast.success("Thử thách đã hoàn thành (Chế độ chơi lại)!");
                        setReplayMode(false);
                      } else {
                        void handleCompleteMicro(activeMicro.id);
                      }
                    }}
                    className="rounded-full px-8 py-5 text-sm font-semibold text-white transition-all shadow-soft hover:shadow-hover animate-pulse"
                    style={{ backgroundColor: accentStrong }}
                  >
                    Hoàn thành phần học này (+10 XP)
                  </Button>
                </div>
              ) : null}

            </motion.div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] gradient-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                  <PlayCircle className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Điều hướng bài học</p>
                  <h2 className="font-heading text-xl font-bold text-foreground">Di chuyển nhanh</h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {prevLesson ? (
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/lesson/${prevLesson.slug}`)}
                    className="w-full justify-between rounded-[1.1rem] bg-background/76 px-4 py-6"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Bài trước
                    </span>
                    <span className="min-w-0 max-w-[140px] truncate text-xs text-foreground/60">{prevLesson.title}</span>
                  </Button>
                ) : null}

                {nextLesson ? (
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/lesson/${nextLesson.slug}`)}
                    className="w-full justify-between rounded-[1.1rem] bg-background/76 px-4 py-6"
                  >
                    <span className="inline-flex items-center gap-2">
                      Bài tiếp theo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 max-w-[140px] truncate text-xs text-foreground/60">{nextLesson.title}</span>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] gradient-card p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Danh sách micro lessons</p>

              <div className="mt-4 space-y-3">
                {microLessonsSorted.map((ml, idx) => {
                  const isLocked = isAssessmentMicro(ml) && !allContentMicrosCompleted;
                  const isAssessment = isAssessmentMicro(ml);
                  const isActive = idx === safeActiveMicroIndex;

                  let buttonStyle: React.CSSProperties = {};
                  let buttonClass = "";

                  if (isLocked) {
                    buttonStyle = {
                      backgroundColor: "rgba(243, 244, 246, 0.5)",
                      border: "1px dashed rgba(156, 163, 175, 0.5)",
                      cursor: "not-allowed",
                      opacity: 0.7,
                    };
                    buttonClass = "text-foreground/50";
                  } else if (isAssessment) {
                    if (isActive) {
                      buttonStyle = {
                        background: `linear-gradient(135deg, ${accentStrong}, ${mix(accentStrong, "#000000", 0.2)})`,
                        border: "2px solid #F59E0B",
                        boxShadow: "0 0 12px rgba(245, 158, 11, 0.35)",
                        color: "white",
                      };
                    } else {
                      buttonStyle = {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: `2px dashed ${accentBorder}`,
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.04)",
                        color: "inherit",
                      };
                    }
                  } else {
                    if (isActive) {
                      buttonStyle = {
                        backgroundColor: accentSoft,
                        border: `1px solid ${accentBorder}`,
                        color: "inherit",
                      };
                    } else {
                      buttonStyle = {
                        backgroundColor: "rgba(255,255,255,0.72)",
                        border: "1px solid rgba(255,255,255,0.65)",
                        color: "inherit",
                      };
                    }
                  }

                  return (
                    <button
                      key={ml.id}
                      onClick={() => {
                        if (isLocked) {
                          toast.error("Vui lòng học xong tất cả các phần học trước để mở khóa bài kiểm tra! 🔒");
                          return;
                        }
                        setActiveMicroIndex(idx);
                      }}
                      className={`w-full rounded-[1.1rem] px-4 py-3 text-left text-sm transition-colors ${buttonClass}`}
                      style={buttonStyle}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold animate-transition"
                            style={{
                              backgroundColor: isAssessment
                                ? isActive
                                  ? "#F59E0B"
                                  : "rgba(245, 158, 11, 0.15)"
                                : isActive
                                  ? accentStrong
                                  : "rgba(0, 0, 0, 0.06)",
                              color: isAssessment
                                ? isActive
                                  ? "white"
                                  : "#D97706"
                                : isActive
                                  ? "white"
                                  : "inherit",
                            }}
                          >
                            {isAssessment ? (
                              <Trophy className="h-3.5 w-3.5" />
                            ) : (
                              ml.order
                            )}
                          </span>
                          <span className={`min-w-0 truncate font-semibold ${isActive && isAssessment ? "text-white" : ""}`}>
                            {ml.title}
                          </span>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {isLocked ? (
                            <Lock className="h-4 w-4 text-foreground/45" />
                          ) : ml.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                          ) : isActive ? (
                            <PlayCircle className={`h-5 w-5 ${isAssessment ? "text-amber-400" : "text-primary"}`} />
                          ) : (
                            <span className={`text-xs font-medium ${isAssessment ? "text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100" : "text-foreground/55"}`}>
                              {isAssessment ? "Challenge" : `${(ml.blocks?.length ?? 0)} cards`}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button
                  variant="ghost"
                  disabled={!canPrevMicro}
                  onClick={() => setActiveMicroIndex((v) => Math.max(0, v - 1))}
                  className="h-10 w-full justify-center rounded-full px-3 transition-colors"
                  style={{
                    backgroundColor: isPrevHovered && canPrevMicro ? "hsl(var(--accent))" : "rgba(255,255,255,0.72)",
                    color: isPrevHovered && canPrevMicro ? "hsl(var(--accent-foreground))" : "inherit"
                  }}
                  onMouseEnter={() => setIsPrevHovered(true)}
                  onMouseLeave={() => setIsPrevHovered(false)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Micro trước
                </Button>

                <Button
                  disabled={!canNextMicro}
                  onClick={() => setActiveMicroIndex((v) => Math.min(microLessonsSorted.length - 1, v + 1))}
                  className="h-10 w-full justify-center rounded-full px-3 text-white"
                  style={{ backgroundColor: accentStrong }}
                >
                  Micro tiếp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {lesson.sources && lesson.sources.length > 0 ? (
              <div className="rounded-[2rem] gradient-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Tài liệu uy tín</p>
                    <h2 className="font-heading text-xl font-bold text-foreground">Tham khảo thêm</h2>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {lesson.sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-[1.1rem] bg-background/76 px-4 py-3 text-sm font-semibold text-foreground/80 hover:text-foreground transition-all hover:bg-background/90"
                    >
                      <span className="truncate">{source.sourceName}</span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-foreground/50" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </section>
      </div>
    </div>
  );
}