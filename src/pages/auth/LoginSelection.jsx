import { Link } from "react-router-dom";
import { FaHandHoldingMedical, FaUserMd, FaUserShield, FaBuilding } from "react-icons/fa";
import './auth.css';

const roles = [
  {
    to: '/login/donor',
    title: 'Donor login',
    description: 'Access your donation history, request status, and donor alerts.',
    icon: FaHandHoldingMedical,
  },
  {
    to: '/login/staff',
    title: 'Staff login',
    description: 'Manage patient requests, transfusions, and blood inventory.',
    icon: FaUserMd,
  },
  {
    to: '/login/regional',
    title: 'Regional Centre login',
    description: 'Coordinate blood inventory, requests, transfers, and emergency mobilisation.',
    icon: FaBuilding,
  },
  {
    to: '/login/admin',
    title: 'Administrator login',
    description: 'Use administrator tools for system oversight and reporting.',
    icon: FaUserShield,
  },
];

export default function LoginSelection() {
  return (
    <div className="auth-page">
      <div className="auth-background" />

      <div className="auth-shell auth-shell--selection">
        <div className="auth-illustration auth-illustration--welcome">
          <img src="/images/blood-illustration.svg" alt="" />
          <div>
            <p className="eyebrow auth-illustration-eyebrow">Welcome to UMULOPA</p>
            <h2>Your trusted blood bank portal</h2>
            <p>
              UMULOPA Safe Transfer brings hospitals, donors, and caregivers together on one secure platform.
              Sign in with the role that matches your responsibilities to access the right tools instantly.
            </p>
          </div>
          <ul className="auth-welcome-list">
            <li>Track donations and transfusion requests in real time</li>
            <li>Monitor blood inventory and low-stock alerts</li>
            <li>Generate reports for clinical and administrative review</li>
          </ul>
        </div>

        <div className="auth-card auth-card--selection">
          <div className="brand brand--centered">
            <p className="eyebrow">Sign in</p>
            <h1>Choose your access level</h1>
            <p className="tag">
              Select the correct role to sign in and continue to the dedicated portal.
            </p>
          </div>

          <div className="login-selection-grid">
            {roles.map(({ to, title, description, icon: Icon }) => (
              <Link key={to} to={to} className="role-card">
                <div className="role-card-icon" aria-hidden="true">
                  <Icon />
                </div>
                <div>
                  <h2 className="role-title">{title}</h2>
                  <p className="role-description">{description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="auth-footer auth-footer--centered">
            <span>Need a donor account? </span>
            <Link to="/signup">Create one here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
