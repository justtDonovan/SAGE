-- =============================================================
-- Migración: Normalizar nombres en first_name y last_name
-- Propósito: Separar full_name en first_name y last_name
-- Creada: 2026-05-07
-- =============================================================

-- Verificar si las columnas ya existen antes de agregarlas
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(75) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(75) NOT NULL DEFAULT '';

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(75) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(75) NOT NULL DEFAULT '';

-- Llenar las nuevas columnas con los datos del full_name
-- Dividir en: primer nombre y resto como apellidos
UPDATE users 
SET 
  first_name = TRIM(SUBSTRING_INDEX(full_name, ' ', 1)),
  last_name = TRIM(SUBSTRING(full_name, LENGTH(SUBSTRING_INDEX(full_name, ' ', 1)) + 2))
WHERE first_name = '' OR first_name IS NULL;

UPDATE students
SET
  first_name = TRIM(SUBSTRING_INDEX(full_name, ' ', 1)),
  last_name = TRIM(SUBSTRING(full_name, LENGTH(SUBSTRING_INDEX(full_name, ' ', 1)) + 2))
WHERE first_name = '' OR first_name IS NULL;

-- Eliminar la columna full_name original (solo si queremos realmente)
-- ALTER TABLE users DROP COLUMN IF EXISTS full_name;
-- ALTER TABLE students DROP COLUMN IF EXISTS full_name;

-- Crear índices para optimizar búsquedas por nombre
ALTER TABLE users ADD KEY IF NOT EXISTS idx_full_name (first_name, last_name);
ALTER TABLE students ADD KEY IF NOT EXISTS idx_full_name (first_name, last_name);

-- Confirmación
SELECT 'Migración de normalización de nombres completada' AS status;
