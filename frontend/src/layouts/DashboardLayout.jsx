import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";
import {
  FiGrid,
  FiClock,
  FiPlusCircle,
  FiLogOut,
  FiUserCheck,
  FiTrendingUp,
  FiUsers,
  FiFolder,
  FiFileText,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

/* ── Icon map for each route ── */
const ICON_MAP = {
  "/manager":          { icon: FiTrendingUp,  label: "Dashboard",      group: "Overview" },
  "/manager/reports":  { icon: FiFileText,    label: "Team Reports",   group: "Management" },
  "/manager/projects": { icon: FiFolder,      label: "Projects",       group: "Management" },
  "/manager/users":    { icon: FiUsers,       label: "Users",          group: "Management" },
  "/manager/profile":  { icon: FiUser,        label: "My Profile",     group: "Account" },
  "/member":           { icon: FiGrid,        label: "Dashboard",      group: "Overview" },
  "/member/history":   { icon: FiClock,       label: "My Reports",     group: "Reports" },
  "/member/reports/new": { icon: FiPlusCircle, label: "New Report",    group: "Reports" },
  "/member/profile":   { icon: FiUser,        label: "My Profile",     group: "Account" },
};

const NavItem = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    end={to === "/member" || to === "/manager"}
    className={({ isActive }) =>
      `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-600 text-white font-bold shadow-md shadow-blue-500/25 dark:shadow-blue-500/25"
          : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-700 dark:hover:text-slate-100"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {Icon && (
          <span className={`p-1 rounded-lg transition-colors ${
            isActive
              ? "bg-white/20"
              : "bg-transparent group-hover:bg-blue-100 dark:group-hover:bg-slate-700/60"
          }`}>
            <Icon className="text-base" />
          </span>
        )}
        <span className="flex-1">{label}</span>
        {isActive && <FiChevronRight className="text-xs opacity-70" />}
      </>
    )}
  </NavLink>
);

export default function DashboardLayout({ links = [], title = "Dashboard" }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  /* Build enriched nav items from links prop */
  const enrichedLinks = links.map((l) => ({
    ...l,
    ...ICON_MAP[l.to],
    label: ICON_MAP[l.to]?.label || l.label,
  }));

  /* Group nav items by group label */
  const groups = enrichedLinks.reduce((acc, item) => {
    const g = item.group || "Other";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col antialiased text-slate-800 dark:text-slate-100 transition-colors duration-300 relative">

      {/* Decorative Ambient Gradients */}
      <div className="fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-400/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 dark:from-blue-600 dark:via-indigo-500 dark:to-blue-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/25 dark:shadow-blue-500/25">
              WR
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight block leading-none">
                Report Hub
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Enterprise Studio
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* System status */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 pr-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              System Active
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* User chip */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-500 dark:to-indigo-600 text-white dark:text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/20 dark:shadow-blue-500/20">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{user?.name || "User"}</p>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold capitalize">{user?.role || "Member"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

        {/* ── Sidebar ── */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 backdrop-blur-xl shadow-md dark:shadow-slate-950/50 flex flex-col sticky top-[5.5rem] max-h-[calc(100vh-7rem)] overflow-y-auto transition-colors duration-300">

            {/* User Profile Section */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80
              bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-blue-950/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 dark:bg-blue-500/20 border-2 border-white/30 dark:border-blue-500/30 text-white dark:text-blue-300 font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-white dark:text-slate-100 truncate leading-tight">
                    {user?.name || "User"}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-blue-100 dark:text-slate-400 uppercase tracking-wider">
                      {user?.role || "Member"}
                    </span>
                    <span className="h-3 w-px bg-white/30 dark:bg-slate-700" />
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-200 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-blue-200 dark:text-slate-500 font-medium truncate">
                {user?.email || ""}
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="p-3 space-y-1 flex-1 overflow-y-auto">
              {Object.entries(groups).map(([groupName, items], gIdx) => (
                <div key={groupName}>
                  {/* Group label — only show if more than 1 group */}
                  {Object.keys(groups).length > 1 && (
                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 text-slate-400 dark:text-slate-600 ${gIdx > 0 ? "mt-3" : ""}`}>
                      {groupName}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {items.map((l) => (
                      <NavItem key={l.to} to={l.to} label={l.label} icon={l.icon} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sign Out */}
            <div className="p-3 shrink-0">
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <button
                  onClick={() => dispatch(logout())}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer
                    border-slate-200 dark:border-slate-800
                    text-slate-500 dark:text-slate-400
                    bg-slate-50 dark:bg-slate-950/50
                    hover:bg-red-50 dark:hover:bg-red-500/10
                    hover:border-red-200 dark:hover:border-red-500/30
                    hover:text-red-600 dark:hover:text-red-400"
                >
                  <FiLogOut className="text-sm" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="lg:col-span-9 flex flex-col min-h-0">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl shadow-md dark:shadow-slate-950/50 flex-1 overflow-hidden flex flex-col transition-colors duration-300">
            {/* Page Header Bar */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80
              bg-gradient-to-r from-slate-50 to-blue-50/30
              dark:from-slate-950/50 dark:to-indigo-950/20
              flex items-center justify-between">
              <div>
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-blue-600 dark:bg-blue-500" />
                  {title}
                </h1>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 ml-3">
                  Streamlined status submission & manager appraisal
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Live</span>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6 flex-1 overflow-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}