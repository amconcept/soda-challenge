import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "images");
const DEST = path.join(ROOT, "public/bubbles");
const PHOTO = /\.(jpe?g|png|webp)$/i;

function slug(file) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  return `${base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.jpg`;
}

function emptyDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, file), { recursive: true, force: true });
  }
}

function convert(src, dest) {
  if (process.platform === "darwin") {
    execFileSync("sips", [
      "-Z",
      "1200",
      "-s",
      "format",
      "jpeg",
      "-s",
      "formatOptions",
      "78",
      src,
      "--out",
      dest,
    ], { stdio: "pipe" });
    return;
  }
  fs.copyFileSync(src, dest);
}

emptyDir(DEST);

if (!fs.existsSync(SRC)) {
  console.warn("No images/ folder yet — photo bubbles will be empty.");
  process.exit(0);
}

const files = fs
  .readdirSync(SRC)
  .filter((file) => PHOTO.test(file) && !file.startsWith("."))
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

for (const file of files) {
  convert(path.join(SRC, file), path.join(DEST, slug(file)));
}

console.log(`Synced ${files.length} photos from images/ to public/bubbles/`);
