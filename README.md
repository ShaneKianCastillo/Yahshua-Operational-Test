# Task Manager - YAHSHUA Operational Test

A simple Task Manager web app where you can view, create, edit, complete, and delete tasks.

- **Backend:** Django + Django REST Framework (SQLite database)
- **Frontend:** React + Vite (Axios for API calls, Tailwind CSS for styling)

## Setup Instructions

You need **Python** and **Node.js** installed. Run the backend and frontend in **two separate terminals**.

### Backend (Django)

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

- Windows (PowerShell): `.\venv\Scripts\Activate.ps1`
- Windows (Git Bash): `source venv/Scripts/activate`
- macOS / Linux: `source venv/bin/activate`

Then install the packages, set up the database, and start the server:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at http://127.0.0.1:8000/tasks/

To run the backend tests:

```bash
python manage.py test tasks
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser. Make sure the backend is running first.

## API Endpoints

| Method | Endpoint       | Description                      |
|--------|----------------|----------------------------------|
| GET    | `/tasks/`      | List all tasks                   |
| POST   | `/tasks/`      | Create a new task                |
| GET    | `/tasks/{id}/` | Get one task by ID               |
| PUT    | `/tasks/{id}/` | Update a task's title and description |
| PATCH  | `/tasks/{id}/` | Toggle a task's completed status |
| DELETE | `/tasks/{id}/` | Delete a task                    |

Example request body for POST and PUT:

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

## Notes and Assumptions

- The API uses `viewsets.ViewSet` (not `ModelViewSet`), so each action is written manually.
- **PATCH** only toggles `completed` (true ↔ false). It does not need a request body.
- **PUT** only updates `title` and `description`. Sending `completed` in a PUT is ignored.
- `title` is required. `description` is optional.
- Tasks are shown newest first.
- The endpoints are at `/tasks/` (not `/api/tasks/`), as written in the instructions.
- There is no login, since authentication was not part of the requirements.
- The frontend shows a loading state while tasks load, and an error message (with a Retry button)
  if the backend can't be reached.
- The All / Active / Completed tabs filter tasks in the browser only.