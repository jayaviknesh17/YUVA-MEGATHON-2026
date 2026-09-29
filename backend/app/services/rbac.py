from typing import List, Set
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.club import ClubMembership, ClubRole, ClubRolePermission, Permission
from app.models.user import User


def get_user_club_permissions(db: Session, user_id: str, club_id: str) -> Set[str]:
    """Fetch all granted permission names for a user within a specific club using normalized RBAC tables.
    
    Source of Truth: club_memberships -> club_roles -> club_role_permissions -> permissions.
    """
    stmt = (
        select(Permission.name)
        .select_from(ClubMembership)
        .join(ClubRole, ClubMembership.club_role_id == ClubRole.id)
        .join(ClubRolePermission, ClubRole.id == ClubRolePermission.club_role_id)
        .join(Permission, ClubRolePermission.permission_id == Permission.id)
        .where(
            ClubMembership.user_id == user_id,
            ClubMembership.club_id == club_id,
        )
    )
    result = db.execute(stmt).scalars().all()
    return set(result)


def has_club_permission(db: Session, user_id: str, club_id: str, permission_name: str) -> bool:
    """Check if a user has a specific permission in a club using normalized RBAC tables."""
    permissions = get_user_club_permissions(db, user_id=user_id, club_id=club_id)
    return permission_name in permissions


def is_club_lead_admin(db: Session, user_id: str, club_id: str) -> bool:
    """Check if a user is a Lead Admin for a club via club_memberships and club_roles assignment.
    
    Source of Truth: club_memberships + Lead Admin role name.
    """
    stmt = (
        select(ClubRole.name)
        .select_from(ClubMembership)
        .join(ClubRole, ClubMembership.club_role_id == ClubRole.id)
        .where(
            ClubMembership.user_id == user_id,
            ClubMembership.club_id == club_id,
            ClubRole.name == "Lead Admin",
        )
    )
    result = db.execute(stmt).first()
    return result is not None
