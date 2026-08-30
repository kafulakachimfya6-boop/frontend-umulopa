export default function LowStockAlerts({ alerts }) {
  return (
    <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Low Stock Alerts</h2>
        <p className="mt-2 text-sm text-gray-500">Blood types requiring immediate attention.</p>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.type} className="flex items-center justify-between rounded-3xl border border-gray-200 bg-[#FFF5F5] px-4 py-4">
            <div>
              <p className="text-lg font-semibold text-gray-900">{alert.type}</p>
              <p className="mt-1 text-sm text-gray-600">{alert.remaining} Units Remaining</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${alert.severity === "Moderate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
              {alert.severity}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
