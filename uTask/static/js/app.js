document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM en gestor.html
    const anadirBtn = document.getElementById('anadir');
    const contenedorTareas = document.getElementById('contenedor');
    const inputTitulo = document.getElementById('tar-tit');
    const inputDescripcion = document.getElementById('tar-desc');
    const selectColor = document.getElementById('tar-color-select');

    window.addEventListener('pywebviewready', async () => {
        console.log('pywebview está listo. Cargando tareas desde la base de datos...');
        loadTasks();
    });

    /**
     * Carga las tareas desde la base de datos a través de Python
     * y las renderiza en el DOM.
     */
    async function loadTasks() {
        try {
            const tasksJson = await pywebview.api.get_tasks();
            const tasks = JSON.parse(tasksJson);

            console.log('Tareas cargadas desde DB:', tasks);

            contenedorTareas.innerHTML = '';

            tasks.forEach(task => {
                // Usamos el color que viene de la base de datos
                // Si la DB no lo proporciona (por tareas antiguas), podemos usar un default
                const taskColor = task.color || '#f9f9f9'; // ¡USAMOS EL COLOR DE LA TAREA!
                crearTareaDiv(task.id, task.title, task.description, taskColor);
            });

        } catch (error) {
            console.error('Error al cargar tareas desde la base de datos:', error);
            contenedorTareas.innerHTML = `<p style="color: red;">No se pudieron cargar las tareas. Por favor, intente de nuevo más tarde.</p>`;
        }
    }

    anadirBtn.addEventListener('click', async () => {
        const title = inputTitulo.value.trim();
        const description = inputDescripcion.value.trim();
        const color = selectColor.value;

        if (!title) {
            alert('El título es obligatorio.');
            return;
        }

        try {
            const newTaskData = {
                title: title,
                description: description,
                color: color // ¡ENVIAMOS EL COLOR A PYTHON!
            };

            const responseJson = await pywebview.api.add_task(newTaskData);
            console.log('Respuesta cruda de Python (add_task):', responseJson);
            const response = JSON.parse(responseJson);

            if (response.status === "success") {
                console.log('Tarea añadida a la DB con éxito:', response.task);
                // Usamos el color de la respuesta de Python (que es el mismo que enviamos)
                crearTareaDiv(response.task.id, response.task.title, response.task.description, response.task.color);

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
                titulo.blur();
            }
        });

        const descripcion = document.createElement('h5');
        descripcion.textContent = descripcionTexto;
        descripcion.contentEditable = 'false';
        descripcion.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                descripcion.blur();
            }
        });

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

        if (colorTarea === '#e7e552') {
            botonEliminar.classList.add('btn-hover-yellow-bg');
            botonEditar.classList.add('btn-hover-yellow-bg');
        } else if (colorTarea === '#f9f9f9') {
            botonEliminar.classList.add('btn-hover-black-bg');
            botonEditar.classList.add('btn-hover-black-bg');
            botonEditar.classList.add('btn-editar-blanco');
        }

        botonEliminar.addEventListener('click', async () => {
            const taskId = parseInt(tareaDiv.dataset.taskId);
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                try {
                    const responseJson = await pywebview.api.delete_task(taskId);
                    const response = JSON.parse(responseJson);

                    if (response.status === "success") {
                        console.log('Tarea eliminada de la DB con éxito.');
                        contenedorTareas.removeChild(tareaDiv);
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

        botonEditar.addEventListener('click', async () => {
            const isEditing = botonEditar.textContent === 'Guardar';
            const taskId = parseInt(tareaDiv.dataset.taskId);

            if (!isEditing) {
                titulo.contentEditable = 'true';
                descripcion.contentEditable = 'true';
                titulo.focus();

                botonEditar.textContent = 'Guardar';
                botonEditar.classList.remove('btn-editar');
                botonEditar.classList.add('btn-guardar');

            } else {
                titulo.contentEditable = 'false';
                descripcion.contentEditable = 'false';

                const newTitulo = titulo.textContent.trim();
                const newDescripcion = descripcion.textContent.trim();

                if (!newTitulo) {
                    titulo.textContent = '(Sin título)';
                    alert('El título no puede quedar vacío. Se asignará "(Sin título)".');
                }

                try {
                    const responseJson = await pywebview.api.update_task(taskId, {
                        title: newTitulo,
                        description: newDescripcion
                    });
                    const response = JSON.parse(responseJson);

                    if (response.status === "success") {
                        console.log('Tarea actualizada en la DB con éxito.');
                    } else {
                        alert('Error al actualizar tarea: ' + response.message);
                        console.error('Error al actualizar tarea:', response.message);
                    }
                } catch (error) {
                    alert('Error de comunicación con el backend al actualizar tarea.');
                    console.error('Error de comunicación al actualizar tarea:', error);
                }

                botonEditar.textContent = 'Editar';
                botonEditar.classList.remove('btn-guardar');
                botonEditar.classList.add('btn-editar');
            }
        });

        buttonContainer.appendChild(botonEditar);
        buttonContainer.appendChild(botonEliminar);

        tareaDiv.appendChild(subdiv);
        tareaDiv.appendChild(buttonContainer);

        contenedorTareas.appendChild(tareaDiv);
    }
});