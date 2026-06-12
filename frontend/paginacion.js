//Clase para manejar la paginación de viajes
class Paginacion {
    constructor(viajesPorPagina) {
        this.paginaActual = 1;
        this.viajesPorPagina = viajesPorPagina;
        this.totalItems = 0;
        this.totalPaginas = 1;
        this.inicio = 0;
        this.fin = this.viajesPorPagina;
    }

    actualizarTotalItems(totalItems) {
        this.totalItems = totalItems;
        this.totalPaginas = Math.ceil(this.totalItems / this.viajesPorPagina);

        if (this.totalPaginas < 1) {
            this.totalPaginas = 1;
        }

        this.ajustarPaginaActual();
    }

    actualizarLimites() {
        this.inicio = (this.paginaActual - 1) * this.viajesPorPagina;
        this.fin = this.inicio + this.viajesPorPagina;
    }

    ajustarPaginaActual() {
        if (this.paginaActual > this.totalPaginas) {
            this.paginaActual = this.totalPaginas;
        }

        if (this.paginaActual < 1) {
            this.paginaActual = 1;
        }
        
        this.actualizarLimites();

    }

    obtenerInicio() {
        return (this.paginaActual - 1) * this.viajesPorPagina;
    }

    obtenerFin() {
        return this.obtenerInicio() + this.viajesPorPagina;
    }

    gestionarClick(evento) {
        let pagina = evento.target.getAttribute("data-pagina");

        if (!pagina) {
            return;
        }

        if (pagina == "anterior" && this.paginaActual > 1) {
            this.paginaActual--;
        } else if (pagina == "siguiente" && this.paginaActual < this.totalPaginas) {
            this.paginaActual++;
        } else if (pagina != "anterior" && pagina != "siguiente") {
            this.paginaActual = Number(pagina);
        }

        mostrarViajes();
    }
}

let gestorPaginacion = new Paginacion(6);