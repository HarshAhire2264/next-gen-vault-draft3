import { useNavigate } from 'react-router-dom';
import { Shield, User, Users, LogOut, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { homeForRole } from './ProtectedRoute';

const ROLE_META = {
  ADMIN: { label: 'Administrator', Icon: Shield },
  OWNER: { label: 'Owner', Icon: User },
  BENEFICIARY: { label: 'Beneficiary', Icon: Users },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const meta = ROLE_META[user.role] || ROLE_META.BENEFICIARY;
  const Icon = meta.Icon;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => navigate(homeForRole(user.role))}
          className="flex items-center gap-2 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Shield size={18} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-ink-800">Digital Legacy</span>
            <span className="text-xs text-ink-500">Authentication Module</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-ink-50 px-3 py-1.5 text-xs font-medium text-ink-600 sm:flex">
            <Icon size={14} />
            <span>{meta.label}</span>
            <span className="text-ink-300">·</span>
            <span className="max-w-[12rem] truncate">{user.username}</span>
          </div>
          <button
            onClick={() => navigate('/change-password')}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-800"
            title="Change password"
          >
            <KeyRound size={16} />
            <span className="hidden sm:inline">Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink-50 px-2.5 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-800"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
