import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs text-white shadow-xl backdrop-blur-md">
        <p className="font-bold text-indigo-300 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function StatusByMemberChart({ statusByMember }) {
  const data = Object.entries(statusByMember || {}).map(([name, s]) => ({
    name,
    Draft: s["Draft"] || 0,
    Submitted: s["Submitted"] || 0,
    "Needs Correction": s["Needs Correction"] || 0,
    Approved: s["Approved"] || 0,
  }));

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
        No report metrics available for chart display.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={{ stroke: '#CBD5E1' }}
            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis 
            allowDecimals={false} 
            tickLine={false} 
            axisLine={{ stroke: '#CBD5E1' }}
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: '600' }}
          />
          <Bar dataKey="Draft" stackId="a" fill="#94A3B8" radius={[0, 0, 0, 0]} barSize={28} />
          <Bar dataKey="Submitted" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} barSize={28} />
          <Bar dataKey="Needs Correction" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} barSize={28} />
          <Bar dataKey="Approved" stackId="a" fill="#10B981" radius={[6, 6, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}