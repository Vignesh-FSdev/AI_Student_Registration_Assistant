from pymongo import MongoClient

client = MongoClient("mongodb+srv://vignesh:<db_password>@cluster0.rn5lrgh.mongodb.net/?appName=Cluster0")

db = client["student_registration"]

student_collection = db["students"]