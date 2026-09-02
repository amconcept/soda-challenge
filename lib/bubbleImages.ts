import fs from "fs";
import path from "path";

/** Photo files in public/bubbles, ready for <img src>. */
export function listBubbleImages(): string[] {
  const dir = path.join(process.cwd(), "public/bubbles");
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort()
    .map((file) => `${base}/bubbles/${encodeURIComponent(file)}`);
}
