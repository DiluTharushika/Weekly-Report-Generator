import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummaryApi } from "../../api/dashboardApi.js";

const StatCard = ({ title, value, subtitle }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="text-sm text-slate-500">{title}</div>
    <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    {subtitle && <div className="mt-1 text-xs text-slate-400">{subtitle}</div>}
  </div>
);

const ymd = (d) => new Date(d).toISOString().slice(0, 10);

const getThisWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export default function ManagerDashboard() {
  const weekStart = useMemo(() => ymd(getThisWeekStart()), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDashboardSummaryApi({ weekStart });
      setSummary(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="p-2">Loading dashboard...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Manager Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">
            Week starting <span className="font-medium">{weekStart}</span>
          </p>
        </div>
        <Link
          to="/manager/reports"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Team Reports
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!summary ? (
        <div className="text-sm text-slate-600">No summary data.</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Reports"
              value={summary.totalReports}
              subtitle="Reports found for selected week"
            />
            <StatCard
              title="Compliance Rate"
              value={`${summary.complianceRate}%`}
              subtitle="Submitted/approved vs total"
            />
            <StatCard
              title="Needs Correction"
              value={summary.needsCorrectionCount}
              subtitle="Reports requiring updates"
            />
            <StatCard
              title="Open Blockers"
              value={summary.openBlockersCount}
              subtitle="Total blockers listed"
            />
          </div>

          {/* Status by member */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                Status by Member
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Simple overview (chart can be added next).
              </p>
            </div>

            <div className="p-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Member</th>
                    <th className="text-left font-medium px-3 py-2">Draft</th>
                    <th className="text-left font-medium px-3 py-2">Submitted</th>
                    <th className="text-left font-medium px-3 py-2">Needs Correction</th>
                    <th className="text-left font-medium px-3 py-2">Approved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {Object.entries(summary.statusByMember || {}).map(([name, s]) => (
                    <tr key={name}>
                      <td className="px-3 py-2 text-slate-900">{name}</td>
                      <td className="px-3 py-2 text-slate-700">{s["Draft"] || 0}</td>
                      <td className="px-3 py-2 text-slate-700">{s["Submitted"] || 0}</td>
                      <td className="px-3 py-2 text-slate-700">{s["Needs Correction"] || 0}</td>
                      <td className="px-3 py-2 text-slate-700">{s["Approved"] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {Object.keys(summary.statusByMember || {}).length === 0 && (
                <div className="text-sm text-slate-500">No member data.</div>
              )}
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
              <p className="text-sm text-slate-500 mt-1">
                Recent report updates.
              </p>
            </div>

            <div className="p-5">
              {(summary.recentReports || []).length === 0 ? (
                <div className="text-sm text-slate-500">No recent activity.</div>
              ) : (
                <div className="space-y-2">
                  {summary.recentReports.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {r.memberName} • {r.projectName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(r.updatedAt).toLocaleString()}
                        </div>
                      </div>

                      <Link
                        to={`/reports/${r.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}