document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos del DOM
    const boton = document.getElementById('anadir');
    const contenedor = document.getElementById('contenedor');
    const inputTitulo = document.getElementById('tar-tit');
    const inputDescripcion = document.getElementById('tar-desc');
    const selectColor = document.getElementById('tar-color-select');

    // 1. Cargar tareas guardadas al inicio
    const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareasGuardadas.forEach(({ id, titulo, descripcion, color }) => {
        crearTarea(titulo, descripcion, color, id);
    });

    // 2. Añadir nueva tarea al hacer clic en el botón "Añadir"
    boton.addEventListener('click', () => {
        const titulo = inputTitulo.value.trim();
        const descripcion = inputDescripcion.value.trim();
        const color = selectColor.value;
        const newId = Date.now();

        if (titulo) {
            crearTarea(titulo, descripcion, color, newId);
            guardarNuevaTarea(titulo, descripcion, color, newId);
            
            inputTitulo.value = '';
            inputDescripcion.value = '';
            selectColor.value = '#f9f9f9';
        } else {
            alert('El título es obligatorio.');
        }
    });

    // Función para crear un div de tarea en el DOM
    function crearTarea(tituloTexto, descripcionTexto, colorTarea, id = Date.now()) {
        const tareaDiv = document.createElement('div');
        tareaDiv.classList.add('tarea');
        tareaDiv.style.backgroundColor = colorTarea || '#f9f9f9';
        
        tareaDiv.style.setProperty('--tarea-color-fondo', colorTarea || '#f9f9f9');
        tareaDiv.dataset.taskId = id;

        const subdiv = document.createElement('div');
        subdiv.classList.add('subdiv');

        const titulo = document.createElement('h3');
        titulo.textContent = tituloTexto;
        titulo.contentEditable = 'false';
        titulo.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

        const descripcion = document.createElement('h5');
        descripcion.textContent = descripcionTexto;
        descripcion.contentEditable = 'false';
        
        // Lógica para determinar el color del texto del título y la descripción
        const coloresOscurosParaTextoBlanco = ['#31518a', '#3CB371', '#DC3545'];
        const esFondoOscuroParaTexto = coloresOscurosParaTextoBlanco.includes(colorTarea);

        if (esFondoOscuroParaTexto) {
            titulo.style.color = 'white';
            descripcion.style.color = 'white';
        } else {
            titulo.style.color = 'black';
            descripcion.style.color = 'black';
        }
        
        // CAMBIO AQUÍ: Primero añadimos el título y luego la descripción
        subdiv.appendChild(titulo);
        subdiv.appendChild(descripcion);

        // ---- Botones ----
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.classList.add('btn-editar');

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('btn-eliminar');

        // Lógica de clase de hover para el botón Eliminar Y EDITAR
        if (colorTarea === '#e7e552') { // Nuevo amarillo
            botonEliminar.classList.add('btn-hover-yellow-bg');
            botonEditar.classList.add('btn-hover-yellow-bg'); // APLICADO A BOTÓN EDITAR
        } else if (colorTarea === '#f9f9f9') { // Blanco
            botonEliminar.classList.add('btn-hover-black-bg');
            botonEditar.classList.add('btn-hover-black-bg'); // APLICADO A BOTÓN EDITAR
            botonEditar.classList.add('btn-editar-blanco'); // Clase adicional para el hover
        }

        // Event listener para el botón Eliminar
        botonEliminar.addEventListener('click', () => {
            contenedor.removeChild(tareaDiv);
            eliminarTarea(id);
        });

        // Event listener para el botón Editar/Guardar
        botonEditar.addEventListener('click', () => {
            const isEditing = botonEditar.textContent === 'Guardar';

            if (!isEditing) {
                // Modo Edición: Habilitar edición del texto
                titulo.contentEditable = 'true';
                descripcion.contentEditable = 'true';
                titulo.focus();
                
                // Cambiar texto y clase del botón
                botonEditar.textContent = 'Guardar';
                botonEditar.classList.remove('btn-editar');
                botonEditar.classList.add('btn-guardar');

            } else {
                // Modo Guardar: Deshabilitar edición y guardar cambios
                titulo.contentEditable = 'false';
                descripcion.contentEditable = 'false';

                const newTitulo = titulo.textContent.trim();
                const newDescripcion = descripcion.textContent.trim();

                actualizarTarea(id, newTitulo, newDescripcion, colorTarea);

                botonEditar.textContent = 'Editar';
                botonEditar.classList.remove('btn-guardar');
                botonEditar.classList.add('btn-editar');

                // Manejar el caso si el título queda vacío (opcional)
                if (!newTitulo) {
                    titulo.textContent = '(Sin título)';
                }
            }
        });

        buttonContainer.appendChild(botonEditar);
        buttonContainer.appendChild(botonEliminar);

        tareaDiv.appendChild(subdiv);
        tareaDiv.appendChild(buttonContainer);
        contenedor.appendChild(tareaDiv);
    }

    // Función para guardar una NUEVA tarea en localStorage
    function guardarNuevaTarea(titulo, descripcion, color, id) {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        tareas.push({ id, titulo, descripcion, color });
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    // Función para ACTUALIZAR una tarea existente en localStorage
    function actualizarTarea(id, newTitulo, newDescripcion, newColor) {
        let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        const index = tareas.findIndex(tarea => tarea.id == id);
        if (index !== -1) {
            tareas[index].titulo = newTitulo;
            tareas[index].descripcion = newDescripcion;
            localStorage.setItem('tareas', JSON.stringify(tareas));
        }
    }

    // Función para ELIMINAR una tarea de localStorage
    function eliminarTarea(id) {
        let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        tareas = tareas.filter(t => t.id != id);
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }
});
