from typing import Generator

from .models import TranscriptionRequest, TranscriptionResponse, TranscriptionSegment

from ..core.config import get_settings
from ..core.logging import log_error
from .decorators.cache import cache_transcription
from .utils import create_pipe

from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader


# Used for admin verification
X_API_KEY = APIKeyHeader(name="X-API-Key", auto_error=False)

# Cache for model pipelines
settings = get_settings()


@log_error
def parse_transcription(data: Generator) -> TranscriptionResponse:
    """Parse transcription data into a structured response.

    Args:
        data (Generator): Generator yielding transcription segments.
    Returns:
        TranscriptionResponse: Structured response containing full text and segments. 
    """
    segments = []
    full_text_parts = []

    for segment in data:
        segments.append(
            TranscriptionSegment(
                id=segment.id,
                text=segment.text,
                timestamp=(segment.start, segment.end),
            )
        )
        full_text_parts.append(segment.text)

    full_text = " ".join(full_text_parts)

    return TranscriptionResponse(
        text=full_text,
        segments=segments
    )


@cache_transcription(ttl=3600)
@log_error
def transcribe_file(request: TranscriptionRequest) -> TranscriptionResponse:
    """
    Transcribe an audio file using whisper model.
    
    Args:
        request: The transcription request containing all parameters.
        
    Returns:
        Dictionary containing transcription results
    """
    pipe = create_pipe(request.model_id)
    
    # Set up generation parameters
    is_english_model = request.model_id.endswith(".en")

    language = None
    task = request.task

    if request.language and request.language != "auto" and not is_english_model:
        language = request.language

    # Run inference and measure time
    # start = time.time()
    segments, _ = pipe.transcribe(
        request.filepath,
        task=task,
        language=language,
        chunk_length=request.chunk_length,
        batch_size=request.batch_size,
    )
    # processing_time = time.time() - start
    # logger.info(f"Processed in {processing_time:.2f}s")

    # Parse the transcription data into a structured response
    response = parse_transcription(segments)

    return response


def get_api_key(api_key: str = Depends(X_API_KEY)):
    """
    Dependency to verify admin API key.
    
    Args:
        api_key (str): The API key from the request header.
        
    Raises:
        HTTPException: If the API key is invalid.
    """
    if api_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key"
        )
    return X_API_KEY