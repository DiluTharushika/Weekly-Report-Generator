import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import ManagerCommentBox from "./ManagerCommentBox.jsx";
import TasksCompletedTable from "./TasksCompletedTable.jsx";
import KeySelectableList from "./KeySelectableList.jsx";

const steps = [
  { key: "meta", label: "Week & Project" },
  { key: "tasks", label: "Tasks Completed" },
  { key: "next", label: "Next Week Plan" },
  { key: "blockers", label: "Blockers" },
  { key: "achievements", label: "Achievements" },
  { key: "notes", label: "Notes" },
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left steps */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              Weekly Report
            </div>
            {status && <StatusBadge status={status} />}
          </div>

          <div className="mt-4 space-y-1">
            {steps.map((s) => {
              const isActive = active === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(s.key)}
                  className={`w-full text-left rounded-xl px-3 py-2 text-sm border ${
                    isActive
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-transparent hover:bg-slate-50 text-slate-700"
                  }`}
                >
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
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={!canEdit || saving}
              onClick={onSubmitForReview}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Submit for Review
            </button>
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="lg:col-span-9 space-y-4">
        {managerComment && <ManagerCommentBox comment={managerComment} />}

        {/* META */}
        {active === "meta" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">
              Week & Project
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Select project and week range. (Fixed structure)
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Project
                </label>
                <select
                  disabled={!canEdit}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
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
                  Category Tag (optional)
                </label>
                <input
                  disabled={!canEdit}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
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
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
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
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                  value={form.weekEnd}
                  onChange={(e) => setField("weekEnd", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TASKS */}
        {active === "tasks" && (
          <TasksCompletedTable
            tasks={form.tasksCompleted}
            setTasks={(tasks) => setField("tasksCompleted", tasks)}
          />
        )}

        {/* NEXT WEEK */}
        {active === "next" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">
              Tasks planned for next week
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Enter one item per line.
            </p>

            <textarea
              disabled={!canEdit}
              className="mt-4 w-full min-h-[180px] rounded-xl border border-slate-300 px-3 py-2.5"
              value={form.tasksPlannedText}
              onChange={(e) => setField("tasksPlannedText", e.target.value)}
              placeholder={`Example:\n- Finish report workflow\n- Add dashboard charts`}
            />
          </div>
        )}

        {/* BLOCKERS */}
        {active === "blockers" && (
          <KeySelectableList
            title="Blockers / Challenges"
            items={form.blockers}
            setItems={(items) => setField("blockers", items)}
            keyField="isKeyIssue"
            placeholder="Add a blocker..."
          />
        )}

        {/* ACHIEVEMENTS */}
        {active === "achievements" && (
          <KeySelectableList
            title="Achievements / Highlights"
            items={form.achievements}
            setItems={(items) => setField("achievements", items)}
            keyField="isKeyAchievement"
            placeholder="Add an achievement..."
          />
        )}

        {/* NOTES */}
        {active === "notes" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">Notes / Links</h3>
            <p className="text-sm text-slate-500 mt-1">Optional.</p>

            <textarea
              disabled={!canEdit}
              className="mt-4 w-full min-h-[180px] rounded-xl border border-slate-300 px-3 py-2.5"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Add any links, notes, or extra context..."
            />
          </div>
        )}
      </div>
    </div>
  );
}