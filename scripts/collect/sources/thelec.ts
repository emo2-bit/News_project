import Parser from "rss-parser";
import type { RawItem } from "../../types.js";
import { normalizePublishedAt, stripHtml } from "../util.js";

const FEED_URL = "https://www.thelec.kr/rss/allArticle.xml";
const SOURCE_NAME = "디일렉";

export async function fetchThelec(): Promise<RawItem[]> {
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
