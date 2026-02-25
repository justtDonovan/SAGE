const StatModel = require('../models/statModel');

const StatController = {
  getStats: async (req, res) => {
    try {
      const stats = await StatModel.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = StatController;
