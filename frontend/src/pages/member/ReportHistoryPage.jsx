import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReportsApi } from "../../api/reportApi.js";

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
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Report History
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your weekly reports and their current review status.
            </p>
          </div>
          <Link
            to="/member/reports/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            + New Report
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {loading && <div className="p-4 text-slate-600">Loading...</div>}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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
                  {items.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-slate-900">
                        {formatWeek(r.weekStart, r.weekEnd)}
                      </td>
                      <td className="px-5 py-3 text-slate-700">
                        {r.project?.name || "-"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/reports/${r._id}`}
                          className="text-blue-600 hover:underline"
                        >
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

                  {items.length === 0 && (
                    <tr>
                      <td className="px-5 py-10 text-center text-slate-500" colSpan={4}>
                        No reports yet. Create your first weekly report.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Page {page} of {totalPages} • Total {total}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </button>
                <button
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}