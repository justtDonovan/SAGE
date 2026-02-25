const AttendanceModel = require('../models/attendanceModel');

const AttendanceController = {
  save: async (req, res) => {
    try {
      const { class_id, date, records, teacher_id } = req.body;
      if (!class_id || !date || !records) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      for (const record of records) {
        await AttendanceModel.save({
          class_id,
          student_id: record.student_id,
          attendance_date: date,
          status: record.status,
          recorded_by_teacher_id: teacher_id
        });
      }

      res.json({ message: 'Asistencia guardada con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  list: async (req, res) => {
    try {
      const { classId, date } = req.params;
      const attendance = await AttendanceModel.getByClassAndDate(classId, date);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = AttendanceController;
