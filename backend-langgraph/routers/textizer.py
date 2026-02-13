from fastapi import APIRouter
from models.textizer import TextizerRequest, PlanTextizerRequest
from services.textizer import textizer_service, textizer_for_plan_service

textizer_router = APIRouter()

@textizer_router.post("/")
async def format_data(request: TextizerRequest):
    formatted_data = textizer_service(request.profileData, request.lastChatbotResponse, request.formattedContext)
    return formatted_data

@textizer_router.post("/plan")  
async def format_plan(request: PlanTextizerRequest):
    formatted_markdown = textizer_for_plan_service(request.planData)
    return formatted_markdown