import healthyWater from "@/assets/blog/healthy-water.jpg";
import sleepNight from "@/assets/blog/sleep-night.jpg";
import friendshipOutdoor from "@/assets/blog/friendship-outdoor.jpg";
import phoneSafety from "@/assets/blog/phone-safety.jpg";
import studyFocus from "@/assets/blog/study-focus.jpg";
import confidentTeen from "@/assets/blog/confident-teen.jpg";
import quizQuick3d from "@/assets/games/quiz-quick-3d.png";
import quizLong3d from "@/assets/games/quiz-long-3d.png";
import flashRun3d from "@/assets/games/flash-run-3d.png";
import mythBuster3d from "@/assets/games/myth-buster-3d.png";
import safeSwipe3d from "@/assets/games/safe-swipe-3d.png";
import chatDetective3d from "@/assets/games/chat-detective-3d.png";
import redFlagHunt3d from "@/assets/games/red-flag-hunt-3d.png";
import emotionSort3d from "@/assets/games/emotion-sort-3d.png";
import teenPath3d from "@/assets/games/teen-path-3d.png";
import type { BlogPost, Game } from "@/types/api";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getBlogPhoto(post: Pick<BlogPost, "slug" | "title" | "category">) {
  const lookup = normalizeText(`${post.slug} ${post.title} ${post.category}`);

  if (lookup.includes("ngu")) return sleepNight;
  if (lookup.includes("tinh-ban")) return friendshipOutdoor;
  if (lookup.includes("ranh-gioi") || lookup.includes("mang") || lookup.includes("an toan")) return phoneSafety;
  if (lookup.includes("kiem-tra") || lookup.includes("hoc tap") || lookup.includes("hoc")) return studyFocus;
  if (lookup.includes("cam-xuc") || lookup.includes("ho-tro") || lookup.includes("bo-me")) return confidentTeen;
  if (lookup.includes("suc khoe") || lookup.includes("lanh-manh")) return healthyWater;

  return confidentTeen;
}

export function getGamePhoto(game: Pick<Game, "slug" | "title" | "gameType">) {
  const lookup = normalizeText(`${game.slug} ${game.title} ${game.gameType}`);

  if (game.slug === "safe-swipe") return safeSwipe3d;
  if (game.slug === "chat-detective") return chatDetective3d;
  if (game.slug === "red-flag-hunt") return redFlagHunt3d;
  if (game.slug === "emotion-sort") return emotionSort3d;
  if (game.slug === "teen-path") return teenPath3d;
  if (game.slug === "myth-buster") return mythBuster3d;
  if (lookup.includes("flash") || lookup.includes("anh-sang")) return flashRun3d;
  if (lookup.includes("long")) return quizLong3d;

  return quizQuick3d;
}
