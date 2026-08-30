import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useAppState } from '../../context/useAppState';
import { hashPassword, verifyPassword } from '../../utils/password';
import { getDashboardPath } from '../../utils/roles';
import './auth.css';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, adminUsers = [], setAdminUsers, hospitalAccounts = [], setHospitalAccounts, staffAccounts = [], setStaffAccounts, donorAccounts = [], setDonorAccounts } = useAppState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const account = [...adminUsers, ...hospitalAccounts, ...staffAccounts, ...donorAccounts].find((item) => item.email?.toLowerCase() === user?.email?.toLowerCase());
    if (!account || !(await verifyPassword(currentPassword, account.passwordHash))) { setError('Current password is incorrect.'); return; }
    const passwordHash = await hashPassword(newPassword);
    const update = (items) => items.map((item) => item.email?.toLowerCase() === user?.email?.toLowerCase() ? { ...item, passwordHash, passwordSet: true } : item);
    setAdminUsers?.(update); setHospitalAccounts?.(update); setStaffAccounts?.(update); setDonorAccounts?.(update);
    setLoading(true);
    setTimeout(() => { setLoading(false); setMessage('Password updated successfully.'); navigate(getDashboardPath(user?.role), { replace: true }); }, 250);
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="You must update your temporary password before continuing."
      eyebrow="First login"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Current password</span>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter your temporary password" required />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>

        <label className="field">
          <span className="label">New password</span>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Create a new password" required />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>

        <label className="field">
          <span className="label">Confirm new password</span>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your new password" required />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  );
}
