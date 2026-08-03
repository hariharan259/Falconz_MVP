import uuid
from datetime import datetime
from typing import Any, List
from pydantic import BaseModel
from app.models.ai_chat import ChatRole

class AIChatMessageBase(BaseModel):
    message_content: str

class AIChatMessageCreate(AIChatMessageBase):
    session_id: str
    role: ChatRole
    context_used: dict[str, Any] = {}

class AIChatMessageUpdate(BaseModel):
    pass

class AIChatMessageResponse(AIChatMessageBase):
    id: uuid.UUID
    session_id: str
    role: ChatRole
    context_used: dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}

class AIQueryRequest(BaseModel):
    session_id: str
    message: str

class AIQueryResponse(BaseModel):
    reply: str
    source_citations: List[dict[str, str]]
