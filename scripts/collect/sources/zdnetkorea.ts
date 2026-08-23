import Parser from "rss-parser";
import type { RawItem } from "../../types.js";
import { normalizePublishedAt, stripHtml } from "../util.js";

// ZDNet Korea는 반도체 전용 섹션 RSS가 더 이상 제공되지 않아(2026-08 확인),
// 전체기사 피드를 받아 키워드로 필터링한다.
const FEED_URL = "https://zdnet.co.kr/feed";
const SOURCE_NAME = "ZDNet Korea";

export async function fetchZdnetKorea(): Promise<RawItem[]> {
  const parser = new Parser();
  const feed = await parser.parseURL(FEED_URL);

  return (feed.items ?? []).map((item) => ({
    title: stripHtml(item.title),
    url: item.link ?? "",
    source: SOURCE_NAME,
    published_at: normalizePublishedAt(item.pubDate),
    description: stripHtml(item.contentSnippet ?? item.content),
  }));
}
