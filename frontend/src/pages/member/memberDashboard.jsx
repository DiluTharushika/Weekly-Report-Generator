import { Link } from "react-router-dom";

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
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${styles}`}>
      {status}
    </span>
  );
};

export default function MemberDashboard() {
  // Mock data for UI now (we will connect backend later)
  const recentReports = [
    { week: "2026-09-01 → 2026-09-07", project: "Internal Tooling", status: "Draft" },
    { week: "2026-08-25 → 2026-08-31", project: "Client A", status: "Needs Correction" },
    { week: "2026-08-18 → 2026-08-24", project: "R&D", status: "Approved" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Member Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create your weekly report and track approvals.
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
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="This Week" value="Draft" subtitle="Current report status" />
          <StatCard title="Reports Submitted" value="6" subtitle="Total submissions" />
          <StatCard title="Needs Correction" value="1" subtitle="Action required" />
          <StatCard title="Approved" value="4" subtitle="All-time approvals" />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Reports */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Recent Reports</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Quickly open and continue editing.
                </p>
              </div>
              <Link to="/member/history" className="text-sm text-blue-600 hover:underline">
                See all
              </Link>
            </div>

            <div className="border-t border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left font-medium px-5 py-3">Week</th>
                      <th className="text-left font-medium px-5 py-3">Project</th>
                      <th className="text-left font-medium px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentReports.map((r) => (
                      <tr key={r.week} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-slate-900">{r.week}</td>
                        <td className="px-5 py-3 text-slate-700">{r.project}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tips / Checklist */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">This Week Checklist</h2>
            <p className="text-sm text-slate-500 mt-1">
              Make sure your report is complete before submitting.
            </p>

            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-slate-700">Fill tasks completed table</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-slate-700">Add blockers (mark key issue if any)</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-slate-700">Add achievements (mark key highlight)</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-slate-700">Plan tasks for next week</span>
              </li>
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