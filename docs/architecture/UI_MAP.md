# UI Map & Information Architecture

This document defines the complete screen hierarchy and routing structure for the FalconZ Ground Control Station (Frontend). It outlines the primary function and key components for each major view.

---

## 1. Public & Auth Screens

### 1.1 Landing (`/`)
- **Purpose**: Marketing and high-level overview of the FalconZ platform for unauthenticated visitors.
- **Key Components**: Hero banner, feature highlights (AI, Vision, Telemetry), call-to-action to Login.

### 1.2 Login (`/login`)
- **Purpose**: Secure authentication portal.
- **Key Components**: Email/Password form, SSO options (if applicable), "Forgot Password" flow.

---

## 2. Core Operations

### 2.1 Dashboard (`/dashboard`)
- **Purpose**: The primary home screen post-login, providing a bird's-eye view of fleet operations.
- **Key Components**: 
  - Fleet Status Summary (Active, Idle, Offline).
  - Recent Critical Alerts widget.
  - Weather integration widget (vital for flight safety).

### 2.2 Mission Planner (`/planner`)
- **Purpose**: Interactive tool for designing and validating autonomous flights.
- **Key Components**:
  - Full-screen 3D Map (WebGL).
  - Waypoint editor sidebar (Lat, Lon, Alt, Hold Time).
  - Pre-flight validation checklist (Battery estimates, Geofence checks).

### 2.3 Telemetry & Live Control (`/telemetry`)
- **Purpose**: The active monitoring interface during an `IN_PROGRESS` mission.
- **Key Components**:
  - Live WebRTC Video feed with Vision Agent bounding box overlays.
  - Real-time gauges (Attitude indicator, Battery, Speed, Altitude).
  - Emergency manual override controls (RTL, Land, Abort).

---

## 3. Engineering & Analysis

### 3.1 AI Chat (`/ai-chat`)
- **Purpose**: Conversational interface with the FalconZ AI Assistant.
- **Key Components**:
  - Chat window supporting markdown and tables.
  - Context references (e.g., "Sourced from PX4 Calibration Manual").
  - Quick-prompts for common queries (e.g., "Summarize latest flight log").

### 3.2 Drone Designer (`/designer`)
- **Purpose**: Advanced interface for configuring hardware parameters and payloads.
- **Key Components**:
  - Firmware parameter editor (PID tuning).
  - Payload configurator (e.g., attaching the Water Monitoring module).
  - Calibration wizards (Compass, Accelerometer).

### 3.3 Flight Logs (`/logs`)
- **Purpose**: Historical playback and analysis of past missions.
- **Key Components**:
  - Searchable list of past sessions.
  - Playback timeline scrubber synced with a 2D map.
  - Time-series charts for IMU vibrations and voltage sag.

### 3.4 Reports (`/reports`)
- **Purpose**: Generation and viewing of operational summaries.
- **Key Components**:
  - Export controls (PDF, CSV).
  - Pre-built templates for Compliance, Maintenance, and Water Quality.

---

## 4. User & System Management

### 4.1 Profile (`/profile`)
- **Purpose**: Individual user management.
- **Key Components**:
  - Personal details and avatar.
  - Password reset.
  - Personal preferences (e.g., Light/Dark mode).

### 4.2 Settings (`/settings`)
- **Purpose**: Global platform configurations (Admin restricted).
- **Key Components**:
  - User Role management (RBAC).
  - API Key generation for external integrations.
  - Global geofence definitions.
