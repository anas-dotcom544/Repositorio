import json
import logging
from db import obtener_conexion

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


RUTA_VIAJES = "seed/viajes.json"
RUTA_COSTES_PAIS = "seed/costes_pais.json"


# Funcion para leer los viajes que ya tengo en mi archivo JSON
def leer_viajes_json():
    with open(RUTA_VIAJES, "r", encoding="utf-8") as archivo:
        viajes = json.load(archivo)

    return viajes


# Funcion para leer los costes por pais desde JSON
def leer_costes_pais_json():
    with open(RUTA_COSTES_PAIS, "r", encoding="utf-8") as archivo:
        costes = json.load(archivo)

    return costes


# Funcion para insertar un coste por pais
def insertar_coste_pais(cursor, coste):
    cursor.execute("""
        INSERT INTO costes_pais (
            pais,
            coste_diario
        )
        VALUES (%s, %s)
        ON CONFLICT (pais)
        DO UPDATE SET coste_diario = EXCLUDED.coste_diario;
    """, (
        coste["pais"],
        coste["coste_diario"]
    ))


# Funcion para insertar un viaje en la base de datos
def insertar_viaje(cursor, viaje):
    detalles = viaje["detalles"]

    destacado = viaje.get("destacado", False)

    cursor.execute("""
        INSERT INTO viajes (
            destino,
            pais,
            imagen,
            alt,
            descripcion,
            fecha,
            duracion,
            presupuesto,
            tipo,
            estado,
            favorito,
            destacado
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        viaje["destino"],
        viaje["pais"],
        viaje.get("imagen", "img/logo2.png"),
        viaje.get("alt", "Icono de planificador de viajes"),
        detalles.get("descripcion", "Viaje añadido por el usuario."),
        detalles["fecha"],
        detalles["duracion"],
        detalles.get("presupuesto"),
        detalles["tipo"],
        detalles["estado"],
        detalles.get("favorito", False),
        destacado
    ))


# Funcion principal para insertar los costes por pais
def insertar_costes_pais_desde_json():
    costes = leer_costes_pais_json()

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    for coste in costes:
        insertar_coste_pais(cursor, coste)

    conexion.commit()

    cursor.close()
    conexion.close()

    logging.info("Costes por pais insertados correctamente en PostgreSQL")


# Funcion principal para pasar los viajes del JSON a PostgreSQL
def insertar_viajes_desde_json():
    viajes = leer_viajes_json()

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("TRUNCATE TABLE viajes RESTART IDENTITY;")

    for viaje in viajes:
        if viaje["id"] in [1, 2, 3]:
            viaje["destacado"] = True
        else:
            viaje["destacado"] = False

        insertar_viaje(cursor, viaje)

    conexion.commit()

    cursor.close()
    conexion.close()

    logging.info("Viajes insertados correctamente en PostgreSQL")


# Ejecuto las funciones solo cuando lanzo este archivo
if __name__ == "__main__":
    insertar_costes_pais_desde_json()
    insertar_viajes_desde_json()