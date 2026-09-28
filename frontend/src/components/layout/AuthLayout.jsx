import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Sparkles, Calendar, Clock } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-glow">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black tracking-tight text-surface-50">YUVA 2026</h1>
            <p className="text-xs text-brand-400 font-medium">Campus Club Hub</p>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl border border-surface-800 shadow-2xl">
          <Outlet />
        </div>

        {/* Platform Feature Badges */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-surface-400">
          <div className="p-2 rounded-xl bg-surface-900/60 border border-surface-800 flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role RBAC</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-900/60 border border-surface-800 flex flex-col items-center gap-1">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>OD Timetable</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-900/60 border border-surface-800 flex flex-col items-center gap-1">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Event Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
