from sqlite3 import Connection as SQLite3Connection
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

connect_args = (
    {"check_same_thread": False}
    if settings.SQLITE_DB_PATH.startswith("sqlite")
    else {}
)

engine = create_engine(
    settings.SQLITE_DB_PATH,
    connect_args=connect_args,
    echo=False,
)


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Enforce SQLite foreign key constraints for every database connection.
    
    SQLite disables foreign key constraint checking by default. This listener
    ensures PRAGMA foreign_keys=ON is issued on every connection made by SQLAlchemy.
    """
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
