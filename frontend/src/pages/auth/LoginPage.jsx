import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DEMO_PERSONAS, ROLE_DEFAULT_ROUTES } from '../../utils/constants';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, switchDemoUser } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      success(`Welcome back, ${res.user.fullName}!`, 'Authenticated');
      navigate(res.defaultRoute || '/');
    } catch (err) {
      error(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPersonaSelect = (persona) => {
    switchDemoUser(persona.email);
    success(`Logged in as ${persona.name} (${persona.badge})`, 'Demo Persona Selected');
    navigate(ROLE_DEFAULT_ROUTES[persona.role]);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-surface-50 tracking-tight">Sign in to your account</h2>
        <p className="text-xs text-surface-400 mt-1">Access your campus club portal, events & OD records</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Institutional Email"
          type="email"
          placeholder="name@yuva.edu"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-surface-300 cursor-pointer">
            <input type="checkbox" className="rounded bg-surface-900 border-surface-700 text-brand-600 focus:ring-brand-500" />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-brand-400 hover:text-brand-300 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} iconRight={ArrowRight}>
          Sign In
        </Button>
      </form>

      {/* Quick 1-Click Demo Personas for Evaluation */}
      <div className="mt-8 pt-6 border-t border-surface-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Demo Login (Evaluation)
          </span>
          <span className="text-[10px] text-surface-500">1-click switch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DEMO_PERSONAS.map((p) => (
            <button
              key={p.email}
              type="button"
              onClick={() => handleQuickPersonaSelect(p)}
              className="p-2.5 text-left rounded-xl bg-surface-900/90 hover:bg-surface-800 border border-surface-800/80 hover:border-brand-500/40 transition-all text-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-surface-200 group-hover:text-brand-300">{p.badge}</span>
                <span className="text-[10px] text-brand-400">Login →</span>
              </div>
              <p className="text-[11px] text-surface-400 mt-0.5 truncate">{p.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
