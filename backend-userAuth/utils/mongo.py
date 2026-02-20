# utils/mongo.py
from bson import ObjectId

def serialize_plan(plan):
    plan["id"] = str(plan["_id"])
    del plan["_id"]
    return plan