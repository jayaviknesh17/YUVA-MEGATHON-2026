from typing import Optional
from sqlalchemy.engine import Engine
from app.db.base import Base
from app.db.session import engine as default_engine


def init_db(engine_override: Optional[Engine] = None) -> None:
    """Initialize database tables using SQLAlchemy metadata.

    Creates all tables defined in Base metadata if they do not exist.
    This action is non-destructive and safe: existing tables and data are preserved.
    """
    target_engine = engine_override or default_engine
    Base.metadata.create_all(bind=target_engine)


if __name__ == "__main__":
    init_db()
