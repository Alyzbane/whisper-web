from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import List, Dict
import tempfile

from api.models import TranscriptionRequest, TranscriptionResponse
from api.services import get_available_models, transcribe_file, get_api_key
from api.decorators.cache import rotate_cached_tokens
from api.core.logging import logger


transcription_router = APIRouter(prefix="/transcription", tags=["transcription"])

@transcription_router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    model_id: str = Form(...),
    task: str = Form(...),
    language: str = Form("Automatic Detection"),
    chunk_length: int = Form(30),
    batch_size: int = Form(24)
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