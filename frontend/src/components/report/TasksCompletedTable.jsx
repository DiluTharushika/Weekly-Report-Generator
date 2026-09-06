import { useState } from "react";

const priorities = ["Low", "Medium", "High"];
const statuses = ["Not Started", "In Progress", "Completed", "Blocked"];

export default function TasksCompletedTable({ tasks, setTasks }) {
  const [taskName, setTaskName] = useState("");

  const addTask = () => {
    const name = taskName.trim();
    if (!name) return;

    setTasks([
      ...tasks,
      {
        taskName: name,
        priority: "Medium",
        plannedPercent: 0,
        actualPercent: 0,
        status: "Not Started",
        timePlanned: 0,
        timeSpent: 0,
        deliverable: "",
      },
    ]);
    setTaskName("");
  };

  const removeTask = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const updateTask = (idx, key, value) => {
    setTasks(tasks.map((t, i) => (i === idx ? { ...t, [key]: value } : t)));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Tasks Completed</h3>
          <p className="text-sm text-slate-500 mt-1">
            Add tasks with planned vs actual and time.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task name (e.g., Implement auth middleware)"
        />
        <button
          type="button"
          onClick={addTask}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add task
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-3 py-2">Task</th>
              <th className="text-left font-medium px-3 py-2">Priority</th>
              <th className="text-left font-medium px-3 py-2">Planned %</th>
              <th className="text-left font-medium px-3 py-2">Actual %</th>
              <th className="text-left font-medium px-3 py-2">Status</th>
              <th className="text-left font-medium px-3 py-2">Planned hrs</th>
              <th className="text-left font-medium px-3 py-2">Spent hrs</th>
              <th className="text-left font-medium px-3 py-2">Deliverable</th>
              <th className="text-right font-medium px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tasks.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan={9}>
                  No tasks added yet.
                </td>
              </tr>
            ) : (
              tasks.map((t, idx) => (
                <tr key={idx} className="align-top">
                  <td className="px-3 py-2 min-w-[220px]">
                    <input
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5"
                      value={t.taskName}
                      onChange={(e) => updateTask(idx, "taskName", e.target.value)}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <select
                      className="rounded-lg border border-slate-300 px-2 py-1.5"
                      value={t.priority}
                      onChange={(e) => updateTask(idx, "priority", e.target.value)}
                    >
                      {priorities.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-24 rounded-lg border border-slate-300 px-2 py-1.5"
                      value={t.plannedPercent}
                      onChange={(e) => updateTask(idx, "plannedPercent", Number(e.target.value))}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-24 rounded-lg border border-slate-300 px-2 py-1.5"
                      value={t.actualPercent}
                      onChange={(e) => updateTask(idx, "actualPercent", Number(e.target.value))}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <select
                      className="rounded-lg border border-slate-300 px-2 py-1.5"
                      value={t.status}
                      onChange={(e) => updateTask(idx, "status", e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-24 rounded-lg border border-slate-300 px-2 py-1.5"
                      value={t.timePlanned}
                      onChange={(e) => updateTask(idx, "timePlanned", Number(e.target.value))}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-24 rounded-lg border border-slate-300 px-2 py-1.5"
                      value={t.timeSpent}
                      onChange={(e) => updateTask(idx, "timeSpent", Number(e.target.value))}
                    />
                  </td>

                  <td className="px-3 py-2 min-w-[220px]">
                    <input
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5"
                      value={t.deliverable}
                      onChange={(e) => updateTask(idx, "deliverable", e.target.value)}
                      placeholder="Link / file / output"
                    />
                  </td>

                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeTask(idx)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}