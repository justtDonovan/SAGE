# 📚 Sistema de Gestión Escolar - Documentación Completa

## 📋 Índice

1. [Resumen General](#resumen-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Base de Datos](#base-de-datos)
5. [Funcionalidades](#funcionalidades)
6. [Código Detallado](#código-detallado)
7. [Guía de Uso](#guía-de-uso)

---

## 🎯 Resumen General

Este es un **Sistema de Gestión Escolar** completo desarrollado como una aplicación web de página única (SPA). El sistema permite la administración integral de una institución educativa, incluyendo:

- 👥 Gestión de alumnos y profesores
- 📖 Administración de clases y materias
- ✅ Control de asistencias
- 📊 Registro de calificaciones
- 📈 Generación de reportes
- 💰 Control de pagos
- 📝 Bitácora de actividades

### Características Técnicas

- **Frontend**: HTML5, CSS3, JavaScript Vanilla (sin frameworks)
- **Almacenamiento**: LocalStorage (datos en memoria del navegador)
- **Base de Datos**: MySQL (esquema incluido para implementación backend)
- **Interfaz**: Responsive, con modo oscuro/claro
- **Usuarios**: Dos roles (Administrador y Maestro)

---

## 🏗️ Arquitectura del Sistema

### Patrón de Diseño

El sistema sigue un patrón **MVC simplificado**:

- **Modelo**: Objeto `state` que contiene todos los datos
- **Vista**: HTML con secciones dinámicas
- **Controlador**: Funciones JavaScript que manejan eventos y actualizan vistas

### Flujo de Datos

```
Usuario → Evento → Controlador → Modelo (state) → Vista (render) → DOM
```

### Persistencia

- **LocalStorage**: Los datos se guardan automáticamente al cerrar el navegador
- **Estado en Memoria**: Durante la sesión, todo se mantiene en el objeto `state`

---

## 📁 Estructura de Archivos

```
proyecto pp/
├── index.html          # Estructura HTML y todas las vistas
├── script.js           # Lógica de la aplicación (892 líneas)
├── styles.css          # Estilos y temas (245 líneas)
├── mysql_schema.sql    # Esquema de base de datos MySQL (280 líneas)
└── coma                # Archivo auxiliar (56 bytes)
```

---

## 🗄️ Base de Datos

### Tablas Principales (MySQL Schema)

#### 1. **careers** - Carreras

```sql
- id (INT, PRIMARY KEY)
- name (VARCHAR 100, UNIQUE)
```

Almacena las carreras disponibles en la institución.

#### 2. **students** - Alumnos

```sql
- id (INT, PRIMARY KEY)
- full_name (VARCHAR 150)
- career_id (INT, FK → careers)
- semester (TINYINT)
- enrollment_date (DATE)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

Registra información de los estudiantes.

#### 3. **teachers** - Profesores

```sql
- id (INT, PRIMARY KEY)
- full_name (VARCHAR 150)
- age (TINYINT)
- career_studied (VARCHAR 120)
- specialty (VARCHAR 120)
- hired_date (DATE)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

Información de los profesores.

#### 4. **classes** - Clases/Asignaturas

```sql
- id (INT, PRIMARY KEY)
- name (VARCHAR 120)
- career_id (INT, FK → careers)
- teacher_id (INT, FK → teachers)
- period (VARCHAR 20)
- average_grade (DECIMAL 4,2)
- active (BOOLEAN)
- created_at (TIMESTAMP)
```

Materias impartidas por carrera.

#### 5. **class_students** - Inscripciones

```sql
- id (INT, PRIMARY KEY)
- class_id (INT, FK → classes)
- student_id (INT, FK → students)
- enrollment_date (DATE)
- status (ENUM: 'inscrito', 'baja')
- UNIQUE (class_id, student_id)
```

Relación muchos-a-muchos entre alumnos y clases.

#### 6. **attendance** - Asistencias

```sql
- id (INT, PRIMARY KEY)
- class_id (INT, FK → classes)
- student_id (INT, FK → students)
- attendance_date (DATE)
- status (ENUM: 'present', 'absent')
- recorded_by_teacher_id (INT, FK → teachers)
- created_at (TIMESTAMP)
- UNIQUE (class_id, student_id, attendance_date)
```

Registro diario de asistencias.

#### 7. **grades** - Calificaciones

```sql
- id (INT, PRIMARY KEY)
- class_id (INT, FK → classes)
- student_id (INT, FK → students)
- evaluation (VARCHAR 50)
- grade (DECIMAL 4,2)
- recorded_by_teacher_id (INT, FK → teachers)
- created_at (TIMESTAMP)
- UNIQUE (class_id, student_id, evaluation)
```

Calificaciones por evaluación.

#### 8. **reports** - Reportes Disciplinarios

```sql
- id (INT, PRIMARY KEY)
- student_id (INT, FK → students)
- teacher_id (INT, FK → teachers)
- class_id (INT, FK → classes)
- report_type (ENUM: 'disciplinary', 'missing_homework', 'payment', 'other')
- title (VARCHAR 150)
- description (TEXT)
- created_at (TIMESTAMP)
```

Reportes académicos y disciplinarios.

#### 9. **payments** - Pagos

```sql
- id (INT, PRIMARY KEY)
- student_id (INT, FK → students)
- payment_date (DATE)
- concept (VARCHAR 120)
- amount (DECIMAL 10,2)
- receipt_number (VARCHAR 50, UNIQUE)
- created_at (TIMESTAMP)
```

Control de pagos de colegiaturas.

#### 10. **activities** - Bitácora

```sql
- id (INT, PRIMARY KEY)
- activity_date (DATETIME)
- type (VARCHAR 50)
- description (VARCHAR 255)
- actor_role (ENUM: 'admin', 'maestro')
- actor_name (VARCHAR 100)
```

Registro de todas las acciones del sistema.

---

## ⚙️ Funcionalidades

### 🔐 Sistema de Login

**Credenciales:**

- **Administrador**:
  - Usuario: `ADMINISTRADOR`
  - Contraseña: `Admin1`
- **Maestros**:
  - Usuario y contraseña personalizados (por defecto: usuario/12345)

**Proceso:**

1. Usuario ingresa credenciales en `index.html` (líneas 15-27)
2. JavaScript valida en `script.js` (líneas 145-172)
3. Se establece sesión en `sessionStorage`
4. Redirecciona al dashboard correspondiente

### 👨‍💼 Panel Administrador

#### **Inicio (Home)**

- Muestra estadísticas en tiempo real:
  - Total de alumnos
  - Total de profesores
  - Total de clases
  - Asistencias del día
- Lista de actividades recientes
- **Código**: `renderAdminHome()` (líneas 231-246)

#### **Gestión de Alumnos**

**Funcionalidades:**

- ➕ Agregar nuevo alumno
- 📋 Listar todos los alumnos
- 📝 Inscribir alumno a clases
- ❌ Dar de baja / Reactivar alumno
- 🔍 Ver materias inscritas

**Código principal**: `renderAdminStudents()` (líneas 249-361)

**Proceso de inscripción:**

1. Click en "Inscribir a clase" de un alumno
2. Sistema muestra clases disponibles de la misma carrera
3. Selecciona clase y confirma
4. Valida que alumno esté activo
5. Previene inscripciones duplicadas
6. Actualiza tabla de materias inscritas

#### **Gestión de Profesores**

**Funcionalidades:**

- ➕ Agregar nuevo profesor
- ✏️ Editar datos del profesor
- 📋 Listar profesores
- ❌ Dar de baja / Reactivar
- 🎓 Asignar clases a profesor
- 📊 Ver clases del profesor con promedios

**Código principal**: `renderAdminTeachers()` (líneas 364-542)

**Formularios:**

- Modal de creación (líneas 139-150 HTML)
- Modal de edición (líneas 152-165 HTML)
- Asignación de clases (líneas 171-192 HTML)

#### **Gestión de Clases**

**Funcionalidades:**

- ➕ Agregar nueva clase
- 📊 Ver clases por carrera
- 📋 Listado completo de clases
- 👨‍🏫 Asignar profesor (opcional al crear)

**Código principal**: `renderAdminClasses()` (líneas 545-594)

**Datos mostrados:**

- Nombre de la clase
- Carrera a la que pertenece
- Profesor asignado
- Periodo (ej: 2024A)
- Promedio general

#### **Reportes y PDF**

**Funcionalidades:**

- 📈 Construir reporte de calificaciones
- 📊 Gráfico visual de barras
- 📄 Exportar a PDF para imprimir
- 📉 Estadísticas: promedio, mínimo, máximo, reprobados

**Código principal**:

- `renderAdminReports()` (líneas 597-615)
- `buildGradesReportPreview()` (líneas 617-648)
- `drawGradesChart()` (líneas 650-665) - Dibuja gráfico en Canvas
- `generateGradesReportPdf()` (líneas 667-694)

**Proceso:**

1. Seleccionar clase y evaluación
2. Click en "Construir reporte"
3. Sistema genera vista previa con tabla y gráfico
4. Click en "Descargar PDF"
5. Abre ventana de impresión con el reporte formateado

### 👨‍🏫 Panel Maestro

#### **Inicio (Home)**

- 📝 Lista de temas pendientes
- 📊 Actividades recientes del sistema
- **Código**: `renderTeacherHome()` (líneas 704-718)

#### **Lista de Alumnos (Asistencias)**

**Funcionalidades:**

- 📅 Seleccionar clase y fecha
- ✅ Marcar asistencias (Presente/Ausente)
- 💾 Guardar registro de asistencias
- 📊 Carga automática de asistencias previas

**Código principal**: `renderTeacherStudents()` (líneas 721-791)

**Proceso:**

1. Maestro selecciona su clase (solo ve sus clases)
2. Selecciona fecha (por defecto hoy)
3. Click en "Cargar"
4. Sistema muestra lista de alumnos inscritos
5. Dropdowns con estado (Presente/Ausente)
6. Los cambios se registran automáticamente
7. Click en "Guardar asistencias" confirma

#### **Registro de Calificaciones**

**Funcionalidades:**

- 📝 Seleccionar clase y evaluación
- 🔢 Ingresar calificaciones (0-100)
- ⚠️ Validación automática (menor a 70 = 0)
- 💾 Guardar y recalcular promedio de clase
- 📊 Actualización de promedio general

**Código principal**: `renderTeacherGrades()` (líneas 794-871)

**Validaciones:**

- Valores entre 0 y 100
- Si es menor a 70, se convierte en 0 (reprobado)
- Si es mayor a 100, se limita a 100
- Actualiza promedio de la clase automáticamente

---

## 💻 Código Detallado

### 🎨 Estilos (styles.css)

#### Variables CSS (Líneas 1-12)

```css
:root {
  --bg: #0f172a; /* Fondo oscuro */
  --panel: #111827; /* Paneles */
  --card: #1f2937; /* Tarjetas */
  --text: #e5e7eb; /* Texto */
  --muted: #9ca3af; /* Texto secundario */
  --primary: #2563eb; /* Color primario */
  --border: #374151; /* Bordes */
}
```

#### Componentes Principales

- **Login Card** (26-35): Tarjeta de inicio de sesión centrada
- **Topbar** (74-91): Barra superior con navegación
- **Stats Grid** (98-106): Cuadrícula de estadísticas
- **Tables** (117-120): Tablas responsivas
- **Modal** (131-156): Ventanas emergentes
- **Tema Claro** (158-245): Variables y estilos para modo normal

#### Temas (Modo Oscuro/Claro)

**Toggle Button** (186-235):

- Botón circular con animación
- Icono ☾ (luna) para modo oscuro
- Icono ☀ (sol) para modo claro
- Transición suave de 0.25s

### 🧠 Lógica JavaScript (script.js)

#### 1. Estado Global (Líneas 2-45)

```javascript
const state = {
  careers: [], // Carreras
  students: [], // Alumnos
  teachers: [], // Profesores
  classes: [], // Clases
  class_students: [], // Inscripciones
  attendance: [], // Asistencias
  grades: [], // Calificaciones
  reports: [], // Reportes
  payments: [], // Pagos
  activities: [], // Bitácora
};
```

**Datos de Ejemplo**: El sistema viene pre-cargado con 3 alumnos, 2 profesores, 2 clases, etc.

#### 2. Gestión de Sesión (Líneas 47-54)

```javascript
const session = {
  role: "", // 'admin' o 'maestro'
  teacherId: null, // ID del profesor logueado
};
```

Usa `sessionStorage` para mantener la sesión.

#### 3. Utilidades (Líneas 56-60)

```javascript
const byId = (id) => document.getElementById(id);
const show = (el) => el.removeAttribute('hidden');
const hide = (el) => el.setAttribute('hidden', '');
const fmtMoney = (n) => new Intl.NumberFormat('es-MX', {...}).format(n);
```

#### 4. Tema (Líneas 62-82)

- Gestiona modo oscuro/claro
- Persiste en `localStorage`
- Actualiza atributo `data-theme` en HTML

#### 5. Sistema Modal (Líneas 85-140)

**Función**: `openModalWithElement(el, title)`

- Crea ventana emergente dinámica
- Mueve elementos existentes dentro del modal
- Maneja cierre con botón, clic fuera, o tecla ESC
- Restaura elemento a su posición original al cerrar

#### 6. Login (Líneas 143-172)

**Validación:**

- Si usuario es "ADMINISTRADOR" → verifica contraseña "Admin1"
- Si no, busca en array de profesores
- Establece rol en sesión
- Renderiza vista correspondiente

#### 7. Renderización Principal (Líneas 205-228)

**Función**: `renderApp()`

- Muestra/oculta vistas según rol
- Default: vista de login si no hay sesión
- Admin → `adminDashboard`
- Maestro → `teacherDashboard`

#### 8. CRUD de Alumnos (Líneas 249-361)

**Agregar alumno:**

```javascript
state.students.push({
  id,
  full_name,
  career_id,
  semester,
  enrollment_date,
  active: true,
});
```

**Dar de baja:**

```javascript
st.active = false; // No se elimina, solo se desactiva
```

**Inscribir a clase:**

- Valida que alumno esté activo
- Filtra clases de la misma carrera
- Previene duplicados con `find()`

#### 9. CRUD de Profesores (Líneas 364-542)

**Editar profesor:**

- Abre modal con formulario pre-llenado
- Actualiza todos los campos
- Cierra modal automáticamente al guardar

**Asignar clases:**

- Filtra clases sin profesor asignado
- Actualiza `teacher_id` de la clase
- Recarga tabla de clases del profesor

#### 10. Gestión de Asistencias (Líneas 721-791)

**Carga:**

```javascript
const existing =
  state.attendance.find(
    (a) =>
      a.class_id === class_id &&
      a.student_id === sid &&
      a.attendance_date === date,
  )?.status || "absent";
```

**Guardado:**

- Itera sobre todos los selects
- Crea o actualiza registro
- Incrementa contador de asistencias del día

#### 11. Gestión de Calificaciones (Líneas 794-871)

**Validación en tiempo real:**

```javascript
if (grade > 100) {
  grade = 100;
}
if (grade < 70) {
  grade = 0;
} // Reprobado
```

**Recálculo de promedio:**

```javascript
const avg =
  gradesForClassEval.reduce((acc, g) => acc + Number(g.grade), 0) /
  gradesForClassEval.length;
cl.average_grade = avg.toFixed(2);
```

#### 12. Generación de Reportes (Líneas 617-701)

**Gráfico Canvas:**

- Dibuja ejes X e Y
- Barras de colores según calificación:
  - Verde (#2a9d8f) si ≥ 70
  - Rojo (#e76f51) si < 70
- Escala automática a 100 puntos

**Exportar PDF:**

- Crea ventana nueva
- Inyecta HTML con estilos inline
- Convierte Canvas a imagen base64
- Auto-invoca `window.print()`

#### 13. Persistencia (Líneas 874-891)

```javascript
function persist() {
  localStorage.setItem("app_state", JSON.stringify(state));
}

window.addEventListener("beforeunload", persist);
```

- Guarda automáticamente al cerrar pestaña
- Carga datos al iniciar: `loadPersisted()`

---

## 📖 Guía de Uso

### Para Administradores

#### 1️⃣ Inicio de Sesión

1. Abrir `index.html` en navegador
2. Ingresar `ADMINISTRADOR` como usuario
3. Contraseña: `Admin1`
4. Click en "Ingresar"

#### 2️⃣ Registrar Alumno

1. Click en "Alumnos" en el menú
2. Click en "Nuevo alumno"
3. Llenar formulario:
   - Nombre completo
   - Seleccionar carrera
   - Semestre (1-12)
   - Fecha de inscripción
4. Click en "Guardar"

#### 3️⃣ Inscribir Alumno a Clase

1. En lista de alumnos, click en "Inscribir a clase"
2. Seleccionar clase disponible
3. Click en "Inscribir"
4. Verificar en tabla de materias inscritas

#### 4️⃣ Agregar Profesor

1. Click en "Profesores"
2. Click en "Nuevo profesor"
3. Completar datos (usuario y contraseña son obligatorios)
4. Click en "Guardar"

#### 5️⃣ Asignar Clase a Profesor

1. En sección "Profesores"
2. Bajar a "Asignar clases a profesor"
3. Seleccionar profesor
4. Seleccionar clase sin profesor
5. Click en "Asignar"

#### 6️⃣ Crear Clase

1. Click en "Clases"
2. Formulario "Agregar clase"
3. Nombre de clase
4. Seleccionar carrera
5. Periodo (ej: 2024A)
6. Profesor (opcional)
7. Click en "Agregar"

#### 7️⃣ Generar Reporte de Calificaciones

1. Click en "Reportes"
2. Seleccionar clase
3. Ingresar evaluación (ej: "Final", "Parcial 1")
4. Click en "Construir reporte"
5. Ver vista previa con gráfico
6. Click en "Descargar PDF" para imprimir

### Para Maestros

#### 1️⃣ Inicio de Sesión

1. Ingresar nombre de usuario del profesor
2. Ingresar contraseña
3. Click en "Ingresar"

#### 2️⃣ Tomar Asistencia

1. Click en "Alumnos" (Lista de alumnos)
2. Seleccionar clase
3. Seleccionar fecha
4. Click en "Cargar"
5. Marcar cada alumno como Presente/Ausente
6. Click en "Guardar asistencias"

#### 3️⃣ Registrar Calificaciones

1. Click en "Calificaciones"
2. Seleccionar clase
3. Escribir nombre de evaluación
4. Click en "Cargar"
5. Ingresar calificación para cada alumno (0-100)
6. Click en "Guardar cambios"
7. Sistema recalcula promedio automáticamente

### Características Adicionales

#### Modo Oscuro/Claro

- Click en botón toggle en barra superior
- Cambia entre modo nocturno (oscuro) y normal (claro)
- Persiste la preferencia

#### Dar de Baja

- **Alumnos**: Click en "Dar de baja" → No puede inscribirse a más clases
- **Profesores**: Click en "Dar de baja" → No puede asignarse a nuevas clases
- **Reactivar**: Click en "Reactivar" para restaurar

#### Actividades Recientes

- Panel "Inicio" muestra últimas 8 actividades
- Registra: inscripciones, nuevos usuarios, asistencias, calificaciones

---

## 🔧 Consideraciones Técnicas

### Limitaciones Actuales

- ❌ No hay backend real (todo en frontend)
- ❌ Datos se pierden si se borra el cache del navegador
- ❌ No hay autenticación segura
- ❌ Un solo usuario a la vez

### Migración a Backend

Para implementar con backend:

1. Usar `mysql_schema.sql` para crear base de datos
2. Crear API REST con endpoints para cada entidad
3. Reemplazar funciones `state.*` con llamadas AJAX/fetch
4. Implementar JWT para autenticación
5. Mover validaciones al servidor

### Mejoras Sugeridas

- 🔐 Autenticación segura con bcrypt
- 📧 Notificaciones por email
- 🌐 Multiidioma
- 📊 Reportes más complejos (Excel, etc.)
- 🖼️ Fotos de perfil
- 📅 Calendario de eventos

---

## 📝 Resumen de Archivos

### index.html (337 líneas)

- Estructura completa de la aplicación
- 3 vistas principales: Login, Admin, Maestro
- Formularios inline con `<details>`
- Tablas dinámicas pobladas por JavaScript

### script.js (892 líneas)

- 10 tablas de datos en objeto `state`
- 15+ funciones render principales
- Sistema de sesiones
- Persistencia en LocalStorage
- Generación de PDF
- Canvas para gráficos

### styles.css (245 líneas)

- Variables CSS para temas
- Componentes reutilizables
- Responsive design
- Animaciones suaves
- Modo oscuro y claro completo

### mysql_schema.sql (280 líneas)

- 10 tablas relacionadas
- Índices y constraints
- 2 vistas útiles
- Datos de ejemplo
- Comentarios explicativos

---

## 🎓 Conclusión

Este sistema es una solución completa y funcional para la gestión básica de una institución educativa. Aunque opera completamente en el frontend, su arquitectura está diseñada para facilitar la migración a un sistema backend con MySQL.

**Puntos Fuertes:**

- ✅ Código limpio y bien estructurado
- ✅ Interfaz moderna y responsive
- ✅ Funcionalidades completas
- ✅ Esquema de BD listo para producción
- ✅ Sistema de roles funcional

**Ideal para:**

- 📚 Proyectos académicos
- 🧪 Prototipado rápido
- 🎯 Aprendizaje de desarrollo web
- 🔨 Base para sistema empresarial

---

**Creado con ❤️ para la gestión educativa**
