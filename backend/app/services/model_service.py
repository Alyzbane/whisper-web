from typing import Dict, Any, Optional, List
import torch
from transformers import pipeline, AutoModelForSpeechSeq2Seq, AutoProcessor
from transformers.utils import is_flash_attn_2_available
from sys import platform
import logging
from app.core.logging import log_error

# Cache for model pipelines
pipe_cache = {}


@log_error
def create_pipe(model_id: str, flash_attention: bool):
    """
    Create a speech recognition pipeline with caching.

    Args:
        model_id: The model identifier
        flash_attention: Whether to use flash attention
        
    Returns:
        A speech recognition pipeline
    """
    key = (model_id, flash_attention)
    if key in pipe_cache:
        logging.info(f"Using cached pipeline for model {model_id} with flash_attention={flash_attention}")
        return pipe_cache[key]

    # Determine device and dtype based on hardware
    if torch.cuda.is_available():
        device = "cuda:0"
        torch_dtype = torch.float16
    elif platform == "darwin":
        device = "mps"
        torch_dtype = torch.float32  # MPS does not fully support float16
    else:
        device = "cpu"
        torch_dtype = torch.float32
    
    logging.info(f"Using device: {device} and dtype: {torch_dtype}")

    # Create the model with appropriate settings
    model = AutoModelForSpeechSeq2Seq.from_pretrained(
        model_id,
        torch_dtype=torch_dtype,
        low_cpu_mem_usage=True,
        use_safetensors=True,
        attn_implementation="flash_attention_2" if flash_attention and is_flash_attn_2_available() else "sdpa",
    )
    model.to(device)
    processor = AutoProcessor.from_pretrained(model_id)

    # Create and cache the pipeline
    pipe = pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        torch_dtype=torch_dtype,
        device=device,
    )
    
    # Cache the pipeline for future use
    pipe_cache[key] = pipe
    
    return pipe


def get_available_models() -> List[Dict[str, str]]:
    """Get list of available whisper models.
    
    Returns:
        List of model information dictionaries
    """
    return [
        {"id": "openai/whisper-tiny", "name": "Tiny"},
        {"id": "openai/whisper-tiny.en", "name": "Tiny (English only)"},
        {"id": "openai/whisper-base", "name": "Base"},
        {"id": "openai/whisper-base.en", "name": "Base (English only)"},
        {"id": "openai/whisper-small", "name": "Small"},
        {"id": "openai/whisper-small.en", "name": "Small (English only)"},
        {"id": "openai/whisper-medium", "name": "Medium"},
        {"id": "openai/whisper-medium.en", "name": "Medium (English only)"},
        {"id": "openai/whisper-large-v3", "name": "Large v3"},
    ]
