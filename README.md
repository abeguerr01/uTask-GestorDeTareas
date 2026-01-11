# uTask - Gestor de Tareas

## ¿Qué es uTask?

**uTask** es una aplicación de escritorio multiplataforma diseñada para gestionar tus tareas de manera sencilla y eficiente. Con una interfaz intuitiva y moderna, te permite crear, editar, eliminar y organizar tus tareas con la posibilidad de personalizarlas mediante colores.

### Características principales:

- ✅ **Gestión completa de tareas**: Crea, edita y elimina tareas fácilmente
- 🎨 **Personalización por colores**: Asigna colores a tus tareas para una mejor organización visual
- 💾 **Base de datos local**: Tus tareas se guardan localmente en SQLite
- 📤 **Exportar tareas**: Guarda una copia de seguridad de tus tareas en cualquier ubicación
- 📥 **Importar tareas**: Restaura tus tareas desde un archivo de respaldo
- 🖥️ **Interfaz moderna**: Diseño limpio y fácil de usar

---

## Guía de Uso

### Instalación

#### Windows:
1. Asegúrate de tener Python 3.7 o superior instalado
2. Ejecuta el archivo `instalarDependenciasWindows.bat` haciendo doble clic sobre él
3. Espera a que se instalen todas las dependencias

#### Linux:
1. Asegúrate de tener Python 3 instalado
2. Abre una terminal en la carpeta del proyecto
3. Ejecuta: `chmod +x instalarDependenciasLinux.sh`
4. Ejecuta: `./instalarDependenciasLinux.sh`

**Nota para Linux**: Si encuentras problemas con los diálogos de archivos, instala tkinter:
- Ubuntu/Debian: `sudo apt-get install python3-tk`
- Fedora: `sudo dnf install python3-tkinter`
- Arch: `sudo pacman -S tk`

### Ejecución

Una vez instaladas las dependencias, ejecuta la aplicación:

```bash
python main.py
```

### Uso de la aplicación

#### Crear una tarea:
1. En el panel lateral izquierdo, escribe el **título** de la tarea (obligatorio)
2. Opcionalmente, añade una **descripción**
3. Selecciona un **color** para la tarea
4. Haz clic en el botón **"Añadir"**

#### Editar una tarea:
1. Haz clic en el botón **"Editar"** de la tarea que deseas modificar
2. Modifica el título o descripción directamente en la tarjeta
3. Haz clic en **"Guardar"** para confirmar los cambios

#### Eliminar una tarea:
1. Haz clic en el botón **"Eliminar"** de la tarea que deseas eliminar
2. Confirma la eliminación en el diálogo que aparece

#### Exportar tareas:
1. Haz clic en el botón **"EXPORTAR TAREAS"** en la parte superior derecha
2. Selecciona la ubicación donde deseas guardar el archivo
3. Elige un nombre para el archivo (por defecto: `utask_backup.db`)
4. La base de datos se guardará como un archivo `.db`

#### Importar tareas:
1. Haz clic en el botón **"IMPORTAR TAREAS"** en la parte superior derecha
2. Selecciona el archivo `.db` que deseas importar
3. La aplicación reemplazará la base de datos actual con la importada
4. Las tareas se recargarán automáticamente

#### Cerrar la aplicación:
- Haz clic en el botón **"✕ CERRAR"** en la parte superior izquierda
- Confirma el cierre en el diálogo que aparece

---

## ¿Para quién va dirigido?

**uTask** está diseñado para:

- 👤 **Usuarios que buscan simplicidad**: Una herramienta sin complicaciones para gestionar tareas diarias
- 💼 **Profesionales**: Organiza tus proyectos y tareas de trabajo de manera eficiente
- 🎓 **Estudiantes**: Gestiona tus tareas académicas y proyectos de estudio
- 🏠 **Uso personal**: Organiza tus tareas domésticas y recordatorios personales
- 🔒 **Usuarios preocupados por la privacidad**: Tus datos se guardan localmente, sin conexión a internet ni servidores externos

La aplicación es ideal para cualquier persona que necesite una solución ligera, rápida y sin dependencias de servicios en la nube para gestionar sus tareas.

---

## Especificaciones Técnicas

### Versión de Python
- **Python 3.7 o superior** (recomendado Python 3.8+)

### Dependencias

#### Librerías externas:
- **pywebview** (última versión): Framework para crear aplicaciones de escritorio con tecnologías web

#### Módulos estándar de Python:
- `json`: Manejo de datos JSON
- `sqlite3`: Base de datos SQLite (incluido en Python)
- `os`: Operaciones del sistema operativo
- `shutil`: Operaciones de archivos de alto nivel
- `traceback`: Manejo de errores
- `tkinter`: Interfaz gráfica para diálogos de archivos (incluido en Python, requiere instalación adicional en algunos Linux)

### Base de Datos

**Sistema**: SQLite 3  
**Ubicación**: `data/tasks.db`  
**Estructura de la tabla `tasks`**:

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#f9f9f9'
)
```

**Campos**:
- `id`: Identificador único de la tarea (auto-incremental)
- `title`: Título de la tarea (obligatorio)
- `description`: Descripción opcional de la tarea
- `color`: Color de fondo de la tarea en formato hexadecimal (por defecto: blanco `#f9f9f9`)

### Arquitectura

**Backend (Python)**:
- `main.py`: Contiene la clase `Api` que gestiona la lógica de negocio y la comunicación con la base de datos
- Funciones principales:
  - `init_db()`: Inicializa la base de datos y crea la tabla si no existe
  - `get_tasks()`: Obtiene todas las tareas
  - `add_task()`: Añade una nueva tarea
  - `update_task()`: Actualiza una tarea existente
  - `delete_task()`: Elimina una tarea
  - `export_database()`: Exporta la base de datos a un archivo
  - `import_database()`: Importa una base de datos desde un archivo
  - `close_app()`: Cierra la aplicación

**Frontend (HTML/CSS/JavaScript)**:
- `index.html`: Página de inicio que redirige automáticamente al gestor
- `static/subpaginas/gestor.html`: Interfaz principal del gestor de tareas
- `static/css/gestor_style.css`: Estilos de la aplicación
- `static/js/app.js`: Lógica principal de la aplicación (CRUD de tareas)
- `static/js/importar-exportar.js`: Funcionalidad de importar/exportar

**Comunicación**:
- La comunicación entre el frontend y backend se realiza mediante `pywebview.api`, que expone los métodos de la clase `Api` al JavaScript

### Plataformas Soportadas

- ✅ **Windows** (7, 8, 10, 11)
- ✅ **Linux** (distribuciones principales)
- ✅ **macOS** (con instalación de dependencias adicionales si es necesario)

### Estructura del Proyecto

```
u27-Proyectos/
├── data/
│   └── tasks.db              # Base de datos SQLite
├── static/
│   ├── css/
│   │   ├── gestor_style.css  # Estilos del gestor
│   │   └── index_style.css   # Estilos de la página inicial
│   ├── js/
│   │   ├── app.js            # Lógica principal
│   │   ├── gestor.js         # (archivo legacy)
│   │   └── importar-exportar.js  # Funcionalidad importar/exportar
│   ├── recursos/             # Recursos estáticos (imágenes, etc.)
│   └── subpaginas/
│       └── gestor.html       # Interfaz principal
├── index.html                # Página de inicio
├── main.py                   # Aplicación principal
├── requirements.txt          # Dependencias del proyecto
├── instalarDependenciasWindows.bat  # Script de instalación Windows
├── instalarDependenciasLinux.sh     # Script de instalación Linux
└── README.md                 # Este archivo
```

### Características Técnicas Adicionales

- **Persistencia de datos**: Los datos se guardan automáticamente en la base de datos SQLite
- **Sin conexión a internet**: La aplicación funciona completamente offline
- **Interfaz responsiva**: Diseño adaptable que se ajusta al tamaño de la ventana
- **Manejo de errores**: Sistema robusto de manejo de errores con mensajes informativos
- **Diálogos nativos**: Uso de diálogos nativos del sistema operativo para importar/exportar archivos

---

## Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

---

## Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en el repositorio del proyecto.

---

**¡Disfruta organizando tus tareas con uTask!** 🎉
