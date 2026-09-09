import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDashboardSummaryApi } from "../../api/dashboardApi.js";
import { reviewReportApi } from "../../api/reportApi.js";

import StatusByMemberChart from "../../components/dashboard/StatusByMemberChart.jsx";
import StatusPieChart from "../../components/dashboard/StatusPieChart.jsx";

import {
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiPieChart,
  FiBarChart2,
  FiEye,
  FiMessageSquare,
  FiCheck,
  FiXCircle,
  FiCalendar,
  FiLayers,
} from "react-icons/fi";

/* ─── helpers ─── */
const ymd = (d) => new Date(d).toISOString().slice(0, 10);

const formatWeek = (weekStart, weekEnd) => {
  if (!weekStart) return "-";
  const s = new Date(weekStart).toISOString().slice(0, 10);
  const e = weekEnd ? new Date(weekEnd).toISOString().slice(0, 10) : "";
  return e ? `${s} → ${e}` : s;
};

/* ─── Local StatusBadge ─── */
const StatusBadge = ({ status }) => {
  const styles =
    status === "Draft"
      ? "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700/60"
      : status === "Submitted"
      ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/30 font-semibold"
      : status === "Needs Correction"
      ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 font-semibold"
      : "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 font-semibold";

  const dot =
    status === "Draft"
      ? "bg-slate-400 dark:bg-slate-500"
      : status === "Submitted"
      ? "bg-blue-500 dark:bg-blue-400 animate-pulse"
      : status === "Needs Correction"
      ? "bg-amber-500 dark:bg-amber-400"
      : "bg-emerald-500 dark:bg-emerald-400";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

/* ─── Metric Card ─── */
const MetricCard = ({ label, value, sub, iconBg, iconColor, icon: Icon, valueCls }) => (
  <div className="rounded-2xl border p-5 shadow-sm transition-all group hover:shadow-md relative overflow-hidden
    bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl
    border-slate-200 dark:border-slate-800/80
    shadow-slate-100 dark:shadow-slate-950/50
    hover:border-blue-200 dark:hover:border-slate-700/80">
    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3
      text-slate-500 dark:text-slate-400">
      {label}
      <div className={`p-2 rounded-xl ${iconBg}`}>
        <Icon className={`text-base ${iconColor}`} />
      </div>
    </div>
    <div className={`text-2xl font-black ${valueCls}`}>{value}</div>
    <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">{sub}</div>
  </div>
);

/* ─── Card wrapper ─── */
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border shadow-sm
    bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl
    border-slate-200 dark:border-slate-800/80
    shadow-slate-100 dark:shadow-slate-950/50
    ${className}`}
  >
    {children}
  </div>
);

export default function ManagerDashboard() {
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);

  // inline review UI state
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const load = async (weekToLoad = selectedWeek) => {
    setLoading(true);
    setError("");
    try {
      const params = weekToLoad && weekToLoad !== "all" ? { weekStart: weekToLoad } : {};
      const data = await getDashboardSummaryApi(params);
      setSummary(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("all");
  }, []);

  const handleWeekChange = (newWeek) => {
    setSelectedWeek(newWeek);
    load(newWeek);
  };

  // ✅ Correct review payload for backend
  const handleReview = async (reportId, action) => {
    setReviewing(true);
    setReviewError("");
    try {
      if (action === "APPROVE") {
        await reviewReportApi(reportId, {
          status: "Approved",
          managerComment: reviewComment.trim() || "Approved",
        });
      } else {
        if (!reviewComment.trim()) {
          setReviewError("Comment is required when requesting changes.");
          setReviewing(false);
          return;
        }
        await reviewReportApi(reportId, {
          status: "Needs Correction",
          managerComment: reviewComment.trim(),
        });
      }

      setSelectedReportId(null);
      setReviewComment("");
      await load(selectedWeek);
    } catch (err) {
      setReviewError(err?.response?.data?.message || err.message || "Failed to submit review");
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
          <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden
        bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700
        dark:from-slate-950 dark:via-blue-950/60 dark:to-slate-950
        dark:border dark:border-blue-900/30">
        <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-white/10 dark:bg-blue-600/15 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-300/20 dark:bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
              bg-white/15 dark:bg-blue-500/15
              text-white dark:text-blue-300
              border border-white/20 dark:border-blue-500/25">
              <FiClock className="text-yellow-300 dark:text-blue-400" />
              {selectedWeek === "all" ? "All Time Overview" : `Cycle: Week of ${selectedWeek}`}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Review & Analytics Hub
            </h1>
            <p className="text-blue-100 dark:text-slate-400 text-xs sm:text-sm max-w-xl">
              {selectedWeek === "all"
                ? "Aggregated metrics across all submitted weekly reports, blockers, and approvals."
                : `Week starting ${selectedWeek} — monitor submissions, blockers, and approvals.`}
            </p>

            {/* Week Filter Selector */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-200 dark:text-slate-300 flex items-center gap-1.5">
                <FiCalendar className="text-yellow-300 dark:text-blue-400" /> Cycle:
              </span>
              <select
                value={selectedWeek}
                onChange={(e) => handleWeekChange(e.target.value)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer transition-all
                  bg-white/20 dark:bg-slate-900/90 text-white dark:text-slate-100
                  border border-white/30 dark:border-slate-700
                  backdrop-blur-md shadow-sm"
              >
                <option value="all" className="bg-slate-900 text-white">All Time (All Reports)</option>
                {(summary?.availableWeeks || []).map((w) => (
                  <option key={w} value={w} className="bg-slate-900 text-white">
                    Week of {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="px-5 py-4 rounded-2xl text-center min-w-[140px]
              bg-white/15 dark:bg-blue-500/10
              border border-white/20 dark:border-blue-500/25">
              <div className="text-xs text-blue-100 dark:text-slate-400 font-medium">
                Compliance Rate
              </div>
              <div className="text-2xl font-black text-white dark:text-blue-400 mt-0.5">
                {summary?.complianceRate || 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {!summary ? (
        <div className="text-xs text-slate-400">No summary data available.</div>
      ) : (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total Reports"
              value={summary.totalReports || 0}
              sub={selectedWeek === "all" ? "Total reports recorded" : "Reports found for selected week"}
              iconBg="bg-blue-100 dark:bg-blue-500/15"
              iconColor="text-blue-600 dark:text-blue-400"
              icon={FiFileText}
              valueCls="text-slate-900 dark:text-slate-100"
            />
            <MetricCard
              label="Submitted"
              value={summary.submittedCount || 0}
              sub="Awaiting review"
              iconBg="bg-blue-100 dark:bg-blue-500/15"
              iconColor="text-blue-600 dark:text-blue-400"
              icon={FiClock}
              valueCls="text-blue-600 dark:text-blue-400"
            />
            <MetricCard
              label="Needs Correction"
              value={summary.needsCorrectionCount || 0}
              sub="Requires revisions"
              iconBg="bg-amber-100 dark:bg-amber-500/15"
              iconColor="text-amber-600 dark:text-amber-400"
              icon={FiAlertTriangle}
              valueCls="text-amber-600 dark:text-amber-400"
            />
            <MetricCard
              label="Approved"
              value={summary.approvedCount || 0}
              sub="Approved reports"
              iconBg="bg-emerald-100 dark:bg-emerald-500/15"
              iconColor="text-emerald-600 dark:text-emerald-400"
              icon={FiCheckCircle}
              valueCls="text-emerald-600 dark:text-emerald-400"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7 p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                    <FiBarChart2 className="text-blue-600 dark:text-blue-400" /> Member Status Breakdown
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Distribution of report lifecycle states across team members
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <StatusByMemberChart statusByMember={summary.statusByMember} />
              </div>
            </Card>

            <Card className="lg:col-span-5 p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                    <FiPieChart className="text-blue-600 dark:text-blue-400" /> Team Status Ratio
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Overall percentage breakdown of submissions
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <StatusPieChart summary={summary} />
              </div>
            </Card>
          </div>

          {/* Recent submissions */}
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Recent Submissions
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  View reports and review submitted ones.
                </p>
              </div>
              <Link
                to="/manager/reports"
                className="text-xs font-semibold text-blue-600 dark:text-blue-300 hover:underline"
              >
                Open Team Reports →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400">
                  <tr>
                    {["Team Member", "Project", "Cycle", "Status", "Last Updated", "Actions"].map((h, i) => (
                      <th
                        key={h}
                        className={`font-semibold px-5 py-3.5 uppercase tracking-wider ${
                          i === 5 ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {(summary.recentReports || []).map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                        {r.memberName}
                      </td>
                      <td className="px-5 py-3.5 font-medium">
                        <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: r.projectColor || "#3B82F6" }}
                          />
                          {r.projectName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                        {formatWeek(r.weekStart, r.weekEnd)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">
                        {new Date(r.updatedAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/reports/${r.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                              border border-slate-200 dark:border-slate-700
                              text-slate-600 dark:text-slate-300
                              bg-white dark:bg-slate-800/60
                              hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                          >
                            <FiEye className="text-sm" /> View
                          </Link>

                          {/* only allow review when status is Submitted */}
                          {r.status === "Submitted" && (
                            <button
                              onClick={() =>
                                setSelectedReportId(selectedReportId === r.id ? null : r.id)
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
                                border border-blue-300 dark:border-blue-500/30
                                bg-blue-50 dark:bg-blue-500/10
                                text-blue-700 dark:text-blue-300
                                hover:bg-blue-100 dark:hover:bg-blue-500/20"
                            >
                              <FiMessageSquare className="text-sm" /> Review
                            </button>
                          )}
                        </div>

                        {/* Inline Review Panel */}
                        {selectedReportId === r.id && (
                          <div className="mt-3 p-4 rounded-xl border text-left space-y-3
                            border-blue-200 dark:border-slate-700/60
                            bg-blue-50/80 dark:bg-slate-800/50">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              Review report for {r.memberName}
                            </div>

                            {reviewError && (
                              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                                {reviewError}
                              </div>
                            )}

                            <textarea
                              rows={2}
                              className="w-full rounded-lg border px-3 py-2 text-xs resize-none outline-none transition-all
                                border-blue-200 dark:border-slate-700
                                bg-white dark:bg-slate-900/80
                                text-slate-800 dark:text-slate-200
                                placeholder-slate-400 dark:placeholder-slate-600
                                focus:border-blue-500 dark:focus:border-blue-500
                                focus:ring-2 focus:ring-blue-500/15"
                              placeholder="Comment required for Request Changes..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                            />

                            <div className="flex items-center gap-2">
                              <button
                                disabled={reviewing}
                                onClick={() => handleReview(r.id, "APPROVE")}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 transition-all shadow-sm
                                  bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 cursor-pointer"
                              >
                                <FiCheck /> Approve
                              </button>

                              <button
                                disabled={reviewing}
                                onClick={() => handleReview(r.id, "REQUEST_CHANGES")}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 transition-all shadow-sm
                                  bg-amber-500 hover:bg-amber-400 shadow-amber-500/20 cursor-pointer"
                              >
                                <FiXCircle /> Want to Change
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedReportId(null);
                                  setReviewComment("");
                                  setReviewError("");
                                }}
                                className="text-xs text-slate-400 dark:text-slate-500 hover:underline ml-auto cursor-pointer"
                                type="button"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {(summary.recentReports || []).length === 0 && (
                    <tr>
                      <td className="px-5 py-12 text-center text-slate-400 dark:text-slate-500" colSpan={6}>
                        No activity found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}