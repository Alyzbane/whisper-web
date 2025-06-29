from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.core.config import get_settings
from .services import create_pipe, pipe_cache
from .endpoints import transcription_router, admin_router


# Create settings and app instance
settings = get_settings()
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_VERSION}/openapi.json"
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager to handle startup and shutdown events.
    """
    create_pipe("small")  # Preload a default model pipeline
    yield
    pipe_cache.clear()  # Clear the cache on shutdown


@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the API is running. 
    """
    return {"status": "ok"}