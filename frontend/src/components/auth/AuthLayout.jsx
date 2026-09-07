import { FiCheckCircle, FiShield, FiTrendingUp } from "react-icons/fi";
import ThemeToggle from "../common/ThemeToggle.jsx";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased flex flex-col justify-center transition-colors duration-300 relative overflow-hidden">
      {/* Top right theme toggle for Auth screens */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT BRANDING PANEL */}
        <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-slate-900 border-r border-slate-800 flex-col justify-between p-12 lg:p-16">
          {/* Background Decorative Gradients - Vibrant Blue and Amber/Yellow */}
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 h-80 w-80 rounded-full bg-yellow-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25">
              WR
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">
                ReportHub Enterprise
              </span>
              <span className="text-xs font-semibold text-yellow-400 tracking-wider uppercase">
                Team Execution & Weekly Progress
              </span>
            </div>
          </div>

          {/* Center Hero Text */}
          <div className="relative z-10 my-auto max-w-xl text-left py-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
              <FiShield className="text-sm text-yellow-400" />
              <span>Enterprise Grade Reporting</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {title}
            </h1>
            
            {subtitle && (
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Feature Highlights Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
              {[
                { label: "Draft & Submit Workflow", desc: "Structured weekly reporting" },
                { label: "Manager Approvals", desc: "Granular feedback & status tracking" },
                { label: "Version Control", desc: "Historical audit trail of edits" },
                { label: "Team Analytics", desc: "Real-time execution stats" },
              ].map((f, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <FiCheckCircle className="text-amber-400 text-lg shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white">{f.label}</div>
                    <div className="text-[11px] text-slate-400">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Quote */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>© {new Date().getFullYear()} ReportHub Inc. All rights reserved.</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <FiTrendingUp className="text-amber-400" /> Operational Efficiency Platform
            </span>
          </div>
        </div>

        {/* RIGHT FORM CONTAINER */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="w-full max-w-md space-y-6">
            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-lg">
                WR
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">
                ReportHub
              </span>
            </div>

            {/* Card wrapper with Glassmorphism */}
            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl dark:shadow-slate-950/80 text-slate-900 dark:text-white backdrop-blur-xl transition-colors duration-300">
              {children}
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Secure TLS 256-bit encrypted authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}