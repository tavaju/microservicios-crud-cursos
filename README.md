# Microservicio CRUD Cursos - NestJS

## Descripción
Microservicio para la gestión de cursos con operaciones CRUD completas.

## Características
- ✅ API REST completa con NestJS
- ✅ Base de datos PostgreSQL con TypeORM
- ✅ Validación de datos con class-validator
- ✅ Documentación automática con Swagger
- ✅ Estructura modular y escalable
- ✅ Configuración con variables de entorno

## Estructura del Proyecto
```
src/
├── common/
│   ├── dto/           # Data Transfer Objects
│   ├── entities/      # Entidades de base de datos
│   └── interfaces/    # Interfaces compartidas
├── cursos/           # Módulo de cursos
│   ├── cursos.controller.ts
│   ├── cursos.service.ts
│   └── cursos.module.ts
├── app.module.ts     # Módulo principal
└── main.ts          # Punto de entrada
```

## Configuración

### Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=cursos_db

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Base de Datos
1. Instala PostgreSQL
2. Crea la base de datos: `cursos_db`
3. Configura las credenciales en `.env`

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar en modo producción
npm run build
npm run start:prod
```

## Endpoints Disponibles

### Cursos
- `GET /cursos` - Obtener todos los cursos
- `GET /cursos/:id` - Obtener curso por ID
- `POST /cursos` - Crear nuevo curso
- `PATCH /cursos/:id` - Actualizar curso
- `DELETE /cursos/:id` - Eliminar curso

### Parámetros de consulta
- `?categoria=nombre` - Filtrar por categoría
- `?activos=true` - Solo cursos activos

## Documentación API
Una vez ejecutando la aplicación, visita:
- Swagger UI: http://localhost:3000/api

## Scripts Disponibles
- `npm run start` - Iniciar aplicación
- `npm run start:dev` - Iniciar en modo desarrollo con hot-reload
- `npm run start:debug` - Iniciar en modo debug
- `npm run build` - Compilar aplicación
- `npm run test` - Ejecutar tests
- `npm run test:e2e` - Ejecutar tests end-to-end
- `npm run lint` - Ejecutar linter
- `npm run format` - Formatear código

## Tecnologías Utilizadas
- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos
- **Swagger** - Documentación API
- **class-validator** - Validación de datos
- **Jest** - Testing framework