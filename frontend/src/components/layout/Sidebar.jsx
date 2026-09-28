import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getNavigationItems } from '../../routes/navigationConfig';
import { ROLES, FACULTY_SCOPES } from '../../utils/constants';
import { X, Sparkles, GraduationCap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, activeFacultyScope } = useAuth();
  const location = useLocation();

  const navItems = getNavigationItems(user?.role, activeFacultyScope);

  const roleLabels = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Platform Admin',
    [ROLES.FACULTY]: activeFacultyScope === FACULTY_SCOPES.CLASS_MENTOR ? 'Faculty (Mentor)' : 'Faculty (Coord.)',
    [ROLES.CLUB_ADMIN]: 'Club Admin',
    [ROLES.STUDENT]: 'Student Portal',
  };

  const roleVariants = {
    [ROLES.SUPER_ADMIN]: 'danger',
    [ROLES.ADMIN]: 'purple',
    [ROLES.FACULTY]: 'brand',
    [ROLES.CLUB_ADMIN]: 'warning',
    [ROLES.STUDENT]: 'success',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 glass-panel border-r border-surface-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-surface-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-glow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-surface-50">YUVA HUB</span>
                <span className="text-[10px] block text-brand-400 font-mono leading-none">v1.0 • 2026</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Role Indicator */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-surface-900/80 border border-surface-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">Active Scope</span>
              <Badge variant={roleVariants[user?.role] || 'brand'} size="sm" dot>
                {roleLabels[user?.role] || user?.role}
              </Badge>
            </div>
            <div className="mt-2 text-xs font-medium text-surface-200 truncate">{user?.fullName}</div>
            {user?.raNumber && (
              <div className="text-[10px] font-mono text-surface-400 mt-0.5">RA: {user.raNumber}</div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-glow'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-surface-400 group-hover:text-surface-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-brand-800 text-white' : 'bg-surface-800 text-brand-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card / System Status */}
        <div className="p-4 m-3 rounded-xl bg-surface-900/60 border border-surface-800/80 text-[11px] text-surface-400">
          <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SQLite & RBAC Ready</span>
          </div>
          <p className="text-[10px] text-surface-500 leading-tight">
            Phase 2 Arch Verified • Strict Server-Side Scope Protection
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
