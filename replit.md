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
| Method | Endpoint       | Description                                    |
|--------|----------------|-------------------------------------------------|
| GET    | /              | Health check                                    |
| POST   | /tasks         | Create a new task                               |
| GET    | /tasks         | List all tasks with stats                       |
| PATCH  | /tasks/{id}    | Toggle task completion                          |
| DELETE | /tasks/{id}    | Delete a task                                   |
| GET    | /tasks/next    | Get next best action recommendation             |
| PATCH  | /tasks/next/{id} | Override NBA by setting active task           |
| DELETE | /tasks/next    | Clear active task override                      |

## NBA Engine Logic
The Next Best Action engine recommends one task based on:
1. If an active task override is set, return that incomplete task
2. Otherwise, consider only incomplete tasks
3. Prefer the oldest task (by creation time)
4. If tied, prefer the task with the shortest title

## NBA Override Feature
Users can override the automatic recommendation by:
- Clicking the "Switch" button on the NBA card (appears when 2+ incomplete tasks exist)
- Selecting any incomplete task from the dropdown menu
- The card shows a 📌 icon and "Focused Task (Override)" label when overridden
- Click the "✕ Clear" button to return to automatic NBA engine recommendations

## Running the Application
The frontend runs on port 5000 with a proxy to the backend on port 8000.

## Recent Changes
- Initial project setup (December 2025)
- Created FastAPI backend with all endpoints
- Built React frontend with Tailwind CSS
- Implemented NBA recommendation engine
