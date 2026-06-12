from db import obtener_conexion


#Funcion para convertir una fila de la base de datos en un usuario
def convertir_fila_a_usuario(fila):
    return {
        "id": fila[0],
        "nombre": fila[1],
        "email": fila[2],
        "password": fila[3],
        "rol": fila[4],
        "fecha_registro": str(fila[5])
    }


#Funcion para buscar un usuario por su email
def obtener_usuario_por_email(email):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            u.id,
            u.nombre,
            u.email,
            u.password,
            r.nombre AS rol,
            u.fecha_registro
        FROM usuarios u
        INNER JOIN roles r ON u.rol_id = r.id
        WHERE u.email = %s;
    """, (email,))

    fila = cursor.fetchone()

    cursor.close()
    conexion.close()

    if fila is None:
        return None

    return convertir_fila_a_usuario(fila)


#Funcion para buscar un usuario por su id
def obtener_usuario_por_id(id):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            u.id,
            u.nombre,
            u.email,
            u.password,
            r.nombre AS rol,
            u.fecha_registro
        FROM usuarios u
        INNER JOIN roles r ON u.rol_id = r.id
        WHERE u.id = %s;
    """, (id,))

    fila = cursor.fetchone()

    cursor.close()
    conexion.close()

    if fila is None:
        return None

    return convertir_fila_a_usuario(fila)


#Funcion para crear un usuario nuevo
def crear_usuario(nombre, email, password, rol="cliente"):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        INSERT INTO usuarios (nombre, email, password, rol_id)
        VALUES (
            %s,
            %s,
            %s,
            (
                SELECT id
                FROM roles
                WHERE nombre = %s
            )
        )
        RETURNING
            id,
            nombre,
            email,
            password,
            (
                SELECT nombre
                FROM roles
                WHERE id = rol_id
            ) AS rol,
            fecha_registro;
    """, (nombre, email, password, rol))

    fila = cursor.fetchone()

    conexion.commit()

    cursor.close()
    conexion.close()

    return convertir_fila_a_usuario(fila)