const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Horario de un alumno
router.get('/student/:studentId', scheduleController.getStudentSchedule);

// Horario de una clase
router.get('/class/:classId', scheduleController.listByClass);

// Agregar horario
router.post('/', scheduleController.createSchedule);

module.exports = router;
