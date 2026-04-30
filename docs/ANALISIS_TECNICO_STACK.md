# Analisis tecnico del stack del proyecto SAGE

Fecha: 2026-04-23

## 1) Lenguajes y tecnologias usadas

- Lenguaje principal: JavaScript.
- Backend: Node.js con Express.
- Frontend: HTML, CSS y JavaScript vanilla (sin framework).
- Base de datos: MySQL.
- Scripts auxiliares: SQL y Python.

El proyecto es full-stack JavaScript para la aplicacion principal, con apoyo de SQL para esquema/migraciones y Python para generacion de reporte documental.

## 2) Backend (Node.js + Express)

### Arquitectura

El backend sigue una estructura por capas:

- routes: define endpoints REST.
- controllers: contiene logica de negocio y orquestacion.
- models: encapsula consultas a base de datos.
- config: centraliza conexion y configuracion.

Esto facilita mantenimiento, escalabilidad modular y pruebas por componente.

### Librerias principales

- express: servidor HTTP y enrutamiento.
- mysql2: conexion y consultas a MySQL.
- dotenv: carga de variables de entorno.
- cors: habilita consumo desde frontend.
- bcrypt: hash de contrasenas.
- jsonwebtoken: autenticacion basada en tokens JWT.
- nodemon (dev): recarga automatica en desarrollo.

### Acceso a datos

Se usa SQL directo con mysql2 (sin ORM). Ventajas:

- mayor control de consultas,
- mejor visibilidad del rendimiento SQL,
- menor sobrecarga de abstraccion.

Riesgos tecnicos:

- mayor esfuerzo para mantener consistencia de consultas,
- posibilidad de duplicacion de logica SQL,
- menor estandarizacion comparado con ORM.

## 3) Frontend (HTML + CSS + JS vanilla)

### Caracteristicas

- Interfaz renderizada en navegador desde archivos estaticos.
- Uso de fetch para consumir endpoints /api.
- Manejo de sesion en cliente con sessionStorage.
- Estilos centralizados y tema visual configurable.

### Implicaciones tecnicas

Fortalezas:

- simplicidad de despliegue,
- curva de aprendizaje baja,
- menor dependencia de toolchains.

Limites al crecer:

- manejo de estado mas complejo,
- acoplamiento de logica de UI,
- menor modularidad que con frameworks de componentes.

## 4) Base de datos (MySQL)

### Motor y configuracion

- Motor: MySQL con tablas InnoDB.
- Juego de caracteres: utf8mb4.
- Colacion: utf8mb4_unicode_ci.

Esto es correcto para integridad referencial, transacciones y soporte de caracteres internacionales.

### Modelo relacional

Entidades principales:

- users, students, careers, classes,
- enrollments, attendance, grades,
- reports, payments, activities, schedules.

Practicas buenas detectadas:

- PK y FK definidas de forma explicita,
- restricciones UNIQUE para evitar duplicados logicos,
- indices para consultas frecuentes,
- vistas para metricas de dashboard.

### Integridad y reglas

Se observan reglas de negocio en constraints:

- ON DELETE CASCADE para relaciones dependientes (ej. enrollments, attendance, grades),
- ON DELETE SET NULL donde aplica conservar historico sin referencia obligatoria,
- ON UPDATE CASCADE en varias FK.

Esto reduce inconsistencia de datos y mejora robustez transaccional.

## 5) Seguridad tecnica

### Implementado

- Hash de contrasenas con bcrypt.
- JWT con expiracion (8h) para autenticacion.
- Validaciones basicas en login/registro.

### Riesgos observados

- Existe fallback de JWT_SECRET en codigo (valor por defecto). En produccion debe ser obligatorio por variable de entorno.
- No se aprecia, en esta revision, middleware global de autorizacion por rol aplicado en todas las rutas.
- No se identifican controles explicitos de rate limiting o hardening HTTP.

## 6) Migraciones y ciclo de datos

- Hay scripts SQL de migracion para evolucionar el esquema.
- Hay script de inicializacion que ejecuta schema.sql completo.

Punto a mejorar:

- formalizar versionado migracional (por ejemplo, con convencion estricta o herramienta dedicada) para trazabilidad entre ambientes.

## 7) Scripts auxiliares

- JavaScript: inicializacion/verificacion de DB y utilidades.
- Python: generacion de documento Word tecnico.

Observacion:

- Se usan rutas absolutas en el script Python de reporte, lo que reduce portabilidad entre equipos y entornos.

## 8) Evaluacion tecnica resumida

- Adecuacion del stack al dominio escolar: Alta.
- Madurez de arquitectura backend: Media-Alta.
- Madurez de frontend para crecimiento: Media.
- Solidez del modelo relacional: Alta.
- Endurecimiento de seguridad operativa: Media.
- Trazabilidad de migraciones: Media.

## 9) Recomendaciones priorizadas

1. Seguridad de configuracion
- Eliminar secretos por defecto y exigir JWT_SECRET fuerte en entorno.
- Agregar rate limiting y cabeceras de seguridad.

2. Control de acceso
- Centralizar middleware de autorizacion por rol para rutas sensibles.

3. Gobernanza de esquema
- Estandarizar migraciones versionadas y pipeline de actualizacion por ambiente.

4. Evolucion frontend
- Modularizar app.js por dominios funcionales o migrar gradualmente a arquitectura por componentes.

5. Portabilidad de scripts
- Reemplazar rutas absolutas por rutas relativas y configurables.

## 10) Conclusiones

El proyecto usa un stack correcto y pragmatico para un sistema de gestion escolar: Node.js + Express + MySQL, con frontend ligero en JavaScript vanilla. La base relacional esta bien planteada y cubre el dominio academico con buena integridad. Las mejoras de mayor impacto estan en seguridad operacional, estandarizacion de migraciones y escalabilidad de la capa frontend.