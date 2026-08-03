import uuid
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.mission import Mission
from app.schemas.mission import MissionCreate, MissionUpdate

class RepositoryMission(BaseRepository[Mission, MissionCreate, MissionUpdate]):
    def get_by_user(self, db: Session, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[Mission]:
        return db.query(Mission).filter(Mission.created_by == user_id).order_by(Mission.created_at.desc()).offset(skip).limit(limit).all()
        
    def create_mission(self, db: Session, *, obj_in: MissionCreate, user_id: uuid.UUID) -> Mission:
        db_obj = Mission(
            drone_id=obj_in.drone_id,
            created_by=user_id,
            waypoints=[wp.model_dump() for wp in obj_in.waypoints],
            scheduled_start=obj_in.scheduled_start
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

mission_repo = RepositoryMission(Mission)
