# API Specification

This document defines the REST and WebSocket APIs for the FalconZ platform. It covers authentication, standard error handling, and the request/response payloads for all core and specialized modules.

---

## 1. Authentication & Security
All REST endpoints (unless otherwise specified) require a JWT token passed in the header:
```http
Authorization: Bearer <JWT_TOKEN>
```
WebSocket connections require the token to be passed either via a query parameter `?token=<JWT_TOKEN>` or during the initial handshake payload.

## 2. Standard Error Handling
All API errors return a standard JSON structure with appropriate HTTP status codes (e.g., 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error).

**Error Response Layout:**
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid waypoint coordinates provided.",
    "details": {
      "field": "lat",
      "issue": "Must be between -90 and 90."
    }
  }
}
```

---

## 3. Endpoints by Domain

### 3.1 Authentication
**`POST /api/v1/auth/login`**
- **Description**: Authenticates a user and returns a JWT.
- **Request**:
  ```json
  { "email": "operator@falconz.com", "password": "securepassword" }
  ```
- **Response** (200 OK):
  ```json
  { "token": "eyJhb...", "expires_in": 3600, "role": "OPERATOR" }
  ```

### 3.2 Users
**`GET /api/v1/users`**
- **Description**: List all registered users (Admin only).
- **Response** (200 OK):
  ```json
  [ { "id": "uuid", "email": "operator@falconz.com", "role": "OPERATOR" } ]
  ```

### 3.3 Drone
**`GET /api/v1/drones`**
- **Description**: Retrieve the fleet status.
- **Response** (200 OK):
  ```json
  [ { "id": "uuid", "name": "Falcon-Alpha", "status": "IDLE", "battery_percent": 98 } ]
  ```

**`POST /api/v1/drones/{id}/command`**
- **Description**: Send a direct manual override command.
- **Request**: `{ "command": "RTL" }`
- **Response** (202 Accepted): `{ "status": "Command dispatched" }`

### 3.4 Telemetry
**`WS /ws/telemetry`**
- **Description**: Real-time stream of drone vitals.
- **Payload** (Server -> Client, 5Hz):
  ```json
  {
    "drone_id": "uuid",
    "lat": 34.0522,
    "lon": -118.2437,
    "alt_rel": 45.5,
    "battery_percent": 82
  }
  ```

### 3.5 AI
**`POST /api/v1/ai/chat`**
- **Description**: Interact with the FalconZ AI assistant for operational queries.
- **Request**:
  ```json
  { "session_id": "uuid", "message": "Why did Falcon-Alpha abort its mission?" }
  ```
- **Response** (200 OK):
  ```json
  { "reply": "Falcon-Alpha aborted due to a critical voltage drop detected by the Telemetry Agent.", "context_used": ["telemetry_logs", "mission_state"] }
  ```

### 3.6 Knowledge
**`GET /api/v1/knowledge/search`**
- **Description**: Query the RAG-enabled Knowledge Base for documentation or SOPs.
- **Request**: `?query=calibrate+compass`
- **Response** (200 OK):
  ```json
  [ { "title": "PX4 Compass Calibration", "snippet": "To calibrate the compass, rotate the drone..." } ]
  ```

### 3.7 Mission
**`POST /api/v1/missions`**
- **Description**: Upload a new autonomous flight plan.
- **Request**:
  ```json
  {
    "drone_id": "uuid",
    "waypoints": [
      { "lat": 34.05, "lon": -118.24, "alt": 50 }
    ]
  }
  ```
- **Response** (201 Created): `{ "mission_id": "uuid", "status": "PLANNED" }`

### 3.8 Reports
**`POST /api/v1/reports/generate`**
- **Description**: Request generation of a post-flight or compliance report.
- **Request**:
  ```json
  { "report_type": "FLIGHT_SUMMARY", "mission_id": "uuid" }
  ```
- **Response** (202 Accepted): `{ "job_id": "uuid", "status": "Processing" }`

### 3.9 Vision
**`WS /ws/vision/detections`**
- **Description**: Real-time stream of object bounding boxes for UI overlay.
- **Payload** (Server -> Client):
  ```json
  {
    "drone_id": "uuid",
    "detections": [ { "class": "person", "confidence": 0.95, "box": [10, 10, 50, 50] } ]
  }
  ```

### 3.10 Water Monitoring
**`POST /api/v1/water-monitoring/samples`**
- **Description**: Log a water quality sample collected or analyzed by a specialized drone payload.
- **Request**:
  ```json
  {
    "drone_id": "uuid",
    "coordinates": { "lat": 34.05, "lon": -118.24 },
    "metrics": { "ph": 7.2, "turbidity": 4.1, "temperature_c": 18.5 }
  }
  ```
- **Response** (201 Created): `{ "sample_id": "uuid" }`

### 3.11 Engineering
**`GET /api/v1/engineering/maintenance-schedule`**
- **Description**: Fetch the predictive maintenance schedule for the fleet based on telemetry anomalies.
- **Response** (200 OK):
  ```json
  [
    {
      "drone_id": "uuid",
      "component": "Motor 3",
      "reason": "High vibration frequency detected",
      "recommended_action": "Replace Bearings",
      "urgency": "HIGH"
    }
  ]
  ```
