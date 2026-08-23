import type { NewsItem } from "../types";

const SAMSUNG_HYNIX_KEYWORDS = ["삼성전자", "SK하이닉스", "삼전닉스", "하이닉스"];

export function isSamsungOrHynix(item: NewsItem): boolean {
  const text = `${item.title} ${item.summary ?? ""}`;
  return SAMSUNG_HYNIX_KEYWORDS.some((keyword) => text.includes(keyword));
}
