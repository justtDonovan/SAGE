-- =============================================================
-- Sistema de Gestión Escolar - Esquema MySQL
-- Autor: Generado automáticamente
-- Descripción: Tablas, relaciones, índices y datos de ejemplo
-- =============================================================

-- Opcional: recrear base de datos
DROP DATABASE IF EXISTS sage_db;
CREATE DATABASE sage_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE sage_db;

-- =====================
-- Catálogos / Carreras
-- =====================
CREATE TABLE careers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- =====================
-- Usuarios (Administradores y Profesores)
-- =====================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- Hash bcrypt
  role ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'teacher',
  first_name VARCHAR(75) NOT NULL,
  last_name VARCHAR(75) NOT NULL,
  
  -- Campos específicos de perfil (opcionales para admin, usados para teacher)
  age TINYINT UNSIGNED,
  career_studied VARCHAR(120),
  specialty VARCHAR(120),
  hired_date DATE DEFAULT (CURRENT_DATE),
  
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_full_name (first_name, last_name)
) ENGINE=InnoDB;

-- =====================
-- Alumnos
-- =====================
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(75) NOT NULL,
  last_name VARCHAR(75) NOT NULL,
  user_id INT DEFAULT NULL, -- Vinculación con login
  career_id INT NOT NULL,
  semester TINYINT UNSIGNED NOT NULL,
  enrollment_date DATE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_full_name (first_name, last_name),
  CONSTRAINT fk_students_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_students_career FOREIGN KEY (career_id)
    REFERENCES careers(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================
-- Clases / Asignaturas
-- =====================
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  career_id INT NOT NULL,
  teacher_id INT,
  period VARCHAR(20), -- ej. 2024A
  average_grade DECIMAL(4,2),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_classes_career FOREIGN KEY (career_id)
    REFERENCES careers(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id)
    REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================
-- Horarios
-- =====================
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    day_of_week ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'),
    start_time TIME,
    end_time TIME,
    classroom VARCHAR(50),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================
-- Inscripciones alumno-clase (Relación Enrollments)
-- =====================
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  enrollment_date DATE NOT NULL,
  status ENUM('inscrito','baja') NOT NULL DEFAULT 'inscrito',
  UNIQUE KEY uq_class_student (class_id, student_id),
  CONSTRAINT fk_enrollments_class FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================
-- Asistencias
-- =====================
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('present','absent') NOT NULL,
  recorded_by_teacher_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_attendance_day (class_id, student_id, attendance_date),
  KEY idx_attendance_class_student (class_id, student_id),
  CONSTRAINT fk_attendance_class FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_attendance_teacher FOREIGN KEY (recorded_by_teacher_id)
    REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================
-- Calificaciones
-- =====================
CREATE TABLE grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  student_id INT NOT NULL,
  evaluation VARCHAR(50) NOT NULL DEFAULT 'Final',
  grade DECIMAL(4,2) NOT NULL,
  recorded_by_teacher_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_grade_eval (class_id, student_id, evaluation),
  KEY idx_grades_class_student (class_id, student_id),
  CONSTRAINT fk_grades_class FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_grades_student FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_grades_teacher FOREIGN KEY (recorded_by_teacher_id)
    REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================
-- Reportes (disciplinarios / académicos)
-- =====================
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  teacher_id INT NOT NULL,
  class_id INT,
  report_type ENUM('disciplinary','missing_homework','payment','other') NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_reports_student (student_id),
  KEY idx_reports_teacher (teacher_id),
  CONSTRAINT fk_reports_student FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_reports_teacher FOREIGN KEY (teacher_id)
    REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_reports_class FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================
-- Pagos / comprobantes
-- =====================
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  payment_date DATE NOT NULL,
  concept VARCHAR(120) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  receipt_number VARCHAR(50) UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_payments_student (student_id),
  CONSTRAINT fk_payments_student FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================
-- Actividades del sistema (bitácora)
-- =====================
CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  actor_role ENUM('admin','maestro') NOT NULL,
  actor_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- =====================
-- Vistas útiles
-- =====================
CREATE OR REPLACE VIEW v_dashboard_counts AS
SELECT
  (SELECT COUNT(*) FROM students WHERE active = TRUE) AS total_students,
  (SELECT COUNT(*) FROM users WHERE role='teacher' AND active = TRUE) AS total_teachers,
  (SELECT COUNT(*) FROM classes WHERE active = TRUE)   AS total_classes,
  (SELECT COUNT(*) FROM attendance WHERE attendance_date = CURDATE() AND status = 'present') AS today_attendance_present;

CREATE OR REPLACE VIEW v_classes_by_career AS
SELECT c.id AS career_id, c.name AS career_name, COUNT(cl.id) AS classes_count
FROM careers c
LEFT JOIN classes cl ON cl.career_id = c.id AND cl.active = TRUE
GROUP BY c.id, c.name
ORDER BY c.name;

-- =====================
-- Datos de ejemplo
-- =====================
INSERT INTO careers (name) VALUES
('Ingeniería en Sistemas'),
('Administración'),
('Contaduría');

-- Usuarios (Admin y Profesores)
-- Password para todos es: admin123  (hash generado con bcrypt)
INSERT INTO users (username, password, role, first_name, last_name, age, career_studied, specialty, hired_date) VALUES
('admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', 'Administrador', 'Principal', NULL, NULL, NULL, NULL),
('roberto', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'teacher', 'Roberto', 'Martínez', 45, 'Ingeniería en Sistemas', 'Programación Web', '2024-01-05'),
('ana', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'teacher', 'Ana', 'Fernández', 38, 'Administración', 'Recursos Humanos', '2024-01-08');

-- Alumnos
INSERT INTO students (first_name, last_name, career_id, semester, enrollment_date) VALUES
('Juan', 'Pérez García', 1, 3, '2024-01-10'),
('María', 'González López', 2, 5, '2024-01-12'),
('Carlos', 'Rodríguez Martín', 3, 2, '2024-01-15');

-- Clases (teacher_id ahora es user_id: 2 y 3)
INSERT INTO classes (name, career_id, teacher_id, period, average_grade) VALUES
('Programación Web I', 1, 2, '2024A', 8.50),
('Administración de Empresas', 2, 3, '2024A', 8.20);

-- Inscripciones
INSERT INTO enrollments (class_id, student_id, enrollment_date) VALUES
(1, 1, '2024-01-10'),
(1, 3, '2024-01-15'),
(2, 2, '2024-01-12');

-- Asistencias
INSERT INTO attendance (class_id, student_id, attendance_date, status, recorded_by_teacher_id) VALUES
(1, 1, CURDATE(), 'present', 2),
(1, 3, CURDATE(), 'absent', 2),
(2, 2, CURDATE(), 'present', 3);

-- Calificaciones
INSERT INTO grades (class_id, student_id, evaluation, grade, recorded_by_teacher_id) VALUES
(1, 1, 'Final', 9.0, 2),
(1, 3, 'Final', 7.5, 2),
(2, 2, 'Final', 8.0, 3);

-- Reportes
INSERT INTO reports (student_id, teacher_id, class_id, report_type, title, description) VALUES
(3, 2, 1, 'disciplinary', 'Mal comportamiento', 'Interrumpió la clase repetidamente'),
(2, 3, 2, 'missing_homework', 'Tarea no entregada', 'No entregó la práctica 2');

-- Pagos
INSERT INTO payments (student_id, payment_date, concept, amount, receipt_number) VALUES
(1, '2024-01-11', 'Colegiatura Enero', 1200.00, 'REC-2024-0001'),
(2, '2024-01-13', 'Colegiatura Enero', 1200.00, 'REC-2024-0002');

-- Actividades
INSERT INTO activities (type, description, actor_role, actor_name) VALUES
('Inscripción', 'Nuevo alumno inscrito: Juan Pérez García', 'admin', 'Administrador'),
('Profesor', 'Nuevo profesor agregado: Dr. Roberto Martínez', 'admin', 'Administrador'),
('Asistencia', 'Registro de asistencias del día', 'maestro', 'Maestro');

-- =====================
-- Consultas útiles de ejemplo
-- =====================
-- Clases por carrera
-- SELECT * FROM v_classes_by_career;

-- Resumen del dashboard
-- SELECT * FROM v_dashboard_counts;

-- Promedio por clase
-- SELECT cl.id, cl.name, AVG(g.grade) AS promedio
-- FROM classes cl
-- JOIN grades g ON g.class_id = cl.id
-- GROUP BY cl.id, cl.name;