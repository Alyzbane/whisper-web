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

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    CACHE_ENCRYPTION_KEYS: List[str] = Field(...)
    CACHE_VERSION: str
    ADMIN_API_KEY: str

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
