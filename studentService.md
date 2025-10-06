# students-svc - Documentación Técnica

## 📋 Descripción General

Microservicio de **estudiantes** que se integra con `courses-svc` para validación de estudiantes en inscripciones. Este servicio es **dueño** de la tabla `students` y debe ser accesible vía HTTP para validaciones server-to-server.

## 🏗️ Arquitectura de Integración

```
Frontend → courses-svc → students-svc (validación)
                ↓
            Supabase (courses, enrollments)
```

- **courses-svc** llama a **students-svc** para validar `studentId` antes de crear inscripciones
- **students-svc** debe responder con códigos HTTP específicos para diferentes escenarios
- **Comunicación**: HTTP REST (no directo a base de datos)

## 📊 Estructura de Base de Datos

### Tabla: `students`

```sql
create extension if not exists "uuid-ossp";

create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  phone text,
  date_of_birth date,
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

drop trigger if exists trg_students_updated_at on public.students;
create trigger trg_students_updated_at
before update on public.students
for each row execute function public.set_updated_at();

create index if not exists idx_students_email on public.students (email);
create index if not exists idx_students_active on public.students (is_active);
create index if not exists idx_students_name on public.students using gin (to_tsvector('simple', coalesce(name, '')));

-- RLS (opcional - el backend usa SERVICE_ROLE que omite RLS)
alter table public.students enable row level security;
```

## 🔧 Configuración Técnica

### Variables de Entorno

```bash
# App Configuration
PORT=3000
NODE_ENV=development

# Supabase (SERVICE_ROLE KEY - solo backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# CORS (para desarrollo)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000
```

### Dependencias Principales

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/config": "^11.0.0",
  "@nestjs/swagger": "^8.0.0",
  "@supabase/supabase-js": "^2.39.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1"
}
```

## 📡 Endpoints Requeridos

### 1. **GET /students/:id** ⭐ (CRÍTICO para courses-svc)

**Descripción**: Obtener estudiante por ID (usado por courses-svc para validación)

**Parámetros**:
- `id` (path): UUID del estudiante

**Respuestas**:
```typescript
// 200 OK - Estudiante encontrado
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-15",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}

// 404 Not Found - Estudiante no existe
{
  "statusCode": 404,
  "message": "Student not found",
  "error": "Not Found"
}
```

**Códigos de Estado**:
- `200` - Estudiante encontrado y activo
- `404` - Estudiante no encontrado
- `500` - Error interno del servidor

### 2. **GET /students** (Opcional - para administración)

**Descripción**: Listar todos los estudiantes

**Query Parameters**:
- `isActive` (boolean, opcional): Filtrar por estado activo
- `page` (number, opcional): Página para paginación
- `limit` (number, opcional): Límite de resultados

**Respuesta**:
```typescript
// 200 OK
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+1234567890",
      "date_of_birth": "1990-01-15",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. **POST /students** (Opcional - para administración)

**Descripción**: Crear nuevo estudiante

**Body**:
```typescript
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-15",
  "is_active": true
}
```

**Respuesta**:
```typescript
// 201 Created
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-15",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}

// 400 Bad Request - Email duplicado
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

### 4. **PATCH /students/:id** (Opcional - para administración)

**Descripción**: Actualizar estudiante

**Body** (todos los campos opcionales):
```typescript
{
  "name": "Juan Carlos Pérez",
  "phone": "+0987654321",
  "is_active": false
}
```

### 5. **DELETE /students/:id** (Opcional - para administración)

**Descripción**: Eliminar estudiante (soft delete recomendado)

**Respuesta**:
```typescript
// 200 OK
{
  "message": "Student deleted successfully"
}
```

### 6. **GET /health** (Recomendado)

**Descripción**: Health check del servicio

**Respuesta**:
```typescript
{
  "status": "ok",
  "db": "up",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔄 Flujo de Integración con courses-svc

### Escenario 1: Inscripción Exitosa

1. **Frontend** → `POST /enrollments` con `{ studentId, courseId }`
2. **courses-svc** → `GET /students/:studentId`
3. **students-svc** → `200 OK` con datos del estudiante
4. **courses-svc** → Crea inscripción en Supabase
5. **courses-svc** → `201 Created` al frontend

### Escenario 2: Estudiante No Encontrado

1. **Frontend** → `POST /enrollments` con `{ studentId, courseId }`
2. **courses-svc** → `GET /students/:studentId`
3. **students-svc** → `404 Not Found`
4. **courses-svc** → `422 Unprocessable Entity` al frontend

### Escenario 3: students-svc No Disponible

1. **Frontend** → `POST /enrollments` con `{ studentId, courseId }`
2. **courses-svc** → `GET /students/:studentId`
3. **students-svc** → Timeout/Error de conexión
4. **courses-svc** → `503 Service Unavailable` al frontend

## 🏗️ Estructura de Proyecto Recomendada

```
src/
├── students/
│   ├── students.controller.ts
│   ├── students.service.ts
│   └── students.module.ts
├── supabase/
│   ├── supabase.module.ts
│   └── supabase.constants.ts
├── common/
│   ├── dto/
│   │   ├── create-student.dto.ts
│   │   ├── update-student.dto.ts
│   │   └── student-query.dto.ts
│   └── entities/
│       └── student.entity.ts
├── app.module.ts
└── main.ts
```

## 📝 DTOs Requeridos

### CreateStudentDto
```typescript
import { IsString, IsEmail, IsOptional, IsBoolean, IsDateString, MaxLength } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
```

### UpdateStudentDto
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
```

### StudentQueryDto
```typescript
import { IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class StudentQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
```

## 🔒 Validaciones Críticas

### 1. **Validación de Email Único**
```typescript
// En el servicio, antes de crear/actualizar
const existingStudent = await this.supabase
  .from('students')
  .select('id')
  .eq('email', email)
  .neq('id', id || '')
  .single();

if (existingStudent.data) {
  throw new ConflictException('Email already exists');
}
```

### 2. **Validación de UUID**
```typescript
// En el controlador
@Get(':id')
@ApiParam({ name: 'id', description: 'Student UUID' })
findOne(@Param('id') id: string): Promise<Student> {
  // Validar formato UUID
  if (!this.isValidUUID(id)) {
    throw new BadRequestException('Invalid UUID format');
  }
  return this.studentsService.findOne(id);
}
```

### 3. **Manejo de Errores Específicos**
```typescript
// En el servicio
async findOne(id: string): Promise<Student> {
  const { data, error } = await this.supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new NotFoundException(`Student with ID ${id} not found`);
  }

  return data;
}
```

## 🚀 Configuración de Desarrollo

### 1. **Levantar el Servicio**
```bash
npm run start:dev
# Debe correr en puerto 3000 (o configurar diferente)
```

### 2. **Exponer con ngrok**
```bash
ngrok http 3000
# Copiar la URL generada (ej: https://students-abc123.ngrok.io)
```

### 3. **Configurar en courses-svc**
```bash
# En .env de courses-svc
STUDENTS_SVC_BASE_URL=https://students-abc123.ngrok.io
```

## 🧪 Testing con Postman

### 1. **Health Check**
```
GET https://students-abc123.ngrok.io/health
```

### 2. **Crear Estudiante**
```
POST https://students-abc123.ngrok.io/students
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-15",
  "is_active": true
}
```

### 3. **Obtener Estudiante (para courses-svc)**
```
GET https://students-abc123.ngrok.io/students/{STUDENT_ID}
```

### 4. **Probar Integración Completa**
```
# En courses-svc
POST http://localhost:4000/enrollments
Content-Type: application/json

{
  "studentId": "{STUDENT_ID_FROM_STEP_2}",
  "courseId": "{COURSE_ID_FROM_COURSES_SVC}"
}
```

## 📋 Checklist de Implementación

- [ ] **Base de datos**: Tabla `students` creada en Supabase
- [ ] **Endpoint crítico**: `GET /students/:id` implementado
- [ ] **Validaciones**: Email único, UUID válido
- [ ] **Manejo de errores**: 404, 400, 500 apropiados
- [ ] **Health check**: `GET /health` funcional
- [ ] **CORS**: Configurado para courses-svc
- [ ] **Swagger**: Documentación API disponible
- [ ] **ngrok**: Servicio expuesto públicamente
- [ ] **Testing**: Integración con courses-svc probada
- [ ] **Logs**: Logging apropiado para debugging

## 🔧 Consideraciones Técnicas

### **Performance**
- Implementar caché para consultas frecuentes
- Índices en campos de búsqueda (email, name)
- Paginación para listados grandes

### **Seguridad**
- Validación de entrada en todos los endpoints
- Rate limiting para prevenir abuso
- Logs de auditoría para cambios importantes

### **Monitoreo**
- Health checks regulares
- Métricas de respuesta y errores
- Alertas para fallos de servicio

### **Escalabilidad**
- Preparado para múltiples instancias
- Base de datos optimizada para consultas
- Timeout apropiados en llamadas HTTP

---

## 📞 Soporte

Para dudas sobre la integración con `courses-svc`, consultar:
- Logs de `courses-svc` para errores de comunicación
- Health check de `students-svc` para estado del servicio
- Swagger UI de ambos servicios para documentación completa
