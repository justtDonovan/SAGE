const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Listar alumnos
router.get('/', studentController.list);

// Alumnos por clase
router.get('/class/:classId', studentController.listByClass);

// Obtener alumno por ID
router.get('/:id', studentController.getById);

// Crear alumno
router.post('/', studentController.create);

// Actualizar alumno
router.put('/:id', studentController.update);

// Eliminar alumno
router.delete('/:id', studentController.remove);

// Baja lógica / Reactivar
router.patch('/:id/status', studentController.toggleStatus);

module.exports = router;
