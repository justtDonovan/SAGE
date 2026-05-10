-- Seed: admin user Ovi (password: 123)
INSERT INTO users (username, password, role, first_name, last_name, active)
VALUES ('Ovi', '$2b$10$ntk9CEqLYZ13oBUjLqBfHOR75wS1kFy5i/IeI8/9fHeadvW6ZiOma', 'admin', 'Ovi', 'Administrador', 1)
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  role = 'admin',
  first_name = 'Ovi',
  last_name = 'Administrador',
  active = 1;
