import type { Category, RawItem } from "../types.js";
import { fetchEtnews } from "./sources/etnews.js";
import { fetchZdnetKorea } from "./sources/zdnetkorea.js";
import { fetchThelec } from "./sources/thelec.js";
import { isSemiconductorRelated } from "./keywords.js";
import { classifyItem } from "./classify.js";
import { dedupeBySimilarTitle } from "./dedupe.js";

export interface CollectedItem extends RawItem {
  category: Category;
}

export interface SourceStat {
  source: string;
  fetched: number;
  keptAfterFilter: number;
  error: string | null;
}

export interface CollectResult {
  items: CollectedItem[];
  sourceStats: SourceStat[];
  dedupedCount: number;
}

interface SourceDef {
  name: string;
  fetch: () => Promise<RawItem[]>;
}

// AI 호출 비용을 통제하기 위해 세 소스 모두 키워드 필터를 거친다
// (디일렉도 전문지이긴 하지만 반도체 외 기사가 섞여 있어 예외를 두지 않는다).
const SOURCES: SourceDef[] = [
  { name: "전자신문", fetch: fetchEtnews },
  { name: "ZDNet Korea", fetch: fetchZdnetKorea },
  { name: "디일렉", fetch: fetchThelec },
];

export async function collectAll(): Promise<CollectResult> {
  const filteredBySource: RawItem[][] = [];
  const sourceStats: SourceStat[] = [];

  const results = await Promise.allSettled(SOURCES.map((s) => s.fetch()));

  results.forEach((result, i) => {
    const source = SOURCES[i];

    if (result.status === "rejected") {
      filteredBySource.push([]);
      sourceStats.push({
        source: source.name,
        fetched: 0,
        keptAfterFilter: 0,
        error: String(result.reason),
      });
      return;
    }

    const raw = result.value;
    const filtered = raw.filter((item) =>
      isSemiconductorRelated(`${item.title} ${item.description}`)
    );

    filteredBySource.push(filtered);
    sourceStats.push({
      source: source.name,
      fetched: raw.length,
      keptAfterFilter: filtered.length,
      error: null,
    });
  });

  const merged = filteredBySource.flat();
  const deduped = dedupeBySimilarTitle(merged);
  const items = deduped.map((item) => ({ ...item, category: classifyItem(item) }));

  return { items, sourceStats, dedupedCount: merged.length - deduped.length };
}
