from datetime import timedelta
import pytest
from app.core.security import create_access_token, hash_password
from app.models.user import User, StudentProfile


def test_valid_login_succeeds(client, db_session):
    """Test valid email and password credentials return HTTP 200 with JWT access token."""
    pw_hash = hash_password("Secret123!")
    user = User(
        email="valid_user@srmist.edu.in",
        password_hash=pw_hash,
        full_name="Valid Student",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    student_prof = StudentProfile(
        user_id=user.id,
        ra_number="RA1111111111111",
        department="CSE",
        year_of_study=3,
        section="A",
    )
    db_session.add(student_prof)
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "valid_user@srmist.edu.in", "password": "Secret123!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "valid_user@srmist.edu.in"
    assert data["user"]["ra_number"] == "RA1111111111111"


def test_invalid_password_fails(client, db_session):
    """Test invalid password rejects login with HTTP 401 Unauthorized."""
    pw_hash = hash_password("Secret123!")
    user = User(
        email="wrong_pass@srmist.edu.in",
        password_hash=pw_hash,
        full_name="User Wrong Pass",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrong_pass@srmist.edu.in", "password": "WrongPassword!"},
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_nonexistent_user_fails(client):
    """Test non-existent user email rejects login with HTTP 401 without leaking user existence."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@srmist.edu.in", "password": "Secret123!"},
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_missing_token_fails(client):
    """Test accessing protected /auth/me without Bearer token returns HTTP 401."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_invalid_token_fails(client):
    """Test accessing protected /auth/me with invalid JWT string returns HTTP 401."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_token_string_xyz"},
    )
    assert response.status_code == 401


def test_expired_token_fails(client, db_session):
    """Test accessing protected endpoint with expired JWT token returns HTTP 401."""
    user = User(
        email="exp_user@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Expired User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    expired_token = create_access_token(
        subject=user.id,
        expires_delta=timedelta(seconds=-3600),  # Expired 1 hour ago
    )
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert response.status_code == 401


def test_me_endpoint_returns_profile(client, db_session):
    """Test GET /api/v1/auth/me returns currently authenticated user profile."""
    user = User(
        email="me_user@srmist.edu.in",
        password_hash=hash_password("Pass123!"),
        full_name="Me User",
        system_role="STUDENT",
    )
    db_session.add(user)
    db_session.commit()

    token = create_access_token(subject=user.id)
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me_user@srmist.edu.in"
    assert data["full_name"] == "Me User"
    assert data["system_role"] == "STUDENT"
