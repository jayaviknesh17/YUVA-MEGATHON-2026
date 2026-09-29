import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    club_id = Column(String(36), ForeignKey("clubs.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    venue = Column(String(255), nullable=False)
    capacity = Column(Integer, nullable=False)
    registered_count = Column(Integer, nullable=False, default=0)
    start_time = Column(String(50), nullable=False)
    end_time = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="DRAFT", index=True)
    rejection_reason = Column(Text, nullable=True)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "capacity > 0",
            name="check_event_capacity_positive",
        ),
        CheckConstraint(
            "registered_count <= capacity",
            name="check_event_registered_count_limit",
        ),
        CheckConstraint(
            "status IN ('DRAFT', 'PENDING_FACULTY_APPROVAL', 'APPROVED', 'REJECTED', 'ONGOING', 'COMPLETED')",
            name="check_event_status_valid",
        ),
    )

    # Relationships
    club = relationship("Club", back_populates="events")
    creator = relationship("User", foreign_keys=[created_by])
    registrations = relationship("EventRegistration", back_populates="event", cascade="all, delete-orphan")
    attendances = relationship("EventAttendance", back_populates="event", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="event")


class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    registered_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("event_id", "student_id", name="uq_event_registrations_event_id_student_id"),
    )

    # Relationships
    event = relationship("Event", back_populates="registrations")
    student = relationship("User", back_populates="event_registrations")
