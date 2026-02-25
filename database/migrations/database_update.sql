-- Script de actualización para funcionalidad de inscripciones
-- Ejecuta este script en tu cliente MySQL (phpMyAdmin, Workbench, etc.) en la base de datos 'sage_db'

-- 1. Crear tabla de clases si no existe
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  career_id INT,
  teacher_id INT,
  period VARCHAR(50),
  average_grade DECIMAL(4, 2) DEFAULT NULL,
  FOREIGN KEY (career_id) REFERENCES careers(id),
  FOREIGN KEY (teacher_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Crear tabla de inscripciones (relación alumnos-clases)
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT,
  student_id INT,
  enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'inscrito',
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (class_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Insertar datos de ejemplo para clases (opcional)
-- Asegúrate de que existan carreras con IDs 1, 2, 3 y usuarios con rol 'teacher'
-- Estos inserts son de ejemplo, ajusta IDs si es necesario.
INSERT INTO classes (name, career_id, teacher_id, period) 
SELECT 'Programación Web I', 1, id, '2024A' FROM users WHERE role='teacher' LIMIT 1;

INSERT INTO classes (name, career_id, teacher_id, period) 
SELECT 'Administración de Empresas', 2, id, '2024A' FROM users WHERE role='teacher' LIMIT 1 OFFSET 1;
