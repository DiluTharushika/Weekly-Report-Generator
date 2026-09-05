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
      title="Create your account"
      subtitle="Start submitting consistent weekly reports and track approvals."
    >
      <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
      <p className="text-sm text-slate-500 mt-1">
        Create a member account (admin assigns roles if needed).
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
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
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-300 pl-10 pr-12 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPw ? "text" : "password"}
              placeholder="Min 6 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label="Toggle password visibility"
            >
              {showPw ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <button
          className="w-full rounded-xl bg-emerald-600 text-white py-2.5 font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm text-slate-600 text-center">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}