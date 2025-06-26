from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any, Optional

from app.schemas.transcription import SubtitleRequest
from app.services.subtitle_service import SubtitleService
from app.core.logging import logger

router = APIRouter()

@router.post("/generate")
async def generate_subtitle(request: SubtitleRequest):
    """
    Generate subtitle from transcription segments.
    
    Args:
        request: The subtitle generation request
        
    Returns:
        Generated subtitle text
    """
    try:
        subtitle_service = SubtitleService(request.format)
        subtitle_text = subtitle_service.get_subtitle(request.segments)
        
        return {"subtitle": subtitle_text}
    except Exception as e:
        logger.error(f"Error generating subtitle: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/download")
async def save_subtitle(request: SubtitleRequest):
    """
    Generate and save subtitle file.
    
    Args:
        request: The subtitle generation request with output file
        
    Returns:
        Path to the saved subtitle file
    """
    if not request.output_file:
        raise HTTPException(status_code=400, detail="Output file path is required")
    
    try:
        subtitle_service = SubtitleService(request.format)
        output_path = subtitle_service.write_subtitle(request.segments, request.output_file)
        
        return {"file_path": output_path}
    except Exception as e:
        logger.error(f"Error saving subtitle: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
