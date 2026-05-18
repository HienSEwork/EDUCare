import type { BlogPost, Game } from "@/types/api";

type Palette = {
  bgStart: string;
  bgEnd: string;
  glow: string;
  surface: string;
  stroke: string;
  accent: string;
  accentSoft: string;
  ink: string;
};

const palette = {
  blush: {
    bgStart: "#ffe6ef",
    bgEnd: "#eef4ff",
    glow: "#ffd0e1",
    surface: "#ffffff",
    stroke: "rgba(85, 54, 100, 0.10)",
    accent: "#f15bb5",
    accentSoft: "#f8b7da",
    ink: "#2f1d45",
  },
  mint: {
    bgStart: "#e2f8ef",
    bgEnd: "#f1fbf6",
    glow: "#c9f2e0",
    surface: "#ffffff",
    stroke: "rgba(29, 72, 53, 0.10)",
    accent: "#2fbf9b",
    accentSoft: "#88dfc6",
    ink: "#17382f",
  },
  sky: {
    bgStart: "#e4f1ff",
    bgEnd: "#f4f8ff",
    glow: "#d6e9ff",
    surface: "#ffffff",
    stroke: "rgba(35, 74, 125, 0.10)",
    accent: "#5a8dee",
    accentSoft: "#b7cdf9",
    ink: "#1f3552",
  },
  apricot: {
    bgStart: "#fff0df",
    bgEnd: "#fff7ee",
    glow: "#ffe1bd",
    surface: "#ffffff",
    stroke: "rgba(120, 77, 29, 0.10)",
    accent: "#f59f45",
    accentSoft: "#ffd3a6",
    ink: "#4c3010",
  },
  lavender: {
    bgStart: "#efe7ff",
    bgEnd: "#f7f3ff",
    glow: "#dfd1ff",
    surface: "#ffffff",
    stroke: "rgba(70, 48, 116, 0.10)",
    accent: "#9b5de5",
    accentSoft: "#cfb0ff",
    ink: "#2c1b4f",
  },
  aqua: {
    bgStart: "#ddfbff",
    bgEnd: "#effdff",
    glow: "#c3f5fb",
    surface: "#ffffff",
    stroke: "rgba(24, 92, 105, 0.10)",
    accent: "#00bbbf",
    accentSoft: "#8decef",
    ink: "#183a44",
  },
} as const satisfies Record<string, Palette>;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toDataUri(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function baseSvg(colors: Palette, inner: string) {
  return toDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" fill="none">
      <defs>
        <linearGradient id="bg" x1="64" x2="730" y1="48" y2="472" gradientUnits="userSpaceOnUse">
          <stop stop-color="${colors.bgStart}"/>
          <stop offset="1" stop-color="${colors.bgEnd}"/>
        </linearGradient>
        <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(210 120) rotate(31.8) scale(300 240)" gradientUnits="userSpaceOnUse">
          <stop stop-color="${colors.glow}" stop-opacity="0.88"/>
          <stop offset="1" stop-color="${colors.glow}" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18"/>
        </filter>
      </defs>
      <rect width="800" height="520" rx="36" fill="url(#bg)"/>
      <circle cx="182" cy="124" r="138" fill="url(#glow)" filter="url(#blur)"/>
      <circle cx="654" cy="110" r="88" fill="${colors.surface}" opacity="0.42"/>
      <path d="M0 364C124 330 208 332 292 378C378 426 460 446 560 417C634 396 709 346 800 332V520H0V364Z" fill="${colors.surface}" opacity="0.52"/>
      <rect x="38" y="36" width="724" height="448" rx="30" stroke="${colors.stroke}"/>
      ${inner}
    </svg>
  `);
}

function emotionScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <rect x="82" y="118" width="270" height="220" rx="38" fill="${colors.surface}" opacity="0.94"/>
      <circle cx="216" cy="196" r="58" fill="${colors.accentSoft}"/>
      <circle cx="195" cy="188" r="8" fill="${colors.ink}"/>
      <circle cx="237" cy="188" r="8" fill="${colors.ink}"/>
      <path d="M184 226C203 244 229 244 248 226" stroke="${colors.ink}" stroke-width="10" stroke-linecap="round"/>
      <rect x="430" y="126" width="214" height="58" rx="29" fill="${colors.surface}" opacity="0.92"/>
      <rect x="430" y="206" width="178" height="58" rx="29" fill="${colors.surface}" opacity="0.76"/>
      <rect x="430" y="286" width="228" height="58" rx="29" fill="${colors.surface}" opacity="0.62"/>
      <circle cx="598" cy="392" r="56" fill="${colors.accent}" opacity="0.12"/>
    `,
  );
}

function studyScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <rect x="84" y="124" width="286" height="214" rx="34" fill="${colors.surface}" opacity="0.94"/>
      <rect x="112" y="98" width="238" height="262" rx="28" fill="${colors.surface}" stroke="${colors.stroke}"/>
      <rect x="148" y="154" width="162" height="18" rx="9" fill="${colors.accentSoft}"/>
      <rect x="148" y="198" width="124" height="14" rx="7" fill="${colors.accentSoft}" opacity="0.86"/>
      <rect x="148" y="232" width="146" height="14" rx="7" fill="${colors.accentSoft}" opacity="0.72"/>
      <circle cx="578" cy="180" r="70" fill="${colors.surface}" opacity="0.95"/>
      <path d="M548 181L570 203L610 159" stroke="${colors.accent}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="476" y="300" width="156" height="20" rx="10" fill="${colors.surface}" opacity="0.82"/>
      <rect x="476" y="332" width="118" height="14" rx="7" fill="${colors.surface}" opacity="0.62"/>
    `,
  );
}

function connectionScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <circle cx="236" cy="204" r="54" fill="${colors.surface}" opacity="0.95"/>
      <circle cx="334" cy="214" r="48" fill="${colors.surface}" opacity="0.9"/>
      <path d="M238 274C264 244 306 240 334 270" stroke="${colors.accent}" stroke-width="18" stroke-linecap="round"/>
      <path d="M420 152H592C610 152 624 166 624 184V228C624 246 610 260 592 260H522L478 292V260H420C402 260 388 246 388 228V184C388 166 402 152 420 152Z" fill="${colors.surface}" opacity="0.94"/>
      <rect x="430" y="186" width="134" height="16" rx="8" fill="${colors.accentSoft}"/>
      <rect x="430" y="218" width="112" height="12" rx="6" fill="${colors.accentSoft}" opacity="0.76"/>
      <circle cx="636" cy="342" r="60" fill="${colors.accent}" opacity="0.10"/>
    `,
  );
}

function safetyScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <rect x="118" y="122" width="176" height="250" rx="30" fill="${colors.surface}" stroke="${colors.stroke}"/>
      <rect x="140" y="154" width="132" height="136" rx="22" fill="${colors.accentSoft}" opacity="0.64"/>
      <rect x="176" y="316" width="60" height="12" rx="6" fill="${colors.stroke}"/>
      <path d="M520 132L614 172V252C614 304 575 348 520 366C465 348 426 304 426 252V172L520 132Z" fill="${colors.surface}" opacity="0.96"/>
      <path d="M486 246L512 272L558 220" stroke="${colors.accent}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="626" cy="128" r="30" fill="${colors.surface}" opacity="0.7"/>
    `,
  );
}

function healthScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <circle cx="612" cy="118" r="58" fill="${colors.surface}" opacity="0.82"/>
      <path d="M166 286C166 232 208 190 262 190C316 190 358 232 358 286V298H166V286Z" fill="${colors.surface}" opacity="0.96"/>
      <path d="M226 184C220 154 236 128 264 116C284 144 288 172 274 198" fill="${colors.accentSoft}"/>
      <path d="M282 182C278 152 294 126 322 114C340 140 344 168 332 196" fill="${colors.accent}" opacity="0.78"/>
      <rect x="432" y="182" width="92" height="158" rx="28" fill="${colors.surface}" opacity="0.95"/>
      <path d="M478 162C514 162 538 190 538 224V282C538 318 514 346 478 346C442 346 418 318 418 282V224C418 190 442 162 478 162Z" fill="${colors.accentSoft}" opacity="0.58"/>
      <rect x="470" y="138" width="16" height="36" rx="8" fill="${colors.accent}"/>
    `,
  );
}

function supportScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <path d="M286 188C286 150 256 122 218 122C180 122 150 150 150 188C150 232 184 254 218 286C252 254 286 232 286 188Z" fill="${colors.accent}"/>
      <path d="M386 188C386 150 416 122 454 122C492 122 522 150 522 188C522 232 488 254 454 286C420 254 386 232 386 188Z" fill="${colors.accentSoft}"/>
      <rect x="214" y="300" width="236" height="96" rx="32" fill="${colors.surface}" opacity="0.95"/>
      <path d="M244 346C268 324 294 314 322 314C348 314 372 324 394 346" stroke="${colors.ink}" stroke-width="14" stroke-linecap="round"/>
      <path d="M326 346C350 324 376 314 404 314C430 314 454 324 476 346" stroke="${colors.accent}" stroke-width="14" stroke-linecap="round"/>
    `,
  );
}

function skillsScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <rect x="114" y="316" width="110" height="36" rx="18" fill="${colors.surface}" opacity="0.96"/>
      <rect x="246" y="276" width="110" height="36" rx="18" fill="${colors.surface}" opacity="0.92"/>
      <rect x="378" y="236" width="110" height="36" rx="18" fill="${colors.surface}" opacity="0.88"/>
      <rect x="510" y="196" width="110" height="36" rx="18" fill="${colors.surface}" opacity="0.84"/>
      <path d="M562 124L574 150L602 154L582 174L588 202L562 188L536 202L542 174L522 154L550 150L562 124Z" fill="${colors.accent}"/>
      <circle cx="202" cy="180" r="60" fill="${colors.accentSoft}" opacity="0.78"/>
      <circle cx="202" cy="180" r="22" fill="${colors.surface}" opacity="0.92"/>
    `,
  );
}

function quizQuickScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <rect x="122" y="154" width="182" height="224" rx="28" fill="${colors.surface}" opacity="0.84"/>
      <rect x="166" y="132" width="182" height="224" rx="28" fill="${colors.surface}" opacity="0.92"/>
      <rect x="210" y="110" width="182" height="224" rx="28" fill="${colors.surface}" stroke="${colors.stroke}"/>
      <rect x="242" y="154" width="118" height="18" rx="9" fill="${colors.accentSoft}"/>
      <rect x="242" y="192" width="94" height="14" rx="7" fill="${colors.accentSoft}" opacity="0.76"/>
      <circle cx="574" cy="206" r="72" fill="${colors.surface}" opacity="0.95"/>
      <path d="M542 204L566 228L608 182" stroke="${colors.accent}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  );
}

function quizLongScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <rect x="122" y="142" width="204" height="246" rx="30" fill="${colors.surface}" opacity="0.96"/>
      <rect x="156" y="182" width="138" height="16" rx="8" fill="${colors.accentSoft}"/>
      <rect x="156" y="216" width="122" height="14" rx="7" fill="${colors.accentSoft}" opacity="0.78"/>
      <rect x="156" y="252" width="112" height="14" rx="7" fill="${colors.accentSoft}" opacity="0.64"/>
      <rect x="412" y="114" width="62" height="248" rx="31" fill="${colors.surface}" opacity="0.72"/>
      <rect x="500" y="144" width="62" height="218" rx="31" fill="${colors.surface}" opacity="0.82"/>
      <rect x="588" y="174" width="62" height="188" rx="31" fill="${colors.surface}" opacity="0.92"/>
      <path d="M612 112L624 138L652 142L632 162L638 190L612 176L586 190L592 162L572 142L600 138L612 112Z" fill="${colors.accent}"/>
    `,
  );
}

function flashScene(colors: Palette) {
  return baseSvg(
    colors,
    `
      <circle cx="252" cy="264" r="52" fill="${colors.accent}" opacity="0.18"/>
      <circle cx="252" cy="264" r="30" fill="${colors.accent}" opacity="0.42"/>
      <circle cx="252" cy="264" r="18" fill="${colors.surface}" opacity="0.98"/>
      <circle cx="516" cy="174" r="18" fill="${colors.surface}" opacity="0.96"/>
      <circle cx="582" cy="258" r="14" fill="${colors.surface}" opacity="0.76"/>
      <circle cx="610" cy="132" r="10" fill="${colors.surface}" opacity="0.62"/>
      <path d="M364 316C364 268 404 230 452 230H536C584 230 624 268 624 316V336H364V316Z" fill="${colors.surface}" opacity="0.9"/>
      <path d="M446 148L454 168L476 170L460 184L464 206L446 196L428 206L432 184L416 170L438 168L446 148Z" fill="${colors.accent}"/>
      <path d="M528 120L536 138L556 140L542 152L546 172L528 162L510 172L514 152L500 140L520 138L528 120Z" fill="${colors.accentSoft}"/>
    `,
  );
}

function getBlogTheme(post: BlogPost) {
  const slug = normalizeText(post.slug);
  const category = normalizeText(post.category);

  if (category.includes("suc khoe") || slug.includes("ngu") || slug.includes("lanh-manh")) return healthScene(palette.mint);
  if (category.includes("hoc tap")) return studyScene(palette.sky);
  if (category.includes("gia dinh") || category.includes("quan he") || slug.includes("bo-me") || slug.includes("tinh-ban")) return connectionScene(palette.apricot);
  if (category.includes("an toan") || slug.includes("ranh-gioi") || slug.includes("mang")) return safetyScene(palette.sky);
  if (category.includes("ho tro") || slug.includes("ho-tro")) return supportScene(palette.blush);
  if (category.includes("cam xuc") || category.includes("tinh than")) return emotionScene(palette.blush);
  return skillsScene(palette.lavender);
}

function getGameTheme(game: Game) {
  const slug = normalizeText(game.slug);
  if (game.gameType === "FLASH" || slug.includes("anh-sang") || slug.includes("flash")) return flashScene(palette.aqua);
  if (slug.includes("long")) return quizLongScene(palette.blush);
  return quizQuickScene(palette.lavender);
}

export function getBlogCoverArt(post: BlogPost) {
  return getBlogTheme(post);
}

export function getGameCoverArt(game: Game) {
  return getGameTheme(game);
}
