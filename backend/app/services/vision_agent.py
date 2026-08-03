import asyncio
import json
import random
import time
from datetime import datetime
import cv2
import numpy as np
from fastapi import WebSocket

class VisionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.frame_id = 0

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        if not self.active_connections:
            return
        msg_text = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(msg_text)
            except Exception:
                pass

    def generate_video_frame(self):
        """
        Generates a synthetic 720p frame using OpenCV.
        Draws a scrolling grid and random 'vision processing' artifacts.
        """
        width, height = 1280, 720
        # Create a dark background
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Draw a scanning line
        scan_y = int((time.time() * 200) % height)
        cv2.line(frame, (0, scan_y), (width, scan_y), (0, 123, 255), 2)
        
        # Draw some crosshairs
        center_x, center_y = width // 2, height // 2
        cv2.drawMarker(frame, (center_x, center_y), (255, 255, 255), cv2.MARKER_CROSS, 40, 1)

        # Add timestamp
        cv2.putText(frame, datetime.utcnow().isoformat(), (20, 40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 1, cv2.LINE_AA)

        # Encode to JPEG
        ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        return buffer.tobytes()

    def generate_mock_detections(self):
        """
        Simulates YOLOv8 output, specifically detecting Plastic and COCO classes.
        """
        classes = ["person", "car", "Plastic Bottle", "Plastic Debris"]
        detections = []
        
        # 30% chance to detect something in this frame
        if random.random() < 0.3:
            num_objects = random.randint(1, 3)
            for _ in range(num_objects):
                x_min = random.randint(100, 1000)
                y_min = random.randint(100, 500)
                detections.append({
                    "class": random.choice(classes),
                    "confidence": round(random.uniform(0.65, 0.98), 2),
                    "bounding_box": {
                        "x_min": x_min,
                        "y_min": y_min,
                        "x_max": x_min + random.randint(50, 150),
                        "y_max": y_min + random.randint(50, 200)
                    }
                })

        self.frame_id += 1
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "frame_id": self.frame_id,
            "detections": detections
        }

vision_manager = VisionManager()

async def simulate_vision_stream():
    """
    Background task to continuously emit YOLO detections over WebSocket at 10Hz.
    """
    while True:
        detections = vision_manager.generate_mock_detections()
        if detections["detections"]: # Only broadcast if we found something to save bandwidth
            await vision_manager.broadcast(detections)
        await asyncio.sleep(0.1) # 10Hz metadata
