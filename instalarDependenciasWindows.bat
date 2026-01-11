@echo off
echo ========================================
echo Instalador de Dependencias - Windows
echo ========================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no está instalado o no está en el PATH.
    echo Por favor, instala Python desde https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python detectado
python --version
echo.

REM Actualizar pip
echo Actualizando pip...
python -m pip install --upgrade pip
if errorlevel 1 (
    echo [ERROR] No se pudo actualizar pip.
    pause
    exit /b 1
)
echo.

REM Verificar que existe requirements.txt
if not exist "requirements.txt" (
    echo [ERROR] No se encontró el archivo requirements.txt
    pause
    exit /b 1
)

REM Instalar dependencias
echo Instalando dependencias desde requirements.txt...
echo.
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Hubo un error al instalar las dependencias.
    pause
    exit /b 1
)

echo.
echo ========================================
echo [EXITO] Todas las dependencias se instalaron correctamente!
echo ========================================
echo.
pause
