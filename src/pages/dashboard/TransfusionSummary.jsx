import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TransfusionSummary({ data, colors }) {
  const statusCounts = data.map((item) => ({
    ...item,
    percent: `${Math.round((item.value / data.reduce((sum, next) => sum + next.value, 0)) * 100)}%`,
  }));

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Transfusions This Week</h2>
          <p className="mt-2 text-sm text-gray-500">Total transfusions and distribution by type.</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-gray-900">34</p>
          <p className="text-sm text-gray-500">Total this week</p>
        </div>
      </div>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} units`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid gap-3">
        {statusCounts.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-700">{item.name}</span>
            <span className="text-sm font-semibold text-gray-900">{item.percent}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
