from db import obtener_conexion


#Columnas que necesito consultar de la tabla viajes
COLUMNAS_VIAJE = """
    id,
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
    destacado,
    usuario_id,
    created_at,
    updated_at
"""


#Funcion para convertir una fila de la base de datos en el formato que usa el frontend
def convertir_fila_a_viaje(fila):
    return {
        "id": fila[0],
        "destino": fila[1],
        "pais": fila[2],
        "imagen": fila[3],
        "alt": fila[4],
        "detalles": {
            "descripcion": fila[5],
            "fecha": str(fila[6]),
            "duracion": fila[7],
            "presupuesto": float(fila[8]) if fila[8] is not None else "",
            "tipo": fila[9],
            "estado": fila[10],
            "favorito": fila[11]
        },
        "destacado": fila[12],
        "usuario_id": fila[13],
        "created_at": str(fila[14]) if fila[14] is not None else None,
        "updated_at": str(fila[15]) if fila[15] is not None else None
    }


#Funcion para obtener todos los viajes desde PostgreSQL
def obtener_todos_los_viajes():
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    #Consulto todos los viajes ordenados por id
    cursor.execute(f"""
        SELECT 
            {COLUMNAS_VIAJE}
        FROM viajes
        ORDER BY id;
    """)

    filas = cursor.fetchall()

    viajes = []

    for fila in filas:
        viajes.append(convertir_fila_a_viaje(fila))

    cursor.close()
    conexion.close()

    return viajes


#Funcion para obtener un viaje por su id desde PostgreSQL
def obtener_viaje_por_id(id):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    #Busco un viaje concreto por id
    cursor.execute(f"""
        SELECT 
            {COLUMNAS_VIAJE}
        FROM viajes
        WHERE id = %s;
    """, (id,))

    fila = cursor.fetchone()

    cursor.close()
    conexion.close()

    if fila is None:
        return None

    return convertir_fila_a_viaje(fila)


#Funcion para obtener los viajes destacados desde PostgreSQL
def obtener_viajes_destacados():
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    #Busco solo los viajes que son destacados
    cursor.execute(f"""
        SELECT 
            {COLUMNAS_VIAJE}
        FROM viajes
        WHERE destacado = true
        ORDER BY id;
    """)

    filas = cursor.fetchall()

    viajes_destacados = []

    for fila in filas:
        viajes_destacados.append(convertir_fila_a_viaje(fila))

    cursor.close()
    conexion.close()

    return viajes_destacados

#Funcion para comprobar si un usuario ya tiene el mismo viaje en la misma fecha y duracion
def existe_viaje_usuario(destino, fecha, duracion, usuario_id):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id
        FROM viajes
        WHERE LOWER(destino) = LOWER(%s)
          AND fecha = %s
          AND duracion = %s
          AND usuario_id = %s;
    """, (
        destino.strip(),
        fecha,
        duracion,
        usuario_id
    ))

    fila = cursor.fetchone()

    cursor.close()
    conexion.close()

    return fila is not None

#Funcion para crear un viaje nuevo en PostgreSQL
def crear_viaje_bd(viaje, usuario_id):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    detalles = viaje["detalles"]

    #Inserto el viaje y guardo tambien el usuario que lo ha creado
    #RETURNING significa: haz la operacion y devuelveme el resultado
    cursor.execute(f"""
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
            destacado,
            usuario_id
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING 
            {COLUMNAS_VIAJE};
    """, (
        viaje["destino"],
        viaje["pais"],
        viaje["imagen"],
        viaje["alt"],
        detalles["descripcion"],
        detalles["fecha"],
        detalles["duracion"],
        detalles["presupuesto"],
        detalles["tipo"],
        detalles["estado"],
        detalles["favorito"],
        False,
        usuario_id
    ))

    fila = cursor.fetchone()

    #Guardo los cambios porque es un INSERT
    conexion.commit()

    cursor.close()
    conexion.close()

    return convertir_fila_a_viaje(fila)


#Funcion para actualizar un viaje en PostgreSQL
def actualizar_viaje_bd(id, viaje):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    detalles = viaje["detalles"]

    #Actualizo el viaje y uso RETURNING para recuperar el viaje actualizado
    cursor.execute(f"""
        UPDATE viajes
        SET
            destino = %s,
            pais = %s,
            imagen = %s,
            alt = %s,
            descripcion = %s,
            fecha = %s,
            duracion = %s,
            presupuesto = %s,
            tipo = %s,
            estado = %s,
            favorito = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING
            {COLUMNAS_VIAJE};
    """, (
        viaje["destino"],
        viaje["pais"],
        viaje["imagen"],
        viaje["alt"],
        detalles["descripcion"],
        detalles["fecha"],
        detalles["duracion"],
        detalles["presupuesto"],
        detalles["tipo"],
        detalles["estado"],
        detalles["favorito"],
        id
    ))

    fila = cursor.fetchone()

    #Guardo los cambios porque es un UPDATE
    conexion.commit()

    cursor.close()
    conexion.close()

    if fila is None:
        return None

    return convertir_fila_a_viaje(fila)


#Funcion para eliminar un viaje en PostgreSQL
def eliminar_viaje_bd(id):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    #Elimino el viaje y uso RETURNING para saber cual se ha eliminado
    cursor.execute(f"""
        DELETE FROM viajes
        WHERE id = %s
        RETURNING
            {COLUMNAS_VIAJE};
    """, (id,))

    fila = cursor.fetchone()

    #Guardo los cambios porque es un DELETE
    conexion.commit()

    cursor.close()
    conexion.close()

    if fila is None:
        return None

    return convertir_fila_a_viaje(fila)

#Funcion para obtener los viajes visibles para un cliente
def obtener_viajes_visibles_cliente(usuario_id):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    #El cliente ve viajes generales, destacados, suyos y los creados por admin
    cursor.execute("""
        SELECT
            v.id,
            v.destino,
            v.pais,
            v.imagen,
            v.alt,
            v.descripcion,
            v.fecha,
            v.duracion,
            v.presupuesto,
            v.tipo,
            v.estado,
            v.favorito,
            v.destacado,
            v.usuario_id,
            v.created_at,
            v.updated_at
        FROM viajes v
        LEFT JOIN usuarios u ON v.usuario_id = u.id
        LEFT JOIN roles r ON u.rol_id = r.id
        WHERE v.usuario_id IS NULL
           OR v.usuario_id = %s
           OR v.destacado = true
           OR r.nombre = 'admin'
        ORDER BY v.id;
    """, (usuario_id,))

    filas = cursor.fetchall()

    viajes = []

    for fila in filas:
        viajes.append(convertir_fila_a_viaje(fila))

    cursor.close()
    conexion.close()

    return viajes