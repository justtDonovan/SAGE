const GradeModel = require('../models/gradeModel');

const GradeController = {
  getStudentGrades: async (req, res) => {
    try {
      const { studentId } = req.params;
      const grades = await GradeModel.getGradesByStudent(studentId);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  upsertGrades: async (req, res) => {
    try {
      const { class_id, evaluation, records, teacher_id } = req.body;
      if (!class_id || !evaluation || !records) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      for (const record of records) {
        await GradeModel.upsert({
          class_id,
          student_id: record.student_id,
          evaluation,
          grade: record.grade,
          recorded_by_teacher_id: teacher_id
        });
      }

      res.json({ message: 'Calificaciones guardadas con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listByClass: async (req, res) => {
    try {
      const { classId, evaluation } = req.params;
      const grades = await GradeModel.getByClassAndEval(classId, evaluation);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = GradeController;
