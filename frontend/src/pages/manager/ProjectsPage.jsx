import { useEffect, useState } from "react";
import {
  getProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from "../../api/projectApi.js";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [projects, setProjects] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");

  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProjectsApi();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor("#3B82F6");
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setName(p.name || "");
    setDescription(p.description || "");
    setColor(p.color || "#3B82F6");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = { name, description, color };

      if (!name.trim()) {
        setError("Project name is required");
        setSaving(false);
        return;
      }

      if (editingId) {
        await updateProjectApi(editingId, payload);
      } else {
        await createProjectApi(payload);
      }

      await load();
      resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const ok = window.confirm("Delete this project?");
    if (!ok) return;

    setSaving(true);
    setError("");
    try {
      await deleteProjectApi(id);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage projects/categories used in weekly reports.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Create / Edit form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>

        <form onSubmit={submit} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className="block text-xs text-slate-600 mb-1">Name</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client A"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-slate-600 mb-1">Description</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs text-slate-600 mb-1">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                className="h-10 w-12 rounded-lg border border-slate-300"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <input
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-4 flex gap-2">
            <button
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              type="submit"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">All Projects</h3>
          <span className="text-xs text-slate-500">{projects.length} total</span>
        </div>

        {loading ? (
          <div className="p-5 text-sm text-slate-600">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="p-5 text-sm text-slate-500">No projects.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Name</th>
                  <th className="text-left font-medium px-4 py-3">Description</th>
                  <th className="text-left font-medium px-4 py-3">Color</th>
                  <th className="text-right font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 text-slate-700">{p.description || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-4 w-4 rounded"
                          style={{ backgroundColor: p.color || "#3B82F6" }}
                        />
                        <span className="text-xs text-slate-600">{p.color}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="text-slate-700 hover:underline"
                        onClick={() => startEdit(p)}
                        type="button"
                      >
                        Edit
                      </button>
                      <span className="mx-2 text-slate-300">|</span>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => remove(p._id)}
                        type="button"
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}