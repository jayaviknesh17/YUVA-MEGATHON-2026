from datetime import datetime, timedelta, timezone
import pytest
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import RequireSystemRole, get_current_user
from app.core.security import create_access_token, hash_password, hash_token
from app.models import (
    Club,
    ClubMembership,
    ClubRole,
    ClubRolePermission,
    Permission,
    RefreshSession,
    User,
)
from app.services.rbac import has_club_permission, is_club_lead_admin

dummy_test_router = APIRouter()


@dummy_test_router.get("/test/super-admin-only")
def super_admin_only_route(
    current_user: User = Depends(RequireSystemRole("SUPER_ADMIN")),
):
    return {"message": "Welcome Super Admin"}


def test_super_admin_can_access_protected_super_admin_endpoint(client, db_session):
    """Test SUPER_ADMIN user can access SUPER_ADMIN protected endpoint."""
    sa = User(
        email="sa_rbac@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Super Admin RBAC",
        system_role="SUPER_ADMIN",
    )
    db_session.add(sa)
    db_session.commit()

    token = create_access_token(subject=sa.id, claims={"system_role": "SUPER_ADMIN"})

    from app.main import app
    app.include_router(dummy_test_router)

    response = client.get(
        "/test/super-admin-only",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Welcome Super Admin"


def test_student_cannot_access_super_admin_endpoint(client, db_session):
    """Test STUDENT user receives HTTP 403 Forbidden when accessing SUPER_ADMIN endpoint."""
    student = User(
        email="stud_rbac@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Student RBAC",
        system_role="STUDENT",
    )
    db_session.add(student)
    db_session.commit()

    token = create_access_token(subject=student.id, claims={"system_role": "STUDENT"})
    response = client.get(
        "/test/super-admin-only",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_faculty_cannot_access_super_admin_endpoint(client, db_session):
    """Test FACULTY user receives HTTP 403 Forbidden when accessing SUPER_ADMIN endpoint."""
    faculty = User(
        email="fac_rbac@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Faculty RBAC",
        system_role="FACULTY",
    )
    db_session.add(faculty)
    db_session.commit()

    token = create_access_token(subject=faculty.id, claims={"system_role": "FACULTY"})
    response = client.get(
        "/test/super-admin-only",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_club_admin_cannot_access_super_admin_endpoint(client, db_session):
    """Test CLUB_ADMIN user receives HTTP 403 Forbidden when accessing SUPER_ADMIN endpoint."""
    ca = User(
        email="ca_rbac@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Club Admin RBAC",
        system_role="CLUB_ADMIN",
    )
    db_session.add(ca)
    db_session.commit()

    token = create_access_token(subject=ca.id, claims={"system_role": "CLUB_ADMIN"})
    response = client.get(
        "/test/super-admin-only",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_unauthenticated_request_rejected(client):
    """Test unauthenticated request is rejected with HTTP 401 Unauthorized."""
    response = client.get("/test/super-admin-only")
    assert response.status_code == 401


def test_jwt_claims_cannot_grant_unauthorized_db_roles(client, db_session):
    """Test tampering JWT claims (setting system_role: SUPER_ADMIN) does NOT grant access because backend queries DB state."""
    student = User(
        email="tampered_jwt@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Tampered JWT User",
        system_role="STUDENT",  # Actual DB role is STUDENT
    )
    db_session.add(student)
    db_session.commit()

    forged_token = create_access_token(
        subject=student.id,
        claims={"system_role": "SUPER_ADMIN"},  # Forged JWT claim!
    )
    response = client.get(
        "/test/super-admin-only",
        headers={"Authorization": f"Bearer {forged_token}"},
    )
    assert response.status_code == 403


def test_normalized_rbac_permission_resolution(db_session):
    """Test normalized RBAC resolution queries club_memberships -> club_roles -> club_role_permissions -> permissions."""
    coord = User(
        email="coord_norm_rbac@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Coord",
        system_role="FACULTY",
    )
    member = User(
        email="member_norm_rbac@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Member",
        system_role="STUDENT",
    )
    db_session.add_all([coord, member])
    db_session.commit()

    club = Club(
        name="RBAC Norm Club",
        code="RBAC_NORM_CLUB",
        category="Tech",
        faculty_coordinator_id=coord.id,
    )
    db_session.add(club)
    db_session.commit()

    role = ClubRole(club_id=club.id, name="Event Manager")
    perm1 = Permission(name="rbac_test:create", description="Create Events")
    perm2 = Permission(name="rbac_test:publish", description="Publish Events")
    db_session.add_all([role, perm1, perm2])
    db_session.commit()

    # Assign only perm1 to role
    db_session.add(
        ClubRolePermission(club_role_id=role.id, permission_id=perm1.id)
    )
    db_session.commit()

    # Assign member to role
    db_session.add(
        ClubMembership(club_id=club.id, user_id=member.id, club_role_id=role.id)
    )
    db_session.commit()

    assert (
        has_club_permission(
            db_session,
            user_id=member.id,
            club_id=club.id,
            permission_name="rbac_test:create",
        )
        is True
    )
    assert (
        has_club_permission(
            db_session,
            user_id=member.id,
            club_id=club.id,
            permission_name="rbac_test:publish",
        )
        is False
    )


def test_is_club_lead_admin_resolution(db_session):
    """Test is_club_lead_admin resolves leadership from club_memberships + Lead Admin role."""
    coord = User(
        email="coord_lead@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Coord Lead",
        system_role="FACULTY",
    )
    lead_user = User(
        email="lead_admin_user@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Lead Admin User",
        system_role="CLUB_ADMIN",
    )
    normal_user = User(
        email="normal_user@test.com",
        password_hash=hash_password("Pass123!"),
        full_name="Normal User",
        system_role="STUDENT",
    )
    db_session.add_all([coord, lead_user, normal_user])
    db_session.commit()

    club = Club(
        name="Lead Club",
        code="LEAD_CLUB",
        category="Tech",
        faculty_coordinator_id=coord.id,
    )
    db_session.add(club)
    db_session.commit()

    lead_role = ClubRole(club_id=club.id, name="Lead Admin")
    member_role = ClubRole(club_id=club.id, name="Member")
    db_session.add_all([lead_role, member_role])
    db_session.commit()

    db_session.add_all([
        ClubMembership(
            club_id=club.id, user_id=lead_user.id, club_role_id=lead_role.id
        ),
        ClubMembership(
            club_id=club.id, user_id=normal_user.id, club_role_id=member_role.id
        ),
    ])
    db_session.commit()

    assert (
        is_club_lead_admin(db_session, user_id=lead_user.id, club_id=club.id) is True
    )
    assert (
        is_club_lead_admin(db_session, user_id=normal_user.id, club_id=club.id)
        is False
    )


def test_refresh_token_succeeds(client, db_session):
    """Test POST /api/v1/auth/refresh issues new access token pair."""
    user = User(
        email="refresh_user@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Refresh User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    from app.core.security import create_refresh_token
    ref_token = create_refresh_token(subject=user.id, family_id="test_fam_1")
    token_hash = hash_token(ref_token)

    session_row = RefreshSession(
        user_id=user.id,
        token_hash=token_hash,
        family_id="test_fam_1",
        is_revoked=0,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    db_session.add(session_row)
    db_session.commit()

    response = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": ref_token},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data
    assert "refresh_token" in data


def test_logout_endpoint_succeeds(client, db_session):
    """Test POST /api/v1/auth/logout with valid access token returns success message."""
    user = User(
        email="logout_user@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Logout User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    token = create_access_token(subject=user.id)
    response = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
