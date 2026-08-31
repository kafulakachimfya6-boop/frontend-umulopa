import { useMemo, useState } from "react";
import { useAppState } from "../../context/useAppState";
import { scopeToHospital } from "../../utils/hospitalScope"

function RequestHistory() {
  const { history, user } = useAppState();
  const hospitalHistory = scopeToHospital(history, user);
  const [search, setSearch] = useState("");
  const filteredHistory = useMemo(
    () => hospitalHistory.filter((item) => item.patient.toLowerCase().includes(search.toLowerCase())),
    [hospitalHistory, search]
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Request History</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <p className="text-gray-600">Review past blood request activity and status updates.</p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient"
          className="border rounded-lg px-4 py-2 w-full md:w-80"
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Blood Type</th>
              <th className="px-4 py-3">Units</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.bloodType}</td>
                <td className="px-4 py-3">{item.units}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestHistory;
