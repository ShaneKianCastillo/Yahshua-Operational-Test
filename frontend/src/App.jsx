import { createTask } from './api/tasks'
import TaskForm from './components/TaskForm'

function App() {
  const handleCreate = async (values) => {
    const task = await createTask(values)
    console.log('Created:', task)
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <TaskForm onSubmit={handleCreate} submitLabel="Add task" />
    </div>
  )
}

export default App