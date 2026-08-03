import uuid
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.ai_chat import AIChat
from app.schemas.ai_chat import AIChatMessageCreate, AIChatMessageUpdate

class RepositoryAIChat(BaseRepository[AIChat, AIChatMessageCreate, AIChatMessageUpdate]):
    def get_session_history(self, db: Session, *, session_id: str, limit: int = 50) -> list[AIChat]:
        return db.query(AIChat).filter(AIChat.session_id == session_id).order_by(AIChat.created_at.asc()).limit(limit).all()

    def create_message(self, db: Session, *, user_id: uuid.UUID, obj_in: AIChatMessageCreate) -> AIChat:
        db_obj = AIChat(
            user_id=user_id,
            session_id=obj_in.session_id,
            role=obj_in.role,
            message_content=obj_in.message_content,
            context_used=obj_in.context_used
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

ai_chat_repo = RepositoryAIChat(AIChat)
