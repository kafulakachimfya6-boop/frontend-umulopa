import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/useAppState";
import { clearAuthentication } from "../utils/authStorage";
import { getDashboardPath } from "../utils/roles";

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAppState();

  const displayName = user?.username || user?.email || "User";
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Donor";

  const handleLogout = () => {
    logout();
    clearAuthentication();
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="mt-2 text-sm text-gray-500">Manage your account preferences and session.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Account</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
              <dt className="text-gray-500">Name / ID</dt>
              <dd className="font-medium text-gray-900">{displayName}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
              <dt className="text-gray-500">Role</dt>
              <dd className="font-medium text-gray-900">{roleLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Dashboard</dt>
              <dd className="font-medium text-gray-900">{getDashboardPath(user?.role)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => navigate("/change-password")}
            className="mt-6 rounded-xl border border-[#7A0916] px-4 py-2 text-sm font-semibold text-[#7A0916] hover:bg-[#7A0916]/5"
          >
            Change Password
          </button>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <p className="mt-2 text-sm text-gray-500">Configure alerts and report notifications for your account.</p>
          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            <li className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span>Low stock alerts</span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Enabled</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span>Emergency request alerts</span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Enabled</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span>Weekly report digest</span>
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">Pending API</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="rounded-3xl border border-red-100 bg-red-50 p-6">
        <h3 className="text-lg font-semibold text-red-900">Sign out</h3>
        <p className="mt-2 text-sm text-red-800/80">End your current session on this device.</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 rounded-xl bg-[#7A0916] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5a0610]"
        >
          Log out
        </button>
      </section>
    </div>
  );
}

export default Settings;
