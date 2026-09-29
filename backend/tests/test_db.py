import os
import tempfile
from sqlite3 import Connection as SQLite3Connection

import pytest
from sqlalchemy import Column, ForeignKey, Integer, String, create_engine, event, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.db.init_db import init_db


def test_sqlite_connection_and_session(db_session):
    """Test that SQLite database connection works and SQLAlchemy session can query."""
    result = db_session.execute(text("SELECT 1")).scalar()
    assert result == 1


def test_foreign_keys_pragma_enabled(db_session):
    """Test that PRAGMA foreign_keys is actually enabled (=1) on the SQLite connection."""
    pragma_val = db_session.execute(text("PRAGMA foreign_keys;")).scalar()
    assert pragma_val == 1


def test_foreign_key_enforcement_in_action(test_engine):
    """Test that SQLite active foreign key enforcement raises IntegrityError on violation."""
    class LocalTestBase(DeclarativeBase):
        pass

    class DummyParent(LocalTestBase):
        __tablename__ = "dummy_parents"
        id = Column(Integer, primary_key=True)
        name = Column(String(50), nullable=False)

    class DummyChild(LocalTestBase):
        __tablename__ = "dummy_children"
        id = Column(Integer, primary_key=True)
        parent_id = Column(Integer, ForeignKey("dummy_parents.id"), nullable=False)

    LocalTestBase.metadata.create_all(bind=test_engine)

    TestingSession = sessionmaker(bind=test_engine)
    session = TestingSession()

    # Attempt inserting child referencing non-existent parent_id 999
    invalid_child = DummyChild(parent_id=999)
    session.add(invalid_child)
    with pytest.raises(IntegrityError):
        session.commit()

    session.rollback()
    session.close()


def test_database_initialization_mechanism():
    """Test that the init_db non-destructive initialization runs cleanly."""
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        db_file = tmp.name

    try:
        custom_url = f"sqlite:///{db_file}"
        custom_engine = create_engine(
            custom_url, connect_args={"check_same_thread": False}
        )

        @event.listens_for(custom_engine, "connect")
        def set_sqlite_pragma(dbapi_connection, connection_record):
            if isinstance(dbapi_connection, SQLite3Connection):
                cursor = dbapi_connection.cursor()
                cursor.execute("PRAGMA foreign_keys=ON")
                cursor.close()

        # Run init_db on fresh engine
        init_db(engine_override=custom_engine)

        with custom_engine.connect() as conn:
            fk_setting = conn.execute(text("PRAGMA foreign_keys;")).scalar()
            assert fk_setting == 1

        custom_engine.dispose()
    finally:
        if os.path.exists(db_file):
            try:
                os.remove(db_file)
            except OSError:
                pass
