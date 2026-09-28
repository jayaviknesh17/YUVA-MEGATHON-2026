/**
 * YUVA Platform Constant Definitions
 * Aligned with Phase 2 Approved Architecture & Phase 3A-4/5 Auth Integration
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
  AUTH_TOKEN: 'yuva_access_token',
  REFRESH_TOKEN: 'yuva_refresh_token',
  AUTH_USER: 'yuva_auth_user',
  ACTIVE_FACULTY_SCOPE: 'yuva_faculty_active_scope',
};

// Seed credentials helper for login reference
export const SEED_CREDENTIALS = [
  { role: ROLES.SUPER_ADMIN, email: 'superadmin@yuva.edu', label: 'Super Admin', badge: 'Super Admin' },
  { role: ROLES.ADMIN, email: 'admin@yuva.edu', label: 'Dean / Admin', badge: 'Admin' },
  { role: ROLES.FACULTY, email: 'faculty@yuva.edu', label: 'Dr. Meera Krishnan', badge: 'Faculty' },
  { role: ROLES.CLUB_ADMIN, email: 'clubadmin@yuva.edu', label: 'Kavya S. (CodeCraft)', badge: 'Club Admin' },
  { role: ROLES.STUDENT, email: 'aarav@yuva.edu', label: 'Aarav Patel (RA2311003010001)', badge: 'Student 1' },
  { role: ROLES.STUDENT, email: 'diya@yuva.edu', label: 'Diya Menon (RA2311003010002)', badge: 'Student 2' },
];
