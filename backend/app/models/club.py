import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Club(Base):
    __tablename__ = "clubs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    faculty_coordinator_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    faculty_coordinator = relationship("User", foreign_keys=[faculty_coordinator_id])
    roles = relationship("ClubRole", back_populates="club", cascade="all, delete-orphan")
    memberships = relationship("ClubMembership", back_populates="club", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="club")


class ClubRole(Base):
    __tablename__ = "club_roles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    club_id = Column(String(36), ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    is_system_default = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("club_id", "name", name="uq_club_roles_club_id_name"),
    )

    # Relationships
    club = relationship("Club", back_populates="roles")
    memberships = relationship("ClubMembership", back_populates="club_role")
    permissions = relationship("Permission", secondary="club_role_permissions", back_populates="club_roles")


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)

    # Relationships
    club_roles = relationship("ClubRole", secondary="club_role_permissions", back_populates="permissions")


class ClubRolePermission(Base):
    __tablename__ = "club_role_permissions"

    club_role_id = Column(String(36), ForeignKey("club_roles.id", ondelete="CASCADE"), primary_key=True)
    permission_id = Column(String(36), ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True)


class ClubMembership(Base):
    __tablename__ = "club_memberships"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    club_id = Column(String(36), ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    club_role_id = Column(String(36), ForeignKey("club_roles.id"), nullable=False, index=True)
    joined_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("club_id", "user_id", name="uq_club_memberships_club_id_user_id"),
    )

    # Relationships
    club = relationship("Club", back_populates="memberships")
    user = relationship("User", back_populates="club_memberships")
    club_role = relationship("ClubRole", back_populates="memberships")
