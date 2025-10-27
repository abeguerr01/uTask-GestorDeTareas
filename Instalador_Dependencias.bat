@ECHO OFF
SETLOCAL

REM Nombre del archivo que contiene la lista de paquetes
SET "REQUIREMENTS_FILE=requirements.txt"

REM Verificar si el archivo existe
IF EXIST "%REQUIREMENTS_FILE%" (
    ECHO Iniciando la instalacion de paquetes desde %REQUIREMENTS_FILE%...
    ECHO.

    REM Leer el archivo línea por línea.
    REM "eol=#" omite líneas que empiezan con # (comentarios)
    REM "tokens=*" toma la línea entera aunque tenga espacios
    REM "delims=" asegura que no se divida la línea por espacios
    REM FOR /F por defecto ya omite líneas vacías
    FOR /F "usebackq eol=# tokens=* delims=" %%G IN ("%REQUIREMENTS_FILE%") DO (
        
        ECHO Instalando: %%G
        
        REM Ejecutar el comando de instalación
        pip install "%%G"
        
        REM Opcional: Verificar si la instalación fue exitosa
        REM %ERRORLEVEL% es el equivalente en batch de $? en bash
        IF %ERRORLEVEL% == 0 (
            ECHO Instalacion de %%G completada exitosamente. ✅
        ) ELSE (
            ECHO ERROR: Fallo la instalacion de %%G. ❌
        )
        ECHO -----------------------------------
    )
    
    ECHO.
    ECHO Proceso de instalacion finalizado.

) ELSE (
    ECHO ERROR: El archivo %REQUIREMENTS_FILE% no se encontro.
    ECHO Asegurate de que exista y este en el directorio actual.
)

ENDLOCAL

REM Opcional: Pausa el script al final para que la ventana no se cierre
REM si se ejecuta con doble clic. Borra esta línea si no la necesitas.
PAUSE