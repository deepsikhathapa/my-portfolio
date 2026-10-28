#!/usr/bin/env bash
# Build step used by the hosting service (Render).
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
