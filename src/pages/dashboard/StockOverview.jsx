import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function StockOverview({ data }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Blood Stock Overview</h2>
          <p className="mt-2 text-sm text-gray-500">Current inventory trends for key blood groups.</p>
        </div>
        <div className="rounded-3xl bg-[#F8F0F0] px-4 py-2 text-sm font-medium text-[#A31621]">Updated 15 minutes ago</div>
      </div>

      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="group" tickLine={false} axisLine={false} />
            <YAxis orientation="left" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => `${value} units`} />
            <Bar dataKey="units" radius={[12, 12, 0, 0]} fill="#A31621" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
