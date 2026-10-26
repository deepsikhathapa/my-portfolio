# Deepsikha Thapa portfolio: Next.js + Django REST (CMS)

## Backend (http://localhost:8000)
    cd backend
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    python manage.py makemigrations portfolio
    python manage.py migrate
    python manage.py seed            # starter content from the CV
    python manage.py createsuperuser
    python manage.py runserver

Edit everything at http://localhost:8000/admin (profile, photo, resume, skills, experience, projects,
education, contact messages). Use `|` in the headline to split white and teal text.

## Frontend (http://localhost:3000)
    cd frontend
    cp .env.example .env.local
    npm install
    npm run dev

Content refreshes every 30 seconds. For production set DJANGO_DEBUG=0, DJANGO_SECRET_KEY,
DJANGO_ALLOWED_HOSTS, CORS_ORIGINS, CSRF_ORIGINS and NOTIFY_EMAIL on the backend, and
NEXT_PUBLIC_API_URL on the frontend. In production serve /media from your host or object storage.
