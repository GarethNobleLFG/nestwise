# routers/userAuth.py
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer


# import models
from models.user import User, Token


# import contollers
from controllers.userAuth import (
    authenticate_user,
    create_user,
    get_user_by_email,
    verify_token,
    create_access_token
)




authRouter = APIRouter()


# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/userauth/signin")



# -------------------- Routes -----------------------------------
@authRouter.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def sign_up(user: User):
    """Register a new user"""
    return create_user(user.email, user.name, user.password)




@authRouter.post("/signin", response_model=Token)
async def sign_in(user: User):
    """Authenticate user and return access token"""
    db_user = authenticate_user(user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": db_user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}




@authRouter.get("/getUser", response_model=dict)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    """Get current user information from token"""
    email = verify_token(token)
    return get_user_by_email(email)