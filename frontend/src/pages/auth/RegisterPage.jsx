import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../redux/slices/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerThunk({ name, email, password, role: "member" })).unwrap();
      navigate("/", { replace: true });
    } catch {
      // error shown from redux state
    }
  };

  return (
    <AuthLayout
      title="Join your team workspace today."
      subtitle="Create your account to start submitting weekly progress, logging key highlights, and collaborating."
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Standard member access (roles can be upgraded by workspace admins).
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
            <input
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Work Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
            <input
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
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
              placeholder="Minimum 6 characters"
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

        <button
          className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 text-sm font-semibold shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 transition-all cursor-pointer mt-2"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creating Account..." : "Register Account"}
        </button>

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Already registered?{" "}
            <Link className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline ml-1" to="/login">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}