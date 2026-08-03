import logging
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.drone import Drone, DroneStatus
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    # Check if user exists
    user = db.query(User).filter(User.email == "operator@falconz.com").first()
    if not user:
        user = User(
            email="operator@falconz.com",
            hashed_password=get_password_hash("admin123"),
            full_name="FalconZ Operator",
            is_active=True,
            is_superuser=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info("Created default operator user.")
    
    # Check if dummy drone exists
    drone = db.query(Drone).filter(Drone.name == "Falcon-Alpha").first()
    if not drone:
        drone = Drone(
            name="Falcon-Alpha",
            model="Quad-X",
            status=DroneStatus.IDLE
        )
        db.add(drone)
        db.commit()
        logger.info("Created default test drone.")

def main() -> None:
    logger.info("Creating initial data")
    db = SessionLocal()
    try:
        init_db(db)
    except Exception as e:
        logger.error(f"Error seeding data: {e}")
    finally:
        db.close()
    logger.info("Initial data created")

if __name__ == "__main__":
    main()
