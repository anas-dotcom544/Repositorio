import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from viajes_datos import obtener_todos_los_viajes, obtener_viaje_por_id, obtener_viajes_destacados, crear_viaje_bd, actualizar_viaje_bd, eliminar_viaje_bd, obtener_viajes_visibles_cliente, existe_viaje_usuario
from usuarios_datos import obtener_usuario_por_email, crear_usuario, obtener_usuario_por_id
from costes_datos import obtener_coste_diario_por_pais
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import jwt
from datetime import datetime, timedelta, timezone

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

#Clave necesaria para poder usar sesiones en Flask
app.secret_key = os.getenv("FLASK_SECRET_KEY")

#Evito que Flask ordene las claves del JSON alfabeticamente
app.json.sort_keys = False

#Funcion para devolver errores de forma mas ordenada
def devolver_error(mensaje, codigo):
    return jsonify({"error": mensaje}), codigo

#Funcion para crear un token JWT
def crear_token_jwt(usuario):
    horas_expiracion = int(os.getenv("JWT_EXPIRATION_HOURS", "2"))

    payload = {
        "usuario_id": usuario["id"],
        "usuario_nombre": usuario["nombre"],
        "usuario_rol": usuario["rol"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=horas_expiracion)
    }

    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET_KEY"),
        algorithm="HS256"
    )

    return token


#Funcion para obtener los datos del usuario desde el token JWT
def obtener_datos_token():
    cabecera = request.headers.get("Authorization", "")

    if not cabecera.startswith("Bearer "):
        return None

    token = cabecera.replace("Bearer ", "")

    try:
        datos = jwt.decode(
            token,
            os.getenv("JWT_SECRET_KEY"),
            algorithms=["HS256"]
        )

        return datos

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None

#Funcion para validar que la contraseña sea suficientemente segura
def validar_password_segura(password):
    if len(password) < 8:
        return "La contraseña debe tener al menos 8 caracteres"

    tiene_mayuscula = False
    tiene_minuscula = False
    tiene_numero = False

    for caracter in password:
        if caracter.isupper():
            tiene_mayuscula = True

        if caracter.islower():
            tiene_minuscula = True

        if caracter.isdigit():
            tiene_numero = True

    if not tiene_mayuscula:
        return "La contraseña debe tener al menos una letra mayúscula"

    if not tiene_minuscula:
        return "La contraseña debe tener al menos una letra minúscula"

    if not tiene_numero:
        return "La contraseña debe tener al menos un número"

    return None

#Funcion para comprobar si hay usuario conectado
def usuario_esta_conectado():
    datos_token = obtener_datos_token()

    if datos_token is not None:
        return True

    return "usuario_id" in session

#Funcion para comprobar si el usuario conectado es admin
def usuario_es_admin():
    datos_token = obtener_datos_token()

    if datos_token is not None:
        return datos_token.get("usuario_rol") == "admin"

    return session.get("usuario_rol") == "admin"

#Decorador para proteger rutas que solo puede usar el admin
def requiere_admin(funcion):
    @wraps(funcion)
    def wrapper(*args, **kwargs):
        if not usuario_esta_conectado():
            return devolver_error("Debes iniciar sesion", 401)

        if not usuario_es_admin():
            return devolver_error("No tienes permisos de administrador", 403)

        return funcion(*args, **kwargs)

    return wrapper

#Funcion para obtener el id del usuario conectado
def obtener_id_usuario_conectado():
    datos_token = obtener_datos_token()

    if datos_token is not None:
        return datos_token.get("usuario_id")

    return session.get("usuario_id")

#Funcion para comprobar si un viaje fue creado por un admin
def viaje_fue_creado_por_admin(viaje):
    usuario_id = viaje.get("usuario_id")

    if usuario_id is None:
        return False

    usuario = obtener_usuario_por_id(usuario_id)

    if usuario is None:
        return False

    rol = str(usuario["rol"]).strip().lower()

    return rol == "admin"

#Funcion para añadir permisos al viaje antes de mandarlo al frontend
def añadir_permisos_viaje(viaje):
    viaje["solo_lectura"] = False

    if not usuario_es_admin() and viaje_fue_creado_por_admin(viaje):
        viaje["solo_lectura"] = True

    return viaje

#Funcion para comprobar si el usuario puede modificar un viaje normal
def usuario_puede_modificar_viaje(viaje):
    if usuario_es_admin():
        return True

    return viaje["usuario_id"] == obtener_id_usuario_conectado()

#Funcion para validar los campos obligatorios
def validar_viaje(viaje):
    campos_obligatorios = ["destino", "pais", "detalles"]

    for campo in campos_obligatorios:
        valor = viaje.get(campo)

        if valor is None or str(valor).strip() == "":
            return f"El campo '{campo}' es obligatorio"

    if not isinstance(viaje["detalles"], dict):
        return "El campo 'detalles' debe ser un objeto"

    detalles_obligatorios = ["fecha", "duracion", "tipo", "estado"]

    for campo in detalles_obligatorios:
        valor = viaje["detalles"].get(campo)

        if valor is None or str(valor).strip() == "":
            return f"El campo 'detalles.{campo}' es obligatorio"

    return None


#Funcion para añadir valores por defecto
def completar_viaje(viaje):
    if "imagen" not in viaje or str(viaje["imagen"]).strip() == "":
        viaje["imagen"] = "img/logo2.png"

    if "alt" not in viaje or str(viaje["alt"]).strip() == "":
        viaje["alt"] = "Icono de planificador de viajes"

    if "descripcion" not in viaje["detalles"] or str(viaje["detalles"]["descripcion"]).strip() == "":
        if usuario_es_admin():
            viaje["detalles"]["descripcion"] = "Idea de viaje añadida por el admin para inspirar tu próxima aventura."
        else:
            viaje["detalles"]["descripcion"] = "Viaje personal añadido a tu lista de aventuras."

    if "presupuesto" not in viaje["detalles"] or str(viaje["detalles"]["presupuesto"]).strip() == "":
        pais = viaje["pais"]
        duracion = int(viaje["detalles"]["duracion"])

        coste_diario = obtener_coste_diario_por_pais(pais)

        if coste_diario is None:
            coste_diario = 90

        viaje["detalles"]["presupuesto"] = coste_diario * duracion

    if "favorito" not in viaje["detalles"]:
        viaje["detalles"]["favorito"] = False

    return viaje

#Funcion para validar y completar un viaje recibido
def preparar_viaje_recibido(viaje):
    if not viaje:
        return None, "No se han enviado datos"

    error = validar_viaje(viaje)

    if error:
        return None, error

    viaje = completar_viaje(viaje)

    return viaje, None

#POST /auth/signup -> registro de un usuario nuevo
@app.route("/auth/signup", methods=["POST"])
def signup():
    datos = request.get_json()

    if not datos:
        return devolver_error("No se han enviado datos", 400)

    nombre = datos.get("nombre", "").strip()
    email = datos.get("email", "").strip().lower()
    password = datos.get("password", "")

    if nombre == "":
        return devolver_error("El nombre es obligatorio", 400)

    if email == "":
        return devolver_error("El email es obligatorio", 400)

    if password == "":
        return devolver_error("La contraseña es obligatoria", 400)
    
    error_password = validar_password_segura(password)

    if error_password:
        return devolver_error(error_password, 400)

    usuario_existente = obtener_usuario_por_email(email)

    if usuario_existente is not None:
        return devolver_error("Ya existe un usuario con ese email", 409)

    #Aunque la columna se llama password, guardo la contraseña cifrada
    password_cifrada = generate_password_hash(password)

    usuario_creado = crear_usuario(nombre, email, password_cifrada)

    #No devuelvo la contraseña al frontend
    usuario_creado.pop("password")

    return jsonify({
        "mensaje": "Usuario registrado correctamente",
        "usuario": usuario_creado
    }), 201

#POST /auth/login -> inicio de sesion de un usuario
@app.route("/auth/login", methods=["POST"])
def login():
    datos = request.get_json()

    if not datos:
        return devolver_error("No se han enviado datos", 400)

    email = datos.get("email", "").strip().lower()
    password = datos.get("password", "")

    if email == "":
        return devolver_error("El email es obligatorio", 400)

    if password == "":
        return devolver_error("La contraseña es obligatoria", 400)

    usuario = obtener_usuario_por_email(email)

    if usuario is None:
        return devolver_error("Email o contraseña incorrectos", 401)

    #Compruebo la contraseña enviada con la contraseña cifrada de la base de datos
    if not check_password_hash(usuario["password"], password):
        return devolver_error("Email o contraseña incorrectos", 401)

    #Guardo datos basicos del usuario en la sesion
    session["usuario_id"] = usuario["id"]
    session["usuario_rol"] = usuario["rol"]

    token = crear_token_jwt(usuario)

    usuario.pop("password")

    return jsonify({
        "mensaje": "Login correcto",
        "token": token,
        "usuario": {
            "id": usuario["id"],
            "nombre": usuario["nombre"],
            "email": usuario["email"],
            "rol": usuario["rol"]
        }
    }), 200

#GET /auth/perfil -> devuelve el usuario conectado
@app.route("/auth/perfil", methods=["GET"])
def perfil_usuario():
    if not usuario_esta_conectado():
        return devolver_error("No hay usuario conectado", 401)

    usuario_id = obtener_id_usuario_conectado()
    usuario = obtener_usuario_por_id(usuario_id)

    if usuario is None:
        return devolver_error("Usuario no encontrado", 404)

    usuario.pop("password")

    return jsonify({
        "usuario": usuario
    }), 200

#POST /auth/logout -> cierra la sesion del usuario
@app.route("/auth/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({
        "mensaje": "Sesion cerrada correctamente"
    }), 200

#GET /auth/admin -> prueba para comprobar si el usuario es admin
@app.route("/auth/admin", methods=["GET"])
@requiere_admin
def zona_admin():
    return jsonify({
        "mensaje": "Bienvenido a la zona de administrador"
    }), 200


@app.route("/viajes", methods=["GET"])
def obtener_viajes():
    if usuario_esta_conectado():
        if usuario_es_admin():
            viajes = obtener_todos_los_viajes()
        else:
            viajes = obtener_viajes_visibles_cliente(obtener_id_usuario_conectado())
    else:
        viajes = obtener_viajes_visibles_cliente(None)

    viajes_con_permisos = []

    for viaje in viajes:
        viajes_con_permisos.append(añadir_permisos_viaje(viaje))

    return jsonify(viajes_con_permisos)

#GET /viajes/destacados -> devuelve solo los viajes destacados desde PostgreSQL
@app.route("/viajes/destacados", methods=["GET"])
def obtener_destacados():
    viajes_destacados = obtener_viajes_destacados()

    return jsonify(viajes_destacados)

@app.route("/viajes/<int:id>", methods=["GET"])
def obtener_viajes_id(id):
    viaje = obtener_viaje_por_id(id)

    if viaje is None:
        return devolver_error("Viaje no encontrado", 404)

    viaje = añadir_permisos_viaje(viaje)

    return jsonify(viaje)

#POST /viajes -> crea un viaje nuevo en PostgreSQL
@app.route("/viajes", methods=["POST"])
def crear_viaje():

    if not usuario_esta_conectado():
        return devolver_error("Debes iniciar sesion para crear viajes", 401)
    
    #Recojo el JSON que manda el frontend
    nuevo_viaje = request.get_json()

    #Valido los campos y añado valores por defecto
    nuevo_viaje, error = preparar_viaje_recibido(nuevo_viaje)

    if error:
        return devolver_error(error, 400)

    usuario_id = obtener_id_usuario_conectado()

    detalles = nuevo_viaje["detalles"]

    if existe_viaje_usuario(
        nuevo_viaje["destino"],
        detalles["fecha"],
        detalles["duracion"],
        usuario_id
    ):
        return devolver_error("Ya tienes un viaje igual creado para esa fecha y duración", 409)

    #Creo el viaje en la base de datos y guardo el usuario que lo ha creado
    viaje_creado = crear_viaje_bd(nuevo_viaje, usuario_id)

    return jsonify(viaje_creado), 201

#Funcion para comprobar si solo ha cambiado el favorito en los viajes destacados
def solo_cambia_favorito(viaje_original, viaje_nuevo):
    detalles_originales = viaje_original["detalles"]
    detalles_nuevos = viaje_nuevo["detalles"]

    if viaje_original["destino"] != viaje_nuevo["destino"]:
        return False

    if viaje_original["pais"] != viaje_nuevo["pais"]:
        return False

    if viaje_original["imagen"] != viaje_nuevo["imagen"]:
        return False

    if viaje_original["alt"] != viaje_nuevo["alt"]:
        return False

    campos_detalles = ["descripcion", "fecha", "duracion", "tipo", "estado"]

    for campo in campos_detalles:
        if str(detalles_originales[campo]) != str(detalles_nuevos[campo]):
            return False

    if float(detalles_originales["presupuesto"]) != float(detalles_nuevos["presupuesto"]):
        return False

    return detalles_originales["favorito"] != detalles_nuevos["favorito"]

#PUT /viajes/<id> -> edita un viaje en PostgreSQL
@app.route("/viajes/<int:id>", methods=["PUT"])
def editar_viaje(id):
    if not usuario_esta_conectado():
        return devolver_error("Debes iniciar sesion para editar viajes", 401)

    #Busco primero el viaje original
    viaje_original = obtener_viaje_por_id(id)

    if viaje_original is None:
        return jsonify({
            "error": "Viaje no encontrado",
            "mensaje": "Este viaje no existe. Puedes crearlo como un nuevo viaje.",
            "accion": "crear",
            "ruta_post": "/viajes"
        }), 404

    datos_actualizados = request.get_json()

    #Valido los campos y añado valores por defecto
    datos_actualizados, error = preparar_viaje_recibido(datos_actualizados)

    if error:
        return devolver_error(error, 400)

    #Si el viaje es destacado, solo permito cambiar el favorito
    if viaje_original["destacado"] == True:
        if not solo_cambia_favorito(viaje_original, datos_actualizados):
            return devolver_error("Este viaje es destacado y no se puede editar", 403)

    #Si el viaje fue creado por un admin, los clientes no lo pueden editar
    elif viaje_fue_creado_por_admin(viaje_original) and not usuario_es_admin():
        if not solo_cambia_favorito(viaje_original, datos_actualizados):
            return devolver_error("Este viaje fue creado por el admin y solo se puede leer", 403)

    else:
        #Si no es destacado ni bloqueado, compruebo permisos normales
        if not usuario_puede_modificar_viaje(viaje_original):
            return devolver_error("No tienes permisos para editar este viaje", 403)

    #Actualizo el viaje en la base de datos
    viaje_actualizado = actualizar_viaje_bd(id, datos_actualizados)

    viaje_actualizado = añadir_permisos_viaje(viaje_actualizado)

    return jsonify({
        "mensaje": "Viaje actualizado correctamente",
        "viaje": viaje_actualizado
    }), 200

#DELETE /viajes/<id> -> elimina un viaje en PostgreSQL
@app.route("/viajes/<int:id>", methods=["DELETE"])
def eliminar_viaje(id):
    if not usuario_esta_conectado():
        return devolver_error("Debes iniciar sesion para eliminar viajes", 401)

    #Busco primero el viaje para comprobar si existe
    viaje = obtener_viaje_por_id(id)

    if viaje is None:
        return devolver_error("Viaje no encontrado", 404)

    #Si el viaje es destacado, no dejo eliminarlo
    if viaje["destacado"] == True:
        return devolver_error("Este viaje es destacado y no se puede eliminar", 403)

    #Si el viaje fue creado por un admin, los clientes no lo pueden eliminar
    if viaje_fue_creado_por_admin(viaje) and not usuario_es_admin():
        return devolver_error("Este viaje fue creado por el admin y solo se puede leer", 403)

    #Si no es admin, solo puede eliminar sus propios viajes
    if not usuario_puede_modificar_viaje(viaje):
        return devolver_error("No tienes permisos para eliminar este viaje", 403)

    #Elimino el viaje de la base de datos
    viaje_eliminado = eliminar_viaje_bd(id)

    return jsonify({
        "mensaje": "Viaje eliminado correctamente",
        "viaje_eliminado": viaje_eliminado
    }), 200


if __name__ == "__main__":
    app.run(debug=True)