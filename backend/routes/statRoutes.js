const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');

router.get('/dashboard', statController.getStats);

module.exports = router;
