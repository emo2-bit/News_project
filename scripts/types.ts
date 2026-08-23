export type Category = "기사" | "회사 발표" | "기타";

export interface RawItem {
  title: string;
  url: string;
  source: string;
  published_at: string;
  description: string;
}

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  category: Category;
  published_at: string;
  summary: string | null;
  relevance_score: number | null;
  relevant_tags: string[];
  ai_processed: boolean;
}

export interface NewsData {
  collected_at: string;
  items: NewsItem[];
}
