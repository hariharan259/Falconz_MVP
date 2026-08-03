from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.ai_chat import ChatRole
from app.schemas.ai_chat import AIQueryRequest, AIQueryResponse, AIChatMessageCreate, AIChatMessageResponse
from app.repositories.ai_chat import ai_chat_repo
from app.services.ai_agent import ai_agent

router = APIRouter()

@router.get("/history/{session_id}", response_model=list[AIChatMessageResponse])
def get_chat_history(
    session_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Retrieve chat history for a session."""
    return ai_chat_repo.get_session_history(db, session_id=session_id)

@router.post("/query", response_model=AIQueryResponse)
async def query_ai_assistant(
    request: AIQueryRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Send a message to the RAG AI Assistant.
    """
    # 1. Save user message to DB
    user_msg_in = AIChatMessageCreate(
        session_id=request.session_id,
        role=ChatRole.USER,
        message_content=request.message
    )
    ai_chat_repo.create_message(db, user_id=current_user.id, obj_in=user_msg_in)

    # 2. Run RAG Pipeline
    context = await ai_agent.retrieve_context(request.message)
    reply, citations = await ai_agent.generate_response(request.message, context)

    # 3. Save AI response to DB
    ai_msg_in = AIChatMessageCreate(
        session_id=request.session_id,
        role=ChatRole.ASSISTANT,
        message_content=reply,
        context_used={"citations": citations}
    )
    ai_chat_repo.create_message(db, user_id=current_user.id, obj_in=ai_msg_in)

    return AIQueryResponse(reply=reply, source_citations=citations)
