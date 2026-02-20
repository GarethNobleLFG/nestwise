import datetime
from pydantic import BaseModel
from typing import Optional, Any, Dict

class PlanCreate(BaseModel):
    name: str
    description: Optional[str] = None
    data: Dict[str, Any]

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class PlanResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    data: Dict[str, Any]
    user_email: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "arbitrary_types_allowed": True,
        "from_attributes": True
    }
