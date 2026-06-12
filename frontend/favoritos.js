//Carga y muestra solo los viajes favoritos
async function iniciarFavoritos() {
    pintarHeader();
    pintarFooter();

    let viajes = await apiViajes.obtenerTodos();

    if (!viajes) {
        return;
    }

    gestorViajes.guardar(viajes);
    mostrarFavoritos();

    document.body.classList.add("pagina-cargada");
}

iniciarFavoritos();