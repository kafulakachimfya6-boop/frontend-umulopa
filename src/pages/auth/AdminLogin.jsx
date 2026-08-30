import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import './auth.css';
import { setAuthenticated } from '../../utils/authStorage';
import { useAppState } from '../../context/useAppState';

export default function AdminLogin() {
  const { login } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setAuthenticated(email.trim());
    login({ email: email.trim(), role: 'admin' });

    setTimeout(() => {
      setLoading(false);
      navigate('/admin/dashboard');
    }, 600);
  };

  return (
    <AuthLayout
      title="Administrator sign in"
      subtitle="Restricted access for system administrators."
      eyebrow="Admin access"
      footer={
        <>
          <Link to="/login">Return to donor login</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Admin email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@hospital.org" required />
        </label>

        <label className="field">
          <span className="label">Password</span>
          <div className="password-row">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {error ? <p className="error-text" role="alert">{error}</p> : null}

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
