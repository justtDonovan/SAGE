const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Guardar asistencia
router.post('/', attendanceController.save);

// Listar asistencia por clase y fecha
router.get('/:classId/:date', attendanceController.list);

module.exports = router;
