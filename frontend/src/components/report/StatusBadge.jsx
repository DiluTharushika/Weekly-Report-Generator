export default function StatusBadge({ status }) {
  const styles =
    status === "Draft"
      ? "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600/60"
      : status === "Submitted"
      ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/40 font-semibold"
      : status === "Needs Correction"
      ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 font-semibold"
      : "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 font-semibold";

  const dot =
    status === "Draft" ? "bg-slate-400 dark:bg-slate-500" :
    status === "Submitted" ? "bg-blue-500 dark:bg-blue-400 animate-pulse" :
    status === "Needs Correction" ? "bg-amber-500 dark:bg-amber-400" :
    "bg-emerald-500 dark:bg-emerald-400";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
      {status}
    </span>
  );
}