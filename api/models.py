from pydantic import BaseModel, model_validator
from typing import Optional, Tuple, Literal, List


class TranscriptionSegment(BaseModel):
    """Model for a single segment of transcription."""
    id: Optional[int] = None
    text: str
    timestamp: Tuple[float, Optional[float]]


class TranscriptionRequest(BaseModel):
    """Model for transcription request parameters."""
    model_id: str
    task: Literal["transcribe", "translate"]
    language: str = "Automatic Detection"
    chunk_length: int = 30
    batch_size: int = 24
    filepath: str


class TranscriptionResponse(BaseModel):
    """Model for transcription API response."""
    text: str
    segments: List[TranscriptionSegment]