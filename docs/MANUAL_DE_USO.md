# Manual de Usuario y Guía de Instalación - SAGE

Bienvenido al manual del Sistema de Gestión Escolar (SAGE). Este documento detalla cómo instalar, configurar y utilizar las nuevas funcionalidades del sistema.

## 1. Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** (v16 o superior).
- **MySQL** (XAMPP, MySQL Workbench o similar).
- **Git** (opcional).

## 2. Instalación

1.  **Clonar/Descargar el proyecto**: Ubícate en la carpeta raíz `SAGE`.
2.  **Instalar dependencias**: Ejecuta el siguiente comando para descargar las librerías del backend (Express, MySQL2, Bcrypt, etc.):
    ```bash
    npm install
    ```

## 3. Configuración de Base de Datos

El sistema requiere una base de datos MySQL llamada `sage_db` con el esquema actualizado (incluyendo la tabla `users` para el login).

1.  Inicia tu servidor MySQL.
2.  Crea la base de datos `sage_db` (si no existe).
3.  Importa el script `database/schema.sql`:
    - Puedes usar phpMyAdmin o la línea de comandos:
      ```bash
      mysql -u root -p sage_db < database/schema.sql
      ```
    - **Importante**: Este script crea las tablas y usuarios iniciales (Admin y Profesores) con contraseñas encriptadas.

## 4. Configuración del Entorno (.env)

Crea o verifica el archivo `.env` en la raíz del proyecto:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=      # Tu contraseña de MySQL (vacío en XAMPP por defecto)
DB_NAME=sage_db
DB_PORT=3306
PORT=3000
JWT_SECRET=supersecreto_cambiar_en_produccion
NODE_ENV=development
```

## 5. Ejecución

Para iniciar el servidor (Backend + Frontend):

```bash
npm run dev
```

- El servidor se iniciará en: `http://localhost:3000`
- La aplicación abrirá automáticamente la interfaz de Login.

---

## 6. Guía de Uso del Sistema

### A. Inicio de Sesión (Login)

El sistema cuenta con autenticación segura basada en Tokens (JWT).

- **Administrador**: Acceso total a la gestión.
  - Usuario: `admin`
  - Contraseña: `admin123`
- **Profesor**: Acceso a sus clases y alumnos.
  - Usuario: `roberto` (o `ana`)
  - Contraseña: `admin123`

### B. Módulo de Administrador

Una vez logueado como administrador, tendrás acceso a:

1.  **Dashboard General**: Vista resumen con contadores de alumnos, profesores y clases activas.
2.  **Gestión de Alumnos**:
    - **Listar**: Ve todos los alumnos registrados, su carrera y semestre.
    - **Registrar**: Botón "Nuevo Alumno" para ingresar datos (Nombre, Carrera, Semestre, Fecha Ingreso).
    - **Inscripción**: Asigna alumnos a clases específicas (validando que no estén dados de baja).
    - **Baja Lógica**: Puedes desactivar ("Dar de baja") a un alumno sin borrarlo de la base de datos (se muestra en rojo). También puedes Reactivarlo.
3.  **Gestión de Profesores**:
    - **Listar**: Ver profesores, incluyendo su especialidad y datos de acceso.
    - **Registrar**: Agregar nuevos profesores con usuario y contraseña para que puedan loguearse.
    - **Editar**: Modificar datos del profesor (Nombre, Usuario, Contraseña, etc.).
    - **Baja/Reactivar**: Controla el acceso de los profesores al sistema.
4.  **Gestión de Clases**:
    - Crea nuevas materias y asígnalas a una carrera y periodo.
    - Asigna un **Profesor** titular a cada clase.
5.  **Reportes**:
    - Genera reportes de calificaciones por clase.
    - Visualiza gráficas de rendimiento y promedios.
    - Opción de **Imprimir/PDF** el reporte generado.

### C. Módulo de Profesor

1.  **Mis Clases**: El profesor solo ve las materias que tiene asignadas.
2.  **Control de Asistencia**:
    - Selecciona una clase y fecha.
    - Registra asistencia (Presente/Ausente) para sus alumnos.
3.  **Calificaciones** (Próximamente): Podrá capturar evaluaciones parciales y finales.

---

## 7. Solución de Problemas

- **Error "Conexión rechazada"**: Verifica que MySQL esté corriendo en el puerto 3306.
- **Login Incorrecto**: Asegúrate de haber corrido el script `schema.sql` más reciente, ya que las contraseñas antiguas (texto plano) ya no funcionan; ahora deben estar hasheadas (bcrypt).
- **No cargan los datos**: Revisa la consola del navegador (F12) y la terminal del servidor para ver posibles errores de API.

---

## 8. Notas Técnicas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla). SPA (Single Page Application) simulada.
- **Backend**: Node.js, Express.
- **Base de Datos**: MySQL.
- **Seguridad**: Contraseñas hasheadas con `bcrypt` y sesiones manejadas via `JWT` en `sessionStorage`.
