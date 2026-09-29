import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "YUVA MegaThon 2026 API"
    API_V1_STR: str = "/api/v1"
    SQLITE_DB_PATH: str = "sqlite:///./yuva_app.db"
    ENVIRONMENT: str = "development"
    
    # JWT Authentication Configuration
    SECRET_KEY: str = "DEVELOPMENT_SECRET_KEY_CHANGE_IN_PRODUCTION_1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
