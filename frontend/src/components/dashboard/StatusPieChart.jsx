import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = {
  Approved: "#10B981", // Emerald
  Submitted: "#3B82F6", // Blue
  "Needs Correction": "#F59E0B", // Amber
  Draft: "#94A3B8" // Slate
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-2.5 text-xs text-white shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-semibold">{data.name}:</span>
          <span className="font-bold text-indigo-300">{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function StatusPieChart({ summary }) {
  if (!summary) return null;

  const data = [
    { name: "Approved", value: summary.approvedCount || 0 },
    { name: "Submitted", value: summary.submittedCount || 0 },
    { name: "Needs Correction", value: summary.needsCorrectionCount || 0 },
    { name: "Draft", value: summary.draftCount || 0 },
  ].filter((item) => item.value > 0);

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
        No report metrics to render pie chart.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#CBD5E1"} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
