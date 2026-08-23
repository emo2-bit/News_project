import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = `${root}/data/news.json`;
const destDir = `${root}/web/public/data`;
const dest = `${destDir}/news.json`;

if (!existsSync(src)) {
  console.warn("data/news.json이 없습니다. 먼저 파이프라인을 실행하세요 (npm run pipeline).");
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`data/news.json → web/public/data/news.json 복사 완료`);
