from pymongo import MongoClient

client = MongoClient("mongodb+srv://vignesh:f8Z9DRAw12EbeoN9@cluster0.rn5lrgh.mongodb.net/?appName=Cluster0")

db = client["student_registration"]

student_collection = db["students"]