import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { meThunk } from "./redux/slices/authSlice.js";

import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import NotFound from "./pages/common/NotFound.jsx";
import Unauthorized from "./pages/common/Unauthorized.jsx";

import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import ReportHistoryPage from "./pages/member/ReportHistoryPage.jsx";
import CreateReportPage from "./pages/member/CreateReportPage.jsx";
import EditReportPage from "./pages/member/EditReportPage.jsx";

import ReportDetailPage from "./pages/common/ReportDetailPage.jsx";

import ManagerDashboard from "./pages/manager/ManagerDashboard.jsx";
import TeamReportsPage from "./pages/manager/TeamReportsPage.jsx";

import { ROLES } from "./utils/constants.js";

function HomeRedirect() {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <div className="p-6">Loading...</div>;

  if (user.role === ROLES.MEMBER) return <Navigate to="/member" replace />;
  return <Navigate to="/manager" replace />;
}

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) dispatch(meThunk());
  }, [token, user, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={token ? <HomeRedirect /> : <Navigate to="/login" replace />}
        />

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* MEMBER area (Protected + Layout) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.MEMBER]} />}>
          <Route
            element={
              <DashboardLayout
                title="Member Area"
                links={[
                  { to: "/member", label: "Dashboard" },
                  { to: "/member/history", label: "My Report History" },
                  { to: "/member/reports/new", label: "New Report" },
                ]}
              />
            }
          >
            <Route path="/member" element={<MemberDashboard />} />
            <Route path="/member/history" element={<ReportHistoryPage />} />
            <Route path="/member/reports/new" element={<CreateReportPage />} />
            <Route path="/member/reports/:id/edit" element={<EditReportPage />} />
          </Route>
        </Route>

        {/* MANAGER/ADMIN area (Protected + Layout) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]} />}>
          <Route
            element={
              <DashboardLayout
                title="Manager Area"
                links={[
                  { to: "/manager", label: "Dashboard" },
                  { to: "/manager/reports", label: "Team Reports" },
                ]}
              />
            }
          >
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/reports" element={<TeamReportsPage />} />

            {/* placeholder until we build review page */}
            <Route
              path="/manager/reports/:id/review"
              element={<div className="p-6">Review Page (TODO)</div>}
            />
          </Route>
        </Route>

        {/* Report detail route (both member + manager can view) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/reports/:id" element={<ReportDetailPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}