import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import ManagerCommentBox from "./ManagerCommentBox.jsx";
import TasksCompletedTable from "./TasksCompletedTable.jsx";
import KeySelectableList from "./KeySelectableList.jsx";

const steps = [
  {
    key: "meta",
    label: "Week & Project",
    hint: "Pick your project and the week this report covers",
  },
  {
    key: "tasks",
    label: "Tasks Completed",
    hint: "What did you finish this week?",
  },
  {
    key: "next",
    label: "Next Week Plan",
    hint: "What will you work on next week?",
  },
  {
    key: "blockers",
    label: "Blockers",
    hint: "Anything slowing you down or stuck?",
  },
  {
    key: "achievements",
    label: "Achievements",
    hint: "Any wins worth highlighting?",
  },
  {
    key: "notes",
    label: "Notes",
    hint: "Links or extra context (optional)",
  },
];

export default function ReportFormWizard({
  mode, // "create" | "edit"
  status,
  managerComment,
  projects,
  form,
  setForm,
  onSaveDraft,
  onSubmitForReview,
  saving,
}) {
  const [active, setActive] = useState("meta");

  const canEdit = status === "Draft" || status === "Needs Correction" || !status;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const activeIndex = steps.findIndex((s) => s.key === active);
  const activeStep = steps[activeIndex];

  const goNext = () => {
    if (activeIndex < steps.length - 1) setActive(steps[activeIndex + 1].key);
  };
  const goBack = () => {
    if (activeIndex > 0) setActive(steps[activeIndex - 1].key);
  };

  const lockedMessage =
    status === "Approved"
      ? "This report has already been approved and can no longer be edited."
      : status === "Submitted"
      ? "This report is submitted and waiting for review. It can't be edited right now."
      : status
      ? `This report is "${status}" and can't be edited right now.`
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left steps */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              Weekly Report
            </div>
            {status && <StatusBadge status={status} />}
          </div>

          {/* Progress indicator */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>
                Step {activeIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(((activeIndex + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            {steps.map((s, i) => {
              const isActive = active === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(s.key)}
                  className={`w-full flex items-center gap-2 text-left rounded-xl px-3 py-2 text-sm border ${
                    isActive
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-transparent hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              disabled={!canEdit || saving}
              onClick={onSaveDraft}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={!canEdit || saving}
              onClick={onSubmitForReview}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit for Review
            </button>
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="lg:col-span-9 space-y-4">
        {managerComment && <ManagerCommentBox comment={managerComment} />}

        {/* Locked banner: explains WHY fields are disabled */}
        {!canEdit && lockedMessage && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            🔒 {lockedMessage}
          </div>
        )}

        {/* META */}
        {active === "meta" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">
              Week & Project
            </h3>
            <p className="text-sm text-slate-500 mt-1">{activeStep.hint}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={!canEdit}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-50 disabled:text-slate-400"
                  value={form.project}
                  onChange={(e) => setField("project", e.target.value)}
                >
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category Tag <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  disabled={!canEdit}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-50 disabled:text-slate-400"
                  value={form.categoryTag}
                  onChange={(e) => setField("categoryTag", e.target.value)}
                  placeholder="e.g. Internal Tooling"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Week Start
                </label>
                <input
                  disabled={!canEdit}
                  type="date"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-50 disabled:text-slate-400"
                  value={form.weekStart}
                  onChange={(e) => setField("weekStart", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Week End
                </label>
                <input
                  disabled={!canEdit}
                  type="date"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-50 disabled:text-slate-400"
                  value={form.weekEnd}
                  onChange={(e) => setField("weekEnd", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TASKS */}
        {active === "tasks" && (
          <div>
            <p className="text-sm text-slate-500 mb-2 px-1">{activeStep.hint}</p>
            <TasksCompletedTable
              tasks={form.tasksCompleted}
              setTasks={(tasks) => setField("tasksCompleted", tasks)}
            />
          </div>
        )}

        {/* NEXT WEEK */}
        {active === "next" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">
              Tasks planned for next week
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {activeStep.hint}. Type one item, then press Enter for the next line.
            </p>

            <textarea
              disabled={!canEdit}
              className="mt-4 w-full min-h-[180px] rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-50 disabled:text-slate-400"
              value={form.tasksPlannedText}
              onChange={(e) => setField("tasksPlannedText", e.target.value)}
              placeholder={`Example:\n- Finish report workflow\n- Add dashboard charts`}
            />
          </div>
        )}

        {/* BLOCKERS */}
        {active === "blockers" && (
          <div>
            <p className="text-sm text-slate-500 mb-2 px-1">{activeStep.hint}</p>
            <KeySelectableList
              title="Blockers / Challenges"
              items={form.blockers}
              setItems={(items) => setField("blockers", items)}
              keyField="isKeyIssue"
              placeholder="Add a blocker..."
            />
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {active === "achievements" && (
          <div>
            <p className="text-sm text-slate-500 mb-2 px-1">{activeStep.hint}</p>
            <KeySelectableList
              title="Achievements / Highlights"
              items={form.achievements}
              setItems={(items) => setField("achievements", items)}
              keyField="isKeyAchievement"
              placeholder="Add an achievement..."
            />
          </div>
        )}

        {/* NOTES */}
        {active === "notes" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">Notes / Links</h3>
            <p className="text-sm text-slate-500 mt-1">{activeStep.hint}</p>

            <textarea
              disabled={!canEdit}
              className="mt-4 w-full min-h-[180px] rounded-xl border border-slate-300 px-3 py-2.5 disabled:bg-slate-50 disabled:text-slate-400"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Add any links, notes, or extra context..."
            />
          </div>
        )}

        {/* Back / Next navigation so users don't have to hunt for the next tab */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={goBack}
            disabled={activeIndex === 0}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          {activeIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              disabled={!canEdit || saving}
              onClick={onSubmitForReview}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit for Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}