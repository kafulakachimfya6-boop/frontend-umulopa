import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import './auth.css';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage('If an account matches, a reset link has been sent.');
      setIdentifier('');
    }, 600);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your username or hospital email and we’ll guide you through the next step."
      eyebrow="Recovery"
      footer={
        <>
          <Link to="/login">Back to sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="label">Email or username</span>
          <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Enter your email or username" required />
        </label>

        {message ? <p className="success-text">{message}</p> : null}

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  );
}
