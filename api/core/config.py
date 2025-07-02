from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings."""
    # API configuration
    API_VERSION: str
    PROJECT_NAME: str
    CORS_ORIGINS: List[str] = Field(default_factory=list)

    REDIS_SCHEME: str
    REDIS_USERNAME: str
    REDIS_PASSWORD: str
    REDIS_HOST: str
    REDIS_PORT: int

    CACHE_ENCRYPTION_KEYS: List[str] = Field(...)
    CACHE_VERSION: str
    ADMIN_API_KEY: str
    UPLOAD_LIMIT: int

    class Config:
        env_file = ".env.fastapi"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get application settings with caching.
    
    Returns:
        The application settings
    """
    return Settings()
