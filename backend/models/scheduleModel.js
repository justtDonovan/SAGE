const pool = require('../config/database');

const ScheduleModel = {
  getByStudent: async (student_id) => {
    const [rows] = await pool.query(`
      SELECT s.*, c.name as class_name, u.full_name as teacher_name
      FROM schedules s
      JOIN classes c ON s.class_id = c.id
      JOIN enrollments e ON c.id = e.class_id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE e.student_id = ?
      ORDER BY FIELD(s.day_of_week, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'), s.start_time
    `, [student_id]);
    return rows;
  },

  create: async (data) => {
    const { class_id, day_of_week, start_time, end_time, classroom } = data;
    const [res] = await pool.query(
      'INSERT INTO schedules (class_id, day_of_week, start_time, end_time, classroom) VALUES (?, ?, ?, ?, ?)',
      [class_id, day_of_week, start_time, end_time, classroom]
    );
    return res.insertId;
  },

  getByClass: async (class_id) => {
    const [rows] = await pool.query('SELECT * FROM schedules WHERE class_id = ?', [class_id]);
    return rows;
  }
};

module.exports = ScheduleModel;
