import { FaChevronDown, FaSignOutAlt, FaUser } from "react-icons/fa";
export default function UserMenu({ name, initials, role, onProfile, onLogout }) {
  return <div className="flex items-center gap-2">
    <button onClick={onProfile} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-left text-sm shadow-sm hover:bg-slate-50 sm:px-3" aria-label="Open profile and account settings">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#7A0E14] text-xs font-bold text-white">{initials || <FaUser />}</span>
      <span className="hidden max-w-36 sm:block"><span className="block truncate font-semibold text-slate-700">{name}</span><span className="block truncate text-xs text-slate-400">{role}</span></span>
      <FaChevronDown className="hidden text-slate-400 sm:block" />
    </button>
    <button onClick={onLogout} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-[#7A0E14] shadow-sm hover:bg-rose-50" aria-label="Sign out"><FaSignOutAlt /></button>
  </div>;
}
