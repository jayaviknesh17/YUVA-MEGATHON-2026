# YUVA MegaThon 2026
# API Contract

**Version:** 1.0.0  
**Status:** Approved & Finalized Phase 2 API Contract (Locked)  
**Target Specs:** FastAPI Backend (JV) & React Frontend (HARINI)  

---

## 1. API Conventions

### Base URL
All API requests must be routed to the base path:
`/api/v1`

### JSON Format & Content Negotiation
- All request payloads must specify header: `Content-Type: application/json`
- All response bodies (except binary downloads such as PDF certificates) are returned as JSON: `Content-Type: application/json`
- All date-time values must be formatted according to ISO 8601 extended string format in UTC: `YYYY-MM-DDTHH:mm:ssZ` (e.g., `2026-10-15T09:30:00Z`).
- Date values without time component must follow format: `YYYY-MM-DD` (e.g., `2026-10-15`).

### Authentication
- Stateless JWT (JSON Web Token) authentication is used for all protected endpoints.
- Clients send credentials in HTTP Header:
  `Authorization: Bearer <access_token>`
- Token Expiration & Refresh:
  - `access_token` lifetime: 15 to 60 minutes.
  - `refresh_token` lifetime: 7 days. Passed via `/api/v1/auth/refresh` to issue a new access token pair.

### Standard HTTP Status Codes
| HTTP Code | Description | Usage Context |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | Standard successful GET, PUT, PATCH, or POST action returning data |
| `201 Created` | Resource created | Successful POST entity creation |
| `204 No Content` | Success with no payload | Successful DELETE or state action without response body |
| `400 Bad Request` | Malformed payload | Malformed JSON syntax or missing mandatory fields |
| `401 Unauthorized` | Unauthenticated | Missing, expired, or invalid JWT token |
| `403 Forbidden` | Insufficient Privileges | Valid authentication, but insufficient system role, dynamic club role, or faculty scope |
| `404 Not Found` | Resource Not Found | Target ID does not exist or user lacks permission to access scoped entity |
| `409 Conflict` | Business Rule Conflict | Duplicate registration, duplicate RA number, duplicate certificate ID, capacity exceeded, invalid state transition |
| `422 Validation Error` | Schema/Regex Failure | Validation failure (e.g., RA number failing `^[A-Za-z0-9]{15}$`, invalid date format) |
| `500 Internal Server Error` | Server Exception | Unhandled internal server error |

### Standard Error Response Format
All error responses adhere to the following unified JSON response structure:
```json
{
  "success": false,
  "error_code": "RESOURCE_NOT_FOUND",
  "message": "The requested resource could not be found.",
  "details": {
    "resource_type": "event",
    "resource_id": "evt_9999"
  },
  "timestamp": "2026-09-29T00:00:00Z"
}
```

---

## 2. Authentication

### 2.1 Login
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/auth/login`
- **Authentication Required:** No
- **Required System Role:** Public
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "email": "user@srmist.edu.in",
  "password": "Password123!"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "d9f8e7d6c5b4a3...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "usr_01HGB12345",
    "email": "user@srmist.edu.in",
    "full_name": "Jane Doe",
    "system_role": "STUDENT",
    "ra_number": "RA2311003010001"
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Invalid credentials (`INVALID_CREDENTIALS`)
  - `422 Validation Error`: Invalid email format (`INVALID_EMAIL_FORMAT`)
- **Business Rules / Validation:**
  - Authenticates user against email and hashed password.
  - Returns `system_role` (one of: `SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN`, `FACULTY`, `STUDENT`).

---

### 2.2 Refresh Token
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/auth/refresh`
- **Authentication Required:** No (Uses refresh token payload)
- **Required System Role:** Public
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "refresh_token": "d9f8e7d6c5b4a3..."
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "e8e7e6e5e4e3e2...",
  "token_type": "bearer",
  "expires_in": 3600
}
```
- **Error Responses:**
  - `401 Unauthorized`: Refresh token expired or revoked (`INVALID_REFRESH_TOKEN`)
- **Business Rules / Validation:**
  - Rotates refresh token upon successful verification.

---

### 2.3 Logout
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/auth/logout`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "refresh_token": "d9f8e7d6c5b4a3..."
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Successfully logged out."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Token invalid or missing
- **Business Rules / Validation:**
  - Blacklists the provided refresh token.

---

### 2.4 Get Current Authenticated User Profile (`/auth/me`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/auth/me`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "usr_01HGB12345",
  "email": "student1@srmist.edu.in",
  "full_name": "Jane Doe",
  "system_role": "STUDENT",
  "ra_number": "RA2311003010001",
  "department": "Computer Science & Engineering",
  "year_of_study": 3,
  "section": "CSE-A",
  "class_mentor": {
    "id": "usr_fac_99",
    "full_name": "Dr. Alan Turing",
    "email": "alant@srmist.edu.in"
  },
  "club_memberships": [
    {
      "club_id": "clb_coding_club",
      "club_name": "Coding Club",
      "club_role_id": "role_lead_admin",
      "role_name": "Lead Admin",
      "is_club_admin": true
    }
  ],
  "faculty_scopes": {
    "is_club_faculty_coordinator": false,
    "coordinated_club_ids": [],
    "is_class_mentor": false,
    "mentored_sections": []
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Token invalid or expired
- **Business Rules / Validation:**
  - Evaluates user's effective roles, club memberships, and faculty functional scopes.
  - `class_mentor` is DERIVED from `class_mentor_assignments` matching student's department, year, and section.

---

### 2.5 Request Password Reset
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/auth/password-reset/request`
- **Authentication Required:** No
- **Required System Role:** Public
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "email": "user@srmist.edu.in"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "If the email is registered, a password reset token has been dispatched."
}
```
- **Error Responses:**
  - `422 Validation Error`: Invalid email format
- **Business Rules / Validation:**
  - Prevents user enumeration by returning `200 OK` even if email is not found.

---

### 2.6 Confirm Password Reset
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/auth/password-reset/confirm`
- **Authentication Required:** No
- **Required System Role:** Public
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "reset_token": "rst_tok_123456",
  "new_password": "NewSecurePassword123!"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Password successfully updated. Please log in with your new credentials."
}
```
- **Error Responses:**
  - `400 Bad Request`: Token expired or invalid (`INVALID_RESET_TOKEN`)
  - `422 Validation Error`: Password does not meet security criteria
- **Business Rules / Validation:**
  - Resets password hash upon valid single-use token verification.

---

## 3. Users

### 3.1 List Users
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/users`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** System-wide administration
- **Path Parameters:** None
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 20, max: 100)
  - `system_role` (string, optional, enum: `SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN`, `FACULTY`, `STUDENT`)
  - `search` (string, optional, searches name, email, ra_number)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "data": [
    {
      "id": "usr_01HGB12345",
      "email": "student1@srmist.edu.in",
      "full_name": "Jane Doe",
      "system_role": "STUDENT",
      "ra_number": "RA2311003010001",
      "department": "CSE",
      "is_active": true,
      "created_at": "2026-08-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_records": 150,
    "total_pages": 8
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User is not `SUPER_ADMIN` or `ADMIN`
- **Business Rules / Validation:**
  - Strict server-side RBAC: Only `SUPER_ADMIN` and `ADMIN` can retrieve user lists.

---

### 3.2 Create User
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/users`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** System-wide user creation
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "email": "student2@srmist.edu.in",
  "password": "InitialPassword123!",
  "full_name": "John Smith",
  "system_role": "STUDENT",
  "ra_number": "RA2311003010002",
  "department": "CSE",
  "year_of_study": 2,
  "section": "CSE-B"
}
```
- **Success Response (`201 Created`):**
```json
{
  "id": "usr_01HGB67890",
  "email": "student2@srmist.edu.in",
  "full_name": "John Smith",
  "system_role": "STUDENT",
  "ra_number": "RA2311003010002",
  "department": "CSE",
  "is_active": true,
  "created_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User is not `SUPER_ADMIN` or `ADMIN`
  - `409 Conflict`: Email or RA Number already exists (`DUPLICATE_USER_FIELD`)
  - `422 Validation Error`: RA Number format error (`INVALID_RA_NUMBER`)
- **Business Rules / Validation:**
  - **LOCKED RA NUMBER RULE:** If `system_role` is `STUDENT`, `ra_number` is MANDATORY and MUST match exact API validation regex:
    `^[A-Za-z0-9]{15}$` (exactly 15 alphanumeric characters).
  - SQLite database level constraint enforced:
    `CHECK (length(ra_number) = 15 AND ra_number NOT GLOB '*[^A-Za-z0-9]*')`
  - NON-STUDENT system roles (`SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN`, `FACULTY`) must set `ra_number` to `null`.
  - **LOCKED CLASS MENTOR RULE:** Class mentor assignment is NOT stored as a static column on student profile. It is derived dynamically from `class_mentor_assignments` table based on student's department, year, and section.
  - Creates audit log for user creation.

---

### 3.3 Get User Details
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/users/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or self (`id` matches token user ID)
- **Required Permission/Scope:** Self or User Manager
- **Path Parameters:**
  - `id` (string, required, user ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "usr_01HGB12345",
  "email": "student1@srmist.edu.in",
  "full_name": "Jane Doe",
  "system_role": "STUDENT",
  "ra_number": "RA2311003010001",
  "department": "CSE",
  "year_of_study": 3,
  "section": "CSE-A",
  "is_active": true,
  "created_at": "2026-08-01T10:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Authenticated user is trying to view another user's details without `SUPER_ADMIN`/`ADMIN` role
  - `404 Not Found`: User ID not found
- **Business Rules / Validation:**
  - Strict ownership check: Users can only view their own user profile unless they possess `SUPER_ADMIN` or `ADMIN` system role.

---

### 3.4 Update User
- **HTTP Method:** `PUT`
- **Endpoint:** `/api/v1/users/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** User Management
- **Path Parameters:**
  - `id` (string, required, user ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "full_name": "Jane M. Doe",
  "system_role": "STUDENT",
  "ra_number": "RA2311003010001",
  "department": "CSE",
  "is_active": true
}
```
- **Success Response (`200 OK`):**
```json
{
  "id": "usr_01HGB12345",
  "email": "student1@srmist.edu.in",
  "full_name": "Jane M. Doe",
  "system_role": "STUDENT",
  "ra_number": "RA2311003010001",
  "department": "CSE",
  "is_active": true,
  "updated_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient privilege
  - `409 Conflict`: Updated RA number collides with another user
  - `422 Validation Error`: RA Number regex mismatch (`^[A-Za-z0-9]{15}$`)
- **Business Rules / Validation:**
  - Modifying `ra_number` triggers mandatory `^[A-Za-z0-9]{15}$` validation.
  - System role changes create an audit log.

---

### 3.5 Delete / Deactivate User
- **HTTP Method:** `DELETE`
- **Endpoint:** `/api/v1/users/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN` ONLY
- **Required Permission/Scope:** Super Administration
- **Path Parameters:**
  - `id` (string, required, user ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "User usr_01HGB12345 deactivated successfully."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: `ADMIN`, `CLUB_ADMIN`, `FACULTY`, `STUDENT` attempted deletion
  - `404 Not Found`: User ID not found
- **Business Rules / Validation:**
  - Only `SUPER_ADMIN` can soft-delete or deactivate users.
  - Creates audit log for user deletion.

---

### 3.6 Get Student Profile Detail
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/users/students/profile`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT`
- **Required Permission/Scope:** Student self scope
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "student_user_id": "usr_01HGB12345",
  "ra_number": "RA2311003010001",
  "department": "CSE",
  "section": "CSE-A",
  "year_of_study": 3,
  "class_mentor": {
    "mentor_id": "usr_fac_99",
    "full_name": "Dr. Alan Turing",
    "email": "alant@srmist.edu.in"
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-STUDENT system role calling student profile endpoint
- **Business Rules / Validation:**
  - Returns student specific profile data.
  - `class_mentor` object is DERIVED dynamically from `class_mentor_assignments` matching student's department, year_of_study, and section.

---

## 4. Clubs

### 4.1 List Clubs
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/clubs`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role (`SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN`, `FACULTY`, `STUDENT`)
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 20)
  - `category` (string, optional)
  - `is_active` (boolean, optional, default: true)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "data": [
    {
      "id": "clb_coding_club",
      "name": "Coding Club",
      "code": "CC-SRM",
      "category": "Technical",
      "description": "Official programming and competitive coding club.",
      "faculty_coordinator": {
        "id": "usr_fac_01",
        "full_name": "Dr. Grace Hopper",
        "email": "graceh@srmist.edu.in"
      },
      "lead_admin": {
        "id": "usr_01HGB12345",
        "full_name": "Jane Doe",
        "email": "student1@srmist.edu.in"
      },
      "is_active": true,
      "member_count": 45
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_records": 12,
    "total_pages": 1
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Token invalid or missing
- **Business Rules / Validation:**
  - All authenticated users can view active club directory.
  - `lead_admin` field in response is DERIVED dynamically from `club_memberships` where `club_role_id` corresponds to `Lead Admin`.

---

### 4.2 Create Club
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/clubs`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** System Administration
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "name": "Robotics Club",
  "code": "ROBO-SRM",
  "category": "Technical",
  "description": "Robotics, IoT, and embedded systems engineering.",
  "faculty_coordinator_id": "usr_fac_02"
}
```
- **Success Response (`201 Created`):**
```json
{
  "id": "clb_robotics_club",
  "name": "Robotics Club",
  "code": "ROBO-SRM",
  "category": "Technical",
  "description": "Robotics, IoT, and embedded systems engineering.",
  "faculty_coordinator_id": "usr_fac_02",
  "is_active": true,
  "created_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: `CLUB_ADMIN`, `FACULTY`, `STUDENT` cannot create clubs
  - `409 Conflict`: Club name or code already exists (`DUPLICATE_CLUB_CODE`)
  - `422 Validation Error`: `faculty_coordinator_id` user does not have `FACULTY` system role
- **Business Rules / Validation:**
  - `faculty_coordinator_id` MUST point to a valid user whose system role is `FACULTY`.
  - **LOCKED CLUB ADMIN RULE:** Club leadership is NOT stored via a `lead_admin_id` column. Leadership is established by adding a user to `club_memberships` with the `Lead Admin` dynamic club role.
  - Creates audit log for club creation.

---

### 4.3 Get Club Details
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/clubs/{id}`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** N/A
- **Path Parameters:**
  - `id` (string, required, club ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "clb_coding_club",
  "name": "Coding Club",
  "code": "CC-SRM",
  "category": "Technical",
  "description": "Official programming club.",
  "faculty_coordinator": {
    "id": "usr_fac_01",
    "full_name": "Dr. Grace Hopper",
    "email": "graceh@srmist.edu.in"
  },
  "lead_admin": {
    "id": "usr_01HGB12345",
    "full_name": "Jane Doe",
    "email": "student1@srmist.edu.in"
  },
  "is_active": true,
  "created_at": "2026-01-15T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `404 Not Found`: Club ID not found
- **Business Rules / Validation:**
  - Public club information viewable by all authenticated users.
  - `lead_admin` object is DERIVED from `club_memberships` + role assignment.

---

### 4.4 Update Club Metadata
- **HTTP Method:** `PUT`
- **Endpoint:** `/api/v1/clubs/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or `CLUB_ADMIN` (belonging to this specific club)
- **Required Permission/Scope:** Club administration scope for `{id}`
- **Path Parameters:**
  - `id` (string, required, club ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "name": "Coding Club - SRM Kattankulathur",
  "description": "Updated official competitive programming club.",
  "category": "Technical",
  "faculty_coordinator_id": "usr_fac_01"
}
```
- **Success Response (`200 OK`):**
```json
{
  "id": "clb_coding_club",
  "name": "Coding Club - SRM Kattankulathur",
  "code": "CC-SRM",
  "category": "Technical",
  "description": "Updated official competitive programming club.",
  "faculty_coordinator_id": "usr_fac_01",
  "updated_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User is a `CLUB_ADMIN` of another club or a `STUDENT`/`FACULTY` without club scope
  - `404 Not Found`: Club ID not found
- **Business Rules / Validation:**
  - `CLUB_ADMIN` can only update details of their OWN assigned club (`id`).
  - Only `SUPER_ADMIN` and `ADMIN` can update `faculty_coordinator_id`.

---

### 4.5 Delete / Deactivate Club
- **HTTP Method:** `DELETE`
- **Endpoint:** `/api/v1/clubs/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN` ONLY
- **Required Permission/Scope:** Super Administration
- **Path Parameters:**
  - `id` (string, required, club ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Club clb_coding_club deactivated."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Attempted deletion by non-`SUPER_ADMIN`
  - `404 Not Found`: Club ID not found
- **Business Rules / Validation:**
  - Soft-deletes club. Active events remain archived.
  - Creates audit log.

---

### 4.6 List Club Members
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/clubs/{id}/members`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN` of this club, or `FACULTY` coordinator of this club
- **Required Permission/Scope:** Club membership view scope
- **Path Parameters:**
  - `id` (string, required, club ID)
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 20)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "club_id": "clb_coding_club",
  "members": [
    {
      "user_id": "usr_01HGB12345",
      "full_name": "Jane Doe",
      "email": "student1@srmist.edu.in",
      "system_role": "STUDENT",
      "club_role": {
        "id": "role_lead_admin",
        "name": "Lead Admin"
      },
      "joined_at": "2026-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_records": 45
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Attempted access by member of another club or regular student
  - `404 Not Found`: Club ID not found
- **Business Rules / Validation:**
  - Access restricted to club admins, faculty coordinator for this club, and central admins.

---

### 4.7 Add Member to Club
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/clubs/{id}/members`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or `CLUB_ADMIN` of this club
- **Required Permission/Scope:** Club Member Management for `{id}`
- **Path Parameters:**
  - `id` (string, required, club ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "user_id": "usr_01HGB67890",
  "club_role_id": "role_event_organizer"
}
```
- **Success Response (`201 Created`):**
```json
{
  "success": true,
  "club_id": "clb_coding_club",
  "user_id": "usr_01HGB67890",
  "club_role_id": "role_event_organizer",
  "added_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: `CLUB_ADMIN` of another club attempting addition
  - `409 Conflict`: User is already a member of this club (`ALREADY_CLUB_MEMBER`)
  - `404 Not Found`: `user_id` or `club_role_id` not found
- **Business Rules / Validation:**
  - `club_memberships` entry + `club_role_id` assignment is the AUTHORITATIVE single source of truth for club membership and club leadership.

---

### 4.8 Remove Member from Club
- **HTTP Method:** `DELETE`
- **Endpoint:** `/api/v1/clubs/{id}/members/{user_id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or `CLUB_ADMIN` of this club
- **Required Permission/Scope:** Club Member Management for `{id}`
- **Path Parameters:**
  - `id` (string, required, club ID)
  - `user_id` (string, required, user ID to remove)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "User usr_01HGB67890 removed from club clb_coding_club."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient club scope permission
  - `404 Not Found`: User is not a member of this club
- **Business Rules / Validation:**
  - Removes user from `club_memberships` table and revokes dynamic club roles.

---

## 5. Club Roles / Dynamic Permissions

### 5.1 List Dynamic Roles for a Club
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/clubs/{id}/roles`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or `CLUB_ADMIN` of this club
- **Required Permission/Scope:** Club role view scope for `{id}`
- **Path Parameters:**
  - `id` (string, required, club ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "club_id": "clb_coding_club",
  "roles": [
    {
      "id": "role_lead_admin",
      "name": "Lead Admin",
      "description": "Full administrative control over club events and members.",
      "permissions": [
        "EVENT_CREATE",
        "EVENT_EDIT",
        "EVENT_SUBMIT",
        "ATTENDANCE_MARK",
        "CERTIFICATE_GENERATE",
        "MEMBER_MANAGE"
      ],
      "is_system_default": true
    },
    {
      "id": "role_event_organizer",
      "name": "Event Organizer",
      "description": "Can draft events and mark attendance.",
      "permissions": [
        "EVENT_CREATE",
        "EVENT_EDIT",
        "ATTENDANCE_MARK"
      ],
      "is_system_default": false
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Cross-club access attempt by unauthorized user
  - `404 Not Found`: Club ID not found
- **Business Rules / Validation:**
  - **LOCKED DYNAMIC PERMISSIONS RULE:** The backend stores and evaluates permissions via normalized tables (`club_roles`, `permissions`, `club_role_permissions`). The API exposes an array of string permission codes (`"permissions": [...]`) for client consumption, but `permissions_json` is NOT an authoritative source.

---

### 5.2 Create Dynamic Club Role
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/clubs/{id}/roles`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or `CLUB_ADMIN` of this club
- **Required Permission/Scope:** Dynamic Role Management for `{id}`
- **Path Parameters:**
  - `id` (string, required, club ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "name": "PR & Media Manager",
  "description": "Manages event announcements and public certificates.",
  "permissions": [
    "EVENT_CREATE",
    "CERTIFICATE_GENERATE"
  ]
}
```
- **Success Response (`201 Created`):**
```json
{
  "id": "role_pr_media_mgr",
  "club_id": "clb_coding_club",
  "name": "PR & Media Manager",
  "description": "Manages event announcements and public certificates.",
  "permissions": [
    "EVENT_CREATE",
    "CERTIFICATE_GENERATE"
  ],
  "created_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User is not a `CLUB_ADMIN` of this club
  - `409 Conflict`: Role name already exists in this club (`DUPLICATE_ROLE_NAME`)
  - `422 Validation Error`: Invalid permission string in list
- **Business Rules / Validation:**
  - Inserts role permissions into normalized `club_role_permissions` join table.
  - Permitted permission strings: `EVENT_CREATE`, `EVENT_EDIT`, `EVENT_SUBMIT`, `ATTENDANCE_MARK`, `CERTIFICATE_GENERATE`, `MEMBER_MANAGE`.

---

### 5.3 Update Dynamic Club Role
- **HTTP Method:** `PUT`
- **Endpoint:** `/api/v1/clubs/{id}/roles/{role_id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or `CLUB_ADMIN` of this club
- **Required Permission/Scope:** Dynamic Role Management for `{id}`
- **Path Parameters:**
  - `id` (string, required, club ID)
  - `role_id` (string, required, role ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "name": "Senior Event Manager",
  "description": "Updated permissions for senior event managers.",
  "permissions": [
    "EVENT_CREATE",
    "EVENT_EDIT",
    "EVENT_SUBMIT",
    "ATTENDANCE_MARK"
  ]
}
```
- **Success Response (`200 OK`):**
```json
{
  "id": "role_event_organizer",
  "club_id": "clb_coding_club",
  "name": "Senior Event Manager",
  "permissions": [
    "EVENT_CREATE",
    "EVENT_EDIT",
    "EVENT_SUBMIT",
    "ATTENDANCE_MARK"
  ],
  "updated_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Modifying system default roles or cross-club role modification attempt
  - `404 Not Found`: Role ID or Club ID not found
- **Business Rules / Validation:**
  - Updates normalized `club_role_permissions` join table records.
  - Built-in system default club roles (`is_system_default: true`) cannot have their permissions deleted.

---

### 5.4 Delete Dynamic Club Role
- **HTTP Method:** `DELETE`
- **Endpoint:** `/api/v1/clubs/{id}/roles/{role_id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or `CLUB_ADMIN` of this club
- **Required Permission/Scope:** Dynamic Role Management for `{id}`
- **Path Parameters:**
  - `id` (string, required, club ID)
  - `role_id` (string, required, role ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Role role_pr_media_mgr deleted successfully."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Attempting to delete a default system role or assigned role in use
  - `404 Not Found`: Role ID not found
- **Business Rules / Validation:**
  - Deletes role and corresponding `club_role_permissions` entries.
  - Prevents deletion if role is currently assigned to members (`ROLE_IN_USE`).

---

### 5.5 Assign Dynamic Club Role to Member
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/clubs/{id}/members/{user_id}/roles`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, or `CLUB_ADMIN` of this club
- **Required Permission/Scope:** Member Role Assignment for `{id}`
- **Path Parameters:**
  - `id` (string, required, club ID)
  - `user_id` (string, required, member user ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "role_id": "role_lead_admin"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "club_id": "clb_coding_club",
  "user_id": "usr_01HGB12345",
  "assigned_role_id": "role_lead_admin",
  "updated_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient privilege
  - `404 Not Found`: User is not a member of this club or role ID does not exist
- **Business Rules / Validation:**
  - Granting `role_lead_admin` updates `club_memberships.club_role_id` and elevates `user_id` to act as `CLUB_ADMIN` for this club scope.

---

## 6. Faculty Scope

### 6.1 Get Active Faculty Scopes for Current User (`/faculty/scopes/me`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/faculty/scopes/me`
- **Authentication Required:** Yes
- **Required System Role:** `FACULTY`
- **Required Permission/Scope:** Faculty Self Scope
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "faculty_user_id": "usr_fac_01",
  "full_name": "Dr. Grace Hopper",
  "club_coordinator_scope": {
    "is_assigned": true,
    "clubs": [
      {
        "club_id": "clb_coding_club",
        "club_name": "Coding Club",
        "assigned_at": "2026-01-10T00:00:00Z"
      }
    ]
  },
  "class_mentor_scope": {
    "is_assigned": true,
    "mentored_cohorts": [
      {
        "department": "CSE",
        "section": "CSE-A",
        "year_of_study": 3,
        "student_count": 60
      }
    ]
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-FACULTY role accessing this endpoint
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULE:** `Club Faculty Coordinator` and `Class Mentor` are two distinct, separate functional scopes of `FACULTY`. A single faculty user can hold one, both, or neither.
  - Event approval is authorized ONLY via `club_coordinator_scope`.
  - OD approval is authorized ONLY via `class_mentor_scope` (queried from `class_mentor_assignments`).

---

### 6.2 List Club Faculty Coordinators
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/faculty/coordinators`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** Faculty Scope Administration
- **Path Parameters:** None
- **Query Parameters:**
  - `club_id` (string, optional)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "coordinators": [
    {
      "assignment_id": "fca_1001",
      "faculty_user_id": "usr_fac_01",
      "faculty_name": "Dr. Grace Hopper",
      "faculty_email": "graceh@srmist.edu.in",
      "club_id": "clb_coding_club",
      "club_name": "Coding Club",
      "assigned_at": "2026-01-10T00:00:00Z"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient system privilege
- **Business Rules / Validation:**
  - Lists central club coordinator mappings.

---

### 6.3 Assign Club Faculty Coordinator
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/faculty/coordinators`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** Faculty Scope Administration
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "faculty_user_id": "usr_fac_01",
  "club_id": "clb_coding_club"
}
```
- **Success Response (`201 Created`):**
```json
{
  "assignment_id": "fca_1001",
  "faculty_user_id": "usr_fac_01",
  "club_id": "clb_coding_club",
  "assigned_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient system privilege
  - `409 Conflict`: Faculty already assigned to this club or club already has a coordinator (`DUPLICATE_COORDINATOR_ASSIGNMENT`)
  - `422 Validation Error`: Target user does not possess `FACULTY` system role
- **Business Rules / Validation:**
  - Validates that `faculty_user_id` has `FACULTY` system role.
  - Updates `clubs.faculty_coordinator_id`.

---

### 6.4 Remove Club Faculty Coordinator Assignment
- **HTTP Method:** `DELETE`
- **Endpoint:** `/api/v1/faculty/coordinators/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** Faculty Scope Administration
- **Path Parameters:**
  - `id` (string, required, assignment ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Faculty coordinator assignment fca_1001 removed."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient system privilege
  - `404 Not Found`: Assignment ID not found
- **Business Rules / Validation:**
  - Removes club coordinator assignment. Creates audit log.

---

### 6.5 List Class Mentors & Cohort Mappings
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/faculty/mentors`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** Faculty Scope Administration
- **Path Parameters:** None
- **Query Parameters:**
  - `department` (string, optional)
  - `section` (string, optional)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "mentors": [
    {
      "assignment_id": "cma_5001",
      "faculty_user_id": "usr_fac_99",
      "faculty_name": "Dr. Alan Turing",
      "faculty_email": "alant@srmist.edu.in",
      "department": "CSE",
      "section": "CSE-A",
      "year_of_study": 3,
      "student_count": 60
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient system privilege
- **Business Rules / Validation:**
  - **LOCKED CLASS MENTOR RULE:** `class_mentor_assignments` is the authoritative single source of truth for Faculty → Department → Year → Section mentor mapping.

---

### 6.6 Assign Class Mentor to Student Cohort
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/faculty/mentors`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** Faculty Scope Administration
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "faculty_user_id": "usr_fac_99",
  "department": "CSE",
  "section": "CSE-A",
  "year_of_study": 3
}
```
- **Success Response (`201 Created`):**
```json
{
  "assignment_id": "cma_5001",
  "faculty_user_id": "usr_fac_99",
  "department": "CSE",
  "section": "CSE-A",
  "year_of_study": 3,
  "assigned_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient system privilege
  - `409 Conflict`: Cohort already assigned to another class mentor
  - `422 Validation Error`: User does not possess `FACULTY` system role
- **Business Rules / Validation:**
  - Inserts record into authoritative `class_mentor_assignments` table.
  - Enforces single active mentor per student cohort (Department, Year, Section).

---

### 6.7 List Students Under Current Class Mentor Scope
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/faculty/mentors/my-students`
- **Authentication Required:** Yes
- **Required System Role:** `FACULTY`
- **Required Permission/Scope:** Class Mentor Scope
- **Path Parameters:** None
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 50)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "mentor_id": "usr_fac_99",
  "students": [
    {
      "student_id": "usr_01HGB12345",
      "full_name": "Jane Doe",
      "ra_number": "RA2311003010001",
      "department": "CSE",
      "section": "CSE-A",
      "year_of_study": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total_records": 60
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Faculty member is not assigned as Class Mentor
- **Business Rules / Validation:**
  - Dynamically joins `class_mentor_assignments` with `student_profiles` to return students mapped under this Class Mentor's cohort scope.

---

## 7. Timetable

### 7.1 List Timetable Structures
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/timetables`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN`, `FACULTY`, `STUDENT`
- **Required Permission/Scope:** Permitted reading scope
- **Path Parameters:** None
- **Query Parameters:**
  - `is_active` (boolean, optional)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "timetables": [
    {
      "id": "tb_2026_odd",
      "name": "Academic Year 2026-2027 Odd Semester Timetable",
      "academic_year": "2026-2027",
      "semester_type": "ODD",
      "is_active": true,
      "effective_from": "2026-07-01",
      "effective_to": "2026-12-15",
      "created_by": "usr_super_01"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULE:** `ADMIN`, `CLUB_ADMIN`, `FACULTY`, and `STUDENT` can ONLY read timetable data according to their permitted scope.

---

### 7.2 Get Currently Active Timetable Structure
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/timetables/active`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "tb_2026_odd",
  "name": "Academic Year 2026-2027 Odd Semester Timetable",
  "academic_year": "2026-2027",
  "semester_type": "ODD",
  "is_active": true,
  "slots": [
    {
      "slot_id": "slot_p1",
      "period_number": 1,
      "name": "Period 1",
      "start_time": "08:00",
      "end_time": "08:50"
    },
    {
      "slot_id": "slot_p2",
      "period_number": 2,
      "name": "Period 2",
      "start_time": "08:50",
      "end_time": "09:40"
    },
    {
      "slot_id": "slot_p3",
      "period_number": 3,
      "name": "Period 3",
      "start_time": "09:45",
      "end_time": "10:35"
    },
    {
      "slot_id": "slot_p4",
      "period_number": 4,
      "name": "Period 4",
      "start_time": "10:40",
      "end_time": "11:30"
    },
    {
      "slot_id": "slot_p5",
      "period_number": 5,
      "name": "Period 5",
      "start_time": "11:35",
      "end_time": "12:25"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `404 Not Found`: No active timetable structure set (`NO_ACTIVE_TIMETABLE`)
- **Business Rules / Validation:**
  - Serves as the authoritative source for OD calculation against active periods.

---

### 7.3 Create Timetable Structure
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/timetables`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN` ONLY
- **Required Permission/Scope:** Super Administration
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "name": "Academic Year 2026-2027 Even Semester Timetable",
  "academic_year": "2026-2027",
  "semester_type": "EVEN",
  "effective_from": "2027-01-05",
  "effective_to": "2027-05-30",
  "slots": [
    { "period_number": 1, "name": "Period 1", "start_time": "08:00", "end_time": "08:50" },
    { "period_number": 2, "name": "Period 2", "start_time": "08:50", "end_time": "09:40" }
  ]
}
```
- **Success Response (`201 Created`):**
```json
{
  "id": "tb_2026_even",
  "name": "Academic Year 2026-2027 Even Semester Timetable",
  "is_active": false,
  "created_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: `ADMIN`, `CLUB_ADMIN`, `FACULTY`, `STUDENT` attempted creation
  - `422 Validation Error`: Invalid period timing or overlapping slot times
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULE:** Only `SUPER_ADMIN` can create timetable structures.
  - Creates audit log.

---

### 7.4 Edit Timetable Structure
- **HTTP Method:** `PUT`
- **Endpoint:** `/api/v1/timetables/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN` ONLY
- **Required Permission/Scope:** Super Administration
- **Path Parameters:**
  - `id` (string, required, timetable ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "name": "Updated Academic Year 2026-2027 Even Semester Timetable",
  "effective_from": "2027-01-10",
  "effective_to": "2027-05-30"
}
```
- **Success Response (`200 OK`):**
```json
{
  "id": "tb_2026_even",
  "name": "Updated Academic Year 2026-2027 Even Semester Timetable",
  "updated_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-`SUPER_ADMIN` attempted edit
  - `404 Not Found`: Timetable ID not found
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULE:** Only `SUPER_ADMIN` can edit timetable structures.
  - Snapshot integrity rule: Editing an existing timetable DOES NOT alter past historical OD records (which use snapshotted period details).

---

### 7.5 Activate Timetable Structure
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/timetables/{id}/activate`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN` ONLY
- **Required Permission/Scope:** Super Administration
- **Path Parameters:**
  - `id` (string, required, timetable ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Timetable tb_2026_even is now the active system timetable.",
  "active_timetable_id": "tb_2026_even"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-`SUPER_ADMIN` attempted activation
  - `404 Not Found`: Timetable ID not found
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULE:** Only `SUPER_ADMIN` can activate timetable structures.
  - Automatically deactivates any previously active timetable. Creates audit log.

---

### 7.6 Delete Timetable Structure
- **HTTP Method:** `DELETE`
- **Endpoint:** `/api/v1/timetables/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN` ONLY
- **Required Permission/Scope:** Super Administration
- **Path Parameters:**
  - `id` (string, required, timetable ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Timetable tb_2026_even deleted."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-`SUPER_ADMIN` attempted deletion
  - `409 Conflict`: Cannot delete an currently active timetable (`CANNOT_DELETE_ACTIVE_TIMETABLE`)
  - `404 Not Found`: Timetable ID not found
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULE:** Only `SUPER_ADMIN` can delete timetable structures.

---

### 7.7 Get Period Slots for Timetable
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/timetables/{id}/slots`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** Read timetable scope
- **Path Parameters:**
  - `id` (string, required, timetable ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "timetable_id": "tb_2026_odd",
  "slots": [
    { "slot_id": "slot_p1", "period_number": 1, "name": "Period 1", "start_time": "08:00", "end_time": "08:50" },
    { "slot_id": "slot_p2", "period_number": 2, "name": "Period 2", "start_time": "08:50", "end_time": "09:40" }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `404 Not Found`: Timetable ID not found
- **Business Rules / Validation:**
  - Read-only slot mapping listing.

---

## 8. Events

### 8.1 List Events
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/events`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role (RBAC filtered output)
- **Required Permission/Scope:** Scope-dependent filtering
- **Path Parameters:** None
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 20)
  - `status` (string, optional, enum: `DRAFT`, `PENDING_FACULTY_APPROVAL`, `APPROVED`, `REJECTED`, `ONGOING`, `COMPLETED`)
  - `club_id` (string, optional)
  - `search` (string, optional)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "data": [
    {
      "id": "evt_hackathon_2026",
      "title": "National Hackathon 2026",
      "club_id": "clb_coding_club",
      "club_name": "Coding Club",
      "status": "APPROVED",
      "start_time": "2026-10-15T09:00:00Z",
      "end_time": "2026-10-15T17:00:00Z",
      "venue": "Tech Park Auditorium",
      "capacity": 200,
      "registered_count": 142
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_records": 1
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
- **Business Rules / Validation:**
  - **VISIBILITY & RBAC RULES:**
    - `STUDENT`: Can ONLY view events in `APPROVED`, `ONGOING`, or `COMPLETED` state. Requests for events in `DRAFT`, `PENDING_FACULTY_APPROVAL`, or `REJECTED` are hidden/filtered out server-side.
    - `CLUB_ADMIN` / Club Member: Can view `DRAFT`, `PENDING_FACULTY_APPROVAL`, `APPROVED`, `REJECTED`, `ONGOING`, `COMPLETED` for their OWN club.
    - `FACULTY` (Club Faculty Coordinator): Can view `PENDING_FACULTY_APPROVAL`, `APPROVED`, `REJECTED`, `ONGOING`, `COMPLETED` for their assigned club(s).
    - `SUPER_ADMIN`, `ADMIN`: Can view all events across all statuses.

---

### 8.2 Create Event Draft
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` (or system `ADMIN`/`SUPER_ADMIN`)
- **Required Permission/Scope:** `EVENT_CREATE` permission in dynamic club role for `club_id`
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "club_id": "clb_coding_club",
  "title": "AI & ML Workshop",
  "description": "Hands-on workshop on deep learning and transformer models.",
  "venue": "TP 401",
  "capacity": 50,
  "start_time": "2026-10-20T09:00:00Z",
  "end_time": "2026-10-20T16:00:00Z",
  "banner_url": "https://storage.srmist.edu.in/banners/aiml.png"
}
```
- **Success Response (`201 Created`):**
```json
{
  "id": "evt_aiml_2026",
  "club_id": "clb_coding_club",
  "title": "AI & ML Workshop",
  "status": "DRAFT",
  "capacity": 50,
  "registered_count": 0,
  "created_by": "usr_01HGB12345",
  "created_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User is not a `CLUB_ADMIN` or lacks `EVENT_CREATE` permission in target `club_id`
  - `422 Validation Error`: `start_time` is in the past or `end_time` <= `start_time`
- **Business Rules / Validation:**
  - **LOCKED EVENT STATE MACHINE:** Newly created events initialize strictly in `DRAFT` status.
  - Initial `registered_count` is 0.

---

### 8.3 Get Detailed Event Info
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/events/{id}`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role (subject to status visibility RBAC)
- **Required Permission/Scope:** Status visibility scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "evt_hackathon_2026",
  "club_id": "clb_coding_club",
  "club_name": "Coding Club",
  "title": "National Hackathon 2026",
  "description": "24-hour national level hackathon.",
  "status": "APPROVED",
  "venue": "Tech Park Auditorium",
  "capacity": 200,
  "registered_count": 142,
  "start_time": "2026-10-15T09:00:00Z",
  "end_time": "2026-10-15T17:00:00Z",
  "rejection_reason": null,
  "created_by": "usr_01HGB12345",
  "created_at": "2026-09-20T10:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: `STUDENT` attempting to view event in `DRAFT` or `PENDING_FACULTY_APPROVAL` status
  - `404 Not Found`: Event ID not found
- **Business Rules / Validation:**
  - Server-side RBAC enforces visibility based on state and role.

---

### 8.4 Update Event Draft / Rejected Event
- **HTTP Method:** `PUT`
- **Endpoint:** `/api/v1/events/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of the event's club
- **Required Permission/Scope:** `EVENT_EDIT` permission for this club scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "title": "National Hackathon 2026 - Revised",
  "description": "Updated venue details and expanded track list.",
  "venue": "Tech Park Main Hall",
  "capacity": 250,
  "start_time": "2026-10-15T09:00:00Z",
  "end_time": "2026-10-15T17:00:00Z"
}
```
- **Success Response (`200 OK`):**
```json
{
  "id": "evt_hackathon_2026",
  "title": "National Hackathon 2026 - Revised",
  "status": "DRAFT",
  "capacity": 250,
  "updated_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User does not have `CLUB_ADMIN` role for this club
  - `409 Conflict`: Editing not allowed because event is in `PENDING_FACULTY_APPROVAL`, `APPROVED`, `ONGOING`, or `COMPLETED` state (`EVENT_STATE_LOCK`)
  - `404 Not Found`: Event ID not found
- **Business Rules / Validation:**
  - **LOCKED EVENT STATE MACHINE RULE:** Updates are ONLY permitted when event status is `DRAFT` or `REJECTED`.
  - Updating a `REJECTED` event transitions its status back to `DRAFT` so it can be re-submitted.

---

### 8.5 Delete Event Draft
- **HTTP Method:** `DELETE`
- **Endpoint:** `/api/v1/events/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of event's club, `SUPER_ADMIN`
- **Required Permission/Scope:** Event management scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Event draft evt_aiml_2026 deleted successfully."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient privilege
  - `409 Conflict`: Cannot delete event in `APPROVED`, `ONGOING`, or `COMPLETED` status (`CANNOT_DELETE_ACTIVE_EVENT`)
  - `404 Not Found`: Event ID not found
- **Business Rules / Validation:**
  - Deletion allowed only for `DRAFT` or `REJECTED` events.

---

### 8.6 Submit Event for Faculty Approval
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/submit`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of the event's club
- **Required Permission/Scope:** `EVENT_SUBMIT` permission for this club scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "evt_hackathon_2026",
  "status": "PENDING_FACULTY_APPROVAL",
  "submitted_at": "2026-09-29T00:00:00Z",
  "message": "Event submitted for Faculty Coordinator approval."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User is not a `CLUB_ADMIN` of this club
  - `409 Conflict`: Event status is not `DRAFT` or `REJECTED` (`INVALID_STATE_TRANSITION`)
  - `404 Not Found`: Event ID not found
- **Business Rules / Validation:**
  - **LOCKED EVENT STATE MACHINE TRANSITIONS:**
    - Valid source states: `DRAFT` or `REJECTED`.
    - Target state: `PENDING_FACULTY_APPROVAL`.
    - **CRITICAL RULE:** DO NOT create `RESUBMITTED` as a separate database status! Submitting a previously `REJECTED` event transitions it directly back to `PENDING_FACULTY_APPROVAL`.
  - Dispatches notification to assigned Club Faculty Coordinator.

---

### 8.7 Approve Event (Faculty Coordinator)
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/approve`
- **Authentication Required:** Yes
- **Required System Role:** `FACULTY` ONLY
- **Required Permission/Scope:** Assigned `Club Faculty Coordinator` for this specific club (`club_id`)
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "comments": "Approved. Budget and venue allocation confirmed."
}
```
- **Success Response (`200 OK`):**
```json
{
  "id": "evt_hackathon_2026",
  "status": "APPROVED",
  "approved_by": "usr_fac_01",
  "approved_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Authenticated user is NOT the designated Club Faculty Coordinator for this event's club (`NOT_CLUB_FACULTY_COORDINATOR`)
  - `409 Conflict`: Event status is not `PENDING_FACULTY_APPROVAL` (`INVALID_STATE_TRANSITION`)
  - `404 Not Found`: Event ID not found
- **Business Rules / Validation:**
  - **LOCKED EVENT STATE MACHINE TRANSITION:** `PENDING_FACULTY_APPROVAL` → `APPROVED`.
  - **MANDATORY BUSINESS RULE:** Only `FACULTY` acting as the assigned `Club Faculty Coordinator` for that specific club can approve events.
  - Upon `APPROVED` state, event becomes visible to students for registration.
  - Creates audit log.

---

### 8.8 Reject Event (Faculty Coordinator)
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/reject`
- **Authentication Required:** Yes
- **Required System Role:** `FACULTY` ONLY
- **Required Permission/Scope:** Assigned `Club Faculty Coordinator` for this specific club (`club_id`)
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "rejection_reason": "Venue collision on requested date. Please reschedule to Friday."
}
```
- **Success Response (`200 OK`):**
```json
{
  "id": "evt_hackathon_2026",
  "status": "REJECTED",
  "rejected_by": "usr_fac_01",
  "rejection_reason": "Venue collision on requested date. Please reschedule to Friday.",
  "rejected_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User is NOT the designated Club Faculty Coordinator for this event's club
  - `409 Conflict`: Event status is not `PENDING_FACULTY_APPROVAL`
  - `422 Validation Error`: `rejection_reason` is missing or empty (`REJECTION_REASON_REQUIRED`)
- **Business Rules / Validation:**
  - **LOCKED EVENT STATE MACHINE TRANSITION:** `PENDING_FACULTY_APPROVAL` → `REJECTED`.
  - **MANDATORY BUSINESS RULE:** Event rejection REQUIRES a non-empty `rejection_reason`.
  - Only assigned `Club Faculty Coordinator` for that club can reject.
  - Dispatches rejection notification to `CLUB_ADMIN`.

---

### 8.9 Start Event
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/start`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of event's club
- **Required Permission/Scope:** Event execution scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "evt_hackathon_2026",
  "status": "ONGOING",
  "started_at": "2026-10-15T09:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient club scope
  - `409 Conflict`: Event status is not `APPROVED` (`INVALID_STATE_TRANSITION`)
- **Business Rules / Validation:**
  - **LOCKED EVENT STATE MACHINE TRANSITION:** `APPROVED` → `ONGOING`.
  - Enables active attendance marking sessions.

---

### 8.10 Complete Event
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/complete`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of event's club
- **Required Permission/Scope:** Event execution scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "evt_hackathon_2026",
  "status": "COMPLETED",
  "completed_at": "2026-10-15T17:30:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient club scope
  - `409 Conflict`: Event status is not `ONGOING` (`INVALID_STATE_TRANSITION`)
- **Business Rules / Validation:**
  - **LOCKED EVENT STATE MACHINE TRANSITION:** `ONGOING` → `COMPLETED`.
  - Closes attendance check-ins and unlocks certificate generation.

---

## 9. Event Registration

### 9.1 Register for Event
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/register`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self registration
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`201 Created`):**
```json
{
  "registration_id": "reg_998877",
  "event_id": "evt_hackathon_2026",
  "student_id": "usr_01HGB12345",
  "ra_number": "RA2311003010001",
  "status": "CONFIRMED",
  "registered_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-`STUDENT` system role (e.g. `FACULTY`, `ADMIN`) attempting event registration
  - `404 Not Found`: Event ID not found or event is not in `APPROVED` status
  - `409 Conflict`:
    - Duplicate registration: `STUDENT_ALREADY_REGISTERED`
    - Event capacity exceeded: `EVENT_CAPACITY_EXCEEDED`
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULES:**
    1. Only `APPROVED` events are visible and open for student registration.
    2. Duplicate event registration MUST be prevented (`STUDENT_ALREADY_REGISTERED`).
    3. Event capacity MUST NOT be exceeded (`registered_count < capacity`). Atomic counter or row locking required.
    4. `STUDENT` system role mandatory.

---

### 9.2 Cancel Registration
- **HTTP Method:** `DELETE`
- **Endpoint:** `/api/v1/events/{id}/register`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self registration
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Registration for event evt_hackathon_2026 canceled."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-STUDENT role
  - `409 Conflict`: Cannot cancel registration after event has started (`EVENT_ALREADY_STARTED`)
  - `404 Not Found`: Registration record not found
- **Business Rules / Validation:**
  - Decrements `registered_count` on event.

---

### 9.3 List Event Registrations
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/events/{id}/registrations`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of event's club, `FACULTY` coordinator, `ADMIN`, `SUPER_ADMIN`
- **Required Permission/Scope:** Event reporting scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 50)
  - `search` (string, optional)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "event_id": "evt_hackathon_2026",
  "registrations": [
    {
      "registration_id": "reg_998877",
      "student_id": "usr_01HGB12345",
      "student_name": "Jane Doe",
      "ra_number": "RA2311003010001",
      "department": "CSE",
      "section": "CSE-A",
      "registered_at": "2026-09-29T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total_records": 142
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: `STUDENT` or member of another club attempting to view attendee list
  - `404 Not Found`: Event ID not found
- **Business Rules / Validation:**
  - Server-side access control guarantees only authorized club and faculty managers can inspect registrations.

---

### 9.4 List Current Student Registrations (`/registrations/my`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/registrations/my`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self scope
- **Path Parameters:** None
- **Query Parameters:**
  - `status` (string, optional)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "registrations": [
    {
      "registration_id": "reg_998877",
      "event": {
        "id": "evt_hackathon_2026",
        "title": "National Hackathon 2026",
        "club_name": "Coding Club",
        "start_time": "2026-10-15T09:00:00Z",
        "venue": "Tech Park Auditorium",
        "status": "APPROVED"
      },
      "has_applied_od": false,
      "registered_at": "2026-09-29T00:00:00Z"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-STUDENT role
- **Business Rules / Validation:**
  - Returns registrations for the authenticated student.

---

## 10. OD (On-Duty)

### 10.1 Apply for On-Duty (OD) Leave
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/od/requests`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self OD application
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "event_id": "evt_hackathon_2026",
  "reason": "Participating in national programming competition."
}
```
- **Success Response (`201 Created`):**
```json
{
  "od_request_id": "od_req_771122",
  "student_id": "usr_01HGB12345",
  "ra_number": "RA2311003010001",
  "event_id": "evt_hackathon_2026",
  "status": "PENDING_MENTOR_APPROVAL",
  "snapshotted_class_mentor_id": "usr_fac_99",
  "assigned_mentor": {
    "id": "usr_fac_99",
    "name": "Dr. Alan Turing"
  },
  "snapshotted_timetable_periods": [
    {
      "timetable_id": "tb_2026_odd",
      "date": "2026-10-15",
      "period_number": 2,
      "period_name": "Period 2",
      "start_time": "08:50",
      "end_time": "09:40"
    },
    {
      "timetable_id": "tb_2026_odd",
      "date": "2026-10-15",
      "period_number": 3,
      "period_name": "Period 3",
      "start_time": "09:45",
      "end_time": "10:35"
    }
  ],
  "submitted_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-`STUDENT` role applying for OD
  - `409 Conflict`:
    - No valid registration: `NO_EVENT_REGISTRATION_FOUND` (Student must have valid event registration before applying for OD)
    - Duplicate OD request: `OD_REQUEST_ALREADY_EXISTS`
  - `422 Validation Error`: No active timetable structure exists or student missing Class Mentor assignment in `class_mentor_assignments`
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULES ENFORCED:**
    1. **VALID REGISTRATION RULE:** Student MUST already have a valid event registration (`registration_id`) for `event_id` before applying for OD (`NO_EVENT_REGISTRATION_FOUND`).
    2. **ATTENDANCE RULE:** Attendance is **NOT** required before applying for OD. OD can be requested as soon as the student is registered.
    3. **TIMETABLE SNAPSHOT RULE:** OD is calculated against the currently active timetable (`GET /api/v1/timetables/active`). All affected timetable periods covering the event timeframe are **SNAPSHOTTED** into the OD record payload (`snapshotted_timetable_periods`) so historical records do not change if the timetable structure changes later.
    4. **CLASS MENTOR RESOLUTION & SNAPSHOT RULE:** The student's Class Mentor is resolved dynamically from `class_mentor_assignments` matching the student's department, year, and section, and stored into `snapshotted_class_mentor_id` as a historical record.
  - Dispatches notification to assigned Class Mentor.

---

### 10.2 List Student's Own OD Requests (`/od/requests/my`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/od/requests/my`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self scope
- **Path Parameters:** None
- **Query Parameters:**
  - `status` (string, optional, enum: `PENDING_MENTOR_APPROVAL`, `APPROVED`, `REJECTED`)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "od_requests": [
    {
      "od_request_id": "od_req_771122",
      "event_title": "National Hackathon 2026",
      "status": "PENDING_MENTOR_APPROVAL",
      "class_mentor_name": "Dr. Alan Turing",
      "submitted_at": "2026-09-29T00:00:00Z"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-STUDENT system role
- **Business Rules / Validation:**
  - Returns student's personal OD history.

---

### 10.3 List Pending OD Requests for Class Mentor (`/od/requests/pending-mentor`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/od/requests/pending-mentor`
- **Authentication Required:** Yes
- **Required System Role:** `FACULTY` ONLY
- **Required Permission/Scope:** Assigned `Class Mentor` scope
- **Path Parameters:** None
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 20)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "mentor_user_id": "usr_fac_99",
  "pending_requests": [
    {
      "od_request_id": "od_req_771122",
      "student": {
        "id": "usr_01HGB12345",
        "full_name": "Jane Doe",
        "ra_number": "RA2311003010001",
        "department": "CSE",
        "section": "CSE-A"
      },
      "event": {
        "id": "evt_hackathon_2026",
        "title": "National Hackathon 2026",
        "start_time": "2026-10-15T09:00:00Z"
      },
      "affected_periods_count": 2,
      "submitted_at": "2026-09-29T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_records": 1
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Authenticated user is NOT assigned as a Class Mentor
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULE:** Only returns OD requests where `snapshotted_class_mentor_id` or active cohort assignment matches the requesting faculty's Class Mentor scope.

---

### 10.4 Get Detailed OD Request Info
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/od/requests/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` (applicant), `FACULTY` (assigned Class Mentor), `ADMIN`, `SUPER_ADMIN`
- **Required Permission/Scope:** OD request ownership or mentor scope
- **Path Parameters:**
  - `id` (string, required, OD request ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "od_request_id": "od_req_771122",
  "student": {
    "id": "usr_01HGB12345",
    "full_name": "Jane Doe",
    "ra_number": "RA2311003010001",
    "department": "CSE",
    "section": "CSE-A"
  },
  "event": {
    "id": "evt_hackathon_2026",
    "title": "National Hackathon 2026",
    "club_name": "Coding Club",
    "start_time": "2026-10-15T09:00:00Z",
    "end_time": "2026-10-15T17:00:00Z"
  },
  "status": "APPROVED",
  "class_mentor": {
    "id": "usr_fac_99",
    "name": "Dr. Alan Turing"
  },
  "snapshotted_timetable_periods": [
    {
      "date": "2026-10-15",
      "period_number": 2,
      "period_name": "Period 2",
      "start_time": "08:50",
      "end_time": "09:40"
    }
  ],
  "decision_reason": "Approved for official competition.",
  "decided_at": "2026-09-29T10:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Access attempted by faculty member who is NOT the student's assigned Class Mentor
  - `404 Not Found`: OD Request ID not found
- **Business Rules / Validation:**
  - Strict scope isolation: Only applicant student, assigned Class Mentor, or central admin can view.

---

### 10.5 Approve OD Request (Class Mentor)
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/od/requests/{id}/approve`
- **Authentication Required:** Yes
- **Required System Role:** `FACULTY` ONLY
- **Required Permission/Scope:** Assigned `Class Mentor` for the applying student ONLY
- **Path Parameters:**
  - `id` (string, required, OD request ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "comments": "Approved. Attendance credit granted for affected slots."
}
```
- **Success Response (`200 OK`):**
```json
{
  "od_request_id": "od_req_771122",
  "status": "APPROVED",
  "approved_by": "usr_fac_99",
  "approved_at": "2026-09-29T10:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Authenticated faculty is NOT the student's assigned Class Mentor (`NOT_STUDENT_CLASS_MENTOR`)
  - `409 Conflict`: OD Request status is not `PENDING_MENTOR_APPROVAL`
  - `404 Not Found`: OD Request ID not found
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULES ENFORCED:**
    1. Only `FACULTY` acting as the applying student's assigned `Class Mentor` can approve OD.
    2. `Club Faculty Coordinator` scope CANNOT approve OD requests (functional scope separation).
  - Creates audit log. Dispatches notification to student.

---

### 10.6 Reject OD Request (Class Mentor)
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/od/requests/{id}/reject`
- **Authentication Required:** Yes
- **Required System Role:** `FACULTY` ONLY
- **Required Permission/Scope:** Assigned `Class Mentor` for the applying student ONLY
- **Path Parameters:**
  - `id` (string, required, OD request ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "rejection_reason": "Low academic attendance percentage in core subject during period 2."
}
```
- **Success Response (`200 OK`):**
```json
{
  "od_request_id": "od_req_771122",
  "status": "REJECTED",
  "rejected_by": "usr_fac_99",
  "rejection_reason": "Low academic attendance percentage in core subject during period 2.",
  "rejected_at": "2026-09-29T10:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Authenticated faculty is NOT the student's assigned Class Mentor
  - `409 Conflict`: OD Request status is not `PENDING_MENTOR_APPROVAL`
  - `422 Validation Error`: `rejection_reason` is missing or empty (`REJECTION_REASON_REQUIRED`)
- **Business Rules / Validation:**
  - OD rejection REQUIRES a non-empty `rejection_reason`.
  - Dispatches rejection notification to student.

---

## 11. Attendance

### 11.1 Create Attendance Session
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/attendance/session`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of event's club
- **Required Permission/Scope:** `ATTENDANCE_MARK` permission for event club
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "session_name": "Main Hall Morning Entry Check-in",
  "valid_minutes": 30
}
```
- **Success Response (`201 Created`):**
```json
{
  "session_id": "att_sess_445566",
  "event_id": "evt_hackathon_2026",
  "session_code": "CHK-8891",
  "qr_code_payload": "https://yuva.srmist.edu.in/checkin?code=CHK-8891",
  "expires_at": "2026-10-15T09:30:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Lacks `ATTENDANCE_MARK` permission in event club
  - `409 Conflict`: Event status is not `ONGOING` (`EVENT_NOT_ONGOING`)
- **Business Rules / Validation:**
  - Attendance session can only be created when event status is `ONGOING`.
  - Database table: `event_attendances`.

---

### 11.2 Mark Attendance (Organizer Manual / Scanner Entry)
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/attendance/mark`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of event's club
- **Required Permission/Scope:** `ATTENDANCE_MARK` permission for event club
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "ra_number": "RA2311003010001",
  "checkin_method": "MANUAL_ENTRY"
}
```
- **Success Response (`200 OK`):**
```json
{
  "attendance_id": "att_rec_112233",
  "event_id": "evt_hackathon_2026",
  "student_id": "usr_01HGB12345",
  "ra_number": "RA2311003010001",
  "marked_at": "2026-10-15T09:12:00Z",
  "status": "PRESENT"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient club role
  - `404 Not Found`: Student with `ra_number` is not registered for this event (`STUDENT_NOT_REGISTERED_FOR_EVENT`)
  - `409 Conflict`: Attendance already marked (`ATTENDANCE_ALREADY_MARKED`)
  - `422 Validation Error`: `ra_number` fails regex `^[A-Za-z0-9]{15}$`
- **Business Rules / Validation:**
  - Validates `ra_number` against 15-char regex. Enforces pre-registration check.
  - Inserts attendance record into `event_attendances` DB table.

---

### 11.3 Student Self Check-in
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/attendance/self-checkin`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Self check-in scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "session_code": "CHK-8891"
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "attendance_id": "att_rec_112233",
  "marked_at": "2026-10-15T09:15:00Z",
  "message": "Self check-in verified successfully."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Student not registered for event
  - `400 Bad Request`: Session code expired or invalid (`EXPIRED_SESSION_CODE`)
  - `409 Conflict`: Attendance already marked
- **Business Rules / Validation:**
  - Verifies student registration and active, non-expired session code.
  - Inserts record into `event_attendances` DB table.

---

### 11.4 Get Event Attendance List
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/events/{id}/attendance`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of event club, `FACULTY` coordinator, `ADMIN`, `SUPER_ADMIN`
- **Required Permission/Scope:** Attendance reporting scope
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 50)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "event_id": "evt_hackathon_2026",
  "total_attended": 128,
  "records": [
    {
      "attendance_id": "att_rec_112233",
      "student_name": "Jane Doe",
      "ra_number": "RA2311003010001",
      "department": "CSE",
      "marked_at": "2026-10-15T09:12:00Z",
      "checkin_method": "MANUAL_ENTRY"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Unauthorized user role
- **Business Rules / Validation:**
  - Queries `event_attendances` DB table and returns verified attendee records.

---

### 11.5 Get Student Personal Attendance History (`/attendance/my`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/attendance/my`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self scope
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "student_ra_number": "RA2311003010001",
  "attendance_records": [
    {
      "event_id": "evt_hackathon_2026",
      "event_title": "National Hackathon 2026",
      "marked_at": "2026-10-15T09:12:00Z",
      "status": "PRESENT"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-STUDENT role
- **Business Rules / Validation:**
  - Returns personal attendance history for requesting student from `event_attendances` DB table.

---

## 12. Certificates

### 12.1 Bulk Generate Event Certificates
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/events/{id}/certificates/generate`
- **Authentication Required:** Yes
- **Required System Role:** `CLUB_ADMIN` of event club, `ADMIN`, `SUPER_ADMIN`
- **Required Permission/Scope:** `CERTIFICATE_GENERATE` permission for event club
- **Path Parameters:**
  - `id` (string, required, event ID)
- **Query Parameters:** None
- **Request Body:**
```json
{
  "template_id": "tmpl_standard_cert_2026",
  "issue_to_all_attendees": true
}
```
- **Success Response (`201 Created`):**
```json
{
  "event_id": "evt_hackathon_2026",
  "certificates_generated_count": 128,
  "status": "COMPLETED",
  "generated_at": "2026-10-16T10:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Lacks `CERTIFICATE_GENERATE` permission
  - `409 Conflict`: Event status is not `COMPLETED` (`EVENT_NOT_COMPLETED`)
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULES ENFORCED:**
    1. Certificates can ONLY be generated for events in `COMPLETED` status.
    2. **UNIQUE CERTIFICATE ID RULE:** Every generated certificate receives a globally unique, cryptographically random verification code (e.g. `CERT-2026-HK88912`). Database UNIQUE constraint enforced.
  - Creates audit log.

---

### 12.2 List Student Certificates (`/certificates/my`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/certificates/my`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self scope
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "certificates": [
    {
      "certificate_id": "cert_990011",
      "certificate_code": "CERT-2026-HK88912",
      "event_title": "National Hackathon 2026",
      "issue_date": "2026-10-16",
      "download_url": "/api/v1/certificates/cert_990011/download"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-STUDENT role
- **Business Rules / Validation:**
  - Returns student's issued certificates.

---

### 12.3 Verify Certificate by Code
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/certificates/verify/{certificate_code}`
- **Authentication Required:** No (Public Endpoint)
- **Required System Role:** Public
- **Required Permission/Scope:** N/A
- **Path Parameters:**
  - `certificate_code` (string, required, unique certificate verification code)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "is_valid": true,
  "certificate_code": "CERT-2026-HK88912",
  "recipient_name": "Jane Doe",
  "ra_number": "RA2311003010001",
  "event_title": "National Hackathon 2026",
  "organizing_club": "Coding Club",
  "issue_date": "2026-10-16",
  "verification_timestamp": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `404 Not Found`: Invalid or non-existent certificate code (`INVALID_CERTIFICATE_CODE`)
- **Business Rules / Validation:**
  - Public verification endpoint for third-party validation of student achievement credentials.

---

### 12.4 Download Certificate PDF
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/certificates/{id}/download`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` (owner), `ADMIN`, `SUPER_ADMIN`
- **Required Permission/Scope:** Certificate ownership
- **Path Parameters:**
  - `id` (string, required, certificate ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
  - **Headers:** `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="CERT-2026-HK88912.pdf"`
  - **Body:** Binary PDF Stream
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Student attempting to download another student's certificate
  - `404 Not Found`: Certificate ID not found
- **Business Rules / Validation:**
  - Ownership validation enforced.

---

## 13. Badges

### 13.1 List Badges Directory
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/badges`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** N/A
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "badges": [
    {
      "id": "bdg_code_ninja",
      "name": "Code Ninja",
      "description": "Attended 5+ technical coding events.",
      "icon_url": "https://storage.srmist.edu.in/badges/code_ninja.png",
      "category": "ACHIEVEMENT"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
- **Business Rules / Validation:**
  - System badge definitions directory.

---

### 13.2 List Earned Badges (`/badges/my`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/badges/my`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self scope
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "student_id": "usr_01HGB12345",
  "earned_badges": [
    {
      "badge_id": "bdg_code_ninja",
      "badge_name": "Code Ninja",
      "awarded_at": "2026-10-16T11:00:00Z"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-STUDENT role
- **Business Rules / Validation:**
  - Returns student's gamification badges.

---

### 13.3 Award Badge to User
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/badges/award`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** Gamification Administration
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "user_id": "usr_01HGB12345",
  "badge_id": "bdg_code_ninja",
  "reason": "Top performer in National Hackathon 2026."
}
```
- **Success Response (`201 Created`):**
```json
{
  "award_id": "awd_778899",
  "user_id": "usr_01HGB12345",
  "badge_id": "bdg_code_ninja",
  "awarded_at": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Insufficient system privilege
  - `409 Conflict`: User already holds this badge (`BADGE_ALREADY_AWARDED`)
- **Business Rules / Validation:**
  - Grants badge to student. Dispatches gamification notification.

---

### 13.4 View Badges Earned by a User
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/users/{id}/badges`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** N/A
- **Path Parameters:**
  - `id` (string, required, user ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "user_id": "usr_01HGB12345",
  "earned_badges": [
    {
      "badge_id": "bdg_code_ninja",
      "badge_name": "Code Ninja",
      "awarded_at": "2026-10-16T11:00:00Z"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `404 Not Found`: User ID not found
- **Business Rules / Validation:**
  - Public student badge profile view.

---

## 14. Notifications

### 14.1 List User Notifications
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/notifications`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** Notification recipient scope
- **Path Parameters:** None
- **Query Parameters:**
  - `unread_only` (boolean, optional, default: false)
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 20)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "unread_count": 2,
  "notifications": [
    {
      "id": "ntf_1001",
      "title": "OD Request Approved",
      "message": "Your OD request for National Hackathon 2026 was approved by Dr. Alan Turing.",
      "type": "OD_STATUS_CHANGE",
      "is_read": false,
      "created_at": "2026-09-29T10:05:00Z"
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
- **Business Rules / Validation:**
  - Returns in-app notifications for authenticated user.

---

### 14.2 Mark Notification as Read
- **HTTP Method:** `PATCH`
- **Endpoint:** `/api/v1/notifications/{id}/read`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** Notification ownership
- **Path Parameters:**
  - `id` (string, required, notification ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "ntf_1001",
  "is_read": true,
  "updated_at": "2026-09-29T10:10:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: User attempting to alter another user's notification
  - `404 Not Found`: Notification ID not found
- **Business Rules / Validation:**
  - Updates read state.

---

### 14.3 Mark All Notifications as Read
- **HTTP Method:** `PATCH`
- **Endpoint:** `/api/v1/notifications/read-all`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** Notification recipient scope
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
- **Business Rules / Validation:**
  - Marks all unread notifications for current user as read.

---

### 14.4 Update Notification Preferences
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/notifications/preferences`
- **Authentication Required:** Yes
- **Required System Role:** Any authenticated role
- **Required Permission/Scope:** Self notification settings
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:**
```json
{
  "email_alerts": true,
  "in_app_alerts": true,
  "od_updates": true,
  "event_reminders": true
}
```
- **Success Response (`200 OK`):**
```json
{
  "success": true,
  "preferences": {
    "email_alerts": true,
    "in_app_alerts": true,
    "od_updates": true,
    "event_reminders": true
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
- **Business Rules / Validation:**
  - Configures user alert channels.

---

## 15. Analytics

### 15.1 System Overview Analytics
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/analytics/overview`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** System-wide analytics scope
- **Path Parameters:** None
- **Query Parameters:**
  - `start_date` (string, optional, format: YYYY-MM-DD)
  - `end_date` (string, optional, format: YYYY-MM-DD)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "metrics": {
    "total_users": 1500,
    "total_clubs": 12,
    "total_events": 48,
    "approved_events": 40,
    "total_registrations": 3400,
    "total_od_requests": 2100,
    "od_approval_rate_percentage": 92.5
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-admin system role
- **Business Rules / Validation:**
  - Aggregates system metrics for central administration.

---

### 15.2 Club Performance Analytics
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/analytics/clubs/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, `CLUB_ADMIN` of this club, or `FACULTY` coordinator of this club
- **Required Permission/Scope:** Club performance reporting scope
- **Path Parameters:**
  - `id` (string, required, club ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "club_id": "clb_coding_club",
  "club_name": "Coding Club",
  "total_events_organized": 14,
  "total_student_attendees": 1120,
  "average_event_capacity_utilization": 89.4,
  "total_certificates_issued": 980
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Unauthorized club scope
  - `404 Not Found`: Club ID not found
- **Business Rules / Validation:**
  - Restricts access to assigned club management.

---

### 15.3 On-Duty (OD) Summary Analytics
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/analytics/od-summary`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`, `FACULTY`
- **Required Permission/Scope:** OD administration or mentor reporting
- **Path Parameters:** None
- **Query Parameters:**
  - `department` (string, optional)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "department_breakdown": [
    {
      "department": "CSE",
      "total_od_applications": 850,
      "approved_count": 800,
      "rejected_count": 50,
      "pending_count": 0
    }
  ]
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: `STUDENT` role attempting access
- **Business Rules / Validation:**
  - Institutional OD workload and approval statistics.

---

### 15.4 Student Personal Analytics Summary (`/analytics/student/summary`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/analytics/student/summary`
- **Authentication Required:** Yes
- **Required System Role:** `STUDENT` ONLY
- **Required Permission/Scope:** Student self scope
- **Path Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "student_id": "usr_01HGB12345",
  "events_registered": 8,
  "events_attended": 7,
  "od_requests_approved": 6,
  "certificates_earned": 5,
  "badges_earned": 2
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-STUDENT role
- **Business Rules / Validation:**
  - Individual student dashboard metrics.

---

## 16. Audit Logs

### 16.1 List Audit Logs
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/audit-logs`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** System Audit Log Viewer
- **Path Parameters:** None
- **Query Parameters:**
  - `page` (integer, optional, default: 1)
  - `limit` (integer, optional, default: 50)
  - `actor_id` (string, optional)
  - `action` (string, optional, e.g., `EVENT_APPROVE`, `USER_CREATE`, `TIMETABLE_ACTIVATE`)
  - `start_date` (string, optional)
  - `end_date` (string, optional)
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "audit_logs": [
    {
      "id": "aud_88990011",
      "actor_id": "usr_fac_01",
      "actor_name": "Dr. Grace Hopper",
      "action": "EVENT_APPROVE",
      "resource_type": "EVENT",
      "resource_id": "evt_hackathon_2026",
      "ip_address": "192.168.1.50",
      "timestamp": "2026-09-29T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total_records": 420
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Access attempted by non-`SUPER_ADMIN`/`ADMIN`
- **Business Rules / Validation:**
  - **MANDATORY BUSINESS RULE:** Privileged actions (`USER_CREATE`, `USER_DELETE`, `TIMETABLE_CREATE`, `TIMETABLE_ACTIVATE`, `EVENT_APPROVE`, `EVENT_REJECT`, `OD_APPROVE`, `OD_REJECT`, `CERTIFICATE_GENERATE`) MUST generate tamper-evident audit logs.

---

### 16.2 Get Single Audit Log Entry
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/audit-logs/{id}`
- **Authentication Required:** Yes
- **Required System Role:** `SUPER_ADMIN`, `ADMIN`
- **Required Permission/Scope:** System Audit Log Viewer
- **Path Parameters:**
  - `id` (string, required, audit log ID)
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (`200 OK`):**
```json
{
  "id": "aud_88990011",
  "actor_id": "usr_fac_01",
  "actor_name": "Dr. Grace Hopper",
  "action": "EVENT_APPROVE",
  "resource_type": "EVENT",
  "resource_id": "evt_hackathon_2026",
  "payload_before": { "status": "PENDING_FACULTY_APPROVAL" },
  "payload_after": { "status": "APPROVED" },
  "ip_address": "192.168.1.50",
  "user_agent": "Mozilla/5.0 ...",
  "timestamp": "2026-09-29T00:00:00Z"
}
```
- **Error Responses:**
  - `401 Unauthorized`: Unauthenticated
  - `403 Forbidden`: Non-admin access
  - `404 Not Found`: Log ID not found
- **Business Rules / Validation:**
  - Full audit trail inspection.

---

## 17. Cross-Cutting RBAC Rules

### 17.1 Locked System Roles Matrix
The platform strictly recognizes five (5) System Roles:
1. `SUPER_ADMIN`: Central superuser with total system privileges (Timetable management, User management, System configs).
2. `ADMIN`: Central operational administrator (User management, Club creation, Audit reporting).
3. `CLUB_ADMIN`: Executive administrator of a designated student club (Event draft creation, Event submission, Member management, Attendance check-in, Certificate generation).
4. `FACULTY`: Academic staff member with dual functional scopes:
   - Scope A: `Club Faculty Coordinator` (approves/rejects events for assigned club).
   - Scope B: `Class Mentor` (approves/rejects OD requests for assigned student cohort).
5. `STUDENT`: Enrolled student user (Views approved events, Registers for events, Applies for OD, Self check-in attendance, Downloads earned certificates/badges).

### 17.2 Server-Side RBAC Enforcement Mandate
- **UI HIDING IS NOT SECURITY:** Hiding UI buttons, navigation links, or form fields in the React frontend DOES NOT constitute authorization.
- Every API endpoint in the FastAPI backend MUST independently verify:
  1. Valid JWT token authentication (`401 Unauthorized`).
  2. System Role check (`403 Forbidden`).
  3. Resource Ownership & Club Scope check (`403 Forbidden` / `404 Not Found`).
  4. Functional Scope check for Faculty (`403 Forbidden`).

### 17.3 Scope Separation for Faculty Roles
- **Club Faculty Coordinator Scope:** Authorized strictly to approve (`POST /api/v1/events/{id}/approve`) or reject (`POST /api/v1/events/{id}/reject`) events for the specific club(s) to which they are assigned. CANNOT approve OD requests unless also assigned as Class Mentor for the student.
- **Class Mentor Scope:** Authorized strictly to approve (`POST /api/v1/od/requests/{id}/approve`) or reject (`POST /api/v1/od/requests/{id}/reject`) OD requests for the specific students mapped to their section/cohort via `class_mentor_assignments`. CANNOT approve club events unless also assigned as Club Faculty Coordinator for that club.

### 17.4 Error Code Handling Principles
- `401 Unauthorized`: Returned when HTTP `Authorization` header is missing, malformed, or contains an expired/invalid JWT token.
- `403 Forbidden`: Returned when user is authenticated, but lacks system role, dynamic club role permission, or target resource scope.
- `404 Not Found`: Returned when resource ID does not exist OR when resource belongs to another scope and isolation prevents leaking resource existence.
- `409 Conflict`: Returned when business rule constraints are breached (duplicate event registration, capacity exceeded, invalid state machine transition, duplicate RA number).
- `422 Validation Error`: Returned when request body fields fail schema validation or regex rules (e.g. `ra_number` failing `^[A-Za-z0-9]{15}$`).

---

## 18. Standard Error Format

All failure responses follow this explicit JSON contract:

```json
{
  "success": false,
  "error_code": "STRING_ERROR_CODE",
  "message": "Human-readable explanation of error.",
  "details": {
    "field_name": "Error context or validation description"
  },
  "timestamp": "2026-09-29T00:00:00Z"
}
```

### Common Error Codes Table
| Error Code | HTTP Status | Trigger Condition |
| :--- | :--- | :--- |
| `INVALID_CREDENTIALS` | `401` | Incorrect email or password |
| `EXPIRED_TOKEN` | `401` | JWT access token expired |
| `INSUFFICIENT_SYSTEM_ROLE` | `403` | User role not permitted for endpoint |
| `NOT_CLUB_FACULTY_COORDINATOR` | `403` | Non-coordinator faculty attempting event approval |
| `NOT_STUDENT_CLASS_MENTOR` | `403` | Non-mentor faculty attempting OD approval |
| `CROSS_CLUB_ACCESS_DENIED` | `403` | Club Admin attempting action on another club's resource |
| `RESOURCE_NOT_FOUND` | `404` | Entity ID does not exist |
| `DUPLICATE_USER_FIELD` | `409` | Email or RA number already registered |
| `STUDENT_ALREADY_REGISTERED` | `409` | Student already registered for event |
| `EVENT_CAPACITY_EXCEEDED` | `409` | Registered count reached event capacity limit |
| `NO_EVENT_REGISTRATION_FOUND` | `409` | Student applying for OD without prior event registration |
| `INVALID_STATE_TRANSITION` | `409` | Attempting unapproved state machine transition |
| `REJECTION_REASON_REQUIRED` | `422` | Rejecting event or OD without explanation |
| `INVALID_RA_NUMBER` | `422` | RA Number failing regex `^[A-Za-z0-9]{15}$` |

---

## 19. Final Architecture Decisions (Locked)

The following four (4) core architectural decisions have been formally approved, locked, and fully integrated into this API Contract and backend database specification:

---

### Decision A: Dynamic Permissions (LOCKED)
- **Single Source of Truth:** Relational normalized tables (`club_roles`, `permissions`, `club_role_permissions`).
- **Rule:** `permissions_json` is NOT an authoritative source. Permissions are maintained via normalized foreign keys in `club_role_permissions`.
- **API Impact:** Dynamic role endpoints (`GET/POST/PUT /api/v1/clubs/{id}/roles`) accept and expose an array of string permission identifiers for frontend convenience, but backend validation and storage operate strictly on normalized relational tables.

---

### Decision B: Attendance Database Schema & API Routes (LOCKED)
- **Database Table Name:** `event_attendances`.
- **API Route Structure:** RESTful sub-resource routes (`/api/v1/events/{id}/attendance/*`) and student personal history route (`/api/v1/attendance/my`) are maintained without modification.
- **API Impact:** DB table naming (`event_attendances`) and API routes (`/events/{id}/attendance/*`) are perfectly aligned.

---

### Decision C: Club Admin & Lead Admin Authority (LOCKED)
- **Single Source of Truth:** `club_memberships` table + `club_role_id` assignment (`Lead Admin`).
- **Rule:** `clubs.lead_admin_id` is NOT maintained as an independent authoritative relationship column.
- **API Impact:** `POST /api/v1/clubs` and `PUT /api/v1/clubs/{id}` do NOT accept an authoritative `lead_admin_id` payload field. When `lead_admin` details are exposed in `GET /api/v1/clubs/{id}`, they are dynamically DERIVED from `club_memberships` where the user holds the `Lead Admin` role.

---

### Decision D: Class Mentor Mapping & OD Snapshotting (LOCKED)
- **Single Source of Truth:** `class_mentor_assignments` table (mapping `Faculty → Department → Year → Section`).
- **Rule:** Static column `student_profiles.class_mentor_id` is NOT used as an authoritative assignment source.
- **API Impact:**
  1. Class Mentors are assigned to student cohorts via `POST /api/v1/faculty/mentors`.
  2. Student profile endpoints (`/auth/me`, `/users/students/profile`) dynamically derive the assigned mentor from `class_mentor_assignments`.
  3. OD Request creation (`POST /api/v1/od/requests`) dynamically resolves the assigned mentor from `class_mentor_assignments` and stores the resolved mentor ID into `snapshotted_class_mentor_id` as an immutable historical record.
