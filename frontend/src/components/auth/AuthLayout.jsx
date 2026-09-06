import { FiCheckCircle, FiShield, FiTrendingUp } from "react-icons/fi";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased flex flex-col justify-center">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT BRANDING PANEL */}
        <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-slate-900 border-r border-slate-800 flex-col justify-between p-12 lg:p-16">
          {/* Background Decorative Gradients */}
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25">
              WR
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">
                ReportHub Enterprise
              </span>
              <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">
                Team Execution & Weekly Progress
              </span>
            </div>
          </div>

          {/* Center Hero Text */}
          <div className="relative z-10 my-auto max-w-xl text-left py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
              <FiShield className="text-sm" />
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
                  <FiCheckCircle className="text-emerald-400 text-lg shrink-0 mt-0.5" />
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
              <FiTrendingUp className="text-emerald-400" /> Operational Efficiency Platform
            </span>
          </div>
        </div>

        {/* RIGHT FORM CONTAINER */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
          <div className="w-full max-w-md space-y-6">
            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                WR
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight">
                ReportHub
              </span>
            </div>

            {/* Card wrapper */}
            <div className="bg-slate-900 border border-slate-800/90 rounded-3xl p-8 shadow-2xl shadow-slate-950/80 text-white backdrop-blur-xl">
              {children}
            </div>

            <p className="text-center text-xs text-slate-500">
              Secure TLS 256-bit encrypted authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}