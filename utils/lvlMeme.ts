import { LEVEL_MEMES } from "@/assets/memes";

export function getMemeByLevel(level: number) {
  if (level >= 5) return LEVEL_MEMES[5];
  return LEVEL_MEMES[1];
}