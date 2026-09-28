import React, { useState } from 'react';
import {
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  Layers,
  Sparkles,
  ChevronDown,
  Menu,
  Check,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { DEMO_PERSONAS, ROLES, FACULTY_SCOPES } from '../../utils/constants';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';
import { Badge } from '../ui/Badge';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, switchDemoUser, activeFacultyScope, switchFacultyScope } = useAuth();
  const { unreadCount, info } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'Event Approved',
      message: 'Your Hackathon 2026 registration is confirmed.',
      time: '10m ago',
      read: false,
    },
    {
      id: 2,
      title: 'OD Status Updated',
      message: 'OD application for AI Symposium was approved by Class Mentor.',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      title: 'New Dynamic Role Assigned',
      message: 'You were assigned as "Technical Lead" in CodeCraft Club.',
      time: '3h ago',
      read: true,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-surface-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
            MEGATHON 2026
          </span>
          <span className="text-xs text-surface-400">Campus Club Hub</span>
        </div>
      </div>

      {/* Middle: Faculty Scope Switcher (Visible only for Faculty) */}
      {user?.role === ROLES.FACULTY && (
        <div className="flex items-center bg-surface-900/90 p-1 rounded-xl border border-surface-800 shadow-inner">
          <button
            onClick={() => switchFacultyScope(FACULTY_SCOPES.CLUB_COORDINATOR)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeFacultyScope === FACULTY_SCOPES.CLUB_COORDINATOR
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Club Coordinator
          </button>
          <button
            onClick={() => switchFacultyScope(FACULTY_SCOPES.CLASS_MENTOR)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeFacultyScope === FACULTY_SCOPES.CLASS_MENTOR
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Class Mentor (ODs)
          </button>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Persona Switcher for Hackathon Evaluation */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900 hover:bg-surface-800 text-xs font-medium text-surface-200 border border-surface-700/80 transition-all hover:border-brand-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden md:inline">Role Switcher:</span>
              <span className="text-brand-400 font-semibold">{user?.role?.replace('_', ' ')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
            </button>
          }
        >
          <div className="px-3 py-2 border-b border-surface-800">
            <p className="text-[11px] font-semibold text-surface-300 uppercase tracking-wider">
              Switch Demo Persona
            </p>
            <p className="text-[10px] text-surface-400 mt-0.5">Instant role switching for demo evaluation</p>
          </div>
          {DEMO_PERSONAS.map((p) => {
            const isCurrent = user?.email === p.email;
            return (
              <DropdownItem
                key={p.email}
                onClick={() => {
                  switchDemoUser(p.email);
                  info(`Switched to ${p.name} (${p.badge})`, 'Demo Persona Changed');
                }}
                className={isCurrent ? 'bg-brand-500/10 text-brand-300' : ''}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-semibold text-xs text-surface-200">{p.name}</div>
                    <div className="text-[10px] text-surface-400">{p.description}</div>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-brand-400 ml-2" />}
                </div>
              </DropdownItem>
            );
          })}
        </Dropdown>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface-950 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel border border-surface-700 shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-surface-800">
                <h4 className="text-xs font-bold text-surface-100 uppercase tracking-wider">Notifications</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold">
                  {unreadCount} unread
                </span>
              </div>
              <div className="divide-y divide-surface-800/60 mt-2 max-h-64 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="py-2.5 hover:bg-surface-900/50 px-2 rounded-lg transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-surface-200">{notif.title}</p>
                      <span className="text-[10px] text-surface-500">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-surface-400 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-800 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-surface-100 leading-tight">{user?.fullName}</div>
                <div className="text-[10px] text-surface-400 font-mono">
                  {user?.raNumber || user?.role?.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-surface-400 hidden sm:block" />
            </button>
          }
        >
          <div className="px-3.5 py-2.5 border-b border-surface-800">
            <p className="text-xs font-semibold text-surface-100">{user?.fullName}</p>
            <p className="text-[11px] text-surface-400 truncate">{user?.email}</p>
            {user?.raNumber && (
              <p className="text-[10px] font-mono text-brand-400 mt-1 bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-500/20 inline-block">
                RA: {user.raNumber}
              </p>
            )}
          </div>
          <DropdownItem icon={User}>View Profile</DropdownItem>
          <DropdownItem icon={Shield}>Security & RBAC</DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={LogOut} danger onClick={logout}>
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
