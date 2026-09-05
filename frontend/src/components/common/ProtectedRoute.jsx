import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, user } = useSelector((s) => s.auth);

  // not logged in
  if (!token) return <Navigate to="/login" replace />;

  // user not loaded yet (meThunk still running)
  if (!user) return <div className="p-6">Loading...</div>;

  // role check (optional)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}