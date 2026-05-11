const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');

router.get('/', careerController.list);

module.exports = router;
