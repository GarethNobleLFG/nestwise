from datetime import datetime
from bson import ObjectId
from utils.mongo import serialize_plan
from utils.database import users_collection, plans_collection

# # DB INJECTION (set from app.py)#
# users_collection = None
# plans_collection = None

def create_plan(email: str, name: str, description: str, data: dict, profileData: dict):
    import re
    base_name = name
    regex = re.compile(
        rf'^{re.escape(base_name)}( \(version (\d+)\))?$',
        re.IGNORECASE
    )
    existing_plans = list(
        plans_collection.find({"user_email": email, "name": regex}, {"name": 1})
    )
    # If no plan exists, use base name
    if not existing_plans:
        final_name = base_name
    else:
        version_numbers = []

        for plan in existing_plans:
            plan_name = plan["name"]

            match = re.match(
                rf'^{re.escape(base_name)} \(version (\d+)\)$',
                plan_name,
                re.IGNORECASE
            )

            if match:
                version_numbers.append(int(match.group(1)))
            elif plan_name.lower() == base_name.lower():
                version_numbers.append(1)

        new_version = max(version_numbers) + 1 if version_numbers else 2
        final_name = f"{base_name} (version {new_version})"

    plan = {
        "user_email": email,
        "name": final_name,
        "description": description,
        "data": data,
        "profileData": profileData,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    plans_collection.insert_one(plan)

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