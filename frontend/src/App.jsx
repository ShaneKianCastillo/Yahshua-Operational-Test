import { createTask, deleteTask, getTasks, toggleTask, updateTask } from './api/tasks'
import { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskItem from './components/TaskItem'

function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])

  const replaceTask = (updated) => setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))

  return (
    <ul className="mx-auto max-w-2xl space-y-3 p-8">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={async (id, values) => replaceTask(await updateTask(id, values))}
          onToggle={async (id) => replaceTask(await toggleTask(id))}
          onDelete={async (id) => {
            await deleteTask(id)
            setTasks((prev) => prev.filter((t) => t.id !== id))
          }}
        />
      ))}
    </ul>
  )
}

export default App