#!/bin/bash

echo "========================================"
echo "Instalador de Dependencias - Linux"
echo "========================================"
echo ""

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 no está instalado."
    echo "Por favor, instala Python3 usando tu gestor de paquetes:"
    echo "  Ubuntu/Debian: sudo apt-get install python3 python3-pip"
    echo "  Fedora: sudo dnf install python3 python3-pip"
    echo "  Arch: sudo pacman -S python python-pip"
    exit 1
fi

echo "[OK] Python3 detectado"
python3 --version
echo ""

# Actualizar pip
echo "Actualizando pip..."
python3 -m pip install --upgrade pip --user
if [ $? -ne 0 ]; then
    echo "[ERROR] No se pudo actualizar pip."
    exit 1
fi
echo ""

# Verificar que existe requirements.txt
if [ ! -f "requirements.txt" ]; then
    echo "[ERROR] No se encontró el archivo requirements.txt"
    exit 1
fi

# Instalar dependencias
echo "Instalando dependencias desde requirements.txt..."
echo ""
python3 -m pip install -r requirements.txt --user
if [ $? -ne 0 ]; then
    echo "[ERROR] Hubo un error al instalar las dependencias."
    exit 1
fi

echo ""
echo "========================================"
echo "[EXITO] Todas las dependencias se instalaron correctamente!"
echo "========================================"
echo ""
