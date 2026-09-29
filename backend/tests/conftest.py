import os
import tempfile
from typing import Generator
from sqlite3 import Connection as SQLite3Connection

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker

from app.api.deps import get_db
from app.db.base import Base
from app.main import app


@pytest.fixture(scope="session")
def test_db_url() -> Generator[str, None, None]:
    """Provide a temporary file URL for the isolated SQLite test database."""
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        db_file = tmp.name
    
    yield f"sqlite:///{db_file}"

    if os.path.exists(db_file):
        try:
            os.remove(db_file)
        except OSError:
            pass


@pytest.fixture(scope="session")
def test_engine(test_db_url: str) -> Generator[Engine, None, None]:
    """Create a dedicated test SQLAlchemy engine with SQLite foreign key enforcement."""
    engine = create_engine(
        test_db_url,
        connect_args={"check_same_thread": False},
        echo=False,
    )

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        if isinstance(dbapi_connection, SQLite3Connection):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture(scope="function")
def db_session(test_engine: Engine) -> Generator:
    """Provide a transactional SQLAlchemy session for testing."""
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=test_engine
    )
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(test_engine: Engine) -> Generator[TestClient, None, None]:
    """Provide a FastAPI TestClient configured with DB dependency override."""
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=test_engine
    )

    def _override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
