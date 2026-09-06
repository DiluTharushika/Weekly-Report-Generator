import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiEdit2,
  FiCalendar,
  FiFolder,
  FiUser,
  FiCheckSquare,
  FiTarget,
  FiAlertTriangle,
  FiAward,
  FiFileText,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiTrendingUp,
  FiStar,
} from "react-icons/fi";

import { getReportByIdApi, getReportVersionsApi } from "../../api/reportApi.js";
import StatusBadge from "../../components/report/StatusBadge.jsx";
import ManagerCommentBox from "../../components/report/ManagerCommentBox.jsx";

const ymd = (d) => new Date(d).toISOString().slice(0, 10);
const formatWeek = (weekStart, weekEnd) => `${ymd(weekStart)} → ${ymd(weekEnd)}`;

const Section = ({ title, icon, children, right }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
        {icon && <span className="text-indigo-600">{icon}</span>}
        {title}
      </h2>
      {right}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const KeyBadge = ({ label }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
    ★ {label}
  </span>
);

const EmptyState = ({ text }) => (
  <div className="text-sm text-slate-400 italic py-2">{text}</div>
);

const taskStatusStyle = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("done") || s.includes("complete"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s.includes("progress"))
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (s.includes("block") || s.includes("hold"))
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

/** Quick-glance stat card, used in the overview strip */
const StatCard = ({ icon, label, value, sub, gradient }) => (
  <div
    className={`rounded-2xl p-5 text-white shadow-lg relative overflow-hidden ${gradient}`}
  >
    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
          {label}
        </span>
        <span className="text-white/90 text-base">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-black">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-white/75">{sub}</div>}
    </div>
  </div>
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

  // Quick-glance stats, derived from the report — safe against missing/empty arrays
  const stats = useMemo(() => {
    if (!report) return null;

    const tasks = report.tasksCompleted || [];
    const blockers = report.blockers || [];
    const achievements = report.achievements || [];

    const totalTasks = tasks.length;
    const avgActual =
      totalTasks > 0
        ? Math.round(
            tasks.reduce((sum, t) => sum + (Number(t.actualPercent) || 0), 0) / totalTasks
          )
        : 0;

    const keyBlocker = blockers.find((b) => b.isKeyIssue);
    const keyAchievement = achievements.find((a) => a.isKeyAchievement);

    return {
      totalTasks,
      avgActual,
      blockerCount: blockers.length,
      keyBlockerText: keyBlocker?.description || null,
      achievementCount: achievements.length,
      keyAchievementText: keyAchievement?.description || null,
    };
  }, [report]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-400">Loading report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto mt-10 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
        <div className="max-w-2xl mx-auto mt-4">
          <Link
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
            to={isMember ? "/member/history" : "/manager"}
          >
            <FiArrowLeft /> Go back
          </Link>
        </div>
      </div>
    );
  }

  if (!report) return <div className="p-6">Report not found.</div>;

  const canEdit = report.status === "Draft" || report.status === "Needs Correction";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Gradient hero header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Weekly Report
                </h1>
                <StatusBadge status={report.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <FiCalendar className="text-indigo-300" />
                  {formatWeek(report.weekStart, report.weekEnd)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiFolder className="text-indigo-300" />
                  {report.project?.name || "-"}
                </span>
                {report.user?.name && (
                  <span className="inline-flex items-center gap-1.5">
                    <FiUser className="text-indigo-300" />
                    {report.user.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isMember && canEdit && (
                <Link
                  to={`/member/reports/${report._id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <FiEdit2 className="text-sm" /> Edit Report
                </Link>
              )}

              <Link
                to={isMember ? "/member/history" : "/manager"}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors backdrop-blur-xs"
              >
                <FiArrowLeft className="text-sm" /> Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        {/* Quick-glance overview strip */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<FiCheckSquare />}
              label="Tasks Completed"
              value={stats.totalTasks}
              sub="logged this week"
              gradient="bg-gradient-to-br from-indigo-600 to-indigo-800"
            />
            <StatCard
              icon={<FiTrendingUp />}
              label="Avg. Completion"
              value={`${stats.avgActual}%`}
              sub="across all tasks"
              gradient="bg-gradient-to-br from-blue-600 to-blue-800"
            />
            <StatCard
              icon={<FiAlertTriangle />}
              label="Blockers"
              value={stats.blockerCount}
              sub={stats.keyBlockerText ? "1 flagged as key issue" : "none flagged"}
              gradient="bg-gradient-to-br from-amber-500 to-orange-700"
            />
            <StatCard
              icon={<FiAward />}
              label="Achievements"
              value={stats.achievementCount}
              sub={stats.keyAchievementText ? "1 flagged as highlight" : "none flagged"}
              gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
            />
          </div>
        )}

        {/* Key issue / key achievement callouts, only if present */}
        {(stats?.keyBlockerText || stats?.keyAchievementText) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stats.keyBlockerText && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                  <FiAlertTriangle />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <FiStar className="text-[10px]" /> Key issue this week
                  </div>
                  <div className="mt-1 text-sm text-amber-900">{stats.keyBlockerText}</div>
                </div>
              </div>
            )}

            {stats.keyAchievementText && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <FiAward />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <FiStar className="text-[10px]" /> Key highlight this week
                  </div>
                  <div className="mt-1 text-sm text-emerald-900">{stats.keyAchievementText}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {report.managerComment && <ManagerCommentBox comment={report.managerComment} />}

        {/* Tasks completed */}
        <Section title="Tasks Completed" icon={<FiCheckSquare />}>
          {report.tasksCompleted?.length ? (
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <th className="py-2.5 pr-4">Task</th>
                    <th className="py-2.5 pr-4">Priority</th>
                    <th className="py-2.5 pr-4">Planned%</th>
                    <th className="py-2.5 pr-4">Actual%</th>
                    <th className="py-2.5 pr-4">Status</th>
                    <th className="py-2.5 pr-4">Planned hrs</th>
                    <th className="py-2.5 pr-4">Spent hrs</th>
                    <th className="py-2.5">Deliverable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.tasksCompleted.map((t, idx) => (
                    <tr key={idx} className="align-top hover:bg-slate-50/60">
                      <td className="py-3 pr-4 font-semibold text-slate-900">{t.taskName}</td>
                      <td className="py-3 pr-4 text-slate-600">{t.priority}</td>
                      <td className="py-3 pr-4 text-slate-600">{t.plannedPercent}%</td>
                      <td className="py-3 pr-4 text-slate-600">{t.actualPercent}%</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${taskStatusStyle(
                            t.status
                          )}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{t.timePlanned}</td>
                      <td className="py-3 pr-4 text-slate-600">{t.timeSpent}</td>
                      <td className="py-3 text-slate-600 whitespace-pre-wrap">
                        {t.deliverable || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState text="No tasks completed added." />
          )}
        </Section>

        {/* Next week plan */}
        <Section title="Tasks Planned for Next Week" icon={<FiTarget />}>
          {report.tasksPlannedNextWeek?.length ? (
            <ul className="space-y-2">
              {report.tasksPlannedNextWeek.map((x, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {x}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="No plans added." />
          )}
        </Section>

        {/* Blockers + Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Section title="Blockers / Challenges" icon={<FiAlertTriangle />}>
            {report.blockers?.length ? (
              <div className="space-y-2.5">
                {report.blockers.map((b, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-3.5 ${
                      b.isKeyIssue
                        ? "border-indigo-200 bg-indigo-50/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm text-slate-800 whitespace-pre-wrap">
                        {b.description}
                      </div>
                      {b.isKeyIssue && <KeyBadge label="Key issue" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="No blockers added." />
            )}
          </Section>

          <Section title="Achievements / Highlights" icon={<FiAward />}>
            {report.achievements?.length ? (
              <div className="space-y-2.5">
                {report.achievements.map((a, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-3.5 ${
                      a.isKeyAchievement
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm text-slate-800 whitespace-pre-wrap">
                        {a.description}
                      </div>
                      {a.isKeyAchievement && <KeyBadge label="Key highlight" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="No achievements added." />
            )}
          </Section>
        </div>

        {/* Notes */}
        <Section title="Notes / Links" icon={<FiFileText />}>
          {report.notes ? (
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{report.notes}</div>
          ) : (
            <EmptyState text="No notes." />
          )}
        </Section>

        {/* Version history */}
        <Section
          title="Version History"
          icon={<FiLayers />}
          right={
            !loadingVersions && (
              <span className="text-xs text-slate-400">
                {versions.length} submission{versions.length === 1 ? "" : "s"}
              </span>
            )
          }
        >
          {loadingVersions ? (
            <div className="text-sm text-slate-500">Loading versions...</div>
          ) : versions.length === 0 ? (
            <EmptyState text="No versions found." />
          ) : (
            <div className="space-y-2.5">
              {versions.map((v) => {
                const isOpen = openVersion === v._id;
                return (
                  <div
                    key={v._id}
                    className="rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      className="w-full text-left px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      onClick={() => setOpenVersion(isOpen ? null : v._id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">
                          v{v.versionNumber}
                        </span>
                        <div className="text-sm">
                          <div className="font-semibold text-slate-900">
                            Version {v.versionNumber}
                          </div>
                          <div className="text-xs text-slate-500 inline-flex items-center gap-1 mt-0.5">
                            <FiClock className="text-slate-400" />
                            {new Date(v.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-slate-400">
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4">
                        <div className="mt-1 mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                          Snapshot
                        </div>
                        <pre className="overflow-x-auto rounded-xl bg-slate-950 text-slate-100 p-3.5 text-xs leading-relaxed">
                          {JSON.stringify(v.snapshot, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}