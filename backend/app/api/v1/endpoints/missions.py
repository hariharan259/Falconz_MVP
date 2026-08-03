from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.mission import MissionCreate, MissionResponse, MissionUpdate
from app.repositories.mission import mission_repo

router = APIRouter()

@router.get("/", response_model=List[MissionResponse])
def get_user_missions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Retrieve all missions planned by the current user."""
    return mission_repo.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
def create_mission(
    *,
    db: Session = Depends(deps.get_db),
    mission_in: MissionCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """Create and save a new autonomous mission."""
    return mission_repo.create_mission(db, obj_in=mission_in, user_id=current_user.id)
