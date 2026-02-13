# models/chat.py
from pydantic import BaseModel
from typing import Dict, Any

# Pydantic models
class StartResponse(BaseModel):
    session_id: str

class AnswerRequest(BaseModel):
    session_id: str
    message: str

class AnswerResponse(BaseModel):
    response: str
    real_profile: dict | None = None
    conversation_title: str | None = None

class ProfileUpdateRequest(BaseModel):
    session_id: str
    profile: dict

class TextizerRequest(BaseModel):
    profileData: Dict[str, Any]
    lastChatbotResponse: str = ""
    formattedContext: Dict[str, Any] = {}

class PlanTextizerRequest(BaseModel):
    planData: str