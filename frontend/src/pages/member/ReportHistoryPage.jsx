import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReportsApi } from "../../api/reportApi.js";
import { FiPlus, FiEye, FiEdit3, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

const formatWeek = (weekStart, weekEnd) => {
  const s = new Date(weekStart).toISOString().slice(0, 10);
  const e = new Date(weekEnd).toISOString().slice(0, 10);
  return `${s} → ${e}`;
};

export default function ReportHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const fetchData = async (p) => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyReportsApi({ page: p, limit });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Report History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete archive of your submitted and draft weekly progress reports
          </p>
        </div>

        <Link
          to="/member/reports/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors shrink-0"
        >
          <FiPlus className="text-base" /> New Report
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Main Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your report history...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3.5">Week Cycle</th>
                    <th className="text-left font-semibold px-5 py-3.5">Project</th>
                    <th className="text-left font-semibold px-5 py-3.5">Current Status</th>
                    <th className="text-right font-semibold px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((r) => (
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                          >
                            <FiEye className="text-sm" /> View
                          </Link>
                          {(r.status === "Draft" || r.status === "Needs Correction") && (
                            <Link
                              to={`/member/reports/${r._id}/edit`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 font-medium transition-colors"
                            >
                              <FiEdit3 className="text-sm" /> Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td className="px-5 py-12 text-center text-slate-400" colSpan={4}>
                        No weekly reports found. Create your first report to start tracking progress.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/40">
              <div className="text-xs text-slate-500 font-medium">
                Showing Page <span className="font-bold text-slate-900">{page}</span> of <span className="font-bold text-slate-900">{totalPages}</span> ({total} Total Reports)
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <FiChevronLeft /> Prev
                </button>
                <button
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <FiChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}