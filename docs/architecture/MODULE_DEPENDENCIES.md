# Module Dependencies & Communication

This document maps the inter-module dependencies of the FalconZ platform, detailing how each service communicates, and identifying the shared components and reusable services that bind the architecture together.

---

## 1. Module Communication Graph

The FalconZ microservices rely on asynchronous and real-time communication protocols to ensure low latency and high fault tolerance.

### 1.1 Frontend (Ground Control Station)
- **Communicates with Backend (C&C Gateway)**: 
  - **Protocol**: HTTPS (REST) for stateful actions (login, fetching missions).
  - **Protocol**: WebSockets (WSS) for real-time telemetry streaming and live mission updates.
- **Communicates with Vision Pipeline**:
  - **Protocol**: WebRTC (Peer-to-Peer or TURN) for low-latency live video streaming.

### 1.2 Backend (Command & Control Gateway)
- **Communicates with Frontend**: Serves REST APIs and pushes WebSocket events.
- **Communicates with Databases**: 
  - **Protocol**: TCP (PostgreSQL/SQL) for CRUD operations.
- **Communicates with AI & Vision Agents**:
  - **Protocol**: gRPC or HTTP/2 for high-speed, internal microservice Remote Procedure Calls (e.g., requesting a new flight path from the AI agent).
- **Communicates with Telemetry Service**:
  - **Protocol**: Message Broker (e.g., MQTT or Redis Pub/Sub) to receive sanitized telemetry data and broadcast it to the Frontend.

### 1.3 Telemetry Service
- **Communicates with Drones / Simulation (Hardware)**:
  - **Protocol**: UDP/TCP (MAVLink v2).
- **Communicates with Time-Series DB**:
  - **Protocol**: HTTP/TCP (InfluxQL / PromQL) for bulk high-frequency writes.
- **Communicates with Backend**:
  - **Protocol**: MQTT / Message Broker for pushing state changes and anomaly alerts.

### 1.4 Vision & AI Agents
- **Communicates with Drones / Simulation**:
  - **Protocol**: RTSP (Video Ingestion) and MAVLink (for direct flight control overrides during autonomous flight).
- **Communicates with Backend**:
  - **Protocol**: gRPC (sending bounding boxes, requesting permission to reroute).

---

## 2. Shared Components (`shared/` Directory)

To prevent code duplication across the polyglot microservices, the following components are centralized in the `shared/` directory and utilized as internal libraries or schema definitions:

### 2.1 Interface Definitions
- **gRPC Protobufs (`.proto` files)**: The ultimate source of truth for communication between the Backend, AI, and Vision services.
- **OpenAPI Specs (`swagger.yaml`)**: The source of truth for the REST API consumed by the Frontend.

### 2.2 Protocol Wrappers
- **MAVLink Utilities**: Standardized helper functions for parsing and constructing MAVLink payloads, shared between the Telemetry service and the Hardware simulation environments.

### 2.3 Universal Schemas
- **Error Handling**: A standardized JSON error schema (e.g., `{ "code": 400, "message": "...", "details": {} }`) ensuring all microservices return predictable errors to the Backend API Gateway.
- **Telemetry Payloads**: Data Transfer Objects (DTOs) defining the exact shape of a "Drone Vitals" object passed across the message broker.

---

## 3. Reusable Services

Certain infrastructure services act as foundational utilities accessed by multiple, distinct modules.

### 3.1 Authentication & RBAC Service (Part of Backend)
- **Consumers**: Frontend (for login), AI/Vision Services (for internal service-to-service JWT validation), External APIs.
- **Role**: Validates identity and ensures that only authorized roles can issue commands.

### 3.2 Time-Series Database (InfluxDB/TimescaleDB)
- **Consumers**: 
  - *Telemetry Service* (Write-heavy: logging all flight data).
  - *Backend* (Read-heavy: fetching historical logs for the Frontend).
  - *AI Agents* (Read-heavy: fetching historical vibration data to train predictive maintenance models).

### 3.3 Message Broker (MQTT / Redis)
- **Consumers**: Telemetry, Backend, AI.
- **Role**: Acts as the central nervous system. Allows the Telemetry service to publish a "Low Battery" event, which is simultaneously consumed by the Backend (to alert the UI) and the AI Agent (to trigger an RTL calculation).

### 3.4 WebRTC Signaling Server
- **Consumers**: Frontend, Vision Pipeline.
- **Role**: Facilitates the initial SDP offer/answer handshake required to establish a peer-to-peer video connection between the camera and the browser.
