//Clase para manejar los filtros de viajes
class FiltrosViajes extends GestorCampos {
    constructor() {
        let contenedorFiltros = document.querySelector(".caja-filtros");
        let selectsFiltros = contenedorFiltros ? contenedorFiltros.querySelectorAll("select") : [];

        super({
            buscador: document.querySelector("#buscar-viaje"),
            estado: selectsFiltros[0] || null,
            pais: selectsFiltros[1] || null
        });

        this.buscador = this.campos.buscador;
        this.estado = this.campos.estado;
        this.pais = this.campos.pais;
        this.botonLimpiar = document.querySelector("#boton-limpiar-filtros");
    }

    obtener() {
        let valoresFiltros = this.obtenerValores();

        return {
            textoBusqueda: valoresFiltros.buscador.toLowerCase(),
            estadoSeleccionado: valoresFiltros.estado,
            paisSeleccionado: valoresFiltros.pais
        };
    }

    limpiar() {
        this.limpiarValores();
        reiniciarPaginaYMostrarViajes();
    }

    cumple(viaje, filtros) {
        let detalles = viaje.detalles || {};

        let textoBusqueda = filtros.textoBusqueda.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let expresionBusqueda = new RegExp(textoBusqueda, "i");

        let condiciones = [
            expresionBusqueda.test(viaje.destino) ||
            expresionBusqueda.test(viaje.pais),

            filtros.estadoSeleccionado == "" ||
            detalles.estado == filtros.estadoSeleccionado,

            filtros.paisSeleccionado == "" ||
            viaje.pais == filtros.paisSeleccionado
        ];

        for (let i = 0; i < condiciones.length; i++) {
            if (!condiciones[i]) {
                return false;
            }
        }

        return true;
    }
}

let gestorFiltros = new FiltrosViajes();

//Mantengo este nombre porque app.js ya lo usa en configurarFiltros()
let filtrosViajes = gestorFiltros;

//Mantengo esta función porque app.js ya la usa en obtenerViajesFiltrados()
function cumpleFiltros(viaje, filtros) {
    return gestorFiltros.cumple(viaje, filtros);
}