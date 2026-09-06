import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getReportByIdApi,
  getReportVersionsApi,
  reviewReportApi,
} from "../../api/reportApi.js";

import StatusBadge from "../../components/report/StatusBadge.jsx";
import ManagerCommentBox from "../../components/report/ManagerCommentBox.jsx";

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
      await reviewReportApi(id, { action: "APPROVE" });
      await load();
      navigate(`/reports/${id}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const requestChanges = async () => {
    setActionLoading(true);
    setError("");
    try {
      await reviewReportApi(id, { action: "REQUEST_CHANGES", comment });
      await load();
      navigate(`/reports/${id}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Request changes failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (error) {
    return (
      <div className="p-6 space-y-3">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
        <Link className="text-blue-600 hover:underline" to="/manager/reports">
          Back to Team Reports
        </Link>
      </div>
    );
  }

  if (!report) return <div className="p-6">Report not found.</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Review Report</h2>
            <StatusBadge status={report.status} />
          </div>
          <p className="text-sm text-slate-600 mt-1">
            <span className="font-medium">{report.user?.name}</span> •{" "}
            {report.project?.name} •{" "}
            {formatWeek(report.weekStart, report.weekEnd)}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/reports/${id}`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View Full
          </Link>
          <Link
            to="/manager/reports"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Warning if not Submitted */}
      {report.status !== "Submitted" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This report is currently <b>{report.status}</b>. Only <b>Submitted</b> reports can be reviewed.
        </div>
      )}

      {/* Manager comment */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-base font-semibold text-slate-900">Request Changes Comment</h3>
        <p className="text-sm text-slate-500 mt-1">
          If you request changes, write one general comment for the member.
        </p>

        <textarea
          className="mt-3 w-full min-h-[120px] rounded-xl border border-slate-300 px-3 py-2.5"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe what needs correction..."
        />

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            disabled={actionLoading || report.status !== "Submitted"}
            onClick={approve}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {actionLoading ? "Working..." : "Approve"}
          </button>

          <button
            type="button"
            disabled={actionLoading || report.status !== "Submitted"}
            onClick={requestChanges}
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {actionLoading ? "Working..." : "Request Changes"}
          </button>
        </div>
      </div>

      {/* Versions */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Version History</h3>
          <p className="text-sm text-slate-500 mt-1">
            Past submissions snapshots (bonus).
          </p>
        </div>

        <div className="p-5">
          {versionsLoading ? (
            <div className="text-sm text-slate-600">Loading versions...</div>
          ) : versions.length === 0 ? (
            <div className="text-sm text-slate-500">No versions found.</div>
          ) : (
            <div className="space-y-2">
              {versions.map((v) => (
                <div key={v._id} className="rounded-xl border border-slate-200">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50"
                    onClick={() => setOpenVersion(openVersion === v._id ? null : v._id)}
                  >
                    <div className="text-sm font-medium text-slate-900">
                      Version #{v.versionNumber}
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        {new Date(v.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {openVersion === v._id ? "Hide" : "View"}
                    </div>
                  </button>

                  {openVersion === v._id && (
                    <div className="px-4 pb-4">
                      <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 text-slate-100 p-3 text-xs">
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

      {/* Current manager comment display */}
      {report.managerComment && <ManagerCommentBox comment={report.managerComment} />}
    </div>
  );
}