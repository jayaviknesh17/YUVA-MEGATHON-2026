import uuid
from datetime import datetime, timezone
from sqlalchemy import CheckConstraint, Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    system_role = Column(
        String(50),
        nullable=False,
        default="STUDENT",
    )
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "system_role IN ('SUPER_ADMIN', 'ADMIN', 'CLUB_ADMIN', 'FACULTY', 'STUDENT')",
            name="check_system_role_valid",
        ),
    )

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    faculty_profile = relationship("FacultyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    club_memberships = relationship("ClubMembership", back_populates="user", cascade="all, delete-orphan")
    mentor_assignments = relationship("ClassMentorAssignment", back_populates="faculty_user", cascade="all, delete-orphan")
    event_registrations = relationship("EventRegistration", back_populates="student", cascade="all, delete-orphan")
    event_attendances = relationship("EventAttendance", back_populates="student", cascade="all, delete-orphan")
    student_badges = relationship("StudentBadge", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    ra_number = Column(String(15), unique=True, nullable=False, index=True)
    department = Column(String(100), nullable=False, index=True)
    year_of_study = Column(Integer, nullable=False)
    section = Column(String(10), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "length(ra_number) = 15 AND ra_number NOT GLOB '*[^A-Za-z0-9]*'",
            name="check_student_ra_number_format",
        ),
        CheckConstraint(
            "year_of_study BETWEEN 1 AND 4",
            name="check_student_year_of_study_range",
        ),
    )

    # Relationship
    user = relationship("User", back_populates="student_profile")


class FacultyProfile(Base):
    __tablename__ = "faculty_profiles"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    department = Column(String(100), nullable=False, index=True)
    designation = Column(String(100), nullable=False)

    # Relationship
    user = relationship("User", back_populates="faculty_profile")
