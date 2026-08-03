import enum
import uuid
from typing import Any
from sqlalchemy import String, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class ChatRole(str, enum.Enum):
    USER = "USER"
    ASSISTANT = "ASSISTANT"
    SYSTEM = "SYSTEM"

class AIChat(Base):
    __tablename__ = "ai_chats"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    session_id: Mapped[str] = mapped_column(String, index=True)
    role: Mapped[ChatRole] = mapped_column(Enum(ChatRole))
    message_content: Mapped[str] = mapped_column(Text)
    context_used: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict)
