export default function RecentRequests({ requests }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recent Blood Requests</h2>
          <p className="mt-2 text-sm text-gray-500">Track request status and patient needs.</p>
        </div>
        <div className="rounded-3xl bg-[#F3E9E9] px-4 py-2 text-sm font-medium text-[#6B0F1A]">Live feed</div>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Patient Name</th>
              <th className="px-4 py-3 text-left">Blood Group</th>
              <th className="px-4 py-3 text-left">Units</th>
              <th className="px-4 py-3 text-left">Request Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="bg-white hover:bg-gray-50 transition">
                <td className="px-4 py-4">{request.patient}</td>
                <td className="px-4 py-4">{request.bloodType}</td>
                <td className="px-4 py-4">{request.units}</td>
                <td className="px-4 py-4">{request.date}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${request.status === "Approved" ? "bg-green-100 text-green-800" : request.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
