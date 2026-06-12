# Proyecto Planificador de Viajes

Este proyecto es una aplicación fullstack de planificación de viajes.

Permite ver viajes, registrarse, iniciar sesión, cerrar sesión, gestionar viajes desde el navegador y marcar viajes como favoritos.

El proyecto une un frontend hecho con HTML, CSS, JavaScript y Bootstrap con un backend hecho con Flask y una base de datos PostgreSQL levantada con Docker.

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
- DBeaver
- JWT
- Git y GitHub

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
├── .env.example
├── .gitignore
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
    ├── style.css
    └── img/

---

* Qué hace la aplicación

La aplicación permite:

ver viajes disponibles  
ver viajes destacados  
registrarse  
iniciar sesión  
cerrar sesión  
ver el perfil del usuario conectado  
crear viajes  
editar viajes  
eliminar viajes  
marcar viajes como favoritos  
buscar y filtrar viajes  
ver viajes favoritos en una página separada  

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
roles  
viajes  
costes_pais  

La tabla usuarios guarda los usuarios registrados.

La tabla roles guarda los roles disponibles de la aplicación.

La tabla viajes guarda la información de los viajes.

La tabla costes_pais guarda el coste diario de cada país. Esto sirve para calcular el presupuesto si el usuario no lo escribe manualmente.

La base de datos se levanta con Docker.

En mi caso uso el puerto externo 5433 para evitar conflictos con otros PostgreSQL instalados en el ordenador.

Datos recomendados para DBeaver:

Host: 127.0.0.1  
Port: 5433  
Database: planificador_viajes  
Username: user  
Password: 123456  

---

* Variables de entorno

El archivo `.env` se usa para guardar datos privados y no se sube al repositorio.

Para saber qué variables necesita el proyecto he dejado un archivo `.env.example`.

Ejemplo:

DB_HOST=127.0.0.1  
DB_PORT=5433  
DB_NAME=planificador_viajes  
DB_USER=user  
DB_PASSWORD=123456  

FLASK_SECRET_KEY=cambia_esta_clave  
JWT_SECRET_KEY=cambia_esta_clave_jwt  
JWT_EXPIRATION_HOURS=2  

---

* Seguridad

La clave secreta de Flask ya no está escrita directamente en app.py, ahora se lee desde el archivo `.env`.

Las contraseñas de los usuarios se guardan cifradas usando hash.

En el login se comprueba la contraseña cifrada y no se compara texto plano.

También se ha añadido JWT para trabajar mejor como API REST.

Cuando el usuario inicia sesión, el backend devuelve un token y el frontend lo guarda en localStorage.

Después, para crear, editar, eliminar o guardar favoritos, el frontend manda el token en la cabecera Authorization.

También se siguen usando sesiones de Flask como apoyo.

---

* Endpoints principales

**Usuarios**

POST /auth/signup  
Registra un usuario nuevo.

POST /auth/login  
Inicia sesión y devuelve un token JWT.

GET /auth/perfil  
Devuelve el usuario conectado.

POST /auth/logout  
Cierra la sesión.

GET /auth/admin  
Ruta protegida solo para administradores.

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
Edita un viaje. Hay que estar logueado.

DELETE /viajes/<id>  
Elimina un viaje. Hay que estar logueado.

---

* Cómo ejecutar el proyecto

Primero levanto la base de datos con Docker:

**docker compose up -d**

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

Por ejemplo:

frontend/index.html  
frontend/viajes.html  
frontend/login.html  
frontend/signup.html  

---

* Si se borra la base de datos

Si ejecuto:

**docker compose down**

se borra el contenedor, pero normalmente se mantienen los datos porque el volumen sigue existiendo.

Si ejecuto:

**docker compose down -v**

se borra también el volumen y se pierden las tablas, viajes y usuarios.

Después de borrar el volumen hay que ejecutar otra vez:

**python migration.py**  
**python crear_admin.py**  
**python insertar_datos.py**

Los usuarios creados manualmente desde la web se pierden y hay que registrarlos otra vez.

---

* Usuarios de prueba

Cliente:

Email: anas@email.com  
Contraseña: Password1  

Administrador:

Email: admin@email.com  
Contraseña: Password1  

Las contraseñas tienen que cumplir validación fuerte:

mínimo 8 caracteres  
una letra mayúscula  
una letra minúscula  
un número  

---

* Mejoras hechas

En este proyecto he añadido:

- conexión entre frontend y backend
- registro y login
- logout
- perfil de usuario conectado
- sesiones con Flask
- JWT
- roles de cliente y administrador
- tabla roles separada
- permisos para editar y eliminar viajes
- decorador para proteger rutas de administrador
- conexión con PostgreSQL
- Docker para levantar la base de datos
- uso de DBeaver para revisar la base de datos
- datos iniciales en la carpeta seed
- tabla para los costes por país
- validaciones en el backend
- validación fuerte de contraseña
- contraseñas cifradas
- archivo config.js para guardar la URL del backend
- archivo .env para variables privadas
- archivo .env.example como plantilla
- diseño responsive con Bootstrap
- página de favoritos
- filtros y búsqueda de viajes
- paginación
- modales para avisos y confirmaciones
- mejoras visuales en botones, formularios y tarjetas

---

* Archivos que no se suben

No se suben al repositorio:

.env  
__pycache__/  
*.pyc  
venv/  

Estos archivos están ignorados con `.gitignore`.

El archivo `.env` no se sube porque contiene claves y datos privados.

---

* Repositorio

El proyecto está guardado en GitHub como proyecto personal.

Para subir cambios nuevos uso:

**git add .**  
**git commit -m "mensaje del cambio"**  
**git push origin main**

---

* Estado actual

El proyecto funciona como una aplicación fullstack de viajes.

Permite trabajar con frontend, backend y base de datos juntos.

También tiene autenticación, roles, JWT, favoritos, filtros, paginación y mejoras visuales.

Todavía se podría mejorar, pero ya tiene una estructura completa para un proyecto fullstack de 1º DAW.