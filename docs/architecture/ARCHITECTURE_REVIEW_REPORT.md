# FalconZ Architecture Review Report
**Date**: August 2026
**Role**: Chief Software Architect
**Scope**: End-to-End MVP Assessment (Frontend, Backend, Database, AI, Vision, Telemetry)

---

## 1. Executive Summary
The FalconZ MVP successfully demonstrates a cohesive, end-to-end Ground Control Station capable of simulating real-time telemetry, AI-driven mission planning, and vision-based object detection. However, while the foundational architecture is solid, the system currently employs several "MVP shortcuts" that will critically fail under production loads, cellular network conditions, and multi-node scaling.

This report identifies key discrepancies between the original architectural specifications and the current implementation, highlighting security, scalability, and performance bottlenecks that must be addressed before V1.0.

---

## 2. Design Inconsistencies & Architecture Gaps

### 2.1 The "Monolithic Microservice" Paradox
- **Issue**: The `AGENTS.md` and `ARCHITECTURE.md` documents specify a polyglot, microservices-oriented architecture (implying isolated domains for Vision, Telemetry, and AI). However, the current MVP implements all these agents as asynchronous background tasks within a **single FastAPI monolith** (`main.py` lifespan).
- **Recommendation**: Before scaling, extract the `Vision Agent` (heavy compute/GPU) and `Telemetry Agent` (high I/O UDP ingestion) into distinct, deployable microservices communicating via a message broker (e.g., RabbitMQ or NATS) rather than running in the main API gateway's event loop.

### 2.2 Time-Series Database (TimescaleDB) Implementation
- **Issue**: `DATABASE_SPEC.md` dictates the use of TimescaleDB for high-throughput telemetry logging. While PostgreSQL 15 is deployed via Docker, the TimescaleDB extension is not installed, and the current `TelemetryManager` only broadcasts data via WebSockets without persisting the 50Hz stream to the database.
- **Recommendation**: Upgrade the `docker-compose.yml` db image to `timescale/timescaledb:latest-pg15` and implement bulk-insert buffering in the backend to save flight logs.

---

## 3. Scalability Issues

### 3.1 In-Memory WebSocket State
- **Issue**: Both `TelemetryManager` and `VisionManager` store active WebSocket connections in memory (`self.active_connections = []`). 
- **Impact**: If FastAPI is scaled horizontally across multiple workers or containers to handle more operators, WebSocket broadcasts will fail because connections are trapped in isolated memory silos.
- **Recommendation**: Implement a **Redis Pub/Sub backplane**. The drone agents should publish to Redis, and all FastAPI workers should subscribe to Redis to broadcast to their respective connected clients.

### 3.2 Database Migration Automation
- **Issue**: The `docker-compose.yml` attempts to run `alembic upgrade head` on startup, but no initial migration scripts exist in the `alembic/versions` directory. 
- **Recommendation**: Generate the initial Alembic migration baseline and commit it to version control so the CI/CD pipeline and Docker containers can reliably build the schema.

---

## 4. Performance Bottlenecks

### 4.1 Video Streaming Protocol (MJPEG)
- **Issue**: The Vision module streams video using MJPEG over HTTP `multipart/x-mixed-replace`. While easy to implement for an MVP, MJPEG consumes massive bandwidth and offers poor latency over unstable cellular networks (LTE/5G) typical in drone operations. Furthermore, encoding JPEG frames in Python using OpenCV is highly CPU-intensive.
- **Recommendation**: Transition to **WebRTC** for sub-second, low-bandwidth video streaming. Utilize hardware-accelerated pipelines (e.g., GStreamer or FFmpeg) on the edge device instead of Python-based encoding.

### 4.2 RAG Pipeline Latency
- **Issue**: The AI Module is stubbed. When connected to a real LLM and Vector DB (PGVector), generating responses synchronously during the HTTP request will lead to long timeouts for the operator.
- **Recommendation**: Implement **Server-Sent Events (SSE)** or WebSockets for the `/api/v1/ai/chat` endpoint to stream the LLM response tokens back to the UI in real-time, matching standard ChatGPT-like UX.

---

## 5. Security Risks

### 5.1 Hardcoded Secrets
- **Issue**: The JWT `SECRET_KEY` and Database credentials are hardcoded directly into the `docker-compose.yml`.
- **Recommendation**: Move all secrets to an external `.env` file that is strictly ignored by Git (`.gitignore`). Use a secret manager (e.g., AWS Secrets Manager or HashiCorp Vault) for production.

### 5.2 Unauthenticated Video Feeds
- **Issue**: The `/api/v1/vision/video_feed` endpoint is accessed via a standard HTML `<img>` tag, making it difficult to pass the JWT `Authorization` header. Currently, the stream is effectively public to anyone who knows the URL.
- **Recommendation**: Implement temporary Signed URLs or use WebSocket/WebRTC protocols where authentication tokens can be passed during the initial handshake.

---

## 6. Missing Components & Documentation Gaps

### 6.1 Missing Physical Hardware Bridge (Edge Agent)
- The architecture lacks definition for the **Edge Agent**—the software that actually runs *onboard* the drone (e.g., Raspberry Pi or Jetson Nano) to bridge MAVLink from the Pixhawk flight controller over 4G/LTE to our cloud backend.

### 6.2 YOLO Training Pipeline
- The Vision Spec dictates YOLOv8 usage but lacks documentation on how custom datasets (e.g., specific plastic debris types) will be curated, labeled, trained, and deployed to the drones via OTA (Over-The-Air) updates.

---

## 7. Roadmap & Priority Matrix

| Priority | Module | Action Item | Effort |
| :--- | :--- | :--- | :--- |
| **Critical** | Security | Extract secrets from docker-compose to `.env`. | Low |
| **Critical** | Database | Generate Alembic baseline migrations and configure TimescaleDB. | Medium |
| **High** | Architecture | Implement Redis Pub/Sub for scalable WebSockets. | Medium |
| **High** | Video | Spike a WebRTC replacement for the MJPEG video feed. | High |
| **Medium** | AI | Update API to support streaming LLM tokens (SSE). | Low |
| **Medium** | Edge | Draft `EDGE_AGENT_SPEC.md` detailing onboard MAVLink-to-Cloud telemetry. | Medium |
