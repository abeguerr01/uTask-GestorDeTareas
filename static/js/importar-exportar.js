// importar-exportar.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los botones y elementos
    const importBtn = document.getElementById('imp');
    const exportBtn = document.getElementById('exp');
    const importFileInput = document.getElementById('import-file-input');

    // Esperamos a que pywebview esté completamente listo
    window.addEventListener('pywebviewready', () => {
        console.log('pywebview API lista');

        // ────────────────────────────────────────────────
        //                  EXPORTAR BASE DE DATOS
        // ────────────────────────────────────────────────
        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
                console.log('→ Iniciando exportación de base de datos...');

                // Feedback visual inmediato
                const originalText = exportBtn.textContent;
                exportBtn.disabled = true;
                exportBtn.textContent = 'Exportando...';

                try {
                    const responseJson = await pywebview.api.export_database();
                    const response = JSON.parse(responseJson);

                    // Restauramos el botón
                    exportBtn.disabled = false;
                    exportBtn.textContent = originalText;

                    if (response.status === "success") {
                        mostrarMensaje('¡Éxito!', response.message, 'success');
                        console.log('Exportación completada:', response.message);
                    } 
                    else if (response.status === "cancelled") {
                        mostrarMensaje('Cancelado', 'La exportación fue cancelada', 'info');
                        console.log('Exportación cancelada por el usuario');
                    } 
                    else {
                        mostrarMensaje('Error', response.message || 'Error desconocido al exportar', 'error');
                        console.error('Error en exportación:', response.message);
                    }
                } 
                catch (err) {
                    // Restauramos el botón en caso de error grave
                    exportBtn.disabled = false;
                    exportBtn.textContent = originalText;

                    mostrarMensaje(
                        'Error de conexión',
                        'No se pudo comunicar con el backend',
                        'error'
                    );
                    console.error('Error al llamar a export_database:', err);
                }
            });
        }

        // ────────────────────────────────────────────────
        //                  IMPORTAR BASE DE DATOS (.db)
        // ────────────────────────────────────────────────
        if (importBtn) {
            importBtn.addEventListener('click', async () => {
                console.log('→ Iniciando importación de base de datos...');

                // Feedback visual inmediato
                const originalText = importBtn.textContent;
                importBtn.disabled = true;
                importBtn.textContent = 'Importando...';

                try {
                    const responseJson = await pywebview.api.import_database();
                    const response = JSON.parse(responseJson);

                    // Restauramos el botón
                    importBtn.disabled = false;
                    importBtn.textContent = originalText;

                    if (response.status === "success") {
                        mostrarMensaje('¡Éxito!', response.message, 'success');
                        console.log('Importación completada:', response.message);
                        
                        // Recargar las tareas después de un breve delay
                        setTimeout(() => {
                            if (typeof loadTasks === 'function') {
                                loadTasks();
                            } else {
                                // Si loadTasks no está disponible, recargar la página
                                window.location.reload();
                            }
                        }, 1500);
                    } 
                    else if (response.status === "cancelled") {
                        mostrarMensaje('Cancelado', 'La importación fue cancelada', 'info');
                        console.log('Importación cancelada por el usuario');
                    } 
                    else {
                        mostrarMensaje('Error', response.message || 'Error desconocido al importar', 'error');
                        console.error('Error en importación:', response.message);
                    }
                } 
                catch (err) {
                    // Restauramos el botón en caso de error grave
                    importBtn.disabled = false;
                    importBtn.textContent = originalText;

                    mostrarMensaje(
                        'Error de conexión',
                        'No se pudo comunicar con el backend',
                        'error'
                    );
                    console.error('Error al llamar a import_database:', err);
                }
            });
        }
    });
});

// Función auxiliar para mostrar notificaciones temporales
function mostrarMensaje(titulo, mensaje, tipo = 'info') {
    const colores = {
        success: '#28a745',
        error:   '#dc3545',
        info:    '#17a2b8',
        warning: '#ffc107'
    };

    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 14px 22px;
        border-radius: 8px;
        color: white;
        background: ${colores[tipo] || '#6c757d'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 15px;
        max-width: 380px;
        opacity: 0;
        transition: opacity 0.4s;
    `;

    div.innerHTML = `<strong>${titulo}</strong><br>${mensaje}`;
    document.body.appendChild(div);

    // Fade in
    setTimeout(() => {
        div.style.opacity = '1';
    }, 10);

    // Fade out y eliminación
    setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 500);
    }, 3800);
}