from fastapi import APIRouter, Depends, HTTPException, status


router = APIRouter()


@router.get("/")
def get_message():
    return "I love you"