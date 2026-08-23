const COLORS: Record<number, string> = {
  5: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  4: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  3: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  2: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  1: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

export function RelevanceBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        미평가
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${COLORS[score] ?? COLORS[1]}`}
    >
      관련도 {score}
    </span>
  );
}
