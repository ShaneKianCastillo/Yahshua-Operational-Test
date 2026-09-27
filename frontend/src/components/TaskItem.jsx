import { useState } from 'react'
import { CalendarDays, Check, LoaderCircle, Pencil, Trash2 } from 'lucide-react'
import TaskForm from './TaskForm'

const formatDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

function TaskItem({ task, onUpdate, onToggle, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)

  const runAction = async (action) => {
    setBusy(true)
    try {
      await action()
    } finally {
      setBusy(false)
    }
  }

  const handleUpdate = async (values) => {
    await onUpdate(task.id, values)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">Editing task</p>
        <TaskForm
          initialValues={{ title: task.title, description: task.description }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save changes"
        />
      </li>
    )
  }

  return (
    <li
      className={`group flex items-start gap-4 rounded-2xl border bg-white p-4 transition hover:shadow-md ${
        task.completed ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-200'
      } ${busy ? 'opacity-60' : ''}`}
    >
      {/* Completion toggle */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? 'Mark as not completed' : 'Mark as completed'}
        onClick={() => runAction(() => onToggle(task.id))}
        disabled={busy}
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 text-transparent hover:border-emerald-400 hover:text-emerald-400'
        }`}
      >
        {busy ? <LoaderCircle className="size-3.5 animate-spin text-slate-400" /> : <Check className="size-3.5" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3
          className={`break-words font-semibold ${
            task.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className={`mt-1 whitespace-pre-wrap break-words text-sm ${task.completed ? 'text-slate-400' : 'text-slate-500'}`}>
            {task.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <CalendarDays className="size-3.5" />
            {formatDate(task.created_at)}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {task.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Actions */}
      {confirmingDelete ? (
        <div className="flex shrink-0 items-center gap-1">
          <span className="mr-1 hidden text-sm text-slate-500 sm:inline">Delete?</span>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            disabled={busy}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            No
          </button>
          <button
            type="button"
            onClick={() => runAction(() => onDelete(task.id))}
            disabled={busy}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            Yes
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 gap-1 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={busy}
            aria-label="Edit task"
            title="Edit"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            disabled={busy}
            aria-label="Delete task"
            title="Delete"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
    </li>
  )
}

export default TaskItem