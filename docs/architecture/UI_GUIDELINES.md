# UI Guidelines

This document outlines the design standards for the FalconZ Ground Control Station (GCS). Because operators often use GCS software outdoors in direct sunlight under stressful conditions, high contrast and clarity are paramount.

## 1. Color Palette
- **Background (Dark Mode Default)**: `#121212` to reduce glare and preserve night vision for evening flights.
- **Primary Accent (Falcon Blue)**: `#007BFF` - Used for primary actions and active states.
- **Success/Safe**: `#28A745` - Used for healthy telemetry vitals.
- **Warning**: `#FFC107` - Used for low battery or signal degradation.
- **Critical/Danger**: `#DC3545` - Used for critical hardware failures or obstacle collision warnings.

## 2. Typography
- **Primary Font**: `Inter` or `Roboto`. Highly legible sans-serif fonts are required for fast reading of numbers (telemetry data).
- **Monospace**: `JetBrains Mono` or `Fira Code` for terminal outputs and raw coordinate logs.

## 3. Layout Structure
- **Left Panel (20%)**: Drone selection, fleet status, and active mission list.
- **Center Canvas (60%)**: 
  - *Split View*: Top 50% Live WebRTC Video Feed; Bottom 50% 2D/3D Map Visualization (WebGL/Mapbox).
- **Right Panel (20%)**: Live telemetry gauges, battery indicators, and critical manual override buttons (Takeoff, Land, RTL).

## 4. Interaction Design
- **Critical Actions**: Actions like `Land` or `Abort Mission` must require a two-step confirmation (e.g., slide-to-confirm or modal dialog) to prevent accidental clicks.
- **Latency**: UI components subscribing to WebSockets must debounce rendering if data arrives faster than 60fps to prevent browser lockup.

## 5. WebRTC Video Player
- Must support automatic reconnection on drop.
- Overlay capabilities for drawing bounding boxes received from the Vision Agent.
