import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllReportsApi } from "../../api/reportApi.js";
import { getProjectsApi } from "../../api/projectApi.js";
import StatusBadge from "../../components/report/StatusBadge.jsx";

const ymd = (d) => new Date(d).toISOString().slice(0, 10);

const formatWeek = (weekStart, weekEnd) => `${ymd(weekStart)} → ${ymd(weekEnd)}`;

export default function TeamReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [projects, setProjects] = useState([]);

  // filters
  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [userId, setUserId] = useState(""); // optional for later
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const loadProjects = async () => {
    try {
      const data = await getProjectsApi();
      setProjects(data.projects || []);
    } catch {
      setProjects([]);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllReportsApi({
        page,
        limit,
        status: status || undefined,
        project: project || undefined,
        user: userId || undefined,
        from: from || undefined,
        to: to || undefined,
      });

      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, project, userId, from, to]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      {/* Header row inside layout */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Team Reports</h2>
          <p className="text-sm text-slate-500">
            Filter and open any report to review.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">Status</label>
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value); }}
            >
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Needs Correction">Needs Correction</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Project</label>
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={project}
              onChange={(e) => { setPage(1); setProject(e.target.value); }}
            >
              <option value="">All</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">From</label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={from}
              onChange={(e) => { setPage(1); setFrom(e.target.value); }}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">To</label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={to}
              onChange={(e) => { setPage(1); setTo(e.target.value); }}
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setStatus("");
                setProject("");
                setUserId("");
                setFrom("");
                setTo("");
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left font-medium px-4 py-3">Week</th>
                <th className="text-left font-medium px-4 py-3">Member</th>
                <th className="text-left font-medium px-4 py-3">Project</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">
                      {formatWeek(r.weekStart, r.weekEnd)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{r.user?.name || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{r.project?.name || "-"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        className="text-blue-600 hover:underline"
                        to={`/manager/reports/${r._id}/review`}
                      >
                        Review
                      </Link>
                      <span className="mx-2 text-slate-300">|</span>
                      <Link className="text-slate-700 hover:underline" to={`/reports/${r._id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
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
    </div>
  );
}