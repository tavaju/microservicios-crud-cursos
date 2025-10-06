# Docker Setup - Courses Service

Este proyecto incluye configuración Docker para ejecutar la aplicación NestJS con ngrok automáticamente.

## 🚀 Características

- ✅ Ejecuta `npm run start:dev` automáticamente
- ✅ Inicia ngrok en puerto 4000
- ✅ Verifica conexión con Supabase y muestra log de éxito
- ✅ Dashboard de ngrok disponible en puerto 4040
- ✅ Health checks automáticos

## 📋 Prerrequisitos

1. Docker instalado
2. Docker Compose instalado
3. Token de autenticación de ngrok
4. Variables de entorno de Supabase configuradas

## 🛠️ Configuración

### 1. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp env.docker.example .env.docker
```

Edita `.env.docker` con tus valores reales:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
NGROK_AUTHTOKEN=tu_token_de_ngrok
```

### 2. Obtener token de ngrok

1. Regístrate en [ngrok.com](https://ngrok.com)
2. Ve a [Dashboard > Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Copia tu token y pégalo en `.env.docker`

## 🐳 Uso

### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Opción 2: Docker directo

```bash
# Construir imagen
docker build -t courses-service .

# Ejecutar contenedor
docker run -p 4000:4000 -p 4040:4040 --env-file .env.docker courses-service
```

## 📊 Monitoreo

### Health Check
- **Aplicación**: http://localhost:4000/health
- **Swagger**: http://localhost:4000/api

### Ngrok Dashboard
- **Dashboard**: http://localhost:4040
- **URL Pública**: Se mostrará en los logs del contenedor

## 🔧 Comandos útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f courses-service

# Entrar al contenedor
docker-compose exec courses-service sh

# Reiniciar solo el servicio
docker-compose restart courses-service

# Ver estado de los servicios
docker-compose ps

# Limpiar volúmenes y redes
docker-compose down -v --remove-orphans
```

## 🐛 Troubleshooting

### Error: "ngrok: command not found"
- Verifica que el Dockerfile esté instalando ngrok correctamente
- Reconstruye la imagen: `docker-compose build --no-cache`

### Error: "Supabase connection failed"
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa que tu proyecto de Supabase esté activo

### Error: "Port already in use"
- Detén otros servicios que usen los puertos 4000 o 4040
- O cambia los puertos en docker-compose.yml

### Ngrok no muestra URL pública
- Verifica que tu token de ngrok sea válido
- Revisa los logs: `docker-compose logs courses-service`

## 📝 Logs esperados

```
🚀 Iniciando Courses Service...
📦 Iniciando aplicación NestJS...
🔍 Verificando conexión con Supabase...
✅ Conexión con Supabase exitosa
🚀 Iniciando ngrok en puerto 4000...
🌐 Aplicación disponible en: https://abc123.ngrok.io
📚 Documentación Swagger: https://abc123.ngrok.io/api
🏥 Health Check: https://abc123.ngrok.io/health
✅ Todos los servicios iniciados correctamente
```
