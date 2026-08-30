import React, { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import RoleModulePage from "./pages/RoleModulePage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import HospitalSignup from "./pages/auth/HospitalSignup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import { isAuthenticated } from "./utils/authStorage";
import { canAccessRoute, getDashboardPath } from "./utils/roles";
import { useAppState } from "./context/useAppState";

// Pre-declare lazy components at module level so React can cache resolved chunks.
// NEVER create React.lazy() inside a component or render function — it re-suspends every render.
const PatientManagement   = lazy(() => import("./pages/patients/PatientManagement"));
const BloodRequest        = lazy(() => import("./pages/patients/BloodRequest"));
const RequestHistory      = lazy(() => import("./pages/patients/RequestHistory"));
const TransfusionHistory  = lazy(() => import("./pages/patients/TransfusionHistory"));
const NetworkInventory    = lazy(() => import("./pages/inventory/NetworkInventory"));
const InventoryDashboard  = lazy(() => import("./pages/inventory/InventoryDashboard"));
const HospitalBloodBank   = lazy(() => import("./pages/inventory/HospitalBloodBank"));
const AddBloodPack        = lazy(() => import("./pages/inventory/AddBloodPack"));
const DonorList           = lazy(() => import("./pages/donors/DonorList"));
const WeeklyReport        = lazy(() => import("./pages/reports/WeeklyReport"));
const UsageStatistics     = lazy(() => import("./pages/reports/UsageStatistics"));
const LowStockReport      = lazy(() => import("./pages/reports/LowStockReport"));
const MonthlyReport       = lazy(() => import("./pages/reports/MonthlyReport"));
const Settings            = lazy(() => import("./pages/Settings"));

function ProtectedRoute({ children }) {
  const { user } = useAppState();
  const location = useLocation();
  if (!isAuthenticated() || !user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!canAccessRoute(user.role, location.pathname, user.subRole)) return <Navigate to={getDashboardPath(user.role)} replace />;
  if (user.role === "staff" && (user.hospitalId === null || user.hospitalId === undefined || user.hospitalId === "")) {
    return <div className="min-h-screen grid place-items-center bg-slate-50 p-6"><div className="max-w-lg rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center"><h1 className="text-xl font-bold text-amber-950">Hospital account scope is incomplete</h1><p className="mt-2 text-sm leading-6 text-amber-900">This hospital account does not have a hospital identifier. Access to hospital records is blocked to prevent exposure of another facility's data. Ask a ZNBTS administrator to correct the account.</p></div></div>; }
  return children;
}

function PublicOnly({ children }) {
  const { user } = useAppState();
  return isAuthenticated() && user ? <Navigate to={getDashboardPath(user.role)} replace /> : children;
}

function HomeRoute() {
  const { user } = useAppState();
  return user && isAuthenticated() ? <Navigate to={getDashboardPath(user.role)} replace /> : <LandingPage />;
}

export function AppRoutes() {
  const { user } = useAppState();
  const dashboard = user ? getDashboardPath(user.role) : "/login";
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/login/donor" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/login/staff" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/login/regional" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/login/admin" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/login/*" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
      <Route path="/signup/hospital" element={<PublicOnly><HospitalSignup /></PublicOnly>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Navigate to={dashboard} replace />} />
        <Route path="admin" element={<Dashboard />} />
        <Route path="admin/users" element={<RoleModulePage />} />
        <Route path="admin/roles" element={<RoleModulePage />} />
        <Route path="admin/hospitals" element={<RoleModulePage />} />
        <Route path="admin/permissions" element={<RoleModulePage />} />
        <Route path="admin/audit-logs" element={<RoleModulePage />} />
        <Route path="admin/reports" element={<RoleModulePage />} />
        <Route path="admin/system-health" element={<RoleModulePage />} />
        <Route path="admin/settings" element={<RoleModulePage />} />
        <Route path="admin/backup" element={<RoleModulePage />} />
        <Route path="admin/newsletter" element={<RoleModulePage />} />
        <Route path="regional" element={<Dashboard />} />
        <Route path="regional/inventory" element={<RoleModulePage />} />
        <Route path="regional/distribution" element={<RoleModulePage />} />
        <Route path="regional/hospitals" element={<RoleModulePage />} />
        <Route path="regional/emergency" element={<RoleModulePage />} />
        <Route path="regional/transfers" element={<RoleModulePage />} />
        <Route path="regional/analytics" element={<RoleModulePage />} />
        <Route path="regional/reports" element={<RoleModulePage />} />
        <Route path="regional/settings" element={<RoleModulePage />} />
        <Route path="staff" element={<Dashboard />} />
        <Route path="staff/team" element={<RoleModulePage />} />
        <Route path="staff/profile" element={<RoleModulePage />} />
        <Route path="staff/escalations" element={<RoleModulePage />} />
        <Route path="staff/emergency" element={<RoleModulePage />} />
        <Route path="donor" element={<Dashboard />} />
        <Route path="donor/donate" element={<RoleModulePage />} />
        <Route path="donor/appointments" element={<RoleModulePage />} />
        <Route path="donor/donations" element={<RoleModulePage />} />
        <Route path="donor/history" element={<RoleModulePage />} />
        <Route path="donor/emergency" element={<RoleModulePage />} />
        <Route path="donor/profile" element={<RoleModulePage />} />
        <Route path="donor/eligibility" element={<RoleModulePage />} />
        <Route path="admin/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="staff/dashboard" element={<Navigate to="/staff" replace />} />
        <Route path="donor/dashboard" element={<Navigate to="/donor" replace />} />
        {/* Lazy-loaded heavy pages — Suspense is inside Layout so only the content area shows a loader */}
        <Route path="patients" element={<PatientManagement />} />
        <Route path="patients/add" element={<PatientManagement />} />
        <Route path="patients/:patientId" element={<PatientManagement />} />
        <Route path="patients/request" element={<BloodRequest />} />
        <Route path="patients/history" element={<RequestHistory />} />
        <Route path="patients/transfusions" element={<TransfusionHistory />} />
        <Route path="network/inventory" element={<NetworkInventory />} />
        <Route path="inventory" element={<InventoryDashboard />} />
        <Route path="staff/blood-bank" element={<HospitalBloodBank />} />
        <Route path="inventory/add" element={<AddBloodPack />} />
        <Route path="donors" element={<DonorList />} />
        <Route path="reports/weekly" element={<WeeklyReport />} />
        <Route path="reports/usage" element={<UsageStatistics />} />
        <Route path="reports/low-stock" element={<LowStockReport />} />
        <Route path="reports/monthly" element={<MonthlyReport />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() { return <BrowserRouter><AppRoutes /></BrowserRouter>; }
