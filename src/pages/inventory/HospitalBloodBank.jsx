import { useMemo, useState } from "react";
import { FaArrowRight, FaExchangeAlt, FaPlus, FaTint, FaTruck, FaExclamationTriangle } from "react-icons/fa";
import { useAppState } from "../../context/useAppState";
import { applyInventoryChange, getFacilityInventory, INVENTORY_STATES } from "../../utils/networkInventory";
import { ROLES, normaliseRole } from "../../utils/roles";
import { hasCapability } from "../../utils/hospitalCapabilities";
import { consumeLots, makeLot, createReference } from "../../utils/bloodInventory";

const GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const input = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#8f1220] focus:bg-white";

export default function HospitalBloodBank() {
  const { user, hospitals = [], networkInventory = [], setNetworkInventory, inventoryLots = [], setInventoryLots, setInventoryTransactions, bloodRequests = [], setBloodRequests, setAuditLogs, transfers = [], setTransfers } = useAppState();
  const role = normaliseRole(user?.role);
  const hospitalId = Number(user?.hospitalId);
  const facilityId = `HOSP-${hospitalId}`;
  const hospital = hospitals.find(h => Number(h.id) === hospitalId);
  const facilityName = hospital?.name || user?.hospital || "Registered Hospital";
  const ownRows = useMemo(() => getFacilityInventory(networkInventory, facilityId), [networkInventory, facilityId]);
  const ownLots = inventoryLots.filter(l => l.facilityId === facilityId);
  const capabilities = { collection: hasCapability(hospital,"collection"), testing: hasCapability(hospital,"testing"), storage: hasCapability(hospital,"storage"), processing: hasCapability(hospital,"processing"), crossmatching: hasCapability(hospital,"crossmatching"), issue: hasCapability(hospital,"issue") };
  const nearbyIds = hospital?.nearbyHospitalIds || [];
  const nearbyHospitals = hospitals.filter(h => h.status === "Active" && Number(h.id) !== hospitalId && (nearbyIds.length ? nearbyIds.includes(Number(h.id)) : true));
  const incoming = bloodRequests.filter(r => r.requestType === "NEARBY_HOSPITAL" && Number(r.sourceHospitalId) === hospitalId && ["Pending Nearby", "Accepted"].includes(r.status));
  const outgoing = bloodRequests.filter(r => r.requestType === "NEARBY_HOSPITAL" && Number(r.requestingHospitalId) === hospitalId).slice(0, 20);
  const [mode, setMode] = useState("collection");
  const [form, setForm] = useState({ bloodGroup: "", units: "", collectionDate: new Date().toISOString().slice(0, 10), expiryDate: "", reference: "" });
  const [request, setRequest] = useState({ bloodGroup: "", units: "", sourceHospitalId: "", urgency: "Emergency", patient: "", reason: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (role !== ROLES.HOSPITAL_STAFF) return <div className="rounded-3xl border border-slate-200 bg-white p-8"><h1 className="text-2xl font-bold">Hospital Blood Bank</h1><p className="mt-2 text-slate-600">This operational module is available to hospital staff accounts.</p></div>;

  const update = (e) => setForm(v => ({ ...v, [e.target.name]: e.target.value }));
  const recordCollection = (e) => {
    e.preventDefault(); setError(""); setMessage("");
    const units = Number(form.units); if (!capabilities.collection) return setError("Your hospital is not authorized by ZNBTS for blood collection."); if (!capabilities.storage) return setError("Your hospital is not authorized by ZNBTS for blood storage. Collection must be coordinated for immediate transfer to an authorized facility."); if (!form.bloodGroup || units < 1 || !form.collectionDate) return setError("Select a blood group, enter a positive unit count and collection date.");
    try {
      const result = applyInventoryChange(networkInventory, { facilityId, facilityName, facilityType: "Hospital", province: "Copperbelt", district: hospital?.district, bloodGroup: form.bloodGroup, quantity: units, deltaPendingTesting: capabilities.testing ? 0 : units, deltaTesting: capabilities.testing ? units : 0, transactionType: capabilities.testing ? "DONATION_COLLECTED_FOR_AUTHORIZED_TESTING" : "DONATION_COLLECTED_AWAITING_ZNBTS_TESTING", referenceId: form.reference || `COL-${Date.now()}`, performedBy: user.email });
      setNetworkInventory(result.rows); setInventoryTransactions(v => [result.transaction, ...v]);
      const lot = { id: `LOT-${Date.now()}`, facilityId, facilityName, bloodGroup: form.bloodGroup, quantity: units, remaining: units, collectionDate: form.collectionDate, expiryDate: form.expiryDate || "", status: capabilities.testing ? INVENTORY_STATES.TESTING : INVENTORY_STATES.PENDING_TESTING, source: "Hospital collection", testingAuthority: capabilities.testing ? facilityName : "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)" };
      setInventoryLots(v => [lot, ...v]); setAuditLogs(v => [{ id: Date.now(), event: "Hospital blood collection recorded", hospitalId, role: ROLES.HOSPITAL_STAFF, detail: `${units} ${form.bloodGroup} unit(s) collected at ${facilityName}`, time: new Date().toLocaleString() }, ...v]);
      setMessage(`${units} ${form.bloodGroup} unit(s) recorded. ${capabilities.testing ? "The lot is in authorized hospital testing." : "The lot is awaiting ZNBTS testing/authorization."} ZNBTS can see the live status.`); setForm(v => ({ ...v, bloodGroup: "", units: "", reference: "" }));
    } catch (err) { setError(err.message); }
  };

  const releaseLot = (lot) => {
    setError("");
    if (!capabilities.testing) return setError("Only a ZNBTS-authorized testing facility can clear collected blood for clinical availability.");
    if (lot.status !== INVENTORY_STATES.TESTING || lot.remaining < 1) return;
    try {
      const result = applyInventoryChange(networkInventory, { facilityId, facilityName, facilityType: "Hospital", province: "Copperbelt", district: hospital?.district, bloodGroup: lot.bloodGroup, quantity: lot.remaining, deltaTesting: -lot.remaining, deltaAvailable: lot.remaining, transactionType: "TESTING_CLEARED", referenceId: lot.id, performedBy: user.email });
      setNetworkInventory(result.rows); setInventoryTransactions(v => [result.transaction, ...v]); setInventoryLots(v => v.map(x => x.id === lot.id ? { ...x, status: INVENTORY_STATES.AVAILABLE } : x)); setAuditLogs(v => [{ id: Date.now(), event: "Blood lot cleared for use", hospitalId, role: ROLES.HOSPITAL_STAFF, detail: `${lot.remaining} ${lot.bloodGroup} unit(s) cleared at ${facilityName}`, time: new Date().toLocaleString() }, ...v]);
    } catch (err) { setError(err.message); }
  };

  const expireLot = (lot) => {
    if (lot.status !== INVENTORY_STATES.AVAILABLE || lot.remaining < 1) return;
    try {
      const result = applyInventoryChange(networkInventory, { facilityId, facilityName, facilityType: "Hospital", province: "Copperbelt", district: hospital?.district, bloodGroup: lot.bloodGroup, quantity: lot.remaining, deltaAvailable: -lot.remaining, deltaExpired: lot.remaining, transactionType: "EXPIRED", referenceId: lot.id, performedBy: user.email });
      setNetworkInventory(result.rows); setInventoryTransactions(v => [result.transaction, ...v]); setInventoryLots(v => v.map(x => x.id === lot.id ? { ...x, remaining: 0, status: INVENTORY_STATES.EXPIRED } : x)); setAuditLogs(v => [{ id: Date.now(), event: "Hospital blood expiry recorded", hospitalId, role: ROLES.HOSPITAL_STAFF, detail: `${lot.remaining} ${lot.bloodGroup} unit(s) expired at ${facilityName}`, time: new Date().toLocaleString() }, ...v]);
    } catch (err) { setError(err.message); }
  };

  const recordUsage = (group, units, reference) => {
    const qty = Number(units); if (!group || qty < 1) return;
    const current = ownRows.find(r => r.bloodGroup === group)?.available || 0;
    if (qty > current) return setError(`Only ${current} ${group} unit(s) are available at ${facilityName}.`);
    try {
      let rows = networkInventory;
      let remainingToIssue = qty;
      const selectedLots = ownLots.filter(l => l.bloodGroup === group && l.status === INVENTORY_STATES.AVAILABLE && l.remaining > 0).sort((a,b) => String(a.expiryDate).localeCompare(String(b.expiryDate)));
      const tx = [];
      const lotUpdates = new Map();
      for (const lot of selectedLots) {
        if (!remainingToIssue) break;
        const take = Math.min(remainingToIssue, Number(lot.remaining));
        const result = applyInventoryChange(rows, { facilityId, facilityName, facilityType: "Hospital", province: "Copperbelt", district: hospital?.district, bloodGroup: group, quantity: take, deltaAvailable: -take, deltaIssued: take, transactionType: "ISSUED", referenceId: reference || `USE-${Date.now()}`, performedBy: user.email });
        rows = result.rows; tx.push(result.transaction); lotUpdates.set(lot.id, Math.max(0, lot.remaining - take)); remainingToIssue -= take;
      }
      if (remainingToIssue > 0) throw new Error("No sufficient lot-level stock was found for this issue.");
      setNetworkInventory(rows); setInventoryTransactions(v => [...tx, ...v]); setInventoryLots(v => v.map(l => lotUpdates.has(l.id) ? { ...l, remaining: lotUpdates.get(l.id), status: lotUpdates.get(l.id) === 0 ? INVENTORY_STATES.ISSUED : l.status } : l)); setAuditLogs(v => [{ id: Date.now(), event: "Hospital blood usage recorded", hospitalId, role: ROLES.HOSPITAL_STAFF, detail: `${qty} ${group} unit(s) issued/used at ${facilityName}`, time: new Date().toLocaleString() }, ...v]); setMessage(`${qty} ${group} unit(s) recorded as issued/used.`);
    } catch (err) { setError(err.message); }
  };

  const submitNearbyRequest = (e) => {
    e.preventDefault(); setError(""); setMessage(""); const units = Number(request.units); const source = hospitals.find(h => Number(h.id) === Number(request.sourceHospitalId));
    if (!request.bloodGroup || units < 1 || !source || !request.patient || !request.reason) return setError("Complete the blood group, units, source hospital, patient/reference and reason.");
    const available = getFacilityInventory(networkInventory, `HOSP-${source.id}`).find(r => r.bloodGroup === request.bloodGroup)?.available || 0;
    if (available < units) return setError(`${source.name} currently has only ${available} ${request.bloodGroup} available.`);
    const record = { id: `NHR-${Date.now()}`, requestType: "NEARBY_HOSPITAL", patient: request.patient, bloodType: request.bloodGroup, units, urgency: request.urgency, reason: request.reason, status: "Pending Nearby", requestingHospitalId: hospitalId, requestingHospitalName: facilityName, sourceHospitalId: Number(source.id), sourceHospitalName: source.name, requestedBy: user.email, createdAt: new Date().toISOString(), escalationStatus: "Nearby First" };
    setBloodRequests(v => [record, ...v]); setAuditLogs(v => [{ id: Date.now(), event: "Inter-hospital blood request created", hospitalId, role: ROLES.HOSPITAL_STAFF, detail: `${facilityName} requested ${units} ${request.bloodGroup} from ${source.name}`, time: new Date().toLocaleString() }, ...v]); setMessage(`Request sent to ${source.name}. If it cannot be fulfilled, escalate it to ZNBTS.`); setRequest({ bloodGroup: "", units: "", sourceHospitalId: "", urgency: "Emergency", patient: "", reason: "" });
  };

  const acceptRequest = (r) => {
    if (!capabilities.storage || !capabilities.issue) return setError("Your hospital is not authorized by ZNBTS to store/issue blood for an inter-hospital transfer.");
    const destinationHospital = hospitals.find(h => Number(h.id) === Number(r.requestingHospitalId));
    if (!hasCapability(destinationHospital,"storage")) return setError("The requesting hospital is not authorized for blood storage and cannot receive this transfer. Escalate to ZNBTS.");
    const sourceId = `HOSP-${hospitalId}`; const destinationId = `HOSP-${r.requestingHospitalId}`;
    const available = getFacilityInventory(networkInventory, sourceId).find(x => x.bloodGroup === r.bloodType)?.available || 0;
    if (available < r.units) return setError("Insufficient available stock to fulfil this request.");
    try {
      let transferRemaining = Number(r.units);
      const incomingLots = [];
      const sourceLots = inventoryLots.filter(l => l.facilityId === sourceId && l.bloodGroup === r.bloodType && l.status === INVENTORY_STATES.AVAILABLE && Number(l.remaining) > 0).sort((a,b) => String(a.expiryDate || "9999").localeCompare(String(b.expiryDate || "9999")));
      for (const sourceLot of sourceLots) {
        if (!transferRemaining) break;
        const take = Math.min(transferRemaining, Number(sourceLot.remaining));
        incomingLots.push(makeLot({ facilityId: destinationId, facilityName: destinationHospital?.name || r.requestingHospitalName, bloodGroup: r.bloodType, units: take, collectionDate: sourceLot.collectionDate, expiryDate: sourceLot.expiryDate, status: INVENTORY_STATES.AVAILABLE, source: `Inter-hospital transfer from ${facilityName}`, collectionReference: r.id, unitIdentifiers: (sourceLot.unitIdentifiers || []).slice(0, take), storageLocation: "Hospital Blood Bank", sourceFacilityId: sourceId, sourceFacilityName: facilityName, testingAuthority: sourceLot.testingAuthority || "Released cleared stock", metadata: { receivedAt: new Date().toISOString(), receivedBy: user.email, testingStatus: "Released at source" } }));
        transferRemaining -= take;
      }
      if (transferRemaining > 0) throw new Error("Source lot records could not satisfy the requested transfer.");
      const consumed = consumeLots({ lots: inventoryLots, rows: networkInventory, facilityId: sourceId, facilityName, bloodGroup: r.bloodType, units: r.units, performedBy: user.email, referenceId: r.id, transactionType: "TRANSFER_OUT" });
      const destinationResult = applyInventoryChange(consumed.rows, { facilityId: destinationId, facilityName: destinationHospital?.name || r.requestingHospitalName, facilityType: "Hospital", province: "Copperbelt", district: destinationHospital?.district, bloodGroup: r.bloodType, quantity: r.units, deltaAvailable: r.units, transactionType: "TRANSFER_IN", referenceId: r.id, performedBy: user.email });
      setNetworkInventory(destinationResult.rows);
      setInventoryLots(v => [...incomingLots, ...consumed.lots]);
      setInventoryTransactions(v => [destinationResult.transaction, ...consumed.transactions, ...v]);
      setBloodRequests(v => v.map(x => x.id === r.id ? { ...x, status: "Fulfilled by Nearby Hospital", fulfilledAt: new Date().toISOString(), fulfilledBy: user.email } : x));
      setAuditLogs(v => [{ id: createReference("AUD"), event: "Nearby hospital request fulfilled", hospitalId, role: ROLES.HOSPITAL_STAFF, detail: `${facilityName} supplied ${r.units} ${r.bloodType} to ${r.requestingHospitalName}`, time: new Date().toLocaleString() }, ...v]);
      setMessage("Nearby hospital request fulfilled. Source and destination inventories and lot records were updated.");
    } catch (err) { setError(err.message); }
  };

  const escalate = (r) => { setBloodRequests(v => v.map(x => x.id === r.id ? { ...x, status: "Escalated", escalatedTo: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", escalationStatus: "ZNBTS Supply", escalatedAt: new Date().toISOString(), escalatedBy: user.email } : x)); setAuditLogs(v => [{ id: Date.now(), event: "Nearby blood request escalated to ZNBTS", hospitalId, role: ROLES.HOSPITAL_STAFF, detail: `${facilityName} escalated ${r.units} ${r.bloodType} request to ZNBTS`, time: new Date().toLocaleString() }, ...v]); setMessage("Request escalated to ZNBTS for supply coordination."); };

  return <div className="space-y-7 pb-10">
    <header><div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800"><FaTint/> Hospital Blood Bank</div><h1 className="mt-3 text-3xl font-bold text-slate-900">{facilityName}</h1><p className="mt-2 max-w-4xl text-slate-600">Manage hospital blood-bank operations within the services authorized by ZNBTS. Authorization controls collection, testing, storage, processing, crossmatching and issue.</p><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.entries({collection:"Collection",testing:"Testing",storage:"Storage",processing:"Processing",crossmatching:"Crossmatching",issue:"Issue / release"}).map(([key,label])=><div key={key} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${capabilities[key] ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-500"}`}>{label}: {capabilities[key] ? "Authorized by ZNBTS" : "Not authorized"}</div>)}</div></header>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Available",ownRows.reduce((s,r)=>s+r.available,0)], ["Testing",ownRows.reduce((s,r)=>s+r.testing,0)], ["Issued / Used",ownRows.reduce((s,r)=>s+r.issued,0)], ["Expired",ownRows.reduce((s,r)=>s+r.expired,0)]].map(([label,value])=><div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>)}</section>
    
    {/* En-Route ZNBTS Transfers Tracking for Hospital Staff */}
    <section className="rounded-3xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2"><FaTruck className="text-blue-700"/> Incoming ZNBTS Blood Transfers</h2>
          <p className="mt-1 text-sm text-blue-900">Chain-of-custody tracking for blood units dispatched by ZNBTS to {facilityName}.</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {transfers.filter(t => Number(t.hospitalId) === hospitalId).length ? (
          transfers.filter(t => Number(t.hospitalId) === hospitalId).map(t => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-blue-100 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">{t.transferId || `TRF-${t.id.toString().slice(-4)}`}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${t.status === "Delivered" || t.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {t.status || "In Transit"}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900">{t.units} Units of {t.blood}</p>
                <p className="text-xs text-slate-500">Dispatched at {t.dispatchedTime || t.time || "Recorded"} by {t.dispatchedBy || "ZNBTS Logistics"}</p>
                {t.deliveredTime && <p className="text-xs font-semibold text-emerald-700">Delivered & Received at {t.deliveredTime} by {t.receivedBy}</p>}
              </div>
              {t.status !== "Delivered" && t.status !== "Completed" && (
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const destinationResult = applyInventoryChange(networkInventory, {
                      facilityId,
                      facilityName,
                      facilityType: "Hospital",
                      province: hospital?.province || "Copperbelt",
                      district: hospital?.district || "",
                      bloodGroup: t.blood,
                      deltaAvailable: t.units,
                      quantity: t.units,
                      transactionType: "TRANSFER_IN",
                      referenceId: t.transferId,
                      performedBy: user?.email
                    });
                    setNetworkInventory(destinationResult.rows);
                    setInventoryTransactions(v => [destinationResult.transaction, ...v]);
                    setTransfers(v => v.map(x => x.id === t.id ? {
                      ...x,
                      status: "Delivered",
                      deliveredAt: now.toISOString(),
                      deliveredTime: now.toLocaleTimeString(),
                      receivedBy: user?.email || user?.name || "Hospital Staff"
                    } : x));
                    setAuditLogs(v => [{ id: Date.now(), event: "Hospital received ZNBTS blood transfer", hospitalId, role: ROLES.HOSPITAL_STAFF, detail: `${facilityName} verified receipt of ${t.units} ${t.blood} units (${t.transferId})`, time: now.toLocaleString() }, ...v]);
                    setMessage(`Verified delivery of ${t.units} ${t.blood} units. Hospital inventory updated.`);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700"
                >
                  Verify Delivery Receipt
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-blue-800 italic">No incoming ZNBTS blood transfers en-route for {facilityName}.</p>
        )}
      </div>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap gap-2"><button onClick={()=>setMode("collection")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode==="collection"?"bg-[#8f1220] text-white":"border text-slate-700"}`}><FaPlus className="mr-2 inline"/>Collection</button><button onClick={()=>setMode("usage")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode==="usage"?"bg-[#8f1220] text-white":"border text-slate-700"}`}><FaTint className="mr-2 inline"/>Usage</button><button onClick={()=>setMode("request")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode==="request"?"bg-[#8f1220] text-white":"border text-slate-700"}`}><FaTruck className="mr-2 inline"/>Nearby request</button></div>
      {mode==="collection"&&<form onSubmit={recordCollection} className="mt-5 grid gap-4 sm:grid-cols-2"><label>Blood group<select name="bloodGroup" value={form.bloodGroup} onChange={update} className={input} required><option value="">Select</option>{GROUPS.map(g=><option key={g}>{g}</option>)}</select></label><label>Units<input name="units" type="number" min="1" value={form.units} onChange={update} className={input} required/></label><label>Collection date<input name="collectionDate" type="date" value={form.collectionDate} onChange={update} className={input} required/></label><label>Expiry date<input name="expiryDate" type="date" value={form.expiryDate} onChange={update} className={input}/></label><label className="sm:col-span-2">Collection/reference number<input name="reference" value={form.reference} onChange={update} className={input} placeholder="Optional reference"/></label><button className="sm:col-span-2 rounded-xl bg-[#8f1220] px-4 py-3 text-sm font-bold text-white">{capabilities.testing ? "Record collection into authorized testing" : "Record collection for ZNBTS testing"}</button></form>}
      {mode==="usage"&&<UsageForm rows={ownRows} onSubmit={recordUsage}/>} 
      {mode==="request"&&<form onSubmit={submitNearbyRequest} className="mt-5 grid gap-4 sm:grid-cols-2"><label>Blood group<select value={request.bloodGroup} onChange={e=>setRequest(v=>({...v,bloodGroup:e.target.value}))} className={input} required><option value="">Select</option>{GROUPS.map(g=><option key={g}>{g}</option>)}</select></label><label>Units<input type="number" min="1" value={request.units} onChange={e=>setRequest(v=>({...v,units:e.target.value}))} className={input} required/></label><label>Source hospital<select value={request.sourceHospitalId} onChange={e=>setRequest(v=>({...v,sourceHospitalId:e.target.value}))} className={input} required><option value="">Select nearby/available hospital</option>{nearbyHospitals.map(h=><option key={h.id} value={h.id}>{h.name} · {h.district}</option>)}</select></label><label>Urgency<select value={request.urgency} onChange={e=>setRequest(v=>({...v,urgency:e.target.value}))} className={input}><option>Emergency</option><option>Critical</option><option>High</option><option>Routine</option></select></label><label>Patient / request reference<input value={request.patient} onChange={e=>setRequest(v=>({...v,patient:e.target.value}))} className={input} required placeholder="Patient name or request ID"/></label><label>Reason<input value={request.reason} onChange={e=>setRequest(v=>({...v,reason:e.target.value}))} className={input} required placeholder="Reason for shortage/request"/></label><div className="sm:col-span-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-900"><FaExclamationTriangle className="mr-2 inline"/>Nearby-hospital supply is an operational contingency. If the request cannot be fulfilled, escalate it to ZNBTS for coordinated supply.</div><button className="sm:col-span-2 rounded-xl bg-[#8f1220] px-4 py-3 text-sm font-bold text-white">Send nearby hospital request</button></form>}
      {error&&<p className="mt-4 font-semibold text-red-700">{error}</p>}{message&&<p className="mt-4 font-semibold text-emerald-700">{message}</p>}</div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Current blood bank stock</h2><p className="mt-1 text-sm text-slate-500">Live facility balance. ZNBTS sees the same facility-level inventory through the network view.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{ownRows.map(r=><div key={r.bloodGroup} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between"><b>{r.bloodGroup}</b><span className="text-xs text-slate-500">threshold {r.threshold}</span></div><p className="mt-2 text-2xl font-bold">{r.available}</p><p className="text-xs text-slate-500">available · {r.testing} testing · {r.pendingTesting || 0} awaiting ZNBTS · {r.reserved} reserved · {r.issued} used · {r.expired} expired</p></div>)}</div></div>
    </section>
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Blood lots & expiry control</h2><p className="mt-1 text-sm text-slate-500">Use earliest-expiring cleared lots first. Collection and expiry dates remain attached to the lot record.</p><div className="mt-5 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="px-4 py-3">Group</th><th className="px-4 py-3">Collected</th><th className="px-4 py-3">Expiry</th><th className="px-4 py-3">Remaining</th><th className="px-4 py-3">State</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{ownLots.map(l=><tr key={l.id} className="border-t"><td className="px-4 py-3 font-bold">{l.bloodGroup}</td><td className="px-4 py-3">{l.collectionDate}</td><td className="px-4 py-3">{l.expiryDate||"—"}</td><td className="px-4 py-3">{l.remaining}</td><td className="px-4 py-3">{l.status}</td><td className="px-4 py-3"><div className="flex flex-wrap gap-2">{l.status==="Testing"&&<button onClick={()=>releaseLot(l)} className="rounded-lg bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">Clear for use</button>}{l.status==="Available"&&<button onClick={()=>expireLot(l)} className="rounded-lg bg-rose-50 px-3 py-1.5 font-semibold text-rose-700">Mark expired</button>}</div></td></tr>)}</tbody></table></div></section>
    <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Incoming nearby requests</h2><p className="mt-1 text-sm text-slate-500">Requests from other hospitals asking your hospital to help before ZNBTS supply.</p><div className="mt-5 space-y-3">{incoming.length?incoming.map(r=><div key={r.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex flex-wrap justify-between gap-2"><b>{r.bloodType} · {r.units} units</b><span className="text-xs font-semibold">{r.urgency}</span></div><p className="mt-1 text-sm">{r.requestingHospitalName} · Request {r.id}</p><p className="mt-1 text-xs text-slate-500">{r.reason}</p><button onClick={()=>acceptRequest(r)} className="mt-3 rounded-lg bg-[#8f1220] px-3 py-2 text-xs font-bold text-white">Accept & transfer</button></div>):<p className="text-sm text-slate-500">No incoming nearby requests.</p>}</div></div><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">My nearby requests</h2><div className="mt-5 space-y-3">{outgoing.length?outgoing.map(r=><div key={r.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between gap-2"><b>{r.bloodType} · {r.units}</b><span className="text-xs font-semibold">{r.status}</span></div><p className="mt-1 text-sm">To: {r.sourceHospitalName}</p><p className="text-xs text-slate-500">{r.patient} · {r.reason}</p>{["Pending Nearby"].includes(r.status)&&<button onClick={()=>escalate(r)} className="mt-3 rounded-lg border border-[#8f1220] px-3 py-2 text-xs font-bold text-[#8f1220]">Escalate to ZNBTS</button>}</div>):<p className="text-sm text-slate-500">No nearby requests yet.</p>}</div></div></section>
  </div>;
}

function UsageForm({ rows, onSubmit }) {
  const [group, setGroup] = useState(""); const [units, setUnits] = useState(""); const [reference, setReference] = useState("");
  return <form onSubmit={e=>{e.preventDefault();onSubmit(group,units,reference);setUnits("");setReference("");}} className="mt-5 space-y-4"><label>Blood group<select value={group} onChange={e=>setGroup(e.target.value)} className={input} required><option value="">Select</option>{GROUPS.map(g=><option key={g}>{g}</option>)}</select></label><label>Units used/issued<input type="number" min="1" max={rows.find(r=>r.bloodGroup===group)?.available||1} value={units} onChange={e=>setUnits(e.target.value)} className={input} required/></label><label>Patient / transfusion reference<input value={reference} onChange={e=>setReference(e.target.value)} className={input} placeholder="Optional request/transfusion reference"/></label><button className="w-full rounded-xl bg-[#8f1220] px-4 py-3 text-sm font-bold text-white">Record blood usage</button></form>;
}
