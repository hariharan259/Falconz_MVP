import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.VIEWER

class UserUpdate(UserBase):
    password: Optional[str] = None
    role: Optional[UserRole] = None

class UserInDBBase(UserBase):
    id: uuid.UUID
    role: UserRole
    created_at: datetime
    last_login: Optional[str] = None

    model_config = {"from_attributes": True}

class UserResponse(UserInDBBase):
    pass
