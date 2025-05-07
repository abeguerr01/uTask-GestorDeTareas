document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('anadir');
    const contenedor = document.getElementById('contenedor');
    const tituloInput = document.getElementById('tar-tit');
    const descripcionInput = document.getElementById('tar-desc');
  
    boton.addEventListener('click', () => {
      const tituloTexto = tituloInput.value.trim();
      const descripcionTexto = descripcionInput.value.trim();
  
      if (tituloTexto) {
        // Crear el contenedor del nuevo elemento con clase "tarea"
        const nuevoDiv = document.createElement('div');
        nuevoDiv.classList.add('tarea');
  
        // Crear el título (h3)
        const titulo = document.createElement('h2');
        titulo.textContent = tituloTexto;
  
        // Añadir el título al div (siempre primero)
        nuevoDiv.appendChild(titulo);
  
        // Crear la descripción (h5) solo si hay texto
        if (descripcionTexto) {
          const descripcion = document.createElement('h5');
          descripcion.textContent = descripcionTexto;
          nuevoDiv.appendChild(descripcion);
        }
  
        // Crear el botón de eliminar
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
  
        // Añadir funcionalidad al botón de eliminar
        botonEliminar.addEventListener('click', () => {
          contenedor.removeChild(nuevoDiv);
        });
  
        // Agregar el botón de eliminar al div
        nuevoDiv.appendChild(botonEliminar);
  
        // Agregar el nuevo div al contenedor principal
        contenedor.appendChild(nuevoDiv);
  
        // Limpiar los campos del formulario
        tituloInput.value = '';
        descripcionInput.value = '';
      } else {
        alert('Por favor, introduce un título para la tarea.');
      }
    });
  });