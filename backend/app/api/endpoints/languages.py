from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any, Optional

from app.schemas.language import LANGUAGES, Language
from app.core.logging import logger

router = APIRouter()


@router.get("/", response_model=List[Language])
async def get_languages():
    """
    Get list of all available languages.
    
    Returns:
        List of available languages
    """
    try:
        return LANGUAGES
    except Exception as e:
        logger.error(f"Error getting languages: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
