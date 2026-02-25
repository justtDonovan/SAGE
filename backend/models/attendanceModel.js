const pool = require('../config/database');

const AttendanceModel = {
  save: async (data) => {
    const { class_id, student_id, attendance_date, status, recorded_by_teacher_id } = data;
    const [res] = await pool.query(
      `INSERT INTO attendance (class_id, student_id, attendance_date, status, recorded_by_teacher_id) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = VALUES(status), recorded_by_teacher_id = VALUES(recorded_by_teacher_id)`,
      [class_id, student_id, attendance_date, status, recorded_by_teacher_id]
    );
    return res.insertId;
  },

  getByClassAndDate: async (class_id, date) => {
    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE class_id = ? AND attendance_date = ?',
      [class_id, date]
    );
    return rows;
  }
};

module.exports = AttendanceModel;
