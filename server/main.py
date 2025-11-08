# server/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routers.energy import router as energy_router

app = FastAPI(title="EquiGridAI API")

# Allow your frontend (localhost:5173) to access backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev; later restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your energy router
app.include_router(energy_router)

@app.get("/")
def read_root():
    return {"message": "EquiGridAI backend is running!"}
