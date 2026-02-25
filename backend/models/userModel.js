const pool = require('../config/database');

const UserModel = {
  // Buscar usuario por nombre de usuario
  findByUsername: async (username) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario por ID (sin password)
  findById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT id, username, role, full_name, created_at FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo usuario (para funcionalidad futura de "Agregar Profesor")
  create: async (userData) => {
    // role puede ser 'admin', 'teacher' o 'student' (aunque 'student' no esté en enum original, lo agregaremos)
    const { username, password, role, full_name, age, career_studied, specialty } = userData;
    try {
      const [result] = await pool.query(
        `INSERT INTO users (username, password, role, full_name, age, career_studied, specialty) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [username, password, role, full_name, age, career_studied, specialty]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserModel;
