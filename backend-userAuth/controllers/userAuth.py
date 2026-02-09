from jose import JWTError, jwt
from datetime import datetime, timedelta
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import HTTPException
from bson import ObjectId
import os

# DB INJECTION (set from app.py)#
users_collection = None
plans_collection = None


pwd_hasher = PasswordHasher()

SECRET_KEY = os.getenv("AUTH_JWT_SECRET")
ALGORITHM = os.getenv("AUTH_JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("AUTH_JWT_EXPIRE_MINUTES"))


def get_password_hash(password: str) -> str:
    return pwd_hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_hasher.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def authenticate_user(email: str, password: str):
    user = users_collection.find_one({"email": email})
    if user and verify_password(password, user["hashed_password"]):
        return user
    return None


def create_user(email: str, name: str, password: str):
    if users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(password)
    user_data = {
        "email": email,
        "name": name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = users_collection.insert_one(user_data)

    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id),
        "email": email,
        "name": name
    }


def get_user_by_email(email: str):
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": user["email"],
        "name": user.get("name", ""),
        "user_id": str(user["_id"])
    }


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def update_user_profile(current_email: str, new_email: str = None, new_name: str = None):
    """
    Update user profile fields (email, name).
    """

    user = users_collection.find_one({"email": current_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = {"updated_at": datetime.utcnow()}

    # Only update what was provided
    if new_email and new_email != current_email:
        # Check existing email
        if users_collection.find_one({"email": new_email}):
            raise HTTPException(status_code=400, detail="Email already in use")
        update_data["email"] = new_email
    
    if new_name:
        update_data["name"] = new_name

    # No update fields provided
    if len(update_data.keys()) == 1:  # only updated_at
        raise HTTPException(status_code=400, detail="Nothing to update")

    users_collection.update_one(
        {"email": current_email},
        {"$set": update_data}
    )

    # Return updated values
    return users_collection.find_one({"email": update_data.get("email", current_email)})


def save_plan(email: str, plan_name: str, plan_data: dict, description: str = None):
    """
    Save a plan for a user.
    """
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    plan_document = {
        "user_id": user["_id"],
        "user_email": email,
        "plan_name": plan_name,
        "description": description,
        "plan_data": plan_data,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = plans_collection.insert_one(plan_document)
    
    return {
        "message": "Plan saved successfully",
        "plan_id": str(result.inserted_id),
        "plan_name": plan_name,
        "user_id": str(user["_id"])
    }


def get_user_plans(email: str):
    """
    Retrieve all plans for a user.
    """
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    plans = list(plans_collection.find({"user_id": user["_id"]}))
    
    # Convert ObjectIds to strings for JSON serialization
    for plan in plans:
        plan["_id"] = str(plan["_id"])
        plan["user_id"] = str(plan["user_id"])
    
    return plans


def get_plan_by_id(email: str, plan_id: str):
    """
    Retrieve a specific plan by ID for a user.
    """
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        plan = plans_collection.find_one({
            "_id": ObjectId(plan_id),
            "user_id": user["_id"]
        })
    except:
        raise HTTPException(status_code=400, detail="Invalid plan ID")
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    plan["_id"] = str(plan["_id"])
    plan["user_id"] = str(plan["user_id"])
    
    return plan


def update_plan(email: str, plan_id: str, plan_name: str = None, plan_data: dict = None, description: str = None):
    """
    Update a plan for a user.
    """
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        plan_obj_id = ObjectId(plan_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid plan ID")
    
    plan = plans_collection.find_one({
        "_id": plan_obj_id,
        "user_id": user["_id"]
    })
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    update_data = {"updated_at": datetime.utcnow()}
    
    if plan_name:
        update_data["plan_name"] = plan_name
    if plan_data:
        update_data["plan_data"] = plan_data
    if description is not None:
        update_data["description"] = description
    
    plans_collection.update_one(
        {"_id": plan_obj_id},
        {"$set": update_data}
    )
    
    updated_plan = plans_collection.find_one({"_id": plan_obj_id})
    updated_plan["_id"] = str(updated_plan["_id"])
    updated_plan["user_id"] = str(updated_plan["user_id"])
    
    return {
        "message": "Plan updated successfully",
        "plan_id": str(updated_plan["_id"]),
        "plan_name": updated_plan["plan_name"]
    }


def delete_plan(email: str, plan_id: str):
    """
    Delete a plan for a user.
    """
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        plan_obj_id = ObjectId(plan_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid plan ID")
    
    result = plans_collection.delete_one({
        "_id": plan_obj_id,
        "user_id": user["_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return {"message": "Plan deleted successfully"}
