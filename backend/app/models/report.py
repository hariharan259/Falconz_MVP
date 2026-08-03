import enum
import uuid
from sqlalchemy import String, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class ReportType(str, enum.Enum):
    FLIGHT_SUMMARY = "FLIGHT_SUMMARY"
    MAINTENANCE_LOG = "MAINTENANCE_LOG"
    COMPLIANCE = "COMPLIANCE"

class Report(Base):
    __tablename__ = "reports"

    report_type: Mapped[ReportType] = mapped_column(Enum(ReportType))
    generated_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    reference_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True))
    file_url: Mapped[str] = mapped_column(String)
