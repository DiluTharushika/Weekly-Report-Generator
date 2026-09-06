import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";
import { 
  FiGrid, 
  FiClock, 
  FiPlusCircle, 
  FiLogOut, 
  FiCheckSquare,
  FiUserCheck,
  FiTrendingUp
} from "react-icons/fi";

const NavItem = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    end={to === "/member" || to === "/manager"}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`
    }
  >
    {Icon && <Icon className="text-lg shrink-0" />}
    <span>{label}</span>
  </NavLink>
);

export default function DashboardLayout({ links, title = "Dashboard" }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const getIconForLink = (to) => {
    if (to.endsWith("/history")) return FiClock;
    if (to.endsWith("/new")) return FiPlusCircle;
    if (to === "/manager") return FiTrendingUp;
    return FiGrid;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              WR
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block leading-none">
                Report Hub
              </span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Enterprise Reporting
              </span>
            </div>
          </div>

          {/* Right Header Status / User Quick View */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 border-r border-slate-200 pr-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600">
                System Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-sm flex items-center justify-center uppercase shadow-xs">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] text-slate-500 capitalize">
                  {user?.role || "Member"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-4 sticky top-22">
            <div className="mb-4 pb-3 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <FiUserCheck className="text-lg" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Logged in as
                </div>
                <div className="text-sm font-bold text-slate-900 truncate max-w-[170px]">
                  {user?.name}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {links.map((l) => (
                <NavItem
                  key={l.to}
                  to={l.to}
                  label={l.label}
                  icon={getIconForLink(l.to)}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => dispatch(logout())}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-red-50 hover:border-red-200 hover:text-red-600 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors duration-200 cursor-pointer"
              >
                <FiLogOut className="text-base" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 flex flex-col">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  {title}
                </h1>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Streamlined status submission & manager appraisal
                </p>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6 flex-1">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}