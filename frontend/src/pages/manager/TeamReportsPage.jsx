import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllReportsApi } from "../../api/reportApi.js";
import { getProjectsApi } from "../../api/projectApi.js";
import { getUsersApi } from "../../api/userApi.js";
import StatusBadge from "../../components/report/StatusBadge.jsx";
import { 
  FiFilter, 
  FiEye, 
  FiCheckSquare, 
  FiRefreshCw, 
  FiGrid, 
  FiAlertCircle, 
  FiAward, 
  FiChevronLeft, 
  FiChevronRight 
} from "react-icons/fi";

const ymd = (d) => new Date(d).toISOString().slice(0, 10);
const formatWeek = (weekStart, weekEnd) => `${ymd(weekStart)} → ${ymd(weekEnd)}`;

export default function TeamReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // filters
  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Bonus View Mode: "table" vs "side-by-side" (Compare Blockers & Achievements)
  const [viewMode, setViewMode] = useState("table");
  const [sideBySideSection, setSideBySideSection] = useState("blockers"); // "blockers" | "achievements"

  const [page, setPage] = useState(1);
  const limit = 10;

  const loadFilterData = async () => {
    try {
      const [pData, uData] = await Promise.all([
        getProjectsApi(),
        getUsersApi({ limit: 100 }),
      ]);
      setProjects(pData.projects || []);
      setUsers(uData.items || []);
    } catch {
      setProjects([]);
      setUsers([]);
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
      setError(err?.response?.data?.message || err.message || "Failed to load team reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterData();
  }, []);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, project, userId, from, to]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team Weekly Reports Hub</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter, review, and compare weekly progress reports across all team members & projects
          </p>
        </div>

        {/* View Mode Switcher (Bonus Feature) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiGrid /> Table List
          </button>
          <button
            onClick={() => setViewMode("side-by-side")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "side-by-side"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiAlertCircle /> Side-by-Side Comparison
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <FiFilter className="text-indigo-600" /> Filter Criteria
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value); }}
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Needs Correction">Needs Correction</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Team Member</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              value={userId}
              onChange={(e) => { setPage(1); setUserId(e.target.value); }}
            >
              <option value="">All Team Members</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Project Category</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              value={project}
              onChange={(e) => { setPage(1); setProject(e.target.value); }}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">From Date</label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              value={from}
              onChange={(e) => { setPage(1); setFrom(e.target.value); }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">To Date</label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              value={to}
              onChange={(e) => { setPage(1); setTo(e.target.value); }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <FiRefreshCw /> Reset Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* VIEW MODE 1: Standard Table View */}
      {viewMode === "table" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Team Submissions</h2>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              {total} Reports Found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="text-left font-semibold px-5 py-3.5">Week Cycle</th>
                  <th className="text-left font-semibold px-5 py-3.5">Team Member</th>
                  <th className="text-left font-semibold px-5 py-3.5">Project</th>
                  <th className="text-left font-semibold px-5 py-3.5">Status</th>
                  <th className="text-right font-semibold px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      Loading team reports...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      No team reports matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  items.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {formatWeek(r.weekStart, r.weekEnd)}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        <Link to={`/manager/users/${r.user?._id}`} className="hover:text-indigo-600 hover:underline">
                          {r.user?.name || "Unknown Member"}
                        </Link>
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
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 font-semibold transition-colors"
                            to={`/manager/reports/${r._id}/review`}
                          >
                            <FiCheckSquare className="text-sm" /> Review
                          </Link>
                          <Link
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                            to={`/reports/${r._id}`}
                          >
                            <FiEye className="text-sm" /> View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/40">
            <div className="text-xs text-slate-500 font-medium">
              Page <span className="font-bold text-slate-900">{page}</span> of <span className="font-bold text-slate-900">{totalPages}</span> ({total} Total)
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
        </div>
      )}

      {/* VIEW MODE 2: Side-by-Side Comparison View (Bonus Feature) */}
      {viewMode === "side-by-side" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Side-by-Side Team Section Comparison</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare Blockers or Achievements across all team members at a single glance
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSideBySideSection("blockers")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  sideBySideSection === "blockers"
                    ? "bg-amber-50 text-amber-800 border-amber-300 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <FiAlertCircle className="text-amber-600" /> Compare Blockers
              </button>
              <button
                onClick={() => setSideBySideSection("achievements")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  sideBySideSection === "achievements"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <FiAward className="text-emerald-600" /> Compare Achievements
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading side-by-side comparison...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No reports found to compare.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((r) => (
                <div key={r._id} className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{r.user?.name || "Unknown"}</div>
                        <div className="text-[11px] text-slate-500">{r.project?.name || "General"}</div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {sideBySideSection === "blockers" ? "Logged Blockers / Issues" : "Key Achievements"}
                      </div>

                      {sideBySideSection === "blockers" ? (
                        (r.blockers || []).length > 0 ? (
                          (r.blockers || []).map((b, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl border border-amber-200/80 bg-amber-50/40 text-xs text-slate-800">
                              <span className="font-semibold">{b.description}</span>
                              {b.isKeyIssue && <span className="ml-2 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold">Key Issue</span>}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">No blockers logged.</div>
                        )
                      ) : (
                        (r.achievements || []).length > 0 ? (
                          (r.achievements || []).map((a, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 text-xs text-slate-800">
                              <span className="font-semibold">{a.description}</span>
                              {a.isKeyAchievement && <span className="ml-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">Highlight</span>}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">No achievements logged.</div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{formatWeek(r.weekStart, r.weekEnd)}</span>
                    <Link to={`/manager/reports/${r._id}/review`} className="text-indigo-600 font-bold hover:underline">
                      Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}