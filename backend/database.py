from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.getenv("DB_PATH") or os.path.join(BASE_DIR, os.getenv("BASE_NAME", "default.db"))

BASE_URI = f"sqlite+aiosqlite:///{db_path}"
engine = create_async_engine(BASE_URI, echo=False)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass
