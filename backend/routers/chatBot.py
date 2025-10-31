# routers/chatBot.py
from fastapi import APIRouter, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
import time
import logging

# Import your langgraph functions and shared sessions
from Agentic_AI.langgraph import chat_step, start_session

logger = logging.getLogger(__name__)
router = APIRouter()


# --- Schemas ---
class StartResponse(BaseModel):
    session_id: str


class AnswerRequest(BaseModel):
    session_id: str
    message: str


class AnswerResponse(BaseModel):
    response: str
    real_profile: dict | None = None

class ProfileUpdateRequest(BaseModel):
    session_id: str
    profile: dict

# --- Start a new session ---
@router.post("/start", response_model=StartResponse)
async def start_chat() -> StartResponse:
    """
    Start a new chat session and return a unique session_id.
    """
    session_id = str(time.time())  # simple timestamp-based session id
    try:
        await run_in_threadpool(start_session, session_id)
    except Exception as exc:
        logger.exception("Failed to start session")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start session",
        ) from exc

    return StartResponse(session_id=session_id)


# --- Send a message and get a response ---
@router.post("/answer", response_model=AnswerResponse)
async def answer_question(payload: AnswerRequest) -> AnswerResponse:
    """
    Handle a user message for the given session_id and return the assistant's response.
    """
    if not payload.session_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing session_id")

    if not payload.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty")

    try:
        # Run chat_step in a threadpool to avoid blocking
        result = await run_in_threadpool(chat_step, payload.message, payload.session_id)

        if isinstance(result, dict):
            return AnswerResponse(
                response=result.get("response", ""),
                real_profile=result.get("real_profile", {})
            )
        else:
            # backward compatibility fallback
            return AnswerResponse(response=str(result), real_profile={})

    except Exception as exc:
        logger.exception("Error while generating chat response")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal error while processing request",
        ) from exc

# --- Update user profile ---
@router.post("/profile")
async def update_profile(payload: ProfileUpdateRequest):
    from Agentic_AI.langgraph import state  # using the same global session state you maintain

    if not payload.session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")

    # Merge new data into the real_profile
    existing_profile = state.get("real_profile", {})
    updated_profile = {**existing_profile, **payload.profile}
    state["real_profile"] = updated_profile

    print(state["real_profile"])  # For debugging
    return {"message": "Profile updated", "real_profile": updated_profile}
