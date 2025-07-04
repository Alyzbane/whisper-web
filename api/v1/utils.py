from functools import lru_cache
from typing import Dict, List
from cryptography.fernet import Fernet, MultiFernet

import torch
from loguru import logger
from faster_whisper import WhisperModel, BatchedInferencePipeline
from pydantic_settings import BaseSettings

from ..core.logging import log_error

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
    global pipe_cache
    if model_id in pipe_cache:
        logger.info(f"Using cached pipeline for model {model_id}")
        return pipe_cache[model_id]

    # Determine device and dtype based on hardware
    if torch.cuda.is_available():
        device = "cuda"
        compute_type = "float16"
    else:
        device = "cpu"
        compute_type = "int8"
    
    logger.info(f"Using device: {device} and compute_type: {compute_type}")

    model = WhisperModel(model_id, device=device, compute_type=compute_type)

    pipe = BatchedInferencePipeline(model)
   
    # Cache the pipeline for future use
    pipe_cache[model_id] = pipe
    
    return pipe_cache[model_id]


@lru_cache(maxsize=1)
def get_available_models() -> List[Dict[str, str]]:
    """Get list of available whisper models.
    
    Returns:
        List of model information dictionaries
    """
    return [
        {"id": "tiny", "name": "Tiny"},
        # {"id": "tiny.en", "name": "Tiny (English only)"},
        # {"id": "base", "name": "Base"},
        # {"id": "base.en", "name": "Base (English only)"},
        {"id": "small", "name": "Small"},
        # {"id": "small.en", "name": "Small (English only)"},
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
        # {"id": "turbo", "name":   "Turbo"},
    ]


def create_multi_fernet(settings: BaseSettings) -> MultiFernet:
    """
    Create a MultiFernet cipher using the encryption keys from settings.
    Returns:
        MultiFernet: The cipher for encrypting and decrypting cache data.
    """
    
    encryption_keys = [Fernet(key) for key in settings.CACHE_ENCRYPTION_KEYS]
    cipher = MultiFernet(encryption_keys)

    return cipher
