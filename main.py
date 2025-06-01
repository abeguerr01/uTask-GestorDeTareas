# main.py (Versión corregida y más robusta)
import webview
import sqlite3
import json
import os

# --- CONFIGURACIÓN DE LA BASE DE DATOS ---
DB_FILE = 'data/tasks.db'

# --- CLASE API PARA COMUNICACIÓN JAVASCRIPT <-> PYTHON ---
class Api:
    def __init__(self): # No se necesita la ventana aquí si no la usas en la inicialización
        self.window = None # Se asignará después si es necesario
        self._initialize_db()

    def set_window(self, window):
        self.window = window # Asigna la ventana una vez que esté disponible

    def _get_db_connection(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

    def _initialize_db(self):
        # Asegúrate de que la carpeta 'data' exista
        os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
        conn = self._get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT
            )
        ''')
        conn.commit()
        conn.close()
        print("Python: Base de datos SQLite inicializada y tabla 'tasks' creada/verificada.")

    # ... (rest of your Api methods: get_tasks, add_task, update_task, delete_task, say_hello) ...
    # Asegúrate de que estos métodos no usen self.window a menos que sea realmente necesario
    # para operaciones que requieran la ventana (ej. mostrar un diálogo nativo).
    # Para get/add/update/delete tasks, no necesitas la ventana.
    def get_tasks(self):
        # ... (código de get_tasks sin self.window) ...
        print("Python: Solicitud de tareas recibida (DB).")
        conn = self._get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, description FROM tasks ORDER BY id DESC")
        tasks = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return json.dumps(tasks)

    def add_task(self, task_data):
        # ... (código de add_task sin self.window) ...
        title = task_data.get('title')
        description = task_data.get('description', '')
        if not title:
            return json.dumps({"status": "error", "message": "Title cannot be empty"})

        conn = self._get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute('INSERT INTO tasks (title, description) VALUES (?, ?)', (title, description))
            conn.commit()
            task_id = cursor.lastrowid
            new_task = {"id": task_id, "title": title, "description": description}
            return json.dumps({"status": "success", "message": "Tarea añadida", "task": new_task})
        except Exception as e:
            conn.rollback()
            return json.dumps({"status": "error", "message": str(e)})
        finally:
            conn.close()
    # ... (y el resto de los métodos update_task, delete_task, say_hello)

# --- FUNCIÓN PRINCIPAL PARA INICIAR LA APLICACIÓN ---
def start_app():
    # Crea una instancia de la API primero
    my_api = Api()

    window = webview.create_window(
        'uTask - Gestor de Tareas',
        url='index.html', # Asegúrate de que esta sea la ruta correcta a gestor.html
                                             # O si prefieres, 'index.html' y que el usuario navegue.
                                             # El último fragmento de main.py que me pasaste cargaba gestor.html directamente.
        width=1000,
        height=700,
        js_api=my_api # Pasa la instancia de la API aquí
    )
    # Si la API NECESITA la ventana, la puedes asignar después:
    # my_api.set_window(window) # Descomenta esto si tu API realmente usa self.window

    webview.start(debug=True, http_server=True) # Mueve debug=True aquí

if __name__ == '__main__':
    start_app()