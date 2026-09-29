import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class EventAttendance(Base):
    __tablename__ = "event_attendances"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    ra_number = Column(String(15), nullable=False, index=True)
    checkin_method = Column(String(50), nullable=False)
    marked_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "length(ra_number) = 15 AND ra_number NOT GLOB '*[^A-Za-z0-9]*'",
            name="check_attendance_ra_number_format",
        ),
        CheckConstraint(
            "checkin_method IN ('MANUAL_ENTRY', 'QR_SCAN', 'SELF_CHECKIN')",
            name="check_attendance_checkin_method_valid",
        ),
        UniqueConstraint("event_id", "student_id", name="uq_event_attendances_event_id_student_id"),
    )

    # Relationships
    event = relationship("Event", back_populates="attendances")
    student = relationship("User", back_populates="event_attendances")
