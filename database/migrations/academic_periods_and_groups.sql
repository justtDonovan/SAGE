-- =============================================================
-- Migracion: periodos de evaluacion y grupos
-- Fecha: 2026-05-10
-- =============================================================

-- 1) Agregar grupo en clases
ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS group_name VARCHAR(20) NULL AFTER period;

UPDATE classes
SET group_name = CASE
  WHEN id % 2 = 1 THEN 'G-1'
  ELSE 'G-2'
END
WHERE group_name IS NULL OR TRIM(group_name) = '';

-- 2) Normalizar evaluaciones existentes hacia 3 periodos
UPDATE grades
SET evaluation = 'Periodo 3'
WHERE evaluation IS NULL
   OR TRIM(evaluation) = ''
   OR evaluation = 'Final';
