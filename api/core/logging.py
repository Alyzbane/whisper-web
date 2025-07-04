from typing import Any, Callable
from loguru import logger

# Configure logging
logger.add("logs/app.log", rotation="10 MB", level="INFO", backtrace=True, diagnose=True)

def log_error(func: Callable) -> Callable:
    """Decorator to log errors from functions.
    
    Args:
        func: The function to wrap with error logging
        
    Returns:
        The wrapped function
    """
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {str(e)}")
            raise
    return wrapper
