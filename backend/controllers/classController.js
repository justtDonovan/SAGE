const ClassModel = require('../models/classModel');

const ClassController = {
  list: async (req, res) => {
    try {
      const classes = await ClassModel.getAll();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const id = await ClassModel.create(req.body);
      res.status(201).json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  enroll: async (req, res) => {
    try {
      const { class_id, student_id } = req.body;
      if (!class_id || !student_id) {
        return res.status(400).json({ error: 'class_id y student_id son requeridos' });
      }
      const id = await ClassModel.enrollStudent(class_id, student_id);
      res.status(201).json({ id, class_id, student_id, message: 'Inscripción exitosa' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El alumno ya está inscrito en esta clase' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  getStudentEnrollments: async (req, res) => {
    try {
      const { studentId } = req.params;
      const enrollments = await ClassModel.getEnrollmentsByStudent(studentId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listStudents: async (req, res) => {
    try {
      const { id } = req.params;
      const students = await ClassModel.getStudentsByClass(id);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ClassController;
