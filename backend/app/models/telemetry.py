import uuid
from datetime import datetime
from sqlalchemy import Float, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.base import Base

class Telemetry(Base):
    """
    Time-series table. In Postgres this will be converted to a TimescaleDB hypertable
    based on the 'time' column.
    """
    __tablename__ = "telemetry"

    # For TimescaleDB, time must be part of the primary key or unique index 
    # if we want to use typical hypertable partitioning. We will just define it.
    time: Mapped[datetime] = mapped_column(primary_key=True, default=func.now())
    drone_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    mission_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)

    lat: Mapped[float] = mapped_column(Float)
    lon: Mapped[float] = mapped_column(Float)
    alt_relative: Mapped[float] = mapped_column(Float)
    
    battery_volts: Mapped[float] = mapped_column(Float)
    battery_percent: Mapped[int] = mapped_column(Integer)
    
    imu_accel_x: Mapped[float] = mapped_column(Float)
    imu_accel_y: Mapped[float] = mapped_column(Float)
    imu_accel_z: Mapped[float] = mapped_column(Float)
    
    gps_satellites_visible: Mapped[int] = mapped_column(Integer)
