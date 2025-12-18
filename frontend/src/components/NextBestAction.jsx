import { useState } from 'react'

function NextBestAction({ task, onComplete, incompleteTasks, onSetActive, onClearActive }) {
  const [showSelector, setShowSelector] = useState(false)

  if (!task) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6 border border-green-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h2 className="text-lg font-semibold text-green-800">All caught up!</h2>
            <p className="text-green-600 text-sm">No pending tasks. Add a new task to get started.</p>
          </div>
        </div>
      </div>
    )
  }

  const isOverride = task && incompleteTasks.length > 0 && incompleteTasks.some(t => t.id === task.id && t.id !== incompleteTasks[0].id)

  return (
    <div className={`rounded-lg p-6 mb-6 border shadow-sm transition-all ${
      isOverride 
        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{isOverride ? '📌' : '🎯'}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-sm font-medium uppercase tracking-wide ${
                isOverride ? 'text-amber-600' : 'text-blue-600'
              }`}>
                {isOverride ? 'Focused Task (Override)' : 'Next Best Action'}
              </h2>
              {isOverride && (
                <button
                  onClick={onClearActive}
                  className="text-xs text-amber-600 hover:text-amber-800 bg-amber-100 px-2 py-0.5 rounded transition-colors"
                  title="Clear override and return to automatic recommendations"
                >
                  ✕ Clear
                </button>
              )}
            </div>
            <p className="text-lg font-semibold text-gray-800">{task.title}</p>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            {task.resource_link && (
              <a
                href={task.resource_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm hover:underline mt-1 inline-flex items-center gap-1 ${
                  isOverride ? 'text-amber-600 hover:text-amber-800' : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Resource
              </a>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 whitespace-nowrap">
          <button
            onClick={() => onComplete(task.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark Done
          </button>

          {incompleteTasks.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowSelector(!showSelector)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                  showSelector
                    ? 'bg-gray-300 text-gray-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{showSelector ? '▼' : '◀'}</span>
                Switch
              </button>

              {showSelector && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-2 py-1 font-medium">Select a task:</p>
                    {incompleteTasks.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSetActive(t.id)
                          setShowSelector(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          t.id === task.id
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="font-medium truncate">{t.title}</div>
                        {t.description && (
                          <div className="text-xs text-gray-500 truncate">{t.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NextBestAction
