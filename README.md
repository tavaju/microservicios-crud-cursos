# courses-svc (NestJS + Supabase)

Servicio de **cursos** e **inscripciones** para arquitectura de microservicios.
Este servicio es **dueño** de las tablas `courses` y `enrollments` en **Supabase**.

## 🏗️ Arquitectura

- **Frontend** → `courses-svc` (CRUD cursos + inscripciones)
- **courses-svc** → **Supabase** (base de datos con SERVICE_ROLE key)
- **courses-svc** → **students-svc** (validación de estudiantes vía HTTP)

## 📋 Tablas en Supabase

Ejecuta este DDL en el **SQL Editor** de Supabase:

```sql
create extension if not exists "uuid-ossp";

create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric(12,2) default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

do $$
begin
  if not exists (select 1 from pg_type where typname = 'enrollment_status') then
    create type enrollment_status as enum ('active', 'cancelled');
  end if;
end$$;

create table if not exists public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null,
  course_id uuid not null references public.courses(id) on delete cascade,
  status enrollment_status not null default 'active',
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_active on public.courses (is_active);
create index if not exists idx_courses_title on public.courses using gin (to_tsvector('simple', coalesce(title, '')));
create index if not exists idx_enrollments_student on public.enrollments (student_id);
create index if not exists idx_enrollments_course on public.enrollments (course_id);
create index if not exists idx_enrollments_status on public.enrollments (status);

-- RLS (opcional - el backend usa SERVICE_ROLE que omite RLS)
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```bash
# App Configuration
PORT=4000
NODE_ENV=development

# Supabase (SERVICE_ROLE KEY - solo backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Students Service (para validación)
STUDENTS_SVC_BASE_URL=https://students-XXXX.ngrok.io

# CORS
CORS_ALLOWED_ORIGINS=https://tu-front.vercel.app,http://localhost:3000
```

> **⚠️ IMPORTANTE**: Usa `SUPABASE_SERVICE_ROLE_KEY` (no la anon) en el backend.

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Configurar .env con tus credenciales de Supabase
cp .env.example .env
# Editar .env con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY

# Ejecutar en desarrollo
npm run start:dev
```

## 📡 Endpoints Disponibles

### Cursos
- `GET /courses` - Listar cursos (con filtro `?isActive=true`)
- `GET /courses/active` - Solo cursos activos
- `GET /courses/:id` - Obtener curso por ID
- `POST /courses` - Crear curso
- `PATCH /courses/:id` - Actualizar curso
- `DELETE /courses/:id` - Eliminar curso

### Inscripciones
- `POST /enrollments` - Crear inscripción (valida student en students-svc)
- `GET /enrollments` - Listar inscripciones (filtros: `?studentId=`, `?courseId=`)
- `GET /enrollments/student/:studentId` - Inscripciones de un estudiante
- `GET /enrollments/course/:courseId` - Inscripciones de un curso
- `GET /enrollments/:id` - Obtener inscripción por ID
- `PATCH /enrollments/:id` - Actualizar inscripción (cambiar status)
- `DELETE /enrollments/:id` - Eliminar inscripción

### Health Check
- `GET /health` - Estado del servicio y conexión a DB

## 🔄 Flujo de Inscripción

1. **Frontend** → `POST /enrollments` con `{ studentId, courseId }`
2. **courses-svc** verifica que el curso existe
3. **courses-svc** → **students-svc** (`GET /students/:id`) para validar estudiante
4. Si estudiante existe → crear inscripción en Supabase
5. Respuestas:
   - `201` - Inscripción creada
   - `422` - Estudiante no encontrado
   - `404` - Curso no encontrado
   - `503` - students-svc no disponible

## 🏗️ Estructura del Proyecto

```
src/
├── supabase/           # Cliente Supabase
│   ├── supabase.module.ts
│   └── supabase.constants.ts
├── students-client/    # Cliente HTTP para students-svc
│   ├── students-client.module.ts
│   └── students-client.service.ts
├── courses/           # Módulo de cursos
│   ├── cursos.controller.ts
│   ├── cursos.service.ts
│   └── cursos.module.ts
├── enrollments/       # Módulo de inscripciones
│   ├── enrollments.controller.ts
│   ├── enrollments.service.ts
│   └── enrollments.module.ts
├── common/
│   ├── dto/           # DTOs compartidos
│   └── entities/      # Interfaces de datos
└── app.module.ts      # Módulo principal
```

## 🔧 Tecnologías

- **NestJS** - Framework Node.js
- **Supabase** - Base de datos PostgreSQL
- **@supabase/supabase-js** - Cliente JavaScript
- **@nestjs/axios** - Cliente HTTP para microservicios
- **Swagger** - Documentación API
- **class-validator** - Validación de datos

## 📚 Documentación

- **Swagger UI**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/health

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🚀 Scripts Disponibles

- `npm run start` - Iniciar aplicación
- `npm run start:dev` - Desarrollo con hot-reload
- `npm run start:debug` - Modo debug
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar en producción
- `npm run lint` - Linter
- `npm run format` - Formatear código

## 🔒 Seguridad

- **SERVICE_ROLE key** solo en backend (nunca en frontend)
- **RLS habilitado** en Supabase (omitido por SERVICE_ROLE)
- **CORS configurado** para dominios específicos
- **Validación de datos** con class-validator
- **Timeouts** en llamadas HTTP a otros servicios

## 📝 Notas de Desarrollo

- El frontend **NO** accede directamente a Supabase
- Todas las operaciones pasan por `courses-svc`
- `students-svc` es solo para validación (server-to-server)
- Usa UUIDs para todos los IDs
- Manejo de errores específicos para cada escenario