import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaTint, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaShieldAlt } from "react-icons/fa";
import AuthLayout from "./AuthLayout";
import { setAuthenticated } from "../../utils/authStorage";
import { useAppState } from "../../context/useAppState";
import { getDashboardPath, ROLES, roleLabels } from "../../utils/roles";
import { verifyPassword } from "../../utils/password";

export default function Login() {
  const { login, adminUsers = [], hospitalAccounts = [], donorAccounts = [] } = useAppState(); const navigate = useNavigate(); const location = useLocation();
  const routeRole = location.pathname === "/login/staff" ? ROLES.HOSPITAL_STAFF : location.pathname === "/login/regional" ? ROLES.REGIONAL_CENTRE : location.pathname === "/login/admin" ? ROLES.SYSTEM_ADMIN : ROLES.DONOR;
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [role, setRole] = useState(routeRole);
  const [rememberMe, setRememberMe] = useState(true); const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    const knownUser = adminUsers.find((u) => u.email?.toLowerCase() === normalizedEmail);
    const hospitalAccount = hospitalAccounts.find((a) => a.email?.toLowerCase() === normalizedEmail);
    const donorAccount = donorAccounts.find((a) => a.email?.toLowerCase() === normalizedEmail);
    const account = knownUser || hospitalAccount || donorAccount;
    if (!account) { setError("No ZNBTS account was found for this email address."); return; }
    if (account.status && account.status !== "Active") { setError(`This account is ${String(account.status).toLowerCase()}. Please contact ZNBTS administration.`); return; }
    const resolvedRole = account.role || role;
    if (role && resolvedRole !== role) { setError(`This account is registered for ${roleLabels[resolvedRole] || resolvedRole}. Select the correct access role.`); return; }
    if (!(await verifyPassword(password, account.passwordHash))) { setError("Incorrect password. Please try again."); return; }
    setLoading(true);
    setAuthenticated(normalizedEmail);
    login({ email: normalizedEmail, username: normalizedEmail, name: account.name || account.adminName, role: resolvedRole, subRole: account.subRole || null, hospital: account.hospital || account.hospitalName || null, hospitalId: account.hospitalId || null, district: account.district || null, province: account.province || null, donorId: account.donorId || null, rememberMe });
    setTimeout(() => { setLoading(false); navigate(account.passwordSet === false ? "/change-password" : (location.state?.from?.pathname || getDashboardPath(resolvedRole)), { replace: true }); }, 250);
  }
  return <AuthLayout><div className="animate-[fadeUp_.55s_ease-out]">
    <div className="mb-9 flex items-center gap-3 lg:hidden"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7e1420] text-white shadow-lg"><FaTint /></span><div><p className="text-lg font-bold tracking-[.10em] text-[#71101b]">UMULOPA SAFE TRANSFER</p><p className="text-[11px] font-medium tracking-wide text-slate-500">ZAMBIA NATIONAL BLOOD TRANSFUSION SERVICE (ZNBTS)</p></div></div>
    <div className="mb-8"><p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff0f1] px-3 py-1.5 text-xs font-semibold text-[#8f1220]"><FaShieldAlt /> Secure sign in</p><h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2><p className="mt-2 leading-6 text-slate-500">Sign in to access your ZNBTS workspace.</p></div>
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span><span className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-[#9f1725] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#9f1725]/10"><FaEnvelope className="text-slate-400" /><input className="w-full bg-transparent px-3 py-3.5 text-sm outline-none" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organisation.com" autoComplete="email" required /></span></label>
      <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Password</span><span className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-[#9f1725] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#9f1725]/10"><FaLock className="text-slate-400" /><input className="w-full bg-transparent px-3 py-3.5 text-sm outline-none" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required /><button className="p-1 text-slate-400 hover:text-[#8f1220]" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></span></label>
      <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Access role</span><select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#9f1725] focus:bg-white focus:ring-4 focus:ring-[#9f1725]/10">{Object.values(ROLES).map((value) => <option key={value} value={value}>{roleLabels[value]}</option>)}</select></label>
      <div className="flex items-center justify-between gap-3 pt-1"><label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input className="peer sr-only" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /><span className="grid h-5 w-5 place-items-center rounded border border-slate-300 bg-white text-[10px] text-white transition peer-checked:border-[#8f1220] peer-checked:bg-[#8f1220]"><FaCheck /></span>Remember me</label><Link className="text-sm font-semibold text-[#8f1220] hover:text-[#5e0c16] hover:underline" to="/forgot-password">Forgot password?</Link></div>
      {error && <p className="text-sm font-semibold text-red-700" role="alert">{error}</p>}
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#74101a] to-[#aa1c2a] px-5 py-4 text-sm font-bold text-white shadow-[0_12px_25px_rgba(126,20,32,.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(126,20,32,.32)] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<FaTint /></button>
    </form>
    <div className="mt-8 space-y-2 text-center text-sm text-slate-500"><p>New blood donor? <Link className="font-semibold text-[#8f1220] hover:underline" to="/signup">Create donor account</Link></p><p>Hospital not registered? <Link className="font-semibold text-[#8f1220] hover:underline" to="/signup/hospital">Register your hospital</Link></p></div>
  </div></AuthLayout>;
}
