const GradeModel = require('../models/gradeModel');

const VALID_EVALUATIONS = ['Periodo 1', 'Periodo 2', 'Periodo 3'];

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

      if (!VALID_EVALUATIONS.includes(evaluation)) {
        return res.status(400).json({ error: 'La evaluación debe ser: Periodo 1, Periodo 2 o Periodo 3' });
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
      if (!VALID_EVALUATIONS.includes(evaluation)) {
        return res.status(400).json({ error: 'Evaluación inválida' });
      }
      const grades = await GradeModel.getByClassAndEval(classId, evaluation);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getGradeTable: async (req, res) => {
    try {
      const { classId, evaluation } = req.params;
      if (!VALID_EVALUATIONS.includes(evaluation)) {
        return res.status(400).json({ error: 'Evaluación inválida' });
      }
      const rows = await GradeModel.getGradeTableByClassAndEval(classId, evaluation);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFilters: async (req, res) => {
    try {
      const teacherId = req.query.teacher_id ? Number(req.query.teacher_id) : null;
      const data = await GradeModel.getGradeFilters(teacherId || null);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = GradeController;
