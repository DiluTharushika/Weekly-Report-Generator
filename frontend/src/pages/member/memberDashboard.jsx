import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyReportsApi } from "../../api/reportApi.js";

const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-400">{subtitle}</div>}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles =
    status === "Draft"
      ? "bg-slate-100 text-slate-700 border-slate-200"
      : status === "Submitted"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : status === "Needs Correction"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${styles}`}
    >
      {status}
    </span>
  );
};

const ymd = (d) => new Date(d).toISOString().slice(0, 10);

const formatWeek = (weekStart, weekEnd) => `${ymd(weekStart)} → ${ymd(weekEnd)}`;

// Choose "current week" start as Monday (simple approach)
const getThisWeekStart = () => {
  const now = new Date();
  const day = now.getDay(); // 0 Sun..6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // monday
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
      const data = await getMyReportsApi({ page: 1, limit: 20 }); // get more to compute stats
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
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Welcome{user?.name ? `, ${user.name}` : ""} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Week starting <span className="font-medium">{thisWeekStartStr}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/member/reports/new"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              + New Report
            </Link>
            <Link
              to="/member/history"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View History
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="This Week" value={stats.thisWeekStatus} subtitle="Current report status" />
          <StatCard title="Submitted" value={stats.submittedCount} subtitle="Reports waiting review" />
          <StatCard title="Needs Correction" value={stats.needsCorrectionCount} subtitle="Action required" />
          <StatCard title="Approved" value={stats.approvedCount} subtitle="Total approvals" />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Reports */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Recent Reports</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Open a report to view or continue editing.
                </p>
              </div>
              <Link to="/member/history" className="text-sm text-blue-600 hover:underline">
                See all
              </Link>
            </div>

            <div className="border-t border-slate-200">
              {loading ? (
                <div className="p-5 text-sm text-slate-600">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="text-left font-medium px-5 py-3">Week</th>
                        <th className="text-left font-medium px-5 py-3">Project</th>
                        <th className="text-left font-medium px-5 py-3">Status</th>
                        <th className="text-right font-medium px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {recentReports.map((r) => (
                        <tr key={r._id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 text-slate-900">
                            {formatWeek(r.weekStart, r.weekEnd)}
                          </td>
                          <td className="px-5 py-3 text-slate-700">{r.project?.name || "-"}</td>
                          <td className="px-5 py-3">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link to={`/reports/${r._id}`} className="text-blue-600 hover:underline">
                              View
                            </Link>
                            {(r.status === "Draft" || r.status === "Needs Correction") && (
                              <>
                                <span className="mx-2 text-slate-300">|</span>
                                <Link
                                  to={`/member/reports/${r._id}/edit`}
                                  className="text-slate-700 hover:underline"
                                >
                                  Edit
                                </Link>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}

                      {recentReports.length === 0 && (
                        <tr>
                          <td className="px-5 py-10 text-center text-slate-500" colSpan={4}>
                            No reports yet. Create your first weekly report.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Checklist</h2>
            <p className="text-sm text-slate-500 mt-1">
              Complete these sections before submitting.
            </p>

            <ul className="mt-4 space-y-3 text-sm">
              {[
                "Tasks completed table (planned vs actual)",
                "Next week plan",
                "Blockers (mark key issue)",
                "Achievements (mark key highlight)",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-slate-700">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <Link
                to="/member/reports/new"
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Start / Continue Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}