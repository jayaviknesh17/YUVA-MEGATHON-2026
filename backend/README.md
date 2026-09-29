# YUVA MegaThon 2026 — Backend Service

FastAPI + SQLAlchemy + SQLite3 backend application foundation.

## Technology Stack

- **Framework**: FastAPI
- **Database**: SQLite3
- **ORM**: SQLAlchemy 2.0
- **Settings**: Pydantic Settings
- **Testing**: pytest & httpx

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base_class.py
│   │   ├── base.py
│   │   ├── session.py
│   │   └── init_db.py
│   ├── models/
│   │   └── __init__.py
│   ├── schemas/
│   │   └── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           └── health.py
│   └── services/
│       └── __init__.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_health.py
│   └── test_db.py
├── .env.example
├── requirements.txt
└── README.md
```

## Database & Foreign Key Enforcement

- SQLite disabled foreign key checks by default.
- To enforce foreign keys across all connections, SQLAlchemy Engine connection event listener is registered in `app/db/session.py`:
  ```python
  @event.listens_for(Engine, "connect")
  def set_sqlite_pragma(dbapi_connection, connection_record):
      if isinstance(dbapi_connection, SQLite3Connection):
          cursor = dbapi_connection.cursor()
          cursor.execute("PRAGMA foreign_keys=ON")
          cursor.close()
  ```

## Running the Application

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run database initialization (non-destructive):
   ```bash
   python -m app.db.init_db
   ```
3. Start the dev server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Running Tests

Run pytest from the `backend/` directory:
```bash
pytest
```
