// 삼성전자 메모리 사업부 공정기술 직무 관점에서의 관련 키워드 사전 (4절)
// 회사명("삼성전자", "SK하이닉스" 등)은 일부러 넣지 않는다 — 주주환원·가전
// 사업처럼 반도체와 무관한 기사까지 회사명만으로 걸려서 노이즈가 컸다.
// 실제로 반도체/공정 관련 기사라면 회사명이 있든 없든 아래 기술 용어가
// 본문에 함께 나온다.
export const SEMICONDUCTOR_KEYWORDS = [
  "반도체",
  "메모리",
  "파운드리",
  "D램",
  "DRAM",
  "낸드",
  "NAND",
  "웨이퍼",
  "HBM",
  "노광",
  "식각",
  "증착",
  "패키징",
  "EUV",
  "미세공정",
  "반도체 공정",
  "공정 기술",
  "8대 공정",
  "팹리스",
];

export function isSemiconductorRelated(text: string): boolean {
  const normalized = text.toLowerCase();
  return SEMICONDUCTOR_KEYWORDS.some((keyword) => normalized.includes(keyword.toLowerCase()));
}
