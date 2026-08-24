import { useNavigate } from 'react-router-dom';
import { Users, KeyRound, Mail, User, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function Row({ Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b border-ink-100 py-3 last:border-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50 text-ink-500">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
        <div className="text-sm font-semibold text-ink-800">{value}</div>
      </div>
    </div>
  );
}

export default function BeneficiaryDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Beneficiary dashboard</h1>
            <p className="text-sm text-ink-500">Welcome, {user?.name}.</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-brand-700">
            <ShieldCheck size={18} />
            <h2 className="text-base font-semibold">Your account</h2>
          </div>
          <p className="mt-1 text-sm text-ink-500">
            These are the details assigned to you by the owner who created your account.
          </p>

          <div className="mt-5">
            <Row Icon={User} label="Name" value={user?.name} />
            <Row Icon={User} label="Username" value={`@${user?.username}`} />
            <Row Icon={Mail} label="Email" value={user?.email} />
          </div>

          {user?.mustChangePassword && (
            <div className="alert-info mt-5">
              You must change your initial password before this account is fully usable.
            </div>
          )}

          <button
            onClick={() => navigate('/change-password')}
            className="btn-primary mt-6"
          >
            <KeyRound size={16} /> Change password
          </button>
        </div>
      </main>
    </div>
  );
}
