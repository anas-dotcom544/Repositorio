//Clase para agrupar las llamadas al backend de viajes
class ApiViajes {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.headers = {
            "Content-Type": "application/json"
        };
    }

    //Funcion para preparar las cabeceras con el token JWT
    obtenerHeaders() {
        const token = localStorage.getItem("token");

        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
    }

    async procesarRespuesta(respuesta) {
        let datos = await respuesta.json();
        
        switch (respuesta.status) {
            case 200:
            case 201:
                return datos;
        
            case 401:
            case 403:
                if (typeof mostrarAviso === "function") {
                    mostrarAviso("Aviso", datos.error || "Debes iniciar sesión para realizar esta acción");
                } else {
                    alert(datos.error || "Debes iniciar sesión para realizar esta acción");
                }
            
                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1200);
            
                return null;
            
            case 404:
                if (datos.accion == "crear") {
                    return datos;
                }
            
                if (typeof mostrarAviso === "function") {
                    mostrarAviso("Aviso", datos.error || "No se ha encontrado el recurso");
                } else {
                    alert(datos.error || "No se ha encontrado el recurso");
                }
            
                return null;
            
            case 500:
                if (typeof mostrarAviso === "function") {
                    mostrarAviso("Error", datos.error || "Error interno del servidor");
                } else {
                    alert(datos.error || "Error interno del servidor");
                }
            
                return null;
            
            default:
                if (!respuesta.ok) {
                    if (typeof mostrarAviso === "function") {
                        mostrarAviso("Aviso", datos.error || "Ha ocurrido un error");
                    } else {
                        alert(datos.error || "Ha ocurrido un error");
                    }
                
                    return null;
                }
            
                return datos;
        }
    }

    async obtenerTodos() {
        let respuesta = await fetch(this.baseUrl, {
            credentials: "include"
        });

        return await this.procesarRespuesta(respuesta);
    }

    async obtenerPorId(id) {
        let respuesta = await fetch(this.baseUrl + "/" + id, {
            credentials: "include"
        });

        return await this.procesarRespuesta(respuesta);
    }

    async crear(nuevoViaje) {
        let respuesta = await fetch(this.baseUrl, {
            method: "POST",
            headers: this.obtenerHeaders(),
            credentials: "include",
            body: JSON.stringify(nuevoViaje)
        });

        return await this.procesarRespuesta(respuesta);
    }

    async actualizar(id, viajeActualizado) {
        let respuesta = await fetch(this.baseUrl + "/" + id, {
            method: "PUT",
            headers: this.obtenerHeaders(),
            credentials: "include",
            body: JSON.stringify(viajeActualizado)
        });

        let datos = await this.procesarRespuesta(respuesta);

        return {
            respuesta: respuesta,
            datos: datos
        };
    }

    async eliminar(id) {
        let respuesta = await fetch(this.baseUrl + "/" + id, {
            method: "DELETE",
            headers: this.obtenerHeaders(),
            credentials: "include"
        });

        return await this.procesarRespuesta(respuesta);
    }

    async obtenerDestacados() {
        let respuesta = await fetch(this.baseUrl + "/destacados", {
            credentials: "include"
        });

        return await this.procesarRespuesta(respuesta);
    }
}

const apiViajes = new ApiViajes(CONFIG.API_URL + "/viajes");