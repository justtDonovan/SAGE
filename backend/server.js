const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../frontend")));

// Rutas de API
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const statRoutes = require("./routes/statRoutes");
const careerRoutes = require("./routes/careerRoutes");

// Usar rutas API
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/careers", careerRoutes);

// Ruta principal para health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Servidor backend funcionando correctamente" });
});

// Ruta catch-all para servir el frontend (Single Page Application)
// Cualquier ruta que no coincida con /api será manejada por index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal en el servidor!");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
