from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import List, Dict, Any, Optional
import tempfile

from app.schemas.transcription import TranscriptionRequest, TranscriptionResponse
from app.services.transcription_service import transcribe_file
from app.services.model_service import get_available_models
from app.core.logging import logger

router = APIRouter()


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    model_id: str = Form(...),
    task: str = Form(...),
    language: str = Form("Automatic Detection"),
    flash: bool = Form(False),
    chunk_length: int = Form(30),
    batch_size: int = Form(24)
):
    """
    Transcribe an audio file.
    
    Args:
        file: The audio file to transcribe
        model_id: The model identifier
        task: The task type (transcribe or translate)
        language: The language of the audio
        flash: Whether to use flash attention
        chunk_length: Length of chunks in seconds
        batch_size: Batch size for processing
        
    Returns:
        TranscriptionResponse: The transcription results
    """
    try:
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
            tmp.write(await file.read())
            tmp.flush()
            
            # Process the file with transcription service
            result = transcribe_file(
                model_id=model_id,
                task=task,
                language=language,
                flash=flash,
                chunk_length=chunk_length,
                batch_size=batch_size,
                filepath=tmp.name,
            )
        # Store the results in redis with key as the file hash
        return result
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models", response_model=List[Dict[str, str]])
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
