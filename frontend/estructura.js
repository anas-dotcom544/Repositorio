//Funcion para obtener los contenedores comunes sin crear conflictos
function obtenerContenedoresEstructura() {
    return {
        header: document.querySelector("#contenedor-header"),
        footer: document.querySelector("#contenedor-footer")
    };
}

//Funcion para pintar el header del index
function pintarHeaderIndex() {
    const contenedores = obtenerContenedoresEstructura();
    contenedores.header.innerHTML = `
        <header class="cabecera-principal">
            <nav class="navbar navbar-expand-lg navbar-viajes">
                <div class="container">
                    <a class="navbar-brand logo-web" href="index.html">
                        <img src="img/logo.png" alt="Logo de Planificador de Viajes">
                    </a>
            
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="menuPrincipal">
                        <div class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                            <a class="nav-link enlace-navbar active" href="index.html">Inicio</a>
                            <a class="nav-link enlace-navbar" href="viajes.html">Mis viajes</a>
                            <a class="nav-link enlace-navbar" href="favoritos.html">Favoritos</a>

                            <a class="usuario-navbar d-none" id="usuario-navbar" href="perfil.html">
                                🧭 Usuario
                            </a>
                            <a class="btn btn-login-navbar" href="login.html" id="enlace-login">
                                👤 Login
                            </a>
                            <button class="btn btn-logout-navbar d-none" id="boton-logout" type="button">
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <section class="hero container">
                <div class="row align-items-center">
                    <div class="col-md-7">
                        <h1>Organiza tu próxima aventura</h1>

                        <p class="subtitulo">
                            Guarda tus destinos, controla tu presupuesto y prepara
                            tus viajes favoritos de una forma sencilla.
                        </p>

                        <div class="botones-hero">
                            <a href="viajes.html" class="btn btn-principal">
                                Ver mis viajes
                            </a>
                        </div>
                    </div>

                    <div class="col-md-5">
                        <div class="tarjeta-resumen">
                            <h2>Tu viaje empieza aquí</h2>
                            <p>
                                Planifica destinos, fechas, estados y presupuestos
                                desde una sola página.
                            </p>

                            <ul>
                                <li>Destinos organizados</li>
                                <li>Presupuesto controlado</li>
                                <li>Favoritos con estrella</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </header>
    `;
}


//Funcion para pintar el header de viajes
function pintarHeaderViajes() {
    const contenedores = obtenerContenedoresEstructura();
    contenedores.header.innerHTML = `
        <header class="cabecera-viajes">
            <nav class="navbar navbar-expand-lg navbar-viajes">
                <div class="container">
                    <a class="navbar-brand logo-web" href="index.html">
                        <img src="img/logo.png" alt="Logo de Planificador de Viajes">
                    </a>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="menuPrincipal">
                        <div class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                            <a class="nav-link enlace-navbar" href="index.html">Inicio</a>
                            <a class="nav-link enlace-navbar active" href="viajes.html">Mis viajes</a>
                            <a class="nav-link enlace-navbar" href="favoritos.html">Favoritos</a>

                            <a class="usuario-navbar d-none" id="usuario-navbar" href="perfil.html">
                                🧭 Usuario
                            </a>

                            <button class="btn btn-logout-navbar d-none" id="boton-logout" type="button">
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <section class="container hero-viajes">
                <h1>Mis viajes</h1>
                <p>
                    Añade tus destinos, organiza fechas, controla presupuestos y
                    marca con una estrella los viajes que más te ilusionan.
                </p>
            </section>
        </header>
    `;
}


//Funcion para pintar el header de favoritos
function pintarHeaderFavoritos() {
    const contenedores = obtenerContenedoresEstructura();
    contenedores.header.innerHTML = `
        <header class="cabecera-viajes">
            <nav class="navbar navbar-expand-lg navbar-viajes">
                <div class="container">
                    <a class="navbar-brand logo-web" href="index.html">
                        <img src="img/logo.png" alt="Logo de Planificador de Viajes">
                    </a>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="menuPrincipal">
                        <div class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                            <a class="nav-link enlace-navbar" href="index.html">Inicio</a>
                            <a class="nav-link enlace-navbar" href="viajes.html">Mis viajes</a>
                            <a class="nav-link enlace-navbar active" href="favoritos.html">Favoritos</a>

                            <a class="usuario-navbar d-none" id="usuario-navbar" href="perfil.html">
                                🧭 Usuario
                            </a>

                            <button class="btn btn-logout-navbar d-none" id="boton-logout" type="button">
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <section class="container hero-viajes">
                <h1>Viajes favoritos</h1>
                <p>
                    Consulta rápidamente los destinos que has marcado con estrella.
                </p>
            </section>
        </header>
    `;
}

//Funcion para pintar el header de perfil
function pintarHeaderPerfil() {
    const contenedores = obtenerContenedoresEstructura();
    contenedores.header.innerHTML = `
        <header class="cabecera-viajes">
            <nav class="navbar navbar-expand-lg navbar-viajes">
                <div class="container">
                    <a class="navbar-brand logo-web" href="index.html">
                        <img src="img/logo.png" alt="Logo de Planificador de Viajes">
                    </a>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="menuPrincipal">
                        <div class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                            <a class="nav-link enlace-navbar" href="index.html">Inicio</a>
                            <a class="nav-link enlace-navbar" href="viajes.html">Mis viajes</a>
                            <a class="nav-link enlace-navbar" href="favoritos.html">Favoritos</a>

                            <a class="usuario-navbar d-none" id="usuario-navbar" href="perfil.html">
                                🧭 Usuario
                            </a>

                            <button class="btn btn-logout-navbar d-none" id="boton-logout" type="button">
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <section class="container hero-viajes">
                <h1>Mi perfil</h1>
                <p>
                    Consulta tus datos personales y el resumen de tus viajes.
                </p>
            </section>
        </header>
    `;
}


//Funcion para elegir que header se pinta segun la pagina
function pintarHeader() {
    const contenedores = obtenerContenedoresEstructura();

    if (!contenedores.header) {
        return;
    }

    if (document.body.classList.contains("pagina-index")) {
        pintarHeaderIndex();
    }

    if (document.body.classList.contains("pagina-viajes")) {
        pintarHeaderViajes();
    }

    if (document.body.classList.contains("pagina-favoritos")) {
        pintarHeaderFavoritos();
    }

    if (document.body.classList.contains("pagina-perfil")) {
        pintarHeaderPerfil();
    }
}


//Footer comun
function pintarFooter() {
    const contenedores = obtenerContenedoresEstructura();

    if (!contenedores.footer) {
        return;
    }

    contenedores.footer.innerHTML = `
        <footer class="pie-pagina">
            <div class="container">
                <p>Proyecto Orion AIOT - Anas Afkir Slimani</p>
            </div>
        </footer>
    `;
}