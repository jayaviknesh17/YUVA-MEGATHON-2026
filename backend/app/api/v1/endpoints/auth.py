import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from jwt.exceptions import PyJWTError
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_token,
    verify_password,
)
from app.models.refresh_session import RefreshSession
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    RefreshRequest,
    RefreshTokenResponse,
    TokenResponse,
    UserAuthResponse,
)

router = APIRouter()


@router.post("/login", response_model=TokenResponse, tags=["Authentication"])
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user credentials and issue JWT tokens with persisted refresh session."""
    user = db.query(User).filter(User.email == login_data.email).first()

    invalid_credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not user:
        raise invalid_credentials_exc

    if not verify_password(login_data.password, user.password_hash):
        raise invalid_credentials_exc

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive",
        )

    # Issue access token
    access_token = create_access_token(
        subject=user.id,
        claims={"email": user.email, "system_role": user.system_role},
    )

    # Issue refresh token with new family_id
    family_id = str(uuid.uuid4())
    refresh_token = create_refresh_token(subject=user.id, family_id=family_id)
    token_hash = hash_token(refresh_token)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    # Persist refresh session (hash only, plaintext is never stored)
    refresh_session = RefreshSession(
        user_id=user.id,
        token_hash=token_hash,
        family_id=family_id,
        is_revoked=0,
        expires_at=expires_at,
    )
    db.add(refresh_session)
    db.commit()

    ra_number = None
    if user.student_profile:
        ra_number = user.student_profile.ra_number

    user_resp = UserAuthResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        system_role=user.system_role,
        ra_number=ra_number,
    )

    return TokenResponse(
        success=True,
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_resp,
    )


@router.post("/refresh", response_model=RefreshTokenResponse, tags=["Authentication"])
def refresh_token_endpoint(refresh_data: RefreshRequest, db: Session = Depends(get_db)):
    """Rotate refresh token safely with atomic conditional updates and reuse detection."""
    try:
        payload = decode_token(refresh_data.refresh_token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")

        if not user_id or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    incoming_hash = hash_token(refresh_data.refresh_token)
    session_row = db.query(RefreshSession).filter(RefreshSession.token_hash == incoming_hash).first()

    if not session_row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found or invalid",
        )

    now = datetime.now(timezone.utc)
    exp_time = session_row.expires_at
    if exp_time.tzinfo is None:
        exp_time = exp_time.replace(tzinfo=timezone.utc)

    # Check expiration
    if exp_time < now:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
        )

    # Reuse Detection / Theft Prevention: If token is already revoked, revoke entire family!
    if session_row.is_revoked == 1:
        db.query(RefreshSession).filter(RefreshSession.family_id == session_row.family_id).update(
            {RefreshSession.is_revoked: 1}, synchronize_session=False
        )
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Revoked refresh token reuse detected. Session family invalidated.",
        )

    # Issue new refresh token preserving the same family_id
    new_refresh_token = create_refresh_token(subject=session_row.user_id, family_id=session_row.family_id)
    new_token_hash = hash_token(new_refresh_token)
    new_expires_at = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    # Atomic conditional update: rotate only if is_revoked is still 0
    updated_count = db.query(RefreshSession).filter(
        RefreshSession.id == session_row.id,
        RefreshSession.is_revoked == 0,
    ).update(
        {
            RefreshSession.is_revoked: 1,
            RefreshSession.replaced_by_token_hash: new_token_hash,
        },
        synchronize_session=False,
    )

    if updated_count != 1:
        # Race condition / concurrent update detected! Revoke entire family for security
        db.query(RefreshSession).filter(RefreshSession.family_id == session_row.family_id).update(
            {RefreshSession.is_revoked: 1}, synchronize_session=False
        )
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Concurrent refresh token update detected",
        )

    # Insert new active refresh token row
    new_session = RefreshSession(
        user_id=session_row.user_id,
        token_hash=new_token_hash,
        family_id=session_row.family_id,
        is_revoked=0,
        expires_at=new_expires_at,
    )
    db.add(new_session)
    db.commit()

    # Issue new access token
    user = db.query(User).filter(User.id == session_row.user_id).first()
    new_access_token = create_access_token(
        subject=user.id,
        claims={"email": user.email, "system_role": user.system_role},
    )

    return RefreshTokenResponse(
        success=True,
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout", response_model=MessageResponse, tags=["Authentication"])
def logout(
    logout_data: Optional[RefreshRequest] = None,
    db: Session = Depends(get_db),
):
    """Revoke refresh session family upon logout."""
    if logout_data and logout_data.refresh_token:
        target_hash = hash_token(logout_data.refresh_token)
        session_row = db.query(RefreshSession).filter(RefreshSession.token_hash == target_hash).first()
        if session_row:
            db.query(RefreshSession).filter(RefreshSession.family_id == session_row.family_id).update(
                {RefreshSession.is_revoked: 1}, synchronize_session=False
            )
            db.commit()

    return MessageResponse(success=True, message="Successfully logged out.")


@router.get("/me", tags=["Authentication"])
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve profile and permissions for currently authenticated user."""
    profile_data = {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "system_role": current_user.system_role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }

    if current_user.student_profile:
        profile_data.update({
            "ra_number": current_user.student_profile.ra_number,
            "department": current_user.student_profile.department,
            "year_of_study": current_user.student_profile.year_of_study,
            "section": current_user.student_profile.section,
        })
    elif current_user.faculty_profile:
        profile_data.update({
            "department": current_user.faculty_profile.department,
            "designation": current_user.faculty_profile.designation,
        })

    return profile_data
