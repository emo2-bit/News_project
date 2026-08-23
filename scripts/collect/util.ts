import dayjs from "dayjs";

/**
 * RSS pubDate를 ISO8601(+09:00)로 정규화한다.
 * 디일렉처럼 타임존 표기가 없는 "YYYY-MM-DD HH:mm:ss" 형식은 KST로 간주한다.
 */
export function normalizePublishedAt(pubDate: string | undefined): string {
  if (!pubDate) return dayjs().format();

  const hasOffset = /[+-]\d{2}:?\d{2}$|Z$/.test(pubDate.trim());
  if (hasOffset) {
    return dayjs(pubDate).format();
  }

  return dayjs(pubDate.trim().replace(" ", "T") + "+09:00").format();
}

export function stripHtml(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
