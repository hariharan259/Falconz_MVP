import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.base import Base

class FlightLog(Base):
    """
    Aggregated session events table, intended as a TimescaleDB hypertable.
    """
    __tablename__ = "flight_logs"

    time: Mapped[datetime] = mapped_column(primary_key=True, default=func.now())
    drone_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)

    flight_mode: Mapped[str] = mapped_column(String)
    error_code: Mapped[int] = mapped_column(Integer, default=0)
    distance_traveled_m: Mapped[float] = mapped_column(Float, default=0.0)
    max_altitude_m: Mapped[float] = mapped_column(Float, default=0.0)
