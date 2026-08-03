from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.telemetry import manager
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/ws")
async def telemetry_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for live telemetry streaming.
    Clients connect here to receive the 5Hz MAVLink stream.
    """
    await manager.connect(websocket)
    try:
        while True:
            # We don't expect much input from the client on this socket, 
            # but we must keep it open and read to detect disconnects.
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        manager.disconnect(websocket)
