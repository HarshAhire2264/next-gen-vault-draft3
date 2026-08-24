import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from '../components/ProtectedRoute';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ identifier, password });
      const dest = user.mustChangePassword
        ? '/change-password?force=1'
        : location.state?.from || homeForRole(user.role);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Digital Legacy account"
      footer={
        <p className="text-sm text-ink-500">
          New owner?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert-error">{error}</div>}

        <div>
          <label className="field-label" htmlFor="identifier">
            Username or email
          </label>
          <input
            id="identifier"
            className="field-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-ink-50 to-brand-50 lg:flex-row">
      <aside className="hidden w-1/2 flex-col justify-between bg-brand-700 p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <ShieldCheck size={22} />
          </span>
          <span className="text-lg font-semibold">Digital Legacy</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            A trusted foundation for what matters most.
          </h2>
          <p className="mt-4 text-brand-100">
            Securely manage who can access your digital legacy — with admin-approved owners,
            role-based access, and protected beneficiary accounts.
          </p>
        </div>
        <p className="text-xs text-brand-200">
          Authentication module · v1.0
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-ink-900">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
            </div>
            {children}
          </div>
          {footer && <div className="mt-6 text-center">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
