from typing import Dict, List, Generator
from functools import lru_cache
import torch
import logging

from api.core.config import get_settings
from api.core.logging import log_error
from api.decorators.cache import cache_transcription
from api.models import TranscriptionRequest, TranscriptionResponse, TranscriptionSegment
from faster_whisper import WhisperModel, BatchedInferencePipeline
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader


# Used for admin verification
X_API_KEY = APIKeyHeader(name="X-API-Key", auto_error=False)

# Cache for model pipelines
settings = get_settings()
pipe_cache = {}


@log_error
def create_pipe(model_id: str) -> BatchedInferencePipeline:
    """
    Create or retrieve a cached BatchedInferencePipeline for the specified model ID.
    Args:
        model_id (str): The identifier for the Whisper model to use.
    Returns:
        BatchedInferencePipeline: The pipeline for the specified model. 
    """

    if model_id in pipe_cache:
        logging.info(f"Using cached pipeline for model {model_id}")
        return pipe_cache[model_id]

    # Determine device and dtype based on hardware
    if torch.cuda.is_available():
        device = "cuda"
        compute_type = "float16"
    else:
        device = "cpu"
        compute_type = "int8"
    
    logging.info(f"Using device: {device} and compute_type: {compute_type}")

    model = WhisperModel(model_id, device=device, compute_type=compute_type)

    pipe = BatchedInferencePipeline(model)
   
    # Cache the pipeline for future use
    pipe_cache[model_id] = pipe
    
    return pipe


@log_error
def parse_transcription(data: Generator) -> TranscriptionResponse:
    """
    Parse transcription data into a structured response.
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
    if request.language and request.language != "auto" and not is_english_model:
        language = request.language

    if not is_english_model:
        task = request.task

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


@lru_cache(maxsize=1)
def get_available_models() -> List[Dict[str, str]]:
    """Get list of available whisper models.
    
    Returns:
        List of model information dictionaries
    """
    return [
        {"id": "tiny", "name": "Tiny"},
        {"id": "tiny.en", "name": "Tiny (English only)"},
        # {"id": "base", "name": "Base"},
        # {"id": "base.en", "name": "Base (English only)"},
        {"id": "small", "name": "Small"},
        {"id": "small.en", "name": "Small (English only)"},
        # {"id": "distil-small.en", "name": "Distilled Small (English only)"},
        # {"id": "medium", "name": "Medium"},
        # {"id": "medium.en", "name": "Medium (English only)"},
        # {"id": "distil-medium.en", "name": "Distilled Medium (English only)"},
        # {"id": "large-v1", "name": "Large v1"},
        # {"id": "large-v2", "name": "Large v2"},
        # {"id": "large-v3", "name": "Large v3"},
        # {"id": "large", "name": "Large"},
        # {"id": "distil-large-v2", "name": "Distilled Large v2"},
        # {"id": "distil-large-v3", "name": "Distilled Large v3"},
        # {"id": "large-v3-turbo", "name": "Large v3 Turbo"},
        {"id": "turbo", "name": "Turbo"},
    ]


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