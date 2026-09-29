from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.models import (
    Club,
    ClubMembership,
    ClubRole,
    ClubRolePermission,
    FacultyProfile,
    Permission,
    StudentProfile,
    User,
)


def seed_db(db: Session) -> None:
    """Seed fake development demo users and RBAC fixtures for authentication testing."""
    init_db()

    # Skip if seed data already exists
    existing_sa = db.query(User).filter(User.email == "superadmin@yuva.edu").first()
    if existing_sa:
        return

    hashed_pw = hash_password("DemoPassword123!")

    # 1. Users for all 5 locked system roles
    super_admin = User(
        email="superadmin@yuva.edu",
        password_hash=hashed_pw,
        full_name="System Super Admin",
        system_role="SUPER_ADMIN",
    )
    admin = User(
        email="admin@yuva.edu",
        password_hash=hashed_pw,
        full_name="College Admin",
        system_role="ADMIN",
    )
    club_admin_user = User(
        email="clubadmin@yuva.edu",
        password_hash=hashed_pw,
        full_name="Coding Club Admin",
        system_role="CLUB_ADMIN",
    )
    faculty_user = User(
        email="faculty@yuva.edu",
        password_hash=hashed_pw,
        full_name="Dr. Alan Turing",
        system_role="FACULTY",
    )
    student_user = User(
        email="student@yuva.edu",
        password_hash=hashed_pw,
        full_name="Jane Student",
        system_role="STUDENT",
    )

    db.add_all([super_admin, admin, club_admin_user, faculty_user, student_user])
    db.commit()

    # 2. Student and Faculty Profiles
    student_profile = StudentProfile(
        user_id=student_user.id,
        ra_number="RA2311003010001",
        department="Computer Science & Engineering",
        year_of_study=3,
        section="A",
    )
    faculty_profile = FacultyProfile(
        user_id=faculty_user.id,
        department="Computer Science & Engineering",
        designation="Associate Professor",
    )
    db.add_all([student_profile, faculty_profile])

    # 3. Club & Roles
    demo_club = Club(
        name="Coding Club",
        code="CODING_CLUB",
        category="Technical",
        description="Official Coding Club of SRMIST",
        faculty_coordinator_id=faculty_user.id,
    )
    db.add(demo_club)
    db.commit()

    lead_role = ClubRole(
        club_id=demo_club.id,
        name="Lead Admin",
        description="Lead Admin of Coding Club",
        is_system_default=True,
    )
    event_lead_role = ClubRole(
        club_id=demo_club.id,
        name="Event Lead",
        description="Event Lead of Coding Club",
        is_system_default=False,
    )
    db.add_all([lead_role, event_lead_role])
    db.commit()

    # 4. Permissions & Normalized Role-Permission Mapping
    create_evt_perm = Permission(name="event:create", description="Create Club Events")
    edit_evt_perm = Permission(name="event:edit", description="Edit Club Events")
    db.add_all([create_evt_perm, edit_evt_perm])
    db.commit()

    db.add_all([
        ClubRolePermission(club_role_id=lead_role.id, permission_id=create_evt_perm.id),
        ClubRolePermission(club_role_id=lead_role.id, permission_id=edit_evt_perm.id),
    ])

    # 5. Club Membership
    db.add(
        ClubMembership(
            club_id=demo_club.id,
            user_id=club_admin_user.id,
            club_role_id=lead_role.id,
        )
    )
    db.commit()


if __name__ == "__main__":
    session = SessionLocal()
    try:
        seed_db(session)
        print("Database seeded successfully with fake development demo credentials.")
    finally:
        session.close()
