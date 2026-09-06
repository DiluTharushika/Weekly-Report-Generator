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
  FiEdit3 
} from "react-icons/fi";

const StatCard = ({ title, value, subtitle, icon: Icon, badgeColor }) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${badgeColor}`}>
            <Icon className="text-lg" />
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl font-black text-slate-900 tracking-tight">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</div>}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles =
    status === "Draft"
      ? "bg-slate-100 text-slate-700 border-slate-200"
      : status === "Submitted"
      ? "bg-blue-50 text-blue-700 border-blue-200/80 font-semibold"
      : status === "Needs Correction"
      ? "bg-amber-50 text-amber-800 border-amber-200/80 font-semibold"
      : "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        status === "Draft" ? "bg-slate-400" :
        status === "Submitted" ? "bg-blue-500 animate-pulse" :
        status === "Needs Correction" ? "bg-amber-500" : "bg-emerald-500"
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

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyReportsApi({ page: 1, limit: 20 });
      setRecentReports((data.items || []).slice(0, 5));
      return data.items || [];
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load dashboard");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const [stats, setStats] = useState({
    thisWeekStatus: "Not started",
    submittedCount: 0,
    needsCorrectionCount: 0,
    approvedCount: 0,
  });

  useEffect(() => {
    (async () => {
      const all = await fetchDashboard();

      const submittedCount = all.filter((r) => r.status === "Submitted").length;
      const needsCorrectionCount = all.filter((r) => r.status === "Needs Correction").length;
      const approvedCount = all.filter((r) => r.status === "Approved").length;

      const thisWeek = all.find((r) => ymd(r.weekStart) === thisWeekStartStr);
      const thisWeekStatus = thisWeek ? thisWeek.status : "Not started";

      setStats({
        thisWeekStatus,
        submittedCount,
        needsCorrectionCount,
        approvedCount,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <FiClock /> Active Cycle: Week of {thisWeekStartStr}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back{user?.name ? `, ${user.name}` : ""} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Keep your team aligned by submitting weekly progress, logging blockers, and noting achievements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/member/reports/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-blue-500 transition-all cursor-pointer"
            >
              <FiPlus className="text-base" /> New Report
            </Link>
            <Link
              to="/member/history"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer backdrop-blur-xs"
            >
              View History <FiArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Cycle"
          value={stats.thisWeekStatus}
          subtitle="This week's status"
          icon={FiFileText}
          badgeColor="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Pending Review"
          value={stats.submittedCount}
          subtitle="Reports under review"
          icon={FiSend}
          badgeColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Needs Action"
          value={stats.needsCorrectionCount}
          subtitle="Requires revision"
          icon={FiAlertTriangle}
          badgeColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Approved"
          value={stats.approvedCount}
          subtitle="Approved reports"
          icon={FiCheckCircle}
          badgeColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Submissions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of your latest weekly report statuses
              </p>
            </div>
            <Link to="/member/history" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              See all <FiArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading recent reports...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="text-left font-semibold px-5 py-3.5">Week Period</th>
                      <th className="text-left font-semibold px-5 py-3.5">Project</th>
                      <th className="text-left font-semibold px-5 py-3.5">Status</th>
                      <th className="text-right font-semibold px-5 py-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentReports.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {formatWeek(r.weekStart, r.weekEnd)}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 font-medium">
                          {r.project?.name || "General"}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/reports/${r._id}`}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              title="View Details"
                            >
                              <FiEye className="text-sm" />
                            </Link>
                            {(r.status === "Draft" || r.status === "Needs Correction") && (
                              <Link
                                to={`/member/reports/${r._id}/edit`}
                                className="p-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 transition-colors"
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
                        <td className="px-5 py-12 text-center text-slate-400" colSpan={4}>
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

        {/* Reporting Guide Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Submission Checklist</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Best practices for manager review
            </p>

            <ul className="mt-5 space-y-3 text-xs">
              {[
                { title: "Log Completed Tasks", desc: "Compare planned vs actual % progress" },
                { title: "Plan Ahead", desc: "List next week's focus areas clearly" },
                { title: "Flag Blockers", desc: "Mark key issues needing manager aid" },
                { title: "Highlight Wins", desc: "Document key achievements" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/member/reports/new"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2.5 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              Start / Continue Weekly Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}