import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ReportActions from "../../components/ReportActions";
import { exportToPdf, exportToExcel } from "../../utils/exportUtils";
import { useAppState } from "../../context/useAppState";
import { uniqueRecords } from "../../utils/analytics";
import { scopeToHospital } from "../../utils/hospitalScope";
import { normaliseRole, ROLES } from "../../utils/roles";

export default function MonthlyReport() {
  const { user, bloodRequests = [], transfusions = [] } = useAppState();
  const requests = uniqueRecords(scopeToHospital(bloodRequests, user)), tx = uniqueRecords(scopeToHospital(transfusions, user));
  const scopeLabel = normaliseRole(user?.role) === ROLES.HOSPITAL_STAFF ? user?.hospital || "your hospital" : "the Copperbelt ZNBTS network";
  const lineData = useMemo(() => { const now = new Date(); const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(); return Array.from({ length: days }, (_, i) => { const d = new Date(now.getFullYear(), now.getMonth(), i + 1); const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; return { day: key, requests: requests.filter(r => (r.date || r.createdAt || "").slice(0, 10) === key).length, transfusions: tx.filter(r => (r.date || r.createdAt || "").slice(0, 10) === key).length }; }); }, [requests, tx]);
  const totals = { requests: lineData.reduce((a, x) => a + x.requests, 0), transfusions: lineData.reduce((a, x) => a + x.transfusions, 0) };
  const columns = [{ key: "day", label: "Date" }, { key: "requests", label: "Requests" }, { key: "transfusions", label: "Transfusions" }];
  return <div><div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"><div><h1 className="text-3xl font-bold">Monthly Report</h1><p className="text-gray-600">Actual activity recorded during the current month for {scopeLabel}.</p></div><ReportActions onPdf={() => exportToPdf("monthly-report.pdf", columns, lineData, { title: `ZNBTS Monthly Report — ${scopeLabel}` })} onExcel={() => exportToExcel("monthly-report.xlsx", columns, lineData, { title: `ZNBTS Monthly Report — ${scopeLabel}` })} /></div><div className="grid md:grid-cols-3 gap-4 mb-8"><div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500">Requests</p><p className="text-3xl font-bold mt-3">{totals.requests}</p></div><div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500">Transfusions</p><p className="text-3xl font-bold mt-3">{totals.transfusions}</p></div><div className="bg-white rounded-xl shadow p-6"><p className="text-gray-500">Tracked days</p><p className="text-3xl font-bold mt-3">{lineData.length}</p></div></div><div className="bg-white rounded-xl shadow p-6"><ResponsiveContainer width="100%" height={320}><LineChart data={lineData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis allowDecimals={false}/><Tooltip/><Line type="monotone" dataKey="requests" stroke="#A31621" strokeWidth={2} dot={false}/><Line type="monotone" dataKey="transfusions" stroke="#6B0F1A" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div><p className="mt-3 text-xs text-slate-500">Records are scoped to the current user's permitted operational scope before aggregation.</p></div>;
}
