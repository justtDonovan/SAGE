-- Script de actualización para funcionalidad de asistencia
-- Ejecuta este script para crear la tabla de asistencia

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT,
  student_id INT,
  attendance_date DATE,
  status ENUM('present', 'absent') DEFAULT 'absent',
  recorded_by_teacher_id INT,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by_teacher_id) REFERENCES users(id),
  UNIQUE KEY unique_attendance (class_id, student_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
