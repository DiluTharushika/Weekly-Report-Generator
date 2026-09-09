import { useState } from "react";
import {
  FiCheckSquare,
  FiAlertTriangle,
  FiAward,
  FiTarget,
  FiFileText,
  FiRotateCcw,
  FiCode,
  FiList,
  FiCheck,
} from "react-icons/fi";

const taskStatusStyle = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("done") || s.includes("complete"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s.includes("progress"))
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (s.includes("block") || s.includes("hold"))
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

export default function VersionSnapshotViewer({
  snapshot = {},
  versionNumber,
  isCurrent = false,
  canRestore = false,
  onRestore,
  restoring = false,
}) {
  const [showJson, setShowJson] = useState(false);

  const tasks = snapshot.tasksCompleted || [];
  const blockers = snapshot.blockers || [];
  const achievements = snapshot.achievements || [];
  const nextWeekPlans = snapshot.tasksPlannedNextWeek || [];
  const notes = snapshot.notes || "";

  return (
    <div className="space-y-4 pt-2">
      {/* Action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          {isCurrent ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-bold">
              <FiCheck className="text-xs" /> Active Version
            </span>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Archived Snapshot #{versionNumber}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJson(!showJson)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer
              border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {showJson ? <FiList className="text-sm" /> : <FiCode className="text-sm" />}
            {showJson ? "Structured View" : "View Raw JSON"}
          </button>

          {canRestore && !isCurrent && onRestore && (
            <button
              type="button"
              disabled={restoring}
              onClick={() => onRestore(versionNumber)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm disabled:opacity-50"
            >
              <FiRotateCcw className="text-sm" />
              {restoring ? "Restoring..." : "Restore This Version"}
            </button>
          )}
        </div>
      </div>

      {showJson ? (
        <pre className="overflow-x-auto rounded-xl bg-slate-950 text-slate-100 p-4 text-[11px] font-mono leading-relaxed">
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Tasks in snapshot */}
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <FiCheckSquare className="text-indigo-600" /> Tasks ({tasks.length})
            </div>
            {tasks.length === 0 ? (
              <div className="text-slate-400 italic">No tasks recorded in this version.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/60">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700/60">
                    <tr>
                      <th className="py-2 px-3">Task Name</th>
                      <th className="py-2 px-3">Priority</th>
                      <th className="py-2 px-3">Actual%</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {tasks.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {t.taskName}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{t.priority}</td>
                        <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                          {t.actualPercent}%
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${taskStatusStyle(
                              t.status
                            )}`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{t.timeSpent}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Blockers & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 bg-white dark:bg-slate-900">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <FiAlertTriangle className="text-amber-500" /> Blockers ({blockers.length})
              </div>
              {blockers.length === 0 ? (
                <div className="text-slate-400 italic">No blockers logged.</div>
              ) : (
                <ul className="space-y-1.5">
                  {blockers.map((b, idx) => (
                    <li
                      key={idx}
                      className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs"
                    >
                      {b.description}
                      {b.isKeyIssue && (
                        <span className="ml-1.5 font-bold text-[10px] uppercase bg-amber-200 dark:bg-amber-500/30 px-1.5 py-0.5 rounded">
                          Key Issue
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 bg-white dark:bg-slate-900">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <FiAward className="text-emerald-500" /> Highlights ({achievements.length})
              </div>
              {achievements.length === 0 ? (
                <div className="text-slate-400 italic">No highlights logged.</div>
              ) : (
                <ul className="space-y-1.5">
                  {achievements.map((a, idx) => (
                    <li
                      key={idx}
                      className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 text-xs"
                    >
                      {a.description}
                      {a.isKeyAchievement && (
                        <span className="ml-1.5 font-bold text-[10px] uppercase bg-emerald-200 dark:bg-emerald-500/30 px-1.5 py-0.5 rounded">
                          Key Highlight
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Next Week & Notes */}
          {(nextWeekPlans.length > 0 || notes) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {nextWeekPlans.length > 0 && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <FiTarget className="text-indigo-600" /> Next Week Plans
                  </div>
                  <ul className="space-y-1">
                    {nextWeekPlans.map((p, idx) => (
                      <li key={idx} className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {notes && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <FiFileText className="text-indigo-600" /> Notes
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{notes}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
