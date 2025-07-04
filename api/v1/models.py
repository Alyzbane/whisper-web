from pydantic import BaseModel
from typing import Optional, Tuple, Literal, List
import logging

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


class HealthCheck(BaseModel):
    """Model for health check response."""
    status: str = "OK"


class EndpointFilter(logging.Filter):
    def __init__(self, excluded_endpoints: list[str]) -> None:
        """Initialize the filter with endpoints to exclude."""
        super().__init__()
        self.excluded_endpoints = excluded_endpoints
    
    def filter(self, record: logging.LogRecord) -> bool:
        """
        Filter out log records based on the request path.
        Args:
            record (logging.LogRecord): The log record to filter.
        Returns:
            bool: True if the record should be logged, False if it should be excluded. 
        """
        if record.args and len(record.args) >= 3:
            # Check if the request path matches any of the excluded endpoints
            return record.args[2] != self.excluded_endpoints
        return True

