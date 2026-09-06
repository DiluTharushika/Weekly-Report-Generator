import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block rounded-xl px-3 py-2 text-sm font-medium ${
        isActive
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : "text-slate-700 hover:bg-slate-50"
      }`
    }
  >
    {label}
  </NavLink>
);

export default function DashboardLayout({ links, title = "Dashboard" }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <div className="mb-4">
              <div className="text-sm text-slate-500">Signed in as</div>
              <div className="font-semibold text-slate-900">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>

            <div className="space-y-1">
              {links.map((l) => (
                <NavItem key={l.to} to={l.to} label={l.label} />
              ))}
            </div>

            <button
              onClick={() => dispatch(logout())}
              className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-9">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-500">Weekly reporting platform</p>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-5">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}