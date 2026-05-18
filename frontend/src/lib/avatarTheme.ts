const tones = [
  "from-[#ffd8e8] to-[#f2eaff]",
  "from-[#dff7ff] to-[#eaf4ff]",
  "from-[#ffe7cf] to-[#fff3df]",
  "from-[#ddf8ef] to-[#effcf8]",
  "from-[#efe3ff] to-[#f8f2ff]",
];

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function getAvatarTone(seed: string) {
  const hash = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return tones[hash % tones.length];
}
