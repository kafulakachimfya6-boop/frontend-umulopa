import { Link } from "react-router-dom";
import { useAppState } from "../../context/useAppState";
import StatusBadge from "../../components/StatusBadge";
import { getFacilityInventory, ZNBTS_FACILITY_ID } from "../../utils/networkInventory";
import { normaliseRole, ROLES } from "../../utils/roles";

function InventoryDashboard() {
  const { user, networkInventory = [] } = useAppState();
  const role = normaliseRole(user?.role);
  const isHospital = role === ROLES.HOSPITAL_STAFF;
  const facilityId = isHospital ? `HOSP-${user.hospitalId}` : ZNBTS_FACILITY_ID;
  const rows = getFacilityInventory(networkInventory, facilityId);
  const lowCount = rows.filter((item) => item.available < item.threshold).length;
  const total = rows.reduce((sum, item) => sum + Number(item.available || 0), 0);
  const testing = rows.reduce((sum, item) => sum + Number(item.testing || 0), 0);
  const expired = rows.reduce((sum, item) => sum + Number(item.expired || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isHospital ? "Hospital Blood Inventory" : "ZNBTS Blood Inventory"}</h1>
          <p className="mt-2 text-gray-600">{isHospital ? `Only inventory belonging to ${user.hospital} is shown here.` : "Manage the ZNBTS Kitwe Blood Centre inventory and expiry lifecycle."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/network/inventory" className="rounded-xl border border-[#7A0916] px-4 py-3 text-sm font-semibold text-[#7A0916]">Live availability</Link>
          {(!isHospital || user?.subRole === "Blood Bank Officer" || user?.subRole === "Hospital Administrator") && <Link to={isHospital ? "/inventory/add?action=collect" : "/inventory/add?action=receive-external"} className="rounded-xl bg-[#7A0916] px-5 py-3 text-sm font-semibold text-white">{isHospital ? "Record collection" : "Receive external blood"}</Link>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[['Available units', total, 'Usable stock'], ['Testing', testing, 'Not yet available for issue'], ['Expired', expired, 'Removed from available stock'], ['Low stock groups', lowCount, 'Below configured threshold']].map(([label, value, note]) => (
          <Link to={label==='Available units'?'/network/inventory':label==='Testing'?(isHospital?'/staff/blood-bank':'/inventory/add?action=release'):label==='Expired'?'/network/inventory':'/reports/low-stock'} key={label} className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><p className="text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-gray-500">{note}</p></Link>
        ))}
      </div>

      {!isHospital && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Receive hospital collection","/inventory/add?action=receive-testing"],["Release tested blood","/inventory/add?action=release"],["Discard blood","/inventory/add?action=discard"],["Adjust stock","/inventory/add?action=adjust"]].map(([label,to])=><Link key={to} to={to} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-[#8f1220] hover:bg-rose-50">{label}</Link>)}</div>}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100"><tr><th className="px-4 py-3">Blood Type</th><th className="px-4 py-3">Available</th><th className="px-4 py-3">Testing</th><th className="px-4 py-3">Reserved</th><th className="px-4 py-3">Expired</th><th className="px-4 py-3">Threshold</th><th className="px-4 py-3">Status</th></tr></thead>
          <tbody>{rows.map((item) => { const low = item.available < item.threshold; return <tr key={item.bloodGroup} className="border-t"><td className="px-4 py-3 font-semibold">{item.bloodGroup}</td><td className="px-4 py-3">{item.available}</td><td className="px-4 py-3">{item.testing}</td><td className="px-4 py-3">{item.reserved}</td><td className="px-4 py-3">{item.expired}</td><td className="px-4 py-3">{item.threshold}</td><td className="px-4 py-3"><StatusBadge status={low ? "danger" : "success"}>{low ? "Low Stock" : "Adequate"}</StatusBadge></td></tr> })}</tbody>
        </table>
      </div>
    </div>
  );
}
export default InventoryDashboard;
