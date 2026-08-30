import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function DashboardBarChart({ data, dataKey = "value", labelKey = "name", color = "#A31621" }) {
  return <div className="h-72 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey={labelKey} /><YAxis /><Tooltip /><Legend /><Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
