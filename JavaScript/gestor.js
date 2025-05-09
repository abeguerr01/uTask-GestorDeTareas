document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a los elementos del DOM
  const boton = document.getElementById('anadir');
  const contenedor = document.getElementById('contenedor');
  const inputTitulo = document.getElementById('tar-tit');
  const inputDescripcion = document.getElementById('tar-desc');
  const selectColor = document.getElementById('tar-color-select'); // Referencia al nuevo select de color

  // 1. Cargar tareas guardadas al inicio
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || []; // Obtener tareas existentes o un array vacío
  tareasGuardadas.forEach(({ titulo, descripcion, color }) => {
    crearTarea(titulo, descripcion, color); // Volver a crear las tareas guardadas
  });

  // 2. Añadir nueva tarea al hacer clic en el botón "Añadir"
  boton.addEventListener('click', () => {
    const titulo = inputTitulo.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const color = selectColor.value; // Obtener el valor del color seleccionado

    if (titulo) { // Validar que el título no esté vacío
      crearTarea(titulo, descripcion, color); // Crear la tarea en el DOM
      guardarTarea(titulo, descripcion, color); // Guardar la tarea en localStorage

      // Limpiar los campos del formulario después de añadir la tarea
      inputTitulo.value = '';
      inputDescripcion.value = '';
      selectColor.value = '#f9f9f9'; // Reiniciar el selector de color a blanco por defecto
    } else {
      alert('El título es obligatorio.'); // Alerta si el título está vacío
    }
  });

  // Función para crear un div de tarea en el DOM
  function crearTarea(tituloTexto, descripcionTexto, colorTarea) {
    const tareaDiv = document.createElement('div');
    tareaDiv.classList.add('tarea');
    tareaDiv.style.backgroundColor = colorTarea || '#f9f9f9'; // Aplicar el color de fondo a la tarea
    
    // Definir una variable CSS en el div.tarea para que el botón de eliminar la pueda usar en su hover
    tareaDiv.style.setProperty('--tarea-color-fondo', colorTarea || '#f9f9f9');

    const subdiv = document.createElement('div');
    subdiv.classList.add('subdiv');

    const titulo = document.createElement('h3');
    titulo.textContent = tituloTexto;

    // Lógica para determinar el color del texto del título y la descripción
    // El texto será blanco para fondos oscuros (azul, verde, rojo) Y amarillo
    const coloresOscurosParaTextoBlanco = ['#31518a', '#3CB371', '#DC3545', '#FFD700']; // Azul, Verde, Rojo, ¡Amarillo!
    const esFondoOscuroParaTexto = coloresOscurosParaTextoBlanco.includes(colorTarea);

    if (esFondoOscuroParaTexto) {
      titulo.style.color = 'white'; // Texto blanco para fondos oscuros (incluido amarillo)
    } else {
      titulo.style.color = 'black'; // Texto negro para fondos claros (solo blanco)
    }
    
    subdiv.appendChild(titulo);

    if (descripcionTexto) { // Si hay descripción, crear y añadir el h5
      const descripcion = document.createElement('h5');
      descripcion.textContent = descripcionTexto;
      
      // Aplicar la misma lógica de color de texto a la descripción
      if (esFondoOscuroParaTexto) {
        descripcion.style.color = 'white';
      } else {
        descripcion.style.color = 'black';
      }

      subdiv.appendChild(descripcion);
    }

    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.classList.add('btn-eliminar');

    // Lógica para añadir una clase al botón de eliminar
    // Esta clase indicará el estilo de hover específico del botón.
    if (colorTarea === '#FFD700') { // Si la tarea es AMARILLA
      botonEliminar.classList.add('btn-hover-yellow-bg'); // Clase para hover con texto/borde negro y fondo amarillo
    } else if (colorTarea === '#f9f9f9') { // Si la tarea es BLANCA
      botonEliminar.classList.add('btn-hover-black-bg'); // Clase para hover con fondo negro y texto/borde blanco
    }
    // Para Azul, Verde, Rojo, no se añade ninguna clase extra, y se usarán los estilos de hover por defecto del CSS.

    // Añadir evento click al botón "Eliminar"
    botonEliminar.addEventListener('click', () => {
      contenedor.removeChild(tareaDiv); // Eliminar la tarea del DOM
      eliminarTarea(tituloTexto, descripcionTexto, colorTarea); // Eliminar la tarea de localStorage
    });

    // Añadir los elementos al div de la tarea
    tareaDiv.appendChild(subdiv);
    tareaDiv.appendChild(botonEliminar);
    contenedor.appendChild(tareaDiv); // Añadir la tarea al contenedor principal
  }

  // Función para guardar una tarea en localStorage
  function guardarTarea(titulo, descripcion, color) {
    const tareas = JSON.parse(localStorage.getItem('tareas')) || []; // Obtener tareas existentes o un array vacío
    tareas.push({ titulo, descripcion, color }); // Añadir la nueva tarea (con su color)
    localStorage.setItem('tareas', JSON.stringify(tareas)); // Guardar el array actualizado en localStorage
  }

  // Función para eliminar una tarea de localStorage
  function eliminarTarea(titulo, descripcion, color) {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    // Filtrar la tarea a eliminar. Se usa título, descripción y color para manejar duplicados
    tareas = tareas.filter(t => t.titulo !== titulo || t.descripcion !== descripcion || t.color !== color);
    localStorage.setItem('tareas', JSON.stringify(tareas)); // Guardar el array actualizado
  }
});