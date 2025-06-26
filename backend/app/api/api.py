from fastapi import APIRouter
from .endpoints import transcription, languages, subtitles

api_router = APIRouter()

# Sub-routers
api_router.include_router(transcription.router, prefix="/transcription", tags=["transcription"])
api_router.include_router(languages.router, prefix="/languages", tags=["languages"])
api_router.include_router(subtitles.router, prefix="/subtitles", tags=["subtitles"])
