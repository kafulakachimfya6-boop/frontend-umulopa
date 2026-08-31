import { useMemo, useState } from "react";
import { useAppState } from "../../context/useAppState";
import { scopeToHospital } from "../../utils/hospitalScope";

function TransfusionHistory() {
  const { transfusions, user } = useAppState();
  const hospitalTransfusions = scopeToHospital(transfusions, user);
  const [filter, setFilter] = useState("");
  const filteredTransfusions = useMemo(
    () => hospitalTransfusions.filter((item) => item.patient.toLowerCase().includes(filter.toLowerCase())),
    [hospitalTransfusions, filter]
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Transfusion History</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <p className="text-gray-600">View completed transfusions and patient outcomes.</p>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by patient"
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
              <th className="px-4 py-3">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransfusions.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.bloodType}</td>
                <td className="px-4 py-3">{item.units}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransfusionHistory;
