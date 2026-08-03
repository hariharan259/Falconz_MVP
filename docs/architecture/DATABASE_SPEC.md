# Database Specification

FalconZ utilizes a hybrid database approach to manage both stateful application data and high-throughput time-series data. This document outlines the schema design for all core entities in the platform.

---

## 1. Relational Database (PostgreSQL)
*Source of truth for application state, users, fleet management, and operational metadata.*

### 1.1 `users`
Manages operator and administrator accounts.
- `id` (UUID, PK)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: ADMIN, OPERATOR, VIEWER)
- `created_at` (Timestamp)
- `last_login` (Timestamp)

### 1.2 `drones`
Tracks the physical hardware units in the fleet.
- `id` (UUID, PK)
- `name` (String)
- `hardware_type` (String, e.g., 'PX4', 'ArduPilot')
- `firmware_version` (String)
- `status` (Enum: OFFLINE, IDLE, IN_FLIGHT, MAINTENANCE)
- `inventory_id` (UUID, FK -> `inventory`)

### 1.3 `missions`
Defines the autonomous flight plans and their current execution state.
- `id` (UUID, PK)
- `drone_id` (UUID, FK -> `drones`)
- `created_by` (UUID, FK -> `users`)
- `status` (Enum: PLANNED, IN_PROGRESS, COMPLETED, ABORTED)
- `waypoints` (JSONB) - Array of lat/lon/alt coordinates.
- `scheduled_start` (Timestamp)
- `completed_at` (Timestamp)

### 1.4 `alerts`
System-wide and mission-specific notifications and warnings.
- `id` (UUID, PK)
- `drone_id` (UUID, FK -> `drones`, Nullable)
- `mission_id` (UUID, FK -> `missions`, Nullable)
- `severity` (Enum: INFO, WARNING, CRITICAL, FATAL)
- `message` (String)
- `is_resolved` (Boolean)
- `created_at` (Timestamp)

### 1.5 `ai_chats`
Logs of interactions between operators and the FalconZ AI Assistant (e.g., querying flight status or troubleshooting).
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `users`)
- `session_id` (String)
- `role` (Enum: USER, ASSISTANT, SYSTEM)
- `message_content` (Text)
- `context_used` (JSONB) - Which KB articles or telemetry metrics the AI referenced.
- `created_at` (Timestamp)

### 1.6 `knowledge_base`
Documentation and troubleshooting guides used by human operators and queried by the AI via RAG (Retrieval-Augmented Generation).
- `id` (UUID, PK)
- `title` (String)
- `content` (Text)
- `category` (Enum: HARDWARE, SOFTWARE, REGULATORY, PROCEDURAL)
- `embedding` (Vector) - pgvector for semantic similarity search.
- `last_updated` (Timestamp)

### 1.7 `reports`
Generated summaries of flights, compliance, and fleet health.
- `id` (UUID, PK)
- `report_type` (Enum: FLIGHT_SUMMARY, MAINTENANCE_LOG, COMPLIANCE)
- `generated_by` (UUID, FK -> `users`)
- `reference_id` (UUID) - Could point to a mission or a drone.
- `file_url` (String) - Link to PDF/JSON in blob storage.
- `created_at` (Timestamp)

### 1.8 `inventory`
Tracking of physical assets, spare parts, and battery lifecycles.
- `id` (UUID, PK)
- `item_type` (Enum: DRONE, BATTERY, PROPELLER, MOTOR, SENSOR)
- `serial_number` (String, Unique)
- `condition` (Enum: NEW, GOOD, FAIR, RETIRED)
- `cycle_count` (Integer) - E.g., for batteries.
- `last_maintenance_date` (Timestamp)

---

## 2. Time-Series Database (InfluxDB / TimescaleDB)
*Optimized for high-write-volume, time-stamped sensor data.*

### 2.1 `telemetry`
High-frequency (e.g., 50Hz) sensor ingestion.
**Tags (Indexed):**
- `drone_id` (UUID)
- `mission_id` (UUID)

**Fields:**
- `lat` (Float)
- `lon` (Float)
- `alt_relative` (Float)
- `battery_volts` (Float)
- `battery_percent` (Integer)
- `imu_accel_x`, `imu_accel_y`, `imu_accel_z` (Float)
- `gps_satellites_visible` (Integer)

### 2.2 `flight_logs`
Aggregated or down-sampled session events (e.g., 1Hz) used for historical playback and ML training.
**Tags (Indexed):**
- `drone_id` (UUID)
- `session_id` (UUID)

**Fields:**
- `flight_mode` (String, e.g., 'MANUAL', 'AUTO', 'RTL')
- `error_code` (Integer)
- `distance_traveled_m` (Float)
- `max_altitude_m` (Float)
