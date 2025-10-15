from fastapi import APIRouter, Depends, HTTPException, status
from Agentic_AI.langgraph import chat_step,start_session, SESSION_STATE, questions
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from typing import List, Optional
import time



router = APIRouter()


"""
@router.get("/")
def get_message():
    return chat_step(None, [])

"""
# --- Request / Response Schemas ---
class StartResponse(BaseModel):
    session_id: str
    question: str
    history: List[List[Optional[str]]] = []

class AnswerRequest(BaseModel):
    session_id: str
    message: str
    history: List[List[Optional[str]]]

class AnswerResponse(BaseModel):
    response: str
    history: List[List[Optional[str]]]


# --- Start new session ---
@router.post("/start", response_model=StartResponse)
def start_chat():
    session_id = str(time.time())  # simple unique session id
    start_session(session_id)
    first_q = questions[0]
    return StartResponse(session_id=session_id, question=first_q, history=[])


# --- Submit answer ---
@router.post("/answer", response_model=AnswerResponse)
def answer_question(payload: AnswerRequest):
    if payload.session_id not in SESSION_STATE:
        raise HTTPException(status_code=400, detail="Invalid or expired session_id")

    response_text, updated_history = chat_step(payload.message, payload.history, payload.session_id)
    return AnswerResponse(response=response_text, history=updated_history)
