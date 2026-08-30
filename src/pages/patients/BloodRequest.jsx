import { useState } from "react";
import { useAppState } from "../../context/useAppState";
import { scopeToHospital } from "../../utils/hospitalScope";

function BloodRequest() {
  const { bloodRequests, setBloodRequests, user } = useAppState();
  const visibleRequests = scopeToHospital(bloodRequests, user);
  const [form, setForm] = useState({ patient: "", bloodType: "", units: "", urgency: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextId = Date.now();
    const duplicate = bloodRequests.some((r) => (String(r.hospitalId) === String(user?.hospitalId)) && r.patient === form.patient.trim() && r.bloodType === form.bloodType && Number(r.units) === Number(form.units) && r.status === "Pending");
    if (duplicate) { setMessage("An identical pending blood request already exists for this patient."); return; }
    setBloodRequests((prev) => [...prev, { id: nextId, ...form, patient: form.patient.trim(), units: Number(form.units), hospitalId: user?.hospitalId || null, hospitalName: user?.hospital || null, status: "Pending", createdAt: new Date().toISOString() }]);
    setMessage("Blood request submitted successfully.");
    setForm({ patient: "", bloodType: "", units: "", urgency: "" });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Blood Request</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Patient Name</span>
            <input
              name="patient"
              value={form.patient}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Blood Type</span>
            <select
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Units Required</span>
            <input
              name="units"
              type="number"
              min="1"
              value={form.units}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Urgency</span>
            <select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select urgency</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
        </div>

        <button type="submit" className="mt-6 bg-[#6D0F14] text-white rounded-lg px-6 py-3 hover:bg-red-900 transition">
          Submit Request
        </button>

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </form>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Blood Type</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleRequests.map((request) => (
                <tr key={request.id} className="border-t">
                  <td className="px-4 py-3">{request.patient}</td>
                  <td className="px-4 py-3">{request.bloodType}</td>
                  <td className="px-4 py-3">{request.units}</td>
                  <td className="px-4 py-3">{request.urgency}</td>
                  <td className="px-4 py-3">{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BloodRequest;
