import { useState } from "react";

const initialStock = [
  { id: 1, type: "A+", quantity: 8, threshold: 10 },
  { id: 2, type: "O-", quantity: 4, threshold: 8 },
  { id: 3, type: "B+", quantity: 12, threshold: 10 },
  { id: 4, type: "AB-", quantity: 3, threshold: 6 },
];

function LowStockReport() {
  const [stock, setStock] = useState(initialStock);
  const [message, setMessage] = useState("");

  const handleRefill = (id) => {
    setStock((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.threshold + 5 } : item
      )
    );
    setMessage("Stock refilled successfully.");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Low Stock Report</h1>
          <p className="text-gray-600">Monitor blood types currently below threshold levels.</p>
        </div>
        <div className="rounded-xl bg-red-100 px-4 py-3 text-red-800">
          {stock.filter((item) => item.quantity < item.threshold).length} low stock types
        </div>
      </div>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3">Blood Type</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Threshold</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => {
              const low = item.quantity < item.threshold;
              return (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{item.threshold}</td>
                  <td className={`px-4 py-3 ${low ? "text-red-600" : "text-green-600"}`}>
                    {low ? "Low" : "Sufficient"}
                  </td>
                  <td className="px-4 py-3">
                    {low ? (
                      <button
                        onClick={() => handleRefill(item.id)}
                        className="bg-[#6D0F14] text-white px-4 py-2 rounded-lg hover:bg-red-900 transition"
                      >
                        Refill
                      </button>
                    ) : (
                      <span className="text-gray-500">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LowStockReport;
