export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className="hidden lg:block relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 opacity-90" />
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 h-full px-14 py-12 text-white flex flex-col">
            <div className="text-left">
              <div className="text-3xl font-bold tracking-tight">
                Weekly Report System
              </div>
              <p className="mt-4 text-white/90 leading-relaxed max-w-xl">
                Submit weekly reports, follow a manager review workflow, and track
                team progress with dashboards and insights.
              </p>
            </div>

            <div className="flex-1 flex items-center">
              <div className="max-w-xl text-left">
                <h2 className="text-4xl font-semibold leading-tight">{title}</h2>
                {subtitle && (
                  <p className="mt-3 text-white/90 leading-relaxed">{subtitle}</p>
                )}

                <div className="mt-7 flex flex-wrap gap-2 text-sm">
                  {[
                    "Draft → Submit",
                    "Review & Approve",
                    "Needs Correction",
                    "Version History",
                    "Team Dashboard",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/15 px-3 py-1 border border-white/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs text-white/75 text-left">
              © {new Date().getFullYear()} Internal Tool
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-4 py-10 bg-slate-950">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
              {children}
            </div>
            <p className="text-center text-xs text-slate-400 mt-6">
              Tip: use your seeded accounts to test workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}