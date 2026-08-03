# Vision Pipeline Specification

The Vision Agent is responsible for parsing camera feeds in real-time, performing object detection, and streaming both raw video and metadata to the backend.

## 1. Hardware & Ingestion
- **Source**: Hardware camera (RTSP stream) or SITL simulated camera.
- **Resolution**: 1080p native, downscaled to 720p for AI inference to save compute.
- **Framerate**: 30 FPS.

## 2. Object Detection Model
- **Model**: YOLOv8 (You Only Look Once) - specifically the `yolov8s` (small) or `yolov8n` (nano) model for edge-compute efficiency.
- **Classes**: Pre-trained on COCO dataset, specifically filtering for: `person`, `car`, `truck`, `bicycle`.
- **Inference Target**: < 30ms per frame to maintain real-time responsiveness.

## 3. Output payload
When an object is detected, the Vision Agent emits a JSON payload to the backend/frontend for UI overlay or Navigation Agent processing.

```json
{
  "timestamp": "ISO8601",
  "frame_id": 1045,
  "detections": [
    {
      "class": "person",
      "confidence": 0.89,
      "bounding_box": { "x_min": 100, "y_min": 150, "x_max": 200, "y_max": 400 }
    }
  ]
}
```

## 4. Visual Odometry (V3 Feature)
In GPS-denied environments, the Vision pipeline will utilize Optical Flow algorithms (e.g., Lucas-Kanade) on downward-facing cameras to estimate velocity and positional drift, feeding this data back to the Flight Controller.
