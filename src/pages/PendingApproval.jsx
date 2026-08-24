import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';

export default function PendingApproval() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
      <div className="w-full max-w-md card text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <Clock size={28} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-ink-900">Pending approval</h1>
        <p className="mt-2 text-sm text-ink-600">
          Your registration is pending administrator approval. You will be able to sign in
          once an administrator has approved your account.
        </p>
        <Link
          to="/login"
          className="btn-secondary mt-6 inline-flex"
        >
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
