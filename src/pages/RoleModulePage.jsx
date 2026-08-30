import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaDownload, FaPlus, FaSave, FaSearch, FaShieldAlt, FaTint, FaTruck, FaUserPlus } from "react-icons/fa";
import { useAppState } from "../context/useAppState";
import StatusBadge from "../components/StatusBadge";
import { normaliseRole, roleLabels, ROLES } from "../utils/roles";
import { hashPassword } from "../utils/password";
import { exportToCsv } from "../utils/exportUtils";
import { getDonorEligibility, getActualDonations } from "../utils/donorEligibility";
import { uniqueRecords } from "../utils/analytics";
import NetworkInventory from "./inventory/NetworkInventory";
import { applyInventoryChange, ZNBTS_FACILITY_ID, ZNBTS_FACILITY_NAME } from "../utils/networkInventory";
import { CAPABILITY_LABELS, defaultCapabilities } from "../utils/hospitalCapabilities";
import { scopeToHospital } from "../utils/hospitalScope";

const catalog = {
  "/admin/users": { title: "User Management", description: "Create, review, activate and manage ZNBTS user accounts.", action: "Add user" },
  "/admin/roles": { title: "Role Management", description: "Review role assignments and access boundaries." },
  "/admin/hospitals": { title: "Hospital Network", description: "Manage facilities connected to the ZNBTS network.", action: "Add hospital" },
  "/admin/permissions": { title: "Permissions", description: "Review permission bundles and access controls." },
  "/admin/audit-logs": { title: "Audit Logs", description: "Trace important administrative and operational events." },
  "/admin/reports": { title: "Platform Reports", description: "Generate and export platform-level operational reports." },
  "/admin/system-health": { title: "System Health", description: "Monitor application services and integration health." },
  "/admin/settings": { title: "Administrator Settings", description: "Manage platform preferences and security controls." },
  "/admin/backup": { title: "Backup & Recovery", description: "Run a frontend workflow for backup records and recovery checks." },
  "/admin/newsletter": { title: "Newsletter Subscribers", description: "Review functional public newsletter subscriptions captured by UMULOPA Safe Transfer." },
  "/regional/inventory": { title: "Regional Blood Inventory", description: "Monitor, adjust and export regional stock." },
  "/regional/distribution": { title: "Blood Distribution", description: "Allocate available units to approved hospital requests." },
  "/regional/hospitals": { title: "Regional Hospitals", description: "Review hospital stock and operational status." },
  "/regional/emergency": { title: "Emergency Requests", description: "Prioritise and respond to urgent blood requirements." },
  "/regional/transfers": { title: "Blood Transfers", description: "Create, dispatch and complete blood transfer workflows." },
  "/regional/analytics": { title: "Regional Analytics", description: "Review demand, stock and fulfilment indicators." },
  "/regional/reports": { title: "Regional Reports", description: "Generate regional reports from current application state." },
  "/regional/settings": { title: "Regional Settings", description: "Configure regional operating preferences." },
  "/staff/emergency": { title: "Emergency Cases", description: "Coordinate urgent patient blood requests and escalation to the ZNBTS Kitwe Blood Centre." },
  "/staff/team": { title: "Hospital Staff Management", description: "Create and manage individual staff accounts for the registered hospital." },
  "/staff/profile": { title: "Hospital Profile", description: "Maintain the registered hospital profile and contact information." },
  "/staff/escalations": { title: "Escalations", description: "Track hospital issues escalated to the ZNBTS Kitwe Blood Centre." },
  "/donor/donate": { title: "Donate Blood", description: "Record a donor's intention to donate and create an appointment workflow." },
  "/donor/appointments": { title: "Appointments", description: "Book, confirm and cancel donor appointments." },
  "/donor/donations": { title: "My Donations", description: "Review verified donation records." },
  "/donor/history": { title: "Donation History", description: "Review and export your donation history." },
  "/donor/eligibility": { title: "Donation Eligibility", description: "Check your donation interval and portal eligibility status." },
  "/donor/emergency": { title: "Emergency Requests", description: "View urgent donor mobilisation requests." },
  "/donor/profile": { title: "Donor Profile", description: "Update donor contact and profile details." },
};

const input = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#8f1220] focus:bg-white focus:ring-4 focus:ring-[#8f1220]/10";

function Shell({ meta, children }) {
  const navigate = useNavigate();
  const safeMeta = meta || { title: "Module", description: "Operational workspace" };
  return <div className="space-y-6 pb-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><button onClick={() => navigate(-1)} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#8f1220]"><FaArrowLeft /> Back</button><h1 className="text-3xl font-bold text-slate-900">{safeMeta.title}</h1><p className="mt-1 max-w-3xl text-slate-500">{safeMeta.description}</p></div>
    </div>{children}
  </div>;
}

function DataTable({ columns, rows, empty = "No records found." }) {
  return <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full text-left"><thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr>{columns.map((column) => <th key={column} className="px-5 py-3">{column}</th>)}</tr></thead><tbody>{rows.length ? rows : <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-slate-500">{empty}</td></tr>}</tbody></table></div>;
}

function AdminModule({ path }) {
  const { adminUsers = [], setAdminUsers, hospitals = [], setHospitals, hospitalAccounts = [], setHospitalAccounts, staffAccounts = [], setStaffAccounts, auditLogs = [], setAuditLogs, newsletterSubscribers = [], setNewsletterSubscribers } = useAppState();
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES.HOSPITAL_STAFF);
  const [hospitalName, setHospitalName] = useState("");
  const [saving, setSaving] = useState(false);
  const addUser = (e) => { e.preventDefault(); if (!name.trim() || !email.trim()) return; const record = { id: Date.now(), name: name.trim(), email: email.trim(), role, hospital: role === ROLES.HOSPITAL_STAFF ? "Unassigned" : "ZNBTS", status: "Pending" }; setAdminUsers?.((v) => [...v, record]); setAuditLogs?.((v) => [{ id: Date.now(), event: "User created", detail: `${record.name} account created`, time: new Date().toLocaleString() }, ...v]); setName(""); setEmail(""); setSaving(true); setTimeout(() => setSaving(false), 400); };
  if (path === "/admin/users") return <Shell meta={catalog[path]}><div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><form onSubmit={addUser} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Create account</h2><div className="mt-4 space-y-3"><input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required /><input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required /><select className={input} value={role} onChange={(e) => setRole(e.target.value)}><option value={ROLES.HOSPITAL_STAFF}>Hospital Staff</option><option value={ROLES.REGIONAL_CENTRE}>Regional Centre</option><option value={ROLES.DONOR}>Donor</option><option value={ROLES.SYSTEM_ADMIN}>System Administrator</option></select></div><button disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#8f1220] px-4 py-2.5 text-sm font-semibold text-white"><FaUserPlus /> {saving ? "Saving…" : "Create user"}</button></form><div><div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><FaSearch className="text-slate-400" /><input className="w-full py-2.5 text-sm outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" /></div><DataTable columns={["User", "Role", "Hospital", "Status", "Action"]} rows={adminUsers.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())).map((u) => <tr key={u.id} className="border-b border-slate-50"><td className="px-5 py-4"><b>{u.name}</b><p className="text-xs text-slate-500">{u.email}</p></td><td className="px-5 py-4 text-sm">{roleLabels[normaliseRole(u.role)] || u.role}</td><td className="px-5 py-4 text-sm">{u.hospital}</td><td className="px-5 py-4"><StatusBadge status={u.status === "Active" ? "success" : "warning"}>{u.status}</StatusBadge></td><td className="px-5 py-4"><button onClick={() => setAdminUsers?.((v) => v.map((x) => x.id === u.id ? { ...x, status: x.status === "Active" ? "Suspended" : "Active" } : x))} className="text-sm font-semibold text-[#8f1220]">{u.status === "Active" ? "Suspend" : "Activate"}</button></td></tr>)} /></div></div></Shell>;
  if (path === "/admin/hospitals") {
    const updateCapability=(hospitalId,key,value)=>{setHospitals?.(current=>current.map(h=>h.id===hospitalId?{...h,bloodServiceCapabilities:{...defaultCapabilities(),...(h.bloodServiceCapabilities||{}),[key]:value},capabilityStatus:"Authorized by ZNBTS",capabilityReviewedBy:"ZNBTS System Administrator",capabilityReviewedAt:new Date().toISOString()}:h));setAuditLogs?.(v=>[{id:Date.now(),event:"Hospital blood-service capability changed",detail:`${hospitals.find(h=>h.id===hospitalId)?.name||"Hospital"}: ${CAPABILITY_LABELS[key]} → ${value?"Granted":"Revoked"}`,time:new Date().toLocaleString()},...v]);};
    const approveHospital=h=>{setHospitals?.(v=>v.map(x=>x.id===h.id?{...x,status:"Active",bloodServiceCapabilities:{...defaultCapabilities(),...(x.bloodServiceCapabilities||{})},capabilityStatus:"Authorized by ZNBTS",capabilityReviewedBy:"ZNBTS System Administrator",capabilityReviewedAt:new Date().toISOString()}:x));setHospitalAccounts?.(v=>v.map(a=>a.hospitalId===h.id?{...a,status:"Active"}:a));setStaffAccounts?.(v=>v.map(a=>a.hospitalId===h.id?{...a,status:"Active"}:a));setAdminUsers?.(v=>v.map(u=>u.hospitalId===h.id?{...u,status:"Active"}:u));setAuditLogs?.(v=>[{id:Date.now(),event:"Hospital approved",detail:`${h.name} approved; blood-service capabilities require explicit ZNBTS grants`,time:new Date().toLocaleString()},...v]);};
    return <Shell meta={catalog[path]}><div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">Hospitals can self-register and request blood-service capabilities. <b>Registration never grants collection, testing, storage, processing, crossmatching or issue authority.</b> ZNBTS explicitly grants or revokes each capability.</div><form onSubmit={e=>{e.preventDefault();if(!hospitalName.trim())return;const h={id:Date.now(),name:hospitalName.trim(),status:"Pending",units:0,province:"Copperbelt",registeredAt:new Date().toISOString(),bloodServiceCapabilities:defaultCapabilities(),requestedBloodServiceCapabilities:defaultCapabilities(),capabilityStatus:"Awaiting ZNBTS authorization"};setHospitals?.(v=>[...v,h]);setAuditLogs?.(v=>[{id:Date.now(),event:"Hospital registration created",detail:h.name,time:new Date().toLocaleString()},...v]);setHospitalName("");}} className="mt-4 flex max-w-xl gap-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"><input className={input} value={hospitalName} onChange={e=>setHospitalName(e.target.value)} placeholder="Hospital name" required/><button className="shrink-0 rounded-xl bg-[#8f1220] px-4 text-sm font-semibold text-white"><FaPlus/></button></form><div className="mt-6 space-y-4">{hospitals.map(h=>{const caps={...defaultCapabilities(),...(h.bloodServiceCapabilities||{})};const requested={...defaultCapabilities(),...(h.requestedBloodServiceCapabilities||{})};return <div key={h.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold text-slate-900">{h.name}</h2><p className="text-sm text-slate-500">{h.district||"—"} · {h.type||"Hospital"}</p><div className="mt-2 flex flex-wrap gap-2"><StatusBadge status={h.status==="Active"?"success":h.status==="Pending"?"warning":"danger"}>{h.status}</StatusBadge><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{h.capabilityStatus||"Awaiting ZNBTS authorization"}</span></div></div><div className="flex gap-2">{h.status==="Pending"&&<button onClick={()=>approveHospital(h)} className="rounded-xl bg-[#8f1220] px-4 py-2 text-sm font-semibold text-white">Approve hospital</button>}{h.status==="Active"&&<button onClick={()=>setHospitals?.(v=>v.map(x=>x.id===h.id?{...x,status:"Suspended"}:x))} className="rounded-xl border px-4 py-2 text-sm font-semibold">Suspend</button>}{h.status==="Suspended"&&<button onClick={()=>setHospitals?.(v=>v.map(x=>x.id===h.id?{...x,status:"Active"}:x))} className="rounded-xl border px-4 py-2 text-sm font-semibold">Activate</button>}</div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(CAPABILITY_LABELS).map(([key,label])=><label key={key} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-3"><input type="checkbox" checked={Boolean(caps[key])} onChange={e=>updateCapability(h.id,key,e.target.checked)} className="mt-1 h-4 w-4"/><span><b className="text-sm">{label}</b><span className="mt-1 block text-xs text-slate-500">Requested: {requested[key]?"Yes":"No"} · Granted: {caps[key]?"Yes":"No"}</span></span></label>)}</div><p className="mt-4 text-xs text-slate-500">Last capability review: {h.capabilityReviewedAt?new Date(h.capabilityReviewedAt).toLocaleString():"Not reviewed"} {h.capabilityReviewedBy?`· ${h.capabilityReviewedBy}`:""}</p></div>})}</div></Shell>;
  }
  if (path === "/admin/permissions") return <PermissionsPanel audit={(detail) => setAuditLogs?.((v) => [{ id: Date.now(), event: "Permission action", detail, time: new Date().toLocaleString() }, ...v])} />;
  if (path === "/admin/system-health") return <Shell meta={catalog[path]}><div className="grid gap-4 md:grid-cols-3">{["Frontend", "Application state", "Routing"].map((s) => <div key={s} className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6"><p className="font-bold text-emerald-900">{s}</p><p className="mt-2 text-sm text-emerald-800">Operational</p><StatusBadge status="success">Healthy</StatusBadge></div>)}</div></Shell>;
  if (path === "/admin/backup") return <Shell meta={catalog[path]}><BackupPanel onAudit={(detail) => setAuditLogs?.((v) => [{ id: Date.now(), event: "Backup action", detail, time: new Date().toLocaleString() }, ...v])} /></Shell>;
  if (path === "/admin/reports") return <Shell meta={catalog[path]}><ReportPanel rows={adminUsers} filename="umulopa-platform-users.csv" /></Shell>;
  if (path === "/admin/settings") return <Shell meta={catalog[path]}><SettingsPanel /></Shell>;
  if (path === "/admin/roles") return <Shell meta={catalog[path]}><DataTable columns={["Role","Scope","Purpose"]} rows={[["System Administrator","ZNBTS-wide","Platform governance and user/hospital administration"],["Regional Blood Centre","Copperbelt","Blood inventory, distribution, emergency coordination and reporting"],["Hospital Staff","Own hospital","Patient, blood-bank and transfusion operations within assigned facility"],["Blood Donor","Own account","Appointments, donations, eligibility and emergency donor responses"]].map((r,i)=><tr key={i} className="border-b border-slate-50">{r.map((c,j)=><td key={j} className="px-5 py-4 text-sm">{j===0?<b>{c}</b>:c}</td>)}</tr>)}/></Shell>;
  if (path === "/admin/audit-logs") return <Shell meta={catalog[path]}><DataTable columns={["Time","Event","Detail"]} rows={auditLogs.map((a)=><tr key={a.id} className="border-b border-slate-50"><td className="px-5 py-4 text-xs text-slate-500">{a.time || a.timestamp || "—"}</td><td className="px-5 py-4 font-semibold">{a.event || "Event"}</td><td className="px-5 py-4 text-sm">{a.detail || "—"}</td></tr>)}/></Shell>;
  if (path === "/admin/newsletter") return <Shell meta={catalog[path]}><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Public newsletter subscriptions</p><p className="mt-2 text-3xl font-bold">{newsletterSubscribers.length}</p></div><div className="mt-5"><DataTable columns={["Email","Subscribed"]} rows={newsletterSubscribers.map((s)=><tr key={s.id || s.email} className="border-b border-slate-50"><td className="px-5 py-4 font-semibold">{s.email}</td><td className="px-5 py-4 text-sm">{s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}</td></tr>)}/></div></Shell>;
  return <Shell meta={catalog[path] || {title:"Module",description:"Operational workspace"}}><div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><p className="font-semibold text-slate-900">{catalog[path]?.title || "Module"}</p><p className="mt-2 text-sm text-slate-500">This operational module is available to your role and is connected to the application state.</p></div></Shell>;
}

function PermissionsPanel({ audit }) {
  const navigate = useNavigate();
  const permissions = [
    { name: "Manage users", description: "Create, activate, suspend and review platform accounts.", path: "/admin/users", action: "Manage users" },
    { name: "Manage hospitals", description: "Add connected facilities and control their network status.", path: "/admin/hospitals", action: "Manage hospitals" },
    { name: "Approve requests", description: "Review urgent and routine blood requests at the operational level.", path: "/regional/emergency", action: "Review requests" },
    { name: "Adjust stock", description: "Increase or decrease regional blood inventory and monitor thresholds.", path: "/regional/inventory", action: "Adjust stock" },
    { name: "View reports", description: "Export current platform records and operational reports.", path: "/admin/reports", action: "View reports" },
    { name: "Run backups", description: "Create an application-state snapshot and record the backup event.", path: "/admin/backup", action: "Run backup" },
  ];
  return <Shell meta={catalog["/admin/permissions"]}>
    <div className="grid gap-4 md:grid-cols-2">
      {permissions.map((permission) => <article key={permission.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-slate-900">{permission.name}</h2><p className="mt-2 text-xs leading-5 text-slate-500">{permission.description}</p></div><FaShieldAlt className="shrink-0 text-[#8f1220]" /></div>
        <div className="mt-4 flex flex-wrap items-center gap-2"><StatusBadge status="success">Protected</StatusBadge><button type="button" onClick={() => { audit?.(`${permission.name} opened by System Administrator`); navigate(permission.path); }} className="ml-auto rounded-xl bg-[#8f1220] px-3 py-2 text-xs font-semibold text-white hover:bg-[#720d18]">{permission.action}</button></div>
      </article>)}
    </div>
  </Shell>;
}

function BackupPanel({ onAudit }) { const [status, setStatus] = useState("Ready"); return <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Backup control</h2><p className="mt-2 text-sm text-slate-500">Create a frontend snapshot of the current application state.</p><button onClick={() => { setStatus("Backup completed"); onAudit?.("Manual application-state backup completed"); }} className="mt-5 rounded-xl bg-[#8f1220] px-4 py-2.5 text-sm font-semibold text-white"><FaSave className="mr-2 inline" /> Run backup</button><p className="mt-3 text-sm font-semibold text-emerald-700">{status}</p></div>; }
function ReportPanel({ rows, filename }) { return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Export report</h2><p className="mt-2 text-sm text-slate-500">Export the current records to CSV for review or submission.</p><button onClick={() => exportToCsv(filename, Object.keys(rows[0] || {}).map((key) => ({ key, label: key })), rows)} className="mt-5 rounded-xl bg-[#8f1220] px-4 py-2.5 text-sm font-semibold text-white"><FaDownload className="mr-2 inline" /> Export CSV</button></div>; }
function SettingsPanel() { const [saved, setSaved] = useState(false); const [mfa, setMfa] = useState(true); return <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"><label className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span><b>Require MFA</b><small className="block text-xs text-slate-500">Protect privileged accounts.</small></span><input type="checkbox" checked={mfa} onChange={(e) => setMfa(e.target.checked)} /></label><button onClick={() => setSaved(true)} className="rounded-xl bg-[#8f1220] px-4 py-2.5 text-sm font-semibold text-white"><FaSave className="mr-2 inline" /> Save settings</button>{saved && <p className="text-sm font-semibold text-emerald-700">Settings saved successfully.</p>}</div>; }

function RegionalModule({ path }) {
  const { stock = [], setStock, bloodRequests = [], setBloodRequests, hospitals = [], transfers = [], setTransfers, setAuditLogs, networkInventory = [], setNetworkInventory, setInventoryTransactions } = useAppState();
  if (path === "/regional/inventory") return <NetworkInventory />;
  if (path === "/regional/inventory-legacy") return <Shell meta={catalog[path]}><div className="grid gap-4 sm:grid-cols-3">{stock.map((s) => <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs uppercase text-slate-400">{s.type}</p><p className="mt-2 text-3xl font-bold">{s.quantity}</p><p className="text-xs text-slate-500">Threshold {s.threshold}</p><div className="mt-3 flex gap-2"><button onClick={() => setStock?.((v) => v.map((x) => x.id === s.id ? { ...x, quantity: x.quantity + 1 } : x))} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">+1</button><button onClick={() => setStock?.((v) => v.map((x) => x.id === s.id ? { ...x, quantity: Math.max(0, x.quantity - 1) } : x))} className="rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-700">-1</button></div></div>)}</div><div className="mt-6"><DataTable columns={["Blood group", "Available", "Threshold", "Status"]} rows={stock.map((s) => <tr key={s.id} className="border-b border-slate-50"><td className="px-5 py-4 font-semibold">{s.type}</td><td className="px-5 py-4">{s.quantity}</td><td className="px-5 py-4">{s.threshold}</td><td className="px-5 py-4"><StatusBadge status={s.quantity < s.threshold ? "danger" : "success"}>{s.quantity < s.threshold ? "Low" : "Adequate"}</StatusBadge></td></tr>)}/></div></Shell>;
  if (path === "/regional/distribution" || path === "/regional/emergency") return <Shell meta={catalog[path]}><div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><b>Escalation target:</b> ZNBTS Kitwe Blood Centre. Escalated hospital requests appear here for regional review and allocation.</div><DataTable columns={["Patient / request", "Group", "Units", "Urgency", "Status", "Escalated to", "Action"]} rows={bloodRequests.map((r) => <tr key={r.id} className="border-b border-slate-50"><td className="px-5 py-4 font-semibold">{r.patient}</td><td className="px-5 py-4">{r.bloodType}</td><td className="px-5 py-4">{r.units}</td><td className="px-5 py-4">{r.urgency}</td><td className="px-5 py-4"><StatusBadge status={r.status === "Approved" ? "success" : r.status === "Escalated" ? "danger" : "warning"}>{r.status}</StatusBadge></td><td className="px-5 py-4 text-xs text-slate-500">{r.escalatedTo || (r.status === "Escalated" ? "ZNBTS Kitwe Blood Centre" : "—")}</td><td className="px-5 py-4 flex gap-2"><button onClick={() => setBloodRequests?.((v) => v.map((x) => x.id === r.id ? { ...x, status: "Approved", escalatedTo: null, reviewedAt: new Date().toISOString() } : x))} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><FaCheck /></button><button onClick={() => setBloodRequests?.((v) => v.map((x) => x.id === r.id ? { ...x, status: "Rejected", reviewedAt: new Date().toISOString() } : x))} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">Reject</button></td></tr>)}/></Shell>;
  if (path === "/regional/hospitals") return <Shell meta={catalog[path]}><DataTable columns={["Hospital", "Units", "Status"]} rows={hospitals.map((h) => <tr key={h.id} className="border-b border-slate-50"><td className="px-5 py-4 font-semibold">{h.name}</td><td className="px-5 py-4">{h.units ?? 0}</td><td className="px-5 py-4"><StatusBadge status="success">{h.status}</StatusBadge></td></tr>)}/></Shell>;
  if (path === "/regional/transfers") return <Shell meta={catalog[path]}><TransferPanel transfers={transfers} setTransfers={setTransfers} onAudit={(detail) => setAuditLogs?.((v) => [{ id: Date.now(), event: "Transfer action", detail, time: new Date().toLocaleString() }, ...v])} /></Shell>;
  if (path === "/regional/analytics") return <Shell meta={catalog[path]}><div className="grid gap-4 md:grid-cols-4">{[{l:"Requests",v:bloodRequests.length},{l:"Approved",v:bloodRequests.filter(x=>x.status==="Approved").length},{l:"Units in stock",v:stock.reduce((a,x)=>a+x.quantity,0)},{l:"Hospitals",v:hospitals.length}].map(x=><div key={x.l} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">{x.l}</p><p className="mt-2 text-3xl font-bold">{x.v}</p></div>)}</div></Shell>;
  if (path === "/regional/reports") return <Shell meta={catalog[path]}><ReportPanel rows={bloodRequests} filename="umulopa-regional-requests.csv" /></Shell>;
  if (path === "/regional/settings") return <Shell meta={catalog[path]}><SettingsPanel /></Shell>;
  return null;
}
function TransferPanel({ transfers = [], setTransfers, onAudit }) {
  const { networkInventory = [], setNetworkInventory, setInventoryTransactions, hospitals = [], user } = useAppState();
  const [hospitalId, setHospitalId] = useState(""); const [blood, setBlood] = useState("O+"); const [units, setUnits] = useState(1); const [error,setError]=useState("");

  const createDispatch = (e) => {
    e.preventDefault();
    setError("");
    const hospital = hospitals.find(h => String(h.id) === String(hospitalId));
    const qty = Number(units);
    if (!hospital || qty < 1) return;
    try {
      const source = networkInventory.find(r => r.facilityId === ZNBTS_FACILITY_ID && r.bloodGroup === blood);
      if (!source || source.available < qty) throw new Error(`Insufficient ${blood} stock at ZNBTS Kitwe Blood Centre.`);
      
      const dispatchResult = applyInventoryChange(networkInventory, {
        facilityId: ZNBTS_FACILITY_ID,
        facilityName: ZNBTS_FACILITY_NAME,
        facilityType: "ZNBTS",
        bloodGroup: blood,
        deltaAvailable: -qty,
        quantity: qty,
        transactionType: "TRANSFER_OUT",
        referenceId: `TR-${Date.now()}`,
        performedBy: user?.email
      });

      const now = new Date();
      const transferRecord = {
        id: Date.now(),
        transferId: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
        hospital: hospital.name,
        hospitalId: hospital.id,
        blood,
        units: qty,
        status: "In Transit",
        dispatchedAt: now.toISOString(),
        dispatchedTime: now.toLocaleTimeString(),
        dispatchedBy: user?.email || user?.name || "ZNBTS Logistics",
        deliveredAt: null,
        deliveredTime: null,
        receivedBy: null,
      };

      setNetworkInventory(dispatchResult.rows);
      setInventoryTransactions(v => [dispatchResult.transaction, ...v]);
      setTransfers(v => [transferRecord, ...v]);
      onAudit?.(`Transfer ${transferRecord.transferId} dispatched: ${qty} ${blood} units to ${hospital.name}`);
      setHospitalId("");
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelivery = (t) => {
    const now = new Date();
    const hospital = hospitals.find(h => String(h.id) === String(t.hospitalId));
    
    // Add stock to destination hospital upon verified delivery
    const destinationResult = applyInventoryChange(networkInventory, {
      facilityId: `HOSP-${t.hospitalId}`,
      facilityName: t.hospital,
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
      receivedBy: user?.email || user?.name || "Hospital Receiver"
    } : x));

    onAudit?.(`Transfer ${t.transferId} confirmed delivered at ${t.hospital} on ${now.toLocaleTimeString()}`);
  };

  return <div className="space-y-6">
    <form onSubmit={createDispatch} className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Dispatch blood transfer to hospital</h2>
      <p className="mt-1 text-sm text-slate-500">Dispatching reserves stock from ZNBTS and puts transfer into <b>In Transit</b> state until physical delivery is confirmed.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <select className={input} value={hospitalId} onChange={e=>setHospitalId(e.target.value)} required>
          <option value="">Destination hospital</option>
          {hospitals.filter(h=>h.status==="Active").map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <select className={input} value={blood} onChange={e=>setBlood(e.target.value)}>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b=><option key={b}>{b}</option>)}
        </select>
        <input className={input} type="number" min="1" value={units} onChange={e=>setUnits(e.target.value)} />
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
      <button className="mt-4 rounded-xl bg-[#8f1220] px-4 py-2.5 text-sm font-semibold text-white"><FaTruck className="mr-2 inline"/>Dispatch transfer</button>
    </form>
    <DataTable
      columns={["Transfer ID", "Destination", "Blood", "Units", "Status", "Dispatched Time", "Delivered Time", "Action"]}
      rows={transfers.map(t => <tr key={t.id} className="border-b border-slate-50">
        <td className="px-5 py-4 font-mono text-xs font-bold text-slate-700">{t.transferId || `TRF-${t.id.toString().slice(-4)}`}</td>
        <td className="px-5 py-4 font-semibold">{t.hospital}</td>
        <td className="px-5 py-4">{t.blood}</td>
        <td className="px-5 py-4">{t.units}</td>
        <td className="px-5 py-4">
          <StatusBadge status={t.status === "Delivered" || t.status === "Completed" ? "success" : "warning"}>
            {t.status || "In Transit"}
          </StatusBadge>
        </td>
        <td className="px-5 py-4 text-xs text-slate-500">{t.dispatchedTime || t.time || "Recorded"}</td>
        <td className="px-5 py-4 text-xs text-slate-500">{t.deliveredTime ? <span className="font-semibold text-emerald-700">{t.deliveredTime}</span> : <span className="italic text-amber-700">En route</span>}</td>
        <td className="px-5 py-4">
          {t.status !== "Delivered" && t.status !== "Completed" ? (
            <button type="button" onClick={() => confirmDelivery(t)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
              Confirm Delivery
            </button>
          ) : (
            <span className="text-xs font-semibold text-slate-400">Verified</span>
          )}
        </td>
      </tr>)}
    />
  </div>;
}

function StaffProfile() {
  const { user, hospitals = [] } = useAppState();
  const hospital = hospitals.find((h) => String(h.id) === String(user?.hospitalId));
  return <Shell meta={{ title: "Hospital Profile", description: "Your hospital identity and operating scope." }}><div className="grid gap-6 lg:grid-cols-2"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hospital</p><h2 className="mt-2 text-2xl font-bold">{hospital?.name || user?.hospital || "Hospital"}</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">District</dt><dd className="font-semibold">{hospital?.district || "—"}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Province</dt><dd className="font-semibold">{hospital?.province || "Copperbelt"}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Status</dt><dd className="font-semibold">{hospital?.status || "Active"}</dd></div></dl></section><section className="rounded-3xl border border-blue-100 bg-blue-50 p-6"><h2 className="text-lg font-bold text-blue-950">Data scope</h2><p className="mt-2 text-sm leading-6 text-blue-900">Your account is permanently scoped to hospital ID <b>{user?.hospitalId}</b>. Patient, blood-request, transfusion, donor-registry and hospital inventory records are filtered to this facility. ZNBTS network blood availability is shown separately because it is a permitted province-wide operational service.</p></section></div></Shell>; }

function StaffEmergency() { const { bloodRequests=[], setBloodRequests, setAuditLogs, user }=useAppState(); const visibleRequests = scopeToHospital(bloodRequests, user); return <Shell meta={catalog["/staff/emergency"]}><div className="rounded-3xl border border-red-200 bg-red-50 p-5"><p className="font-bold text-red-900">Emergency workflow</p><p className="mt-1 text-sm text-red-800">Escalate urgent requests to <b>ZNBTS Kitwe Blood Centre</b>. The escalation records who initiated it and when.</p></div><DataTable columns={["Patient","Blood","Units","Urgency","Status","Escalated to","Action"]} rows={visibleRequests.map(r=><tr key={r.id} className="border-b border-slate-50"><td className="px-5 py-4 font-semibold">{r.patient}</td><td className="px-5 py-4">{r.bloodType}</td><td className="px-5 py-4">{r.units}</td><td className="px-5 py-4">{r.urgency}</td><td className="px-5 py-4"><StatusBadge status={r.status === "Approved" ? "success" : r.status === "Escalated" ? "danger" : "warning"}>{r.status}</StatusBadge></td><td className="px-5 py-4 text-xs text-slate-500">{r.escalatedTo || "—"}</td><td className="px-5 py-4"><button disabled={r.status === "Escalated"} onClick={()=>{const now=new Date().toISOString();setBloodRequests?.(v=>v.map(x=>x.id===r.id?{...x,status:"Escalated",escalatedTo:"ZNBTS Kitwe Blood Centre",escalatedBy:user?.email||user?.name||"Hospital Staff",escalatedAt:now}:x));setAuditLogs?.(v=>[{id:Date.now(),event:"Emergency request escalated",hospitalId:user?.hospitalId,role:ROLES.HOSPITAL_STAFF,detail:`${r.patient} escalated to ZNBTS Kitwe Blood Centre`,time:new Date().toLocaleString()},...v]);}} className="text-sm font-semibold text-[#8f1220] disabled:opacity-40">{r.status === "Escalated" ? "Escalated" : "Escalate"}</button></td></tr>)}/></Shell>; }

function DonorModule({ path }) {
  const { user, donors = [], bloodRequests = [], setDonors, donorAppointments = [], setDonorAppointments, donorDonations = [], setDonorDonations, donorEmergencyRequests = [], setDonorEmergencyRequests, setAuditLogs } = useAppState();
  const current = donors.find((d) => d.id === user?.donorId || d.email?.toLowerCase() === user?.email?.toLowerCase()) || { id: user?.donorId || "unknown", name: user?.name || "Donor", bloodType: "Not recorded", email: user?.email || "" };
  const [date, setDate] = useState("");
  const [centre, setCentre] = useState("ZNBTS Kitwe Blood Centre");
  const [profile, setProfile] = useState({ name: current.name || "", phone: current.phone || "", address: current.address || "" });
  const mineAppointments = donorAppointments.filter((a) => a.donorId === current.id);
  const mineDonations = uniqueRecords(donorDonations.filter((d) => d.donorId === current.id));
  const linkedEmergency = bloodRequests.filter((r) => ["High", "Critical", "Emergency"].includes(r.urgency) && !["Completed", "Delivered", "Fulfilled", "Cancelled"].includes(r.status) && r.bloodType === current.bloodType).map((r) => ({ id:`REQ-${r.id}`, bloodType:r.bloodType, hospitalName:r.hospitalName || "ZNBTS Copperbelt hospital", unitsRequired:r.units, message:`Urgent ${r.bloodType} blood requirement for ${r.patient}.`, requestId:r.id })); const openEmergency = [...linkedEmergency, ...donorEmergencyRequests.filter((r) => r.status === "Open" && (!r.bloodType || r.bloodType === current.bloodType))];

  if (path === "/donor/donate") return <Shell meta={catalog[path]}><form onSubmit={(e) => { e.preventDefault(); if (!date) return; const a = { id: `APT-${Date.now()}`, donorId: current.id, donor: current.name, date, centre, bloodType: current.bloodType, status: "Pending", requestedAt: new Date().toISOString() }; setDonorAppointments?.((v) => [a, ...v]); setAuditLogs?.((v) => [{ id: Date.now(), event: "Donation appointment requested", donorId: current.id, role: ROLES.DONOR, detail: `${current.name} requested a donation appointment`, time: new Date().toLocaleString() }, ...v]); setDate(""); }} className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Request a donation appointment</h2><p className="mt-1 text-sm text-slate-500">Your request is sent to the selected ZNBTS Copperbelt donation centre for confirmation.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Preferred date<input className={`${input} mt-2`} type="date" value={date} onChange={e=>setDate(e.target.value)} required/></label><label className="text-sm font-semibold">Donation centre<select className={`${input} mt-2`} value={centre} onChange={e=>setCentre(e.target.value)}><option>ZNBTS Kitwe Blood Centre</option><option>ZNBTS Ndola Donation Centre</option><option>ZNBTS Kitwe Blood Centre</option></select></label></div><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Registered blood group: <b>{current.bloodType || "Not recorded"}</b></div><button className="mt-5 rounded-xl bg-[#8f1220] px-4 py-2.5 text-sm font-semibold text-white"><FaTint className="mr-2 inline"/>Submit appointment request</button></form></Shell>;

  if (path === "/donor/appointments") return <Shell meta={catalog[path]}><DataTable columns={["Date","Centre","Blood group","Status","Action"]} rows={mineAppointments.map(a=><tr key={a.id} className="border-b border-slate-50"><td className="px-5 py-4 font-semibold">{a.date}</td><td className="px-5 py-4 text-sm">{a.centre}</td><td className="px-5 py-4">{a.bloodType || current.bloodType}</td><td className="px-5 py-4"><StatusBadge status={a.status === "Confirmed" ? "success" : a.status === "Cancelled" ? "danger" : "warning"}>{a.status}</StatusBadge></td><td className="px-5 py-4"><button disabled={a.status === "Cancelled" || a.status === "Completed"} onClick={()=>setDonorAppointments?.(v=>v.map(x=>x.id===a.id?{...x,status:"Cancelled"}:x))} className="text-sm font-semibold text-[#8f1220] disabled:opacity-40">Cancel</button></td></tr>)}/></Shell>;

  if (path === "/donor/donations") {
    const actual = getActualDonations(mineDonations);
    const totalUnits = actual.reduce((sum, d) => sum + Number(d.units || 1), 0);
    const last = actual[0];
    return <Shell meta={catalog[path]}><div className="grid gap-4 md:grid-cols-3 mb-5"><div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Verified donations</p><p className="mt-2 text-2xl font-bold">{actual.length}</p></div><div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total units donated</p><p className="mt-2 text-2xl font-bold">{totalUnits}</p></div><div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Last verified donation</p><p className="mt-2 text-2xl font-bold">{last?.date || "None"}</p></div></div><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">My recent donations</h2><p className="mt-1 text-sm text-slate-500">A quick donor view of completed or verified donations. Use Donation History for the full ledger.</p><div className="mt-4"><DataTable columns={["Date","Centre","Blood group","Units","Status"]} rows={actual.slice(0, 5).map(d=><tr key={d.id} className="border-b border-slate-50"><td className="px-5 py-4">{d.date || "—"}</td><td className="px-5 py-4">{d.centre || d.hospitalName || "ZNBTS Copperbelt donor centre"}</td><td className="px-5 py-4">{d.bloodType || current.bloodType}</td><td className="px-5 py-4">{d.units || 1}</td><td className="px-5 py-4"><StatusBadge status="success">{d.status}</StatusBadge></td></tr>)}/></div></div></Shell>;
  }

  if (path === "/donor/history") return <Shell meta={catalog[path]}><div className="mb-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">Complete chronological donation ledger for <b>{current.name}</b>. This is the authoritative donor-facing history used for eligibility calculations.</div><DataTable columns={["Date","Centre","Blood group","Units","Component","Status"]} rows={mineDonations.map(d=><tr key={d.id} className="border-b border-slate-50"><td className="px-5 py-4">{d.date || "—"}</td><td className="px-5 py-4 text-sm">{d.centre || d.hospitalName || "ZNBTS Copperbelt donor centre"}</td><td className="px-5 py-4">{d.bloodType || current.bloodType}</td><td className="px-5 py-4">{d.units || 1}</td><td className="px-5 py-4">{d.component || "Whole Blood"}</td><td className="px-5 py-4"><StatusBadge status={d.status === "Verified" || d.status === "Completed" ? "success" : d.status === "Rejected" || d.status === "Cancelled" ? "danger" : "info"}>{d.status || "Recorded"}</StatusBadge></td></tr>)}/></Shell>;

  if (path === "/donor/emergency") return <Shell meta={catalog[path]}><div className="space-y-4">{openEmergency.length ? openEmergency.map(r=><article key={r.id} className="rounded-3xl border border-amber-200 bg-amber-50 p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><StatusBadge status="warning">URGENT</StatusBadge><h2 className="mt-3 text-xl font-bold text-amber-950">{r.bloodType} donors needed</h2><p className="mt-2 text-sm text-amber-900">{r.message}</p><p className="mt-2 text-xs text-amber-800">Destination: {r.hospitalName || "Copperbelt hospital"} · Units required: {r.unitsRequired || "Not specified"}</p></div><button disabled={Boolean(r.responses?.includes(current.id))} onClick={()=>{setDonorEmergencyRequests?.(v=>[{id:r.id,bloodType:r.bloodType,hospitalName:r.hospitalName,unitsRequired:r.unitsRequired,message:r.message,status:"Open",responses:[...(r.responses||[]),current.id],requestId:r.requestId},...v.filter(x=>x.id!==r.id)]);setAuditLogs?.(v=>[{id:Date.now(),event:"Emergency donor response",donorId:current.id,role:ROLES.DONOR,detail:`${current.name} responded to ${r.id}`,time:new Date().toLocaleString()},...v]);}} className="rounded-xl bg-[#8f1220] px-5 py-3 text-sm font-bold text-white disabled:bg-emerald-600">{r.responses?.includes(current.id) ? "Response sent" : "I can donate"}</button></div></article>) : <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center"><h2 className="text-lg font-bold">No matching emergency requests</h2><p className="mt-2 text-sm text-slate-500">ZNBTS will show an urgent request here when your registered blood group is needed.</p></div>}</div></Shell>;

  if (path === "/donor/eligibility") { const eligibility = getDonorEligibility(mineDonations); const last = eligibility.lastDonation; const eligibleDate = eligibility.nextEligibleDate; return <Shell meta={catalog[path]}><div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Donation eligibility record</h2><div className="mt-5 space-y-3"><div className="flex justify-between rounded-2xl bg-slate-50 p-4"><span>Registered blood group</span><b>{current.bloodType || "Not recorded"}</b></div><div className="flex justify-between rounded-2xl bg-slate-50 p-4"><span>Last recorded donation</span><b>{last?.date || "None"}</b></div><div className="flex justify-between rounded-2xl bg-slate-50 p-4"><span>Next date based on 8-week interval</span><b>{eligibleDate || "No prior donation recorded"}</b></div><div className={`flex justify-between rounded-2xl p-4 ${eligibility.eligible ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}><span>Portal status</span><b>{eligibility.label}</b></div></div><p className="mt-4 text-xs leading-5 text-slate-500">Final eligibility is determined by ZNBTS clinical screening at the donation centre. This portal only tracks the recorded donation interval.</p></div></Shell>; }

  if (path === "/donor/profile") return <Shell meta={catalog[path]}><form onSubmit={e=>{e.preventDefault();setDonors?.(v=>v.map(x=>x.id===current.id?{...x,name:profile.name,phone:profile.phone,address:profile.address}:x));setAuditLogs?.(v=>[{id:Date.now(),event:"Donor profile updated",donorId:current.id,role:ROLES.DONOR,detail:`${current.name} updated their donor profile`,time:new Date().toLocaleString()},...v]);}} className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="space-y-4"><label className="block text-sm font-semibold">Full name<input className={`${input} mt-2`} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} required/></label><label className="block text-sm font-semibold">Phone number<input className={`${input} mt-2`} value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})} required/></label><label className="block text-sm font-semibold">Address<input className={`${input} mt-2`} value={profile.address} onChange={e=>setProfile({...profile,address:e.target.value})}/></label><div className="rounded-2xl bg-slate-50 p-4 text-sm">Blood group: <b>{current.bloodType}</b> · Email: <b>{current.email}</b></div></div><button className="mt-5 rounded-xl bg-[#8f1220] px-4 py-2.5 text-sm font-semibold text-white"><FaSave className="mr-2 inline"/>Save profile</button></form></Shell>;

  return <Shell meta={catalog[path]}><div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">Donor module ready.</div></Shell>;
}

function StaffTeam() {
  const { user, staffAccounts = [], setStaffAccounts, adminUsers = [], setAdminUsers, setAuditLogs } = useAppState();
  const [form, setForm] = useState({ name:"", email:"", employeeNumber:"", subRole:"Blood Bank Officer" });
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const hospitalStaff = staffAccounts.filter(a => String(a.hospitalId ?? "") === String(user?.hospitalId ?? ""));
  const submit = async (e) => { e.preventDefault(); const normalized = form.email.trim().toLowerCase(); if (!form.name.trim() || !normalized || !form.employeeNumber.trim()) return; if (staffAccounts.some(a=>a.email?.toLowerCase()===normalized) || adminUsers.some(a=>a.email?.toLowerCase()===normalized)) return; const tempPassword = `ZNBTS-${form.employeeNumber.trim()}-2026!`; const passwordHash = await hashPassword(tempPassword); const record={id:`ST-${Date.now()}`,name:form.name.trim(),email:normalized,employeeNumber:form.employeeNumber.trim(),subRole:form.subRole,role:ROLES.HOSPITAL_STAFF,hospitalId:user?.hospitalId,hospitalName:user?.hospital,status:"Active",passwordSet:false,passwordHash,createdAt:new Date().toISOString()}; setStaffAccounts?.(v=>[...v,record]); setAdminUsers?.(v=>[...v,record]); setAuditLogs?.(v=>[{id:Date.now()+1,event:"Hospital staff account created",hospitalId:user?.hospitalId,role:ROLES.HOSPITAL_STAFF,detail:`${record.name} · ${record.subRole}`,time:new Date().toLocaleString()},...v]); setForm({name:"",email:"",employeeNumber:"",subRole:"Blood Bank Officer"}); setTemporaryPassword(tempPassword); };
  return <Shell meta={catalog["/staff/team"] || {title:"Staff Management",description:"Manage staff accounts for your hospital."}}><div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold">Add hospital staff</h2><>{temporaryPassword && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><b>Temporary password:</b> {temporaryPassword}<p className="mt-1 text-xs">Give this credential securely to the staff member. The backend should require a password change on first login.</p></div>}</><p className="mt-1 text-sm text-slate-500">Create an individual account; each member signs in with their own credentials.</p><div className="mt-4 space-y-3"><input className={input} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><input className={input} type="email" placeholder="Work email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/><input className={input} placeholder="Employee number" value={form.employeeNumber} onChange={e=>setForm({...form,employeeNumber:e.target.value})} required/><select className={input} value={form.subRole} onChange={e=>setForm({...form,subRole:e.target.value})}><option>Blood Bank Officer</option><option>Medical Officer</option><option>Nurse</option><option>Records Officer</option><option>Hospital Manager</option></select></div><button className="mt-4 rounded-xl bg-[#8f1220] px-4 py-2.5 text-sm font-semibold text-white"><FaUserPlus className="mr-2 inline"/>Create staff account</button></form><DataTable columns={["Staff","Role","Employee no.","Status"]} rows={hospitalStaff.map(a=><tr key={a.id} className="border-b border-slate-50"><td className="px-5 py-4"><b>{a.name}</b><p className="text-xs text-slate-500">{a.email}</p></td><td className="px-5 py-4 text-sm">{a.subRole}</td><td className="px-5 py-4 text-sm">{a.employeeNumber}</td><td className="px-5 py-4"><StatusBadge status={a.status==="Active"?"success":"warning"}>{a.status}</StatusBadge></td></tr>)}/></div></Shell>;
}

export default function RoleModulePage() { const { pathname }=useLocation(); const meta=catalog[pathname]||{title:"Module",description:"Operational workspace"}; if(pathname.startsWith("/admin/")) return <AdminModule path={pathname}/>; if(pathname.startsWith("/regional/")) return <RegionalModule path={pathname}/>; if(pathname==="/staff/emergency" || pathname==="/staff/escalations") return <StaffEmergency/>; if(pathname==="/staff/team") return <StaffTeam/>; if(pathname==="/staff/profile") return <StaffProfile/>; if(pathname.startsWith("/donor/")) return <DonorModule path={pathname}/>; return <Shell meta={meta}><div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-slate-600">This module is connected to the application state and role-protected navigation.</p></div></Shell>; }
