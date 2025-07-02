import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status, Header
from typing import List, Dict, Annotated
import tempfile

from api.models import TranscriptionRequest, TranscriptionResponse, HealthCheck, EndpointFilter
from api.services import get_available_models, transcribe_file, get_api_key
from api.decorators.cache import rotate_cached_tokens
from api.core.logging import logger
from api.core.config import get_settings


settings = get_settings()
transcription_router = APIRouter(prefix="/transcription", tags=["transcription"])

@transcription_router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: Annotated[UploadFile, File()],
    model_id: str = Form(...),
    task: str = Form(...),
    language: str = Form("auto"),
    chunk_length: int = Form(30),
    batch_size: int = Form(5),
    content_length: Annotated[int | None, Header(lt=settings.UPLOAD_LIMIT)] = None,
):
    """
    Transcribe an audio file synchronously with Redis caching.
    
    Args:
        file: The audio file to transcribe
        model_id: The model identifier
        task: The task type (transcribe or translate)
        language: The language of the audio
        chunk_length: Length of chunks in seconds
        batch_size: Batch size for processing
        
    Returns:
        TranscriptionResponse: The transcription results
    """
    try:
        # Validate file type
        if not file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="Invalid file type. Only audio files are supported.")
        
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
            tmp.write(await file.read())
            tmp.flush()

            request = TranscriptionRequest(
                model_id=model_id,
                task=task,
                language=language,
                chunk_length=chunk_length,
                batch_size=batch_size,
                filepath=tmp.name
            )
            
            results = transcribe_file(request) 

            return results
            
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@transcription_router.get("/models", response_model=List[Dict[str, str]])
async def get_models():
    """
    Get list of available models.
    
    Returns:
        List of available whisper models
    """
    try:
        return get_available_models()
    except Exception as e:
        logger.error(f"Error getting models: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Admin router
admin_router = APIRouter(prefix="/admin", tags=["admin"])

@admin_router.get("/rotate-tokens", dependencies=[Depends(get_api_key)])
async def rotate_tokens():
    """
    Rotate the encryption keys used for caching in Redis.
    """
    result = rotate_cached_tokens()
    return {
        "message": "Cache tokens rotated successfully",
        "rotated_count": result["rotated"],
        "deleted_count": result["deleted"],
        "total": result["total"]
    }


general_router = APIRouter(tags=["general"])

@general_router.get(
        "/health",
        response_description="Return HTTP Status Code 200 OK",
        status_code=status.HTTP_200_OK,
        response_model=HealthCheck
        )
async def health_check() -> HealthCheck:
    """
    Health check endpoint to verify the API is running. 
    """
    return HealthCheck(status="OK")


logging.getLogger("uvicorn.access").addFilter(EndpointFilter([f"{settings.API_VERSION}/health"]))