const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.get('/', teacherController.list);
router.get('/:id', teacherController.getById);
router.post('/', teacherController.create);
router.put('/:id', teacherController.update);
router.delete('/:id', teacherController.remove);
router.patch('/:id/status', teacherController.toggleStatus);

module.exports = router;
