from db import obtener_conexion

# Funcion para obtener el coste diario de un pais
def obtener_coste_diario_por_pais(pais):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT coste_diario
        FROM costes_pais
        WHERE pais = %s;
    """, (pais,))

    fila = cursor.fetchone()

    cursor.close()
    conexion.close()

    if fila is None:
        return None

    return float(fila[0])