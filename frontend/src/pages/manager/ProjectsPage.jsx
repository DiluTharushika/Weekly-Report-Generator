import { useEffect, useState } from "react";
import { getProjectsApi, createProjectApi, updateProjectApi, deleteProjectApi } from "../../api/projectApi.js";
import { FiPlus, FiEdit3, FiTrash2, FiFolder, FiCheck, FiX } from "react-icons/fi";

const inputCls =
  "w-full rounded-xl border px-3.5 py-2 text-xs outline-none transition-all " +
  "bg-white dark:bg-slate-900/80 " +
  "border-slate-200 dark:border-slate-700/80 " +
  "text-slate-900 dark:text-slate-100 " +
  "placeholder-slate-400 dark:placeholder-slate-600 " +
  "focus:border-blue-500 dark:focus:border-yellow-500 " +
  "focus:ring-2 focus:ring-blue-500/15 dark:focus:ring-yellow-500/15";

const cardCls =
  "rounded-2xl border shadow-xl transition-all " +
  "bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl " +
  "border-slate-200/80 dark:border-slate-800/80 " +
  "shadow-slate-100/50 dark:shadow-slate-950/50";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await getProjectsApi();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load projects");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setName(""); setDescription(""); setColor("#3B82F6"); setEditingId(null); };

  const startEdit = (p) => {
    setEditingId(p._id); setName(p.name || ""); setDescription(p.description || ""); setColor(p.color || "#3B82F6");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (!name.trim()) { setError("Project name is required"); setSaving(false); return; }
      const payload = { name, description, color };
      if (editingId) { await updateProjectApi(editingId, payload); } else { await createProjectApi(payload); }
      await load(); resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Save failed");
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project category?")) return;
    setSaving(true); setError("");
    try { await deleteProjectApi(id); await load(); }
    catch (err) { setError(err?.response?.data?.message || err.message || "Delete failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Project Category Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure project taxonomies and tags used for weekly status tagging</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-500 dark:text-red-400 font-medium">{error}</div>
      )}

      {/* Form Card */}
      <div className={cardCls + " p-6"}>
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-yellow-400">
            <FiFolder className="text-base" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {editingId ? "Edit Project Category" : "Add New Project Category"}
          </h2>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mobile App Redesign" required />
            </div>
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Description</label>
              <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Key objectives & deliverables" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Badge Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <input className={inputCls} value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {/* Primary Save Button */}
            <button
              disabled={saving}
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white cursor-pointer transition-all shadow-lg disabled:opacity-50
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20
                dark:from-yellow-500 dark:to-amber-500 dark:text-slate-950 dark:hover:from-yellow-400 dark:hover:to-amber-400 dark:shadow-yellow-500/20"
            >
              <FiCheck /> {saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-xs font-semibold cursor-pointer transition-all
                  border-slate-200 dark:border-slate-700
                  text-slate-700 dark:text-slate-300
                  bg-white dark:bg-slate-800/60
                  hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FiX /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects Table */}
      <div className={cardCls + " overflow-hidden"}>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">Active Categories</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Available categories for weekly report tagging</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700/60">
            {projects.length} Total
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">Loading project categories...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                <tr>
                  {["Category Name", "Description", "Tag Badge", "Actions"].map((h, i) => (
                    <th key={h} className={`font-semibold px-5 py-3.5 uppercase tracking-wider ${i === 3 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">{p.name}</td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">{p.description || "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color || "#3B82F6" }} />
                        {p.color}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit — blue outline */}
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
                            border border-blue-300 dark:border-blue-500/40
                            text-blue-600 dark:text-blue-400
                            bg-blue-50/50 dark:bg-blue-500/10
                            hover:bg-blue-100 dark:hover:bg-blue-500/20"
                          onClick={() => startEdit(p)}
                          type="button"
                        >
                          <FiEdit3 className="text-sm" /> Edit
                        </button>
                        {/* Delete — red outline */}
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50
                            border border-red-300 dark:border-red-500/40
                            text-red-600 dark:text-red-400
                            bg-red-50/50 dark:bg-red-500/10
                            hover:bg-red-100 dark:hover:bg-red-500/20"
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
                    <td className="px-5 py-12 text-center text-slate-400 dark:text-slate-500" colSpan={4}>
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