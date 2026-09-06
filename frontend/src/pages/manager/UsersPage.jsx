import { useEffect, useState } from "react";
import { getUsersApi, updateUserRoleApi, updateUserStatusApi } from "../../api/userApi.js";
import { ROLES } from "../../utils/constants.js";

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // filters
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsersApi({
        page,
        limit,
        q: q || undefined,
        role: role || undefined,
        isActive: isActive || undefined,
      });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, isActive]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const changeRole = async (id, newRole) => {
    setSaving(true);
    setError("");
    try {
      await updateUserRoleApi(id, { role: newRole });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, current) => {
    setSaving(true);
    setError("");
    try {
      await updateUserStatusApi(id, { isActive: !current });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage users, roles and activation status.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-600 mb-1">Search</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name/email"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Role</label>
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={role}
              onChange={(e) => { setPage(1); setRole(e.target.value); }}
            >
              <option value="">All</option>
              <option value={ROLES.MEMBER}>member</option>
              <option value={ROLES.MANAGER}>manager</option>
              <option value={ROLES.ADMIN}>admin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Active</label>
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={isActive}
              onChange={(e) => { setPage(1); setIsActive(e.target.value); }}
            >
              <option value="">All</option>
              <option value="true">active</option>
              <option value="false">inactive</option>
            </select>
          </div>

          <div className="md:col-span-4 flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setRole("");
                setIsActive("");
                setPage(1);
                setTimeout(load, 0);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Users</h3>
          <span className="text-xs text-slate-500">{total} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Role</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                items.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-700">{u.email}</td>
                    <td className="px-4 py-3 text-slate-700">{u.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {u.isActive ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                        value={u.role}
                        disabled={saving}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                      >
                        <option value={ROLES.MEMBER}>member</option>
                        <option value={ROLES.MANAGER}>manager</option>
                        <option value={ROLES.ADMIN}>admin</option>
                      </select>

                      <button
                        className="ml-3 text-slate-700 hover:underline disabled:opacity-50"
                        disabled={saving}
                        onClick={() => toggleActive(u._id, u.isActive)}
                        type="button"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Page {page} of {Math.max(1, totalPages)}
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}