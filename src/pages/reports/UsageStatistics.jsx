import { useMemo } from "react";
import { useAppState } from "../../context/useAppState";
import { stockTotals, uniqueRecords } from "../../utils/analytics";
import { scopeToHospital } from "../../utils/hospitalScope";
import { getFacilityInventory } from "../../utils/networkInventory";
import { normaliseRole, ROLES } from "../../utils/roles";

export default function UsageStatistics() {
  const { user, stock = [], transfusions = [], bloodRequests = [], networkInventory = [] } = useAppState();
  const role = normaliseRole(user?.role);
  const isHospital = role === ROLES.HOSPITAL_STAFF;
  const scopedTransfusions = uniqueRecords(scopeToHospital(transfusions, user));
  const scopedRequests = uniqueRecords(scopeToHospital(bloodRequests, user));
  const scopedStock = isHospital
    ? getFacilityInventory(networkInventory, `HOSP-${user?.hospitalId}`).map((r) => ({ id: r.bloodGroup, type: r.bloodGroup, quantity: r.available, threshold: r.threshold }))
    : stock;
  const s = stockTotals(scopedStock);
  const usedByGroup = useMemo(() => { const map = {}; scopedTransfusions.forEach(t => { const g = t.bloodType || t.blood; if (g) map[g] = (map[g] || 0) + Number(t.units || 0); }); return [...new Set([...Object.keys(map), ...s.byGroup.map(x => x.name)])].map(type => ({ type, used: map[type] || 0, available: s.byGroup.find(x => x.name === type)?.value || 0 })); }, [scopedTransfusions, s.byGroup]);
  const totalUsed = usedByGroup.reduce((a, x) => a + x.used, 0);
  const totalRequested = scopedRequests.reduce((a, x) => a + Number(x.units || 0), 0);
  const scopeLabel = isHospital ? user?.hospital || "your hospital" : "the ZNBTS network";
  return <div><div className="mb-6"><h1 className="text-3xl font-bold">Usage Statistics</h1><p className="text-gray-600">Usage is calculated from recorded transfusions and permitted inventory for {scopeLabel}.</p></div><div className="grid md:grid-cols-3 gap-4 mb-8"><div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500">Units transfused</p><p className="text-3xl font-bold mt-3">{totalUsed}</p></div><div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500">Units requested</p><p className="text-3xl font-bold mt-3">{totalRequested}</p></div><div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500">Units currently available</p><p className="text-3xl font-bold mt-3">{s.totalUnits}</p></div></div><div className="bg-white rounded-xl shadow p-6 overflow-x-auto"><table className="min-w-full text-left"><thead><tr className="bg-gray-100"><th className="px-4 py-3">Blood Type</th><th className="px-4 py-3">Units Transfused</th><th className="px-4 py-3">Available Units</th></tr></thead><tbody>{usedByGroup.map(row => <tr key={row.type} className="border-t"><td className="px-4 py-3">{row.type}</td><td className="px-4 py-3">{row.used}</td><td className="px-4 py-3">{row.available}</td></tr>)}{!usedByGroup.length && <tr><td colSpan="3" className="px-4 py-8 text-center text-sm text-gray-500">No usage or inventory records are available in this scope.</td></tr>}</tbody></table></div></div>;
}
