/**
 * YUVA Platform Constant Definitions
 * Aligned with Phase 2 Approved Architecture
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  CLUB_ADMIN: 'CLUB_ADMIN',
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT',
};

export const FACULTY_SCOPES = {
  CLUB_COORDINATOR: 'CLUB_COORDINATOR',
  CLASS_MENTOR: 'CLASS_MENTOR',
};

export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_FACULTY_APPROVAL: 'PENDING_FACULTY_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const OD_STATUS = {
  PENDING_MENTOR_APPROVAL: 'PENDING_MENTOR_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const ROLE_DEFAULT_ROUTES = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.CLUB_ADMIN]: '/club-admin/dashboard',
  [ROLES.FACULTY]: '/faculty/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'yuva_auth_token',
  AUTH_USER: 'yuva_auth_user',
  ACTIVE_FACULTY_SCOPE: 'yuva_faculty_active_scope',
};

// Demo Seed Accounts for Instant Verification and Evaluation
export const DEMO_PERSONAS = [
  {
    role: ROLES.SUPER_ADMIN,
    name: 'Dr. A. Sharma',
    email: 'superadmin@yuva.edu',
    title: 'Super Administrator',
    description: 'Master Timetable Control & System Config',
    badge: 'Super Admin',
  },
  {
    role: ROLES.ADMIN,
    name: 'Prof. R. Nair',
    email: 'admin@yuva.edu',
    title: 'Dean Student Affairs (Admin)',
    description: 'Club Governance & Platform Analytics',
    badge: 'Admin',
  },
  {
    role: ROLES.FACULTY,
    name: 'Dr. Meera Krishnan',
    email: 'faculty@yuva.edu',
    title: 'Faculty Lead (Dual Scope)',
    description: 'Club Coordinator (Coding Club) & Class Mentor (Sec-A)',
    badge: 'Faculty',
    defaultScope: FACULTY_SCOPES.CLUB_COORDINATOR,
  },
  {
    role: ROLES.CLUB_ADMIN,
    name: 'Kavya S.',
    email: 'clubadmin@yuva.edu',
    title: 'President, CodeCraft Club',
    description: 'Event Creation, Membership & Dynamic Roles',
    badge: 'Club Admin',
  },
  {
    role: ROLES.STUDENT,
    name: 'Aarav Patel',
    email: 'aarav@yuva.edu',
    raNumber: 'RA2311003010001',
    title: 'Student (Section A)',
    description: 'Event Registrations, OD Application, Certificates',
    badge: 'Student 1',
  },
  {
    role: ROLES.STUDENT,
    name: 'Diya Menon',
    email: 'diya@yuva.edu',
    raNumber: 'RA2311003010002',
    title: 'Student & Tech Lead (Sec A)',
    description: 'Dynamic Club Role & Regular Student workflow',
    badge: 'Student 2',
  },
];
