from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 1. Import Routers
from routers import simulate, ai, code

app = FastAPI(title="QFlux Quantum Backend Engine")

# 2. CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For simplicity in local hackathon
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Mount Backend Routers
app.include_router(simulate.router)
app.include_router(ai.router)
app.include_router(code.router)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "QFlux API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
