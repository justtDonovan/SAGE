const pool = require('../config/database');

const GradeModel = {
  getGradesByStudent: async (student_id) => {
    const [rows] = await pool.query(`
      SELECT g.*, c.name as class_name, u.full_name as teacher_name, c.period
      FROM grades g
      JOIN classes c ON g.class_id = c.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE g.student_id = ?
    `, [student_id]);
    return rows;
  },

  upsert: async (data) => {
    const { class_id, student_id, evaluation, grade, recorded_by_teacher_id } = data;
    const [res] = await pool.query(`
      INSERT INTO grades (class_id, student_id, evaluation, grade, recorded_by_teacher_id)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE grade = VALUES(grade), recorded_by_teacher_id = VALUES(recorded_by_teacher_id)
    `, [class_id, student_id, evaluation, grade, recorded_by_teacher_id]);
    return res.insertId;
  },

  getByClassAndEval: async (class_id, evaluation) => {
    const [rows] = await pool.query(
      'SELECT * FROM grades WHERE class_id = ? AND evaluation = ?',
      [class_id, evaluation]
    );
    return rows;
  }
};

module.exports = GradeModel;
