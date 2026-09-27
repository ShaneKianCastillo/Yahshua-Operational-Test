import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000, 
});

export const getTasks = () => api.get(`/tasks/`).then((res) => res.data);

export const createTask = (task) => api.post(`/tasks/`, task).then((res) => res.data);

export const updateTask = (id, task) => api.put(`/tasks/${id}/`, task).then((res) => res.data);

//PATCH
export const toggleTask = (id) => api.patch(`/tasks/${id}/`).then((res) => res.data);

export const deleteTask = (id) => api.delete(`/tasks/${id}/`);

// Turns an Axios error into a readable message for the UI.
export function getErrorMessage(error) {
  if (error.response) {
    const { status, data } = error.response
    if (status === 404) return 'Task not found. It may have been deleted.'
    if (data && typeof data === 'object') {
      // DRF validation errors look like { "title": ["This field may not be blank."] }
      return Object.entries(data)
        .map(([field, messages]) => `${field}: ${[].concat(messages).join(' ')}`)
        .join(' | ')
    }
    return `Request failed with status ${status}.`
  }
  if (error.request) {
    return 'Cannot reach the server. Make sure the Django backend is running.'
  }
  return error.message
}

