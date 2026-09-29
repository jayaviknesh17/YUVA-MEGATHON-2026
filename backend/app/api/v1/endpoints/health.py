from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint returning system operational status."""
    return {
        "status": "ok",
        "app_name": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
    }
