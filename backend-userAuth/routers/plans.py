
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from typing import List

from models.plans import PlanCreate, PlanUpdate, PlanResponse, PlanListItem
from controllers.plans import (
    create_plan,
    get_user_plans,
    get_plan,
    update_plan,
    delete_plan
)

from controllers.userAuth import (
    verify_token
)

planRouter = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/userauth/signin")

# Plan Management Endpoints
@planRouter.post("/", response_model=PlanResponse)
async def create_new_plan(plan: PlanCreate, token: str = Depends(oauth2_scheme)):
    email = verify_token(token)
    return create_plan(email, plan.name, plan.description, plan.data)

@planRouter.get("/", response_model=List[PlanListItem])
async def list_plans(token: str = Depends(oauth2_scheme)):
    email = verify_token(token)
    return get_user_plans(email)

@planRouter.get("/{plan_id}", response_model=PlanResponse)
async def get_single_plan(plan_id: str, token: str = Depends(oauth2_scheme)):
    email = verify_token(token)
    plan = get_plan(email, plan_id)
    if not plan:
        raise HTTPException(404, "Plan not found")
    return plan

@planRouter.put("/{plan_id}", response_model=PlanResponse)
async def update_existing_plan(plan_id: str, updates: PlanUpdate, token: str = Depends(oauth2_scheme)):
    email = verify_token(token)
    updated = update_plan(email, plan_id, updates.dict(exclude_none=True))
    if not updated:
        raise HTTPException(404, "Plan not found")
    return updated

@planRouter.delete("/{plan_id}")
async def delete_existing_plan(plan_id: str, token: str = Depends(oauth2_scheme)):
    email = verify_token(token)
    return delete_plan(email, plan_id)