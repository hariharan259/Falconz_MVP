from app.db.base import Base
from app.models.user import User
from app.models.drone import Drone
from app.models.mission import Mission
from app.models.alert import Alert
from app.models.ai_chat import AIChat
from app.models.report import Report
from app.models.inventory import Inventory
from app.models.telemetry import Telemetry
from app.models.flight_log import FlightLog

# This ensures all models are loaded for Alembic to autogenerate migrations.
