import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Map, RotateCcw, Shield, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameIntroHero from "@/components/GameIntroHero";
import introSvg from "@/assets/games/intro-flash-run.svg";

type GamePhase = "intro" | "playing" | "won" | "lost";
type Point = { x: number; y: number };
type Collectible = Point & { id: number; collected: boolean; label: string };
type Hazard = Point & { id: number; baseX: number; baseY: number; phase: number };
type Building = Point & { width: number; height: number; depth: number; color: string };
type GameState = {
  player: Point;
  camera: Point;
  score: number;
  confidence: number;
  timeLeft: number;
  collected: number;
  checkpoint: number;
  collectibles: Collectible[];
  hazards: Hazard[];
  lastHitAt: number;
  startedAt: number;
};

const VIEW_WIDTH = 900;
const VIEW_HEIGHT = 520;
const WORLD_WIDTH = 1800;
const WORLD_HEIGHT = 1120;
const PERSPECTIVE_Y = 0.76;
const PLAYER_SPEED = 300;
const PLAYER_RADIUS = 22;
const GATE: Point = { x: 960, y: 330 };
const BEACON: Point = { x: 1650, y: 920 };

const COLLECTIBLE_POSITIONS: Array<Point & { label: string }> = [
  { x: 210, y: 250, label: "Dám thử" }, { x: 390, y: 170, label: "Bình tĩnh" },
  { x: 520, y: 400, label: "Tin mình" }, { x: 290, y: 610, label: "Lắng nghe" },
  { x: 650, y: 720, label: "Chủ động" }, { x: 830, y: 520, label: "Kiên trì" },
  { x: 1040, y: 180, label: "Cất tiếng" }, { x: 1140, y: 460, label: "Tôn trọng" },
  { x: 980, y: 820, label: "Ranh giới" }, { x: 1260, y: 700, label: "Tự hào" },
  { x: 1430, y: 330, label: "Kết nối" }, { x: 1540, y: 610, label: "Can đảm" },
  { x: 1680, y: 270, label: "Tỏa sáng" }, { x: 1470, y: 980, label: "Vững vàng" },
];

const BUILDINGS: Building[] = [
  { x: 120, y: 360, width: 170, height: 130, depth: 34, color: "#4338ca" },
  { x: 520, y: 90, width: 210, height: 130, depth: 46, color: "#0f766e" },
  { x: 690, y: 480, width: 150, height: 180, depth: 40, color: "#7c3aed" },
  { x: 1060, y: 550, width: 220, height: 150, depth: 54, color: "#be185d" },
  { x: 1320, y: 120, width: 190, height: 150, depth: 38, color: "#0369a1" },
  { x: 1420, y: 700, width: 170, height: 140, depth: 48, color: "#a16207" },
];

const initialGameState = (): GameState => ({
  player: { x: 120, y: 160 },
  camera: { x: 120, y: 160 },
  score: 0,
  confidence: 100,
  timeLeft: 90,
  collected: 0,
  checkpoint: 0,
  collectibles: COLLECTIBLE_POSITIONS.map((item, index) => ({ ...item, id: index + 1, collected: false })),
  hazards: [
    { id: 1, x: 470, y: 570, baseX: 470, baseY: 570, phase: 0.2 },
    { id: 2, x: 900, y: 690, baseX: 900, baseY: 690, phase: 2.1 },
    { id: 3, x: 1240, y: 310, baseX: 1240, baseY: 310, phase: 4.2 },
    { id: 4, x: 1550, y: 850, baseX: 1550, baseY: 850, phase: 5.4 },
  ],
  lastHitAt: -1000,
  startedAt: performance.now(),
});

const challengeText = (checkpoint: number, collected: number) => {
  if (checkpoint === 0) return `Thu thập 4 điểm sáng (${Math.min(collected, 4)}/4)`;
  if (checkpoint === 1) return "Đi đến Cổng Cất Tiếng ở khu trung tâm";
  return `Thu thập đủ 10 điểm và đến Hải đăng (${Math.min(collected, 10)}/10)`;
};

const isBlocked = (point: Point) => BUILDINGS.some((building) => (
  point.x + PLAYER_RADIUS > building.x
  && point.x - PLAYER_RADIUS < building.x + building.width
  && point.y + PLAYER_RADIUS > building.y
  && point.y - PLAYER_RADIUS < building.y + building.height
));

function drawWorld(ctx: CanvasRenderingContext2D, state: GameState, now: number) {
  const project = (point: Point): Point => ({
    x: point.x - state.camera.x + VIEW_WIDTH / 2,
    y: (point.y - state.camera.y) * PERSPECTIVE_Y + VIEW_HEIGHT / 2,
  });

  ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  sky.addColorStop(0, "#111346");
  sky.addColorStop(1, "#08091f");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(129, 140, 248, 0.12)";
  for (let x = 0; x <= WORLD_WIDTH; x += 100) {
    const a = project({ x, y: 0 });
    const b = project({ x, y: WORLD_HEIGHT });
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  for (let y = 0; y <= WORLD_HEIGHT; y += 100) {
    const a = project({ x: 0, y });
    const b = project({ x: WORLD_WIDTH, y });
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }

  const worldStart = project({ x: 0, y: 0 });
  const worldEnd = project({ x: WORLD_WIDTH, y: WORLD_HEIGHT });
  ctx.strokeStyle = "rgba(34, 211, 238, 0.45)";
  ctx.lineWidth = 4;
  ctx.strokeRect(worldStart.x, worldStart.y, worldEnd.x - worldStart.x, worldEnd.y - worldStart.y);

  const roadStart = project({ x: 0, y: 280 });
  const roadEnd = project({ x: WORLD_WIDTH, y: 470 });
  ctx.fillStyle = "rgba(49, 46, 129, 0.45)";
  ctx.fillRect(roadStart.x, roadStart.y, roadEnd.x - roadStart.x, roadEnd.y - roadStart.y);
  ctx.setLineDash([22, 18]);
  ctx.strokeStyle = "rgba(250, 204, 21, 0.35)";
  ctx.beginPath();
  const roadMidA = project({ x: 0, y: 375 });
  const roadMidB = project({ x: WORLD_WIDTH, y: 375 });
  ctx.moveTo(roadMidA.x, roadMidA.y); ctx.lineTo(roadMidB.x, roadMidB.y); ctx.stroke();
  ctx.setLineDash([]);

  BUILDINGS.forEach((building) => {
    const p = project(building);
    const height = building.height * PERSPECTIVE_Y;
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(p.x + 15, p.y + 13, building.width, height);
    ctx.fillStyle = building.color;
    ctx.fillRect(p.x, p.y, building.width, height);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + building.depth, p.y - building.depth * 0.55);
    ctx.lineTo(p.x + building.width + building.depth, p.y - building.depth * 0.55);
    ctx.lineTo(p.x + building.width, p.y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(15,23,42,0.35)";
    ctx.beginPath();
    ctx.moveTo(p.x + building.width, p.y);
    ctx.lineTo(p.x + building.width + building.depth, p.y - building.depth * 0.55);
    ctx.lineTo(p.x + building.width + building.depth, p.y + height - building.depth * 0.55);
    ctx.lineTo(p.x + building.width, p.y + height);
    ctx.closePath(); ctx.fill();
  });

  const drawMarker = (point: Point, color: string, label: string, active: boolean) => {
    const p = project(point);
    const pulse = 8 + Math.sin(now / 260) * 4;
    ctx.strokeStyle = active ? color : "rgba(148,163,184,0.35)";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 34 + pulse, 15 + pulse / 2, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = active ? color : "#64748b";
    ctx.fillRect(p.x - 4, p.y - 70, 8, 66);
    ctx.font = "700 13px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, p.x, p.y - 82);
  };
  drawMarker(GATE, "#22d3ee", "CỔNG CẤT TIẾNG", state.checkpoint === 1);
  drawMarker(BEACON, "#fbbf24", "HẢI ĐĂNG TỰ TIN", state.checkpoint === 2);

  state.collectibles.forEach((orb) => {
    if (orb.collected) return;
    const p = project(orb);
    const radius = 13 + Math.sin(now / 220 + orb.id) * 2;
    const glow = ctx.createRadialGradient(p.x - 4, p.y - 6, 2, p.x, p.y, radius * 2.3);
    glow.addColorStop(0, "#fff7bd"); glow.addColorStop(0.35, "#fbbf24"); glow.addColorStop(1, "rgba(251,191,36,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(p.x, p.y, radius * 2.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fde68a";
    ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
  });

  state.hazards.forEach((hazard) => {
    const p = project(hazard);
    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.beginPath(); ctx.ellipse(p.x + 8, p.y + 11, 28, 12, 0, 0, Math.PI * 2); ctx.fill();
    const fog = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, 34);
    fog.addColorStop(0, "rgba(244,63,94,0.92)"); fog.addColorStop(0.5, "rgba(88,28,135,0.8)"); fog.addColorStop(1, "rgba(30,27,75,0)");
    ctx.fillStyle = fog;
    ctx.beginPath(); ctx.arc(p.x, p.y, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fda4af";
    ctx.font = "900 16px system-ui"; ctx.textAlign = "center"; ctx.fillText("!", p.x, p.y + 5);
  });

  const player = project(state.player);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath(); ctx.ellipse(player.x + 7, player.y + 14, 24, 10, 0, 0, Math.PI * 2); ctx.fill();
  const playerGlow = ctx.createRadialGradient(player.x - 5, player.y - 8, 2, player.x, player.y, 34);
  playerGlow.addColorStop(0, "#ffffff"); playerGlow.addColorStop(0.25, "#22d3ee"); playerGlow.addColorStop(1, "rgba(59,130,246,0)");
  ctx.fillStyle = playerGlow;
  ctx.beginPath(); ctx.arc(player.x, player.y, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#67e8f9";
  ctx.beginPath(); ctx.arc(player.x, player.y - 7, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(player.x - 11, player.y + 5, 22, 24);
  ctx.restore();
}

export default function FlashLightRunPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pressedKeys = useRef<Record<string, boolean>>({});
  const game = useRef<GameState>(initialGameState());
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [hud, setHud] = useState(() => ({ score: 0, confidence: 100, timeLeft: 90, collected: 0, checkpoint: 0 }));

  const syncHud = useCallback(() => {
    const state = game.current;
    setHud({
      score: state.score,
      confidence: state.confidence,
      timeLeft: Math.max(0, Math.ceil(state.timeLeft)),
      collected: state.collected,
      checkpoint: state.checkpoint,
    });
  }, []);

  const startGame = useCallback(() => {
    game.current = initialGameState();
    pressedKeys.current = {};
    syncHud();
    setPhase("playing");
  }, [syncHud]);

  useEffect(() => {
    const gameKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"]);
    const onKeyDown = (event: KeyboardEvent) => {
      if (!gameKeys.has(event.key)) return;
      if (phase === "playing") event.preventDefault();
      pressedKeys.current[event.key] = true;
    };
    const onKeyUp = (event: KeyboardEvent) => { pressedKeys.current[event.key] = false; };
    const clearKeys = () => { pressedKeys.current = {}; };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);
    window.addEventListener("pointerup", clearKeys);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      window.removeEventListener("pointerup", clearKeys);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = VIEW_WIDTH * dpr;
    canvas.height = VIEW_HEIGHT * dpr;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    let frame = 0;
    let previous = performance.now();
    let lastHudSync = 0;
    const tick = (now: number) => {
      const state = game.current;
      const delta = Math.min(0.035, (now - previous) / 1000);
      previous = now;
      state.timeLeft = Math.max(0, 90 - (now - state.startedAt) / 1000);

      let dx = 0; let dy = 0;
      if (pressedKeys.current.ArrowLeft || pressedKeys.current.a) dx -= 1;
      if (pressedKeys.current.ArrowRight || pressedKeys.current.d) dx += 1;
      if (pressedKeys.current.ArrowUp || pressedKeys.current.w) dy -= 1;
      if (pressedKeys.current.ArrowDown || pressedKeys.current.s) dy += 1;
      const magnitude = Math.hypot(dx, dy) || 1;
      const candidateX = { x: Math.max(PLAYER_RADIUS, Math.min(WORLD_WIDTH - PLAYER_RADIUS, state.player.x + dx / magnitude * PLAYER_SPEED * delta)), y: state.player.y };
      const candidateY = { x: state.player.x, y: Math.max(PLAYER_RADIUS, Math.min(WORLD_HEIGHT - PLAYER_RADIUS, state.player.y + dy / magnitude * PLAYER_SPEED * delta)) };
      if (!isBlocked(candidateX)) state.player.x = candidateX.x;
      if (!isBlocked(candidateY)) state.player.y = candidateY.y;

      state.camera.x += (state.player.x - state.camera.x) * Math.min(1, delta * 7);
      state.camera.y += (state.player.y - state.camera.y) * Math.min(1, delta * 7);

      state.hazards.forEach((hazard) => {
        hazard.x = hazard.baseX + Math.cos(now / 900 + hazard.phase) * 95;
        hazard.y = hazard.baseY + Math.sin(now / 720 + hazard.phase) * 72;
        if (Math.hypot(hazard.x - state.player.x, hazard.y - state.player.y) < 50 && now - state.lastHitAt > 900) {
          state.confidence = Math.max(0, state.confidence - 14);
          state.score = Math.max(0, state.score - 8);
          state.lastHitAt = now;
        }
      });

      state.collectibles.forEach((orb) => {
        if (!orb.collected && Math.hypot(orb.x - state.player.x, orb.y - state.player.y) < 43) {
          orb.collected = true;
          state.collected += 1;
          state.score += 12;
          state.confidence = Math.min(100, state.confidence + 5);
        }
      });

      if (state.checkpoint === 0 && state.collected >= 4) state.checkpoint = 1;
      if (state.checkpoint === 1 && Math.hypot(GATE.x - state.player.x, GATE.y - state.player.y) < 70) {
        state.checkpoint = 2;
        state.score += 25;
      }
      if (state.checkpoint === 2 && state.collected >= 10 && Math.hypot(BEACON.x - state.player.x, BEACON.y - state.player.y) < 80) {
        state.score += Math.round(state.timeLeft * 2);
        syncHud();
        setPhase("won");
        return;
      }
      if (state.timeLeft <= 0 || state.confidence <= 0) {
        syncHud();
        setPhase("lost");
        return;
      }

      drawWorld(context, state, now);
      if (now - lastHudSync > 120) {
        syncHud();
        lastHudSync = now;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phase, syncHud]);

  const grade = useMemo(() => {
    if (phase === "won" && hud.confidence >= 70) return "Ngọn hải đăng tự tin";
    if (hud.score >= 130) return "Bạn đang tỏa sáng";
    if (hud.score >= 70) return "Bản lĩnh đang lớn dần";
    return "Mỗi lần thử là một bước tiến";
  }, [hud.confidence, hud.score, phase]);

  const setDirection = (key: string, active: boolean) => {
    pressedKeys.current[key] = active;
  };

  if (phase === "intro") {
    return (
      <GameIntroHero
        illustrationSrc={introSvg}
        eyebrow="Mini game · Mô phỏng 3D"
        title="Ánh sáng tự tin: Thành phố Tỏa Sáng"
        description="Khám phá bản đồ rộng theo góc nhìn camera bám nhân vật, thu thập sức mạnh tích cực, né những vùng lo âu và hoàn thành chuỗi nhiệm vụ để thắp sáng ngọn hải đăng tự tin."
        stats={[
          { label: "Thời gian", value: "90 giây" },
          { label: "Bản đồ", value: "3 khu thử thách" },
          { label: "Điều khiển", value: "WASD / cảm ứng" },
        ]}
        rules={[
          { text: "Khám phá bản đồ lớn với camera tự bám theo nhân vật" },
          { text: "Thu thập 4 điểm sáng để mở Cổng Cất Tiếng" },
          { text: "Né bóng tối di chuyển để bảo toàn thanh tự tin" },
          { text: "Thu đủ 10 điểm và tìm đến Hải đăng trước khi hết giờ" },
        ]}
        startLabel="Bắt đầu hành trình"
        onStart={startGame}
        bgGradient="linear-gradient(160deg, #08091f 0%, #16114a 48%, #082f49 100%)"
        accentColor="#22d3ee"
        buttonIcon={<Sparkles className="h-5 w-5" />}
      />
    );
  }

  return (
    <div className="game-page min-h-screen overflow-x-clip bg-[linear-gradient(160deg,#08091f_0%,#120c38_48%,#172554_100%)] pb-16 pt-8 text-slate-100 font-body">
      <div className="site-shell px-4">
        <section className="rounded-[1.75rem] border border-indigo-400/25 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">Mô phỏng 3D · Camera theo góc nhìn</p>
              <h1 className="mt-2 break-words font-heading text-2xl font-extrabold leading-tight text-white sm:text-3xl">Thành phố Tỏa Sáng</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo-100/75">{challengeText(hud.checkpoint, hud.collected)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Thời gian", value: `${hud.timeLeft}s` },
                { label: "Điểm", value: hud.score },
                { label: "Điểm sáng", value: `${hud.collected}/10` },
                { label: "Tự tin", value: `${hud.confidence}%` },
              ].map((item) => (
                <div key={item.label} className="min-w-[96px] rounded-2xl border border-indigo-400/20 bg-indigo-950/65 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">{item.label}</p>
                  <p className="mt-1 font-heading text-lg font-extrabold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 rounded-[1.75rem] border border-indigo-400/25 bg-slate-950/70 p-2 shadow-2xl sm:p-4">
            <div className="relative mx-auto aspect-[900/520] w-full max-w-[900px] overflow-hidden rounded-[1.25rem] border border-cyan-400/25 bg-slate-950">
              <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-label="Bản đồ game Ánh sáng tự tin" />
              {phase !== "playing" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/88 px-5 text-center backdrop-blur-sm">
                  <Trophy className={`h-12 w-12 ${phase === "won" ? "text-amber-300" : "text-indigo-300"}`} />
                  <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300">{phase === "won" ? "Hoàn thành hành trình" : "Kết thúc lượt chơi"}</p>
                  <h2 className="mt-2 font-heading text-2xl font-extrabold text-white sm:text-4xl">{grade}</h2>
                  <p className="mt-3 text-sm text-indigo-100/75">Điểm: {hud.score} · Tự tin: {hud.confidence}% · Điểm sáng: {hud.collected}</p>
                  <Button onClick={startGame} className="mt-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-7 font-bold text-white">
                    <RotateCcw className="mr-2 h-4 w-4" /> Chơi lại
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="grid touch-none grid-cols-3 gap-2 sm:hidden">
                <span />
                <Button size="icon" variant="outline" className="border-indigo-400/30 bg-indigo-950/80 text-white" onPointerDown={() => setDirection("ArrowUp", true)} onPointerLeave={() => setDirection("ArrowUp", false)}><ArrowUp /></Button>
                <span />
                <Button size="icon" variant="outline" className="border-indigo-400/30 bg-indigo-950/80 text-white" onPointerDown={() => setDirection("ArrowLeft", true)} onPointerLeave={() => setDirection("ArrowLeft", false)}><ArrowLeft /></Button>
                <Button size="icon" variant="outline" className="border-indigo-400/30 bg-indigo-950/80 text-white" onPointerDown={() => setDirection("ArrowDown", true)} onPointerLeave={() => setDirection("ArrowDown", false)}><ArrowDown /></Button>
                <Button size="icon" variant="outline" className="border-indigo-400/30 bg-indigo-950/80 text-white" onPointerDown={() => setDirection("ArrowRight", true)} onPointerLeave={() => setDirection("ArrowRight", false)}><ArrowRight /></Button>
              </div>
              <p className="text-center text-xs font-semibold text-indigo-100/60 sm:text-left">WASD / phím mũi tên · Camera tự bám · Khung game không cuộn</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={startGame} className="rounded-full border-indigo-400/30 bg-indigo-950/60 text-white"><RotateCcw className="mr-2 h-4 w-4" /> Chơi lại</Button>
                <Button variant="outline" asChild className="rounded-full border-indigo-400/30 bg-indigo-950/60 text-white"><Link to="/games">Danh sách game</Link></Button>
              </div>
            </div>
          </div>

          <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1.6rem] border border-indigo-400/25 bg-slate-900/65 p-5 shadow-xl">
              <div className="flex items-center gap-3"><Map className="h-5 w-5 text-cyan-300" /><h2 className="font-heading text-lg font-bold text-white">Hành trình 3 chặng</h2></div>
              <ol className="mt-4 space-y-3 text-sm">
                {["Đánh thức điểm sáng", "Bước qua Cổng Cất Tiếng", "Thắp Hải đăng Tự Tin"].map((label, index) => (
                  <li key={label} className={`flex gap-3 rounded-xl border p-3 ${hud.checkpoint === index ? "border-cyan-400/45 bg-cyan-400/10 text-white" : hud.checkpoint > index ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-indigo-400/15 text-indigo-100/55"}`}>
                    <span className="font-black">{index + 1}</span><span>{label}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-[1.6rem] border border-indigo-400/25 bg-slate-900/65 p-5 shadow-xl">
              <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-amber-300" /><h2 className="font-heading text-lg font-bold text-white">Mẹo di chuyển</h2></div>
              <p className="mt-3 text-sm leading-relaxed text-indigo-100/70">Đi theo đường sáng để di chuyển nhanh giữa các khu. Công trình là vật cản thật; quan sát camera và vòng qua chúng. Bóng tối di chuyển sẽ làm giảm thanh tự tin nhưng có thời gian miễn sát thương ngắn.</p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
