# AI Rulebook

The AI Rulebook dictates the hard constraints, ethical boundaries, and fallback behaviors for the autonomous agents within FalconZ. The Navigation Agent must ALWAYS adhere to these rules above all else.

## 1. Absolute Directives
1. **Human Override**: A manual command from the Ground Control Station (e.g., RTL or Land) instantly preempts any AI-planned task.
2. **Geofence Compliance**: The drone must never plot a path outside the predefined 3D geofence polygons. If wind pushes the drone outside, the immediate priority is to re-enter or land.

## 2. Failsafe Behaviors
- **Signal Loss (C&C Link Lost)**:
  - Wait 10 seconds.
  - If no reconnection, initiate Return to Launch (RTL) at a safe altitude (e.g., 30m).
- **Low Battery Warning (20%)**:
  - Abort active mission.
  - Calculate straight-line path home. If sufficient, execute RTL. If insufficient, execute immediate safe landing.
- **GPS Loss**:
  - Switch to Vision Agent for visual odometry.
  - If visual odometry fails, execute a controlled vertical descent to land.

## 3. Swarm Rules
- **Minimum Separation**: Drones must maintain a minimum 15-meter spherical exclusion zone around other FalconZ drones.
- **Priority Protocol**: In collision scenarios, the drone with the lower battery percentage maintains its course; the drone with the higher battery executes the avoidance maneuver.

## 4. Obstacle Avoidance Margins
- **Dynamic Obstacles (Moving)**: Maintain a 10-meter margin.
- **Static Obstacles (Buildings, Trees)**: Maintain a 5-meter margin.
