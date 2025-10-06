#!/bin/bash

echo "🧪 Probando configuración Docker..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Verificar que existe el archivo .env.docker
if [ ! -f ".env.docker" ]; then
    echo "⚠️  Archivo .env.docker no encontrado"
    echo "📝 Copiando archivo de ejemplo..."
    cp env.docker.example .env.docker
    echo "✅ Archivo .env.docker creado. Por favor, configura las variables de entorno."
    echo "📋 Edita .env.docker con tus valores reales antes de continuar."
    exit 1
fi

# Verificar que el script de entrada sea ejecutable
if [ ! -x "docker-entrypoint.sh" ]; then
    echo "🔧 Haciendo ejecutable el script de entrada..."
    chmod +x docker-entrypoint.sh
fi

echo "✅ Configuración Docker lista"
echo "🚀 Para ejecutar: docker-compose up --build"
echo "📊 Para ver logs: docker-compose logs -f"
echo "🛑 Para detener: docker-compose down"
