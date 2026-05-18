import healthyWater from "@/assets/blog/healthy-water.jpg";
import sleepNight from "@/assets/blog/sleep-night.jpg";
import friendshipOutdoor from "@/assets/blog/friendship-outdoor.jpg";
import phoneSafety from "@/assets/blog/phone-safety.jpg";
import studyFocus from "@/assets/blog/study-focus.jpg";
import confidentTeen from "@/assets/blog/confident-teen.jpg";
import puzzleGame from "@/assets/games/puzzle-game.jpg";
import quizStudy from "@/assets/games/quiz-study.jpg";
import gamingRoom from "@/assets/games/gaming-room.jpg";
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

  if (lookup.includes("flash") || lookup.includes("anh-sang")) return gamingRoom;
  if (lookup.includes("long")) return puzzleGame;

  return quizStudy;
}
