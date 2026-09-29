import pytest
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError

from app.db.base import Base
from app.db.init_db import init_db
from app.models import (
    AuditLog,
    Badge,
    Certificate,
    ClassMentorAssignment,
    Club,
    ClubMembership,
    ClubRole,
    ClubRolePermission,
    Event,
    EventAttendance,
    EventRegistration,
    FacultyProfile,
    Notification,
    ODPeriodSnapshot,
    ODRequest,
    Permission,
    RefreshSession,
    StudentBadge,
    StudentProfile,
    Timetable,
    TimetablePeriod,
    User,
)


def test_models_import_and_metadata_discovery():
    """1 & 2: Test all models import successfully and all 21 business tables + 1 auth persistence table are discovered."""
    expected_business_tables = {
        "users",
        "student_profiles",
        "faculty_profiles",
        "clubs",
        "club_roles",
        "permissions",
        "club_role_permissions",
        "club_memberships",
        "class_mentor_assignments",
        "timetables",
        "timetable_periods",
        "events",
        "event_registrations",
        "od_requests",
        "od_period_snapshots",
        "event_attendances",
        "certificates",
        "badges",
        "student_badges",
        "notifications",
        "audit_logs",
    }
    discovered_tables = set(Base.metadata.tables.keys())
    assert expected_business_tables.issubset(discovered_tables)
    assert "refresh_sessions" in discovered_tables
    assert len(discovered_tables) == 22  # 21 business tables + 1 auth persistence table


def test_database_initialization_creates_tables(test_engine):
    """3: Test database initialization creates all expected tables including refresh_sessions."""
    init_db(engine_override=test_engine)
    inspector = inspect(test_engine)
    tables_in_db = set(inspector.get_table_names())
    assert "users" in tables_in_db
    assert "event_attendances" in tables_in_db
    assert "club_role_permissions" in tables_in_db
    assert "od_requests" in tables_in_db
    assert "od_period_snapshots" in tables_in_db
    assert "timetable_periods" in tables_in_db
    assert "student_badges" in tables_in_db
    assert "notifications" in tables_in_db
    assert "audit_logs" in tables_in_db
    assert "refresh_sessions" in tables_in_db


def test_foreign_keys_enforced(db_session):
    """4 & 11: Test that foreign key constraints are enforced by attempting invalid FK references."""
    invalid_profile = StudentProfile(
        user_id="non-existent-id",
        ra_number="RA1234567890123",
        department="CSE",
        year_of_study=2,
        section="A",
    )
    db_session.add(invalid_profile)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_invalid_ra_number_format_rejected(db_session):
    """5: Test that invalid RA numbers (wrong length or special chars) are rejected by CHECK constraint."""
    user = User(
        email="test_ra_fmt@test.com",
        password_hash="hash",
        full_name="RA Format Test",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    # Short RA (14 chars)
    invalid_short = StudentProfile(
        user_id=user.id,
        ra_number="RA123456789012",
        department="CSE",
        year_of_study=1,
        section="A",
    )
    db_session.add(invalid_short)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    # Special characters in RA
    invalid_special = StudentProfile(
        user_id=user.id,
        ra_number="RA123456789012!",
        department="CSE",
        year_of_study=1,
        section="A",
    )
    db_session.add(invalid_special)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_duplicate_ra_number_rejected(db_session):
    """6: Test that duplicate RA numbers are rejected by UNIQUE constraint."""
    u1 = User(
        email="ra_dup1@test.com",
        password_hash="hash",
        full_name="RA Dup 1",
        system_role="STUDENT",
    )
    u2 = User(
        email="ra_dup2@test.com",
        password_hash="hash",
        full_name="RA Dup 2",
        system_role="STUDENT",
    )
    db_session.add_all([u1, u2])
    db_session.commit()

    sp1 = StudentProfile(
        user_id=u1.id,
        ra_number="RA1234567890123",
        department="CSE",
        year_of_study=3,
        section="B",
    )
    db_session.add(sp1)
    db_session.commit()

    sp2 = StudentProfile(
        user_id=u2.id,
        ra_number="RA1234567890123",
        department="ECE",
        year_of_study=2,
        section="A",
    )
    db_session.add(sp2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_duplicate_event_registration_rejected(db_session):
    """7: Test duplicate event registration for same student + event is blocked."""
    coord = User(
        email="coord_reg@test.com",
        password_hash="hash",
        full_name="Coord",
        system_role="FACULTY",
    )
    student = User(
        email="stud_reg@test.com",
        password_hash="hash",
        full_name="Student",
        system_role="STUDENT",
    )
    db_session.add_all([coord, student])
    db_session.commit()

    club = Club(
        name="Reg Club",
        code="REGCLUB",
        category="Tech",
        faculty_coordinator_id=coord.id,
    )
    db_session.add(club)
    db_session.commit()

    event = Event(
        club_id=club.id,
        title="Test Event",
        description="Desc",
        venue="Hall 1",
        capacity=100,
        start_time="2026-10-01",
        end_time="2026-10-02",
        created_by=coord.id,
    )
    db_session.add(event)
    db_session.commit()

    reg1 = EventRegistration(event_id=event.id, student_id=student.id)
    db_session.add(reg1)
    db_session.commit()

    reg2 = EventRegistration(event_id=event.id, student_id=student.id)
    db_session.add(reg2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_duplicate_attendance_rejected(db_session):
    """8: Test duplicate attendance marking for same student + event is blocked."""
    coord = User(
        email="coord_att@test.com",
        password_hash="hash",
        full_name="Coord Att",
        system_role="FACULTY",
    )
    student = User(
        email="stud_att@test.com",
        password_hash="hash",
        full_name="Student Att",
        system_role="STUDENT",
    )
    db_session.add_all([coord, student])
    db_session.commit()

    club = Club(
        name="Att Club",
        code="ATTCLUB",
        category="Tech",
        faculty_coordinator_id=coord.id,
    )
    db_session.add(club)
    db_session.commit()

    event = Event(
        club_id=club.id,
        title="Att Event",
        description="Desc",
        venue="Hall A",
        capacity=50,
        start_time="2026-10-01",
        end_time="2026-10-02",
        created_by=coord.id,
    )
    db_session.add(event)
    db_session.commit()

    att1 = EventAttendance(
        event_id=event.id,
        student_id=student.id,
        ra_number="RA9999999999999",
        checkin_method="QR_SCAN",
    )
    db_session.add(att1)
    db_session.commit()

    att2 = EventAttendance(
        event_id=event.id,
        student_id=student.id,
        ra_number="RA9999999999999",
        checkin_method="MANUAL_ENTRY",
    )
    db_session.add(att2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_duplicate_role_permission_assignment_rejected(db_session):
    """9 & 16: Test normalized permissions work and duplicate role-permission assignment is rejected."""
    coord = User(
        email="coord_perm@test.com",
        password_hash="hash",
        full_name="Coord Perm",
        system_role="FACULTY",
    )
    db_session.add(coord)
    db_session.commit()

    club = Club(
        name="Perm Club",
        code="PERMCLUB",
        category="Tech",
        faculty_coordinator_id=coord.id,
    )
    db_session.add(club)
    db_session.commit()

    role = ClubRole(club_id=club.id, name="Event Lead")
    perm = Permission(name="event:create", description="Permission to create events")
    db_session.add_all([role, perm])
    db_session.commit()

    rp1 = ClubRolePermission(club_role_id=role.id, permission_id=perm.id)
    db_session.add(rp1)
    db_session.commit()

    rp2 = ClubRolePermission(club_role_id=role.id, permission_id=perm.id)
    db_session.add(rp2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_required_not_null_constraints(db_session):
    """10: Test required NOT NULL constraints fail when NULL is provided."""
    invalid_user = User(
        email=None, password_hash="hash", full_name="No Email", system_role="STUDENT"
    )
    db_session.add(invalid_user)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_event_status_values_constrained(db_session):
    """12: Test event status values are constrained at DB level."""
    coord = User(
        email="coord_stat@test.com",
        password_hash="hash",
        full_name="Coord Stat",
        system_role="FACULTY",
    )
    db_session.add(coord)
    db_session.commit()

    club = Club(
        name="Status Club",
        code="STATCLUB",
        category="Tech",
        faculty_coordinator_id=coord.id,
    )
    db_session.add(club)
    db_session.commit()

    invalid_event = Event(
        club_id=club.id,
        title="Invalid Event",
        description="Desc",
        venue="Venue",
        capacity=100,
        start_time="2026-10-01",
        end_time="2026-10-02",
        status="RESUBMITTED",
        created_by=coord.id,
    )
    db_session.add(invalid_event)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_class_mentor_assignment_uniqueness(db_session):
    """13: Test class mentor assignment uniqueness for department + year + section."""
    f1 = User(
        email="fac1@test.com",
        password_hash="hash",
        full_name="Faculty 1",
        system_role="FACULTY",
    )
    f2 = User(
        email="fac2@test.com",
        password_hash="hash",
        full_name="Faculty 2",
        system_role="FACULTY",
    )
    db_session.add_all([f1, f2])
    db_session.commit()

    cma1 = ClassMentorAssignment(
        faculty_user_id=f1.id, department="CSE", year_of_study=3, section="A"
    )
    db_session.add(cma1)
    db_session.commit()

    cma2 = ClassMentorAssignment(
        faculty_user_id=f2.id, department="CSE", year_of_study=3, section="A"
    )
    db_session.add(cma2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_od_mentor_snapshot_and_period_snapshots(db_session):
    """14: Test OD request mentor snapshot and dedicated od_period_snapshots table."""
    mentor = User(
        email="mentor_snap@test.com",
        password_hash="hash",
        full_name="Mentor",
        system_role="FACULTY",
    )
    student = User(
        email="student_snap@test.com",
        password_hash="hash",
        full_name="Student",
        system_role="STUDENT",
    )
    coord = User(
        email="coord_snap@test.com",
        password_hash="hash",
        full_name="Coord",
        system_role="FACULTY",
    )
    db_session.add_all([mentor, student, coord])
    db_session.commit()

    club = Club(
        name="OD Club",
        code="ODCLUB",
        category="Tech",
        faculty_coordinator_id=coord.id,
    )
    db_session.add(club)
    db_session.commit()

    event = Event(
        club_id=club.id,
        title="OD Event",
        description="Desc",
        venue="Hall",
        capacity=10,
        start_time="2026-10-01",
        end_time="2026-10-02",
        created_by=coord.id,
    )
    db_session.add(event)
    db_session.commit()

    timetable = Timetable(
        name="Odd Sem 2026",
        academic_year="2026",
        semester_type="ODD",
        created_by=coord.id,
        effective_from="2026-08-01",
        effective_to="2026-12-31",
    )
    db_session.add(timetable)
    db_session.commit()

    period1 = TimetablePeriod(
        timetable_id=timetable.id,
        period_number=1,
        name="Period 1",
        start_time="09:00",
        end_time="10:00",
    )
    db_session.add(period1)
    db_session.commit()

    od = ODRequest(
        student_id=student.id,
        event_id=event.id,
        snapshotted_class_mentor_id=mentor.id,
        reason="Representing college at hackathon",
    )
    db_session.add(od)
    db_session.commit()

    period_snap = ODPeriodSnapshot(
        od_request_id=od.id,
        timetable_period_id=period1.id,
        period_number=1,
        subject_name="Mathematics",
        start_time="09:00",
        end_time="10:00",
    )
    db_session.add(period_snap)
    db_session.commit()

    saved_od = db_session.query(ODRequest).filter_by(id=od.id).first()
    assert saved_od.snapshotted_class_mentor_id == mentor.id
    assert saved_od.snapshotted_class_mentor.full_name == "Mentor"
    assert len(saved_od.period_snapshots) == 1
    assert saved_od.period_snapshots[0].period_number == 1
    assert saved_od.period_snapshots[0].subject_name == "Mathematics"

    assert not hasattr(saved_od, "snapshotted_timetable_periods_json")
    od_column_names = [col.name for col in ODRequest.__table__.columns]
    assert "snapshotted_timetable_periods_json" not in od_column_names


def test_no_authoritative_clubs_lead_admin_id_column():
    """15: Confirm that no authoritative clubs.lead_admin_id column exists."""
    assert not hasattr(Club, "lead_admin_id")
    column_names = [col.name for col in Club.__table__.columns]
    assert "lead_admin_id" not in column_names


def test_student_badges_association_table(db_session):
    """16: Test student_badges table and StudentBadge association."""
    user = User(
        email="badge_user@test.com",
        password_hash="hash",
        full_name="Badge User",
        system_role="STUDENT",
    )
    badge = Badge(
        name="Hackathon Winner",
        description="First place in hackathon",
        icon_url="https://example.com/badge.png",
        category="Achievement",
    )
    db_session.add_all([user, badge])
    db_session.commit()

    sb = StudentBadge(user_id=user.id, badge_id=badge.id, reason="Won MegaThon 2026")
    db_session.add(sb)
    db_session.commit()

    saved_sb = db_session.query(StudentBadge).filter_by(user_id=user.id).first()
    assert saved_sb.badge.name == "Hackathon Winner"
    assert saved_sb.user.full_name == "Badge User"
