from fastapi import APIRouter, Depends, HTTPException, status
from Agentic_AI.langgraph import chat_step
from fastapi.concurrency import run_in_threadpool

router = APIRouter()


@router.get("/")
def get_message():
    return chat_step(None, [])


