import type { NewsItem } from "../types";
import { RelevanceBadge } from "./RelevanceBadge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">{item.source}</span>
        <span>{formatDate(item.published_at)}</span>
      </div>

      <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
        {item.title}
      </h3>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        {item.ai_processed
          ? item.summary
          : "AI 요약 준비 중입니다. 원문 링크를 확인해주세요."}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
        <RelevanceBadge score={item.relevance_score} />
        {item.relevant_tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>
    </a>
  );
}
