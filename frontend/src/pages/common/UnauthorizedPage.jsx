import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { ROLE_DEFAULT_ROUTES } from '../../utils/constants';

export const UnauthorizedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userDashboard = user?.role ? ROLE_DEFAULT_ROUTES[user.role] : '/login';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-surface-50">Access Denied (403 Forbidden)</h2>
      <p className="text-xs text-surface-400 max-w-md leading-relaxed">
        Your current role (<span className="text-brand-300 font-semibold">{user?.role || 'Guest'}</span>) does not possess server-side authorization to access this protected resource.
      </p>
      <div className="p-3 bg-surface-900 border border-surface-800 rounded-xl text-[11px] text-surface-400">
        Tip: Use the <span className="text-amber-400 font-semibold">Role Switcher</span> in the top-right navbar to test authorized roles (e.g. Super Admin for Timetable, Faculty for ODs).
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} iconLeft={ArrowLeft}>
          Go Back
        </Button>
        <Link to={userDashboard}>
          <Button variant="primary" size="sm" iconLeft={Home}>
            My Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
