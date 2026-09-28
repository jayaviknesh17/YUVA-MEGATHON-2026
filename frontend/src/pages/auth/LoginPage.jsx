import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SEED_CREDENTIALS, ROLE_DEFAULT_ROUTES } from '../../utils/constants';
import { Mail, Lock, ArrowRight, ShieldCheck, Key, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, isLoading } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      const msg = 'Please enter both institutional email and password.';
      setErrorMessage(msg);
      error(msg);
      return;
    }

    try {
      const res = await login(email.trim(), password);
      success(`Welcome back, ${res.user.full_name || res.user.fullName || 'User'}!`, 'Authenticated');
      
      const fromPath = location.state?.from?.pathname;
      const targetRoute = fromPath && fromPath !== '/login' ? fromPath : res.defaultRoute;
      navigate(targetRoute, { replace: true });
    } catch (err) {
      const backendError = err.data?.detail || err.message || 'Invalid credentials or server unavailable.';
      setErrorMessage(backendError);
      error(backendError, 'Login Failed');
    }
  };

  const handleSelectSeedCredential = (cred) => {
    setEmail(cred.email);
    setPassword('Password123!');
    setErrorMessage('');
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-surface-50 tracking-tight">Sign in to YUVA Hub</h2>
        <p className="text-xs text-surface-400 mt-1">Campus Club Management & Event Operations Platform</p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Institutional Email"
          type="email"
          placeholder="name@yuva.edu"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-surface-300 cursor-pointer">
            <input type="checkbox" className="rounded bg-surface-900 border-surface-700 text-brand-600 focus:ring-brand-500" />
            <span>Remember session</span>
          </label>
          <Link to="/forgot-password" className="text-brand-400 hover:text-brand-300 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full shadow-glow" isLoading={isLoading} iconRight={ArrowRight}>
          Authenticate Session
        </Button>
      </form>

      {/* Seed Account Quick-Fill Helper (Fills credentials and passes through real backend login) */}
      <div className="mt-8 pt-6 border-t border-surface-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-brand-400" />
            Seed Demo Accounts
          </span>
          <span className="text-[10px] text-surface-500 font-mono">Password: Password123!</span>
        </div>
        <p className="text-[11px] text-surface-400 mb-3">
          Click any persona to fill official seed credentials, then authenticate via real backend API:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {SEED_CREDENTIALS.map((cred) => (
            <button
              key={cred.email}
              type="button"
              onClick={() => handleSelectSeedCredential(cred)}
              className={`p-2 rounded-xl bg-surface-900 hover:bg-surface-850 border transition-all text-left text-xs ${
                email === cred.email ? 'border-brand-500/60 bg-brand-950/20' : 'border-surface-800/80 hover:border-surface-700'
              }`}
            >
              <div className="font-semibold text-surface-200 text-[11px] truncate">{cred.badge}</div>
              <div className="text-[10px] text-surface-400 font-mono truncate">{cred.email}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
