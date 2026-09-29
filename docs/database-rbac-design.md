# YUVA MegaThon 2026
# Database & RBAC Architecture Specification

**Version:** 1.0.0  
**Status:** Finalized & Approved Phase 2 Architecture (Locked)  
**Database Engine:** SQLite 3 (with mandatory foreign key enforcement enabled)  

---

## 1. Executive Summary & Core Architectural Principles

This document defines the authoritative database schema and Role-Based Access Control (RBAC) architecture for the YUVA MegaThon 2026 platform.

### Core System Principles
1. **SQLite 3 Engine:** Uses SQLite 3 as the primary database backend with `PRAGMA foreign_keys = ON;` executed on every database connection.
2. **Server-Side RBAC Mandatory:** Authorization decisions are computed strictly on the backend. UI element hiding is non-security.
3. **5 Locked System Roles:** `SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN`, `FACULTY`, `STUDENT`.
4. **Faculty Functional Scope Separation:** `Club Faculty Coordinator` (event approvals) and `Class Mentor` (OD approvals) are independent functional scopes.
5. **Event State Machine:** Enforces strict transition sequence: `DRAFT` → `PENDING_FACULTY_APPROVAL` → `APPROVED` → `ONGOING` → `COMPLETED` (Rejection flow: `PENDING_FACULTY_APPROVAL` → `REJECTED` → `DRAFT` → `PENDING_FACULTY_APPROVAL`). `RESUBMITTED` status is explicitly prohibited.

---

## 2. Final Locked Decisions Integration (Decisions A–D)

The database schema strictly implements the four final locked decisions:

### Decision A: Dynamic Permissions Single Source of Truth
- Permissions are stored in three normalized relational tables: `club_roles`, `permissions`, and `club_role_permissions`.
- `permissions_json` is NOT an authoritative source. All authorization checks query `club_role_permissions`.

### Decision B: Attendance Table Naming
- The underlying database table for attendance tracking is explicitly named `event_attendances`.
- Mapped cleanly to REST API endpoints `/api/v1/events/{id}/attendance/*` and `/api/v1/attendance/my`.

### Decision C: Club Admin & Lead Admin Single Source of Truth
- `club_memberships` table combined with `club_role_id` assignment (`Lead Admin`) is the sole authoritative source for club leadership.
- No redundant `clubs.lead_admin_id` column is maintained. API representations derive lead admin information via JOIN on `club_memberships`.

### Decision D: Class Mentor Mapping & OD Historical Snapshotting
- `class_mentor_assignments` table (mapping `faculty_user_id → department, year_of_study, section`) is the sole authoritative source for mentor routing.
- No static `student_profiles.class_mentor_id` column is maintained.
- When a student applies for On-Duty (OD), the active mentor is resolved from `class_mentor_assignments` and snapshotted into `od_requests.snapshotted_class_mentor_id` as an immutable historical record.

---

## 3. Database DDL Schema Specification

```sql
-- Enable mandatory foreign key constraints
PRAGMA foreign_keys = ON;

-- ==================================================
-- 1. USERS & PROFILES
-- ==================================================

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    system_role TEXT NOT NULL CHECK (system_role IN ('SUPER_ADMIN', 'ADMIN', 'CLUB_ADMIN', 'FACULTY', 'STUDENT')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE student_profiles (
    user_id TEXT PRIMARY KEY,
    ra_number TEXT UNIQUE NOT NULL CHECK (
        length(ra_number) = 15
        AND ra_number NOT GLOB '*[^A-Za-z0-9]*'
    ),
    department TEXT NOT NULL,
    year_of_study INTEGER NOT NULL CHECK (year_of_study BETWEEN 1 AND 4),
    section TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE faculty_profiles (
    user_id TEXT PRIMARY KEY,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==================================================
-- 2. CLUBS & NORMALIZED RBAC (DECISION A & C)
-- ==================================================

CREATE TABLE clubs (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    faculty_coordinator_id TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (faculty_coordinator_id) REFERENCES users(id)
);

CREATE TABLE club_roles (
    id TEXT PRIMARY KEY,
    club_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_system_default INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    UNIQUE (club_id, name)
);

CREATE TABLE permissions (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL
);

-- Authoritative Relational Join Table for Dynamic Permissions (Decision A)
CREATE TABLE club_role_permissions (
    club_role_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,
    PRIMARY KEY (club_role_id, permission_id),
    FOREIGN KEY (club_role_id) REFERENCES club_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Authoritative Table for Club Membership & Lead Admin (Decision C)
CREATE TABLE club_memberships (
    id TEXT PRIMARY KEY,
    club_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    club_role_id TEXT NOT NULL,
    joined_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_role_id) REFERENCES club_roles(id),
    UNIQUE (club_id, user_id)
);

-- ==================================================
-- 3. FACULTY SCOPE & CLASS MENTORS (DECISION D)
-- ==================================================

-- Authoritative Table for Class Mentor Cohort Mapping
CREATE TABLE class_mentor_assignments (
    id TEXT PRIMARY KEY,
    faculty_user_id TEXT NOT NULL,
    department TEXT NOT NULL,
    year_of_study INTEGER NOT NULL CHECK (year_of_study BETWEEN 1 AND 4),
    section TEXT NOT NULL,
    assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (faculty_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (department, year_of_study, section)
);

-- ==================================================
-- 4. TIMETABLES
-- ==================================================

CREATE TABLE timetables (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    semester_type TEXT NOT NULL CHECK (semester_type IN ('ODD', 'EVEN')),
    is_active INTEGER NOT NULL DEFAULT 0,
    effective_from TEXT NOT NULL,
    effective_to TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE timetable_slots (
    id TEXT PRIMARY KEY,
    timetable_id TEXT NOT NULL,
    period_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    FOREIGN KEY (timetable_id) REFERENCES timetables(id) ON DELETE CASCADE,
    UNIQUE (timetable_id, period_number)
);

-- ==================================================
-- 5. EVENTS & REGISTRATION
-- ==================================================

CREATE TABLE events (
    id TEXT PRIMARY KEY,
    club_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    venue TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    registered_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_count <= capacity),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_FACULTY_APPROVAL', 'APPROVED', 'REJECTED', 'ONGOING', 'COMPLETED')),
    rejection_reason TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE event_registrations (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    registered_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (event_id, student_id)
);

-- ==================================================
-- 6. ON-DUTY (OD) REQUESTS (DECISION D)
-- ==================================================

CREATE TABLE od_requests (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING_MENTOR_APPROVAL' CHECK (status IN ('PENDING_MENTOR_APPROVAL', 'APPROVED', 'REJECTED')),
    snapshotted_class_mentor_id TEXT NOT NULL,
    snapshotted_timetable_periods_json TEXT NOT NULL,
    reason TEXT NOT NULL,
    decision_reason TEXT,
    decided_at TEXT,
    submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (snapshotted_class_mentor_id) REFERENCES users(id),
    UNIQUE (student_id, event_id)
);

-- ==================================================
-- 7. ATTENDANCE (DECISION B)
-- ==================================================

-- DB Table Name: event_attendances (Decision B)
CREATE TABLE event_attendances (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    ra_number TEXT NOT NULL CHECK (
        length(ra_number) = 15
        AND ra_number NOT GLOB '*[^A-Za-z0-9]*'
    ),
    checkin_method TEXT NOT NULL CHECK (checkin_method IN ('MANUAL_ENTRY', 'QR_SCAN', 'SELF_CHECKIN')),
    marked_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (event_id, student_id)
);

-- ==================================================
-- 8. CERTIFICATES & BADGES
-- ==================================================

CREATE TABLE certificates (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    certificate_code TEXT UNIQUE NOT NULL,
    issue_date TEXT NOT NULL DEFAULT (date('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    UNIQUE (event_id, student_id)
);

CREATE TABLE badges (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE user_badges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    badge_id TEXT NOT NULL,
    reason TEXT,
    awarded_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE (user_id, badge_id)
);

-- ==================================================
-- 9. NOTIFICATIONS & AUDIT LOGS
-- ==================================================

CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    payload_before_json TEXT,
    payload_after_json TEXT,
    ip_address TEXT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (actor_id) REFERENCES users(id)
);
```

---

## 4. Server-Side RBAC Enforcement Matrix

| Endpoint Group | `SUPER_ADMIN` | `ADMIN` | `CLUB_ADMIN` | `FACULTY` | `STUDENT` |
|---|:---:|:---:|:---:|:---:|:---:|
| **Timetable Write** | YES | NO | NO | NO | NO |
| **Timetable Read** | YES | YES | YES | YES | YES |
| **User Create/Update** | YES | YES | NO | NO | NO |
| **User Delete** | YES | NO | NO | NO | NO |
| **Club Create/Delete** | YES | NO (Create only by Admin) | NO | NO | NO |
| **Club Members/Roles** | YES | YES | YES (Own Club) | NO | NO |
| **Event Create/Edit** | YES | YES | YES (Own Club) | NO | NO |
| **Event Submit** | YES | YES | YES (Own Club) | NO | NO |
| **Event Approve/Reject** | YES | NO | NO | YES (Club Coordinator Only) | NO |
| **Event Register** | NO | NO | NO | NO | YES |
| **OD Apply** | NO | NO | NO | NO | YES |
| **OD Approve/Reject** | YES | NO | NO | YES (Class Mentor Only) | NO |
| **Attendance Mark** | YES | YES | YES (Own Club) | NO | YES (Self Checkin) |
| **Certificates Generate** | YES | YES | YES (Own Club) | NO | NO |
| **Audit Logs View** | YES | YES | NO | NO | NO |

---

## 5. Official Requirement Verification Matrix

1. **SQLite 3 Engine & FK Enforcement:** Confirmed (`PRAGMA foreign_keys = ON;` in schema definition).
2. **RA Number Constraint:** Confirmed (`CHECK (length(ra_number) = 15 AND ra_number NOT GLOB '*[^A-Za-z0-9]*')`).
3. **5 Locked System Roles:** Confirmed (`SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN`, `FACULTY`, `STUDENT`).
4. **Faculty Dual Scope:** Confirmed (`Club Faculty Coordinator` vs `Class Mentor`).
5. **Super Admin Only Timetable Management:** Confirmed (`POST/PUT/DELETE/ACTIVATE /timetables`).
6. **Event State Machine:** Confirmed (`DRAFT` → `PENDING` → `APPROVED` → `ONGOING` → `COMPLETED`, rejection reverts to `DRAFT`).
7. **Registration Checks:** Confirmed (Student role only, approved events only, duplicate registration blocked, capacity limit enforced).
8. **OD Business Rules:** Confirmed (Requires valid prior event registration, attendance NOT required before OD, snapshotted timetable periods, snapshotted class mentor ID, Class Mentor approval flow).
9. **Attendance, Certificates, Badges, Notifications, Analytics, Audit Logs:** Confirmed across all schema tables and REST API specifications.
