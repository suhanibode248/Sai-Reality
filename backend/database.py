import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger("backend.database")

# Read database configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_NAME = os.getenv("DB_NAME", "certified_properties")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

Base = declarative_base()

# Primary Engine (PostgreSQL) with connection fallback
engine = None
SessionLocal = None


def create_db_engine():
    global engine, SessionLocal
    try:
        # Try connecting to PostgreSQL with short timeout
        pg_engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            echo=False,
            connect_args={"connect_timeout": 3}
        )
        # Test connection
        with pg_engine.connect() as conn:
            pass
        engine = pg_engine
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info("Connected to PostgreSQL database successfully.")
    except Exception as e:
        # Fallback to local SQLite database so operations never fail
        db_file = os.path.join(os.path.dirname(__file__), "certified_properties.db")
        sqlite_url = f"sqlite:///{db_file}"
        engine = create_engine(sqlite_url, echo=False, connect_args={"check_same_thread": False})
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info(f"Using fallback database (SQLite: {db_file}) because PostgreSQL was unreachable: {e}")


create_db_engine()


def get_db():
    """FastAPI Dependency for database sessions."""
    if SessionLocal is None:
        create_db_engine()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initializes database tables and creates a default admin user if not present.
    """
    from models import User
    from utils import hash_password

    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")

        # Seed default admin user
        db = SessionLocal()
        try:
            admin_user = db.query(User).filter(
                (User.username == "admin") | (User.email == "admin@certifiedproperties.in")
            ).first()
            if not admin_user:
                admin = User(
                    username="admin",
                    email="admin@certifiedproperties.in",
                    password_hash=hash_password("admin123"),
                    full_name="Administrator",
                    role="Admin"
                )
                db.add(admin)
                db.commit()
                logger.info("Default admin user created (admin / admin123).")
        finally:
            db.close()

    except Exception as e:
        logger.warning(f"Database initialization notice: {e}")
