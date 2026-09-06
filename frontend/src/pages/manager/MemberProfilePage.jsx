import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserByIdApi } from "../../api/userApi.js";
import { getAllReportsApi } from "../../api/reportApi.js";
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiCheckCircle, 
  FiClock, 
  FiFileText, 
  FiAlertTriangle, 
  FiEye,
  FiArrowLeft
} from "react-icons/fi";

const StatusBadge = ({ status }) => {
  const styles =
    status === "Draft"
      ? "bg-slate-100 text-slate-700 border-slate-200"
      : status === "Submitted"
      ? "bg-blue-50 text-blue-700 border-blue-200/80 font-semibold"
      : status === "Needs Correction"
      ? "bg-amber-50 text-amber-800 border-amber-200/80 font-semibold"
      : "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        status === "Draft" ? "bg-slate-400" :
        status === "Submitted" ? "bg-blue-500 animate-pulse" :
        status === "Needs Correction" ? "bg-amber-500" : "bg-emerald-500"
      }`} />
      {status}
    </span>
  );
};

const formatWeek = (weekStart, weekEnd) => {
  const s = new Date(weekStart).toISOString().slice(0, 10);
  const e = new Date(weekEnd).toISOString().slice(0, 10);
  return `${s} → ${e}`;
};

export default function MemberProfilePage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [uData, rData] = await Promise.all([
        getUserByIdApi(id),
        getAllReportsApi({ user: id, page, limit }),
      ]);
      setUserProfile(uData.user);
      setReports(rData.items || []);
      setTotal(rData.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load team member profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  // Statistics calculation
  const approvedCount = reports.filter(r => r.status === "Approved").length;
  const submittedCount = reports.filter(r => r.status === "Submitted").length;
  const needsCorrectionCount = reports.filter(r => r.status === "Needs Correction").length;

  if (loading) return <div className="p-8 text-center text-xs text-slate-400">Loading team member profile...</div>;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
          {error}
        </div>
        <Link to="/manager/users" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600">
          <FiArrowLeft /> Back to Users List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link to="/manager/users" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <FiArrowLeft /> Back to Team Directory
        </Link>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white/20">
              {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">{userProfile?.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  userProfile?.isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {userProfile?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><FiMail className="text-indigo-400" /> {userProfile?.email}</span>
                <span className="flex items-center gap-1.5 capitalize"><FiShield className="text-indigo-400" /> Role: {userProfile?.role}</span>
                <span className="flex items-center gap-1.5"><FiClock className="text-indigo-400" /> Joined: {new Date(userProfile?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
              <div className="text-[11px] text-slate-300">Total Filed</div>
              <div className="text-lg font-bold text-white">{total}</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
              <div className="text-[11px] text-slate-300">Approved</div>
              <div className="text-lg font-bold text-emerald-400">{approvedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Approved Reports
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><FiCheckCircle className="text-base" /></div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600">{approvedCount}</div>
          <div className="mt-1 text-xs text-slate-400">Successfully verified submissions</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            In Review
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><FiClock className="text-base" /></div>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-600">{submittedCount}</div>
          <div className="mt-1 text-xs text-slate-400">Awaiting manager appraisal</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Needs Correction
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><FiAlertTriangle className="text-base" /></div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600">{needsCorrectionCount}</div>
          <div className="mt-1 text-xs text-slate-400">Pending user revisions</div>
        </div>
      </div>

      {/* Member Report History Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Full Report History</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical archive of all weekly reports submitted by {userProfile?.name}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50/70 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="text-left font-semibold px-5 py-3.5">Week Cycle</th>
                <th className="text-left font-semibold px-5 py-3.5">Project</th>
                <th className="text-left font-semibold px-5 py-3.5">Status</th>
                <th className="text-left font-semibold px-5 py-3.5">Last Updated</th>
                <th className="text-right font-semibold px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {formatWeek(r.weekStart, r.weekEnd)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {r.project?.name || "General"}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/reports/${r._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                    >
                      <FiEye className="text-sm" /> View Report
                    </Link>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td className="px-5 py-12 text-center text-slate-400" colSpan={5}>
                    No reports submitted by this team member yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
