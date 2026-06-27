from fastapi import APIRouter, HTTPException, status
from typing import List, Union
from app.models import UserCreate, UserUpdate
from app.data import users

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# Helper function to get the next available ID
def get_next_id() -> int:
    if not users:
        return 1
    return max(user["id"] for user in users) + 1

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate):
    """
    Create a new user.
    Automatically assigns an ID and stores the user in the in-memory list.
    """
    new_user = user_in.model_dump()
    new_user["id"] = get_next_id()
    users.append(new_user)
    
    return {
        "message": "User created successfully",
        "user": new_user
    }

@router.get("", status_code=status.HTTP_200_OK)
async def read_users():
    """
    Retrieve all users.
    Returns a list of users or a specific message if no users exist.
    """
    if not users:
        return {"message": "No users found"}
    return users

@router.put("/{id}", status_code=status.HTTP_200_OK)
async def update_user(id: int, user_in: UserUpdate):
    """
    Update user details by finding the user by ID.
    If the user does not exist, returns a 404 error.
    """
    for index, user in enumerate(users):
        if user["id"] == id:
            updated_data = user_in.model_dump()
            updated_data["id"] = id
            users[index] = updated_data
            return {
                "message": "User updated successfully",
                "user": updated_data
            }
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )

@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_user(id: int):
    """
    Delete a matching user by ID.
    If the user does not exist, returns a 404 error.
    """
    for index, user in enumerate(users):
        if user["id"] == id:
            del users[index]
            return {"message": "User deleted successfully"}
            
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )
