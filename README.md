# Expense Tracker API

A backend expense tracking application built with Django REST Framework and PostgreSQL.

This project supports multi-user authentication, expense management, analytics, and is designed to later support fuzzy search and natural language expense input.

---

## 🚀 Tech Stack

- Python 3.12
- Django
- Django REST Framework
- PostgreSQL
- psycopg2
- python-dotenv

---

## 📦 Features Implemented

- User signup (username + email + password)
- Login & logout (session-based authentication)
- Per-user expense isolation
- CRUD operations for expenses
- Category management
- Filtering by:
  - Category
  - Date range
  - Search query
- Category-wise analytics (total + count)
- PostgreSQL-backed database
- Environment-based configuration (.env)

---

## 🛠 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/RedK22/expense-tracker
cd expense-tracker
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Install PostgreSQL (WSL / Linux)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### 5. Create Database and User

```bash
sudo -u postgres psql
```

Inside psql:

```bash
CREATE DATABASE expense_tracker;
CREATE USER expense_user WITH PASSWORD '<your_password>';
\c expense_tracker
ALTER SCHEMA public OWNER TO expense_user;
GRANT ALL ON SCHEMA public TO expense_user;
\q
```

### 6. Create .env file

```bash
DB_NAME=expense_tracker
DB_USER=expense_user
DB_PASSWORD=<your_password>
DB_HOST=localhost
DB_PORT=5432
```

### 7. Run Migrations

```bash
python manage.py migrate
```

### 8. Create Superuser

```bash
python manage.py createsuperuser
```

### 9. Run Server

```bash
python manage.py runserver
```

Visit:
Admin: http://127.0.0.1:8000/admin/
API root: http://127.0.0.1:8000/api/

## API Endpoints

Authentication:

- POST /api/auth/signup/

- POST /api/auth/login/

- POST /api/auth/logout/

Expenses:

- GET /api/expenses/

- POST /api/expenses/

- GET /api/expenses/<id>/

- PUT /api/expenses/<id>/

- DELETE /api/expenses/<id>/

Categories:

- GET /api/categories/

- POST /api/categories/

Analytics:

- GET /api/analytics/category-summary/

## Planned Features:

- Frontend with Next.js/React.js
- PostgreSQL trigram-based fuzzy search
- Natural language expense parsing
- AI-assisted expense retrieval
- Pagination
- Docker support
