const TeacherModel = require('../models/teacherModel');

const PASSWORD_POLICY_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

function isValidPasswordPolicy(password) {
  return PASSWORD_POLICY_REGEX.test(password || '');
}

const TeacherController = {
  list: async (req, res) => {
    try {
      const teachers = await TeacherModel.getAll();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const teacher = await TeacherModel.getById(id);
      if (!teacher) {
        return res.status(404).json({ error: 'Profesor no encontrado' });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      if (!isValidPasswordPolicy(req.body.password)) {
        return res.status(400).json({
          error: 'La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula y al menos un carácter especial.'
        });
      }
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
      if (req.body.password && !isValidPasswordPolicy(req.body.password)) {
        return res.status(400).json({
          error: 'La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula y al menos un carácter especial.'
        });
      }
      await TeacherModel.update(id, req.body);
      res.json({ message: 'Profesor actualizado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      await TeacherModel.remove(id);
      res.json({ message: 'Profesor eliminado' });
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
