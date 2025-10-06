#!/bin/bash

echo "🚀 Iniciando Courses Service..."

# Función para matar procesos en puerto 4000
kill_port_4000() {
    echo "🔪 Verificando procesos en puerto 4000..."
    
    PIDS=$(lsof -ti:4000 2>/dev/null)
    if [ ! -z "$PIDS" ]; then
        echo "📋 Procesos encontrados en puerto 4000: $PIDS"
        echo "$PIDS" | xargs kill -9 2>/dev/null
        sleep 2
        echo "✅ Procesos en puerto 4000 eliminados"
    else
        echo "✅ No hay procesos usando el puerto 4000"
    fi
}

# Verificar que existe .env.docker
if [ ! -f ".env.docker" ]; then
    echo "❌ Error: Archivo .env.docker no encontrado"
    echo "💡 Copia env.docker.example a .env.docker y configura las variables"
    echo "   cp env.docker.example .env.docker"
    exit 1
fi

# Matar procesos en puerto 4000
kill_port_4000

# Ejecutar Docker Compose
echo "🐳 Iniciando Docker Compose..."
docker-compose up --build
