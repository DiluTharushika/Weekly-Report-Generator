import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProjectsApi } from "../../api/projectApi.js";
import { getReportByIdApi, updateReportApi, submitReportApi } from "../../api/reportApi.js";
import ReportFormWizard from "../../components/report/ReportFormWizard.jsx";

const ymd = (d) => new Date(d).toISOString().slice(0, 10);

const listToText = (arr) => (arr || []).map((x) => `- ${x}`).join("\n");

const textToList = (text) =>
  (text || "")
    .split("\n")
    .map((x) => x.replace(/^- /, "").trim())
    .filter(Boolean);

export default function EditReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [projects, setProjects] = useState([]);

  const [reportMeta, setReportMeta] = useState({
    status: "",
    managerComment: "",
  });

  const [form, setForm] = useState({
    project: "",
    categoryTag: "",
    weekStart: "",
    weekEnd: "",

    tasksCompleted: [],
    tasksPlannedText: "",

    blockers: [],
    achievements: [],

    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [projectsRes, reportRes] = await Promise.all([
        getProjectsApi(),
        getReportByIdApi(id),
      ]);

      setProjects(projectsRes.projects || []);

      const r = reportRes.report;

      setReportMeta({
        status: r.status,
        managerComment: r.managerComment || "",
      });

      setForm({
        project: r.project?._id || r.project || "",
        categoryTag: r.categoryTag || "",
        weekStart: ymd(r.weekStart),
        weekEnd: ymd(r.weekEnd),

        tasksCompleted: r.tasksCompleted || [],
        tasksPlannedText: listToText(r.tasksPlannedNextWeek || []),

        blockers: r.blockers || [],
        achievements: r.achievements || [],

        notes: r.notes || "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const buildPayload = () => ({
    project: form.project,
    categoryTag: form.categoryTag,
    weekStart: form.weekStart,
    weekEnd: form.weekEnd,
    tasksCompleted: form.tasksCompleted,
    tasksPlannedNextWeek: textToList(form.tasksPlannedText),
    blockers: form.blockers,
    achievements: form.achievements,
    notes: form.notes,
  });

  const onSaveDraft = async () => {
    setSaving(true);
    setError("");
    try {
      await updateReportApi(id, buildPayload());
      await loadData(); // refresh status/comment if changed
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const onSubmitForReview = async () => {
    setSaving(true);
    setError("");
    try {
      // ensure latest content saved
      await updateReportApi(id, buildPayload());

      // submit
      await submitReportApi(id);

      navigate(`/reports/${id}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to submit");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading report...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Edit Weekly Report
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Status: <span className="font-medium">{reportMeta.status}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/member/history")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to History
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <ReportFormWizard
          mode="edit"
          status={reportMeta.status}
          managerComment={reportMeta.managerComment}
          projects={projects}
          form={form}
          setForm={setForm}
          onSaveDraft={onSaveDraft}
          onSubmitForReview={onSubmitForReview}
          saving={saving}
        />
      </div>
    </div>
  );
}