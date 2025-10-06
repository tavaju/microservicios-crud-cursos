# Frontend API Documentation - Cursos Microservice

Este documento describe todos los endpoints disponibles en el microservicio de Cursos para que el frontend engineer pueda desarrollar la interfaz visual correspondiente.

## Base URL

**⚠️ IMPORTANTE: URL Dinámica**

La URL base del servicio es dinámica y puede cambiar según el entorno:

- **Desarrollo Local:** `http://localhost:3000`
- **Despliegue con ngrok:** `https://true-urgently-horse.ngrok-free.app`

### Configuración de ngrok
```bash
ngrok http --url=true-urgently-horse.ngrok-free.app 4000
```

**Nota:** El frontend debe estar configurado para manejar ambas URLs o tener un sistema de configuración de entorno que permita cambiar la URL base dinámicamente.

## Endpoints Disponibles

### 1. Health Check

#### GET `/`
**Descripción:** Información básica de la aplicación
**Respuesta:**
```typescript
string // "Hello World!" o mensaje básico
```

#### GET `/health`
**Descripción:** Verificación del estado del servicio y base de datos
**Respuesta:**
```typescript
{
  status: string;     // "ok" | "error"
  db: string;         // "up" | "down"
  timestamp: string;  // ISO timestamp
}
```

---

## 2. Cursos (Courses)

### GET `/courses`
**Descripción:** Obtener todos los cursos
**Query Parameters:**
- `isActive` (opcional): `"true"` | `"false"` - Filtrar por estado activo

**Respuesta:**
```typescript
Course[]
```

### GET `/courses/active`
**Descripción:** Obtener solo cursos activos
**Respuesta:**
```typescript
Course[]
```

### GET `/courses/:id`
**Descripción:** Obtener un curso por ID
**Parámetros:**
- `id` (string): ID del curso (UUID)

**Respuesta:**
```typescript
Course
```

**Errores:**
- `404`: Curso no encontrado

### POST `/courses`
**Descripción:** Crear un nuevo curso
**Body:**
```typescript
{
  title: string;           // Requerido, máximo 255 caracteres
  description?: string;    // Opcional
  price?: number;          // Opcional, mínimo 0
  is_active?: boolean;     // Opcional, por defecto true
}
```

**Respuesta:**
```typescript
Course // 201 Created
```

**Errores:**
- `400`: Datos de entrada inválidos

### PATCH `/courses/:id`
**Descripción:** Actualizar un curso existente
**Parámetros:**
- `id` (string): ID del curso (UUID)

**Body:**
```typescript
{
  title?: string;          // Opcional, máximo 255 caracteres
  description?: string;    // Opcional
  price?: number;          // Opcional, mínimo 0
  is_active?: boolean;     // Opcional
}
```

**Respuesta:**
```typescript
Course // 200 OK
```

**Errores:**
- `404`: Curso no encontrado

### DELETE `/courses/:id`
**Descripción:** Eliminar un curso
**Parámetros:**
- `id` (string): ID del curso (UUID)

**Respuesta:**
```typescript
void // 200 OK
```

**Errores:**
- `404`: Curso no encontrado

---

## 3. Inscripciones (Enrollments)

### GET `/enrollments`
**Descripción:** Obtener todas las inscripciones
**Query Parameters:**
- `studentId` (opcional): ID del estudiante para filtrar
- `courseId` (opcional): ID del curso para filtrar

**Respuesta:**
```typescript
Enrollment[]
```

### GET `/enrollments/student/:studentId`
**Descripción:** Obtener inscripciones de un estudiante específico
**Parámetros:**
- `studentId` (string): ID del estudiante (UUID)

**Respuesta:**
```typescript
Enrollment[]
```

### GET `/enrollments/course/:courseId`
**Descripción:** Obtener inscripciones de un curso específico
**Parámetros:**
- `courseId` (string): ID del curso (UUID)

**Respuesta:**
```typescript
Enrollment[]
```

### GET `/enrollments/:id`
**Descripción:** Obtener una inscripción por ID
**Parámetros:**
- `id` (string): ID de la inscripción (UUID)

**Respuesta:**
```typescript
Enrollment
```

**Errores:**
- `404`: Inscripción no encontrada

### POST `/enrollments`
**Descripción:** Crear una nueva inscripción
**Body:**
```typescript
{
  studentId: string;  // Requerido, UUID válido
  courseId: string;   // Requerido, UUID válido
}
```

**Respuesta:**
```typescript
Enrollment // 201 Created
```

**Errores:**
- `404`: Curso no encontrado
- `422`: Estudiante no encontrado
- `503`: Servicio de estudiantes no disponible

### PATCH `/enrollments/:id`
**Descripción:** Actualizar una inscripción existente
**Parámetros:**
- `id` (string): ID de la inscripción (UUID)

**Body:**
```typescript
{
  status?: 'active' | 'cancelled';  // Opcional
}
```

**Respuesta:**
```typescript
Enrollment // 200 OK
```

**Errores:**
- `404`: Inscripción no encontrada

### DELETE `/enrollments/:id`
**Descripción:** Eliminar una inscripción
**Parámetros:**
- `id` (string): ID de la inscripción (UUID)

**Respuesta:**
```typescript
void // 200 OK
```

**Errores:**
- `404`: Inscripción no encontrada

---

## Modelos de Datos

### Course
```typescript
{
  id: string;           // UUID
  title: string;        // Título del curso
  description?: string; // Descripción opcional
  price: number;        // Precio del curso
  is_active: boolean;   // Estado activo/inactivo
  created_at: string;   // Timestamp de creación (ISO)
  updated_at: string;   // Timestamp de última actualización (ISO)
}
```

### Enrollment
```typescript
{
  id: string;                    // UUID
  student_id: string;            // ID del estudiante (UUID)
  course_id: string;             // ID del curso (UUID)
  status: 'active' | 'cancelled'; // Estado de la inscripción
  created_at: string;            // Timestamp de creación (ISO)
}
```

---

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Estudiante no encontrado (solo en enrollments)
- `503 Service Unavailable`: Servicio de estudiantes no disponible (solo en enrollments)

---

## Notas Importantes para el Frontend

1. **Validación de UUIDs**: Todos los IDs son UUIDs válidos
2. **Timestamps**: Todos los timestamps están en formato ISO 8601
3. **Filtros**: Los endpoints de cursos e inscripciones soportan filtros opcionales
4. **Integración con Estudiantes**: El servicio de inscripciones se comunica con un microservicio externo de estudiantes
5. **Manejo de Errores**: Implementar manejo adecuado para todos los códigos de estado posibles
6. **Swagger**: La API incluye documentación Swagger disponible en `/api` (si está configurado)

---

## Ejemplos de Uso

### Crear un curso
```javascript
const newCourse = await fetch('/courses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'JavaScript Avanzado',
    description: 'Curso completo de JavaScript moderno',
    price: 149.99,
    is_active: true
  })
});
```

### Obtener cursos activos
```javascript
const activeCourses = await fetch('/courses/active');
```

### Inscribir un estudiante
```javascript
const enrollment = await fetch('/enrollments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentId: '123e4567-e89b-12d3-a456-426614174000',
    courseId: '987fcdeb-51a2-43d1-b789-123456789abc'
  })
});
```

### Filtrar inscripciones por estudiante
```javascript
const studentEnrollments = await fetch('/enrollments/student/123e4567-e89b-12d3-a456-426614174000');
```
