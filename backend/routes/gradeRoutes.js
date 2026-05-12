const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Filtros para módulo de calificaciones
router.get('/filters', gradeController.getFilters);

// Calificaciones de un alumno
router.get('/student/:studentId', gradeController.getStudentGrades);

// Tabla interactiva por clase y periodo
router.get('/table/:classId/:evaluation', gradeController.getGradeTable);

// Descarga del reporte de calificaciones en PDF
router.get('/pdf/:classId/:evaluation', gradeController.downloadGradeReportPdf);

// Calificaciones de una clase y evaluación
router.get('/:classId/:evaluation', gradeController.listByClass);

// Guardar calificaciones
router.post('/', gradeController.upsertGrades);

module.exports = router;
