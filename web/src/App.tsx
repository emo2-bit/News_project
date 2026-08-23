import { useEffect, useState } from "react";
import type { NewsData } from "./types";
import { CategorySection } from "./components/CategorySection";
import { isSamsungOrHynix } from "./lib/companyMatch";

function formatCollectedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [data, setData] = useState<NewsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("./data/news.json")
      .then((res) => {
        if (!res.ok) throw new Error(`데이터를 불러오지 못했습니다 (${res.status})`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(String(err)));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            반도체 뉴스 스크랩
          </h1>
          {data && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              마지막 수집: {formatCollectedAt(data.collected_at)}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!data && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400">불러오는 중...</p>
        )}
        {data && (
          <>
            <CategorySection
              title="삼성전자 · SK하이닉스"
              items={data.items.filter(
                (item) => item.category !== "기타" && isSamsungOrHynix(item)
              )}
            />
            <CategorySection
              title="기타 반도체 기업"
              items={data.items.filter(
                (item) => item.category !== "기타" && !isSamsungOrHynix(item)
              )}
            />
            <CategorySection
              title="기타"
              items={data.items.filter((item) => item.category === "기타")}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
