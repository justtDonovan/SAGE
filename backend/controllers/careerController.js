const CareerModel = require('../models/careerModel');

const CareerController = {
  list: async (req, res) => {
    try {
      const careers = await CareerModel.getAll();
      res.json(careers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CareerController;
