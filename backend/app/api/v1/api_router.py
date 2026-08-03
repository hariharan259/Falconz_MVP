from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, users, telemetry, ai, vision, missions

api_router = APIRouter()
api_router.include_router(health.router, tags=["System"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["Telemetry"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Assistant"])
api_router.include_router(vision.router, prefix="/vision", tags=["Vision Module"])
api_router.include_router(missions.router, prefix="/missions", tags=["Mission Planner"])
