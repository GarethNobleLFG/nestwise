from datetime import datetime
from bson import ObjectId
from utils.mongo import serialize_plan
from utils.database import users_collection, plans_collection

# # DB INJECTION (set from app.py)#
# users_collection = None
# plans_collection = None

def create_plan(email: str, name: str, description: str, data: dict):
    plan = {
        "user_email": email,
        "name": name,
        "description": description,
        "data": data,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = plans_collection.insert_one(plan)
    plan["_id"] = result.inserted_id
    return serialize_plan(plan)

def get_user_plans(email: str):
    plans = plans_collection.find({"user_email": email}).sort("created_at", -1)
    return [serialize_plan(p) for p in plans]

def get_plan(email: str, plan_id: str):
    plan = plans_collection.find_one({"_id": ObjectId(plan_id), "user_email": email})
    if not plan:
        return None
    return serialize_plan(plan)

def update_plan(email: str, plan_id: str, updates: dict):
    updates["updated_at"] = datetime.utcnow()
    plans_collection.update_one(
        {"_id": ObjectId(plan_id), "user_email": email},
        {"$set": updates}
    )
    return get_plan(email, plan_id)

def delete_plan(email: str, plan_id: str):
    plans_collection.delete_one({"_id": ObjectId(plan_id), "user_email": email})
    return {"message": "Plan deleted"}