import webview
import json
import sqlite3
import os
import shutil
import traceback
from tkinter import filedialog
import tkinter as tk

# Ruta de la base de datos
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'tasks.db')

class Api:
    def __init__(self):
        self.init_db()

    def init_db(self):
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        conn = sqlite3.connect(DB_PATH) # Conexión a la base de datos SQLite mediante su ruta
        cursor = conn.cursor() # Crear un cursor para ejecutar comandos SQL
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
            # Crear una ventana raíz oculta para tkinter
            root = tk.Tk()
            root.withdraw()  # Ocultar la ventana principal
            
            # Diálogo de GUARDAR archivo
            save_path = filedialog.asksaveasfilename(
                defaultextension=".db",
                filetypes=[
                    ("Base de datos SQLite", "*.db"),
                    ("Todos los archivos", "*.*")
                ],
                initialdir=os.path.expanduser("~/Desktop"),
                initialfile="utask_backup.db",
                title="Guardar copia de seguridad"
            )
            
            root.destroy()  # Cerrar la ventana raíz

            # Si se cancela, save_path será una cadena vacía
            if not save_path:
                print("Exportación cancelada por el usuario")
                return json.dumps({
                    "status": "cancelled",
                    "message": "Exportación cancelada por el usuario"
                })

            print(f"Guardando en: {save_path}")
            
            # Copiamos la base de datos
            shutil.copy2(DB_PATH, save_path)

            return json.dumps({
                "status": "success",
                "message": f"Base de datos exportada correctamente a:\n{save_path}"
            })

        except Exception as e:
            error_detail = traceback.format_exc()
            print("ERROR completo al exportar:\n" + error_detail)
            return json.dumps({
                "status": "error",
                "message": f"Error durante la exportación:\n{str(e)}"
            })

    def import_database(self):
        print("Solicitud de importación de base de datos recibida.")
        
        try:
            # Crear una ventana raíz oculta para tkinter
            root = tk.Tk()
            root.withdraw()  # Ocultar la ventana principal
            
            # Diálogo de ABRIR archivo
            open_path = filedialog.askopenfilename(
                filetypes=[
                    ("Base de datos SQLite", "*.db"),
                    ("Todos los archivos", "*.*")
                ],
                initialdir=os.path.expanduser("~/Desktop"),
                title="Seleccionar archivo de base de datos para importar"
            )
            
            root.destroy()  # Cerrar la ventana raíz

            # Si se cancela, open_path será una cadena vacía
            if not open_path:
                print("Importación cancelada por el usuario")
                return json.dumps({
                    "status": "cancelled",
                    "message": "Importación cancelada por el usuario"
                })

            print(f"Importando desde: {open_path}")
            
            # Verificamos que el archivo existe
            if not os.path.exists(open_path):
                return json.dumps({
                    "status": "error",
                    "message": f"El archivo no existe: {open_path}"
                })
            
            # Copiamos el archivo seleccionado a la ubicación de tasks.db (reemplazando el existente)
            shutil.copy2(open_path, DB_PATH)
            
            print(f"Base de datos importada correctamente desde: {open_path}")

            return json.dumps({
                "status": "success",
                "message": f"Base de datos importada correctamente desde:\n{open_path}\n\nLa aplicación se recargará para mostrar las nuevas tareas."
            })

        except Exception as e:
            error_detail = traceback.format_exc()
            print("ERROR completo al importar:\n" + error_detail)
            return json.dumps({
                "status": "error",
                "message": f"Error durante la importación:\n{str(e)}"
            })

    def close_app(self):
        """Cierra la aplicación"""
        print("Solicitud de cierre de aplicación recibida.")
        try:
            if webview.windows:
                webview.windows[0].destroy()
            return json.dumps({"status": "success"})
        except Exception as e:
            print(f"Error al cerrar la aplicación: {e}")
            return json.dumps({"status": "error", "message": str(e)})

if __name__ == '__main__':
    api = Api()
    webview.create_window('uTask - Gestor de Tareas', 'index.html', js_api=api, min_size=(800, 600))
    webview.start()
