import { useEffect, useState } from "react";
import {
  getProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from "../../api/projectApi.js";
import { FiPlus, FiEdit3, FiTrash2, FiFolder, FiCheck, FiX } from "react-icons/fi";

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
    const ok = window.confirm("Are you sure you want to delete this project category?");
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
    <div className="space-y-6">
      {/* Header section */}
      <div className="pb-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Project Category Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure project taxonomies and tags used for weekly status tagging
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <FiFolder className="text-indigo-600 text-lg" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {editingId ? "Edit Project Category" : "Add New Project Category"}
          </h2>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mobile App Redesign"
                required
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key objectives & deliverables"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Badge Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-8 w-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <input
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
              type="submit"
            >
              <FiCheck /> {saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <FiX /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Active Categories</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available categories for weekly report tagging
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            {projects.length} Total
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading project categories...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="text-left font-semibold px-5 py-3.5">Category Name</th>
                  <th className="text-left font-semibold px-5 py-3.5">Description</th>
                  <th className="text-left font-semibold px-5 py-3.5">Tag Badge</th>
                  <th className="text-right font-semibold px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{p.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{p.description || "-"}</td>
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-[11px] font-semibold">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: p.color || "#3B82F6" }}
                        />
                        {p.color}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                          onClick={() => startEdit(p)}
                          type="button"
                        >
                          <FiEdit3 className="text-sm" /> Edit
                        </button>

                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/50 text-red-600 hover:bg-red-100 font-medium transition-colors cursor-pointer disabled:opacity-50"
                          onClick={() => remove(p._id)}
                          type="button"
                          disabled={saving}
                        >
                          <FiTrash2 className="text-sm" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td className="px-5 py-12 text-center text-slate-400" colSpan={4}>
                      No project categories defined yet. Use the form above to add your first category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}