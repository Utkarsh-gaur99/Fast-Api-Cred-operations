from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Name cannot be empty")
    email: EmailStr = Field(..., description="Must be a valid email address")
    age: int = Field(..., gt=0, description="Age must be greater than 0")

class UserUpdate(BaseModel):
    name: str = Field(..., min_length=1, description="Name cannot be empty")
    email: EmailStr = Field(..., description="Must be a valid email address")
    age: int = Field(..., gt=0, description="Age must be greater than 0")

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: int
