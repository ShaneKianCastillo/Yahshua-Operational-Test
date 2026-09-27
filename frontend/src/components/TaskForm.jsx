import {useState} from 'react';
import {LoaderCircle, Plus, Save} from 'lucide-react';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 ' +
  'transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50'


function TaskForm({ initialValues = { title: '', description: '' }, onSubmit, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialValues.title)
  const [description, setDescription] = useState(initialValues.description)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isEdit = Boolean(onCancel)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await onSubmit({ title: title.trim(), description: description.trim() })
      if (!isEdit) {
        // Create mode: clear the form after a successful submit.
        setTitle('')
        setDescription('')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder={isEdit ? 'Task title' : 'What needs to be done?'}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          if (error) setError('')
        }}
        maxLength={255}
        disabled={submitting}
        aria-label="Title"
        className={`${inputClass} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100' : ''}`}
      />
      <textarea
        placeholder="Add a description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={isEdit ? 3 : 2}
        disabled={submitting}
        aria-label="Description"
        className={`${inputClass} resize-y`}
      />
      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

      <div className="flex justify-end gap-2">
        {isEdit && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : isEdit ? (
            <Save className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default TaskForm