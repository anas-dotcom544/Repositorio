//Funcion para actualizar la navbar segun si hay usuario conectado
async function actualizarNavbarAuth() {
    const enlaceLogin = document.getElementById("enlace-login");
    const botonLogout = document.getElementById("boton-logout");
    const usuarioNavbar = document.getElementById("usuario-navbar");

    try {
        const resultado = await auth.perfil();

        if (resultado.respuesta.ok) {
            const usuario = resultado.datos.usuario;

            if (enlaceLogin) {
                enlaceLogin.classList.add("d-none");
            }

            if (botonLogout) {
                botonLogout.classList.remove("d-none");
            }

            if (usuarioNavbar) {
                usuarioNavbar.textContent = "🧭 " + usuario.nombre;
                usuarioNavbar.setAttribute("href", "perfil.html");
                usuarioNavbar.classList.remove("d-none");
            }
        } else {
            if (enlaceLogin) {
                enlaceLogin.classList.remove("d-none");
            }

            if (botonLogout) {
                botonLogout.classList.add("d-none");
            }

            if (usuarioNavbar) {
                usuarioNavbar.textContent = "";
                usuarioNavbar.classList.add("d-none");
            }
        }
    } catch (error) {
        if (enlaceLogin) {
            enlaceLogin.classList.remove("d-none");
        }

        if (botonLogout) {
            botonLogout.classList.add("d-none");
        }

        if (usuarioNavbar) {
            usuarioNavbar.textContent = "";
            usuarioNavbar.classList.add("d-none");
        }
    }

    if (botonLogout) {
        botonLogout.addEventListener("click", async function() {
            await auth.logout();
            window.location.href = "index.html";
        });
    }
}


//Espero a que el HTML este cargado antes de buscar los botones
document.addEventListener("DOMContentLoaded", function() {
    actualizarNavbarAuth();
});