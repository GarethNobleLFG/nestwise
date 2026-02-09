from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer


# import models
from models.user import User, Token, UserUpdate, Plan, PlanResponse


# import contollers
from models.user import User, Token
from controllers.userAuth import (
    authenticate_user,
    create_user,
    get_user_by_email,
    verify_token,
    create_access_token,
    update_user_profile,
    save_plan,
    get_user_plans,
    get_plan_by_id,
    update_plan,
    delete_plan
)

authRouter = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/userauth/signin")

@authRouter.post("/signup", status_code=status.HTTP_201_CREATED)
async def sign_up(user: User):
    return create_user(user.email, user.name, user.password)


@authRouter.post("/signin", response_model=Token)
async def sign_in(user: User):
    db_user = authenticate_user(user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={
        "sub": db_user["email"],
        "name": db_user["name"]
    })
    return {"access_token": access_token, "token_type": "bearer"}


@authRouter.get("/getUser", response_model=dict)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    email = verify_token(token)
    return get_user_by_email(email)


@authRouter.put("/updateUser", response_model=dict)
async def update_user(update: UserUpdate, token: str = Depends(oauth2_scheme)):
    current_email = verify_token(token)

    #Apply profile changes
    updated_user = update_user_profile(
        current_email=current_email,
        new_email=update.new_email,
        new_name=update.new_name
    )

    #ALWAYS return a fresh token if the email or name changed
    new_token = create_access_token(data={
        "sub": updated_user["email"],
        "name": updated_user["name"]
    })

    return {
        "message": "Profile updated successfully",
        "updated_email": updated_user["email"],
        "updated_name": updated_user["name"],
        "new_token": new_token
    }

@authRouter.post("/validateToken")
async def validate_token(token: str = Depends(oauth2_scheme)):
    """
    Validates a JWT token and returns user identity if valid.
    """
    email = verify_token(token)
    user = get_user_by_email(email)

    return {
        "valid": True,
        "email": user["email"],
        "name": user["name"],
        "user_id": user["user_id"]
    }


# Plan Management Endpoints

@authRouter.post("/plans", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
async def create_plan(plan: Plan, token: str = Depends(oauth2_scheme)):
    """
    Save a new plan for the authenticated user.
    
    Frontend should pass the data in the following format:
    {
        "name": "Plan Name",
        "description": "Optional plan description",
        "data": {
            "key1": "value1",
            "key2": 123,
            "nested": {
                "field": "any JSON structure"
            }
        }
    }
    
    Headers required:
    - Authorization: Bearer <jwt_token>
    """
    email = verify_token(token)
    return save_plan(
        email=email,
        plan_name=plan.name,
        plan_data=plan.data,
        description=plan.description
    )


@authRouter.get("/plans")
async def list_plans(token: str = Depends(oauth2_scheme)):
    """
    Retrieve all plans for the authenticated user.
    """
    email = verify_token(token)
    plans = get_user_plans(email)
    return {
        "plans": plans,
        "count": len(plans)
    }


@authRouter.get("/plans/{plan_id}")
async def retrieve_plan(plan_id: str, token: str = Depends(oauth2_scheme)):
    """
    Retrieve a specific plan by ID for the authenticated user.
    """
    email = verify_token(token)
    return get_plan_by_id(email, plan_id)


@authRouter.put("/plans/{plan_id}")
async def modify_plan(plan_id: str, plan: Plan, token: str = Depends(oauth2_scheme)):
    """
    Update a plan for the authenticated user.
    
    Frontend should pass the data in the following format:
    {
        "name": "Updated Plan Name",
        "description": "Updated plan description",
        "data": {
            "key1": "updated_value1",
            "key2": 456,
            "nested": {
                "field": "updated JSON structure"
            }
        }
    }
    
    URL parameter:
    - plan_id: The MongoDB ObjectId of the plan to update
    
    Headers required:
    - Authorization: Bearer <jwt_token>
    """
    email = verify_token(token)
    return update_plan(
        email=email,
        plan_id=plan_id,
        plan_name=plan.name,
        plan_data=plan.data,
        description=plan.description
    )


@authRouter.delete("/plans/{plan_id}")
async def remove_plan(plan_id: str, token: str = Depends(oauth2_scheme)):
    """
    Delete a plan for the authenticated user.
    """
    email = verify_token(token)
    return delete_plan(email, plan_id)
