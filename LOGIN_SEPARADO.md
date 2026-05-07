# Estructura de Login Separado por Rol

## Cambios Realizados

Se ha implementado un sistema de login separado para cada tipo de usuario (Administrador, Profesor y Alumno).

### Archivos Nuevos Creados

1. **index.html** - Página inicial de selección de rol
   - Permite elegir entre Administrador, Profesor o Alumno
   - Cada opción redirige a su propia página de login

2. **login-admin.html** - Login exclusivo para Administrador
   - Solo acepta usuario "ADMINISTRADOR"
   - Solo acceso para rol admin

3. **login-profesor.html** - Login para Profesores
   - Acceso para profesores registrados
   - Incluye opción de auto-registro para nuevos profesores

4. **login-alumno.html** - Login para Alumnos
   - Acceso para alumnos registrados
   - Incluye opción de auto-registro con selección de carrera y semestre

5. **dashboard.html** - Panel principal después del login
   - Contiene todos los dashboards (admin, profesor, alumno)
   - Se muestra según el rol del usuario

### Archivos JavaScript Nuevos

1. **js/app-common.js** - Funciones comunes compartidas
   - Definiciones de estado global
   - Funciones de utilidad
   - Gestión de tema (dark/light)
   - Verificación de sesión y redirecciones

2. **js/login-admin.js** - Lógica de login de Administrador
   - Validación de credenciales para admin
   - Redireccionamiento al dashboard

3. **js/login-profesor.js** - Lógica de login de Profesor
   - Validación de credenciales
   - Registro de nuevos profesores
   - Redireccionamiento al dashboard

4. **js/login-alumno.js** - Lógica de login de Alumno
   - Validación de credenciales
   - Registro de nuevos alumnos con carrera y semestre
   - Redireccionamiento al dashboard

### Cambios de CSS

Se agregaron nuevos estilos en **css/styles.css**:
- `.role-selection` - Estilos para la página de selección de roles
- `.role-buttons` - Botones interactivos para cada rol
- `.admin-login`, `.teacher-login`, `.student-login` - Estilos específicos por rol
- `.login-footer` - Footer con opción de volver a seleccionar rol

## Flujo de Navegación

```
index.html (Selección de Rol)
    ↓
    ├─→ login-admin.html → dashboard.html (Admin Panel)
    ├─→ login-profesor.html → dashboard.html (Teacher Panel)
    └─→ login-alumno.html → dashboard.html (Student Panel)
```

## Características

✅ Tres páginas de login separadas
✅ Selección visual de rol en la página inicial
✅ Validación de credenciales por rol
✅ Auto-registro para Profesor y Alumno
✅ Redireccionamiento automático al dashboard
✅ Botón para volver a seleccionar rol en cada login
✅ Estilos personalizados por tipo de usuario
✅ Gestión de sesión mejorada

## Cómo Usar

### Para Administrador
1. Ir a `http://localhost:3000`
2. Seleccionar "Administrador"
3. Ingresar usuario: `ADMINISTRADOR` y contraseña: `12345`

### Para Profesor
1. Ir a `http://localhost:3000`
2. Seleccionar "Profesor"
3. Ingresar credenciales o registrarse como nuevo profesor

### Para Alumno
1. Ir a `http://localhost:3000`
2. Seleccionar "Alumno"
3. Ingresar credenciales o registrarse con carrera y semestre

## Cierre de Sesión

El botón "Cerrar sesión" en cada dashboard:
- Limpia la sesión
- Redirige a la página de selección de roles (index.html)
