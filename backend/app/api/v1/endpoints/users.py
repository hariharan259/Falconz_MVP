from fastapi import APIRouter, Depends
from typing import Any
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User, UserRole
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user profile based on JWT token.
    """
    return current_user

@router.get("/all", response_model=list[UserResponse])
def read_all_users(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.RequireRole([UserRole.ADMIN])),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get all users. Restricted to ADMIN role.
    """
    from app.repositories.user import user_repo
    return user_repo.get_multi(db, skip=skip, limit=limit)
