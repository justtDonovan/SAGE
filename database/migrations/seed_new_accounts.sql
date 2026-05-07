-- Seed: admin2, teacher2, student2 (password: admin123)
START TRANSACTION;

-- Admin and Teacher
INSERT INTO users (username, password, role, first_name, last_name, active)
VALUES
('admin2', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', 'Admin', 'Uno', 1),
('teacher2', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'teacher', 'Laura', 'Santos', 1);

-- Student: create user then student record linked to user
INSERT INTO users (username, password, role, first_name, last_name, active)
VALUES ('student2', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', 'Miguel', 'Díaz', 1);
SET @stu_uid = LAST_INSERT_ID();

INSERT INTO students (first_name, last_name, career_id, semester, enrollment_date, user_id)
VALUES ('Miguel', 'Díaz', 1, 1, CURDATE(), @stu_uid);

COMMIT;
