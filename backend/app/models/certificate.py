import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, DateTime, Date, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), ForeignKey("events.id"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    certificate_code = Column(String(100), unique=True, nullable=False, index=True)
    issue_date = Column(Date, nullable=False, default=date.today)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("event_id", "student_id", name="uq_certificates_event_id_student_id"),
    )

    # Relationships
    event = relationship("Event", back_populates="certificates")
    student = relationship("User", foreign_keys=[student_id])


class Badge(Base):
    __tablename__ = "badges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    icon_url = Column(String(512), nullable=False)
    category = Column(String(100), nullable=False)

    # Relationships
    student_badges = relationship("StudentBadge", back_populates="badge", cascade="all, delete-orphan")


class StudentBadge(Base):
    __tablename__ = "student_badges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    badge_id = Column(String(36), ForeignKey("badges.id", ondelete="CASCADE"), nullable=False, index=True)
    reason = Column(Text, nullable=True)
    awarded_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_student_badges_user_id_badge_id"),
    )

    # Relationships
    user = relationship("User", back_populates="student_badges")
    badge = relationship("Badge", back_populates="student_badges")


# Alias for backwards/user badge terminology compatibility
UserBadge = StudentBadge
