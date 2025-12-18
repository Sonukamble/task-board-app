"""
Task Board API - FastAPI Backend
A clean REST API for task management with a Next Best Action recommendation engine.
"""

from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Task Board API",
    description="Task management API with Next Best Action recommendations",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Data Models
# ============================================================================

class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    resource_link: Optional[str] = Field(None, max_length=500)


class Task(BaseModel):
    """Complete task model with all fields."""
    id: int
    title: str
    description: Optional[str] = None
    resource_link: Optional[str] = None
    completed: bool = False
    created_at: datetime


class TaskResponse(BaseModel):
    """Response model for task operations."""
    task: Task


class TaskListResponse(BaseModel):
    """Response model for listing all tasks."""
    tasks: list[Task]
    total: int
    completed: int


# ============================================================================
# In-Memory Storage
# ============================================================================

tasks_db: list[Task] = []
next_id: int = 1
active_task_id: Optional[int] = None


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Task Board API is running"}


@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(task_data: TaskCreate):
    """
    Create a new task.
    
    - **title**: Required task title
    - **description**: Optional guidance for the task
    - **resource_link**: Optional helpful link
    """
    global next_id
    
    new_task = Task(
        id=next_id,
        title=task_data.title.strip(),
        description=task_data.description.strip() if task_data.description else None,
        resource_link=task_data.resource_link.strip() if task_data.resource_link else None,
        completed=False,
        created_at=datetime.now()
    )
    
    tasks_db.append(new_task)
    next_id += 1
    
    return TaskResponse(task=new_task)


@app.get("/tasks", response_model=TaskListResponse)
def list_tasks():
    """
    Get all tasks.
    
    Returns tasks sorted by creation date (newest first) along with statistics.
    """
    sorted_tasks = sorted(tasks_db, key=lambda t: t.created_at, reverse=True)
    completed_count = sum(1 for t in tasks_db if t.completed)
    
    return TaskListResponse(
        tasks=sorted_tasks,
        total=len(tasks_db),
        completed=completed_count
    )


@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def toggle_task(task_id: int):
    """
    Toggle task completion status.
    
    Flips the completed status from True to False or vice versa.
    """
    global active_task_id
    
    for task in tasks_db:
        if task.id == task_id:
            task.completed = not task.completed
            # If the active task is completed, clear it
            if active_task_id == task_id and task.completed:
                active_task_id = None
            return TaskResponse(task=task)
    
    raise HTTPException(status_code=404, detail=f"Task with id {task_id} not found")


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    """
    Delete a task by ID.
    """
    global tasks_db, active_task_id
    
    original_length = len(tasks_db)
    tasks_db = [t for t in tasks_db if t.id != task_id]
    
    if len(tasks_db) == original_length:
        raise HTTPException(status_code=404, detail=f"Task with id {task_id} not found")
    
    # Clear active task if it was deleted
    if active_task_id == task_id:
        active_task_id = None
    
    return None


# ============================================================================
# Next Best Action (NBA) Engine
# ============================================================================

@app.get("/tasks/next")
def get_next_best_action():
    """
    Get the recommended next task to work on.
    
    **NBA Decision Logic:**
    1. If active_task_id is set and task is incomplete, return it
    2. Otherwise, filter incomplete tasks
    3. Prefer the oldest task (by created_at)
    4. If tie, prefer the task with the shortest title
    
    Returns null if no pending tasks exist.
    """
    global active_task_id
    
    pending_tasks = [t for t in tasks_db if not t.completed]
    
    # If an active task is set and still incomplete, return it
    if active_task_id:
        for task in pending_tasks:
            if task.id == active_task_id:
                return {
                    "task": task,
                    "message": "This is your focused task (manually selected)",
                    "is_override": True
                }
        # Active task was completed or deleted, clear it
        active_task_id = None
    
    if not pending_tasks:
        return {"task": None, "message": "No pending tasks. You're all caught up!"}
    
    # Sort by created_at (oldest first), then by title length (shortest first)
    recommended = min(
        pending_tasks,
        key=lambda t: (t.created_at, len(t.title))
    )
    
    return {
        "task": recommended,
        "message": "This is your recommended next task based on priority",
        "is_override": False
    }


@app.patch("/tasks/next/{task_id}")
def set_active_task(task_id: int):
    """
    Override the Next Best Action by manually selecting a task.
    """
    global active_task_id
    
    for task in tasks_db:
        if task.id == task_id and not task.completed:
            active_task_id = task_id
            return {
                "task": task,
                "message": "Task set as your focus"
            }
    
    raise HTTPException(status_code=404, detail=f"Task with id {task_id} not found or already completed")


@app.delete("/tasks/next")
def clear_active_task():
    """
    Clear the active task override and return to NBA engine logic.
    """
    global active_task_id
    active_task_id = None
    return {"message": "Active task cleared. Back to automatic recommendations."}


# ============================================================================
# Run the application
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
