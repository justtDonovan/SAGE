-- Seed accounts: create a student user and link to existing student record
START TRANSACTION;

-- Password hash matches existing hashed password in schema (password: admin123)
INSERT INTO users (username, password, role, first_name, last_name, active)
VALUES ('juan', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', 'Juan', 'Pérez García', 1);

SET @uid = LAST_INSERT_ID();

-- Link the newly created user to the existing students row for Juan Pérez García
UPDATE students
SET user_id = @uid
WHERE first_name = 'Juan' AND last_name = 'Pérez García'
LIMIT 1;

COMMIT;
