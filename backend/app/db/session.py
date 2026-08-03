from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Example connection string: postgresql://user:password@localhost/falconz
engine = create_engine(
    settings.POSTGRES_SERVER or "sqlite:///./falconz.db", # Fallback to sqlite for dev if unconfigured
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency to provide a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
