import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { changePassword } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';

export default function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const forced = params.get('force') === '1';

  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.newPassword !== form.confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(form);
      setSuccess(true);
      setTimeout(() => navigate(homeForRole(user?.role), { replace: true }), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <div className="card">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <KeyRound size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-ink-900">Change password</h1>
              <p className="mt-0.5 text-sm text-ink-500">
                {forced
                  ? 'Your account requires a new password before you can continue.'
                  : 'Update your account password.'}
              </p>
            </div>
          </div>

          {success ? (
            <div className="alert-success flex items-center gap-2">
              <CheckCircle2 size={16} />
              Password updated. Redirecting…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="alert-error">{error}</div>}

              <div>
                <label className="field-label" htmlFor="current">Current password</label>
                <input id="current" type="password" className="field-input" value={form.currentPassword} onChange={update('currentPassword')} required />
              </div>
              <div>
                <label className="field-label" htmlFor="new">New password</label>
                <input id="new" type="password" className="field-input" value={form.newPassword} onChange={update('newPassword')} required />
              </div>
              <div>
                <label className="field-label" htmlFor="confirm">Confirm new password</label>
                <input id="confirm" type="password" className="field-input" value={form.confirmNewPassword} onChange={update('confirmNewPassword')} required />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
