const pool = require('../config/database');

const StudentModel = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT s.*, c.name as career_name 
      FROM students s 
      JOIN careers c ON s.career_id = c.id 
      ORDER BY s.last_name, s.first_name
    `);
    return rows;
  },
  
  create: async (data) => {
    const { first_name, last_name, career_id, semester, enrollment_date, user_id } = data;
    const [res] = await pool.query(
      'INSERT INTO students (first_name, last_name, career_id, semester, enrollment_date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, career_id, semester, enrollment_date, user_id || null]
    );
    return res.insertId;
  },

  getByUserId: async (user_id) => {
    const [rows] = await pool.query('SELECT * FROM students WHERE user_id = ?', [user_id]);
    return rows[0];
  },

  update: async (id, data) => {
    const { first_name, last_name, career_id, semester, enrollment_date } = data;
    const [res] = await pool.query(
      `UPDATE students
       SET first_name = ?, last_name = ?, career_id = ?, semester = ?, enrollment_date = ?
       WHERE id = ?`,
      [first_name, last_name, career_id, semester, enrollment_date, id]
    );
    return res.affectedRows;
  },

  updateStatus: async (id, active) => {
    await pool.query('UPDATE students SET active = ? WHERE id = ?', [active, id]);
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  },

  delete: async (id) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [students] = await connection.query('SELECT user_id FROM students WHERE id = ?', [id]);
      if (!students[0]) {
        await connection.rollback();
        return 0;
      }

      const userId = students[0].user_id;
      await connection.query('DELETE FROM students WHERE id = ?', [id]);

      if (userId) {
        await connection.query('DELETE FROM users WHERE id = ? AND role = "student"', [userId]);
      }

      await connection.commit();
      return 1;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = StudentModel;
