import enum
import uuid
from typing import Any, Optional
from datetime import datetime
from sqlalchemy import String, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class MissionStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    ABORTED = "ABORTED"

class Mission(Base):
    __tablename__ = "missions"

    drone_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("drones.id"))
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    status: Mapped[MissionStatus] = mapped_column(Enum(MissionStatus), default=MissionStatus.PLANNED)
    waypoints: Mapped[dict[str, Any]] = mapped_column(JSONB, default=list)
    scheduled_start: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
