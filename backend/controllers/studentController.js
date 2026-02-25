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

  create: async (req, res) => {
    try {
      const id = await StudentModel.create(req.body);
      res.status(201).json({ id, ...req.body });
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
