import { mkdir, writeFile } from "node:fs/promises";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { collectAll } from "./collect/index.js";

dayjs.extend(utc);
import { summarizeAndScore } from "./ai/summarize.js";
import type { NewsData, NewsItem } from "./types.js";

const DATA_DIR = new URL("../data/", import.meta.url);
const LOGS_DIR = new URL("../logs/", import.meta.url);

async function run() {
  const { items, sourceStats } = await collectAll();

  console.log("=== 소스별 수집 결과 ===");
  for (const stat of sourceStats) {
    if (stat.error) {
      console.log(`- ${stat.source}: 실패 (${stat.error})`);
    } else {
      console.log(`- ${stat.source}: 수집 ${stat.fetched}건 → 필터 후 ${stat.keptAfterFilter}건`);
    }
  }

  const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY);
  console.log(
    hasApiKey
      ? "\nANTHROPIC_API_KEY 감지됨 — AI 요약/스코어링을 수행합니다."
      : "\nANTHROPIC_API_KEY 없음 — 모든 항목을 ai_processed:false로 저장합니다(fallback)."
  );

  const newsItems: NewsItem[] = [];
  for (const item of items) {
    newsItems.push(await summarizeAndScore(item));
  }

  const newsData: NewsData = {
    collected_at: dayjs().utcOffset(9 * 60).format(),
    items: newsItems.sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0)),
  };

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(new URL("news.json", DATA_DIR), JSON.stringify(newsData, null, 2), "utf-8");

  const aiProcessedCount = newsItems.filter((i) => i.ai_processed).length;
  const highRelevanceCount = newsItems.filter((i) => (i.relevance_score ?? 0) >= 4).length;
  const fallbackCount = newsItems.length - aiProcessedCount;

  const log = {
    date: dayjs(newsData.collected_at).format("YYYY-MM-DD"),
    collected_at: newsData.collected_at,
    total_items: newsItems.length,
    source_stats: sourceStats,
    ai_processed_count: aiProcessedCount,
    fallback_count: fallbackCount,
    high_relevance_ratio:
      newsItems.length > 0 ? Number((highRelevanceCount / newsItems.length).toFixed(3)) : 0,
  };

  await mkdir(LOGS_DIR, { recursive: true });
  await writeFile(
    new URL(`${log.date}.json`, LOGS_DIR),
    JSON.stringify(log, null, 2),
    "utf-8"
  );

  console.log(`\n총 ${newsItems.length}건 저장 (data/news.json)`);
  console.log(
    `AI 처리 ${aiProcessedCount}건 / fallback ${fallbackCount}건 / 고관련도(4~5점) 비율 ${(
      log.high_relevance_ratio * 100
    ).toFixed(1)}%`
  );
}

run();
