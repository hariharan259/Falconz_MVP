# Mission Planner Specification

This document defines how autonomous flights are structured, validated, and executed within FalconZ.

## 1. Mission Anatomy
A Mission is a predefined set of instructions (usually Waypoints) that the drone executes sequentially.

### Waypoint Structure
```json
{
  "sequence_id": 1,
  "command": "NAV_WAYPOINT",
  "coordinates": {
    "lat": 37.7749,
    "lon": -122.4194,
    "alt": 50.0 
  },
  "acceptance_radius": 2.0,
  "hold_time_sec": 5
}
```

## 2. Mission Validation
Before a mission can transition to `IN_PROGRESS`, the backend validates the plan against:
- **Geofence**: All waypoints must fall within the allowed operating area.
- **Altitude Limits**: No waypoint can exceed the maximum legal altitude (e.g., 120m / 400ft).
- **Battery Estimates**: The AI calculates the total flight distance. If the estimated battery required exceeds current charge + 20% safety margin, the mission is rejected.

## 3. Dynamic Rerouting
Missions are not static. While `IN_PROGRESS`, the mission can be mutated:
1. **Operator Intervention**: The operator drags a waypoint on the GCS map. The backend sends a MAVLink `MISSION_ITEM_SET` command to update the specific sequence ID mid-flight.
2. **AI Obstacle Avoidance**: The Navigation Agent detects an obstacle, dynamically inserts a temporary waypoint to navigate around it, and then resumes the original mission sequence.

## 4. End of Mission Behavior
By default, the final command of any mission is `NAV_RETURN_TO_LAUNCH` (RTL) unless explicitly set to `NAV_LAND` at a specific forward operating base coordinate.
