const pool = require('../config/database');

const ClassModel = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT c.*, car.name as career_name, CONCAT_WS(' ', u.first_name, u.last_name) as teacher_name 
      FROM classes c 
      LEFT JOIN careers car ON c.career_id = car.id 
      LEFT JOIN users u ON c.teacher_id = u.id 
      ORDER BY c.name
    `);
    return rows;
  },

  create: async (data) => {
    const { name, career_id, teacher_id, period } = data;
    const [res] = await pool.query(
      'INSERT INTO classes (name, career_id, teacher_id, period) VALUES (?, ?, ?, ?)',
      [name, career_id, teacher_id, period]
    );
    return res.insertId;
  },

  enrollStudent: async (class_id, student_id) => {
    const [res] = await pool.query(
      'INSERT INTO enrollments (class_id, student_id, enrollment_date) VALUES (?, ?, CURDATE())',
      [class_id, student_id]
    );
    return res.insertId;
  },

  unenrollStudent: async (class_id, student_id) => {
    const [res] = await pool.query(
      'DELETE FROM enrollments WHERE class_id = ? AND student_id = ?',
      [class_id, student_id]
    );
    return res.affectedRows;
  },

  getEnrolledStudents: async (class_id) => {
    const [rows] = await pool.query(`
      SELECT s.* 
      FROM students s 
      JOIN enrollments e ON s.id = e.student_id 
      WHERE e.class_id = ?
    `, [class_id]);
    return rows;
  },

  getEnrollmentsByStudent: async (student_id) => {
    const [rows] = await pool.query(`
      SELECT c.*, CONCAT_WS(' ', u.first_name, u.last_name) as teacher_name 
      FROM classes c 
      JOIN enrollments e ON c.id = e.class_id 
      LEFT JOIN users u ON c.teacher_id = u.id 
      WHERE e.student_id = ?
    `, [student_id]);
    return rows;
  },

  getStudentsByClass: async (class_id) => {
    const [rows] = await pool.query(`
      SELECT s.* 
      FROM students s 
      JOIN enrollments e ON s.id = e.student_id 
      WHERE e.class_id = ?
    `, [class_id]);
    return rows;
  },

  update: async (id, data) => {
    const { name, career_id, teacher_id, period } = data;
    await pool.query(
      'UPDATE classes SET name = ?, career_id = ?, teacher_id = ?, period = ? WHERE id = ?',
      [name, career_id, teacher_id, period, id]
    );
  },

  remove: async (id) => {
    // Delete enrollments first
    await pool.query('DELETE FROM enrollments WHERE class_id = ?', [id]);
    // Then delete class
    await pool.query('DELETE FROM classes WHERE id = ?', [id]);
  }
};

module.exports = ClassModel;
