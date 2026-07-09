@app.post("/ai-chat")
def ai_chat(chat: ChatRequest):

    return {
        "reply": "Hello from FastAPI"
    }