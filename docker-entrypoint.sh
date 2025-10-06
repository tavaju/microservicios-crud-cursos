#!/bin/sh

# Función para verificar conexión con Supabase
check_supabase_connection() {
    echo "🔍 Verificando conexión con Supabase..."
    
    # Esperar a que la aplicación esté lista
    sleep 10
    
    # Hacer request al health endpoint
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        echo "✅ Conexión con Supabase exitosa"
        return 0
    else
        echo "❌ Error: No se pudo conectar con Supabase"
        return 1
    fi
}

# Función para iniciar ngrok
start_ngrok() {
    echo "🚀 Iniciando ngrok en puerto 4000 con dominio específico..."
    ngrok http 4000 --url=true-urgently-horse.ngrok-free.app --log=stdout &
    NGROK_PID=$!
    
    # Esperar un poco para que ngrok se inicie
    sleep 5
    
    # Obtener la URL pública de ngrok
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*')
    
    if [ ! -z "$NGROK_URL" ]; then
        echo "🌐 Aplicación disponible en: $NGROK_URL"
        echo "📚 Documentación Swagger: $NGROK_URL/api"
        echo "🏥 Health Check: $NGROK_URL/health"
    else
        echo "⚠️  No se pudo obtener la URL de ngrok"
    fi
}

# Función para manejar señales de terminación
cleanup() {
    echo "🛑 Deteniendo servicios..."
    if [ ! -z "$APP_PID" ]; then
        kill $APP_PID 2>/dev/null
    fi
    if [ ! -z "$NGROK_PID" ]; then
        kill $NGROK_PID 2>/dev/null
    fi
    exit 0
}

# Configurar trap para manejar señales
trap cleanup SIGTERM SIGINT

echo "🚀 Iniciando Courses Service..."

# Paso 1: Iniciar la aplicación NestJS
echo "📦 Iniciando aplicación NestJS..."
npm run start:dev &
APP_PID=$!

# Paso 2: Verificar conexión con Supabase
if check_supabase_connection; then
    # Paso 3: Iniciar ngrok
    start_ngrok
    
    echo "✅ Todos los servicios iniciados correctamente"
    echo "📝 Presiona Ctrl+C para detener todos los servicios"
    
    # Mantener el contenedor corriendo
    wait $APP_PID
else
    echo "❌ No se pudo iniciar la aplicación correctamente"
    exit 1
fi
