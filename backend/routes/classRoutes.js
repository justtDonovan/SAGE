const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// Listar clases
router.get('/', classController.list);

// Crear clase
router.post('/', classController.create);

// Inscribir alumno
router.post('/enroll', classController.enroll);
router.delete('/enroll', classController.unenroll);

// Clases de un alumno
router.get('/student/:studentId', classController.getStudentEnrollments);

// Alumnos de una clase
router.get('/:id/students', classController.listStudents);

// Actualizar y eliminar clase
router.put('/:id', classController.update);
router.delete('/:id', classController.remove);

module.exports = router;
