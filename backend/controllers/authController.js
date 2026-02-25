const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
      }

      // Buscar usuario en base de datos
      const user = await UserModel.findByUsername(username);

      if (!user) {
        // Para seguridad, siempre responder genérico o verificar.
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Comparar contraseña
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar Token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '8h' }
      );

      // Retornar IDs vinculados
      let studentId = null;
      let teacherId = null;

      if (user.role === 'student') {
        const StudentModel = require('../models/studentModel');
        const student = await StudentModel.getByUserId(user.id);
        studentId = student ? student.id : null;
      } else if (user.role === 'teacher') {
        teacherId = user.id; // Asumimos ID usuario = ID info por ahora
      }

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          full_name: user.full_name,
          studentId,
          teacherId
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  },

  register: async (req, res) => {
    try {
      const { username, password, full_name, role } = req.body;

      // Validaciones básicas
      if (!username || !password || !full_name) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      // Verificar si el usuario ya existe
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      let newUserId = null;

      if (role === 'student') {
        // Para alumnos, NO creamos registro en 'users' (tabla de staff), sino en 'students'.
        // Sin embargo, si queremos que se logueen, necesitamos un usuario en 'users' O cambiar la lógica de login.
        // Dado el esquema actual: 'users' es para Admin y Teacher. 'students' es otra tabla.
        // SOLUCIÓN RAPIDA: Crear usuario en tabla 'users' con rol 'student' PARA LOGIN, 
        // y ADEMÁS crear registro en tabla 'students' con los datos académicos.
        // Nota: Esto implica que el alumno tendrá 2 IDs (user.id y student.id).
        
        // 1. Crear Usuario para Login
        newUserId = await UserModel.create({
            username,
            password: hashedPassword,
            full_name,
            role: 'student',
            age: null, career_studied: null, specialty: null
        });

        // 2. Crear Registro de Alumno vinculado (idealmente. Por ahora lo creamos suelto o usamos el mismo nombre)
        // El modelo actual de student requiere career_id, semester, enrollment_date
        const { career_id, semester } = req.body;
        if (!career_id || !semester) {
             return res.status(400).json({ error: 'Faltan datos académicos para el alumno (carrera/semestre)' });
        }
        
        const StudentModel = require('../models/studentModel'); // Require dinámico para evitar ciclos si los hubiera
        await StudentModel.create({
            full_name,
            career_id,
            semester,
            enrollment_date: new Date().toISOString().slice(0, 10),
            user_id: newUserId // FIXED: Linking student to the newly created user
        });
        
      } else {
          // Admin o Teacher
          newUserId = await UserModel.create({
            username,
            password: hashedPassword,
            full_name,
            role: role || 'teacher',
            age: null,
            career_studied: null,
            specialty: null
          });
      }

      res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUserId });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }
};

module.exports = AuthController;
