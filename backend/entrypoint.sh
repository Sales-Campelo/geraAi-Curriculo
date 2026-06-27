#!/bin/bash
set -e

echo ">>> Rodando migrações..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo ">>> Iniciando servidor..."
exec python manage.py runserver 0.0.0.0:8000
