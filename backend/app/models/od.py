import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, Integer, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ODRequest(Base):
    __tablename__ = "od_requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    event_id = Column(String(36), ForeignKey("events.id"), nullable=False, index=True)
    status = Column(String(50), nullable=False, default="PENDING_MENTOR_APPROVAL", index=True)
    snapshotted_class_mentor_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    reason = Column(Text, nullable=False)
    decision_reason = Column(Text, nullable=True)
    decided_at = Column(DateTime, nullable=True)
    submitted_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "status IN ('PENDING_MENTOR_APPROVAL', 'APPROVED', 'REJECTED')",
            name="check_od_status_valid",
        ),
        UniqueConstraint("student_id", "event_id", name="uq_od_requests_student_id_event_id"),
    )

    # Relationships
    student = relationship("User", foreign_keys=[student_id])
    event = relationship("Event", foreign_keys=[event_id])
    snapshotted_class_mentor = relationship("User", foreign_keys=[snapshotted_class_mentor_id])
    period_snapshots = relationship("ODPeriodSnapshot", back_populates="od_request", cascade="all, delete-orphan")


class ODPeriodSnapshot(Base):
    __tablename__ = "od_period_snapshots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    od_request_id = Column(String(36), ForeignKey("od_requests.id", ondelete="CASCADE"), nullable=False, index=True)
    timetable_period_id = Column(String(36), ForeignKey("timetable_periods.id"), nullable=True, index=True)
    period_number = Column(Integer, nullable=False)
    subject_name = Column(String(255), nullable=True)
    start_time = Column(String(50), nullable=False)
    end_time = Column(String(50), nullable=False)

    # Relationships
    od_request = relationship("ODRequest", back_populates="period_snapshots")
    timetable_period = relationship("TimetablePeriod")
