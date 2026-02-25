const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta principal para login (POST /api/auth/login)
router.post('/login', authController.login);
router.post('/register', authController.register);

// Ruta para cerrar sesión (opcional en JWT, simplemente se elimina en cliente)
router.post('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' });
});

// Debug: Ver todos los usuarios (temporal)
router.get('/debug/users', async (req, res) => {
  try {
    const pool = require('../config/database');
    const [users] = await pool.query('SELECT id, username, role, full_name, active FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
