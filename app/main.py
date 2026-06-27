from fastapi import FastAPI
from app.routers import users

# Initialize FastAPI application
app = FastAPI(
    title="FastAPI CRUD Backend (In-Memory)",
    description="A beginner-friendly FastAPI backend project demonstrating CRUD operations without a database.",
    version="1.0.0"
)

# Include the users router
app.include_router(users.router)

@app.get("/")
async def root():
    """
    Root endpoint to verify the API is running.
    """
    return {"message": "Welcome to the FastAPI CRUD API. Visit /docs for the Swagger documentation."}
