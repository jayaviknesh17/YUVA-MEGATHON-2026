from datetime import datetime, timedelta, timezone
import pytest

from app.core.security import create_refresh_token, hash_password, hash_token
from app.models import RefreshSession, User


def test_login_creates_refresh_session_row(client, db_session):
    """1 & 11: Test login creates a refresh_sessions row storing token hash and family_id."""
    user = User(
        email="sess_login@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Sess Login",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    res = client.post(
        "/api/v1/auth/login",
        json={"email": "sess_login@srmist.edu.in", "password": "Pass123!"},
    )
    assert res.status_code == 200
    data = res.json()
    refresh_token = data["refresh_token"]

    # Verify database persistence
    token_hash = hash_token(refresh_token)
    session = db_session.query(RefreshSession).filter_by(token_hash=token_hash).first()
    assert session is not None
    assert session.user_id == user.id
    assert session.is_revoked == 0
    assert session.family_id is not None

    # Verify plaintext refresh token is NOT stored in DB
    db_text = db_session.query(RefreshSession).filter(RefreshSession.token_hash == refresh_token).first()
    assert db_text is None


def test_refresh_token_rotation_success(client, db_session):
    """2, 3, 4: Test refresh token rotation revokes old token and creates new child token row."""
    user = User(
        email="rot_user@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Rotation User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "rot_user@srmist.edu.in", "password": "Pass123!"},
    )
    old_refresh_token = login_res.json()["refresh_token"]
    old_hash = hash_token(old_refresh_token)

    # Perform refresh
    ref_res = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": old_refresh_token}
    )
    assert ref_res.status_code == 200
    new_refresh_token = ref_res.json()["refresh_token"]
    new_hash = hash_token(new_refresh_token)

    # Verify old session row is now revoked and replaced by new token hash
    old_session = db_session.query(RefreshSession).filter_by(token_hash=old_hash).first()
    assert old_session.is_revoked == 1
    assert old_session.replaced_by_token_hash == new_hash

    # Verify new session row exists and shares same family_id
    new_session = db_session.query(RefreshSession).filter_by(token_hash=new_hash).first()
    assert new_session is not None
    assert new_session.is_revoked == 0
    assert new_session.family_id == old_session.family_id


def test_old_refresh_token_reuse_triggers_family_revocation(client, db_session):
    """5, 6, 7: Test attempting to reuse an already-rotated token fails and revokes the whole family."""
    user = User(
        email="reuse_user@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Reuse User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    # Step 1: Login
    l_res = client.post(
        "/api/v1/auth/login",
        json={"email": "reuse_user@srmist.edu.in", "password": "Pass123!"},
    )
    token1 = l_res.json()["refresh_token"]

    # Step 2: Rotate token1 -> token2
    r_res = client.post("/api/v1/auth/refresh", json={"refresh_token": token1})
    assert r_res.status_code == 200
    token2 = r_res.json()["refresh_token"]

    # Step 3: Attempt reusing token1 (old token)
    reuse_res = client.post("/api/v1/auth/refresh", json={"refresh_token": token1})
    assert reuse_res.status_code == 401
    assert "reuse detected" in reuse_res.json()["detail"].lower()

    # Step 4: Verify token2 (the active token in that family) is now ALSO revoked due to family-wide revocation!
    token2_res = client.post("/api/v1/auth/refresh", json={"refresh_token": token2})
    assert token2_res.status_code == 401


def test_logout_revokes_token_family(client, db_session):
    """8 & 9: Test logout revokes the specific refresh token family."""
    user = User(
        email="logout_sess@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Logout Sess User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    l_res = client.post(
        "/api/v1/auth/login",
        json={"email": "logout_sess@srmist.edu.in", "password": "Pass123!"},
    )
    refresh_token = l_res.json()["refresh_token"]

    # Perform logout supplying refresh_token in body
    out_res = client.post(
        "/api/v1/auth/logout", json={"refresh_token": refresh_token}
    )
    assert out_res.status_code == 200

    # Attempting to refresh using refresh_token after logout fails
    ref_res = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert ref_res.status_code == 401


def test_expired_refresh_token_rejected(client, db_session):
    """10: Test expired refresh token in refresh_sessions is rejected."""
    user = User(
        email="exp_ref@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Exp Ref User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    exp_token = create_refresh_token(subject=user.id, expires_delta=timedelta(seconds=-3600))
    token_hash = hash_token(exp_token)

    sess = RefreshSession(
        user_id=user.id,
        token_hash=token_hash,
        family_id="family_exp",
        is_revoked=0,
        expires_at=datetime.now(timezone.utc) - timedelta(hours=1),
    )
    db_session.add(sess)
    db_session.commit()

    res = client.post("/api/v1/auth/refresh", json={"refresh_token": exp_token})
    assert res.status_code == 401


def test_concurrent_refresh_protection(client, db_session):
    """12: Test concurrent atomic update logic rejects second concurrent refresh."""
    user = User(
        email="conc_user@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Concurrent User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    l_res = client.post(
        "/api/v1/auth/login",
        json={"email": "conc_user@srmist.edu.in", "password": "Pass123!"},
    )
    token = l_res.json()["refresh_token"]
    hash_val = hash_token(token)

    # Manually revoke the session to simulate another concurrent request having already updated it
    sess = db_session.query(RefreshSession).filter_by(token_hash=hash_val).first()
    sess.is_revoked = 1
    db_session.commit()

    # Requesting refresh with the same token now triggers reuse/theft detection
    res = client.post("/api/v1/auth/refresh", json={"refresh_token": token})
    assert res.status_code == 401
