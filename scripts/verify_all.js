const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function verify() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sage_db'
  });

  try {
    console.log('=== VERIFICACIÓN DE DATOS ===');
    
    // 1. Usuarios con rol 'student'
    const [users] = await connection.query("SELECT id, username, full_name FROM users WHERE role = 'student'");
    console.log('\n--- Usuarios (Login) ---');
    console.table(users);

    // 2. Estudiantes vinculados
    const [students] = await connection.query(`
      SELECT s.id as student_id, s.user_id, s.full_name, u.username 
      FROM students s 
      LEFT JOIN users u ON s.user_id = u.id
    `);
    console.log('\n--- Estudiantes (Vínculo) ---');
    console.table(students);

    // 3. Inscripciones reales
    const [enrollments] = await connection.query(`
      SELECT e.student_id, s.full_name as student_name, c.name as class_name 
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN classes c ON e.class_id = c.id
    `);
    console.log('\n--- Inscripciones ---');
    console.table(enrollments);

    console.log('\n=== CONCLUSIÓN ===');
    for (const user of users) {
      const student = students.find(s => s.user_id === user.id);
      if (!student) {
        console.log(`- ERROR: El usuario '${user.username}' NO tiene un registro de estudiante vinculado.`);
      } else {
        const studentEnrollments = enrollments.filter(e => e.student_id === student.student_id);
        console.log(`- Usuario '${user.username}' (Student ID ${student.student_id}) tiene ${studentEnrollments.length} clases.`);
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

verify();
