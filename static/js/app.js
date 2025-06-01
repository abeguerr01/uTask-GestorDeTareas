document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM en gestor.html
    const anadirBtn = document.getElementById('anadir');
    const contenedorTareas = document.getElementById('contenedor');
    const inputTitulo = document.getElementById('tar-tit');
    const inputDescripcion = document.getElementById('tar-desc');
    const selectColor = document.getElementById('tar-color-select');

    // IMPORTANTE: Escuchar el evento 'pywebviewready' para asegurar que la API de Python esté disponible
    window.addEventListener('pywebviewready', async () => {
        console.log('pywebview está listo. Cargando tareas desde la base de datos...');
        loadTasks(); // Cargar las tareas cuando la interfaz esté lista
    });

    // --- FUNCIONES PARA INTERACTUAR CON LA BASE DE DATOS (VIA PYTHON) ---

    /**
     * Carga las tareas desde la base de datos a través de Python
     * y las renderiza en el DOM.
     */
    async function loadTasks() {
        try {
            // Llama al método get_tasks de la clase Api en Python
            const tasksJson = await pywebview.api.get_tasks();
            const tasks = JSON.parse(tasksJson); // Parsea el string JSON a un array de objetos JavaScript

            console.log('Tareas cargadas desde DB:', tasks);

            // Limpiar el contenedor actual antes de renderizar
            contenedorTareas.innerHTML = '';

            // Renderizar cada tarea en el DOM
            tasks.forEach(task => {
                // Aquí, el color no viene de la DB, así que usaremos un valor por defecto
                // o un valor fijo si deseas que las tareas de la DB tengan un color predeterminado
                // o si extiendes tu DB para almacenar el color.
                // Por ahora, usaremos un color por defecto o un color del select si lo quieres como referencia.
                const defaultColor = '#f9f9f9'; // Color por defecto si la DB no lo proporciona
                crearTareaDiv(task.id, task.title, task.description, defaultColor);
            });

        } catch (error) {
            console.error('Error al cargar tareas desde la base de datos:', error);
            // Mostrar un mensaje de error amigable al usuario en la UI
            contenedorTareas.innerHTML = `<p style="color: red;">No se pudieron cargar las tareas. Por favor, intente de nuevo más tarde.</p>`;
        }
    }

    /**
     * Maneja el clic en el botón "Añadir" para crear una nueva tarea.
     */
    anadirBtn.addEventListener('click', async () => {
        const title = inputTitulo.value.trim();
        const description = inputDescripcion.value.trim();
        const color = selectColor.value; // El color se maneja solo en el frontend por ahora

        if (!title) {
            alert('El título es obligatorio.');
            return;
        }

        try {
            const newTaskData = {
                title: title,
                description: description
            };
            // Llama al método add_task de la clase Api en Python
            const responseJson = await pywebview.api.add_task(newTaskData);
            const response = JSON.parse(responseJson);

            if (response.status === "success") {
                console.log('Tarea añadida a la DB con éxito:', response.task);
                // Añadir la tarea al DOM usando los datos devueltos por Python (incluye el ID)
                crearTareaDiv(response.task.id, response.task.title, response.task.description, color);

                // Limpiar los campos del formulario
                inputTitulo.value = '';
                inputDescripcion.value = '';
                selectColor.value = '#f9f9f9'; // Resetear color
            } else {
                alert('Error al añadir tarea: ' + response.message);
                console.error('Error al añadir tarea:', response.message);
            }
        } catch (error) {
            alert('Error de comunicación con el backend al añadir tarea.');
            console.error('Error de comunicación al añadir tarea:', error);
        }
    });

    /**
     * Crea y añade un elemento de tarea (div) al contenedor en el DOM.
     * @param {number} id - El ID de la tarea desde la base de datos.
     * @param {string} tituloTexto - El título de la tarea.
     * @param {string} descripcionTexto - La descripción de la tarea.
     * @param {string} colorTarea - El color de fondo de la tarea.
     */
    function crearTareaDiv(id, tituloTexto, descripcionTexto, colorTarea) {
        const tareaDiv = document.createElement('div');
        tareaDiv.classList.add('tarea');
        tareaDiv.style.backgroundColor = colorTarea || '#f9f9f9'; // Fallback a blanco si no hay color
        tareaDiv.style.setProperty('--tarea-color-fondo', colorTarea || '#f9f9f9');
        tareaDiv.dataset.taskId = id; // MUY IMPORTANTE: Almacenar el ID de la DB

        const subdiv = document.createElement('div');
        subdiv.classList.add('subdiv');

        const titulo = document.createElement('h3');
        titulo.textContent = tituloTexto;
        titulo.contentEditable = 'false'; // Por defecto no editable
        titulo.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evita saltos de línea en campos editables al presionar Enter
                titulo.blur(); // Quita el foco
            }
        });

        const descripcion = document.createElement('h5');
        descripcion.textContent = descripcionTexto;
        descripcion.contentEditable = 'false'; // Por defecto no editable
        descripcion.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                descripcion.blur();
            }
        });

        // Lógica para determinar el color del texto (blanco o negro) según el color de fondo
        const coloresOscurosParaTextoBlanco = ['#31518a', '#3CB371', '#DC3545'];
        const esFondoOscuroParaTexto = coloresOscurosParaTextoBlanco.includes(colorTarea);

        if (esFondoOscuroParaTexto) {
            titulo.style.color = 'white';
            descripcion.style.color = 'white';
        } else {
            titulo.style.color = 'black';
            descripcion.style.color = 'black';
        }

        subdiv.appendChild(titulo);
        subdiv.appendChild(descripcion);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.classList.add('btn-editar');

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('btn-eliminar');

        // Lógica de clases de hover para botones basada en el color de la tarea
        if (colorTarea === '#e7e552') {
            botonEliminar.classList.add('btn-hover-yellow-bg');
            botonEditar.classList.add('btn-hover-yellow-bg');
        } else if (colorTarea === '#f9f9f9') {
            botonEliminar.classList.add('btn-hover-black-bg');
            botonEditar.classList.add('btn-hover-black-bg');
            botonEditar.classList.add('btn-editar-blanco');
        }

        // --- Event Listener para el botón ELIMINAR ---
        botonEliminar.addEventListener('click', async () => {
            const taskId = parseInt(tareaDiv.dataset.taskId); // Obtener el ID de la DB
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                try {
                    // Llama al método delete_task de la clase Api en Python
                    const responseJson = await pywebview.api.delete_task(taskId);
                    const response = JSON.parse(responseJson);

                    if (response.status === "success") {
                        console.log('Tarea eliminada de la DB con éxito.');
                        contenedorTareas.removeChild(tareaDiv); // Eliminar la tarea del DOM
                    } else {
                        alert('Error al eliminar tarea: ' + response.message);
                        console.error('Error al eliminar tarea:', response.message);
                    }
                } catch (error) {
                    alert('Error de comunicación con el backend al eliminar tarea.');
                    console.error('Error de comunicación al eliminar tarea:', error);
                }
            }
        });

        // --- Event Listener para el botón EDITAR/GUARDAR ---
        botonEditar.addEventListener('click', async () => {
            const isEditing = botonEditar.textContent === 'Guardar';
            const taskId = parseInt(tareaDiv.dataset.taskId); // Obtener el ID de la DB

            if (!isEditing) {
                // Modo Edición: Habilitar edición del texto
                titulo.contentEditable = 'true';
                descripcion.contentEditable = 'true';
                titulo.focus(); // Pone el foco en el título para que el usuario pueda empezar a escribir

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

                if (!newTitulo) { // Si el título queda vacío, al menos poner un placeholder
                    titulo.textContent = '(Sin título)';
                    alert('El título no puede quedar vacío. Se asignará "(Sin título)".');
                }

                try {
                    // Llama al método update_task de la clase Api en Python
                    const responseJson = await pywebview.api.update_task(taskId, {
                        title: newTitulo,
                        description: newDescripcion
                    });
                    const response = JSON.parse(responseJson);

                    if (response.status === "success") {
                        console.log('Tarea actualizada en la DB con éxito.');
                        // No necesitas recargar todas las tareas si solo quieres actualizar la vista
                        // loadTasks(); // <--- Opcional: si quieres recargar toda la lista (menos eficiente)
                    } else {
                        alert('Error al actualizar tarea: ' + response.message);
                        console.error('Error al actualizar tarea:', response.message);
                    }
                } catch (error) {
                    alert('Error de comunicación con el backend al actualizar tarea.');
                    console.error('Error de comunicación al actualizar tarea:', error);
                }

                // Restablecer el estado del botón a "Editar"
                botonEditar.textContent = 'Editar';
                botonEditar.classList.remove('btn-guardar');
                botonEditar.classList.add('btn-editar');
            }
        });

        // Añadir botones al contenedor de botones
        buttonContainer.appendChild(botonEditar);
        buttonContainer.appendChild(botonEliminar);

        // Añadir sub-div y contenedor de botones al div de la tarea
        tareaDiv.appendChild(subdiv);
        tareaDiv.appendChild(buttonContainer);

        // Añadir el div de la tarea al contenedor principal
        contenedorTareas.appendChild(tareaDiv);
    }

    // --- FIN DE LA LÓGICA DE GESTIÓN DE TAREAS ---

    // Puedes eliminar cualquier otra lógica aquí que no necesites,
    // como los botones de "Hello Python" si no los estás usando.
});