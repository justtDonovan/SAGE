const pool = require('../config/database');

const StudentModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT s.*, c.name as career_name FROM students s JOIN careers c ON s.career_id = c.id ORDER BY s.full_name');
    return rows;
  },
  
  create: async (data) => {
    const { full_name, career_id, semester, enrollment_date, user_id } = data;
    const [res] = await pool.query(
      'INSERT INTO students (full_name, career_id, semester, enrollment_date, user_id) VALUES (?, ?, ?, ?, ?)',
      [full_name, career_id, semester, enrollment_date, user_id || null]
    );
    return res.insertId;
  },

  getByUserId: async (user_id) => {
    const [rows] = await pool.query('SELECT * FROM students WHERE user_id = ?', [user_id]);
    return rows[0];
  },

  updateStatus: async (id, active) => {
    await pool.query('UPDATE students SET active = ? WHERE id = ?', [active, id]);
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = StudentModel;
