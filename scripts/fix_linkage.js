const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sage_db'
  });

  try {
    console.log('Buscando vinculaciones faltantes...');
    
    // 1. Obtener todos los usuarios con rol 'student'
    const [users] = await connection.query("SELECT id, full_name FROM users WHERE role = 'student'");
    
    let fixedCount = 0;
    
    for (const user of users) {
      // Intentar vincular por nombre exacto si el user_id es NULL
      const [res] = await connection.query(
        "UPDATE students SET user_id = ? WHERE full_name = ? AND user_id IS NULL",
        [user.id, user.full_name]
      );
      
      if (res.affectedRows > 0) {
        console.log(`Vinculado: ${user.full_name} (User ID: ${user.id})`);
        fixedCount += res.affectedRows;
      }
    }

    console.log(`\nProceso terminado. Se corrigieron ${fixedCount} registros.`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

fix();
