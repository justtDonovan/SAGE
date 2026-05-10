const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.get('/', teacherController.list);
router.post('/', teacherController.create);
router.put('/:id', teacherController.update);
router.patch('/:id/status', teacherController.toggleStatus);
router.delete('/:id', teacherController.remove);

module.exports = router;
