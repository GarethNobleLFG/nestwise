# models/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional, Any, Dict


# Pydantic models
class User(BaseModel):
    email: EmailStr
    password: str
    name: str

class Token(BaseModel):
    access_token: str
    token_type: str



class UserUpdate(BaseModel):
    new_email: EmailStr | None
    new_name: str | None


class Plan(BaseModel):
    name: str
    description: Optional[str] = None
    data: Dict[str, Any]  # Flexible JSON object for plan details

    class Config:
        extra = "allow"  # Allow additional fields in the JSON


class PlanResponse(BaseModel):
    message: str
    plan_id: str
    plan_name: str
    user_id: str
