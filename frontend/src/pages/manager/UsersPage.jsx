import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsersApi, updateUserRoleApi, updateUserStatusApi, createUserApi } from "../../api/userApi.js";
import { ROLES } from "../../utils/constants.js";
import { 
  FiUserPlus, 
  FiSearch, 
  FiUserCheck, 
  FiUserX, 
  FiShield, 
  FiMail, 
  FiUser, 
  FiChevronLeft, 
  FiChevronRight,
  FiEye
} from "react-icons/fi";

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Invite / Create Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(ROLES.MEMBER);
  const [invitePassword, setInvitePassword] = useState("Password123!");

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
      setError(err?.response?.data?.message || err.message || "Failed to load user directory");
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await createUserApi({
        name: inviteName,
        email: inviteEmail,
        password: invitePassword,
        role: inviteRole,
      });
      setSuccess(`User ${inviteEmail} invited & created successfully!`);
      setShowInviteModal(false);
      setInviteName("");
      setInviteEmail("");
      setInvitePassword("Password123!");
      setInviteRole(ROLES.MEMBER);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to invite team member");
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (id, newRole) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateUserRoleApi(id, { role: newRole });
      setSuccess("Role updated successfully");
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
    setSuccess("");
    try {
      await updateUserStatusApi(id, { isActive: !current });
      setSuccess(`User status ${!current ? "activated" : "deactivated"} successfully`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update user status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team & User Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization members, assign access roles, and invite new users
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors shrink-0 cursor-pointer"
        >
          <FiUserPlus className="text-base" /> Invite / Add Member
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-700 font-medium">
          {success}
        </div>
      )}

      {/* Filter Panel */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <form onSubmit={onSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Search Directory
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or email..."
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Filter Role
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none"
              value={role}
              onChange={(e) => { setPage(1); setRole(e.target.value); }}
            >
              <option value="">All Roles</option>
              <option value={ROLES.MEMBER}>Member</option>
              <option value={ROLES.MANAGER}>Manager</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Account Status
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none"
              value={isActive}
              onChange={(e) => { setPage(1); setIsActive(e.target.value); }}
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>
        </form>
      </div>

      {/* Users Directory Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Organization Members</h2>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            {total} Total Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="text-left font-semibold px-5 py-3.5">Name</th>
                <th className="text-left font-semibold px-5 py-3.5">Email</th>
                <th className="text-left font-semibold px-5 py-3.5">Assigned Role</th>
                <th className="text-left font-semibold px-5 py-3.5">Status</th>
                <th className="text-right font-semibold px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    Loading team members...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                items.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
                          {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="font-semibold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <select
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:border-indigo-500 outline-none"
                        value={u.role}
                        disabled={saving}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                      >
                        <option value={ROLES.MEMBER}>member</option>
                        <option value={ROLES.MANAGER}>manager</option>
                        <option value={ROLES.ADMIN}>admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Manager view member profile link */}
                        <Link
                          to={`/manager/users/${u._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 font-semibold transition-colors"
                          title="View member profile & history"
                        >
                          <FiEye className="text-sm" /> Profile
                        </Link>

                        <button
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                            u.isActive
                              ? "border-red-200 bg-red-50/50 text-red-600 hover:bg-red-100"
                              : "border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                          disabled={saving}
                          onClick={() => toggleActive(u._id, u.isActive)}
                          type="button"
                        >
                          {u.isActive ? <><FiUserX /> Deactivate</> : <><FiUserCheck /> Activate</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/40">
          <div className="text-xs text-slate-500 font-medium">
            Page <span className="font-bold text-slate-900">{page}</span> of <span className="font-bold text-slate-900">{totalPages}</span> ({total} Users)
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <FiChevronLeft /> Prev
            </button>
            <button
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Invite / Create User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FiUserPlus className="text-indigo-600" /> Invite / Create Team Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Role</label>
                <div className="relative">
                  <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <select
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value={ROLES.MEMBER}>Member</option>
                    <option value={ROLES.MANAGER}>Manager</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Temporary Password</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 outline-none"
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  placeholder="Password123!"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Creating..." : "Invite User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}