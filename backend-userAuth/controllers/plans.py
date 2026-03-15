from datetime import datetime
from bson import ObjectId
from utils.mongo import serialize_plan
from utils.database import users_collection, plans_collection

# # DB INJECTION (set from app.py)#
# users_collection = None
# plans_collection = None

def create_plan(email: str, name: str, description: str, data: dict, profileData: dict):
    # Find all plans with the same base name for this user
    import re
    base_name = name
    regex = re.compile(rf'^{re.escape(base_name)}( \(version (\d+)\))?$', re.IGNORECASE)
    existing_plans = list(
        plans_collection.find({"user_email": email, "name": regex}, {"name": 1})
    )
    if existing_plans:
        version_numbers = [1]
        for plan in existing_plans:
            match = re.match(
                rf'^{re.escape(base_name)} \(version (\d+)\)$',
                plan["name"],
                re.IGNORECASE
            )
            if match:
                version_numbers.append(int(match.group(1)))
    new_version = max(version_numbers) + 1
    print("current versions:", version_numbers, "new version:", new_version)

    name = f"{base_name} (version {new_version})"

    plan = {
        "user_email": email,
        "name": name,
        "description": description,
        "data": data,
        "profileData": profileData,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = plans_collection.insert_one(plan)
    print(f"Inseted plan: {plan}")
    return serialize_plan(plan)

def get_user_plans(email: str):
    plans = plans_collection.find(
        {"user_email": email},
        {"name": 1}  # Only return name (and _id automatically)
    ).sort("created_at", -1)

    return [
        {
            "id": str(plan["_id"]),
            "name": plan["name"]
        }
        for plan in plans
    ]

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