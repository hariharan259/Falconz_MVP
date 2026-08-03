import enum
import uuid
from typing import Optional
from sqlalchemy import String, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from sqlalchemy.dialects.postgresql import UUID

class DroneStatus(str, enum.Enum):
    OFFLINE = "OFFLINE"
    IDLE = "IDLE"
    IN_FLIGHT = "IN_FLIGHT"
    MAINTENANCE = "MAINTENANCE"

class Drone(Base):
    __tablename__ = "drones"

    name: Mapped[str] = mapped_column(String, index=True)
    hardware_type: Mapped[str] = mapped_column(String)
    firmware_version: Mapped[str] = mapped_column(String)
    status: Mapped[DroneStatus] = mapped_column(Enum(DroneStatus), default=DroneStatus.OFFLINE)
    inventory_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
