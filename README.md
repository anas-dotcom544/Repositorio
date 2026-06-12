# Fase 4 Fullstack

En esta fase he unido el frontend de la fase 2 con el backend de la fase 3 para crear una aplicación fullstack.

El proyecto es un Planificador de Viajes. Permite ver viajes, registrarse, iniciar sesión y gestionar viajes desde el navegador.

----

* Tecnologías usadas

- HTML
- CSS
- JavaScript
- Bootstrap
- Python
- Flask
- PostgreSQL
- Docker

---

* Estructura del proyecto

fase4_fullstack/
├── app.py
├── db.py
├── migration.py
├── insertar_datos.py
├── usuarios_datos.py
├── viajes_datos.py
├── costes_datos.py
├── crear_admin.py
├── test_app.py
├── requirements.txt
├── docker-compose.yml
├── .env
├── .env.example
├── README.md
├── seed/
│   ├── viajes.json
│   ├── opciones_info.json
│   ├── tarjetas_presupuesto.json
│   └── costes_pais.json
└── frontend/
    ├── index.html
    ├── viajes.html
    ├── favoritos.html
    ├── login.html
    ├── signup.html
    ├── api.js
    ├── app.js
    ├── auth.js
    ├── campos.js
    ├── config.js
    ├── estructura.js
    ├── favoritos.js
    ├── filtros.js
    ├── formulario.js
    ├── modal.js
    ├── navbar-auth.js
    ├── paginacion.js
    └── style.css

---

* Qué hace la aplicación

La aplicación permite:

ver viajes disponibles
ver viajes destacados
registrarse
iniciar sesión
cerrar sesión
crear viajes
editar viajes
eliminar viajes
marcar viajes como favoritos

También tiene usuarios con roles:

cliente
admin

El cliente puede gestionar sus propios viajes.
El administrador puede ver y gestionar más viajes.

---

* Base de datos 

Uso PostgreSQL como base de datos.

Las tablas principales son:

usuarios
viajes
costes_pais

La tabla usuarios guarda los usuarios registrados.

La tabla viajes guarda la información de los viajes.

La tabla costes_pais guarda el coste diario de cada país. Esto sirve para calcular el presupuesto si el usuario no lo escribe manualmente.

---

* Endpoints principales

**Usuarios**

POST /auth/signup
Registra un usuario nuevo.

POST /auth/login
Inicia sesión.

GET /auth/perfil
Devuelve el usuario conectado.

POST /auth/logout
Cierra la sesión.

**Viajes**

GET /viajes
Devuelve los viajes.

GET /viajes/destacados
Devuelve los viajes destacados.

GET /viajes/<id>
Devuelve un viaje concreto.

POST /viajes
Crea un viaje nuevo. Hay que estar logueado.

PUT /viajes/<id>
Edita un viaje.

DELETE /viajes/<id>
Elimina un viaje.

---

* Cómo ejecutar el proyecto

Primero levanto la base de datos con Docker:

**docker-compose up -d**

Después creo las tablas:

**python migration.py**

Luego inserto los datos iniciales:

**python insertar_datos.py**

Creo el usuario administrador:

**python crear_admin.py**

Y por último inicio Flask:

**python app.py**

El backend se ejecuta en:

http://127.0.0.1:5000

Para abrir el frontend uso los archivos HTML que están dentro de la carpeta frontend.

---

* Usuarios de prueba

Cliente:

Email: anas@email.com
Contraseña: 123456

Administrador:

Email: admin@email.com
Contraseña: admin123

---

* Mejoras hechas en esta fase

En esta fase he añadido:

- conexión entre frontend y backend
- registro y login
- sesiones con Flask
- roles de cliente y administrador 
- permisos para editar y eliminar viajes
- conexión con PostgreSQL
- datos iniciales en la carpeta seed
- tabla para los costes por país
- validaciones en el backend
- archivo config.js para guardar la URL del backend

---

* Estado actual

El proyecto funciona como una aplicación fullstack básica de viajes.
Todavía se podría mejorar, pero ya permite trabajar con frontend, backend y base de datos juntos.