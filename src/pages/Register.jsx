import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2, CheckCircle2 } from 'lucide-react';
import { registerUser } from '../services/authService';
import { AuthShell } from './Login';

const INITIAL = {
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell title="Registration submitted" subtitle="Awaiting administrator approval">
        <div className="space-y-5">
          <div className="alert-success flex items-start gap-3">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>
              Your registration has been received. An administrator must approve your account
              before you can sign in.
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="btn-secondary flex-1" onClick={() => navigate('/pending-approval')}>
              View status
            </button>
            <button className="btn-primary flex-1" onClick={() => navigate('/login')}>
              Go to sign in
            </button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create an owner account"
      subtitle="Registrations are reviewed by an administrator"
      footer={
        <p className="text-sm text-ink-500">
          Already approved?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert-error">{error}</div>}

        <div>
          <label className="field-label" htmlFor="name">Full name</label>
          <input id="name" className="field-input" value={form.name} onChange={update('name')} required />
        </div>

        <div>
          <label className="field-label" htmlFor="username">Username</label>
          <input
            id="username"
            className="field-input"
            value={form.username}
            onChange={update('username')}
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="field-input"
            value={form.email}
            onChange={update('email')}
            autoComplete="email"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="field-input"
              value={form.password}
              onChange={update('password')}
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              className="field-input"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {loading ? 'Submitting…' : 'Register account'}
        </button>
      </form>
    </AuthShell>
  );
}
