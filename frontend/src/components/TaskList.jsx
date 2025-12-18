import TaskItem from './TaskItem'

function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No tasks yet</p>
        <p className="text-sm">Add your first task above to get started</p>
      </div>
    )
  }

  const incompleteTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="space-y-3">
      {incompleteTasks.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Active Tasks ({incompleteTasks.length})
          </h2>
          {incompleteTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-2 mt-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            Completed ({completedTasks.length})
          </h2>
          {completedTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList
