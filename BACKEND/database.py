from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["student_registration"]

student_collection = db["students"]