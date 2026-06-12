//Variables para guardar los datos de perfil
let viajesPerfil = [];
let usuarioPerfil = null;

//Coordenadas de ciudades famosas para pintar pines en el mapa
const coordenadasCiudadesPerfil = {
    "Madrid": { lat: 40.4168, lng: -3.7038 },
    "Barcelona": { lat: 41.3874, lng: 2.1686 },
    "Sevilla": { lat: 37.3891, lng: -5.9845 },
    "Valencia": { lat: 39.4699, lng: -0.3763 },
    "Paris": { lat: 48.8566, lng: 2.3522 },
    "Londres": { lat: 51.5074, lng: -0.1278 },
    "Roma": { lat: 41.9028, lng: 12.4964 },
    "Venecia": { lat: 45.4408, lng: 12.3155 },
    "Florencia": { lat: 43.7696, lng: 11.2558 },
    "Lisboa": { lat: 38.7223, lng: -9.1393 },
    "Oporto": { lat: 41.1579, lng: -8.6291 },
    "Amsterdam": { lat: 52.3676, lng: 4.9041 },
    "Berlin": { lat: 52.5200, lng: 13.4050 },
    "Viena": { lat: 48.2082, lng: 16.3738 },
    "Praga": { lat: 50.0755, lng: 14.4378 },
    "Atenas": { lat: 37.9838, lng: 23.7275 },
    "Estambul": { lat: 41.0082, lng: 28.9784 },
    "Marrakech": { lat: 31.6295, lng: -7.9811 },
    "Casablanca": { lat: 33.5731, lng: -7.5898 },
    "El Cairo": { lat: 30.0444, lng: 31.2357 },
    "Dubai": { lat: 25.2048, lng: 55.2708 },
    "Doha": { lat: 25.2854, lng: 51.5310 },
    "Nueva York": { lat: 40.7128, lng: -74.0060 },
    "Manhattan": { lat: 40.7831, lng: -73.9712 },
    "Los Angeles": { lat: 34.0522, lng: -118.2437 },
    "Miami": { lat: 25.7617, lng: -80.1918 },
    "Las Vegas": { lat: 36.1699, lng: -115.1398 },
    "San Francisco": { lat: 37.7749, lng: -122.4194 },
    "Cancun": { lat: 21.1619, lng: -86.8515 },
    "Ciudad de Mexico": { lat: 19.4326, lng: -99.1332 },
    "Buenos Aires": { lat: -34.6037, lng: -58.3816 },
    "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 },
    "Sao Paulo": { lat: -23.5505, lng: -46.6333 },
    "Lima": { lat: -12.0464, lng: -77.0428 },
    "Tokio": { lat: 35.6762, lng: 139.6503 },
    "Kioto": { lat: 35.0116, lng: 135.7681 },
    "Osaka": { lat: 34.6937, lng: 135.5023 },
    "Seul": { lat: 37.5665, lng: 126.9780 },
    "Bangkok": { lat: 13.7563, lng: 100.5018 },
    "Bali": { lat: -8.3405, lng: 115.0920 },
    "Singapur": { lat: 1.3521, lng: 103.8198 },
    "Hong Kong": { lat: 22.3193, lng: 114.1694 },
    "Pekin": { lat: 39.9042, lng: 116.4074 },
    "Shanghai": { lat: 31.2304, lng: 121.4737 },
    "Sydney": { lat: -33.8688, lng: 151.2093 },
    "Melbourne": { lat: -37.8136, lng: 144.9631 }
};


//Coordenadas aproximadas de paises concurridos para viajar
const coordenadasPaisesPerfil = {
    "España": { lat: 40.4637, lng: -3.7492 },
    "Francia": { lat: 46.2276, lng: 2.2137 },
    "Italia": { lat: 41.8719, lng: 12.5674 },
    "Portugal": { lat: 39.3999, lng: -8.2245 },
    "Reino Unido": { lat: 55.3781, lng: -3.4360 },
    "Alemania": { lat: 51.1657, lng: 10.4515 },
    "Austria": { lat: 47.5162, lng: 14.5501 },
    "Republica Checa": { lat: 49.8175, lng: 15.4730 },
    "Grecia": { lat: 39.0742, lng: 21.8243 },
    "Turquia": { lat: 38.9637, lng: 35.2433 },
    "Marruecos": { lat: 31.7917, lng: -7.0926 },
    "Egipto": { lat: 26.8206, lng: 30.8025 },
    "Emiratos Arabes Unidos": { lat: 23.4241, lng: 53.8478 },
    "Qatar": { lat: 25.3548, lng: 51.1839 },
    "Estados Unidos": { lat: 37.0902, lng: -95.7129 },
    "Mexico": { lat: 23.6345, lng: -102.5528 },
    "Argentina": { lat: -38.4161, lng: -63.6167 },
    "Brasil": { lat: -14.2350, lng: -51.9253 },
    "Peru": { lat: -9.1900, lng: -75.0152 },
    "Japon": { lat: 36.2048, lng: 138.2529 },
    "Corea del Sur": { lat: 35.9078, lng: 127.7669 },
    "Tailandia": { lat: 15.8700, lng: 100.9925 },
    "Indonesia": { lat: -0.7893, lng: 113.9213 },
    "Singapur": { lat: 1.3521, lng: 103.8198 },
    "China": { lat: 35.8617, lng: 104.1954 },
    "Australia": { lat: -25.2744, lng: 133.7751 },
    "Canada": { lat: 56.1304, lng: -106.3468 },
    "Suiza": { lat: 46.8182, lng: 8.2275 },
    "Paises Bajos": { lat: 52.1326, lng: 5.2913 },
    "Irlanda": { lat: 53.4129, lng: -8.2439 }
};

//Funcion para obtener los viajes visitados con coordenadas
function obtenerViajesVisitadosConCoordenadas() {
    let viajesVisitados = [];

    for (let i = 0; i < viajesPerfil.length; i++) {
        let viaje = viajesPerfil[i];

        if (!viajeCuentaParaPerfil(viaje)) {
            continue;
        }

        let detalles = viaje.detalles || {};
        let estado = detalles.estado || "";

        if (estado != "Visitado") {
            continue;
        }

        let coordenadas = obtenerCoordenadasViajePerfil(viaje);

        if (!coordenadas) {
            continue;
        }

        viajesVisitados.push({
            destino: viaje.destino,
            pais: viaje.pais,
            coordenadas: coordenadas
        });
    }

    return viajesVisitados;
}

//Funcion para mostrar solo la fecha sin la hora
function formatearFechaPerfil(fechaCompleta) {
    if (!fechaCompleta) {
        return "Sin fecha";
    }

    return fechaCompleta.split(" ")[0];
}


//Funcion para cargar los datos del usuario conectado
async function cargarDatosUsuarioPerfil() {
    try {
        let resultado = await auth.perfil();

        if (!resultado.respuesta.ok) {
            window.location.href = "login.html";
            return false;
        }

        usuarioPerfil = resultado.datos.usuario;

        let perfilNombre = document.getElementById("perfil-nombre");
        let perfilEmail = document.getElementById("perfil-email");
        let perfilRol = document.getElementById("perfil-rol");
        let perfilFecha = document.getElementById("perfil-fecha");

        if (perfilNombre) {
            perfilNombre.textContent = usuarioPerfil.nombre;
        }

        if (perfilEmail) {
            perfilEmail.textContent = usuarioPerfil.email;
        }

        if (perfilRol) {
            perfilRol.textContent = usuarioPerfil.rol;
        }

        if (perfilFecha) {
            perfilFecha.textContent = formatearFechaPerfil(usuarioPerfil.fecha_registro);
        }

        return true;

    } catch (error) {
        console.log("Error al cargar los datos del perfil:", error);
        window.location.href = "login.html";
        return false;
    }
}


//Funcion para comprobar si un viaje debe contar en el perfil
function viajeCuentaParaPerfil(viaje) {
    if (!viaje) {
        return false;
    }

    //No cuento viajes destacados
    if (viaje.destacado == true) {
        return false;
    }

    //Si existe usuario_id, cuento solo los viajes creados por el usuario conectado
    if (usuarioPerfil && viaje.usuario_id != null) {
        return viaje.usuario_id == usuarioPerfil.id;
    }

    return true;
}


//Funcion para cargar los viajes y calcular el resumen
async function cargarResumenViajesPerfil() {
    try {
        let viajes = await apiViajes.obtenerTodos();

        if (!viajes) {
            return;
        }

        viajesPerfil = viajes;

        let pendientes = 0;
        let reservados = 0;
        let visitados = 0;

        for (let i = 0; i < viajesPerfil.length; i++) {
            let viaje = viajesPerfil[i];

            if (!viajeCuentaParaPerfil(viaje)) {
                continue;
            }

            let detalles = viaje.detalles || {};
            let estado = detalles.estado || "";

            if (estado == "Pendiente") {
                pendientes++;
            }

            if (estado == "Reservado") {
                reservados++;
            }

            if (estado == "Visitado") {
                visitados++;
            }
        }

        let perfilPendientes = document.getElementById("perfil-pendientes");
        let perfilReservados = document.getElementById("perfil-reservados");
        let perfilVisitados = document.getElementById("perfil-visitados");

        if (perfilPendientes) {
            perfilPendientes.textContent = pendientes;
        }

        if (perfilReservados) {
            perfilReservados.textContent = reservados;
        }

        if (perfilVisitados) {
            perfilVisitados.textContent = visitados;
        }

    } catch (error) {
        console.log("Error al cargar el resumen del perfil:", error);
    }
}


//Funcion principal del perfil
async function iniciarPaginaPerfil() {
    if (typeof pintarHeader === "function") {
        pintarHeader();
    } else {
        console.log("No existe la funcion pintarHeader");
    }

    if (typeof pintarFooter === "function") {
        pintarFooter();
    } else {
        console.log("No existe la funcion pintarFooter");
    }

    if (typeof actualizarNavbarAuth === "function") {
        await actualizarNavbarAuth();
    } else {
        console.log("No existe la funcion actualizarNavbarAuth");
    }

    let usuarioCargado = await cargarDatosUsuarioPerfil();

    if (!usuarioCargado) {
        return;
    }

    await cargarResumenViajesPerfil();

    iniciarMapaPerfil();

    document.body.classList.add("pagina-cargada");
}

//Funcion para buscar coordenadas por ciudad o por pais
function obtenerCoordenadasViajePerfil(viaje) {
    let coordenadasCiudad = coordenadasCiudadesPerfil[viaje.destino];

    if (coordenadasCiudad) {
        return coordenadasCiudad;
    }

    let coordenadasPais = coordenadasPaisesPerfil[viaje.pais];

    if (coordenadasPais) {
        return coordenadasPais;
    }

    return null;
}

//Funcion para iniciar el mapa del perfil
function iniciarMapaPerfil() {
    let contenedorMapa = document.getElementById("mapa-perfil");

    if (!contenedorMapa) {
        return;
    }

    if (typeof L == "undefined") {
        console.log("Leaflet no esta cargado");
        return;
    }

    let viajesVisitados = obtenerViajesVisitadosConCoordenadas();

    let mensajeMapa = document.getElementById("mensaje-mapa-perfil");

    if (viajesVisitados.length == 0 && mensajeMapa) {
        mensajeMapa.classList.remove("d-none");
    }

    let mapa = L.map("mapa-perfil").setView([30, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
    }).addTo(mapa);

    let grupoPines = L.featureGroup();

    for (let i = 0; i < viajesVisitados.length; i++) {
        let viaje = viajesVisitados[i];

        let marcador = L.marker([
            viaje.coordenadas.lat,
            viaje.coordenadas.lng
        ])
            .bindPopup(`<strong>${viaje.destino}</strong><br>${viaje.pais}`);

        marcador.addTo(grupoPines);
    }

    grupoPines.addTo(mapa);

    if (viajesVisitados.length > 1) {
        mapa.fitBounds(grupoPines.getBounds(), {
            padding: [35, 35],
            maxZoom: 5
        });
    }
}

//Espero a que el HTML este cargado
document.addEventListener("DOMContentLoaded", function () {
    iniciarPaginaPerfil();
});