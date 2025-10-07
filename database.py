from sqlalchemy import  create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME") or "db_grupo06"
port = os.getenv("DB_PORT")


url = f"postgresql+psycopg://{user}:{password}@{host}:{port}/{db_name}"
engine = create_engine(url, pool_pre_ping=True)
db_session = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))


