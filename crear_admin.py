from werkzeug.security import generate_password_hash
from usuarios_datos import obtener_usuario_por_email, crear_usuario


#Funcion para crear un usuario admin de prueba
def crear_admin():
    nombre = "Admin"
    email = "admin@email.com"
    password = "admin123"

    usuario_existente = obtener_usuario_por_email(email)

    if usuario_existente is not None:
        print("El usuario admin ya existe")
        return

    #Aunque la columna se llama password, guardo la contraseña cifrada
    password_cifrada = generate_password_hash(password)

    crear_usuario(nombre, email, password_cifrada, "admin")

    print("Usuario admin creado correctamente")


if __name__ == "__main__":
    crear_admin()