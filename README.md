**EN** | [ES](README.es.md)

# Travel Planner Project

This project is a full-stack travel planning application.

It allows users to view trips, register, log in, log out, manage trips from the browser, and mark trips as favorites.

The project connects a frontend built with HTML, CSS, JavaScript, and Bootstrap to a backend built with Flask and a PostgreSQL database running with Docker.

---

## Technologies Used

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
- Git and GitHub

---

## Project Structure

```text
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
```

---

## What the Application Does

The application allows users to:

- View available trips
- View featured trips
- Register
- Log in
- Log out
- View the profile of the logged-in user
- Create trips
- Edit trips
- Delete trips
- Mark trips as favorites
- Search and filter trips
- View favorite trips on a separate page

It also has users with different roles:

- Client
- Admin

Clients can manage their own trips.

Administrators can view and manage more trips.

---

## Database

I use PostgreSQL as the database.

The main tables are:

- `usuarios`
- `roles`
- `viajes`
- `costes_pais`

The usuarios table stores registered users.

The roles table stores the available roles in the application.

The viajes table stores trip information.

The costes_pais table stores the daily cost for each country. This is used to calculate the budget if the user does not enter it manually.

The database runs with Docker.

In my case, I use external port 5433 to avoid conflicts with other PostgreSQL installations on the computer.

### Recommended Settings for DBeaver

```text
Host: 127.0.0.1
Port: 5433
Database: planificador_viajes
Username: user
Password: 123456
```

---

## Environment Variables

The `.env` file is used to store private information and is not uploaded to the repository.

To show which variables the project requires, I have included a `.env.example` file.

### Example

```env
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=planificador_viajes
DB_USER=user
DB_PASSWORD=123456

FLASK_SECRET_KEY=cambia_esta_clave
JWT_SECRET_KEY=cambia_esta_clave_jwt
JWT_EXPIRATION_HOURS=2
```

---

## Security

The Flask secret key is no longer written directly in `app.py`. It is now read from the `.env` file.

User passwords are stored securely using hashing.

During login, the hashed password is verified instead of comparing plain text passwords.

JWT has also been added to improve how the application works as a REST API.

When a user logs in, the backend returns a token, and the frontend stores it in `localStorage`.

After that, to create, edit, delete, or save favorites, the frontend sends the token in the `Authorization` header.

Flask sessions are also still used as additional support.

---

## Main Endpoints

### Users

**POST `/auth/signup`**  
Registers a new user.

**POST `/auth/login`**  
Logs in and returns a JWT token.

**GET `/auth/perfil`**  
Returns the logged-in user.

**POST `/auth/logout`**  
Logs out.

**GET `/auth/admin`**  
Protected route for administrators only.

### Trips

**GET `/viajes`**  
Returns the trips.

**GET `/viajes/destacados`**  
Returns the featured trips.

**GET `/viajes/<id>`**  
Returns a specific trip.

**POST `/viajes`**  
Creates a new trip. The user must be logged in.

**PUT `/viajes/<id>`**  
Edits a trip. The user must be logged in.

**DELETE `/viajes/<id>`**  
Deletes a trip. The user must be logged in.

---

## How to Run the Project

First, I start the database with Docker:

```bash
docker compose up -d
```

Then I create the tables:

```bash
python migration.py
```

Next, I insert the initial data:

```bash
python insertar_datos.py
```

I create the administrator user:

```bash
python crear_admin.py
```

Finally, I start Flask:

```bash
python app.py
```

The backend runs at:

http://127.0.0.1:5000

To open the frontend, I use the HTML files located inside the frontend folder.

For example:

- `frontend/index.html`
- `frontend/viajes.html`
- `frontend/login.html`
- `frontend/signup.html`

---

## If the Database Is Deleted

If I run:

```bash
docker compose down
```

the container is removed, but the data is usually preserved because the volume still exists.

If I run:

```bash
docker compose down -v
```

the volume is also deleted, and all tables, trips, and users are lost.

After deleting the volume, the following commands must be run again:

```bash
python migration.py
python crear_admin.py
python insertar_datos.py
```

Users created manually through the website are lost and must register again.

---

## Test Users

### Client

**Email:** anas@email.com  
**Password:** Password1

### Administrator

**Email:** admin@email.com  
**Password:** Password1

Passwords must meet strong validation requirements:

- Minimum 8 characters
- One uppercase letter
- One lowercase letter
- One number

---

## Improvements Made

In this project, I have added:

- Connection between frontend and backend
- Registration and login
- Logout
- Logged-in user profile
- Flask sessions
- JWT
- Client and administrator roles
- Separate roles table
- Permissions to edit and delete trips
- Decorator to protect administrator routes
- PostgreSQL connection
- Docker to run the database
- Use of DBeaver to inspect the database
- Initial data in the seed folder
- Table for costs by country
- Backend validations
- Strong password validation
- Hashed passwords
- `config.js` file to store the backend URL
- `.env` file for private variables
- `.env.example` file as a template
- Responsive design with Bootstrap
- Favorites page
- Trip filters and search
- Pagination
- Modals for notifications and confirmations
- Visual improvements to buttons, forms, and cards

---

## Files That Are Not Uploaded

The following files are not uploaded to the repository:

```text
.env
__pycache__/
*.pyc
venv/
```

These files are ignored using `.gitignore`.

The `.env` file is not uploaded because it contains private keys and information.

---

## Repository

The project is stored on GitHub as a personal project.

To upload new changes, I use:

```bash
git add .
git commit -m "commit message"
git push origin main
```

---

## Current Status

The project works as a full-stack travel application.

It allows the frontend, backend, and database to work together.

It also includes authentication, roles, JWT, favorites, filters, pagination, and visual improvements.

There is still room for improvement, but it already has a complete structure for a first-year Higher Vocational Training project in Web Application Development (DAW).
