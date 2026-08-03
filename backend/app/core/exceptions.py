from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

logger = logging.getLogger(__name__)

async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Formats standard HTTP exceptions to match the API_SPEC schema."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": "HTTP_ERROR",
                "message": exc.detail
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats Pydantic validation errors to match the API_SPEC schema."""
    details = exc.errors()
    # Safely extract field name if available
    field = details[0]["loc"][-1] if details and details[0].get("loc") else "unknown"
    issue = details[0]["msg"] if details else "Validation failed"
    
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": "VALIDATION_FAILED",
                "message": "Invalid request payload.",
                "details": {
                    "field": str(field),
                    "issue": issue
                }
            }
        }
    )

async def global_exception_handler(request: Request, exc: Exception):
    """Catches all unhandled exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred."
            }
        }
    )
