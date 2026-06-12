import logging
from db import obtener_conexion

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Funcion para crear la tabla de roles
def crear_tabla_roles():
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(50) UNIQUE NOT NULL
            );
        """)

        cursor.execute("""
            INSERT INTO roles (nombre)
            VALUES ('cliente'), ('admin')
            ON CONFLICT (nombre) DO NOTHING;
        """)

        conexion.commit()
        logging.info("Tabla roles creada correctamente")

    except Exception as error:
        logging.error("Error al crear la tabla roles: %s", error)

        if conexion:
            conexion.rollback()

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()

# Funcion para crear la tabla de usuarios en PostgreSQL
def crear_tabla_usuarios():
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                rol_id INTEGER REFERENCES roles(id),
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        conexion.commit()
        logging.info("Tabla usuarios creada correctamente")

    except Exception as error:
        logging.error("Error al crear la tabla usuarios: %s", error)

        if conexion:
            conexion.rollback()

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()

# Funcion para actualizar la tabla usuarios y relacionarla con roles
def actualizar_tabla_usuarios():
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            ALTER TABLE usuarios
            ADD COLUMN IF NOT EXISTS rol_id INTEGER REFERENCES roles(id);
        """)

        cursor.execute("""
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'usuarios'
                    AND column_name = 'rol'
                ) THEN
                    UPDATE usuarios
                    SET rol_id = roles.id
                    FROM roles
                    WHERE usuarios.rol = roles.nombre
                    AND usuarios.rol_id IS NULL;
                END IF;
            END $$;
        """)

        cursor.execute("""
            UPDATE usuarios
            SET rol_id = (
                SELECT id
                FROM roles
                WHERE nombre = 'cliente'
            )
            WHERE rol_id IS NULL;
        """)

        cursor.execute("""
            ALTER TABLE usuarios
            ALTER COLUMN rol_id SET NOT NULL;
        """)

        cursor.execute("""
            ALTER TABLE usuarios
            DROP COLUMN IF EXISTS rol;
        """)

        conexion.commit()
        logging.info("Tabla usuarios actualizada correctamente")

    except Exception as error:
        logging.error("Error al actualizar la tabla usuarios: %s", error)

        if conexion:
            conexion.rollback()

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()

# Funcion para crear la tabla de viajes en PostgreSQL
def crear_tabla_viajes():
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS viajes (
                id SERIAL PRIMARY KEY,
                destino VARCHAR(100) NOT NULL,
                pais VARCHAR(100) NOT NULL,
                imagen VARCHAR(255) DEFAULT 'img/logo2.png',
                alt VARCHAR(255) DEFAULT 'Icono de planificador de viajes',
                descripcion TEXT DEFAULT 'Viaje añadido por el usuario.',
                fecha DATE NOT NULL,
                duracion INTEGER NOT NULL CHECK (duracion > 0),
                presupuesto NUMERIC CHECK (presupuesto IS NULL OR presupuesto >= 0),
                tipo VARCHAR(50) NOT NULL,
                estado VARCHAR(50) NOT NULL
                    CHECK (estado IN ('Pendiente', 'Reservado', 'Visitado')),
                favorito BOOLEAN DEFAULT FALSE,
                destacado BOOLEAN DEFAULT FALSE,
                usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        conexion.commit()
        logging.info("Tabla viajes creada correctamente")

    except Exception as error:
        logging.error("Error al crear la tabla viajes: %s", error)

        if conexion:
            conexion.rollback()

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


# Funcion para añadir columnas nuevas si la tabla ya existia antes
def actualizar_tabla_viajes():
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            ALTER TABLE viajes
            ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
        """)

        cursor.execute("""
            ALTER TABLE viajes
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        """)

        cursor.execute("""
            ALTER TABLE viajes
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        """)

        conexion.commit()
        logging.info("Tabla viajes actualizada correctamente")

    except Exception as error:
        logging.error("Error al actualizar la tabla viajes: %s", error)

        if conexion:
            conexion.rollback()

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


# Funcion para crear la tabla de costes por pais
def crear_tabla_costes_pais():
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS costes_pais (
                id SERIAL PRIMARY KEY,
                pais VARCHAR(100) UNIQUE NOT NULL,
                coste_diario NUMERIC NOT NULL CHECK (coste_diario > 0)
            );
        """)

        conexion.commit()
        logging.info("Tabla costes_pais creada correctamente")

    except Exception as error:
        logging.error("Error al crear la tabla costes_pais: %s", error)

        if conexion:
            conexion.rollback()

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


# Ejecuto las funciones solo cuando lanzo este archivo
if __name__ == "__main__":
    crear_tabla_roles()
    crear_tabla_usuarios()
    actualizar_tabla_usuarios()
    crear_tabla_costes_pais()
    crear_tabla_viajes()
    actualizar_tabla_viajes()