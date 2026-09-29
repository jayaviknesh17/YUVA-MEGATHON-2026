import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Timetable(Base):
    __tablename__ = "timetables"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    academic_year = Column(String(50), nullable=False)
    semester_type = Column(String(10), nullable=False)
    is_active = Column(Boolean, nullable=False, default=False)
    effective_from = Column(String(50), nullable=False)
    effective_to = Column(String(50), nullable=False)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "semester_type IN ('ODD', 'EVEN')",
            name="check_timetable_semester_type",
        ),
    )

    # Relationships
    creator = relationship("User", foreign_keys=[created_by])
    periods = relationship("TimetablePeriod", back_populates="timetable", cascade="all, delete-orphan")


class TimetablePeriod(Base):
    __tablename__ = "timetable_periods"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timetable_id = Column(String(36), ForeignKey("timetables.id", ondelete="CASCADE"), nullable=False, index=True)
    period_number = Column(Integer, nullable=False)
    name = Column(String(100), nullable=False)
    start_time = Column(String(20), nullable=False)
    end_time = Column(String(20), nullable=False)

    __table_args__ = (
        UniqueConstraint("timetable_id", "period_number", name="uq_timetable_periods_timetable_id_period_number"),
    )

    # Relationship
    timetable = relationship("Timetable", back_populates="periods")


# Alias for slot API terminology compatibility
TimetableSlot = TimetablePeriod
