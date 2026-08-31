import { NavLink } from "react-router-dom";
import { FaAmbulance, FaChartLine, FaClipboardList, FaCog, FaHeartbeat, FaHome, FaHospital, FaKey, FaShieldAlt, FaTint, FaTruck, FaUserPlus, FaUsers, FaWarehouse, FaTimes } from "react-icons/fa";
import { getNavItemsForRole, normaliseRole, resolveDashboardLink, roleLabels, ROLES } from "../utils/roles";
import { useAppState } from "../context/useAppState";

const icons = { home: FaHome, userPlus: FaUserPlus, droplet: FaTint, heartbeat: FaHeartbeat, inventory: FaWarehouse, plus: FaUserPlus, users: FaUsers, file: FaClipboardList, chart: FaChartLine, alert: FaClipboardList, settings: FaCog, roles: FaKey, hospitals: FaHospital, permissions: FaShieldAlt, health: FaHeartbeat, backup: FaWarehouse, distribution: FaTint, emergency: FaAmbulance, transfers: FaTruck };
const adminItems = [{ to: "/admin", label: "Dashboard", icon: "home" }, { to: "/admin/users", label: "Users", icon: "users" }, { to: "/admin/roles", label: "Roles", icon: "roles" }, { to: "/admin/hospitals", label: "Hospitals", icon: "hospitals" }, { to: "/network/inventory", label: "Live Blood Availability", icon: "inventory" }, { to: "/inventory", label: "ZNBTS Blood Inventory", icon: "inventory" }, { to: "/inventory/add?action=receive-external", label: "Receive External Blood", icon: "plus" }, { to: "/admin/permissions", label: "Permissions", icon: "permissions" }, { to: "/admin/audit-logs", label: "Audit Logs", icon: "file" }, { to: "/admin/reports", label: "Reports", icon: "chart" }, { to: "/admin/system-health", label: "System Health", icon: "health" }, { to: "/admin/settings", label: "Settings", icon: "settings" }, { to: "/admin/backup", label: "Backup", icon: "backup" }, { to: "/admin/newsletter", label: "Newsletter", icon: "file" }];
const regionalItems = [{ to: "/regional", label: "Regional Overview", icon: "home" }, { to: "/regional/inventory", label: "Blood Inventory", icon: "inventory" }, { to: "/inventory/add?action=receive-external", label: "Receive External Blood", icon: "plus" }, { to: "/regional/distribution", label: "Blood Distribution", icon: "distribution" }, { to: "/regional/hospitals", label: "Hospitals", icon: "hospitals" }, { to: "/regional/emergency", label: "Emergency Requests", icon: "emergency" }, { to: "/regional/transfers", label: "Transfers", icon: "transfers" }, { to: "/regional/analytics", label: "Analytics", icon: "chart" }, { to: "/regional/reports", label: "Reports", icon: "file" }, { to: "/regional/settings", label: "Settings", icon: "settings" }];
const staffItems = [{ to: "/staff", label: "Dashboard", icon: "home" }, { to: "/patients", label: "Patients", icon: "users" }, { to: "/patients/request", label: "Blood Requests", icon: "droplet" }, { to: "/patients/transfusions", label: "Transfusions", icon: "heartbeat" }, { to: "/inventory", label: "Blood Inventory", icon: "inventory" }, { to: "/inventory/add?action=collect", label: "Record Collection", icon: "plus" }, { to: "/network/inventory", label: "ZNBTS Network Stock", icon: "distribution" }, { to: "/donors", label: "Donor Registry", icon: "users" }, { to: "/staff/team", label: "Staff Management", icon: "users" }, { to: "/staff/profile", label: "Hospital Profile", icon: "hospitals" }, { to: "/staff/emergency", label: "Escalations", icon: "emergency" }, { to: "/reports/weekly", label: "Reports", icon: "file" }];
const donorItems = [{ to: "/donor", label: "Dashboard", icon: "home" }, { to: "/donor/donate", label: "Donate Blood", icon: "droplet" }, { to: "/donor/appointments", label: "Appointments", icon: "file" }, { to: "/donor/donations", label: "My Donations", icon: "heartbeat" }, { to: "/donor/history", label: "Donation History", icon: "chart" }, { to: "/donor/eligibility", label: "Eligibility", icon: "health" }, { to: "/donor/emergency", label: "Emergency Requests", icon: "emergency" }, { to: "/donor/profile", label: "Profile", icon: "userPlus" }, { to: "/settings", label: "Settings", icon: "settings" }];

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { user } = useAppState();
  const role = normaliseRole(user?.role);
  const allowedStaff = new Set({
    "Hospital Administrator": staffItems.map(x => x.to),
    "Blood Bank Officer": ["/staff", "/patients/request", "/patients/history", "/patients/transfusions", "/inventory", "/inventory/add", "/network/inventory", "/donors", "/staff/emergency", "/reports/weekly", "/reports/low-stock"],
    "Medical Officer": ["/staff", "/patients", "/patients/request", "/patients/history", "/patients/transfusions", "/network/inventory", "/donors", "/staff/emergency"],
    "Nurse": ["/staff", "/patients", "/patients/request", "/patients/transfusions", "/staff/emergency"],
    "Records Officer": ["/staff", "/patients", "/patients/add", "/patients/history", "/reports/weekly"],
    "Hospital Manager": ["/staff", "/patients", "/patients/history", "/patients/transfusions", "/network/inventory", "/donors", "/reports/weekly", "/reports/usage", "/reports/monthly", "/reports/low-stock", "/staff/team"]
  }[user?.subRole] || staffItems.map(x => x.to));
  const items = role === ROLES.SYSTEM_ADMIN ? adminItems : role === ROLES.REGIONAL_CENTRE ? regionalItems : role === ROLES.HOSPITAL_STAFF ? staffItems.filter(x => allowedStaff.has(x.to)) : role === ROLES.DONOR ? donorItems : getNavItemsForRole(role);

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] md:hidden ${mobileOpen ? "block" : "hidden"}`} onClick={onClose} aria-hidden="true" />
      <aside className={`app-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(19rem,88vw)] -translate-x-full flex-col bg-[#6B0F1A] text-white shadow-2xl transition-transform duration-200 md:static md:z-20 md:w-64 md:translate-x-0 md:shadow-lg ${mobileOpen ? "translate-x-0" : ""}`} aria-label="Primary navigation">
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4">
          <div>
            <p className="font-bold tracking-[.08em]">UMULOPA SAFE TRANSFER</p>
            <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-white/65">ZNBTS Copperbelt Network</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-white/10 md:hidden" aria-label="Close navigation"><FaTimes /></button>
        </div>
        <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-4 [scrollbar-width:thin]" aria-label="Workspace navigation">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-white/45">Workspace</div>
          <div className="space-y-1">
            {items.map((item) => {
              if (item.section) return <p key={item.section} className="px-3 pt-5 text-[10px] font-semibold uppercase tracking-widest text-white/50">{item.section}</p>;
              const Icon = icons[item.icon] || FaHospital;
              return <NavLink key={item.to} to={resolveDashboardLink(role, item)} onClick={onClose} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors ${isActive ? "bg-white text-[#6B0F1A] shadow-sm" : "text-white/85 hover:bg-white/10"}`}><Icon className="shrink-0" aria-hidden="true" /><span>{item.label}</span></NavLink>;
            })}
          </div>
        </nav>
        <div className="shrink-0 border-t border-white/10 p-4">
          <p className="text-sm font-semibold">{roleLabels[role]}</p>
          <p className="mt-1 text-xs text-white/65">Secure workspace</p>
        </div>
      </aside>
    </>
  );
}
