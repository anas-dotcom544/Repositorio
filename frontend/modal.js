//Gestiona la apertura, cierre y textos del modal de edición de viajes.
class Modal {
    constructor() {
        this.contenedor = document.querySelector("#modal-editar");
        this.botonCerrar = document.querySelector("#cerrar-modal");
        this.formulario = document.querySelector(".formulario-editar-viaje");
        this.botonActualizar = document.querySelector("#boton-actualizar-viaje");
    }

    abrir() {
        this.contenedor.classList.remove("oculto");
    }

    cerrar() {
        this.contenedor.classList.add("oculto");
    }

    cambiarTexto(titulo, texto) {
        this.contenedor.querySelector("h2").textContent = titulo;
        this.contenedor.querySelector(".texto-seccion").textContent = texto;
    }
}

let modalViaje = new Modal();

//Funcion para poner el titulo y texto del modal
function cambiarTextoModal(titulo, texto) {
    modalViaje.cambiarTexto(titulo, texto);
}

//Funcion para configurar cerrar modal
function configurarCerrarModal() {
    if (modalViaje.botonCerrar && modalViaje.contenedor) {
        modalViaje.botonCerrar.addEventListener("click", function () {
            modalViaje.cerrar();

            idEditando = null;
            modoCrearDesdePut = false;
            datosPendientesCrear = null;

            cambiarTextoModal(
                "Editar viaje",
                "Modifica los datos del viaje seleccionado."
            );

            if (modalViaje.botonActualizar) {
                modalViaje.botonActualizar.textContent = "Actualizar viaje";
            }
        });
    }
}