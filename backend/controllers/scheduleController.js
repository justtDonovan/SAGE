const ScheduleModel = require('../models/scheduleModel');

const ScheduleController = {
  getStudentSchedule: async (req, res) => {
    try {
      const { studentId } = req.params;
      const schedule = await ScheduleModel.getByStudent(studentId);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createSchedule: async (req, res) => {
    try {
      const id = await ScheduleModel.create(req.body);
      res.status(201).json({ id, message: 'Horario creado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listByClass: async (req, res) => {
    try {
      const { classId } = req.params;
      const schedule = await ScheduleModel.getByClass(classId);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ScheduleController;
