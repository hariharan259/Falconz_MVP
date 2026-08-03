import logging
import sys
from pythonjsonlogger import jsonlogger

def setup_logging() -> None:
    """Configure structured JSON logging for the application."""
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Clear existing handlers
    if logger.hasHandlers():
        logger.handlers.clear()

    log_handler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(levelname)s %(name)s %(message)s'
    )
    log_handler.setFormatter(formatter)
    logger.addHandler(log_handler)

    # Suppress noisy library logs
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
