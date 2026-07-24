import healthyWater from "@/assets/blog/healthy-water.jpg";
import sleepNight from "@/assets/blog/sleep-night.jpg";
import friendshipOutdoor from "@/assets/blog/friendship-outdoor.jpg";
import phoneSafety from "@/assets/blog/phone-safety.jpg";
import studyFocus from "@/assets/blog/study-focus.jpg";
import confidentTeen from "@/assets/blog/confident-teen.jpg";

import flashRunFantasy from "@/assets/games/flash-run-fantasy.png";
import mythBusterFantasy from "@/assets/games/myth-buster-fantasy.png";
import safeSwipeFantasy from "@/assets/games/safe-swipe-fantasy.png";
import chatDetectiveFantasy from "@/assets/games/chat-detective-fantasy.png";
import redFlagHuntFantasy from "@/assets/games/red-flag-hunt-fantasy.png";
import emotionSortFantasy from "@/assets/games/emotion-sort-fantasy.png";
import teenPathFantasy from "@/assets/games/teen-path-fantasy.png";
import quizQuick3d from "@/assets/games/quiz-quick-3d.png";
import quizLong3d from "@/assets/games/quiz-long-3d.png";

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

const GAME_THUMBNAIL: Record<string, string> = {
  "safe-swipe": safeSwipeFantasy,
  "chat-detective": chatDetectiveFantasy,
  "red-flag-hunt": redFlagHuntFantasy,
  "emotion-sort": emotionSortFantasy,
  "teen-path": teenPathFantasy,
  "myth-buster": mythBusterFantasy,
  "anh-sang-tu-tin": flashRunFantasy,
  "flash-light-run": flashRunFantasy,
  "quiz-long": quizLong3d,
  "quiz-quick": quizQuick3d,
};

export function getGamePhoto(game: Pick<Game, "slug" | "title" | "gameType">) {
  if (GAME_THUMBNAIL[game.slug]) return GAME_THUMBNAIL[game.slug];

  // Fallback: keyword match on normalized slug+title
  const lookup = normalizeText(`${game.slug} ${game.title}`);
  if (lookup.includes("flash") || lookup.includes("anh-sang") || lookup.includes("tu-tin")) return flashRunFantasy;
  if (lookup.includes("myth") || lookup.includes("giai-ma") || lookup.includes("tin-don")) return mythBusterFantasy;
  if (lookup.includes("swipe") || lookup.includes("ranh-gioi")) return safeSwipeFantasy;
  if (lookup.includes("chat") || lookup.includes("tham-tu")) return chatDetectiveFantasy;
  if (lookup.includes("flag") || lookup.includes("canh-giac")) return redFlagHuntFantasy;
  if (lookup.includes("emotion") || lookup.includes("cam-xuc")) return emotionSortFantasy;
  if (lookup.includes("teen") || lookup.includes("nga-re")) return teenPathFantasy;
  if (lookup.includes("long") || lookup.includes("dai")) return quizLong3d;

  return quizQuick3d;
}
