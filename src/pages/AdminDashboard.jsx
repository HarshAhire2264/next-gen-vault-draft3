import { useCallback, useEffect, useState } from 'react';
import { Check, X, Loader2, ShieldCheck, Inbox } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { approveUser, getPendingRegistrations, rejectUser } from '../services/authService';

function StatusBadge({ status }) {
  const map = {
    PENDING: 'bg-amber-50 text-amber-700',
    ACTIVE: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-700',
  };
  return <span className={`badge ${map[status] || 'bg-ink-100 text-ink-600'}`}>{status}</span>;
}

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPendingRegistrations();
      setItems(data.registrations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    try {
      await approveUser(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoadingId(id);
    try {
      await rejectUser(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink-900">Admin dashboard</h1>
            <p className="text-sm text-ink-500">
              Welcome, {user?.name}. Review and act on pending owner registrations.
            </p>
          </div>
        </div>

        {error && <div className="alert-error mb-4">{error}</div>}

        <div className="card p-0">
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h2 className="text-base font-semibold text-ink-800">Pending registrations</h2>
            <span className="text-sm text-ink-500">{items.length} pending</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-500">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-ink-500">
              <Inbox size={28} />
              <p className="text-sm">No pending registrations right now.</p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {items.map((u) => (
                <li key={u.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink-800">{u.name}</span>
                      <StatusBadge status={u.status} />
                    </div>
                    <div className="mt-0.5 text-sm text-ink-500">
                      @{u.username} · {u.email}
                    </div>
                    <div className="mt-0.5 text-xs text-ink-400">
                      Registered {formatDate(u.createdAt)}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleApprove(u.id)}
                      className="btn-primary !py-2"
                      disabled={actionLoadingId === u.id}
                    >
                      <Check size={15} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(u.id)}
                      className="btn-danger !py-2"
                      disabled={actionLoadingId === u.id}
                    >
                      <X size={15} /> Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
