import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { getReportByIdApi, getReportVersionsApi } from "../../api/reportApi.js";
import StatusBadge from "../../components/report/StatusBadge.jsx";
import ManagerCommentBox from "../../components/report/ManagerCommentBox.jsx";

const ymd = (d) => new Date(d).toISOString().slice(0, 10);

const formatWeek = (weekStart, weekEnd) => `${ymd(weekStart)} → ${ymd(weekEnd)}`;

const Section = ({ title, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="px-5 py-4 border-b border-slate-200">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const KeyBadge = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
    {label}
  </span>
);

export default function ReportDetailPage() {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);

  const [loading, setLoading] = useState(true);
  const [loadingVersions, setLoadingVersions] = useState(true);
  const [error, setError] = useState("");

  const [report, setReport] = useState(null);
  const [versions, setVersions] = useState([]);
  const [openVersion, setOpenVersion] = useState(null);

  const isMember = user?.role === "member";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getReportByIdApi(id);
      setReport(data.report);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async () => {
    setLoadingVersions(true);
    try {
      const data = await getReportVersionsApi(id);
      setVersions(data.versions || []);
    } catch {
      // versions is bonus; ignore errors gracefully
      setVersions([]);
    } finally {
      setLoadingVersions(false);
    }
  };

  useEffect(() => {
    load();
    loadVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-6">Loading report...</div>;

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
        <div className="mt-4">
          <Link className="text-blue-600 hover:underline" to={isMember ? "/member/history" : "/manager"}>
            Go back
          </Link>
        </div>
      </div>
    );
  }

  if (!report) return <div className="p-6">Report not found.</div>;

  const canEdit = report.status === "Draft" || report.status === "Needs Correction";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Weekly Report
              </h1>
              <StatusBadge status={report.status} />
            </div>

            <div className="mt-2 text-sm text-slate-600">
              <span className="font-medium">Week:</span>{" "}
              {formatWeek(report.weekStart, report.weekEnd)}{" "}
              <span className="mx-2 text-slate-300">|</span>
              <span className="font-medium">Project:</span>{" "}
              {report.project?.name || "-"}
              {report.user?.name && (
                <>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="font-medium">Member:</span> {report.user.name}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMember && canEdit && (
              <Link
                to={`/member/reports/${report._id}/edit`}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Edit
              </Link>
            )}

            <Link
              to={isMember ? "/member/history" : "/manager"}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        {/* Manager comment */}
        {report.managerComment && <ManagerCommentBox comment={report.managerComment} />}

        {/* Tasks completed */}
        <Section title="Tasks Completed">
          {report.tasksCompleted?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Task</th>
                    <th className="text-left font-medium px-3 py-2">Priority</th>
                    <th className="text-left font-medium px-3 py-2">Planned%</th>
                    <th className="text-left font-medium px-3 py-2">Actual%</th>
                    <th className="text-left font-medium px-3 py-2">Status</th>
                    <th className="text-left font-medium px-3 py-2">Planned hrs</th>
                    <th className="text-left font-medium px-3 py-2">Spent hrs</th>
                    <th className="text-left font-medium px-3 py-2">Deliverable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.tasksCompleted.map((t, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="px-3 py-2 text-slate-900">{t.taskName}</td>
                      <td className="px-3 py-2 text-slate-700">{t.priority}</td>
                      <td className="px-3 py-2 text-slate-700">{t.plannedPercent}</td>
                      <td className="px-3 py-2 text-slate-700">{t.actualPercent}</td>
                      <td className="px-3 py-2 text-slate-700">{t.status}</td>
                      <td className="px-3 py-2 text-slate-700">{t.timePlanned}</td>
                      <td className="px-3 py-2 text-slate-700">{t.timeSpent}</td>
                      <td className="px-3 py-2 text-slate-700 whitespace-pre-wrap">
                        {t.deliverable || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-slate-500">No tasks completed added.</div>
          )}
        </Section>

        {/* Next week plan */}
        <Section title="Tasks Planned for Next Week">
          {report.tasksPlannedNextWeek?.length ? (
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              {report.tasksPlannedNextWeek.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-500">No plans added.</div>
          )}
        </Section>

        {/* Blockers + Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Section title="Blockers / Challenges">
            {report.blockers?.length ? (
              <div className="space-y-2">
                {report.blockers.map((b, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm text-slate-900 whitespace-pre-wrap">{b.description}</div>
                      {b.isKeyIssue && <KeyBadge label="Key issue" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No blockers added.</div>
            )}
          </Section>

          <Section title="Achievements / Highlights">
            {report.achievements?.length ? (
              <div className="space-y-2">
                {report.achievements.map((a, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm text-slate-900 whitespace-pre-wrap">{a.description}</div>
                      {a.isKeyAchievement && <KeyBadge label="Key highlight" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No achievements added.</div>
            )}
          </Section>
        </div>

        {/* Notes */}
        <Section title="Notes / Links">
          {report.notes ? (
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{report.notes}</div>
          ) : (
            <div className="text-sm text-slate-500">No notes.</div>
          )}
        </Section>

        {/* Versions (bonus) */}
        <Section title="Version History (submissions)">
          {loadingVersions ? (
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
                        submitted {new Date(v.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {openVersion === v._id ? "Hide" : "View"}
                    </div>
                  </button>

                  {openVersion === v._id && (
                    <div className="px-4 pb-4">
                      <div className="mt-2 text-xs text-slate-500">
                        Snapshot (simple view)
                      </div>
                      <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 text-slate-100 p-3 text-xs">
                        {JSON.stringify(v.snapshot, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}