const pool = require('../config/database');

const StatModel = {
  getDashboardStats: async () => {
    const [rows] = await pool.query('SELECT * FROM v_dashboard_counts');
    return rows[0];
  }
};

module.exports = StatModel;
