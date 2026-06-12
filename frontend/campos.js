//Clase base para trabajar con grupos de campos
class GestorCampos {
    constructor(campos) {
        this.campos = campos;
    }

    obtenerValores() {
        let valores = {};

        for (let nombreCampo in this.campos) {
            valores[nombreCampo] = this.campos[nombreCampo] ? this.campos[nombreCampo].value : "";
        }

        return valores;
    }

    limpiarValores() {
        for (let nombreCampo in this.campos) {
            if (this.campos[nombreCampo]) {
                this.campos[nombreCampo].value = "";
            }
        }
    }
}