import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/useAppState";
import DonorDashboard from "./dashboard/DonorDashboard";
import StaffDashboard from "./dashboard/StaffDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import RegionalDashboard from "./dashboard/RegionalDashboard";
import { normaliseRole, ROLES } from "../utils/roles";

export default function Dashboard() {
  const navigate = useNavigate();
  const { patients, bloodRequests, transfusions, donors, user } = useAppState();
  const totals = { patients: patients.length, requests: bloodRequests.length, transfusions: transfusions.length, donors: donors.length };
  const role = normaliseRole(user?.role);
  const dashboards = {
    [ROLES.DONOR]: <DonorDashboard totals={totals} onNavigate={navigate} />,
    [ROLES.HOSPITAL_STAFF]: <StaffDashboard totals={totals} onNavigate={navigate} />,
    [ROLES.REGIONAL_CENTRE]: <RegionalDashboard totals={totals} onNavigate={navigate} />,
    [ROLES.SYSTEM_ADMIN]: <AdminDashboard totals={totals} onNavigate={navigate} />,
  };
  return dashboards[role];
}
