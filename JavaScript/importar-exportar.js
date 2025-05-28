document.addEventListener('DOMContentLoaded', () => {
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
        window.location.href = 'subpaginas/gestor.html';
    });
});