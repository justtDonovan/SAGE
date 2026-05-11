const pool = require('../config/database');

const ClassModel = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT c.*, car.name as career_name,
             CONCAT(u.first_name, ' ', u.last_name) as teacher_name
      FROM classes c 
      LEFT JOIN careers car ON c.career_id = car.id 
      LEFT JOIN users u ON c.teacher_id = u.id 
      ORDER BY c.name
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(`
      SELECT c.*, car.name as career_name,
             CONCAT(u.first_name, ' ', u.last_name) as teacher_name
      FROM classes c
      LEFT JOIN careers car ON c.career_id = car.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE c.id = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { name, career_id, teacher_id, period, group_name } = data;
    const [res] = await pool.query(
      'INSERT INTO classes (name, career_id, teacher_id, period, group_name) VALUES (?, ?, ?, ?, ?)',
      [name, career_id, teacher_id || null, period, group_name || null]
    );
    return res.insertId;
  },

  update: async (id, data) => {
    const { name, career_id, teacher_id, period, group_name, active } = data;
    await pool.query(
      `UPDATE classes
       SET name = ?, career_id = ?, teacher_id = ?, period = ?, group_name = ?, active = COALESCE(?, active)
       WHERE id = ?`,
      [name, career_id, teacher_id || null, period, group_name || null, active, id]
    );
  },

  remove: async (id) => {
    await pool.query('DELETE FROM classes WHERE id = ?', [id]);
  },

  enrollStudent: async (class_id, student_id) => {
    const [res] = await pool.query(
      'INSERT INTO enrollments (class_id, student_id) VALUES (?, ?)',
      [class_id, student_id]
    );
    return res.insertId;
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
      SELECT c.*, CONCAT(u.first_name, ' ', u.last_name) as teacher_name
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
  }
};

module.exports = ClassModel;
