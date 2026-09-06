import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getReportByIdApi,
  getReportVersionsApi,
  reviewReportApi,
} from "../../api/reportApi.js";

import StatusBadge from "../../components/report/StatusBadge.jsx";
import ManagerCommentBox from "../../components/report/ManagerCommentBox.jsx";
import { 
  FiCheck, 
  FiXCircle, 
  FiArrowLeft, 
  FiEye, 
  FiMessageSquare, 
  FiClock, 
  FiAlertTriangle 
} from "react-icons/fi";

const ymd = (d) => new Date(d).toISOString().slice(0, 10);
const formatWeek = (weekStart, weekEnd) => `${ymd(weekStart)} → ${ymd(weekEnd)}`;

export default function ReviewReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [report, setReport] = useState(null);

  const [versionsLoading, setVersionsLoading] = useState(true);
  const [versions, setVersions] = useState([]);
  const [openVersion, setOpenVersion] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getReportByIdApi(id);
      setReport(data.report);
      setComment(data.report?.managerComment || "");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async () => {
    setVersionsLoading(true);
    try {
      const data = await getReportVersionsApi(id);
      setVersions(data.versions || []);
    } catch {
      setVersions([]);
    } finally {
      setVersionsLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const approve = async () => {
    setActionLoading(true);
    setError("");
    try {
      await reviewReportApi(id, { status: "Approved", managerComment: comment });
      await load();
      navigate(`/reports/${id}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const requestChanges = async () => {
    if (!comment.trim()) {
      setError("Please provide feedback notes explaining what needs correction.");
      return;
    }
    setActionLoading(true);
    setError("");
    try {
      await reviewReportApi(id, { status: "Needs Correction", managerComment: comment });
      await load();
      navigate(`/reports/${id}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Request changes failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading weekly report for appraisal...</div>;

  if (error && !report) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
        <Link className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600" to="/manager/reports">
          <FiArrowLeft /> Back to Team Reports
        </Link>
      </div>
    );
  }

  if (!report) return <div className="p-8 text-center text-xs text-slate-400">Report not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manager Appraisal Portal</h1>
            <StatusBadge status={report.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submitted by <span className="font-semibold text-slate-900">{report.user?.name}</span> ({report.user?.email}) for project <span className="font-semibold text-slate-900">{report.project?.name}</span> ({formatWeek(report.weekStart, report.weekEnd)})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/reports/${id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FiEye className="text-sm" /> Full Detail
          </Link>
          <Link
            to="/manager/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FiArrowLeft className="text-sm" /> Back
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Review Action Form Card */}
      <div className="rounded-2xl border border-indigo-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FiMessageSquare className="text-indigo-600 text-lg" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Appraisal Feedback & Action</h2>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Manager Notes / Correction Guidance
          </label>
          <textarea
            className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add appraisal notes or describe what revisions are needed..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            disabled={actionLoading}
            onClick={approve}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <FiCheck className="text-base" /> {actionLoading ? "Processing..." : "Approve Report"}
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={requestChanges}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <FiXCircle className="text-base" /> {actionLoading ? "Processing..." : "Request Changes"}
          </button>
        </div>
      </div>

      {/* Snapshot / Version History Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FiClock className="text-indigo-600" /> Version Snapshot History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical audit log of submitted revisions
            </p>
          </div>
        </div>

        <div className="p-5">
          {versionsLoading ? (
            <div className="text-xs text-slate-400 text-center py-4">Loading version history...</div>
          ) : versions.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-4">No historical versions snapshot recorded.</div>
          ) : (
            <div className="space-y-3">
              {versions.map((v) => (
                <div key={v._id} className="rounded-xl border border-slate-200/80 bg-slate-50/50 overflow-hidden">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-100/60 transition-colors cursor-pointer"
                    onClick={() => setOpenVersion(openVersion === v._id ? null : v._id)}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>Version #{v.versionNumber}</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        Submitted: {new Date(v.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-indigo-600">
                      {openVersion === v._id ? "Collapse Snapshot" : "View Snapshot"}
                    </div>
                  </button>

                  {openVersion === v._id && (
                    <div className="px-4 pb-4 border-t border-slate-200/60 pt-3">
                      <pre className="overflow-x-auto rounded-xl bg-slate-950 text-slate-100 p-4 text-[11px] font-mono leading-relaxed">
                        {JSON.stringify(v.snapshot, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}