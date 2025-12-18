# Task Board Application

## Overview
A clean, polished Task Board application with a Python FastAPI backend and React + Tailwind CSS frontend. Features a unique Next Best Action (NBA) recommendation engine that helps users prioritize their work.

## Project Structure
```
├── backend/
│   └── main.py          # FastAPI application with REST API endpoints
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React application
│   │   ├── index.css    # Tailwind CSS imports
│   │   └── components/
│   │       ├── TaskForm.jsx       # Task creation form
│   │       ├── TaskList.jsx       # Task list container
│   │       ├── TaskItem.jsx       # Individual task component
│   │       ├── NextBestAction.jsx # NBA recommendation card
│   │       └── ProgressBar.jsx    # Progress indicator
│   └── vite.config.js   # Vite configuration with Tailwind
└── replit.md            # This file
```

## Tech Stack
- **Backend**: Python 3.11, FastAPI, Pydantic, Uvicorn
- **Frontend**: React 18, Vite, Tailwind CSS
- **Storage**: In-memory (Python list)

## API Endpoints
| Method | Endpoint       | Description                          |
|--------|----------------|--------------------------------------|
| GET    | /              | Health check                         |
| POST   | /tasks         | Create a new task                    |
| GET    | /tasks         | List all tasks with stats            |
| PATCH  | /tasks/{id}    | Toggle task completion               |
| DELETE | /tasks/{id}    | Delete a task                        |
| GET    | /tasks/next    | Get next best action recommendation  |

## NBA Engine Logic
The Next Best Action engine recommends one task based on:
1. Only considers incomplete tasks
2. Prefers the oldest task (by creation time)
3. If tied, prefers the task with the shortest title

## Running the Application
The frontend runs on port 5000 with a proxy to the backend on port 8000.

## Recent Changes
- Initial project setup (December 2025)
- Created FastAPI backend with all endpoints
- Built React frontend with Tailwind CSS
- Implemented NBA recommendation engine
