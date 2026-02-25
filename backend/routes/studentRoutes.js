const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Listar alumnos
router.get('/', studentController.list);

// Crear alumno
router.post('/', studentController.create);

// Baja lógica / Reactivar
router.patch('/:id/status', studentController.toggleStatus);

module.exports = router;
