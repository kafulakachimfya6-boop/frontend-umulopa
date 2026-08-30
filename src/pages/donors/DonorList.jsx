import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../../context/useAppState";

function DonorList() {
  const { donors, setDonors, user } = useAppState();
  const visibleDonors = user?.hospitalId ? donors.filter((d) => String(d.nearestHospitalId ?? "") === String(user.hospitalId)) : donors;
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", bloodType: "", phone: "", email: "" });

  const filtered = useMemo(
    () => visibleDonors.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())),
    [visibleDonors, search]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setDonors((prev) => [...prev, { id: `DON-${Date.now()}`, ...form, nearestHospitalId: user?.hospitalId || null, status: "Active", verified: false, registeredAt: new Date().toISOString() }]);
    setForm({ name: "", bloodType: "", phone: "", email: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donors</h1>
          <p className="mt-2 text-gray-600">Manage registered blood donors and their profiles for {user?.hospital || "your hospital"}.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-[#7A0916] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a0610]"
        >
          {showForm ? "Cancel" : "Add Donor"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="font-semibold text-gray-700">Full Name</span>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-lg border px-4 py-2" />
            </label>
            <label className="space-y-2">
              <span className="font-semibold text-gray-700">Blood Type</span>
              <select name="bloodType" value={form.bloodType} onChange={handleChange} required className="w-full rounded-lg border px-4 py-2">
                <option value="">Select type</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="font-semibold text-gray-700">Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border px-4 py-2" placeholder="+260 XX XXX XXXX" />
            </label>
            <label className="space-y-2">
              <span className="font-semibold text-gray-700">Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border px-4 py-2" />
            </label>
          </div>
          <button type="submit" className="mt-4 rounded-xl bg-[#7A0916] px-6 py-3 text-white hover:bg-[#5a0610]">
            Save Donor
          </button>
        </form>
      ) : null}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search donors..."
          className="w-full rounded-lg border px-4 py-2 md:max-w-sm"
        />
        <p className="text-sm text-gray-500">{filtered.length} donor(s)</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Blood Type</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((donor) => (
              <tr key={donor.id} className="border-t">
                <td className="px-4 py-3">{donor.name}</td>
                <td className="px-4 py-3">{donor.bloodType}</td>
                <td className="px-4 py-3">{donor.phone || "—"}</td>
                <td className="px-4 py-3">{donor.email || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500">
        Need to register as a donor online? <Link to="/signup" className="font-semibold text-[#7A0916]">Public signup</Link>
      </p>
    </div>
  );
}

export default DonorList;
