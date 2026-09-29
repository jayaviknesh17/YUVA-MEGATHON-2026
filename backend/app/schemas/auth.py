from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class UserAuthResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    system_role: str
    ra_number: Optional[str] = None


class TokenResponse(BaseModel):
    success: bool = True
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserAuthResponse


class RefreshTokenResponse(BaseModel):
    success: bool = True
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class MessageResponse(BaseModel):
    success: bool = True
    message: str
