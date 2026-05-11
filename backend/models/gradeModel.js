const pool = require('../config/database');

const GradeModel = {
  getGradesByStudent: async (student_id) => {
    const [rows] = await pool.query(`
      SELECT g.*, c.name as class_name,
             CONCAT(u.first_name, ' ', u.last_name) as teacher_name,
             c.period, c.group_name
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
    const [rows] = await pool.query(`
      SELECT g.*, s.first_name, s.last_name
      FROM grades g
      JOIN students s ON s.id = g.student_id
      WHERE g.class_id = ? AND g.evaluation = ?
      ORDER BY s.last_name, s.first_name
    `, [class_id, evaluation]);
    return rows;
  },

  getGradeTableByClassAndEval: async (class_id, evaluation) => {
    const [rows] = await pool.query(`
      SELECT s.id AS student_id,
             s.first_name,
             s.last_name,
             g.id AS grade_id,
             g.grade,
             g.evaluation,
             c.name AS class_name,
             c.group_name,
             c.career_id,
             car.name AS career_name,
             c.teacher_id,
             CONCAT(u.first_name, ' ', u.last_name) AS teacher_name
      FROM enrollments e
      JOIN students s ON s.id = e.student_id
      JOIN classes c ON c.id = e.class_id
      LEFT JOIN careers car ON car.id = c.career_id
      LEFT JOIN users u ON u.id = c.teacher_id
      LEFT JOIN grades g ON g.class_id = c.id
        AND g.student_id = s.id
        AND g.evaluation = ?
      WHERE c.id = ?
      ORDER BY s.last_name, s.first_name
    `, [evaluation, class_id]);
    return rows;
  },

  getGradeFilters: async (teacher_id = null) => {
    const teacherFilter = teacher_id ? 'WHERE u.role = "teacher" AND u.id = ?' : 'WHERE u.role = "teacher"';
    const classTeacherFilter = teacher_id ? 'WHERE c.teacher_id = ?' : '';

    const [careers] = await pool.query('SELECT id, name FROM careers ORDER BY name');
    const [teachers] = await pool.query(
      `SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name
       FROM users u
       ${teacherFilter}
       ORDER BY u.last_name, u.first_name`,
      teacher_id ? [teacher_id] : []
    );
    const [classes] = await pool.query(
      `SELECT c.id, c.name, c.career_id, c.teacher_id, c.group_name
       FROM classes c
       ${classTeacherFilter}
       ORDER BY c.name`,
      teacher_id ? [teacher_id] : []
    );

    return { careers, teachers, classes };
  }
};

module.exports = GradeModel;
