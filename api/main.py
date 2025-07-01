from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.core.config import get_settings
from .services import create_pipe, pipe_cache
from .endpoints import transcription_router, admin_router, health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager to handle startup and shutdown events.
    """
    create_pipe("small")  # Preload a default model pipeline
    yield
    pipe_cache.clear()  # Clear the cache on shutdown

# Create settings and app instance
settings = get_settings()
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_VERSION}/openapi.json",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API router
app.include_router(transcription_router, prefix=settings.API_VERSION)
app.include_router(admin_router, prefix=settings.API_VERSION)
app.include_router(health_router, prefix=settings.API_VERSION)
