import webview
import json
import sqlite3
import os

# Ruta de la base de datos
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'tasks.db')

class Api:
    def __init__(self):
        self.init_db()

    def init_db(self):
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT, -- ¡CORRECCIÓN AQUÍ! Era 'PRIMARYORY KEY'
                title TEXT NOT NULL,
                description TEXT,
                color TEXT DEFAULT '#f9f9f9'
            )
        ''')
        conn.commit()
        conn.close()
        print("Base de datos inicializada o verificada.")

    def get_tasks(self):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT id, title, description, color FROM tasks")
            tasks = [{"id": row[0], "title": row[1], "description": row[2], "color": row[3]} for row in cursor.fetchall()]
            conn.close()
            print(f"Tareas obtenidas de la DB (con color): {tasks}")
            return json.dumps(tasks)
        except Exception as e:
            print(f"Error en get_tasks: {e}")
            return json.dumps({"status": "error", "message": str(e)})

    def add_task(self, task_data):
        print(f"Recibiendo datos de tarea para añadir (con color): {task_data}")
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            title = task_data.get('title')
            description = task_data.get('description')
            color = task_data.get('color', '#f9f9f9')

            cursor.execute("INSERT INTO tasks (title, description, color) VALUES (?, ?, ?)", (title, description, color))
            new_task_id = cursor.lastrowid
            conn.commit()
            conn.close()

            new_task = {
                "id": new_task_id,
                "title": title,
                "description": description,
                "color": color
            }
            print(f"Tarea añadida con éxito. Datos devueltos: {new_task}")
            return json.dumps({"status": "success", "message": "Tarea añadida con éxito", "task": new_task})
        except Exception as e:
            print(f"Error al añadir tarea en Python (add_task): {e}")
            return json.dumps({"status": "error", "message": str(e)})

    def update_task(self, task_id, task_data):
        print(f"Recibiendo datos de tarea para actualizar: ID={task_id}, Datos={task_data}")
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            title = task_data.get('title')
            description = task_data.get('description')
            # Si quisieras actualizar el color desde JS, lo harías aquí:
            # color = task_data.get('color')
            # if color:
            #    cursor.execute("UPDATE tasks SET title = ?, description = ?, color = ? WHERE id = ?", (title, description, color, task_id))
            # else:
            cursor.execute("UPDATE tasks SET title = ?, description = ? WHERE id = ?", (title, description, task_id))
            conn.commit()
            conn.close()
            print(f"Tarea con ID {task_id} actualizada con éxito.")
            return json.dumps({"status": "success", "message": "Tarea actualizada con éxito"})
        except Exception as e:
            print(f"Error al actualizar tarea en Python (update_task): {e}")
            return json.dumps({"status": "error", "message": str(e)})

    def delete_task(self, task_id):
        print(f"Recibiendo solicitud para eliminar tarea ID: {task_id}")
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            conn.commit()
            conn.close()
            print(f"Tarea con ID {task_id} eliminada con éxito.")
            return json.dumps({"status": "success", "message": "Tarea eliminada con éxito"})
        except Exception as e:
            print(f"Error al eliminar tarea en Python (delete_task): {e}")
            return json.dumps({"status": "error", "message": str(e)})
           
    def export_database(self):
        print("Solicitud de exportación de base de datos recibida.")
        try:
            # Obtener la ventana actual para usar save_file
            # self.window se asigna en start_app si es necesario,
            # pero webview.windows[0] es más directo si solo hay una ventana.
            # Asegúrate de que webview.windows esté disponible cuando se llama a esto.
            current_window = webview.windows[0] if webview.windows else None

            if not current_window:
                print("Error: No se encontró la ventana de PyWebView.")
                return json.dumps({"status": "error", "message": "No se encontró la ventana de la aplicación."})

            # Abre un diálogo para que el usuario elija dónde guardar el archivo
            # El nombre de archivo por defecto será 'tasks_export.db'
            # y el tipo de archivo será 'SQLite Database (*.db)'
            result = current_window.save_file(
                'Exportar Base de Datos',
                file_name='tasks_export.db',
                directory=os.path.expanduser('~'), # Directorio por defecto: carpeta de usuario
                save_as_dialog=True, # Forzar el diálogo de guardar como
                file_types=('SQLite Database (*.db)', 'All files (*.*)')
            )

            if result: # Si el usuario seleccionó una ruta
                save_path = result
                # Asegúrate de que la base de datos esté cerrada antes de copiarla
                # Esto es crucial para evitar errores de bloqueo de archivo
                try:
                    # Cerrar la conexión actual a la DB si está abierta
                    # (aunque get_db_connection cierra la conexión después de cada operación,
                    # es una buena práctica asegurar que no haya bloqueos).
                    # Para copiar el archivo, no necesitamos una conexión abierta.
                    pass
                except Exception as close_e:
                    print(f"Advertencia: No se pudo cerrar una conexión previa a la DB: {close_e}")

                # Copiar el archivo de la base de datos a la ubicación elegida por el usuario
                import shutil
                shutil.copyfile(DB_PATH, save_path)
                print(f"Base de datos exportada a: {save_path}")
                return json.dumps({"status": "success", "message": f"Base de datos exportada a {save_path}"})
            else:
                print("Exportación de base de datos cancelada por el usuario.")
                return json.dumps({"status": "cancelled", "message": "Exportación cancelada."})

        except Exception as e:
            print(f"Error al exportar la base de datos: {e}")
            return json.dumps({"status": "error", "message": f"Error al exportar: {str(e)}"})

if __name__ == '__main__':
    api = Api()
    webview.create_window('uTask - Gestor de Tareas', 'index.html', js_api=api, min_size=(800, 600))
    webview.start()
