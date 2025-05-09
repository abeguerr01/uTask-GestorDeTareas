document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('anadir');
  const contenedor = document.getElementById('contenedor');
  const inputTitulo = document.getElementById('tar-tit');
  const inputDescripcion = document.getElementById('tar-desc');

  // Cargar tareas guardadas
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
  tareasGuardadas.forEach(({ titulo, descripcion }) => {
      crearTarea(titulo, descripcion);
  });

  // Añadir nueva tarea
  boton.addEventListener('click', () => {
      const titulo = inputTitulo.value.trim();
      const descripcion = inputDescripcion.value.trim();

      if (titulo) {
          crearTarea(titulo, descripcion);
          guardarTarea(titulo, descripcion);

          inputTitulo.value = '';
          inputDescripcion.value = '';
      } else {
          alert('El título es obligatorio.');
      }
  });

  function crearTarea(tituloTexto, descripcionTexto) {
      const tareaDiv = document.createElement('div');
      tareaDiv.classList.add('tarea');

      const subdiv = document.createElement('div');
      subdiv.classList.add('subdiv');

      const titulo = document.createElement('h3');
      titulo.textContent = tituloTexto;

      subdiv.appendChild(titulo);

      if (descripcionTexto) {
          const descripcion = document.createElement('h5');
          descripcion.textContent = descripcionTexto;
          subdiv.appendChild(descripcion);
      }

      const botonEliminar = document.createElement('button');
      botonEliminar.textContent = 'Eliminar';
      botonEliminar.classList.add('btn-eliminar');

      botonEliminar.addEventListener('click', () => {
          contenedor.removeChild(tareaDiv);
          eliminarTarea(tituloTexto, descripcionTexto);
      });

      tareaDiv.appendChild(subdiv);
      tareaDiv.appendChild(botonEliminar);
      contenedor.appendChild(tareaDiv);
  }

  function guardarTarea(titulo, descripcion) {
      const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
      tareas.push({ titulo, descripcion });
      localStorage.setItem('tareas', JSON.stringify(tareas));
  }

  function eliminarTarea(titulo, descripcion) {
      let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
      tareas = tareas.filter(t => t.titulo !== titulo || t.descripcion !== descripcion);
      localStorage.setItem('tareas', JSON.stringify(tareas));
  }
});
