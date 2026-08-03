import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from app.services.vision_agent import vision_manager
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

async def video_stream_generator():
    """
    Yields MJPEG frames indefinitely for the HTTP StreamingResponse.
    Targeting ~30 FPS.
    """
    while True:
        frame_bytes = vision_manager.generate_video_frame()
        # multipart/x-mixed-replace format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        await asyncio.sleep(1/30.0)

@router.get("/video_feed")
async def video_feed():
    """
    Returns an infinite MJPEG stream. Browsers can consume this directly via an <img> tag.
    """
    return StreamingResponse(
        video_stream_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.websocket("/ws/detections")
async def vision_detections_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time JSON bounding box and classification data.
    """
    await vision_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        vision_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"Vision WebSocket Error: {e}")
        vision_manager.disconnect(websocket)
