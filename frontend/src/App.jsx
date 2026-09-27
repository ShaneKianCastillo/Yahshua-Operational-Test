import { useEffect, useState } from 'react'
import { CircleAlert, ClipboardList, ListTodo, RotateCw, X } from 'lucide-react'
import { createTask, deleteTask, getErrorMessage, getTasks, toggleTask, updateTask } from './api/tasks'
import TaskForm from './components/TaskForm'
import TaskItem from './components/TaskItem'

const FILTERS = [
  { key: 'all', label: 'All tasks' },
  { key: 'active', label: 'Active tasks' },
  { key: 'completed', label: 'Completed tasks' }
]

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchTasks = () =>
    getTasks()
      .then(setTasks)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))

  // Initial load. 
  useEffect(() => {
    fetchTasks()
  }, [])

  // Used by the Retry button.
  const loadTasks = () => {
    setLoading(true)
    setError('')
    fetchTasks()
  }

  
  const withErrorHandling = (fn) => async (...args) => {
    setError('')
    try {
      return await fn(...args)
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      throw new Error(message)
    }
  }

  const handleCreate = withErrorHandling(async (values) => {
    const created = await createTask(values)
    setTasks((prev) => [created, ...prev])
  })

  const handleUpdate = withErrorHandling(async (id, values) => {
    const updated = await updateTask(id, values)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  })

  const handleToggle = withErrorHandling(async (id) => {
    const updated = await toggleTask(id)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  })

  const handleDelete = withErrorHandling(async (id) => {
    await deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  })

  
  const ignoreRethrow = (fn) => (...args) => fn(...args).catch(() => {})

  const completedCount = tasks.filter((t) => t.completed).length
  const pendingCount = tasks.length - completedCount
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0
  const counts = { all: tasks.length, active: pendingCount, completed: completedCount }

  const visibleTasks = tasks.filter((t) =>
    filter === 'active' ? !t.completed : filter === 'completed' ? t.completed : true,
  )

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 pb-28 pt-10 text-white">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/15 p-2.5 ring-1 ring-white/25">
              <ListTodo className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Task Manager</h1>
              <p className="text-sm text-indigo-100">Organize your work and track your progress.</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: 'Total', value: tasks.length },
              { label: 'Pending', value: pendingCount },
              { label: 'Completed', value: completedCount },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
                <p className="text-2xl font-bold">{loading ? '–' : stat.value}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-100">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs font-medium text-indigo-100">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-20 max-w-3xl space-y-6 px-4">
        {/* New task */}
        <section className="rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Add a new task</h2>
          <TaskForm onSubmit={handleCreate} submitLabel="Add task" />
        </section>

        {/* Error banner */}
        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            <CircleAlert className="mt-0.5 size-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{error}</p>
            <button
              type="button"
              onClick={loadTasks}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-rose-200 transition hover:bg-rose-100"
            >
              <RotateCw className="size-3.5" />
              Retry
            </button>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss error"
              className="rounded-lg p-1.5 transition hover:bg-rose-100"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Task list */}
        <section className="rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-800">Your tasks</h2>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    filter === key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {label}
                  <span className="ml-1.5 text-xs text-slate-400">{counts[key]}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <ul className="space-y-3" aria-label="Loading tasks">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex animate-pulse gap-4 rounded-2xl border border-slate-100 p-4">
                  <div className="size-6 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 rounded bg-slate-200" />
                    <div className="h-3 w-3/4 rounded bg-slate-100" />
                  </div>
                </li>
              ))}
            </ul>
          ) : visibleTasks.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 rounded-full bg-indigo-50 p-4">
                <ClipboardList className="size-8 text-indigo-400" />
              </div>
              <p className="font-semibold text-slate-700">
                {error && tasks.length === 0
                  ? 'Could not load tasks'
                  : filter === 'all'
                    ? 'No tasks yet'
                    : `No ${filter === 'active' ? 'active' : 'completed'} tasks`}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {error && tasks.length === 0
                  ? 'Check that the backend is running, then retry.'
                  : filter === 'all'
                    ? 'Add your first task using the form above.'
                    : 'Try another filter.'}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {visibleTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdate}
                  onToggle={ignoreRethrow(handleToggle)}
                  onDelete={ignoreRethrow(handleDelete)}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App