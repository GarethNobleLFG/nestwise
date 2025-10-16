# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chatBot import router

app = FastAPI(title="Basic FastAPI App")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"message": "Hello, FastAPI is running!"}

app.include_router(router, prefix="/chatbot", tags=["chatBot"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)