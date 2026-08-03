import asyncio
import json
import random
import time
from typing import List
from fastapi import WebSocket

class TelemetryManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.latest_data = self._generate_base_state()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        if not self.active_connections:
            return
        msg_text = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(msg_text)
            except Exception:
                pass # Client disconnected ungracefully

    def _generate_base_state(self):
        return {
            "flight_mode": "STABILIZE",
            "battery_percent": 100,
            "gps_satellites": 12,
            "alt_relative": 0.0,
            "roll": 0.0,
            "pitch": 0.0,
            "yaw": 0.0,
            "imu_accel_z": -9.81
        }

manager = TelemetryManager()

async def simulate_telemetry_stream():
    """
    Simulates a MAVLink data stream since we don't have a physical drone connected.
    Updates the state dynamically and broadcasts at 5Hz.
    """
    state = manager._generate_base_state()
    is_flying = False

    while True:
        # Simulate taking off and flying after a short delay
        if random.random() < 0.01:
            is_flying = not is_flying
            state["flight_mode"] = "AUTO" if is_flying else "RTL"
        
        if is_flying:
            state["alt_relative"] += random.uniform(-0.5, 1.0)
            state["battery_percent"] = max(0, state["battery_percent"] - random.uniform(0, 0.05))
            state["roll"] = random.uniform(-15.0, 15.0)
            state["pitch"] = random.uniform(-10.0, 10.0)
            state["yaw"] = (state["yaw"] + random.uniform(-5, 5)) % 360
            state["imu_accel_z"] = -9.81 + random.uniform(-2.0, 2.0)
        else:
            if state["alt_relative"] > 0:
                state["alt_relative"] -= 0.5
            else:
                state["alt_relative"] = 0
                state["flight_mode"] = "STABILIZE"
            state["roll"] *= 0.9
            state["pitch"] *= 0.9
            state["imu_accel_z"] = -9.81 + random.uniform(-0.1, 0.1)

        state["gps_satellites"] = max(8, min(16, state["gps_satellites"] + random.randint(-1, 1)))

        # Broadcast the synthetic data
        await manager.broadcast(state)
        
        # 5Hz Broadcast Rate (200ms)
        await asyncio.sleep(0.2)
