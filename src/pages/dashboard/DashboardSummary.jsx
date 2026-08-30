import Card from "../../components/Card";
import { FaUsers, FaTint, FaHeartbeat, FaHandHoldingMedical } from "react-icons/fa";

export default function DashboardSummary({ totals, onNavigate }) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card
        title="Total Patients"
        value={totals.patients}
        subtitle="+12 this week"
        icon={<FaUsers />}
        color="bg-[#6B0F1A]"
        onClick={() => onNavigate("/patients/add")}
        linkLabel="View patients"
      />
      <Card
        title="Blood Requests"
        value={totals.requests}
        subtitle="+8 this week"
        icon={<FaTint />}
        color="bg-[#A31621]"
        onClick={() => onNavigate("/patients/request")}
        linkLabel="View requests"
      />
      <Card
        title="Transfusions"
        value={totals.transfusions}
        subtitle="+15 this week"
        icon={<FaHeartbeat />}
        color="bg-[#B43B3B]"
        onClick={() => onNavigate("/patients/transfusions")}
        linkLabel="View history"
      />
      <Card
        title="Total Donors"
        value={totals.donors}
        subtitle="+20 this month"
        icon={<FaHandHoldingMedical />}
        color="bg-[#8B1E26]"
        onClick={() => onNavigate("/reports/usage")}
        linkLabel="View donors"
      />
    </div>
  );
}
