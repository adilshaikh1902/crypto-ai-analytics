from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core import security
from pydantic import BaseModel, EmailStr

router = APIRouter()

# --- SCHEMAS (Pydantic Models) ---

class UserCreate(BaseModel):
    """Schema for User Registration"""
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    """Schema for User Login - Only requires Email and Password"""
    email: EmailStr
    password: str

# --- ROUTES ---

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400, 
            detail="A user with this email is already registered."
        )
    
    # 2. Hash the password for security
    hashed_pwd = security.get_password_hash(user.password)
    
    # 3. Create and save the new user
    new_user = User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "username": new_user.username}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    """
    Validates user credentials and returns a JWT Access Token.
    Note: Now correctly uses the UserLogin schema to avoid 422 errors.
    """
    # 1. Look for user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    
    # 2. Verify existence and password match
    if not db_user or not security.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Generate the JWT token
    access_token = security.create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": db_user.username
    }