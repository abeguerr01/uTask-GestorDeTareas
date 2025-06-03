document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los botones de importar y exportar
    const importBtn = document.getElementById('imp');
    const exportBtn = document.getElementById('exp');
    const importFileInput = document.getElementById('import-file-input');

    // IMPORTANTE: Escuchar el evento 'pywebviewready' para asegurar que la API de Python esté disponible
    window.addEventListener('pywebviewready', () => {
        console.log('pywebview está listo para importar/exportar.');

        // --- Lógica para EXPORTAR TAREAS (Base de Datos) ---
        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
                console.log('Botón EXPORTAR TAREAS clickeado.');
                try {
                    // Llamar al método de Python para exportar la base de datos
                    const responseJson = await pywebview.api.export_database();
                    const response = JSON.parse(responseJson);

                    if (response.status === "success") {
                        // Usar una alerta personalizada o un modal en lugar de alert()
                        // alert(response.message);
                        console.log(response.message);
                        // Aquí podrías mostrar un mensaje de éxito más amigable en la UI
                    } else if (response.status === "cancelled") {
                        console.log(response.message);
                        // Aquí podrías informar al usuario que la exportación fue cancelada
                    } else {
                        // Usar una alerta personalizada o un modal en lugar de alert()
                        // alert('Error al exportar la base de datos: ' + response.message);
                        console.error('Error al exportar la base de datos:', response.message);
                        // Aquí podrías mostrar un mensaje de error más amigable en la UI
                    }
                } catch (error) {
                    // Usar una alerta personalizada o un modal en lugar de alert()
                    // alert('Error de comunicación con el backend al exportar la base de datos.');
                    console.error('Error de comunicación al exportar la base de datos:', error);
                    // Aquí podrías mostrar un mensaje de error de comunicación
                }
            });
        }

        // --- Lógica para IMPORTAR TAREAS (desde archivo JSON) ---
        // Esta parte asume que el importar sería para un JSON de tareas, no la DB completa
        // Si quisieras importar la DB completa, la lógica sería similar a la de exportar
        // pero usando pywebview.windows.open_file y luego leyendo el archivo en Python.
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                console.log('Botón IMPORTAR TAREAS clickeado.');
                // Activa el input de tipo 'file' oculto
                importFileInput.click();
            });

            importFileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            const fileContent = e.target.result;
                            // Aquí llamarías a un método de Python para procesar el JSON importado
                            // Por ejemplo: await pywebview.api.import_tasks_from_json(fileContent);
                            console.log('Contenido del archivo JSON importado:', fileContent);
                            // alert('Archivo importado con éxito. (La lógica de procesamiento debe ir en Python)');
                            // Mostrar un mensaje de éxito/error en la UI
                        } catch (error) {
                            console.error('Error al leer el archivo importado:', error);
                            // alert('Error al leer el archivo.');
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }
    });
});
