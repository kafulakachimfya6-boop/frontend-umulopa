import { useState } from "react";
import { useAppState } from "../../context/useAppState";

function AddPatient() {
  const { patients, setPatients } = useAppState();
  const [form, setForm] = useState({
    fullName: "",
    patientId: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    medicalCondition: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextId = patients.length + 1;
    const patientRecord = {
      id: nextId,
      fullName: form.fullName,
      patientId: form.patientId || `P-${Date.now()}`,
      dob: form.dob,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      address: form.address,
      bloodGroup: form.bloodGroup,
      medicalCondition: form.medicalCondition,
      registeredAt: new Date().toISOString(),
    };

    setPatients((prev) => [...prev, patientRecord]);
    setMessage("Patient registered successfully.");
    setForm({ fullName: "", patientId: "", dob: "", gender: "", phone: "", email: "", address: "", bloodGroup: "", medicalCondition: "" });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Add Patient</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2 md:col-span-2">
            <span className="font-semibold text-gray-700">Full Name</span>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>

          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Patient ID</span>
            <input
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              placeholder="Optional (auto-generated)"
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>

          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Date of Birth</span>
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>

          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Gender</span>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Phone Number</span>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>

          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="font-semibold text-gray-700">Address</span>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>

          <label className="space-y-2">
            <span className="font-semibold text-gray-700">Blood Group</span>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select blood group</option>
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

          <label className="space-y-2 md:col-span-2">
            <span className="font-semibold text-gray-700">Medical Condition</span>
            <textarea
              name="medicalCondition"
              value={form.medicalCondition}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>
        </div>

        <button type="submit" className="mt-6 bg-[#6D0F14] text-white rounded-lg px-6 py-3 hover:bg-red-900 transition">
          Register Patient
        </button>

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </form>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Registered Patients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">DOB</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Blood Group</th>
                <th className="px-4 py-3">Medical Condition</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="px-4 py-3">{patient.fullName}</td>
                  <td className="px-4 py-3">{patient.patientId}</td>
                  <td className="px-4 py-3">{patient.dob}</td>
                  <td className="px-4 py-3">{patient.gender}</td>
                  <td className="px-4 py-3">{patient.phone}</td>
                  <td className="px-4 py-3">{patient.email}</td>
                  <td className="px-4 py-3">{patient.address}</td>
                  <td className="px-4 py-3">{patient.bloodGroup}</td>
                  <td className="px-4 py-3">{patient.medicalCondition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddPatient;
