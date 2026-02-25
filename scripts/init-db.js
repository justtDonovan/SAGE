const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, '../database/schema.sql');

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('📖 Leyendo archivo schema.sql...');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Ejecutando script de inicialización de base de datos...');
    await connection.query(sql);

    console.log('✅ Base de datos "sage_db" creada e inicializada correctamente.');
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err);
  } finally {
    await connection.end();
  }
}

initDB();
