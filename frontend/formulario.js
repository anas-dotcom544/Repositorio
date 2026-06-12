//Clase para manejar el formulario del modal de viajes
class FormularioModalViaje extends GestorCampos {
    constructor() {
        super({
            destino: document.querySelector("#editar-destino"),
            pais: document.querySelector("#editar-pais"),
            fecha: document.querySelector("#editar-fecha"),
            duracion: document.querySelector("#editar-duracion"),
            presupuesto: document.querySelector("#editar-presupuesto"),
            tipo: document.querySelector("#editar-tipo"),
            estado: document.querySelector("#editar-estado"),
            descripcion: document.querySelector("#editar-notas")
        });
    }

    rellenar(viaje) {
        let detalles = viaje.detalles || {};

        this.campos.destino.value = viaje.destino || "";
        this.campos.pais.value = viaje.pais || "";
        this.campos.fecha.value = detalles.fecha || "";
        this.campos.duracion.value = detalles.duracion || "";
        this.campos.presupuesto.value = detalles.presupuesto || "";
        this.campos.tipo.value = detalles.tipo || "";
        this.campos.estado.value = detalles.estado || "";
        this.campos.descripcion.value = detalles.descripcion || "";
    }

    recoger() {
        let viajeOriginal = gestorViajes.buscarPorId(idEditando);
        let detallesOriginales = {};

        if (viajeOriginal) {
            detallesOriginales = viajeOriginal.detalles || {};
        }

        let valoresFormulario = this.obtenerValores();

        let paisNuevo = valoresFormulario.pais;
        let duracionNueva = Number(valoresFormulario.duracion);
        let presupuestoNuevo = valoresFormulario.presupuesto;

        let haCambiadoPais = viajeOriginal && viajeOriginal.pais != paisNuevo;
        let haCambiadoDuracion = viajeOriginal && Number(detallesOriginales.duracion) != duracionNueva;

        if (haCambiadoPais || haCambiadoDuracion) {
            presupuestoNuevo = "";
        }

        return {
            destino: valoresFormulario.destino,
            pais: paisNuevo,
            imagen: viajeOriginal ? viajeOriginal.imagen : "img/logo2.png",
            alt: viajeOriginal ? viajeOriginal.alt : "Icono de planificador de viajes",
            detalles: {
                descripcion: valoresFormulario.descripcion,
                fecha: valoresFormulario.fecha,
                duracion: duracionNueva,
                presupuesto: presupuestoNuevo,
                tipo: valoresFormulario.tipo,
                estado: valoresFormulario.estado,
                favorito: detallesOriginales.favorito || false
            }
        };
    }

    cambiarModo(esLectura) {
        let camposTexto = [
            this.campos.destino,
            this.campos.pais,
            this.campos.fecha,
            this.campos.duracion,
            this.campos.presupuesto,
            this.campos.descripcion
        ];

        let camposSelect = [
            this.campos.tipo,
            this.campos.estado
        ];

        for (let i = 0; i < camposTexto.length; i++) {
            camposTexto[i].readOnly = esLectura;
        }

        for (let i = 0; i < camposSelect.length; i++) {
            camposSelect[i].disabled = esLectura;
        }
    }
}

let formularioModalViaje = new FormularioModalViaje();

function activarModoLectura() {
    formularioModalViaje.cambiarModo(true);
    modalViaje.botonActualizar.style.display = "none";
}

function activarModoEdicion() {
    formularioModalViaje.cambiarModo(false);
    modalViaje.botonActualizar.style.display = "inline-block";
}

function abrirModalCrearDesdePut(datosViaje) {
    modoCrearDesdePut = true;
    datosPendientesCrear = datosViaje;

    cambiarTextoModal(
        "Crear nuevo viaje",
        "El viaje que intentabas editar no existe. Puedes crearlo como un nuevo viaje."
    );

    formularioModalViaje.rellenar(datosViaje);
    activarModoEdicion();

    modalViaje.botonActualizar.textContent = "Crear viaje";

    modalViaje.abrir();
}

async function enviarFormularioEditar(evento) {
    evento.preventDefault();

    let viajeFormulario = formularioModalViaje.recoger();

    if (modoCrearDesdePut == true) {
        let creado = await crearViajeBackend(viajeFormulario);

        if (creado) {
            await cargarViajesBackend(true);
        }

        return;
    }

    if (idEditando != null) {
        let actualizado = await actualizarViajeBackend(idEditando, viajeFormulario);

        if (actualizado) {
            modalViaje.formulario.reset();
            modalViaje.cerrar();
        }
    }
}

function configurarFormularioEditar() {
    if (modalViaje.formulario) {
        modalViaje.formulario.addEventListener("submit", enviarFormularioEditar);
    }
}