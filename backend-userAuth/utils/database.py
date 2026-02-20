# utils/database.py
from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongo:27017")
DB_NAME = os.getenv("MONGO_DB_AUTH", "nestwise_auth")

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

users_collection = db["users"]
plans_collection = db["plans"]