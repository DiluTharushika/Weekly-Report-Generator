import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyReportsApi } from "../../api/reportApi.js";
import {
  FiPlus,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiSend,
  FiArrowRight,
  FiEye,
  FiEdit3,
} from "react-icons/fi";

/* ── Shared design tokens ── */
const cardCls =
  "rounded-2xl border shadow-sm transition-all " +
  "bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl " +
  "border-slate-200 dark:border-slate-800/80 " +
  "shadow-slate-100 dark:shadow-slate-950/50";

const StatCard = ({ title, value, subtitle, icon: Icon, accent, iconCls }) => (
  <div className={`${cardCls} p-5 relative overflow-hidden group hover:border-blue-200 dark:hover:border-slate-700/80`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
    <div className="relative flex items-center justify-between mb-3">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
      {Icon && (
        <div className={`p-2.5 rounded-xl ${iconCls}`}>
          <Icon className="text-lg" />
        </div>
      )}
    </div>
    <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{value}</div>
    {subtitle && <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">{subtitle}</div>}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles =
    status === "Draft"
      ? "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700/60"
      : status === "Submitted"
      ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30 font-semibold"
      : status === "Needs Correction"
      ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 font-semibold"
      : "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 font-semibold";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        status === "Draft" ? "bg-slate-400 dark:bg-slate-500" :
        status === "Submitted" ? "bg-blue-500 dark:bg-blue-400 animate-pulse" :
        status === "Needs Correction" ? "bg-amber-500 dark:bg-amber-400" : "bg-emerald-500 dark:bg-emerald-400"
      }`} />
      {status}
    </span>
  );
};

const ymd = (d) => new Date(d).toISOString().slice(0, 10);
const formatWeek = (weekStart, weekEnd) => `${ymd(weekStart)} → ${ymd(weekEnd)}`;

const getThisWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export default function MemberDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentReports, setRecentReports] = useState([]);

  const thisWeekStart = useMemo(() => getThisWeekStart(), []);
  const thisWeekStartStr = useMemo(() => ymd(thisWeekStart), [thisWeekStart]);

  const [stats, setStats] = useState({
    thisWeekStatus: "Not started",
    submittedCount: 0,
    needsCorrectionCount: 0,
    approvedCount: 0,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getMyReportsApi({ page: 1, limit: 20 });
        const all = data.items || [];
        setRecentReports(all.slice(0, 5));
        const thisWeek = all.find((r) => ymd(r.weekStart) === thisWeekStartStr);
        setStats({
          thisWeekStatus: thisWeek ? thisWeek.status : "Not started",
          submittedCount: all.filter((r) => r.status === "Submitted").length,
          needsCorrectionCount: all.filter((r) => r.status === "Needs Correction").length,
          approvedCount: all.filter((r) => r.status === "Approved").length,
        });
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden
        bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700
        dark:from-slate-950 dark:via-blue-950/50 dark:to-slate-950
        dark:border dark:border-blue-900/25">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-white/10 dark:bg-blue-600/15 blur-3xl" />
        <div className="absolute -bottom-8 left-1/4 h-48 w-48 rounded-full bg-indigo-300/20 dark:bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3
              bg-white/15 dark:bg-blue-500/15
              text-white dark:text-blue-300
              border border-white/20 dark:border-blue-500/25">
              <FiClock className="text-yellow-300 dark:text-blue-400" /> Active Cycle: Week of {thisWeekStartStr}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back{user?.name ? `, ${user.name}` : ""} 👋
            </h1>
            <p className="text-blue-100 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Keep your team aligned by submitting weekly progress, logging blockers, and noting achievements.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/member/reports/new"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer
                bg-white/20 hover:bg-white/30 border border-white/30
                dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 dark:border-0 dark:shadow-blue-500/25 dark:hover:from-blue-500 dark:hover:to-indigo-500"
            >
              <FiPlus className="text-base" /> New Report
            </Link>
            <Link
              to="/member/history"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer
                bg-blue-800/40 hover:bg-blue-800/60 text-blue-50 border border-blue-400/30
                dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700/60 dark:text-slate-200"
            >
              View History <FiArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Cycle" value={stats.thisWeekStatus} subtitle="This week's status"
          icon={FiFileText} accent="from-blue-500/5 dark:from-blue-500/5" iconCls="bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400" />
        <StatCard title="Pending Review" value={stats.submittedCount} subtitle="Reports under review"
          icon={FiSend} accent="from-blue-500/5 dark:from-blue-500/5" iconCls="bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400" />
        <StatCard title="Needs Action" value={stats.needsCorrectionCount} subtitle="Requires revision"
          icon={FiAlertTriangle} accent="from-amber-500/5 dark:from-amber-500/5" iconCls="bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400" />
        <StatCard title="Approved" value={stats.approvedCount} subtitle="Approved reports"
          icon={FiCheckCircle} accent="from-emerald-500/5 dark:from-emerald-500/5" iconCls="bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions Table */}
        <div className={`${cardCls} lg:col-span-2 overflow-hidden flex flex-col`}>
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">Recent Submissions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overview of your latest weekly report statuses</p>
            </div>
            <Link to="/member/history" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
              See all <FiArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">Loading recent reports...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/60">
                    <tr>
                      <th className="text-left font-semibold px-5 py-3.5 uppercase tracking-wider">Week Period</th>
                      <th className="text-left font-semibold px-5 py-3.5 uppercase tracking-wider">Project</th>
                      <th className="text-left font-semibold px-5 py-3.5 uppercase tracking-wider">Status</th>
                      <th className="text-right font-semibold px-5 py-3.5 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {recentReports.map((r) => (
                      <tr key={r._id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-200">{formatWeek(r.weekStart, r.weekEnd)}</td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">{r.project?.name || "General"}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/reports/${r._id}`}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                              title="View Details"
                            >
                              <FiEye className="text-sm" />
                            </Link>
                            {(r.status === "Draft" || r.status === "Needs Correction") && (
                              <Link
                                to={`/member/reports/${r._id}/edit`}
                                className="p-1.5 rounded-lg border border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                                title="Edit Report"
                              >
                                <FiEdit3 className="text-sm" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {recentReports.length === 0 && (
                      <tr>
                        <td className="px-5 py-12 text-center text-slate-400 dark:text-slate-500" colSpan={4}>
                          No weekly reports filed yet. Click "New Report" to begin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Submission Checklist */}
        <div className={`${cardCls} p-5 flex flex-col justify-between`}>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">Submission Checklist</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Best practices for manager review</p>

            <ul className="mt-5 space-y-3 text-xs">
              {[
                { title: "Log Completed Tasks", desc: "Compare planned vs actual % progress" },
                { title: "Plan Ahead", desc: "List next week's focus areas clearly" },
                { title: "Flag Blockers", desc: "Mark key issues needing manager aid" },
                { title: "Highlight Wins", desc: "Document key achievements" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-600 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-sm shadow-blue-600/20 dark:shadow-blue-500/20">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <Link
              to="/member/reports/new"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all shadow-md
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20
                dark:from-blue-600 dark:to-indigo-600 dark:shadow-blue-500/20 dark:hover:from-blue-500 dark:hover:to-indigo-500"
            >
              Start / Continue Weekly Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}