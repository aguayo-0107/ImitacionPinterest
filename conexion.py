import psycopg
import os
from dotenv import load_dotenv

load_dotenv()
HOST = os.getenv("DB_HOST")
PORT = os.getenv("DB_PORT")
NAME = os.getenv("DB_name")
USER = os.getenv("DB_user")
PASSWORD = os.getenv("DB_PASSWORD")

DB_CONNECTION_STRING = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}"

with psycopg.connect(DB_CONNECTION_STRING) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM Usuario;")
        datos = cur.fetchall()
        print(datos)