document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('anadir');
    const contenedor = document.getElementById('contenedor');

    boton.addEventListener('click', () => {
        // Crear el contenedor del nuevo elemento con clase "tarea"
        const nuevoDiv = document.createElement('div');
        nuevoDiv.classList.add('tarea');

        // Crear el título (h3)
        const titulo = document.createElement('h3');
        titulo.textContent = 'Título de ejemplo';

        // Crear la descripción (h5)
        const descripcion = document.createElement('h5');
        descripcion.textContent = 'Descripción de ejemplo';

        // Crear el botón de eliminar
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';

        // Añadir funcionalidad al botón de eliminar
        botonEliminar.addEventListener('click', () => {
            contenedor.removeChild(nuevoDiv);
        });

        // Agregar los elementos al div
        nuevoDiv.appendChild(titulo);
        nuevoDiv.appendChild(descripcion);
        nuevoDiv.appendChild(botonEliminar);

        // Agregar el nuevo div al contenedor
        contenedor.appendChild(nuevoDiv);
    });
});
