const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sage_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión y consulta
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a la base de datos MySQL');

    const [rows] = await connection.query('SELECT * FROM students LIMIT 5');
    console.log('Datos de students:', rows);

    connection.release();
  } catch (err) {
    console.error('Error en la conexión:', err);
  }
})();

module.exports = pool;
