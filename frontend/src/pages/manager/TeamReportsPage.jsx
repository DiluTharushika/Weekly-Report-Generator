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
  FiChevronRight,
} from "react-icons/fi";

/* ── Shared design tokens ── */
const cardCls =
  "rounded-2xl border shadow-sm transition-all " +
  "bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl " +
  "border-slate-200 dark:border-slate-800/80 " +
  "shadow-slate-100 dark:shadow-slate-950/50";

const selectCls =
  "w-full rounded-xl border px-3 py-2 text-xs outline-none transition-all cursor-pointer " +
  "bg-white dark:bg-slate-900/80 " +
  "border-slate-200 dark:border-slate-700/80 " +
  "text-slate-800 dark:text-slate-200 " +
  "focus:border-blue-500 dark:focus:border-yellow-500";

const inputCls =
  "w-full rounded-xl border px-3 py-2 text-xs outline-none transition-all " +
  "bg-white dark:bg-slate-900/80 " +
  "border-slate-200 dark:border-slate-700/80 " +
  "text-slate-800 dark:text-slate-200 " +
  "focus:border-blue-500 dark:focus:border-yellow-500";

const ymd = (d) => new Date(d).toISOString().slice(0, 10);
const formatWeek = (weekStart, weekEnd) => `${ymd(weekStart)} → ${ymd(weekEnd)}`;

export default function TeamReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [viewMode, setViewMode] = useState("table");
  const [sideBySideSection, setSideBySideSection] = useState("blockers");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    (async () => {
      try {
        const [pData, uData] = await Promise.all([getProjectsApi(), getUsersApi({ limit: 100 })]);
        setProjects(pData.projects || []);
        setUsers(uData.items || []);
      } catch {
        setProjects([]); setUsers([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true); setError("");
      try {
        const data = await getAllReportsApi({
          page, limit,
          status: status || undefined, project: project || undefined,
          user: userId || undefined, from: from || undefined, to: to || undefined,
        });
        setItems(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load team reports");
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, project, userId, from, to]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const resetFilters = () => { setStatus(""); setProject(""); setUserId(""); setFrom(""); setTo(""); setPage(1); };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Team Weekly Reports Hub</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Filter, review, and compare weekly progress reports across all team members & projects
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl shrink-0
          bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          {[
            { mode: "table", icon: FiGrid, label: "Table List" },
            { mode: "side-by-side", icon: FiAlertCircle, label: "Side-by-Side" },
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === mode
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-yellow-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <div className={cardCls + " p-5 space-y-4"}>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          <FiFilter className="text-blue-500 dark:text-yellow-400" /> Filter Criteria
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
            <select className={selectCls} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Needs Correction">Needs Correction</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Team Member</label>
            <select className={selectCls} value={userId} onChange={(e) => { setPage(1); setUserId(e.target.value); }}>
              <option value="">All Team Members</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Project</label>
            <select className={selectCls} value={project} onChange={(e) => { setPage(1); setProject(e.target.value); }}>
              <option value="">All Projects</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">From Date</label>
            <input type="date" className={inputCls} value={from} onChange={(e) => { setPage(1); setFrom(e.target.value); }} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">To Date</label>
            <input type="date" className={inputCls} value={to} onChange={(e) => { setPage(1); setTo(e.target.value); }} />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-1.5 text-xs font-semibold cursor-pointer transition-all
              border-slate-200 dark:border-slate-700
              text-slate-600 dark:text-slate-300
              bg-white dark:bg-slate-800/60
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600
              dark:hover:bg-slate-800 dark:hover:border-slate-600"
          >
            <FiRefreshCw /> Reset Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* ── VIEW: Table ── */}
      {viewMode === "table" && (
        <div className={cardCls + " overflow-hidden"}>
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">Team Submissions</h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold
              bg-slate-100 dark:bg-slate-800/80
              text-slate-600 dark:text-slate-300
              border border-slate-200 dark:border-slate-700/60">
              {total} Reports Found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/80
                bg-slate-50 dark:bg-slate-950/60">
                <tr>
                  {["Week Cycle", "Team Member", "Project", "Status", "Actions"].map((h, i) => (
                    <th key={h} className={`font-semibold px-5 py-3.5 uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">Loading team reports...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">No team reports matching the filter criteria.</td></tr>
                ) : items.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">{formatWeek(r.weekStart, r.weekEnd)}</td>
                    <td className="px-5 py-3.5 font-semibold">
                      <Link
                        to={`/manager/users/${r.user?._id}`}
                        className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                      >
                        {r.user?.name || "Unknown Member"}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">{r.project?.name || "General"}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                            border border-blue-300 dark:border-blue-500/40
                            text-blue-600 dark:text-blue-400
                            bg-blue-50 dark:bg-blue-500/10
                            hover:bg-blue-100 dark:hover:bg-blue-500/20"
                          to={`/manager/reports/${r._id}/review`}
                        >
                          <FiCheckSquare className="text-sm" /> Review
                        </Link>
                        <Link
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                            border border-slate-200 dark:border-slate-700
                            text-slate-600 dark:text-slate-400
                            bg-white dark:bg-slate-800/60
                            hover:bg-slate-100 dark:hover:bg-slate-800
                            hover:border-slate-300 dark:hover:border-slate-600"
                          to={`/reports/${r._id}`}
                        >
                          <FiEye className="text-sm" /> View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800/80
            bg-slate-50/60 dark:bg-slate-950/40">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Page <span className="font-bold text-slate-800 dark:text-slate-200">{page}</span> of{" "}
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span> ({total} Total)
            </div>
            <div className="flex gap-2">
              {[
                { label: <><FiChevronLeft /> Prev</>, disabled: page <= 1, fn: () => setPage((p) => p - 1) },
                { label: <>Next <FiChevronRight /></>, disabled: page >= totalPages, fn: () => setPage((p) => p + 1) },
              ].map(({ label, disabled, fn }, i) => (
                <button
                  key={i}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all disabled:opacity-40
                    border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60
                    text-slate-700 dark:text-slate-300
                    hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600
                    dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  disabled={disabled} onClick={fn}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW: Side-by-Side Comparison ── */}
      {viewMode === "side-by-side" && (
        <div className={cardCls + " p-6 space-y-6"}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">Side-by-Side Team Section Comparison</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Compare Blockers or Achievements across all team members at a single glance</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSideBySideSection("blockers")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  sideBySideSection === "blockers"
                    ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 shadow-sm"
                    : "bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <FiAlertCircle className={sideBySideSection === "blockers" ? "text-amber-500 dark:text-amber-400" : "text-slate-400"} />
                Compare Blockers
              </button>
              <button
                onClick={() => setSideBySideSection("achievements")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  sideBySideSection === "achievements"
                    ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 shadow-sm"
                    : "bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <FiAward className={sideBySideSection === "achievements" ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400"} />
                Compare Achievements
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">Loading side-by-side comparison...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">No reports found to compare.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((r) => (
                <div
                  key={r._id}
                  className="rounded-2xl border p-4 space-y-3 flex flex-col justify-between transition-all hover:shadow-md
                    bg-slate-50 dark:bg-slate-800/50
                    border-slate-200 dark:border-slate-700/60
                    hover:border-blue-200 dark:hover:border-slate-600"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2.5 mb-3">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">{r.user?.name || "Unknown"}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{r.project?.name || "General"}</div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>

                    {/* Section label */}
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2
                      text-slate-400 dark:text-slate-500">
                      {sideBySideSection === "blockers" ? "⚠ Logged Blockers" : "★ Key Achievements"}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      {sideBySideSection === "blockers" ? (
                        (r.blockers || []).length > 0 ? (
                          (r.blockers || []).map((b, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl border text-xs
                              border-amber-200 dark:border-amber-500/30
                              bg-amber-50 dark:bg-amber-500/10
                              text-slate-800 dark:text-slate-200">
                              <span className="font-semibold">{b.description}</span>
                              {b.isKeyIssue && (
                                <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold
                                  bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400">
                                  Key Issue
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 dark:text-slate-500 italic">No blockers logged.</div>
                        )
                      ) : (
                        (r.achievements || []).length > 0 ? (
                          (r.achievements || []).map((a, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl border text-xs
                              border-emerald-200 dark:border-emerald-500/30
                              bg-emerald-50 dark:bg-emerald-500/10
                              text-slate-800 dark:text-slate-200">
                              <span className="font-semibold">{a.description}</span>
                              {a.isKeyAchievement && (
                                <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold
                                  bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                  Highlight
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 dark:text-slate-500 italic">No achievements logged.</div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">{formatWeek(r.weekStart, r.weekEnd)}</span>
                    <Link
                      to={`/manager/reports/${r._id}/review`}
                      className="font-bold transition-colors text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
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