import type { Category, RawItem } from "../types.js";

// 2차 확장(삼성 뉴스룸 등) 대비: 기업 뉴스룸 도메인은 "회사 발표"로 분류
const COMPANY_NEWSROOM_DOMAINS = ["news.samsung.com", "news.skhynix.com"];

const ETC_KEYWORDS = ["채용", "공고", "모집", "컨퍼런스", "세미나", "박람회", "전시회"];

export function classifyItem(raw: RawItem): Category {
  let domain = "";
  try {
    domain = new URL(raw.url).hostname;
  } catch {
    domain = "";
  }

  if (COMPANY_NEWSROOM_DOMAINS.some((d) => domain.includes(d))) {
    return "회사 발표";
  }

  const text = `${raw.title} ${raw.description}`;
  if (ETC_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return "기타";
  }

  return "기사";
}
