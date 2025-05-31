import webview
import threading
import time
import json # Para manejar datos JSON entre Python y JS

# --- CLASE API PARA COMUNICACIÓN JAVASCRIPT <-> PYTHON ---
# Esta clase expone métodos de Python que JavaScript puede llamar.
class Api:
    def __init__(self, window):
        self.window = window
        self.tasks = [] # Lista simple para simular la base de datos por ahora

    def get_tasks(self):
        """Devuelve todas las tareas."""
        print("Python: Solicitud de tareas recibida.")
        # En un proyecto real, aquí harías una consulta a tu base de datos SQL
        return json.dumps(self.tasks) # Devuelve las tareas como JSON string

    def add_task(self, task_data):
        """Añade una nueva tarea."""
        print(f"Python: Solicitud para añadir tarea: {task_data}")
        # task_data llega como un diccionario de JavaScript
        self.tasks.append(task_data)
        # Aquí harías una inserción en tu base de datos SQL
        return json.dumps({"status": "success", "message": "Tarea añadida", "task": task_data})

    def update_task(self, task_id, new_data):
        """Actualiza una tarea existente."""
        print(f"Python: Solicitud para actualizar tarea {task_id} con {new_data}")
        # Lógica para encontrar y actualizar la tarea en self.tasks
        # o en tu base de datos SQL
        for i, task in enumerate(self.tasks):
            if task.get("id") == task_id: # Suponiendo que las tareas tienen un 'id'
                self.tasks[i].update(new_data)
                return json.dumps({"status": "success", "message": "Tarea actualizada"})
        return json.dumps({"status": "error", "message": "Tarea no encontrada"})


    def delete_task(self, task_id):
        """Elimina una tarea."""
        print(f"Python: Solicitud para eliminar tarea {task_id}")
        initial_len = len(self.tasks)
        self.tasks = [task for task in self.tasks if task.get("id") != task_id]
        if len(self.tasks) < initial_len:
            return json.dumps({"status": "success", "message": "Tarea eliminada"})
        else:
            return json.dumps({"status": "error", "message": "Tarea no encontrada"})


    def say_hello(self, name):
        """Método de ejemplo para probar la comunicación."""
        print(f"Python: Hello, {name} from JavaScript!")
        return f"Hola desde Python, {name}!"

# --- FUNCIÓN PRINCIPAL PARA INICIAR LA APLICACIÓN ---
def start_app():
    # Cargar el HTML y el API de Python
    window = webview.create_window(
        'Mi Gestor de Tareas',
        url='index.html',  # Carga tu archivo HTML
        width=800,
        height=600,
        js_api=Api(webview.active_window) # Pasa una instancia de tu clase Api
    )

    # Iniciar la aplicación webview.
    # debug=True es útil para ver los logs en la consola.
    # http_server=True hace que pywebview inicie un servidor HTTP local
    # para servir tus archivos estáticos (HTML, CSS, JS).
    webview.start(debug=True, http_server=True)

if __name__ == '__main__':
    start_app()