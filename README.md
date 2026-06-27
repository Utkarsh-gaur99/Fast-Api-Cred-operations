<!-- # FastAPI CRUD Backend (In-Memory)

## Project Overview
This is a beginner-friendly FastAPI backend project that demonstrates complete CRUD (Create, Read, Update, Delete) operations. It does not use any database; instead, it stores data temporarily in an in-memory Python list. The data resets whenever the server restarts. It includes validation using Pydantic.

## Folder Structure
```text
backend/
│── app/
│   ├── main.py
│   ├── models.py
│   ├── data.py
│   ├── routers/
│   │     └── users.py
│   └── __init__.py
│
│── requirements.txt
│── README.md
```

## Installation Steps

### 1. Create Virtual Environment
Open your terminal, navigate to the `backend` folder, and run:
```bash
python -m venv venv
```
Activate the virtual environment:
- On Windows:
  ```bash
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Server
Run the FastAPI application using Uvicorn:
```bash
uvicorn app.main:app --reload
```

## API Endpoint Table

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| POST   | /users      | Create User   |
| GET    | /users      | Get All Users |
| PUT    | /users/{id} | Update User   |
| DELETE | /users/{id} | Delete User   |

## Example curl commands

### 1. Create User
```bash
curl -X POST "http://127.0.0.1:8000/users" \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com", "age": 22}'
```

### 2. Get All Users
```bash
curl -X GET "http://127.0.0.1:8000/users"
```

### 3. Update User
```bash
curl -X PUT "http://127.0.0.1:8000/users/1" \
     -H "Content-Type: application/json" \
     -d '{"name": "Updated Name", "email": "updated@gmail.com", "age": 30}'
```

### 4. Delete User
```bash
curl -X DELETE "http://127.0.0.1:8000/users/1"
```

## Swagger Documentation
The API automatically generates Swagger UI documentation. Once the server is running, you can access it at:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) -->
