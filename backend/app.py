# app.py
from fastapi import FastAPI

app = FastAPI(title="Basic FastAPI App")

@app.get("/")
async def home():
    return {"message": "Hello, FastAPI is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
