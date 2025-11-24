# controllers/userAuth.py
from jose import JWTError, jwt
from datetime import datetime, timedelta
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import HTTPException
import app




# Password hashing using Argon2
pwd_hasher = PasswordHasher()




# JWT configuration
SECRET_KEY = "your_secret_key"  # Replace with a secure key in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 5




# ------------------FUNCTIONS------------------------
def get_password_hash(password: str) -> str:
    """Hash a password using Argon2"""
    return pwd_hasher.hash(password)





def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        return pwd_hasher.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False
    




def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)





def authenticate_user(email: str, password: str):
    """Authenticate a user with email and password"""
    user = app.users_collection.find_one({"email": email})
    if user and verify_password(password, user["hashed_password"]):
        return user
    return None





def create_user(email: str, name: str, password: str):
    """Create a new user in the database"""
    # Check if user already exists
    if app.users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user data
    hashed_password = get_password_hash(password)
    user_data = {
        "email": email,
        "name": name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert user into database
    result = app.users_collection.insert_one(user_data)
    return {
        "message": "User created successfully", 
        "user_id": str(result.inserted_id),
        "email": email,
        "name": name
    }





def get_user_by_email(email: str):
    """Get user information by email"""
    user = app.users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "email": user["email"],
        "name": user.get("name", ""),
        "user_id": str(user["_id"])
    }






def verify_token(token: str):
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    





def update_user_profile(current_email: str, new_email: str = None, new_name: str = None):
        update_fields = {}

        # If the current and new email are the same, just skip this section entirely
        if new_email and new_email != current_email:
            # Check if the new email is already taken
            existing_user = app.users_collection.find_one({"email": new_email})
            if not existing_user:
              update_fields["email"] = new_email
            else:
                raise HTTPException(status_code=400, detail="Email already in use.")
                

        if new_name:
            update_fields["name"] = new_name
    
        if not update_fields:
            raise HTTPException(status_code=400, detail="No update fields provided")
        
        update_fields["updated_at"] = datetime.utcnow()


        result = app.users_collection.update_one(
            {"email": current_email},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Profile updated successfully"}