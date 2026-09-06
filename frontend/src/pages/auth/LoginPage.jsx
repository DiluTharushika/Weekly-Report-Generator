import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../redux/slices/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginThunk({ email, password })).unwrap();
      navigate("/", { replace: true });
    } catch {
      // error shown from redux state
    }
  };

  return (
    <AuthLayout
      title="Welcome back to your workspace."
      subtitle="Log in to manage project progress, submit weekly status updates, or review team deliverables."
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Sign In</h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your organization email and password.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
            <input
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
            <input
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-12 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPw ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 text-sm font-semibold shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 transition-all cursor-pointer mt-2"
          disabled={loading}
          type="submit"
        >
          {loading ? "Authenticating..." : "Sign In to Workspace"}
        </button>

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{" "}
            <Link className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline ml-1" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}