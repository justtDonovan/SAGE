const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Listar alumnos
router.get('/', studentController.list);

// Crear alumno
router.post('/', studentController.create);
router.put('/:id', studentController.update);

// Baja lógica / Reactivar
router.patch('/:id/status', studentController.toggleStatus);
router.delete('/:id', studentController.delete);

module.exports = router;
