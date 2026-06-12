import os
import psycopg2
from dotenv import load_dotenv


load_dotenv(override=True)


#Funcion para conectar con la base de datos PostgreSQL
def obtener_conexion():
    conexion = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

    return conexion