"""
FastAPI main application entry point — MHK-GPT v2 Agentic System.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Request/Response models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    message: str

# Create app
app = FastAPI(
    title="MHK-GPT v2 — Agentic AI Assistant",
    description="AI-powered agentic chatbot with RAG, Meeting Scheduling, and Job Search.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "message": "Backend is running!"}

@app.get("/")
async def root():
    return {"message": "Welcome to MHK-GPT Agentic Chatbot API"}

# Chat endpoint
@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Chat endpoint - process user messages and return responses.
    Currently returns a simple response. Can be enhanced with LLM integration.
    """
    user_message = request.message.strip()

    # Simple response logic (can be replaced with actual LLM/Agent logic)
    if not user_message:
        response = "Please provide a message."
    elif "hello" in user_message.lower():
        response = "Hello! I'm your Agentic Chatbot. How can I help you today?"
    elif "how are you" in user_message.lower():
        response = "I'm working great! Ready to assist you with any questions."
    elif "help" in user_message.lower():
        response = "I can help you with various tasks. Just ask me anything!"
    elif "what can you do" in user_message.lower():
        response = "I'm an agentic chatbot that can help with RAG (Retrieval Augmented Generation), meeting scheduling, and job search assistance."
    else:
        response = f"You said: '{user_message}'. This is a basic response. In production, this would be connected to an LLM or agent."

    return ChatResponse(
        response=response,
        message=user_message
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
