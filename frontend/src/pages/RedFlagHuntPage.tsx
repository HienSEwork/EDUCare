import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, AlertTriangle, CheckCircle2, RefreshCw, ArrowRight, Eye, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RED_FLAG_SCENES, type RedFlagScene, type RedFlagHotspot } from "@/data/redFlagItems";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-red-flag-hunt.svg";

type GamePhase = "intro" | "playing" | "result";

const GAME_DURATION = 60; // seconds per scene

// Mock Facebook profile scene renderer
function FacebookSceneUI({ scene, found, onFind }: { scene: RedFlagScene; found: Set<string>; onFind: (h: RedFlagHotspot) => void }) {
  return (
    <div className="relative h-full w-full select-none rounded-2xl overflow-hidden bg-[#f0f2f5] text-gray-900 text-sm font-sans">
      {/* FB header */}
      <div className="flex items-center gap-2 bg-[#1877f2] px-4 py-2.5 text-white text-base font-bold">
        <span>f</span><span className="flex-1 text-center">FaceBook</span>
        <span className="text-xs opacity-70">🔍 👤 📣</span>
      </div>
      {/* Cover */}
      <div className="h-28 w-full bg-gradient-to-r from-blue-300 to-purple-300" />
      {/* Avatar */}
      <div className="mx-4 -mt-10 flex items-end gap-3">
        <div className="h-20 w-20 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-3xl">😎</div>
        <div className="pb-2">
          <p className="font-bold text-lg">Nguyen Minh Cool</p>
          <p className="text-xs text-gray-500">200 bạn bè</p>
        </div>
      </div>
      {/* Info */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
          <span>📍 Đà Nẵng</span>
          <span>🎓 Học tại THCS ABC</span>
          <span className="text-red-500 font-semibold">🗓️ Tham gia: 2 tuần trước</span>
          <span className="text-red-500 font-semibold">👥 0 bạn chung</span>
        </div>
      </div>
      {/* Posts */}
      <div className="px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase">Ảnh (3 ảnh)</p>
        <div className="flex gap-2">
          {["🏖️","🌇","😎"].map((e,i) => (
            <div key={i} className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center text-2xl">{e}</div>
          ))}
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm text-xs">
          <p className="font-semibold text-blue-600">minh_cool_99 nhắn cho bạn:</p>
          <p className="mt-1 text-red-500 font-semibold">"Bạn trông hay đấy! Nhà bạn ở đâu vậy? Mình ở gần đó lắm 😊"</p>
        </div>
      </div>

      {/* Clickable hotspots */}
      {scene.hotspots.map((h) => (
        <button
          key={h.id}
          onClick={() => !found.has(h.id) && onFind(h)}
          className={`absolute rounded-lg border-2 transition-all cursor-pointer ${
            found.has(h.id)
              ? "border-green-500 bg-green-200/50 pointer-events-none"
              : "border-transparent hover:border-red-400 hover:bg-red-100/40"
          }`}
          style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
          title={found.has(h.id) ? h.label : "Bấm để điều tra..."}
        >
          {found.has(h.id) && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-green-700 whitespace-nowrap bg-green-100 px-2 py-0.5 rounded-full border border-green-300">
              🚩 {h.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Mock Email scene renderer
function EmailSceneUI({ scene, found, onFind }: { scene: RedFlagScene; found: Set<string>; onFind: (h: RedFlagHotspot) => void }) {
  return (
    <div className="relative h-full w-full select-none rounded-2xl overflow-hidden bg-white text-gray-900 text-sm">
      {/* Email header */}
      <div className="bg-[#ea4335] px-4 py-2.5 text-white font-bold flex items-center gap-2">
        <span className="text-lg">✉️</span> Gmail
      </div>
      <div className="px-5 py-4 space-y-3 bg-white">
        <div className="border-b pb-3">
          <p className="font-bold text-base text-gray-800">Thông báo bảo mật tài khoản ngân hàng</p>
          <p className="text-xs text-red-500 font-semibold mt-1">Từ: noreply@vietcombank-secure.xyz</p>
          <p className="text-xs text-gray-400">Đến: ban@gmail.com</p>
        </div>
        <div className="space-y-2.5 text-sm text-gray-700">
          <p className="font-semibold text-red-600">⚠️ KHẨN CẤP: Tài khoản của bạn sẽ bị khóa trong 24 giờ!</p>
          <p>Kính gửi Khách hàng thân mến,</p>
          <p>Hệ thống chúng tôi phát hiện hoạt đông đáng ngờ từ tài khoản. Bạn cần xác minh danh tính ngay để tránh bị khóa tài khoản vĩnh viễn.</p>
          <p className="text-blue-600 underline cursor-pointer text-red-500">→ Đăng nhập tại: http://vietcombank-login.ru/verify</p>
          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="font-semibold">Vui lòng cung cấp:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Số thẻ ngân hàng</li>
              <li>• Mật khẩu tài khoản</li>
              <li>• Số OTP</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clickable hotspots */}
      {scene.hotspots.map((h) => (
        <button
          key={h.id}
          onClick={() => !found.has(h.id) && onFind(h)}
          className={`absolute rounded-lg border-2 transition-all cursor-pointer ${
            found.has(h.id)
              ? "border-green-500 bg-green-200/50 pointer-events-none"
              : "border-transparent hover:border-red-400 hover:bg-red-100/30"
          }`}
          style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
        >
          {found.has(h.id) && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-green-700 whitespace-nowrap bg-green-100 px-2 py-0.5 rounded-full border border-green-300">
              🚩 {h.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Mock TikTok scene renderer
function TikTokSceneUI({ scene, found, onFind }: { scene: RedFlagScene; found: Set<string>; onFind: (h: RedFlagHotspot) => void }) {
  return (
    <div className="relative h-full w-full select-none rounded-2xl overflow-hidden bg-black text-white text-sm">
      {/* Video area */}
      <div className="relative h-60 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <span className="text-6xl">🎬</span>
        <div className="absolute bottom-2 left-2 text-xs bg-black/60 rounded px-2 py-1">@user_video</div>
      </div>
      {/* Caption */}
      <div className="px-3 py-2 bg-gray-900">
        <p className="text-xs text-red-400 font-semibold">@ten_that_nan_nhan nhìn xấu không chịu được 😂😂 ai like đồng ý</p>
        <p className="text-xs text-gray-400 mt-1">#trường #hài #viral</p>
      </div>
      {/* Comments */}
      <div className="px-3 py-2 space-y-1.5 bg-gray-900">
        <p className="text-xs font-semibold text-gray-400">Bình luận:</p>
        <div className="space-y-1 text-xs">
          <p><span className="text-blue-400">@abc:</span> <span className="text-red-300">hahaha xấu thiệt 😂</span></p>
          <p><span className="text-blue-400">@xyz:</span> <span className="text-red-300">trời ơi mặt vậy mà dám ra đường</span></p>
          <p><span className="text-blue-400">@qwe:</span> tag thêm bạn vào coi 😈</p>
        </div>
      </div>

      {/* Clickable hotspots */}
      {scene.hotspots.map((h) => (
        <button
          key={h.id}
          onClick={() => !found.has(h.id) && onFind(h)}
          className={`absolute rounded-lg border-2 transition-all cursor-pointer ${
            found.has(h.id)
              ? "border-green-500 bg-green-200/20 pointer-events-none"
              : "border-transparent hover:border-red-500 hover:bg-red-500/20"
          }`}
          style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
        >
          {found.has(h.id) && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-green-300 whitespace-nowrap bg-gray-800 px-2 py-0.5 rounded-full border border-green-500">
              🚩 {h.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function SceneRenderer({ scene, found, onFind }: { scene: RedFlagScene; found: Set<string>; onFind: (h: RedFlagHotspot) => void }) {
  if (scene.sceneType === "facebook") return <FacebookSceneUI scene={scene} found={found} onFind={onFind} />;
  if (scene.sceneType === "email") return <EmailSceneUI scene={scene} found={found} onFind={onFind} />;
  return <TikTokSceneUI scene={scene} found={found} onFind={onFind} />;
}

export default function RedFlagHuntPage() {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [lastFound, setLastFound] = useState<RedFlagHotspot | null>(null);
  const [totalFound, setTotalFound] = useState(0);
  const [totalFlags, setTotalFlags] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentScene = RED_FLAG_SCENES[sceneIndex];
  const isLastScene = sceneIndex >= RED_FLAG_SCENES.length - 1;

  const startGame = useCallback(() => {
    setSceneIndex(0);
    setFound(new Set());
    setTimeLeft(GAME_DURATION);
    setLastFound(null);
    setTotalFound(0);
    setTotalFlags(RED_FLAG_SCENES.reduce((sum, s) => sum + s.totalFlags, 0));
    setPhase("playing");
  }, []);

  const advanceScene = useCallback(() => {
    if (isLastScene) {
      setPhase("result");
    } else {
      setSceneIndex((i) => i + 1);
      setFound(new Set());
      setTimeLeft(GAME_DURATION);
      setLastFound(null);
    }
  }, [isLastScene]);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { advanceScene(); return GAME_DURATION; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, sceneIndex, advanceScene]);

  const handleFind = useCallback((h: RedFlagHotspot) => {
    setFound((prev) => new Set([...prev, h.id]));
    setLastFound(h);
    setTotalFound((n) => n + 1);
    setTimeout(() => setLastFound(null), 2500);
  }, []);

  const pct = totalFlags > 0 ? Math.round((totalFound / totalFlags) * 100) : 0;
  const timerPct = (timeLeft / GAME_DURATION) * 100;

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow="🚩 Mini Game · Quan sát"
        title="Cảnh Giác Cao Độ"
        description="Quan sát các màn hình giả mạo — Facebook, Email, TikTok — và bấm vào mọi dấu hiệu đáng ngờ trước khi hết giờ!"
        stats={[
          { label: "Số cảnh", value: `${RED_FLAG_SCENES.length} màn hình` },
          { label: "Thời gian", value: "60 giây/cảnh" },
          { label: "Kỹ năng", value: "Quan sát" },
        ]}
        rules={[
          { text: "Quan sát kỹ màn hình giả mạo hiển thị" },
          { text: "Bấm vào các vùng có dấu hiệu đáng ngờ" },
          { text: "Tìm hết cờ đỏ trước khi hết 60 giây" },
          { text: "Sau mỗi cảnh sẽ chuyển sang cảnh tiếp theo" },
        ]}
        startLabel="Bắt đầu điều tra!"
        onStart={startGame}
        bgGradient="linear-gradient(135deg,#0f1116 0%,#1a0505 50%,#0f1116 100%)"
        accentColor="#ef4444"
        buttonIcon={<Flag className="h-5 w-5" />}
      />
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────
  if (phase === "result") {
    const label = pct >= 80 ? { text: "Thám tử xuất sắc! Mắt cực tinh!", color: "#06d6a0" }
      : pct >= 60 ? { text: "Cảnh giác tốt! Tiếp tục luyện thêm nhé.", color: "#4361ee" }
      : { text: "Cần luyện thêm kỹ năng quan sát!", color: "#f97316" };

    return (
      <div className="min-h-screen pb-16 pt-8">
        <div className="container mx-auto max-w-2xl px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <section className="rounded-[2.4rem] border border-white/70 bg-white/90 p-8 shadow-card text-center">
              <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 60 ? "🔍" : "📚"}</div>
              <h1 className="mt-4 font-heading text-3xl font-bold">{label.text}</h1>
              <p className="mt-2 text-muted-foreground">Tìm được <strong>{totalFound}/{totalFlags}</strong> red flag ({pct}%)</p>
              <div
                className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full shadow-card"
                style={{ background: `conic-gradient(${label.color} ${pct}%, #e5e7eb ${pct}%)` }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background">
                  <span className="font-heading text-2xl font-bold" style={{ color: label.color }}>{pct}%</span>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button id="red-flag-replay-btn" className="gradient-primary text-primary-foreground" onClick={startGame}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Chơi lại
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
  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between rounded-[1.6rem] border border-white/65 bg-card/84 px-5 py-3 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Flag className="h-4 w-4 text-red-500" />
            <span>{found.size}/{currentScene.totalFlags} tìm được</span>
          </div>
          <span className="text-xs text-muted-foreground">Màn {sceneIndex + 1}/{RED_FLAG_SCENES.length}</span>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Timer className={`h-4 w-4 ${timeLeft <= 10 ? "text-red-500" : "text-primary"}`} />
            <span className={timeLeft <= 10 ? "text-red-500" : ""}>{timeLeft}s</span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${timerPct}%`, background: timeLeft <= 10 ? "#ef4444" : "linear-gradient(90deg,#ef4444,#f97316)" }}
          />
        </div>

        <h2 className="mb-3 text-center text-sm font-semibold text-muted-foreground">{currentScene.description}</h2>

        {/* Scene */}
        <div className="relative h-[460px] overflow-hidden rounded-[1.8rem] shadow-card">
          <SceneRenderer scene={currentScene} found={found} onFind={handleFind} />
        </div>

        {/* Feedback toast */}
        <AnimatePresence>
          {lastFound && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-[1.4rem] bg-green-100 p-4 text-green-800"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">🚩 Tìm thấy: {lastFound.label}</p>
                  <p className="mt-1 text-sm">{lastFound.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next scene button */}
        {found.size === currentScene.totalFlags && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <Button id="red-flag-next-btn" className="w-full gradient-primary py-5 text-base font-bold text-primary-foreground" onClick={advanceScene}>
              {isLastScene ? "🏆 Xem kết quả" : "Màn tiếp theo →"}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
