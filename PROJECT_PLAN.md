# Project Plan & Roadmap

This document outlines the agile phases to transition FalconZ from a foundational MVP to a production-ready, large-scale drone platform.

## Phase 1: Core Foundation & Simulation (Current)
- [x] Establish microservice directory structure.
- [ ] Setup Docker Compose for unified local development.
- [ ] Initialize Backend API Gateway and Database schemas.
- [ ] Setup SITL (Software-In-The-Loop) Simulation environment.
- [ ] Establish basic MAVLink communication layer.

## Phase 2: Telemetry & Manual Control
- [ ] Develop the Telemetry Service for real-time data ingestion.
- [ ] Build Ground Control Station (Frontend) with Map UI.
- [ ] Implement live telemetry streaming to the Frontend via WebSockets.
- [ ] Enable basic manual override commands (Takeoff, Land, Return to Launch).

## Phase 3: Vision & Basic Autonomy
- [ ] Integrate low-latency video streaming (WebRTC/RTSP) from simulation to Frontend.
- [ ] Deploy initial Vision pipeline for basic object detection (e.g., person/vehicle tracking).
- [ ] Implement AI-driven waypoint navigation.

## Phase 4: Advanced AI & Swarm Operations
- [ ] Introduce dynamic obstacle avoidance using Vision and AI services.
- [ ] Develop predictive maintenance algorithms in the Telemetry service.
- [ ] Implement Multi-Drone Swarm logic and collision avoidance.

## Phase 5: Hardware Integration & Hardening
- [ ] Bridge simulation code to real hardware (e.g., Pixhawk).
- [ ] Conduct rigorous field testing and adjust control loops.
- [ ] Implement CI/CD pipelines in `.github/workflows/`.
- [ ] Finalize security audits and role-based access control (RBAC).
- [ ] Production Release v1.0.
