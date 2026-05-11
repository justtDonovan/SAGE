const pool = require('../config/database');

const CareerModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT id, name FROM careers ORDER BY name');
    return rows;
  }
};

module.exports = CareerModel;
