# Telemetry Specification

The Telemetry service acts as the translator between the drone's low-level protocol (MAVLink) and the modern web protocols (JSON/WebSockets) used by the GCS.

## 1. Ingestion Layer
- **Protocol**: MAVLink v2.0.
- **Connection**: UDP (for physical drones via radio telemetry) or TCP (for SITL simulation).
- **Heartbeat**: Expects a `HEARTBEAT` message every 1 second. If 5 seconds elapse without a heartbeat, the drone is marked `OFFLINE`.

## 2. Critical MAVLink Messages Parsed
The following MAVLink messages are extracted, mapped to JSON, and routed to the Time-Series database and WebSockets:
- `GLOBAL_POSITION_INT` (Lat, Lon, Alt, Relative Alt)
- `ATTITUDE` (Roll, Pitch, Yaw)
- `SYS_STATUS` (Battery voltage, remaining percentage)
- `VFR_HUD` (Airspeed, Groundspeed, Heading)

## 3. Predictive Maintenance (Telemetry Agent)
The Telemetry Agent subscribes to the stream and analyzes moving averages to detect hardware degradation.

**Anomaly Rules:**
- **Battery Sag**: If voltage drops more than 1.5V during takeoff thrust, flag battery for replacement.
- **IMU Vibration**: If high-frequency oscillations in `RAW_IMU` exceed 0.5 Gs during hover, flag propellers for balancing/replacement.

## 4. Broadcast Throttling
To prevent overwhelming the browser Frontend, telemetry data emitted over WebSockets is throttled to **5 Hz** (every 200ms), while the Time-Series Database receives the full **50 Hz** (or max rate) stream for accurate historical logging.
