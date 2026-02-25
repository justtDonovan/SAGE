const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Calificaciones de un alumno
router.get('/student/:studentId', gradeController.getStudentGrades);

// Calificaciones de una clase y evaluación
router.get('/:classId/:evaluation', gradeController.listByClass);

// Guardar calificaciones
router.post('/', gradeController.upsertGrades);

module.exports = router;
