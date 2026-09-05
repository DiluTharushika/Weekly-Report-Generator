import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const { token, user, loading } = useSelector((s) => s.auth);

  // 1) Not logged in
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 2) Logged in but user still loading (/me not finished yet)
  if (loading || !user) {
    return <div className="p-6">Loading...</div>;
  }

  // 3) Role check (if provided)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4) OK
  return <Outlet />;
}