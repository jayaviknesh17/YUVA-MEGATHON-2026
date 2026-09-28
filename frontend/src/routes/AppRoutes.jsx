import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES, ROLE_DEFAULT_ROUTES } from '../utils/constants';

// Layouts
import AppLayout from '../components/layout/AppLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentEventsPage from '../pages/student/StudentEventsPage';
import StudentODPage from '../pages/student/StudentODPage';
import StudentCertificatesPage from '../pages/student/StudentCertificatesPage';
import StudentClubsPage from '../pages/student/StudentClubsPage';

// Club Admin Pages
import ClubAdminDashboard from '../pages/club-admin/ClubAdminDashboard';
import ClubEventsManagePage from '../pages/club-admin/ClubEventsManagePage';
import ClubMembersPage from '../pages/club-admin/ClubMembersPage';
import ClubRolesPage from '../pages/club-admin/ClubRolesPage';
import ClubAttendancePage from '../pages/club-admin/ClubAttendancePage';

// Faculty Pages
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import FacultyEventApprovalsPage from '../pages/faculty/FacultyEventApprovalsPage';
import FacultyODApprovalsPage from '../pages/faculty/FacultyODApprovalsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminClubsPage from '../pages/admin/AdminClubsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';

// Super Admin Pages
import SuperAdminDashboard from '../pages/super-admin/SuperAdminDashboard';
import SuperAdminTimetablePage from '../pages/super-admin/SuperAdminTimetablePage';
import SuperAdminSystemConfigPage from '../pages/super-admin/SuperAdminSystemConfigPage';
import SuperAdminAuditLogsPage from '../pages/super-admin/SuperAdminAuditLogsPage';

// Common Pages
import NotFoundPage from '../pages/common/NotFoundPage';
import UnauthorizedPage from '../pages/common/UnauthorizedPage';

export const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  // Root redirect resolver
  const RootRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }
    const targetRoute = ROLE_DEFAULT_ROUTES[user.role] || '/student/dashboard';
    return <Navigate to={targetRoute} replace />;
  };

  return (
    <Routes>
      {/* Root Route */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected Main Application Routes */}
      <Route element={<AppLayout />}>
        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/od"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentODPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/certificates"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentCertificatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/clubs"
          element={
            <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
              <StudentClubsPage />
            </ProtectedRoute>
          }
        />

        {/* Club Admin Routes */}
        <Route
          path="/club-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLUB_ADMIN]}>
              <ClubAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club-admin/events"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLUB_ADMIN]}>
              <ClubEventsManagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club-admin/members"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLUB_ADMIN]}>
              <ClubMembersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club-admin/roles"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLUB_ADMIN]}>
              <ClubRolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club-admin/attendance"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLUB_ADMIN]}>
              <ClubAttendancePage />
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/event-approvals"
          element={
            <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
              <FacultyEventApprovalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/od-approvals"
          element={
            <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
              <FacultyODApprovalsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clubs"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminClubsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/super-admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/timetable"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminTimetablePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/config"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminSystemConfigPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminAuditLogsPage />
            </ProtectedRoute>
          }
        />

        {/* Forbidden 403 Page */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
