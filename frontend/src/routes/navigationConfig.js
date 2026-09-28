import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  Award,
  Users,
  Building2,
  ShieldCheck,
  Clock,
  Settings,
  History,
  QrCode,
  CheckCircle,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { ROLES, FACULTY_SCOPES } from '../utils/constants';

export const getNavigationItems = (role, facultyScope) => {
  switch (role) {
    case ROLES.STUDENT:
      return [
        {
          label: 'Dashboard',
          path: '/student/dashboard',
          icon: LayoutDashboard,
        },
        {
          label: 'Explore Events',
          path: '/student/events',
          icon: CalendarDays,
          badge: 'Live',
        },
        {
          label: 'On-Duty (OD) Requests',
          path: '/student/od',
          icon: FileCheck2,
        },
        {
          label: 'Certificates & Badges',
          path: '/student/certificates',
          icon: Award,
        },
        {
          label: 'Campus Clubs',
          path: '/student/clubs',
          icon: Building2,
        },
      ];

    case ROLES.CLUB_ADMIN:
      return [
        {
          label: 'Club Overview',
          path: '/club-admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          label: 'Manage Events',
          path: '/club-admin/events',
          icon: CalendarDays,
        },
        {
          label: 'Club Members',
          path: '/club-admin/members',
          icon: Users,
        },
        {
          label: 'Dynamic Roles',
          path: '/club-admin/roles',
          icon: Layers,
        },
        {
          label: 'Event Attendance',
          path: '/club-admin/attendance',
          icon: QrCode,
        },
      ];

    case ROLES.FACULTY:
      return facultyScope === FACULTY_SCOPES.CLASS_MENTOR
        ? [
            {
              label: 'Mentor Dashboard',
              path: '/faculty/dashboard',
              icon: LayoutDashboard,
            },
            {
              label: 'Student OD Approvals',
              path: '/faculty/od-approvals',
              icon: FileCheck2,
              badge: 'Action Req',
            },
            {
              label: 'Class Mentee Roster',
              path: '/faculty/mentees',
              icon: Users,
            },
          ]
        : [
            {
              label: 'Coordinator Dashboard',
              path: '/faculty/dashboard',
              icon: LayoutDashboard,
            },
            {
              label: 'Event Proposals',
              path: '/faculty/event-approvals',
              icon: CheckCircle,
              badge: 'Pending',
            },
            {
              label: 'Club Overview',
              path: '/faculty/club-oversight',
              icon: Building2,
            },
          ];

    case ROLES.ADMIN:
      return [
        {
          label: 'Admin Overview',
          path: '/admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          label: 'All Campus Clubs',
          path: '/admin/clubs',
          icon: Building2,
        },
        {
          label: 'User Directory',
          path: '/admin/users',
          icon: Users,
        },
        {
          label: 'Platform Reports',
          path: '/admin/reports',
          icon: FileSpreadsheet,
        },
      ];

    case ROLES.SUPER_ADMIN:
      return [
        {
          label: 'Master Dashboard',
          path: '/super-admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          label: 'Timetable Manager',
          path: '/super-admin/timetable',
          icon: Clock,
          highlight: true,
        },
        {
          label: 'System Configurations',
          path: '/super-admin/config',
          icon: Settings,
        },
        {
          label: 'Security & Audit Logs',
          path: '/super-admin/audit-logs',
          icon: History,
        },
      ];

    default:
      return [];
  }
};
