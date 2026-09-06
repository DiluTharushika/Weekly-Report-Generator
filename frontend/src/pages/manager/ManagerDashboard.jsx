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
} from "react-icons/fi";

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

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // No weekStart passed => backend returns ALL-TIME totals across every report
      const data = await getDashboardSummaryApi({});
      setSummary(data);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReview = async (reportId, status) => {
    setReviewing(true);
    setReviewError("");
    try {
      await reviewReportApi(reportId, { status, managerComment: reviewComment });
      setSelectedReportId(null);
      setReviewComment("");
      await load();
    } catch (err) {
      setReviewError(err?.response?.data?.message || err.message || "Failed to submit review");
    } finally {
      setReviewing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading Manager Dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <FiClock /> All-Time Team Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Review & Analytics Hub 📊
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Track every team submission, monitor progress charts, and appraise deliverables — across all weeks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
              <div className="text-xs text-slate-300 font-medium">Compliance Rate</div>
              <div className="text-xl font-black text-emerald-400">{summary?.complianceRate || 0}%</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {!summary ? (
        <div className="text-xs text-slate-500">No summary data available.</div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Reports
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><FiFileText className="text-base" /></div>
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900">{summary.totalReports || 0}</div>
              <div className="mt-1 text-xs text-slate-400">All reports, all time</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pending Review
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><FiClock className="text-base" /></div>
              </div>
              <div className="mt-3 text-2xl font-black text-blue-600">{summary.submittedCount || 0}</div>
              <div className="mt-1 text-xs text-slate-400">Awaiting manager appraisal</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Needs Correction
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><FiAlertTriangle className="text-base" /></div>
              </div>
              <div className="mt-3 text-2xl font-black text-amber-600">{summary.needsCorrectionCount || 0}</div>
              <div className="mt-1 text-xs text-slate-400">Requires revisions</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Approved
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><FiCheckCircle className="text-base" /></div>
              </div>
              <div className="mt-3 text-2xl font-black text-emerald-600">{summary.approvedCount || 0}</div>
              <div className="mt-1 text-xs text-slate-400">Approved deliverables</div>
            </div>
          </div>

          {/* Interactive Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <FiBarChart2 className="text-indigo-600" /> Member Status Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Distribution of report lifecycle states across team members
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <StatusByMemberChart statusByMember={summary.statusByMember} />
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <FiPieChart className="text-indigo-600" /> Team Status Ratio
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Overall percentage breakdown of submissions
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <StatusPieChart summary={summary} />
              </div>
            </div>
          </div>

          {/* Recent Submissions Review Feed */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Submissions Review</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Appraise recent team reports or request corrections directly
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3.5">Team Member</th>
                    <th className="text-left font-semibold px-5 py-3.5">Project</th>
                    <th className="text-left font-semibold px-5 py-3.5">Status</th>
                    <th className="text-left font-semibold px-5 py-3.5">Last Updated</th>
                    <th className="text-right font-semibold px-5 py-3.5">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(summary.recentReports || []).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {r.memberName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">
                        {r.projectName}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {new Date(r.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/reports/${r.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                          >
                            <FiEye className="text-sm" /> View Details
                          </Link>

                          <button
                            onClick={() => setSelectedReportId(selectedReportId === r.id ? null : r.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 font-medium transition-colors cursor-pointer"
                          >
                            <FiMessageSquare className="text-sm" /> Review
                          </button>
                        </div>

                        {selectedReportId === r.id && (
                          <div className="mt-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 text-left space-y-3">
                            <div className="text-xs font-semibold text-slate-800">
                              Appraise Report for {r.memberName}
                            </div>
                            
                            {reviewError && (
                              <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                                {reviewError}
                              </div>
                            )}

                            <textarea
                              rows={2}
                              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="Add appraisal feedback or reasons for correction..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                            />

                            <div className="flex items-center gap-2">
                              <button
                                disabled={reviewing}
                                onClick={() => handleReview(r.id, "Approved")}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                              >
                                <FiCheck className="text-sm" /> Approve
                              </button>

                              <button
                                disabled={reviewing}
                                onClick={() => handleReview(r.id, "Needs Correction")}
                                className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50 cursor-pointer"
                              >
                                <FiXCircle className="text-sm" /> Request Correction
                              </button>

                              <button
                                onClick={() => setSelectedReportId(null)}
                                className="text-xs text-slate-500 hover:underline ml-auto"
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
                      <td className="px-5 py-12 text-center text-slate-400" colSpan={5}>
                        No activity found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}