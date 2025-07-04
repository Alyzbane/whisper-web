from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.config import get_settings

from .v1.services import create_pipe, pipe_cache
from .v1.endpoints import transcription_router, admin_router, general_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
        Runs during the startup
        Initialize the Redis connection and preload a default model pipeline.
    """
    create_pipe("small")  # Preload a default model pipeline
    yield

    """
        Runs during the shutdown
        Clear the model pipeline cache
        Clear variable and close the Redis connection.
    """
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
app.include_router(general_router)
