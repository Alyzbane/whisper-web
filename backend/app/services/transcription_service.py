from functools import lru_cache
from typing import Dict, Any
import time
from app.services.model_service import create_pipe
from app.core.logging import log_error, logger


@log_error
@lru_cache(maxsize=128)
def transcribe_file(
    model_id: str,
    task: str,
    language: str,
    flash: bool,
    chunk_length: int,
    batch_size: int,
    filepath: str
) -> Dict[str, Any]:
    """
    Transcribe an audio file using whisper model.
    
    Args:
        model_id: The model identifier
        task: Task type (transcribe or translate)
        language: Language of the audio or target language for translation
        flash: Whether to use flash attention
        chunk_length: Length of chunks in seconds
        batch_size: Batch size for processing
        filepath: Path to the audio file
        
    Returns:
        Dictionary containing transcription results
    """
    # Create the pipeline for inference
    pipe = create_pipe(model_id, flash)
    
    # Set up generation parameters
    generate_kwargs = {}
    if language and language != "Automatic Detection" and not model_id.endswith(".en"):
        generate_kwargs["language"] = language
    if not model_id.endswith(".en"):
        generate_kwargs["task"] = task

    # Run inference and measure time
    start = time.time()
    outputs = pipe(
        filepath,
        chunk_length_s=chunk_length,
        batch_size=batch_size,
        generate_kwargs=generate_kwargs,
        return_timestamps=True,
    )
    processing_time = time.time() - start
    logger.info(f"Processed in {processing_time:.2f}s")

    # Return results
    return {
        "text": outputs["text"],
        "segments": outputs["chunks"],
        "processing_time": processing_time
    }
