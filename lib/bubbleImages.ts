import fs from "fs";
import path from "path";

/** Web copies of photos from the project `images/` folder (see scripts/sync-bubbles.mjs). */
export function listBubbleImages(): string[] {
  const dir = path.join(process.cwd(), "public/bubbles");
  if (!fs.existsSync(dir)) return [];
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort()
    .map((file) => `${base}/bubbles/${encodeURIComponent(file)}`);
}
