from typing import Generator, List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import PyJWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_token
from app.db.session import SessionLocal
from app.models.user import User
from app.services.rbac import has_club_permission, is_club_lead_admin

security_scheme = HTTPBearer(auto_error=False)


def get_db() -> Generator[Session, None, None]:
    """Dependency that yields a database session per request and ensures proper cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    auth_credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Extract Bearer token, validate JWT, and load authenticated user from database."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not auth_credentials or not auth_credentials.credentials:
        raise credentials_exception

    token = auth_credentials.credentials
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type", "access")
        
        if not user_id or token_type != "access":
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure currently authenticated user is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
        )
    return current_user


class RequireSystemRole:
    """Server-side authorization dependency enforcing system roles."""

    def __init__(self, *allowed_roles: str):
        self.allowed_roles = set(allowed_roles)

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.system_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient system role privileges",
            )
        return current_user


class RequireClubPermission:
    """Server-side authorization dependency enforcing dynamic club permissions."""

    def __init__(self, permission_name: str):
        self.permission_name = permission_name

    def __call__(
        self,
        club_id: str,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        # SUPER_ADMIN bypass for system administration
        if current_user.system_role == "SUPER_ADMIN":
            return current_user

        if not has_club_permission(db, user_id=current_user.id, club_id=club_id, permission_name=self.permission_name):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{self.permission_name}' required for club action",
            )
        return current_user
