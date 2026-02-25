-- Tabla de Calificaciones
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    student_id INT,
    evaluation VARCHAR(50) DEFAULT 'Final',
    grade DECIMAL(5, 2),
    recorded_by_teacher_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by_teacher_id) REFERENCES users(id),
    UNIQUE KEY unique_grade (class_id, student_id, evaluation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
