import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Menu,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { ROLES, FACULTY_SCOPES } from '../../utils/constants';
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/Dropdown';
import { Badge } from '../ui/Badge';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, activeFacultyScope, switchFacultyScope } = useAuth();
  const { unreadCount, info } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'Session Authenticated',
      message: 'Logged in successfully with active JWT session.',
      time: 'Just now',
      read: false,
    },
    {
      id: 2,
      title: 'Timetable Sync Active',
      message: 'Campus timetable structures are verified by Super Admin.',
      time: '1h ago',
      read: false,
    },
  ];

  const displayName = user?.full_name || user?.fullName || 'User';
  const displayEmail = user?.email || '';
  const displayRole = user?.role ? user.role.replace('_', ' ') : 'Guest';
  const studentRA = user?.student_profile?.ra_number || user?.raNumber || null;

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
        {/* Active Role Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900/80 border border-surface-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
          <span className="text-surface-400">Role:</span>
          <span className="text-brand-300 font-bold">{displayRole}</span>
        </div>

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
                {displayName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-surface-100 leading-tight">{displayName}</div>
                <div className="text-[10px] text-surface-400 font-mono">
                  {studentRA || displayRole}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-surface-400 hidden sm:block" />
            </button>
          }
        >
          <div className="px-3.5 py-2.5 border-b border-surface-800">
            <p className="text-xs font-semibold text-surface-100">{displayName}</p>
            <p className="text-[11px] text-surface-400 truncate">{displayEmail}</p>
            {studentRA && (
              <p className="text-[10px] font-mono text-brand-400 mt-1 bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-500/20 inline-block">
                RA: {studentRA}
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
