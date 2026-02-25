const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function applySQL(filename) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sage_db',
    multipleStatements: true
  });

  const scriptName = filename || process.argv[2];
  if (!scriptName) {
    console.error('Por favor especifica un archivo SQL');
    process.exit(1);
  }

  console.log(`Conectado a la base de datos MySQL. Aplicando ${scriptName}...`);

  try {
    const sqlPath = path.join(__dirname, '..', scriptName);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await connection.query(sql);
    console.log(`¡Script ${scriptName} ejecutado con éxito!`);
  } catch (error) {
    console.error('Error ejecutando el script:', error);
  } finally {
    await connection.end();
  }
}

applySQL();
