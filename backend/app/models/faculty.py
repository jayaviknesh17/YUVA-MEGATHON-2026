import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ClassMentorAssignment(Base):
    __tablename__ = "class_mentor_assignments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    faculty_user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    department = Column(String(100), nullable=False)
    year_of_study = Column(Integer, nullable=False)
    section = Column(String(10), nullable=False)
    assigned_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "year_of_study BETWEEN 1 AND 4",
            name="check_mentor_year_of_study_range",
        ),
        UniqueConstraint("department", "year_of_study", "section", name="uq_class_mentor_assignments_dept_year_sec"),
    )

    # Relationship
    faculty_user = relationship("User", back_populates="mentor_assignments")
