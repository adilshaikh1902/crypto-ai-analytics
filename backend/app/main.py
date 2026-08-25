from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import auth, crypto # Add crypto import

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crypto AI Analytics API")

origins = [
    "http://localhost:5173",  # Your React dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers (including Authorization for JWT)
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(crypto.router, prefix="/crypto", tags=["Market Data"])

@app.get("/")
def read_root():
    return {"status": "System Online", "module": "MCA Project"}
