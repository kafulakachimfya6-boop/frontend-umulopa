import { useMemo, useState } from "react";
import { FaEnvelope, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/useAppState";
import { clearAuthentication } from "../utils/authStorage";
import { normaliseRole, roleLabels, getDashboardPath } from "../utils/roles";
import NotificationDropdown from "./ui/NotificationDropdown";
import { getRoleMessages, getRoleNotifications } from "../utils/roleNotifications";
import UserMenu from "./ui/UserMenu";

function Navbar({ onMobileMenuToggle }) {
  const navigate = useNavigate();
  const { user, logout, bloodRequests = [], auditLogs = [], inventoryLots = [], hospitals = [], donors = [], donorAppointments = [], donorDonations = [], donorEmergencyRequests = [] } = useAppState();
  const [showPanel, setShowPanel] = useState(null);

  const profileName = useMemo(() => {
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    if (user?.name) return user.name;
    return "User";
  }, [user]);

  const roleLabel = useMemo(() => roleLabels[normaliseRole(user?.role)], [user]);

  const initials = useMemo(() => profileName.slice(0, 2).toUpperCase(), [profileName]);

  const liveNotifications = useMemo(() => getRoleNotifications({
    user,
    bloodRequests,
    donors,
    inventoryLots,
    hospitals,
    donorAppointments,
    donorDonations,
    donorEmergencyRequests,
  }), [user, bloodRequests, donors, inventoryLots, hospitals, donorAppointments, donorDonations, donorEmergencyRequests]);

  const liveMessages = useMemo(() => getRoleMessages({
    user,
    auditLogs,
    donors,
    bloodRequests,
    hospitals,
    donorAppointments,
    donorDonations,
    donorEmergencyRequests,
  }), [user, auditLogs, donors, bloodRequests, hospitals, donorAppointments, donorDonations, donorEmergencyRequests]);

  const handleLogout = () => {
    logout();
    clearAuthentication();
    navigate("/login", { replace: true });
  };

  const renderPanel = () => {
    if (showPanel === "messages") {
      return (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-gray-200 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between border-b pb-2">
            <p className="font-semibold text-gray-900">Live System Events</p>
            <button type="button" onClick={() => setShowPanel(null)} className="text-sm font-semibold text-[#7A0916]">Close</button>
          </div>
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {liveMessages.length > 0 ? (
              liveMessages.map((msg, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 p-3 text-xs text-gray-700 border border-slate-100">
                  {msg}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No recent system activity recorded.</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
      <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button type="button" onClick={onMobileMenuToggle} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-[#6B0F1A] md:hidden">
            <FaBars />
          </button>
          <div className="max-w-[42vw] truncate rounded-full bg-[#F3E9E9] px-2.5 py-2 text-xs font-semibold text-[#6B0F1A] sm:max-w-none sm:px-3 sm:text-sm">
            {roleLabel}
          </div>
          <nav className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2 text-sm text-gray-500">
            <button type="button" onClick={() => navigate(getDashboardPath(normaliseRole(user?.role)))} className="font-medium hover:text-[#7A0E14]">Home</button>
            <span className="text-gray-300">/</span>
            <span>{roleLabel}</span>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <NotificationDropdown open={showPanel === "notifications"} onToggle={() => setShowPanel(showPanel === "notifications" ? null : "notifications")} notifications={liveNotifications} />
          <div className="relative">
            <button type="button" onClick={() => setShowPanel(showPanel === "messages" ? null : "messages")} className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-[#6B0F1A] shadow-sm transition hover:bg-gray-50">
              <FaEnvelope />
            </button>
            {renderPanel()}
          </div>
          <UserMenu name={profileName} initials={initials} role={roleLabel} onProfile={() => navigate("/settings")} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
