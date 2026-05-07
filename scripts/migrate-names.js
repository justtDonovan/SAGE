const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'sage_db',
    multipleStatements: true
  });

  try {
    console.log('📖 Leyendo archivo de migración...');
    const migrationPath = path.join(__dirname, '../database/migrations/normalize_names.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔄 Ejecutando migración...');
    await connection.query(sql);

    console.log('✅ Migración completada exitosamente.');
  } catch (err) {
    console.error('❌ Error en la migración:', err);
  } finally {
    await connection.end();
  }
}

runMigration();
