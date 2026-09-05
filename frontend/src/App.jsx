import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { meThunk } from "./redux/slices/authSlice.js";

import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import NotFound from "./pages/common/NotFound.jsx";
import Unauthorized from "./pages/common/Unauthorized.jsx";

import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import ManagerDashboard from "./pages/manager/ManagerDashboard.jsx";
import ReportHistoryPage from "./pages/member/ReportHistoryPage.jsx";

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
        <Route
          path="/"
          element={token ? <HomeRedirect /> : <Navigate to="/login" replace />}
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* MEMBER routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.MEMBER]} />}>
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/member/history" element={<ReportHistoryPage />} />

          {/* temporary placeholders so links won't break */}
          <Route path="/member/reports/new" element={<div className="p-6">Create Report (TODO)</div>} />
          <Route path="/member/reports/:id/edit" element={<div className="p-6">Edit Report (TODO)</div>} />
        </Route>

        {/* MANAGER/ADMIN routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]} />}>
          <Route path="/manager" element={<ManagerDashboard />} />
        </Route>

        {/* Report detail route (used by View link) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/reports/:id" element={<div className="p-6">Report Detail (TODO)</div>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}