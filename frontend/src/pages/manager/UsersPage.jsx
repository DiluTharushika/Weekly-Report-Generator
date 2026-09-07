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
  FiEye,
} from "react-icons/fi";

/* ─────────────────────────────────────────────────────────
   Shared style tokens — used on every interactive element
───────────────────────────────────────────────────────── */
const inputCls =
  "w-full rounded-xl border px-3 py-2 text-xs outline-none transition-all " +
  "bg-white dark:bg-slate-900/80 " +
  "border-slate-200 dark:border-slate-700/80 " +
  "text-slate-900 dark:text-slate-100 " +
  "placeholder-slate-400 dark:placeholder-slate-600 " +
  "focus:border-blue-500 dark:focus:border-yellow-500 " +
  "focus:ring-2 focus:ring-blue-500/15 dark:focus:ring-yellow-500/15";

const selectCls =
  "w-full rounded-xl border px-3 py-2 text-xs outline-none transition-all cursor-pointer " +
  "bg-white dark:bg-slate-900/80 " +
  "border-slate-200 dark:border-slate-700/80 " +
  "text-slate-900 dark:text-slate-100 " +
  "focus:border-blue-500 dark:focus:border-yellow-500 " +
  "focus:ring-2 focus:ring-blue-500/15 dark:focus:ring-yellow-500/15";

const inlineSelectCls =
  "rounded-lg border px-2.5 py-1.5 text-xs outline-none transition-all cursor-pointer font-medium " +
  "bg-white dark:bg-slate-800/80 " +
  "border-slate-200 dark:border-slate-700/60 " +
  "text-slate-700 dark:text-slate-200 " +
  "focus:border-blue-500 dark:focus:border-yellow-500 " +
  "focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-yellow-500/10";

const cardCls =
  "rounded-2xl border shadow-xl transition-all " +
  "bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl " +
  "border-slate-200/80 dark:border-slate-800/80 " +
  "shadow-slate-100/50 dark:shadow-slate-950/50";

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(ROLES.MEMBER);
  const [invitePassword, setInvitePassword] = useState("Password123!");

  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsersApi({ page, limit, q: q || undefined, role: role || undefined, isActive: isActive || undefined });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, role, isActive]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onSearch = (e) => { e.preventDefault(); setPage(1); load(); };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      await createUserApi({ name: inviteName, email: inviteEmail, password: invitePassword, role: inviteRole });
      setSuccess(`User ${inviteEmail} invited & created successfully!`);
      setShowInviteModal(false);
      setInviteName(""); setInviteEmail(""); setInvitePassword("Password123!"); setInviteRole(ROLES.MEMBER);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to invite team member");
    } finally { setSaving(false); }
  };

  const changeRole = async (id, newRole) => {
    setSaving(true); setError(""); setSuccess("");
    try {
      await updateUserRoleApi(id, { role: newRole });
      setSuccess("Role updated successfully");
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update role");
    } finally { setSaving(false); }
  };

  const toggleActive = async (id, current) => {
    setSaving(true); setError(""); setSuccess("");
    try {
      await updateUserStatusApi(id, { isActive: !current });
      setSuccess(`User ${!current ? "activated" : "deactivated"} successfully`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update user status");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Team & User Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage organization members, assign access roles, and invite new users
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shrink-0 cursor-pointer transition-all shadow-lg
            bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25
            dark:from-yellow-500 dark:to-amber-500 dark:hover:from-yellow-400 dark:hover:to-amber-400 dark:text-slate-950 dark:shadow-yellow-500/25"
        >
          <FiUserPlus className="text-base" /> Invite / Add Member
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-500 dark:text-red-400 font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          {success}
        </div>
      )}

      {/* Filter Panel */}
      <div className={cardCls + " p-5"}>
        <form onSubmit={onSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Search Directory
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
              <input
                className={inputCls + " pl-10"}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or email..."
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Filter Role
            </label>
            <select className={selectCls} value={role} onChange={(e) => { setPage(1); setRole(e.target.value); }}>
              <option value="">All Roles</option>
              <option value={ROLES.MEMBER}>Member</option>
              <option value={ROLES.MANAGER}>Manager</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Account Status
            </label>
            <select className={selectCls} value={isActive} onChange={(e) => { setPage(1); setIsActive(e.target.value); }}>
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className={cardCls + " overflow-hidden"}>
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">Organization Members</h2>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700/60">
            {total} Total Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
              <tr>
                {["Name", "Email", "Assigned Role", "Status", "Actions"].map((h, i) => (
                  <th key={h} className={`font-semibold px-5 py-3.5 uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">Loading team members...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">No users matching criteria.</td></tr>
              ) : items.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black shrink-0
                        bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300
                        border border-blue-200 dark:border-blue-500/25">
                        {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">{u.email}</td>

                  {/* Role Dropdown */}
                  <td className="px-5 py-3.5">
                    <select
                      className={inlineSelectCls}
                      value={u.role}
                      disabled={saving}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                    >
                      <option value={ROLES.MEMBER}>Member</option>
                      <option value={ROLES.MANAGER}>Manager</option>
                      <option value={ROLES.ADMIN}>Admin</option>
                    </select>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      u.isActive
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25"
                        : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`} />
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Profile — Blue outline in both modes */}
                      <Link
                        to={`/manager/users/${u._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                          border border-blue-300 dark:border-blue-500/40
                          text-blue-600 dark:text-blue-400
                          bg-blue-50/50 dark:bg-blue-500/10
                          hover:bg-blue-100 dark:hover:bg-blue-500/20"
                        title="View member profile & history"
                      >
                        <FiEye className="text-sm" /> Profile
                      </Link>

                      {/* Deactivate / Activate */}
                      <button
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer disabled:opacity-40 ${
                          u.isActive
                            ? "border-red-300 dark:border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20"
                            : "border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Page <span className="font-bold text-slate-800 dark:text-slate-200">{page}</span> of{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span> ({total} Users)
          </div>
          <div className="flex gap-2">
            {[
              { label: <><FiChevronLeft /> Prev</>, disabled: page <= 1, fn: () => setPage((p) => p - 1) },
              { label: <>Next <FiChevronRight /></>, disabled: page >= totalPages, fn: () => setPage((p) => p + 1) },
            ].map(({ label, disabled, fn }, i) => (
              <button
                key={i}
                className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40
                  border-slate-200 dark:border-slate-700/80
                  bg-white dark:bg-slate-800/60
                  text-slate-700 dark:text-slate-300
                  hover:bg-blue-50 dark:hover:bg-slate-800
                  hover:border-blue-300 dark:hover:border-slate-600
                  hover:text-blue-600 dark:hover:text-slate-100"
                disabled={disabled}
                onClick={fn}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Invite / Create User Modal ── */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-2xl border max-w-md w-full p-6 shadow-2xl space-y-4
            bg-white dark:bg-slate-900
            border-slate-200 dark:border-slate-700/80
            shadow-slate-300/30 dark:shadow-slate-950/80">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-yellow-400">
                  <FiUserPlus />
                </div>
                Invite / Create Team Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer transition-colors"
              >✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                  <input className={inputCls + " pl-9"} value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="e.g. Sarah Connor" required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                  <input type="email" className={inputCls + " pl-9"} value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="sarah@company.com" required />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Initial Role</label>
                <div className="relative">
                  <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                  <select className={selectCls + " pl-9"} value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                    <option value={ROLES.MEMBER}>Member</option>
                    <option value={ROLES.MANAGER}>Manager</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Temporary Password</label>
                <input className={inputCls} value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} placeholder="Password123!" required />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold cursor-pointer transition-all
                    border-slate-200 dark:border-slate-700
                    text-slate-700 dark:text-slate-300
                    hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-white cursor-pointer transition-all shadow-lg disabled:opacity-50
                    bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20
                    dark:from-yellow-500 dark:to-amber-500 dark:text-slate-950 dark:hover:from-yellow-400 dark:hover:to-amber-400 dark:shadow-yellow-500/20"
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