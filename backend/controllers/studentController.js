const StudentModel = require('../models/studentModel');

const StudentController = {
  list: async (req, res) => {
    try {
      const students = await StudentModel.getAll();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listByClass: async (req, res) => {
    try {
      const { classId } = req.params;
      const students = await StudentModel.getByClass(classId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const student = await StudentModel.getById(id);
      if (!student) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const id = await StudentModel.create(req.body);
      res.status(201).json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      await StudentModel.update(id, req.body);
      res.json({ message: 'Alumno actualizado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      await StudentModel.remove(id);
      res.json({ message: 'Alumno eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { active } = req.body; // true/false
      await StudentModel.updateStatus(id, active);
      res.json({ message: 'Estado actualizado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = StudentController;
