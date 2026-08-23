import type { Category, RawItem } from "../types.js";
import { fetchEtnews } from "./sources/etnews.js";
import { fetchZdnetKorea } from "./sources/zdnetkorea.js";
import { fetchThelec } from "./sources/thelec.js";
import { isSemiconductorRelated } from "./keywords.js";
import { classifyItem } from "./classify.js";

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
}

interface SourceDef {
  name: string;
  fetch: () => Promise<RawItem[]>;
  requiresKeywordFilter: boolean;
}

// 전자신문/ZDNet은 종합지 성격이라 키워드 필터가 필요하고,
// 디일렉은 반도체/디스플레이/배터리 전문지라 필터 없이 AI 스코어링에 맡긴다.
const SOURCES: SourceDef[] = [
  { name: "전자신문", fetch: fetchEtnews, requiresKeywordFilter: true },
  { name: "ZDNet Korea", fetch: fetchZdnetKorea, requiresKeywordFilter: true },
  { name: "디일렉", fetch: fetchThelec, requiresKeywordFilter: false },
];

export async function collectAll(): Promise<CollectResult> {
  const items: CollectedItem[] = [];
  const sourceStats: SourceStat[] = [];

  const results = await Promise.allSettled(SOURCES.map((s) => s.fetch()));

  results.forEach((result, i) => {
    const source = SOURCES[i];

    if (result.status === "rejected") {
      sourceStats.push({
        source: source.name,
        fetched: 0,
        keptAfterFilter: 0,
        error: String(result.reason),
      });
      return;
    }

    const raw = result.value;
    const filtered = source.requiresKeywordFilter
      ? raw.filter((item) => isSemiconductorRelated(`${item.title} ${item.description}`))
      : raw;

    for (const item of filtered) {
      items.push({ ...item, category: classifyItem(item) });
    }

    sourceStats.push({
      source: source.name,
      fetched: raw.length,
      keptAfterFilter: filtered.length,
      error: null,
    });
  });

  return { items, sourceStats };
}
