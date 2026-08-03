import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class ItemType(str, enum.Enum):
    DRONE = "DRONE"
    BATTERY = "BATTERY"
    PROPELLER = "PROPELLER"
    MOTOR = "MOTOR"
    SENSOR = "SENSOR"

class ItemCondition(str, enum.Enum):
    NEW = "NEW"
    GOOD = "GOOD"
    FAIR = "FAIR"
    RETIRED = "RETIRED"

class Inventory(Base):
    __tablename__ = "inventory"

    item_type: Mapped[ItemType] = mapped_column(Enum(ItemType))
    serial_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    condition: Mapped[ItemCondition] = mapped_column(Enum(ItemCondition), default=ItemCondition.NEW)
    cycle_count: Mapped[int] = mapped_column(Integer, default=0)
    last_maintenance_date: Mapped[Optional[datetime]] = mapped_column(nullable=True)
