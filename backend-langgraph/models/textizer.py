from pydantic import BaseModel
from typing import Dict, Any

class TextizerRequest(BaseModel):
    profileData: Dict[str, Any]
    lastChatbotResponse: str = ""
    formattedContext: Dict[str, Any] = {}

class PlanTextizerRequest(BaseModel):
    planData: str