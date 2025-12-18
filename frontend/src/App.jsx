import { useState, useEffect, useCallback } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import NextBestAction from './components/NextBestAction'
import ProgressBar from './components/ProgressBar'

const API_BASE = '/api'

function App() {
  const [tasks, setTasks] = useState([])
  const [nextTask, setNextTask] = useState(null)
  const [stats, setStats] = useState({ total: 0, completed: 0 })
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`)
      const data = await response.json()
      setTasks(data.tasks)
      setStats({ total: data.total, completed: data.completed })
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }, [])

  const fetchNextTask = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks/next`)
      const data = await response.json()
      setNextTask(data.task)
    } catch (error) {
      console.error('Failed to fetch next task:', error)
    }
  }, [])

  const refreshData = useCallback(async () => {
    await Promise.all([fetchTasks(), fetchNextTask()])
  }, [fetchTasks, fetchNextTask])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await refreshData()
      setLoading(false)
    }
    loadData()
  }, [refreshData])

  const addTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  const toggleTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PATCH'
      })
      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Board</h1>
          <p className="text-gray-500">Manage your tasks with smart recommendations</p>
        </header>

        <ProgressBar total={stats.total} completed={stats.completed} />

        <NextBestAction task={nextTask} onComplete={toggleTask} />

        <TaskForm onSubmit={addTask} />

        <TaskList 
          tasks={tasks} 
          onToggle={toggleTask} 
          onDelete={deleteTask} 
        />
      </div>
    </div>
  )
}

export default App
