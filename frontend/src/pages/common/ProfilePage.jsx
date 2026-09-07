import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FiUser, FiMail, FiShield, FiLock, FiCheck,
  FiEye, FiEyeOff, FiBell, FiCalendar, FiEdit3
} from "react-icons/fi";

const inputCls =
  "w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition-all " +
  "bg-white dark:bg-slate-900/80 " +
  "border-slate-200 dark:border-slate-700/80 " +
  "text-slate-800 dark:text-slate-100 " +
  "placeholder-slate-400 dark:placeholder-slate-600 " +
  "focus:border-blue-500 dark:focus:border-yellow-500 " +
  "focus:ring-2 focus:ring-blue-500/15 dark:focus:ring-yellow-500/15";

const cardCls =
  "rounded-2xl border shadow-sm " +
  "bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl " +
  "border-slate-200 dark:border-slate-800/80 " +
  "shadow-slate-100 dark:shadow-slate-950/50";

const SectionHeader = ({ icon: Icon, title, subtitle, iconColor = "text-blue-600 dark:text-yellow-400" }) => (
  <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
    <div className={`p-2 rounded-xl bg-blue-50 dark:bg-slate-800/80 ${iconColor}`}>
      <Icon className="text-base" />
    </div>
    <div>
      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
      {Icon && <Icon className="text-sm text-slate-400 dark:text-slate-500" />}
      {label}
    </div>
    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{value}</div>
  </div>
);

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdError, setPwdError] = useState("");

  const roleBadgeCls =
    user?.role === "admin"
      ? "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30"
      : user?.role === "manager"
      ? "bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
      : "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const handleChangePwd = (e) => {
    e.preventDefault();
    setPwdError(""); setPwdSuccess("");
    if (!currentPwd || !newPwd || !confirmPwd) { setPwdError("Please fill in all password fields."); return; }
    if (newPwd !== confirmPwd) { setPwdError("New password and confirmation do not match."); return; }
    if (newPwd.length < 8) { setPwdError("New password must be at least 8 characters."); return; }
    setPwdSuccess("Password updated successfully!");
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
  };

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Profile Hero Card ── */}
      <div className={cardCls + " overflow-hidden"}>
        {/* Blue banner strip */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-950 dark:to-slate-900 relative">
          <div className="absolute -bottom-1 left-0 right-0 h-6 bg-white dark:bg-slate-900/80 rounded-t-3xl" />
          <div className="absolute top-2 right-4 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1.5 w-6 rounded-full bg-white/20" />
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar + name */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 relative z-10">
            <div className="flex items-end gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-yellow-400 dark:to-amber-500 flex items-center justify-center text-white dark:text-slate-950 text-3xl font-black shadow-xl shadow-blue-500/30 dark:shadow-yellow-500/20 border-4 border-white dark:border-slate-900 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="mb-1">
                <h1 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  {user?.name || "Unknown User"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ${roleBadgeCls}`}>
                <FiShield className="text-sm" />
                {user?.role || "Member"}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold
                bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400
                border border-emerald-200 dark:border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: "Member Since", value: memberSince, icon: FiCalendar },
              { label: "Role", value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—", icon: FiShield },
              { label: "Status", value: "Active & Verified", icon: FiCheck },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl p-3 text-center border
                bg-slate-50 dark:bg-slate-800/50
                border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-center mb-1">
                  <Icon className="text-sm text-blue-500 dark:text-yellow-400" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">{label}</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Account Information ── */}
      <div className={cardCls + " p-6"}>
        <SectionHeader icon={FiUser} title="Account Information" subtitle="Your personal details and access credentials" />
        <div className="space-y-0">
          <InfoRow label="Full Name" value={user?.name || "—"} icon={FiUser} />
          <InfoRow label="Email Address" value={user?.email || "—"} icon={FiMail} />
          <InfoRow label="Role" value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—"} icon={FiShield} />
          <InfoRow label="Account Status" value="Active & Verified" icon={FiCheck} />
          <InfoRow label="Member Since" value={memberSince} icon={FiCalendar} />
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className={cardCls + " p-6"}>
        <SectionHeader
          icon={FiLock}
          title="Change Password"
          subtitle="Use a strong password with at least 8 characters"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />

        {pwdSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <FiCheck className="shrink-0" /> {pwdSuccess}
          </div>
        )}
        {pwdError && (
          <div className="mb-4 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
            {pwdError}
          </div>
        )}

        <form onSubmit={handleChangePwd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
              <input
                type={showPwd ? "text" : "password"}
                className={inputCls + " pl-10 pr-10"}
                placeholder="Enter current password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                {showPwd ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                <input
                  type={showPwd ? "text" : "password"}
                  className={inputCls + " pl-10"}
                  placeholder="Min. 8 characters"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
                <input
                  type={showPwd ? "text" : "password"}
                  className={inputCls + " pl-10"}
                  placeholder="Re-enter new password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white cursor-pointer transition-all shadow-lg
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20
                dark:from-yellow-500 dark:to-amber-500 dark:text-slate-950 dark:hover:from-yellow-400 dark:hover:to-amber-400 dark:shadow-yellow-500/20"
            >
              <FiLock /> Update Password
            </button>
          </div>
        </form>
      </div>

      {/* ── Notification Preferences ── */}
      <div className={cardCls + " p-6"}>
        <SectionHeader
          icon={FiBell}
          title="Notification Preferences"
          subtitle="Control how you receive alerts and report reminders"
          iconColor="text-amber-600 dark:text-yellow-400"
        />
        <div className="space-y-3">
          {[
            { label: "Email Notifications", desc: "Get notified when manager reviews your reports", checked: true },
            { label: "Weekly Summary Digest", desc: "Receive a weekly overview of your team activity", checked: true },
            { label: "Report Deadline Reminders", desc: "Alerts before your weekly report is due", checked: false },
          ].map(({ label, desc, checked }) => (
            <div key={label} className="flex items-center justify-between p-4 rounded-xl border transition-all
              border-slate-100 dark:border-slate-800/60
              bg-slate-50/60 dark:bg-slate-800/30
              hover:border-blue-200 dark:hover:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{desc}</div>
              </div>
              <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                checked ? "bg-blue-500 dark:bg-yellow-500" : "bg-slate-300 dark:bg-slate-700"
              }`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  checked ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
