//Contenedores principales donde se carga el contenido de la página.
let contenedores = {
    header: document.querySelector("#contenedor-header"),
    footer: document.querySelector("#contenedor-footer"),
    info: document.querySelector("#contenedor-info"),
    destinos: document.querySelector("#contenedor-destinos"),
    presupuestos: document.querySelector("#contenedor-presupuestos"),
    viajes: document.querySelector("#contenedor-viajes"),
    favoritos: document.querySelector("#contenedor-favoritos"),
    paginacion: document.querySelector("#paginacion-viajes")
};

//Variable para guardar el usuario conectado
let usuarioConectadoApp = null;

//Objeto para gestionar la lista de viajes que viene del backend
let gestorViajes = {
    lista: [],

    guardar: function (nuevosViajes) {
        this.lista = nuevosViajes;
    },

    obtenerTodos: function () {
        return this.lista;
    },

    buscarPorId: function (id) {
        return this.lista.find(function (viaje) {
            return viaje.id == id;
        });
    },

    actualizarUno: function (id, viajeActualizado) {
        for (let i = 0; i < this.lista.length; i++) {
            if (this.lista[i].id == id) {
                this.lista[i] = viajeActualizado;
            }
        }
    },

    eliminarUno: function (id) {
        this.lista = this.lista.filter(function (viaje) {
            return viaje.id != id;
        });
    }
};

//Variable para saber si estamos editando un viaje
let idEditando = null;

//Variable para confirmar eliminar un viaje
let idPendienteEliminar = null;

//Variables para el put si quieres editar sin que exista un viaje
let modoCrearDesdePut = false;
let datosPendientesCrear = null;

//Seccion index: "¿Qué puedes organizar?"
async function pintarSeccionInfo() {
    if (!contenedores.info) {
        return;
    }

    try {
        let respuesta = await fetch("../seed/opciones_info.json");
        let opciones = await respuesta.json();

        let contenidoOpciones = "";

        for (let i = 0; i < opciones.length; i++) {
            contenidoOpciones += `
                <article class="col-md-4 mb-4">
                    <div class="caja-info">
                        <h3>${opciones[i].titulo}</h3>
                        <p>${opciones[i].texto}</p>
                    </div>
                </article>
            `;
        }

        contenedores.info.innerHTML = contenidoOpciones;

    } catch (error) {
        console.log("Error al cargar la sección de información:", error);
    }
}


//Destinos destacados index
async function pintarDestinosDestacados() {
    if (!contenedores.destinos) {
        return;
    }

    try {
        let destinos = await apiViajes.obtenerDestacados();

        if (!destinos) {
            return;
        }

        let contenidoDestinos = "";

        for (let i = 0; i < destinos.length; i++) {
            let detalles = destinos[i].detalles || {};

            contenidoDestinos += `
                <article class="col-md-4 mb-4">
                    <div class="card card-destino">
                        <img
                            src="${destinos[i].imagen}"
                            class="card-img-top"
                            alt="${destinos[i].alt}"
                        />

                        <div class="card-body">
                            <h3 class="card-title">${destinos[i].destino}</h3>
                            <p class="card-text">
                                ${detalles.descripcion || "Viaje sin descripción."}
                            </p>
                        </div>
                    </div>
                </article>
            `;
        }

        contenedores.destinos.innerHTML = contenidoDestinos;

    } catch (error) {
        console.log("Error al cargar los destinos destacados:", error);
    }
}

//Funcion para cargar los viajes desde Flask
async function cargarViajesBackend(mantenerPagina = true) {
    try {
        let paginaAntes = gestorPaginacion.paginaActual;

        let viajes = await apiViajes.obtenerTodos();

        if (!viajes) {
            return;
        }

        gestorViajes.guardar(viajes);

        if (mantenerPagina) {
            gestorPaginacion.paginaActual = paginaAntes;
        } else {
            gestorPaginacion.paginaActual = 1;
        }

        actualizarPaginaViajes();

    } catch (error) {
        console.log("Error al cargar los viajes:", error);
        alert("No se han podido cargar los viajes desde el backend");
    }
}

//Cargamos los países en el filtro
function cargarFiltroPaises() {
    if (!filtrosViajes.pais) {
        return;
    }

    let paisSeleccionadoAntes = filtrosViajes.pais.value;
    let paises = [];

    //Guardamos los países sin repetir
    let viajes = gestorViajes.obtenerTodos();

    for (let i = 0; i < viajes.length; i++) {
        if (!paises.includes(viajes[i].pais)) {
            paises.push(viajes[i].pais);
        }
    }

    //Limpiamos las opciones anteriores del select
    filtrosViajes.pais.innerHTML = "";

    //Creamos la opción inicial "Todos"
    let opcionTodos = document.createElement("option");
    opcionTodos.value = "";
    opcionTodos.textContent = "Todos";
    filtrosViajes.pais.appendChild(opcionTodos);

    //Creamos una option por cada país
    for (let i = 0; i < paises.length; i++) {
        let opcionPais = document.createElement("option");
        opcionPais.value = paises[i];
        opcionPais.textContent = paises[i];

        filtrosViajes.pais.appendChild(opcionPais);
    }

    //Si antes había un país seleccionado, intentamos mantenerlo
    filtrosViajes.pais.value = paisSeleccionadoAntes;
}

//Tarjetas que se muestran en el resumen de presupuestos
let tarjetasPresupuesto = [];

//Funcion para cargar la configuracion de las tarjetas de presupuesto desde JSON
async function cargarTarjetasPresupuesto() {
    try {
        let respuesta = await fetch("../seed/tarjetas_presupuesto.json");
        tarjetasPresupuesto = await respuesta.json();

    } catch (error) {
        console.log("Error al cargar las tarjetas de presupuesto:", error);

        tarjetasPresupuesto = [
            {
                clave: "total",
                titulo: "Total"
            },
            {
                clave: "Pendiente",
                titulo: "Pendientes"
            },
            {
                clave: "Reservado",
                titulo: "Reservados"
            },
            {
                clave: "media",
                titulo: "Media"
            }
        ];
    }
}

//Presupuestos de viajes
function mostrarPresupuestos() {
    if (!contenedores.presupuestos) {
        return;
    }

    let importesPresupuesto = {
        total: 0,
        Pendiente: 0,
        Reservado: 0,
        media: 0
    };

    let viajes = gestorViajes.obtenerTodos();

    for (let i = 0; i < viajes.length; i++) {
        let detalles = viajes[i].detalles || {};
        let presupuesto = Number(detalles.presupuesto || 0);

        importesPresupuesto.total += presupuesto;

        if (importesPresupuesto[detalles.estado] != undefined) {
            importesPresupuesto[detalles.estado] += presupuesto;
        }
    }

    if (viajes.length > 0) {
        importesPresupuesto.media = Math.round(importesPresupuesto.total / viajes.length);
    }

    let contenidoPresupuestos = "";

    for (let i = 0; i < tarjetasPresupuesto.length; i++) {
        let tarjeta = tarjetasPresupuesto[i];

        contenidoPresupuestos += `
            <article class="col-md-3 col-sm-6 mb-3">
                <div class="caja-presupuesto">
                    <h3>${tarjeta.titulo}</h3>
                    <p>${importesPresupuesto[tarjeta.clave]} €</p>
                </div>
            </article>
        `;
    }

    contenedores.presupuestos.innerHTML = contenidoPresupuestos;
}

//Funcion para obtener viajes filtrados
//Filtra los viajes en el frontend usando la lista cargada desde el backend
function obtenerViajesFiltrados() {
    let filtros = gestorFiltros.obtener();
    let viajesFiltrados = [];
    let viajes = gestorViajes.obtenerTodos();

    for (let i = 0; i < viajes.length; i++) {
        if (cumpleFiltros(viajes[i], filtros)) {
            viajesFiltrados.push(viajes[i]);
        }
    }

    return viajesFiltrados;
}

//Funcion para cargar el usuario conectado en app.js
async function cargarUsuarioConectadoApp() {
    try {
        let resultado = await auth.perfil();

        if (resultado.respuesta.ok) {
            usuarioConectadoApp = resultado.datos.usuario;
        }
    } catch (error) {
        usuarioConectadoApp = null;
    }
}


//Funcion para saber si un viaje se debe mostrar como recomendacion
function viajeEsRecomendacion(viaje) {
    if (viaje.destacado == true) {
        return true;
    }

    if (viaje.solo_lectura == true) {
        return true;
    }

    if (usuarioConectadoApp && usuarioConectadoApp.rol == "admin") {
        return true;
    }

    return false;
}

//Funcion para crear el html de una carta de viaje
function crearHtmlViaje(viaje) {
    let detalles = viaje.detalles || {};

    let estrella = "☆";
    let textoFavorito = "Añadir a favoritos";

    if (detalles.favorito == true) {
        estrella = "★";
        textoFavorito = "Quitar de favoritos";
    }

    let botonesEditarEliminar = "";

    let listaDatosViaje = "";

    if (viajeEsRecomendacion(viaje)) {
        listaDatosViaje = `
            <li><strong>Mejor época:</strong> ${detalles.fecha || "Todo el año"}</li>
            <li><strong>Duración recomendada:</strong> ${detalles.duracion || 0} días</li>
            <li><strong>Presupuesto estimado:</strong> ${detalles.presupuesto || 0} €</li>
            <li><strong>Tipo:</strong> ${detalles.tipo || "Sin tipo"}</li>
        `;
    } else {
        listaDatosViaje = `
            <li><strong>Fecha:</strong> ${detalles.fecha || "Sin fecha"}</li>
            <li><strong>Duración:</strong> ${detalles.duracion || 0} días</li>
            <li><strong>Presupuesto:</strong> ${detalles.presupuesto || 0} €</li>
            <li><strong>Tipo:</strong> ${detalles.tipo || "Sin tipo"}</li>
            <li><strong>Estado:</strong> ${detalles.estado || "Sin estado"}</li>
        `;
    }

    if (!viaje.destacado && !viaje.solo_lectura) {
        botonesEditarEliminar = `
            <button class="btn btn-editar" data-id="${viaje.id}" title="Editar">
                ✏️
            </button>

            <button class="btn btn-eliminar" data-id="${viaje.id}" title="Eliminar">
                🗑️
            </button>
        `;
    }

    return `
        <article class="col-md-4 mb-4">
            <div class="card card-viaje">
                <img
                    src="${viaje.imagen}"
                    class="card-img-top ${viaje.imagen == "img/logo2.png" ? "imagen-logo2" : ""}"
                    alt="${viaje.alt}"
                />

                <div class="card-body">
                    <div class="titulo-card-viaje">
                        <h3 class="card-title">${viaje.destino}</h3>
                        <button
                            class="estrella boton-estrella"
                            data-id="${viaje.id}"
                            title="${textoFavorito}"
                            aria-label="${textoFavorito}"
                        >
                            ${estrella}
                        </button>
                    </div>

                    <p class="pais-viaje">${viaje.pais}</p>

                    <p class="card-text">
                        ${detalles.descripcion || "Viaje sin descripción."}
                    </p>

                    
                    <ul class="datos-viaje">
                        ${listaDatosViaje}
                    </ul>

                    <div class="botones-card">
                        <button class="btn btn-leer" data-id="${viaje.id}" title="Leer">
                            🔎
                        </button>

                        ${botonesEditarEliminar}
                    </div>
                </div>
            </div>
        </article>
    `;
}

//Cartas de viajes
function mostrarViajes() {
    if (!contenedores.viajes) {
        return;
    }

    let contenidoViajes = "";

    let viajesFiltrados = obtenerViajesFiltrados();

    gestorPaginacion.actualizarTotalItems(viajesFiltrados.length);

    let inicio = gestorPaginacion.inicio;
    let fin = gestorPaginacion.fin; 

    let viajesPagina = viajesFiltrados.slice(inicio, fin);

    for (let i = 0; i < viajesPagina.length; i++) {
        contenidoViajes += crearHtmlViaje(viajesPagina[i]);
    }

    if (contenidoViajes == "") {
        contenidoViajes = `
            <div class="col-12">
                <div class="mensaje-vacio">
                    <h3>No se han encontrado viajes</h3>
                    <p>Prueba con otro destino, país o estado.</p>
                </div>
            </div>
        `;
    }

    contenedores.viajes.innerHTML = contenidoViajes;

    mostrarPaginacion(viajesFiltrados.length);
}


//Paginación de viajes
function mostrarPaginacion(totalViajesMostrados) {
    if (!contenedores.paginacion) {
        return;
    }

    gestorPaginacion.actualizarTotalItems(totalViajesMostrados);

    let totalPaginas = gestorPaginacion.totalPaginas;
    let contenidoPaginacion = "";

    if (totalPaginas <= 1) {
        contenedores.paginacion.innerHTML = "";
        return;
    }

    let claseAnterior = "";

    if (gestorPaginacion.paginaActual == 1) {
        claseAnterior = "disabled";
    }

    contenidoPaginacion += `
        <li class="page-item ${claseAnterior}">
            <button class="page-link" data-pagina="anterior">
                Anterior
            </button>
        </li>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        let claseActiva = "";

        if (i == gestorPaginacion.paginaActual) {
            claseActiva = "active";
        }

        contenidoPaginacion += `
            <li class="page-item ${claseActiva}">
                <button class="page-link" data-pagina="${i}">
                    ${i}
                </button>
            </li>
        `;
    }

    let claseSiguiente = "";

    if (gestorPaginacion.paginaActual == totalPaginas) {
        claseSiguiente = "disabled";
    }

    contenidoPaginacion += `
        <li class="page-item ${claseSiguiente}">
            <button class="page-link" data-pagina="siguiente">
                Siguiente
            </button>
        </li>
    `;

    contenedores.paginacion.innerHTML = contenidoPaginacion;
}


//Funcion para reiniciar la pagina al buscar o filtrar
function reiniciarPaginaYMostrarViajes() {
    gestorPaginacion.paginaActual = 1;
    mostrarViajes();
}

//Buscador y filtros
function configurarFiltros() {
    let eventosFiltros = [
        {
            elemento: filtrosViajes.buscador,
            evento: "input",
            accion: reiniciarPaginaYMostrarViajes
        },
        {
            elemento: filtrosViajes.estado,
            evento: "change",
            accion: reiniciarPaginaYMostrarViajes
        },
        {
            elemento: filtrosViajes.pais,
            evento: "change",
            accion: reiniciarPaginaYMostrarViajes
        },
        {
            elemento: filtrosViajes.botonLimpiar,
            evento: "click",
            accion: function () {
                gestorFiltros.limpiar();
            }
        }
    ];

    for (let i = 0; i < eventosFiltros.length; i++) {
        if (eventosFiltros[i].elemento) {
            eventosFiltros[i].elemento.addEventListener(
                eventosFiltros[i].evento,
                eventosFiltros[i].accion
            );
        }
    }
}

//Eventos de la paginación
function configurarPaginacion() {
    if (contenedores.paginacion) {
        contenedores.paginacion.addEventListener("click", function (evento) {
            gestorPaginacion.gestionarClick(evento);
        });
    }
}

//Funcion para crear el html de favoritos
function crearHtmlFavorito(viaje) {
    let detalles = viaje.detalles || {};

    return `
        <article class="col-md-4 mb-4">
            <div class="card card-viaje">
                <img
                    src="${viaje.imagen}"
                    class="card-img-top ${viaje.imagen == "img/logo2.png" ? "imagen-logo2" : ""}"
                    alt="${viaje.alt}"
                />

                <div class="card-body">
                    <div class="titulo-card-viaje">
                        <h3 class="card-title">${viaje.destino}</h3>
                        <span class="estrella">★</span>
                    </div>

                    <p class="pais-viaje">${viaje.pais}</p>

                    <p class="card-text">
                        ${detalles.descripcion || "Viaje sin descripción."}
                    </p>

                    <ul class="datos-viaje">
                        <li><strong>Fecha:</strong> ${detalles.fecha || "Sin fecha"}</li>
                        <li><strong>Duración:</strong> ${detalles.duracion || 0} días</li>
                        <li><strong>Presupuesto:</strong> ${detalles.presupuesto || 0} €</li>
                        <li><strong>Tipo:</strong> ${detalles.tipo || "Sin tipo"}</li>
                        <li><strong>Estado:</strong> ${detalles.estado || "Sin estado"}</li>
                    </ul>
                </div>
            </div>
        </article>
    `;
}


//Funcion para mostrar mensaje cuando no hay favoritos
function crearHtmlSinFavoritos() {
    return `
        <div class="col-12">
            <div class="mensaje-vacio">
                <h3>No tienes viajes favoritos todavía</h3>
                <p>Marca una estrella en la página de Mis viajes para añadirlos aquí.</p>
                <a href="viajes.html" class="btn btn-principal">Ir a mis viajes</a>
            </div>
        </div>
    `;
}


//Cartas de viajes favoritos
function mostrarFavoritos() {
    if (!contenedores.favoritos) {
        return;
    }

    let contenidoFavoritos = "";
    let viajes = gestorViajes.obtenerTodos();

    for (let i = 0; i < viajes.length; i++) {
        let detalles = viajes[i].detalles || {};

        if (detalles.favorito == true) {
            contenidoFavoritos += crearHtmlFavorito(viajes[i]);
        }
    }

    if (contenidoFavoritos == "") {
        contenidoFavoritos = crearHtmlSinFavoritos();
    }

    contenedores.favoritos.innerHTML = contenidoFavoritos;
}


//Actualizamos viajes y presupuestos a la vez
function actualizarPaginaViajes() {
    cargarFiltroPaises();
    mostrarViajes();
    mostrarPresupuestos();
    mostrarFavoritos();
}

//Formulario para crear viajes
let formularioViaje = document.querySelector(".formulario-viaje");

//Campos del formulario para crear viajes
let camposFormularioCrear = {
    destino: document.getElementById("destino"),
    pais: document.getElementById("pais"),
    fecha: document.getElementById("fecha"),
    duracion: document.getElementById("duracion"),
    presupuesto: document.getElementById("presupuesto"),
    tipo: document.getElementById("tipo"),
    estado: document.getElementById("estado"),
    descripcion: document.getElementById("notas")
};

//Funcion para decidir el estado al crear un viaje
function obtenerEstadoFormularioSegunUsuario() {
    if (usuarioConectadoApp && usuarioConectadoApp.rol == "admin") {
        return "Pendiente";
    }

    if (!camposFormularioCrear.estado || camposFormularioCrear.estado.value == "") {
        return "Pendiente";
    }

    return camposFormularioCrear.estado.value;
}

//Funcion para recoger datos del formulario principal
function recogerNuevoViajeFormulario() {
    return {
        destino: camposFormularioCrear.destino.value,
        pais: camposFormularioCrear.pais.value,
        imagen: "img/logo2.png",
        alt: "Icono de planificador de viajes",
        detalles: {
            descripcion: camposFormularioCrear.descripcion.value,
            fecha: camposFormularioCrear.fecha.value,
            duracion: Number(camposFormularioCrear.duracion.value),
            presupuesto: camposFormularioCrear.presupuesto.value,
            tipo: camposFormularioCrear.tipo.value,
            estado: obtenerEstadoFormularioSegunUsuario(),
            favorito: false
        }
    };
}

function usuarioTieneToken() {
    return localStorage.getItem("token") != null;
}

function avisarLoginNecesario(mensaje) {
    if (typeof mostrarAviso === "function") {
        mostrarAviso("Inicia sesión", mensaje);
    } else {
        alert(mensaje);
    }

    setTimeout(function () {
        window.location.href = "login.html";
    }, 1200);
}

//Funcion para enviar el formulario de crear viajes
async function enviarFormularioCrear(evento) {
    evento.preventDefault();

    if (!usuarioTieneToken()) {
        avisarLoginNecesario("Debes iniciar sesión para crear un viaje.");
        return;
    }

    let nuevoViaje = recogerNuevoViajeFormulario();

    console.log("Viaje que se va a enviar:", nuevoViaje);

    let creado = await crearViajeBackend(nuevoViaje);

    if (!creado) {
        return;
    }

    formularioViaje.reset();

    await cargarViajesBackend(true);

    mostrarAviso("Viaje creado", "Viaje creado correctamente.");
}

//Configuramos el formulario para crear viajes
function configurarFormularioCrear() {
    if (formularioViaje) {
        formularioViaje.addEventListener("submit", enviarFormularioCrear);
    }
}


//Funcion para gestionar los clicks de las cartas
async function gestionarClickTarjeta(evento) {
    let boton = evento.target.closest("button[data-id]");

    if (!boton) {
        return;
    }

    let id = Number(boton.getAttribute("data-id"));

    if (!id) {
        return;
    }

    let accionesTarjeta = [
        {
            clase: "btn-eliminar",
            accion: eliminarViajeBackend
        },
        {
            clase: "btn-leer",
            accion: leerViajeBackend
        },
        {
            clase: "btn-editar",
            accion: prepararEditarViajeBackend
        },
        {
            clase: "boton-estrella",
            accion: cambiarFavoritoBackend
        }
    ];

    for (let i = 0; i < accionesTarjeta.length; i++) {
        if (boton.classList.contains(accionesTarjeta[i].clase)) {
            await accionesTarjeta[i].accion(id);
            return;
        }
    }
}


//Eventos de las cartas: eliminar, editar, leer y favorito
function configurarEventosTarjetas() {
    if (contenedores.viajes) {
        contenedores.viajes.addEventListener("click", gestionarClickTarjeta);
    }
}

//Funcion para hacer el put
async function actualizarViajeBackend(id, viajeActualizado, mostrarMensaje = true) {
    let respuestaApi = await apiViajes.actualizar(id, viajeActualizado);

    let respuesta = respuestaApi.respuesta;
    let datos = respuestaApi.datos;

    if (!datos) {
        return false;
    }

    if (respuesta.status == 404 && datos.accion == "crear") {
        abrirModalCrearDesdePut(viajeActualizado);
        return false;
    }

    gestorViajes.actualizarUno(id, datos.viaje);

    actualizarPaginaViajes();

    if (mostrarMensaje) {
        if (typeof mostrarAviso === "function") {
            mostrarAviso("Viaje actualizado", "Viaje actualizado correctamente.");
        } else {
            alert("Viaje actualizado correctamente.");
        }
    }

    return true;
}

//Funcion para mostrar el modal de viaje creado correctamente
function mostrarModalViajeCreado() {
    let modalCreado = document.getElementById("modal-viaje-creado");

    if (!modalCreado) {
        alert("Viaje creado correctamente");
        return;
    }

    if (typeof bootstrap === "undefined") {
        alert("Viaje creado correctamente");
        return;
    }

    let modalBootstrap = new bootstrap.Modal(modalCreado);
    modalBootstrap.show();
}

//Funcion para mostrar el modal de viaje eliminado correctamente
function mostrarModalViajeEliminado() {
    let modalEliminado = document.getElementById("modal-viaje-eliminado");

    if (!modalEliminado) {
        alert("Viaje eliminado correctamente");
        return;
    }

    if (typeof bootstrap === "undefined") {
        alert("Viaje eliminado correctamente");
        return;
    }

    let modalBootstrap = new bootstrap.Modal(modalEliminado);
    modalBootstrap.show();
}

//Funcion para abrir el modal de confirmacion de eliminar
function abrirModalConfirmarEliminar(id) {
    idPendienteEliminar = id;

    let modalConfirmar = document.getElementById("modal-confirmar-eliminar");

    if (!modalConfirmar) {
        return;
    }

    let modalBootstrap = new bootstrap.Modal(modalConfirmar);
    modalBootstrap.show();
}


//Funcion para confirmar la eliminacion desde el modal
async function confirmarEliminarViaje() {
    if (!idPendienteEliminar) {
        return;
    }

    let id = idPendienteEliminar;

    let datos = await apiViajes.eliminar(id);

    if (!datos) {
        return;
    }

    gestorViajes.eliminarUno(id);

    actualizarPaginaViajes();

    idPendienteEliminar = null;

    let modalConfirmar = document.getElementById("modal-confirmar-eliminar");
    let instanciaModal = bootstrap.Modal.getInstance(modalConfirmar);

    if (instanciaModal) {
        instanciaModal.hide();
    }

    mostrarAviso("Viaje eliminado", "Viaje eliminado correctamente.");
}


//Funcion para configurar el boton del modal de eliminar
function configurarModalConfirmarEliminar() {
    let botonConfirmar = document.getElementById("boton-confirmar-eliminar");

    if (!botonConfirmar) {
        return;
    }

    botonConfirmar.addEventListener("click", confirmarEliminarViaje);
}

//Funcion para mostrar avisos con Bootstrap
function mostrarAviso(titulo, mensaje) {
    let modalAviso = document.getElementById("modal-aviso");
    let tituloAviso = document.getElementById("modal-aviso-titulo");
    let mensajeAviso = document.getElementById("modal-aviso-mensaje");

    if (!modalAviso || !tituloAviso || !mensajeAviso) {
        alert(mensaje);
        return;
    }

    tituloAviso.textContent = titulo;
    mensajeAviso.textContent = mensaje;

    if (typeof bootstrap === "undefined") {
        alert(mensaje);
        return;
    }

    let modalBootstrap = new bootstrap.Modal(modalAviso);
    modalBootstrap.show();
}

//Funcion para crear con Post
async function crearViajeBackend(nuevoViaje) {
    let viajeCreado = await apiViajes.crear(nuevoViaje);

    if (!viajeCreado) {
        return false;
    }

    if (modalViaje.contenedor) {
        modalViaje.contenedor.classList.add("oculto");
    }

    if (modalViaje.formulario) {
        modalViaje.formulario.reset();
    }

    modoCrearDesdePut = false;
    datosPendientesCrear = null;

    return true;
}

//Funcion para leer un viaje por id
async function leerViajeBackend(id) {
    let viaje = await apiViajes.obtenerPorId(id);

    if (!viaje) {
        return;
    }

    formularioModalViaje.rellenar(viaje);
    activarModoLectura();

    cambiarTextoModal(
        "Leer viaje",
        "Consulta los datos del viaje seleccionado."
    );

    modalViaje.abrir();
}

//Funcion para preparar la edición de un viaje por id
async function prepararEditarViajeBackend(id) {

    if (!usuarioTieneToken()) {
        avisarLoginNecesario("Debes iniciar sesión para editar un viaje.");
        return;
    }

    let viaje = await apiViajes.obtenerPorId(id);

    if (!viaje) {
        return;
    }

    idEditando = id;

    formularioModalViaje.rellenar(viaje);
    activarModoEdicion();

    cambiarTextoModal(
        "Editar viaje",
        "Modifica los datos del viaje seleccionado."
    );

    modalViaje.botonActualizar.textContent = "Actualizar viaje";

    modalViaje.abrir();
}

//Funcion para eliminar un viaje
async function eliminarViajeBackend(id) {

    if (!usuarioTieneToken()) {
        avisarLoginNecesario("Debes iniciar sesión para eliminar un viaje.");
        return;
    }

    abrirModalConfirmarEliminar(id);
}

//Funcion para cambiar favorito usando PUT
async function cambiarFavoritoBackend(id) {

    if (!usuarioTieneToken()) {
        avisarLoginNecesario("Debes iniciar sesión para guardar favoritos.");
        return;
    }

    let viaje = gestorViajes.buscarPorId(id);

    if (!viaje) {
        mostrarAviso("Aviso", "No se ha encontrado el viaje.");
        return;
    }

    let viajeActualizado = prepararViajeParaEnviar(viaje);
    viajeActualizado.detalles.favorito = !viajeActualizado.detalles.favorito;

    let estabaEnFavoritos = viaje.detalles.favorito == true;

    let actualizado = await actualizarViajeBackend(id, viajeActualizado, false);

    if (actualizado) {
        if (estabaEnFavoritos) {
            mostrarAviso("Favoritos", "Viaje quitado de favoritos correctamente.");
        } else {
            mostrarAviso("Favoritos", "Viaje añadido a favoritos correctamente.");
        }
    }
}

//Funcion para preparar un viaje antes de mandarlo al backend
function prepararViajeParaEnviar(viaje) {
    let detalles = viaje.detalles || {};

    return {
        destino: viaje.destino,
        pais: viaje.pais,
        imagen: viaje.imagen || "img/logo2.png",
        alt: viaje.alt || "Icono de planificador de viajes",
        detalles: {
            descripcion: detalles.descripcion || "Viaje añadido por el usuario.",
            fecha: detalles.fecha || "2026-01-01",
            duracion: Number(detalles.duracion || 1),
            presupuesto: Number(detalles.presupuesto || ""),
            tipo: detalles.tipo || "Ciudad",
            estado: detalles.estado || "Pendiente",
            favorito: detalles.favorito || false
        }
    };
}

//Opciones para los select de los formularios
let opcionesTipoViaje = [
    "Ciudad",
    "Playa",
    "Montaña",
    "Aventura",
    "Relax",
    "Cultura"
];

let opcionesEstadoViaje = [
    "Pendiente",
    "Reservado",
    "Visitado"
];

//Funcion para cargar opciones en un select concreto
function cargarOpcionesEnSelect(idSelect, opciones, textoInicial) {
    let select = document.getElementById(idSelect);

    if (!select) {
        return;
    }

    let valorAnterior = select.value;

    select.innerHTML = "";

    let opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = textoInicial;
    select.appendChild(opcionInicial);

    for (let i = 0; i < opciones.length; i++) {
        let opcion = document.createElement("option");
        opcion.value = opciones[i];
        opcion.textContent = opciones[i];

        select.appendChild(opcion);
    }

    if (valorAnterior != "") {
        select.value = valorAnterior;
    }
}

//Funcion para cargar todos los select de la pagina
function cargarOpcionesSelects() {
    let selects = [
        {
            id: "tipo",
            opciones: opcionesTipoViaje,
            textoInicial: "Selecciona una opción"
        },
        {
            id: "estado",
            opciones: opcionesEstadoViaje,
            textoInicial: "Selecciona una opción"
        },
        {
            id: "editar-tipo",
            opciones: opcionesTipoViaje,
            textoInicial: "Selecciona una opción"
        },
        {
            id: "editar-estado",
            opciones: opcionesEstadoViaje,
            textoInicial: "Selecciona una opción"
        },
        {
            id: "filtro-estado",
            opciones: opcionesEstadoViaje,
            textoInicial: "Todos"
        }
    ];

    for (let i = 0; i < selects.length; i++) {
        cargarOpcionesEnSelect(
            selects[i].id,
            selects[i].opciones,
            selects[i].textoInicial
        );
    }
}

//Funcion para ocultar el campo estado cuando el usuario es admin
function ajustarFormularioSegunUsuario() {
    if (!usuarioConectadoApp || usuarioConectadoApp.rol != "admin") {
        return;
    }

    if (!camposFormularioCrear.estado) {
        return;
    }

    let contenedorEstado = camposFormularioCrear.estado.closest(".col-md-6");

    if (contenedorEstado) {
        contenedorEstado.classList.add("d-none");
    }

    camposFormularioCrear.estado.removeAttribute("required");
    camposFormularioCrear.estado.value = "Recomendado";
}

//Funcion para iniciar la pagina
async function iniciarApp() {
    pintarHeader();
    await pintarSeccionInfo();
    pintarDestinosDestacados();
    pintarFooter();

    cargarOpcionesSelects();

    await cargarTarjetasPresupuesto();

    await cargarUsuarioConectadoApp();
    ajustarFormularioSegunUsuario();

    configurarFiltros();
    configurarPaginacion();
    configurarFormularioCrear();
    configurarEventosTarjetas();
    configurarCerrarModal();
    configurarFormularioEditar();
    configurarModalConfirmarEliminar();

    //Cargamos los viajes desde Flask
    await cargarViajesBackend(false);

    //Carga primero js y luego lo demas para que no tarde en hacerlo
    document.body.classList.add("pagina-cargada");
}

//Iniciamos la app solo en index y viajes
if (!document.body.classList.contains("pagina-favoritos")) {
    iniciarApp();
}