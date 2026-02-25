const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sage_db'
  });

  try {
    const [users] = await connection.query("SELECT id, username, role, full_name FROM users WHERE role = 'student'");
    console.log('--- Usuarios Estudiantes ---');
    users.forEach(u => console.log(`User ID: ${u.id}, Username: ${u.username}, Name: ${u.full_name}`));

    const [students] = await connection.query('SELECT id, user_id, full_name FROM students');
    console.log('\n--- Estudiantes (Tabla students) ---');
    students.forEach(s => console.log(`Student ID: ${s.id}, Linked User ID: ${s.user_id}, Name: ${s.full_name}`));

    const [enrollments] = await connection.query(`
      SELECT e.student_id, c.name as class_name
      FROM enrollments e
      JOIN classes c ON e.class_id = c.id
    `);
    console.log('\n--- Inscripciones ---');
    enrollments.forEach(e => console.log(`Student ID: ${e.student_id} -> Class: ${e.class_name}`));

    const [view] = await connection.query('SELECT * FROM v_dashboard_counts');
    console.log('\n--- Vista Dashboard ---');
    console.log(view[0]);

  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

check();
