import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

const KST_OFFSET_MINUTES = 9 * 60;

/**
 * RSS pubDate를 ISO8601(+09:00)로 정규화한다.
 * 디일렉처럼 타임존 표기가 없는 "YYYY-MM-DD HH:mm:ss" 형식은 KST로 간주한다.
 * 실행 서버의 로컬 타임존(GitHub Actions는 UTC)에 좌우되지 않도록
 * 항상 +09:00 오프셋으로 명시해서 포맷한다.
 */
export function normalizePublishedAt(pubDate: string | undefined): string {
  if (!pubDate) return dayjs().utcOffset(KST_OFFSET_MINUTES).format();

  const hasOffset = /[+-]\d{2}:?\d{2}$|Z$/.test(pubDate.trim());
  if (hasOffset) {
    return dayjs(pubDate).utcOffset(KST_OFFSET_MINUTES).format();
  }

  return dayjs(pubDate.trim().replace(" ", "T") + "+09:00")
    .utcOffset(KST_OFFSET_MINUTES)
    .format();
}

export function stripHtml(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * AI 호출 비용을 통제하기 위해 본문을 고정 길이로 자른다.
 * ZDNet Korea처럼 RSS description에 전체 기사 본문(수천 자)이 들어오는
 * 소스가 있어서, 소스별 편차 없이 일정 길이로 맞춘다.
 */
export function truncate(text: string, maxLength = 300): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}
