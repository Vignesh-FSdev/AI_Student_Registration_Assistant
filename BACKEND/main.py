from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId
from ollama import Client

from database import student_collection

# ---------------------------------------
# FastAPI App
# ---------------------------------------

app = FastAPI()

print("========== MAIN.PY STARTED ==========")

# ---------------------------------------
# Ollama Client
# ---------------------------------------

client = Client(host="http://127.0.0.1:11434")

# ---------------------------------------
# CORS
# ---------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------
# Models
# ---------------------------------------

class Student(BaseModel):
    name: str
    email: str
    course: str


class ChatRequest(BaseModel):
    message: str


# ---------------------------------------
# Home API
# ---------------------------------------

@app.get("/")
def home():

    return {
        "message": "Backend Running Successfully"
    }


# ---------------------------------------
# Register Student
# ---------------------------------------

@app.post("/register")
def register_student(student: Student):

    student_collection.insert_one(
        {
            "name": student.name,
            "email": student.email,
            "course": student.course
        }
    )

    return {
        "message": "Student Registered Successfully"
    }


# ---------------------------------------
# Get Students
# ---------------------------------------

@app.get("/students")
def get_students():

    students = []

    for student in student_collection.find():

        students.append(
            {
                "id": str(student["_id"]),
                "name": student["name"],
                "email": student["email"],
                "course": student["course"]
            }
        )

    return students


# ---------------------------------------
# Update Student
# ---------------------------------------

@app.put("/students/{student_id}")
def update_student(student_id: str, student: Student):

    student_collection.update_one(
        {"_id": ObjectId(student_id)},
        {
            "$set": {
                "name": student.name,
                "email": student.email,
                "course": student.course
            }
        }
    )

    return {
        "message": "Student Updated Successfully"
    }


# ---------------------------------------
# Delete Student
# ---------------------------------------

@app.delete("/students/{student_id}")
def delete_student(student_id: str):

    student_collection.delete_one(
        {"_id": ObjectId(student_id)}
    )

    return {
        "message": "Student Deleted Successfully"
    }


# ---------------------------------------
# AI Chat API
# ---------------------------------------

@app.post("/ai-chat")
def ai_chat(chat: ChatRequest):

    print("\n========== AI API CALLED ==========")
    print("User Message:", chat.message)

    response = client.chat(
        model="llama3.2:1b",
        messages=[
            {
                "role": "user",
                "content": chat.message
            }
        ]
    )

    print("========== AI RESPONSE ==========")
    print(response)

    return {
        "reply": response["message"]["content"]
    }