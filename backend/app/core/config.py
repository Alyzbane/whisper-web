import os
from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings."""
    # API configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Whisper Web API"
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    # Celery configuration
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

    # Model configuration
    DEFAULT_MODEL: str = "openai/whisper-base"
    MAX_CHUNK_LENGTH: int = 60
    MAX_BATCH_SIZE: int = 32
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get application settings with caching.
    
    Returns:
        The application settings
    """
    return Settings()
