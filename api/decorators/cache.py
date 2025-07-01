import hashlib
from functools import wraps

from cryptography.fernet import Fernet, MultiFernet, InvalidToken
from redis import Redis
from api.core.logging import log_error
from api.core.config import get_settings
from api.models import TranscriptionRequest, TranscriptionResponse

settings = get_settings()

redis_client = Redis.from_url(url=
                              f"{settings.REDIS_SCHEME}" +
                              f"{settings.REDIS_USERNAME}:" +
                              f"{settings.REDIS_PASSWORD}@" +
                              f"{settings.REDIS_HOST}:" +
                              f"{settings.REDIS_PORT}", decode_responses=True)

encryption_keys = [Fernet(key) for key in settings.CACHE_ENCRYPTION_KEYS]
cipher = MultiFernet(encryption_keys)

CACHE_VERSION = settings.CACHE_VERSION


@log_error
def make_cache_key(request: TranscriptionRequest) -> str:
    """
    Generate a unique cache key based on the transcription request parameters.
    Args:
        request (TranscriptionRequest): The transcription request object containing parameters.
    Returns:
        str: A unique cache key for the transcription request.
    """
    with open(request.filepath, 'rb') as f:
        file_hash = hashlib.sha256(f.read()).hexdigest()

    key = (
        f"transcription:{CACHE_VERSION}:"
        f"{file_hash}"
        f"{request.model_id}:"
        f"{request.task}:"
        f"{request.language}:"
        f"{request.chunk_length}:"
        f"{request.batch_size}"
    )

    return key


@log_error
def rotate_cached_tokens():
    """
    Rotate the encryption keys used for caching in Redis.
    """
    rotated_count = 0
    deleted_count = 0
    for key in redis_client.scan_iter(f"transcription:*"):
        cached = redis_client.get(key)
        if cached:
            """
            Attempt to decrypt the cached data with the current keys.
            If decryption fails, delete the key.
            If successful, re-encrypt with the new keys and update the cache. 
            """
            try:
                # Decrypt the cached data
                dcached = cipher.decrypt(cached.encode())
                # Re-encrypt with the new keys
                edata = cipher.encrypt(dcached)
                redis_client.set(key, edata.decode())
                rotated_count += 1
            except InvalidToken as e:
                redis_client.delete(key)
                deleted_count += 1
    
    return {
        "rotated": rotated_count,
        "deleted": deleted_count,
        "total": rotated_count + deleted_count
    }


@log_error
def cache_transcription(ttl=3600):
    """
    Decorator to cache transcription responses in Redis.
    Args:
        ttl (int): Time to live for the cache in seconds. Default is 3600 seconds (1 hour).
    Returns:
        function: Decorated function that caches its response.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(request: TranscriptionRequest):
            """
            Wrapper function to handle caching of transcription responses.
            Args:
                request (TranscriptionRequest): The transcription request object.
            Returns:
                TranscriptionResponse: The transcription response, either from cache or fresh.
            """
            key = make_cache_key(request)
            cached = redis_client.get(key)
            if cached:
                # Decrypt the cached data
                dcached = cipher.decrypt(cached.encode(), ttl=ttl)
                return TranscriptionResponse.model_validate_json(dcached.decode())

            # Call the original function
            result: TranscriptionResponse = func(request)

            # Cache the response JSON string
            json_data = result.model_dump_json()
            edata = cipher.encrypt(json_data.encode())
            redis_client.set(key, edata.decode(), ex=ttl)
            return result
        return wrapper
    return decorator