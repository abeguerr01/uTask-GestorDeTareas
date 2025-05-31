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

            //Almacenado de tareas

            const tarea = {
                id: idtar,
                titulo: titulo,
                descripcion: descripcion,
                color: color,
                fecha: newId
            }
            
            let nombref = nombre
            const userJsonFormattedString = JSON.stringify(userData, null, 2); // Indentación de 2 espacios
            const userOutputFilename = 'saves/'+ nombref +'.json';

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

    /* ======================================================================================================================================== */

    const importBtn = document.getElementById('imp');
    const exportBtn = document.getElementById('exp');
    const importFileInput = document.getElementById('import-file-input');

    // --- Lógica para EXPORTAR tareas ---
    exportBtn.addEventListener('click', () => {
        // Lee las tareas del localStorage (usa la misma clave 'tareas' que gestor.js)
        const tasks = JSON.parse(localStorage.getItem('tareas')) || [];
        const jsonString = JSON.stringify(tasks, null, 2); // Formato legible

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'uTASK_tareas.json'; // Nombre del archivo que se descargará
        document.body.appendChild(a); // Añade el enlace al DOM
        a.click(); // Simula un click para iniciar la descarga
        document.body.removeChild(a); // Limpia el enlace
        URL.revokeObjectURL(url); // Libera la URL del objeto Blob
        alert('Tareas exportadas como uTASK_tareas.json');
    });

    // --- Lógica para IMPORTAR tareas ---
    importBtn.addEventListener('click', () => {
        importFileInput.click(); // Dispara el click en el input de tipo file oculto
    });

    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);

                // Validación básica: asegura que sea un array
                if (!Array.isArray(importedTasks)) {
                    alert('Error: El archivo JSON no contiene un array de tareas válido.');
                    return;
                }

                // Sobrescribe las tareas existentes en localStorage con las importadas
                // ¡Importante!: Usa la misma clave 'tareas' que usa gestor.js
                localStorage.setItem('tareas', JSON.stringify(importedTasks));

                // Limpiar el valor del input file para permitir la misma selección de archivo de nuevo
                event.target.value = '';

            } catch (error) {
                alert('Error al leer o parsear el archivo JSON. Asegúrate de que sea un JSON válido.');
                console.error('Error importando JSON:', error);
            }
        };
        reader.readAsText(file); // Lee el contenido del archivo como texto
        location.reload(); // Recargar la página para reflejar los cambios
    });
});
