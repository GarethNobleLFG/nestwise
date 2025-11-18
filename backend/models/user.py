# models/user.py
from pydantic import BaseModel, EmailStr



# Pydantic models
class User(BaseModel):
    email: EmailStr
    password: str
    name: str

class Token(BaseModel):
    access_token: str
    token_type: str