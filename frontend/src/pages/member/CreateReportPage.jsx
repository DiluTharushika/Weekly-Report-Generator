import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectsApi } from "../../api/projectApi.js";
import { createReportApi, submitReportApi } from "../../api/reportApi.js";
import ReportFormWizard from "../../components/report/ReportFormWizard.jsx";

const ymd = (d) => new Date(d).toISOString().slice(0, 10);

const getThisWeekRange = () => {
  const now = new Date();
  const day = now.getDay(); // 0..6
  const diff = (day === 0 ? -6 : 1) - day; // Monday
  const start = new Date(now);
  start.setDate(now.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(0, 0, 0, 0);

  return { start, end };
};

const textToList = (text) =>
  (text || "")
    .split("\n")
    .map((x) => x.replace(/^- /, "").trim())
    .filter(Boolean);

export default function CreateReportPage() {
  const navigate = useNavigate();

  const { start, end } = useMemo(() => getThisWeekRange(), []);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    project: "",
    categoryTag: "",
    weekStart: ymd(start),
    weekEnd: ymd(end),

    tasksCompleted: [],
    tasksPlannedText: "",

    blockers: [],
    achievements: [],

    notes: "",
  });

  useEffect(() => {
    (async () => {
      setLoadingProjects(true);
      setError("");
      try {
        const data = await getProjectsApi();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    })();
  }, []);

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
      const payload = buildPayload();
      const res = await createReportApi(payload);

      const reportId = res.report?._id;
      if (!reportId) throw new Error("Report id not returned from server");

      // go to edit page after creation
      navigate(`/member/reports/${reportId}/edit`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const onSubmitForReview = async () => {
    setSaving(true);
    setError("");
    try {
      // create draft first
      const payload = buildPayload();
      const res = await createReportApi(payload);
      const reportId = res.report?._id;
      if (!reportId) throw new Error("Report id not returned from server");

      // then submit
      await submitReportApi(reportId);

      navigate(`/reports/${reportId}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to submit report");
    } finally {
      setSaving(false);
    }
  };

  if (loadingProjects) {
    return <div className="p-6">Loading projects...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Create Weekly Report
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill sections and save as Draft or submit for review.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <ReportFormWizard
          mode="create"
          status="Draft"
          managerComment=""
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