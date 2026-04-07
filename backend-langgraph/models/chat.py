# models/chat.py
from pydantic import BaseModel
from typing import Optional, Dict, Any

# Pydantic models
class StartRequest(BaseModel):
    plan_id: Optional[str] = None

class StartResponse(BaseModel):
    session_id: str
    plan: Optional[Dict[str, Any]] = None

class AnswerRequest(BaseModel):
    session_id: str
    message: str

class AnswerResponse(BaseModel):
    response: str
    real_profile: dict | None = None
    conversation_title: str | None = None
    from_planner: bool = False

class ProfileUpdateRequest(BaseModel):
    session_id: str
    profile: dict