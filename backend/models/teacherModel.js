const pool = require('../config/database');
const bcrypt = require('bcrypt');

const TeacherModel = {
  getAll: async () => {
    // Obtenemos solo los users con rol 'teacher'
    const [rows] = await pool.query(`
      SELECT id, first_name, last_name, age, career_studied, specialty, username, active, hired_date 
      FROM users 
      WHERE role = 'teacher' 
      ORDER BY last_name, first_name
    `);
    return rows;
  },
  
  // Crear profesor (Usuario con role='teacher')
  create: async (data) => {
    const { first_name, last_name, age, career_studied, specialty, username, password } = data;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [res] = await pool.query(
      `INSERT INTO users (username, password, role, first_name, last_name, age, career_studied, specialty) 
       VALUES (?, ?, 'teacher', ?, ?, ?, ?, ?)`,
      [username, hashedPassword, first_name, last_name, age, career_studied, specialty]
    );
    return res.insertId;
  },

  // Obtener por ID
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND role = "teacher"', [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const { first_name, last_name, age, career_studied, specialty, username, password } = data;
    let query = 'UPDATE users SET first_name=?, last_name=?, age=?, career_studied=?, specialty=?, username=?';
    let params = [first_name, last_name, age, career_studied, specialty, username];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password=?';
      params.push(hashedPassword);
    }

    query += ' WHERE id=? AND role="teacher"';
    params.push(id);

    await pool.query(query, params);
  },

  updateStatus: async (id, active) => {
    await pool.query('UPDATE users SET active = ? WHERE id = ? AND role = "teacher"', [active, id]);
  },

  remove: async (id) => {
    await pool.query('DELETE FROM users WHERE id = ? AND role = "teacher"', [id]);
  }
};

module.exports = TeacherModel;
