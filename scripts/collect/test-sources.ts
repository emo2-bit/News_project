import { collectAll } from "./index.js";

const { items, sourceStats } = await collectAll();

console.log("=== 소스별 수집 결과 ===");
for (const stat of sourceStats) {
  if (stat.error) {
    console.log(`- ${stat.source}: 실패 (${stat.error})`);
  } else {
    console.log(`- ${stat.source}: 수집 ${stat.fetched}건 → 필터 후 ${stat.keptAfterFilter}건`);
  }
}

console.log(`\n=== 총 ${items.length}건 (카테고리 분류 포함) ===`);
for (const item of items.slice(0, 15)) {
  console.log(`[${item.category}] (${item.source}) ${item.title}`);
  console.log(`  ${item.url}`);
  console.log(`  발행: ${item.published_at}`);
}
