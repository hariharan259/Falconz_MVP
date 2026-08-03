import uuid
from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel
from app.models.mission import MissionStatus

class Waypoint(BaseModel):
    sequence_id: int
    command: str
    coordinates: dict[str, float] # {lat, lon, alt}
    acceptance_radius: Optional[float] = 2.0
    hold_time_sec: Optional[int] = 0

class MissionBase(BaseModel):
    waypoints: List[Waypoint]
    scheduled_start: Optional[datetime] = None

class MissionCreate(MissionBase):
    drone_id: uuid.UUID

class MissionUpdate(BaseModel):
    status: Optional[MissionStatus] = None
    waypoints: Optional[List[Waypoint]] = None
    completed_at: Optional[datetime] = None

class MissionResponse(MissionBase):
    id: uuid.UUID
    drone_id: uuid.UUID
    created_by: uuid.UUID
    status: MissionStatus
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
