import { useState } from 'react'

function TaskItem({ task, onToggle, onDelete }) {
  const [showDetails, setShowDetails] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const hasDetails = task.description || task.resource_link

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(task.id)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </p>
          
          {hasDetails && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-gray-400 hover:text-gray-600 mt-1 flex items-center gap-1 transition-colors"
            >
              <span className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`}>
                ▶
              </span>
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          )}

          {showDetails && hasDetails && (
            <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
              {task.resource_link && (
                <a
                  href={task.resource_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Resource Link
                </a>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TaskItem
