import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const RAW_DIR = "public/assets/raw";
const OUT_DIR = "public/assets/game";

await fs.mkdir(OUT_DIR, { recursive: true });

const files = await fs.readdir(RAW_DIR);

for (const file of files) {
  if (!file.endsWith(".png")) continue;

  const input = path.join(RAW_DIR, file);
  const output = path.join(OUT_DIR, file);

  await sharp(input)
    .trim()
    .resize({
      width: 256,
      height: 128,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(output);

  console.log(`✓ ${file}`);
}

console.log("Done!");
