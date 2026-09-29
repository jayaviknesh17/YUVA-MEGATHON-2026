import uuid
from datetime import datetime, timezone
from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class RefreshSession(Base):
    __tablename__ = "refresh_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(64), unique=True, nullable=False, index=True)
    family_id = Column(String(36), nullable=False, index=True)
    is_revoked = Column(Integer, nullable=False, default=0)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    replaced_by_token_hash = Column(String(64), nullable=True)

    __table_args__ = (
        CheckConstraint("is_revoked IN (0, 1)", name="check_refresh_sessions_is_revoked_bool"),
    )

    # Relationship
    user = relationship("User", foreign_keys=[user_id])
