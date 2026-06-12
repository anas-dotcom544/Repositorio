//Clase para gestionar login, registro, logout y perfil
class Auth {
    constructor() {
        this.urlBase = CONFIG.API_URL;
    }

    //Funcion para registrar un usuario nuevo
    async signup(nombre, email, password) {
        const respuesta = await fetch(`${this.urlBase}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password
            })
        });

        const datos = await respuesta.json();

        return {
            respuesta: respuesta,
            datos: datos
        };
    }

    //Funcion para iniciar sesion
    async login(email, password) {
        const respuesta = await fetch(`${this.urlBase}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok && datos.token) {
            localStorage.setItem("token", datos.token);
        }

        return {
            respuesta: respuesta,
            datos: datos
        };
    }

    //Funcion para cerrar sesion
    async logout() {
        const respuesta = await fetch(`${this.urlBase}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        localStorage.removeItem("token");

        const datos = await respuesta.json();

        return {
            respuesta: respuesta,
            datos: datos
        };
    }

    //Funcion para obtener el usuario conectado
    async perfil() {
        const token = localStorage.getItem("token");
    
        const respuesta = await fetch(`${this.urlBase}/auth/perfil`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            credentials: "include"
        });
    
        const datos = await respuesta.json();
    
        return {
            respuesta: respuesta,
            datos: datos
        };
    }
}


//Creo un objeto global para usarlo en las paginas
const auth = new Auth();