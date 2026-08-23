import { useState } from "react";
import type { NewsItem } from "../types";
import { NewsCard } from "./NewsCard";

type SortMode = "relevance" | "date";

function sortItems(items: NewsItem[], mode: SortMode): NewsItem[] {
  const copy = [...items];
  if (mode === "date") {
    return copy.sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }
  return copy.sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0));
}

export function CategorySection({
  title,
  items,
  initialCount = 6,
}: {
  title: string;
  items: NewsItem[];
  initialCount?: number;
}) {
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const sorted = sortItems(items, sortMode);
  const visible = expanded ? sorted : sorted.slice(0, initialCount);
  const hiddenCount = sorted.length - visible.length;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {title} <span className="text-sm font-normal text-slate-400">({items.length})</span>
        </h2>
        <div className="flex gap-1 rounded-md bg-slate-100 p-0.5 text-sm dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setSortMode("relevance")}
            className={`rounded px-2.5 py-1 ${
              sortMode === "relevance"
                ? "bg-white font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            관련도순
          </button>
          <button
            type="button"
            onClick={() => setSortMode("date")}
            className={`rounded px-2.5 py-1 ${
              sortMode === "date"
                ? "bg-white font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <NewsCard key={item.url} item={item} />
        ))}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full rounded-md border border-slate-200 bg-white py-2 text-sm text-slate-600 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          더보기 (+{hiddenCount})
        </button>
      )}
    </section>
  );
}
