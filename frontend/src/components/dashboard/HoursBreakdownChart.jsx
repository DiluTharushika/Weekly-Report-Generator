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
              <span className="font-bold text-white">{entry.value} hrs</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function HoursBreakdownChart({ hoursBreakdown }) {
  if (!hoursBreakdown) return null;

  const data = [
    { name: "Development", hours: hoursBreakdown.development || 0, fill: "#6366F1" },
    { name: "Testing", hours: hoursBreakdown.testing || 0, fill: "#EC4899" },
    { name: "Meetings", hours: hoursBreakdown.meetings || 0, fill: "#F59E0B" },
    { name: "Documentation", hours: hoursBreakdown.documentation || 0, fill: "#10B981" },
    { name: "Other", hours: hoursBreakdown.other || 0, fill: "#94A3B8" },
  ];

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
          <Bar dataKey="hours" name="Time Spent" radius={[6, 6, 0, 0]} barSize={36}>
            {data.map((entry, index) => (
              <path key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
