// ========== FUNCIONES COMUNES ==========

// Datos de ejemplo y estado en memoria
const state = {
  careers: [
    { id: 1, name: 'Ingeniería en Sistemas' },
    { id: 2, name: 'Administración' },
    { id: 3, name: 'Contaduría' },
  ],
  students: [],
  teachers: [],
  classes: [],
  class_students: [],
  attendance: [],
  grades: [],
  reports: [],
  payments: [],
  activities: [],
};

// Sesión
const session = {
  get role() { return sessionStorage.getItem('role'); },
  set role(v) { sessionStorage.setItem('role', v); },
  get userId() { return sessionStorage.getItem('userId') ? Number(sessionStorage.getItem('userId')) : null; },
  get userName() { return sessionStorage.getItem('userName'); },
  get teacherId() { return sessionStorage.getItem('teacherId') ? Number(sessionStorage.getItem('teacherId')) : null; },
  get studentId() { return sessionStorage.getItem('studentId') ? Number(sessionStorage.getItem('studentId')) : null; },
  clear() { sessionStorage.clear(); window.location.href = 'index.html'; },
};

// Utilidades
const byId = (id) => document.getElementById(id);
const show = (el) => el?.removeAttribute('hidden');
const hide = (el) => el?.setAttribute('hidden', '');
const fmtMoney = (n) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

// Tema (modo nocturno / modo normal)
const theme = {
  get current() { return localStorage.getItem('theme') || 'dark'; },
  set current(v) { localStorage.setItem('theme', v); }
};

function applyTheme(t) {
  const isLight = t === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
  document.querySelectorAll('[data-theme-toggle]').forEach(input => {
    input.checked = !isLight;
  });
}

// Inicializar tema
applyTheme(theme.current);
document.querySelectorAll('[data-theme-toggle]').forEach(input => {
  input.addEventListener('change', (e) => {
    const next = e.target.checked ? 'dark' : 'light';
    theme.current = next;
    applyTheme(next);
  });
});

// Redirigir a dashboard si ya hay sesión
document.addEventListener('DOMContentLoaded', () => {
  const isDashboard = window.location.pathname.includes('dashboard-');
  const isLoginPage = window.location.pathname.includes('login-') || window.location.pathname.endsWith('/index.html') || window.location.pathname === '/frontend/';
  const currentRole = session.role;
  
  // Si hay sesión pero no está en dashboard, redirigir al dashboard correcto
  if (currentRole && !isDashboard) {
    if (currentRole === 'admin') {
      window.location.href = 'dashboard-admin.html';
    } else if (currentRole === 'teacher') {
      window.location.href = 'dashboard-profesor.html';
    } else if (currentRole === 'student') {
      window.location.href = 'dashboard-alumno.html';
    }
  }
  // Si no hay sesión pero está en dashboard, redirigir a selección de roles
  else if (!currentRole && isDashboard) {
    window.location.href = 'index.html';
  }
});
