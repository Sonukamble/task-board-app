import { useState } from 'react'

function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [resourceLink, setResourceLink] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      resource_link: resourceLink.trim() || null
    })
    
    setTitle('')
    setDescription('')
    setResourceLink('')
    setShowDetails(false)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
      >
        <span className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`}>
          ▶
        </span>
        {showDetails ? 'Hide details' : 'Add details (optional)'}
      </button>

      {showDetails && (
        <div className="mt-3 space-y-3 pt-3 border-t border-gray-100">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description or guidance..."
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            disabled={submitting}
          />
          <input
            type="url"
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            placeholder="Add a helpful link (optional)..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={submitting}
          />
        </div>
      )}
    </form>
  )
}

export default TaskForm
