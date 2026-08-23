import Parser from "rss-parser";
import type { RawItem } from "../../types.js";
import { normalizePublishedAt, stripHtml } from "../util.js";

const FEED_URL = "https://rss.etnews.com/Section901.xml";
const SOURCE_NAME = "전자신문";

export async function fetchEtnews(): Promise<RawItem[]> {
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
