const TeacherModel = require('../models/teacherModel');

const TeacherController = {
  list: async (req, res) => {
    try {
      const teachers = await TeacherModel.getAll();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const id = await TeacherModel.create(req.body);
      res.status(201).json({ id, message: 'Profesor creado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear profesor (posible usuario duplicado)' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      await TeacherModel.update(id, req.body);
      res.json({ message: 'Profesor actualizado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { active } = req.body;
      await TeacherModel.updateStatus(id, active);
      res.json({ message: 'Estado actualizado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = TeacherController;
