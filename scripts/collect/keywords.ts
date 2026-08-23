// 삼성전자 메모리 사업부 공정기술 직무 관점에서의 관련 키워드 사전 (4절)
// 반도체/공정 기술 용어. 하나라도 있어야 "반도체 얘기"로 인정한다.
export const CORE_KEYWORDS = [
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

// 삼성전자·SK하이닉스와 해외에서 직접 거래(경쟁·고객·장비 공급)하는 대기업만
// 남긴다. 국내 소부장/중소 협력사(티씨케이, 해치텍 등)는 반도체 용어가 있어도
// 어차피 다 읽을 수 없어서 의도적으로 제외한다.
export const MAJOR_COMPANY_KEYWORDS = [
  "삼성전자",
  "SK하이닉스",
  // 파운드리/메모리 경쟁사
  "TSMC",
  "마이크론",
  "Micron",
  "인텔",
  "Intel",
  // 주요 고객사
  "엔비디아",
  "Nvidia",
  "퀄컴",
  "Qualcomm",
  "애플",
  "AMD",
  // 주요 장비 공급사
  "ASML",
  "어플라이드머티리얼즈",
  "Applied Materials",
  "램리서치",
  "Lam Research",
  "도쿄일렉트론",
  "Tokyo Electron",
  "KLA",
];

export function isSemiconductorRelated(text: string): boolean {
  const normalized = text.toLowerCase();
  const hasCore = CORE_KEYWORDS.some((keyword) => normalized.includes(keyword.toLowerCase()));
  const hasMajorCompany = MAJOR_COMPANY_KEYWORDS.some((keyword) =>
    normalized.includes(keyword.toLowerCase())
  );
  return hasCore && hasMajorCompany;
}
