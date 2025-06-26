from pydantic import BaseModel
from typing import List, Dict, Optional, Tuple, Literal


class TranscriptionSegment(BaseModel):
    """Model for a single segment of transcription."""
    text: str
    timestamp: Tuple[float, Optional[float]]
    id: Optional[int] = None


class TranscriptionRequest(BaseModel):
    """Model for transcription request parameters."""
    model_id: str
    task: Literal["transcribe", "translate"]
    language: str = "Automatic Detection"
    flash: bool = False
    chunk_length: int = 30
    batch_size: int = 24


class TranscriptionResponse(BaseModel):
    """Model for transcription API response."""
    text: str
    segments: List[Dict]


class SubtitleFormat(BaseModel):
    """Model for subtitle format configuration."""
    coma: str
    header: str


class SubtitleRequest(BaseModel):
    """Model for subtitle generation request."""
    segments: List[Dict]
    format: Literal["srt", "vtt", "txt"]
    output_file: Optional[str] = None
