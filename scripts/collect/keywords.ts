// 삼성전자 메모리 사업부 공정기술 직무 관점에서의 관련 키워드 사전 (4절)
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
  "삼성전자",
  "SK하이닉스",
  "TSMC",
  "마이크론",
];

export function isSemiconductorRelated(text: string): boolean {
  const normalized = text.toLowerCase();
  return SEMICONDUCTOR_KEYWORDS.some((keyword) =>
    normalized.includes(keyword.toLowerCase())
  );
}
