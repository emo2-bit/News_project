import type { RawItem } from "../types.js";

const SIMILARITY_THRESHOLD = 0.4;

function normalizeTitle(title: string): string {
  return title
    .replace(/\[[^\]]*\]/g, "") // "[ZD브리핑]" 같은 코너명 태그 제거
    .replace(/[^\p{L}\p{N}]/gu, "") // 공백/문장부호 제거
    .toLowerCase();
}

function bigrams(text: string): Set<string> {
  const grams = new Set<string>();
  for (let i = 0; i < text.length - 1; i++) grams.add(text.slice(i, i + 2));
  return grams;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const gram of a) if (b.has(gram)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

/**
 * 서로 다른 매체가 같은 사건을 보도한 경우, 제목 유사도(문자 bigram Jaccard)로
 * 감지해서 먼저 수집된 쪽만 남기고 나머지는 제외한다. AI 호출 전에 걸러서
 * 같은 뉴스에 중복으로 비용을 쓰지 않도록 한다.
 */
export function dedupeBySimilarTitle(items: RawItem[]): RawItem[] {
  const kept: RawItem[] = [];
  const keptGrams: Set<string>[] = [];

  for (const item of items) {
    const grams = bigrams(normalizeTitle(item.title));
    const isDuplicate = keptGrams.some(
      (existing) => jaccardSimilarity(existing, grams) >= SIMILARITY_THRESHOLD
    );
    if (!isDuplicate) {
      kept.push(item);
      keptGrams.push(grams);
    }
  }

  return kept;
}
