// Datos de ejemplo y estado en memoria
const state = {
  careers: [
    { id: 1, name: 'Ingeniería en Sistemas' },
    { id: 2, name: 'Administración' },
    { id: 3, name: 'Contaduría' },
  ],
  students: [
    { id: 1, full_name: 'Juan Pérez García', career_id: 1, semester: 3, enrollment_date: '2024-01-10', active: true },
    { id: 2, full_name: 'María González López', career_id: 2, semester: 5, enrollment_date: '2024-01-12', active: true },
    { id: 3, full_name: 'Carlos Rodríguez Martín', career_id: 3, semester: 2, enrollment_date: '2024-01-15', active: true },
  ],
  teachers: [
    { id: 1, full_name: 'Dr. Roberto Martínez', age: 45, career_studied: 'Ingeniería en Sistemas', specialty: 'Programación Web', username: 'roberto', password: '12345', active: true },
    { id: 2, full_name: 'Lic. Ana Fernández', age: 38, career_studied: 'Administración', specialty: 'Recursos Humanos', username: 'ana', password: '12345', active: true },
  ],
  classes: [
    { id: 1, name: 'Programación Web I', career_id: 1, teacher_id: 1, period: '2024A', average_grade: 8.5 },
    { id: 2, name: 'Administración de Empresas', career_id: 2, teacher_id: 2, period: '2024A', average_grade: 8.2 },
  ],
  class_students: [
    { id: 1, class_id: 1, student_id: 1, enrollment_date: '2024-01-10', status: 'inscrito' },
    { id: 2, class_id: 1, student_id: 3, enrollment_date: '2024-01-15', status: 'inscrito' },
    { id: 3, class_id: 2, student_id: 2, enrollment_date: '2024-01-12', status: 'inscrito' },
  ],
  attendance: [],
  grades: [
    { id: 1, class_id: 1, student_id: 1, evaluation: 'Final', grade: 9.0, recorded_by_teacher_id: 1 },
    { id: 2, class_id: 1, student_id: 3, evaluation: 'Final', grade: 7.5, recorded_by_teacher_id: 1 },
    { id: 3, class_id: 2, student_id: 2, evaluation: 'Final', grade: 8.0, recorded_by_teacher_id: 2 },
  ],
  reports: [
    { id: 1, student_id: 3, teacher_id: 1, class_id: 1, report_type: 'disciplinary', title: 'Mal comportamiento' },
    { id: 2, student_id: 2, teacher_id: 2, class_id: 2, report_type: 'missing_homework', title: 'Tarea no entregada' },
  ],
  payments: [
    { id: 1, student_id: 1, payment_date: '2024-01-11', concept: 'Colegiatura Enero', amount: 1200.0, receipt_number: 'REC-2024-0001' },
    { id: 2, student_id: 2, payment_date: '2024-01-13', concept: 'Colegiatura Enero', amount: 1200.0, receipt_number: 'REC-2024-0002' },
  ],
  activities: [
    { id: 1, type: 'Inscripción', description: 'Nuevo alumno: Juan Pérez García', actor_role: 'admin', actor_name: 'Administrador' },
    { id: 2, type: 'Profesor', description: 'Nuevo profesor: Dr. Roberto Martínez', actor_role: 'admin', actor_name: 'Administrador' },
    { id: 3, type: 'Asistencia', description: 'Registro de asistencias del día', actor_role: 'maestro', actor_name: 'Maestro' },
  ],
};

// Sesión
const session = {
  get role() { return sessionStorage.getItem('role'); },
  set role(v) { sessionStorage.setItem('role', v); },
  get userId() { return sessionStorage.getItem('userId') ? Number(sessionStorage.getItem('userId')) : null; },
  get userName() { return sessionStorage.getItem('userName'); },
  get teacherId() { return sessionStorage.getItem('teacherId') ? Number(sessionStorage.getItem('teacherId')) : null; },
  get studentId() { return sessionStorage.getItem('studentId') ? Number(sessionStorage.getItem('studentId')) : null; },
  clear() { sessionStorage.clear(); },
};

// Utilidades
const byId = (id) => document.getElementById(id);
const show = (el) => el.removeAttribute('hidden');
const hide = (el) => el.setAttribute('hidden', '');
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
    input.checked = !isLight; // dark theme = checked
  });
}
// Inicializar y registrar listeners
applyTheme(theme.current);
document.querySelectorAll('[data-theme-toggle]').forEach(input => {
  input.addEventListener('change', (e) => {
    const next = e.target.checked ? 'dark' : 'light';
    theme.current = next;
    applyTheme(next);
  });
});

// Modal reutilizable: mueve un elemento existente dentro de una ventana emergente
function openModalWithElement(el, title = '') {
  if (!el) return;
  const originalParent = el.parentElement;
  const originalNext = el.nextSibling;
  const detailsParent = originalParent?.tagName === 'DETAILS' ? originalParent : null;

  // Cerrar cualquier modal previo
  document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const modal = document.createElement('div');
  modal.className = 'modal';
  const header = document.createElement('div');
  header.className = 'modal-header';
  const h = document.createElement('h3');
  h.textContent = title || 'Formulario';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Cerrar');
  closeBtn.textContent = '✕';
  header.appendChild(h);
  header.appendChild(closeBtn);
  const body = document.createElement('div');
  body.className = 'modal-body';
  modal.appendChild(header);
  modal.appendChild(body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Mover el elemento al modal
  body.appendChild(el);
  show(el); // asegurar que se vea dentro del modal aunque esté oculto en la página
  if (detailsParent) detailsParent.open = true; // mantiene visible su altura cuando se restaure
  if (el.tagName === 'DETAILS') el.open = true; // si el propio elemento es <details>, abrirlo en modal

  function close() {
    // Restaurar el elemento a su lugar original
    if (originalParent) {
      if (originalNext) originalParent.insertBefore(el, originalNext);
      else originalParent.appendChild(el);
    }
    if (detailsParent) detailsParent.open = false;
    hide(el); // volver a ocultarlo en la página al cerrar
    backdrop.remove();
    // limpiar referencia global
    if (window._activeModalClose === close) window._activeModalClose = null;
  }

  // Interacciones de cierre
  closeBtn.onclick = close;
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
  // almacenar referencia global para poder cerrarlo desde otros handlers
  window._activeModalClose = close;
}

// Login
const loginForm = byId('loginForm');
const loginError = byId('loginError');

// Registro
const registerForm = byId('registerForm');
const showRegisterBtn = byId('showRegisterBtn');
const cancelRegisterBtn = byId('cancelRegisterBtn');
const registerError = byId('registerError');

// Toggle registro
if (showRegisterBtn && registerForm && loginForm) {
  showRegisterBtn.onclick = () => {
    hide(loginForm);
    show(registerForm);
    registerForm.reset();
  };
}
if (cancelRegisterBtn && registerForm && loginForm) {
  cancelRegisterBtn.onclick = () => {
    hide(registerForm);
    show(loginForm);
  };
}

// Handler registro
if (registerForm) {
  // Manejo de campos dinámicos
  const regRole = byId('regRole');
  const regStudentFields = byId('regStudentFields');
  const regCareer = byId('regCareer');

  // Cargar carreras (simulado o api)
  const careers = state.careers || [
    { id: 1, name: 'Ingeniería en Sistemas' },
    { id: 2, name: 'Administración' },
    { id: 3, name: 'Contaduría' }
  ];
  if(regCareer) {
    regCareer.innerHTML = careers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (regRole && regStudentFields) {
    regRole.addEventListener('change', () => {
      if (regRole.value === 'student') {
        show(regStudentFields);
      } else {
        hide(regStudentFields);
      }
    });
  }

  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = byId('regUsername').value.trim();
    const password = byId('regPassword').value.trim();
    const full_name = byId('regFullName').value.trim();
    const role = regRole ? regRole.value : 'teacher';
    
    // Campos extra para estudiante
    let extraData = {};
    if (role === 'student') {
      extraData.career_id = Number(regCareer.value);
      extraData.semester = Number(byId('regSemester').value) || 1;
    }

    if (!username || !password || !full_name) {
      alert('Todos los campos obligatorios deben llenarse');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password, 
          full_name, 
          role,
          ...extraData
        })
      });

      const data = await res.json();

      if (!res.ok) {
        registerError.textContent = data.error || 'Error al registrar usuario';
        show(registerError);
        return;
      }

      // Éxito
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      hide(registerForm);
      show(loginForm);
    } catch (err) {
      console.error(err);
      registerError.textContent = 'Error de conexión con el servidor';
      show(registerError);
    }
  };
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = byId('username').value.trim();
  const password = byId('password').value.trim();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      loginError.textContent = data.error || 'Error al iniciar sesión';
      show(loginError);
      return;
    }

    // Login exitoso
    const { token, user } = data;
    
    // Guardar sesión
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', user.role);
    sessionStorage.setItem('userId', user.id);
    sessionStorage.setItem('userName', user.full_name);
    
    if (user.role === 'teacher') {
      sessionStorage.setItem('teacherId', user.teacherId);
    } else if (user.role === 'student') {
      sessionStorage.setItem('studentId', user.studentId);
    }

    hide(loginError);
    loginForm.reset();
    renderApp();

  } catch (err) {
    console.error(err);
    loginError.textContent = 'Error de conexión con el servidor';
    show(loginError);
  }
});

// Navegación Alumno
document.querySelectorAll('[data-student]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-student');
    ['student-home', 'student-academics', 'student-schedule']
      .forEach((id) => (id === `student-${target}` ? show(byId(id)) : hide(byId(id))));
    if (target === 'home') renderStudentHome();
    if (target === 'academics') renderStudentAcademics();
    if (target === 'schedule') renderStudentSchedule();
  });
});

// Navegación Maestro
document.querySelectorAll('[data-teacher]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-teacher');
    ['teacher-home', 'teacher-students', 'teacher-grades']
      .forEach((id) => (id === `teacher-${target}` ? show(byId(id)) : hide(byId(id))));
    if (target === 'home') renderTeacherHome();
    if (target === 'students') renderTeacherStudents();
    if (target === 'grades') renderTeacherGrades();
  });
});

// Navegación Admin
document.querySelectorAll('[data-admin]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-admin');
    ['admin-home', 'admin-students', 'admin-teachers', 'admin-classes', 'admin-reports']
      .forEach((id) => (id === `admin-${target}` ? show(byId(id)) : hide(byId(id))));
    if (target === 'home') renderAdminHome();
    if (target === 'students') renderAdminStudents();
    if (target === 'teachers') renderAdminTeachers();
    if (target === 'classes') renderAdminClasses();
    if (target === 'reports') renderAdminReports();
  });
});

// Logout
byId('logoutAdmin').addEventListener('click', () => { session.clear(); renderApp(); });
byId('logoutTeacher').addEventListener('click', () => { session.clear(); renderApp(); });
byId('logoutStudent').addEventListener('click', () => { session.clear(); renderApp(); });

// Render principal
function renderApp() {
  const role = session.role;
  const loginView = byId('login');
  const adminView = byId('adminDashboard');
  const teacherView = byId('teacherDashboard');
  const studentView = byId('studentDashboard');

  if (!role) {
    show(loginView);
    hide(adminView);
    hide(teacherView);
    hide(studentView);
    return;
  }
  
  hide(loginView);
  
  if (role === 'admin') {
    show(adminView);
    hide(teacherView);
    hide(studentView);
    const activeAdminSection = document.querySelector('#adminDashboard .panel:not([hidden])');
    if (!activeAdminSection) document.querySelector('[data-admin="home"]').click();
  } else if (role === 'teacher') {
    show(teacherView);
    hide(adminView);
    hide(studentView);
    const activeTeacherSection = document.querySelector('#teacherDashboard .panel:not([hidden])');
    if (!activeTeacherSection) document.querySelector('[data-teacher="home"]').click();
  } else if (role === 'student') {
    show(studentView);
    hide(adminView);
    hide(teacherView);
    const activeStudentSection = document.querySelector('#studentDashboard .panel:not([hidden])');
    if (!activeStudentSection) document.querySelector('[data-student="home"]').click();
  }
}

// Admin Home
async function renderAdminHome() {
  try {
    const res = await fetch('/api/stats/dashboard');
    if (res.ok) {
      const stats = await res.json();
      byId('countStudents').textContent = stats.total_students || 0;
      byId('countTeachers').textContent = stats.total_teachers || 0;
      byId('countClasses').textContent = stats.total_classes || 0;
      byId('countTodayPresent').textContent = stats.today_attendance_present || 0;
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }

  const ul = byId('adminActivities');
  ul.innerHTML = '';
  state.activities.slice(-8).reverse().forEach(a => {
    const li = document.createElement('li');
    li.textContent = `${a.type}: ${a.description}`;
    ul.appendChild(li);
  });
}

// Admin Students
// Admin Students
async function renderAdminStudents() {
  const tbody = byId('studentsTable');
  tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
  
  let students = [];
  const careers = state.careers; // TODO: Cargar esto también con fetch

  // 1. Obtener datos
  try {
    const res = await fetch('/api/students');
    if (!res.ok) throw new Error('Error al cargar alumnos');
    students = await res.json();
    state.students = students; // Sync local
  } catch (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="5" class="error">Error cargando datos. Asegúrate de que el backend esté corriendo.</td></tr>';
    return;
  }

  // 2. Renderizar tabla
  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No hay alumnos registrados.</td></tr>';
  } else {
    tbody.innerHTML = students.map(s => {
      const c = careers.find(c => c.id === s.career_id)?.name || '-';
      const isInactive = s.active === 0;
      const status = isInactive ? ' (Baja)' : '';
      const disableEnroll = isInactive ? 'disabled title="Alumno dado de baja"' : '';
      const toggleText = isInactive ? 'Reactivar' : 'Dar de baja';
      const date = new Date(s.enrollment_date).toLocaleDateString();

      return `<tr>
        <td>${s.full_name}${status}</td>
        <td>${c}</td>
        <td>${s.semester}</td>
        <td>${date}</td>
        <td>
          <button class="btn ${isInactive ? 'baja' : ''}" data-enroll-student="${s.id}" ${disableEnroll}>Inscribir a clase</button>
          <button class="btn" data-toggle-status="${s.id}">${toggleText}</button>
        </td>
      </tr>`;
    }).join('');
  }

  // 3. Select de Carreras en Formulario
  const careerSel = byId('stCareer');
  if(careerSel) {
    careerSel.innerHTML = careers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  // 4. Configurar Formulario CREAR
  const form = byId('studentForm');
  if(form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const newStudent = {
        full_name: byId('stName').value.trim(),
        career_id: Number(byId('stCareer').value),
        semester: Number(byId('stSemester').value),
        enrollment_date: byId('stEnrollment').value
      };

      try {
        const postRes = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudent)
        });

        if (postRes.ok) {
          alert('Alumno registrado correctamente');
          if (window._activeModalClose) window._activeModalClose();
          form.reset();
          renderAdminStudents();
        } else {
          alert('Error al guardar alumno');
        }
      } catch (err) { console.error(err); alert('Error de conexión'); }
    };
  }

  // 5. Botón 'Nuevo Alumno'
  const addStudentBtn = byId('addStudentBtn');
  if (addStudentBtn) {
    addStudentBtn.onclick = () => {
      const card = byId('studentFormCard');
      if(card) openModalWithElement(card, 'Registrar alumno');
    };
  }

  // 6. Eventos de la tabla (Delegación no es necesaria porque re-renderizamos)
  // Inscribir
  tbody.querySelectorAll('[data-enroll-student]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const studentId = Number(btn.getAttribute('data-enroll-student'));
      const student = students.find(s => s.id === studentId);
      if (!student) return;
      
      if (student.active === 0) { alert('Alumno dado de baja'); return; }

      byId('enrollStudentId').value = student.id;
      byId('enrollStudentName').textContent = `Alumno: ${student.full_name}`;
      
      // 1. Cargar clases disponibles para la carrera (desde Backend)
      let availableClasses = [];
      try {
        const classesRes = await fetch('/api/classes');
        if (classesRes.ok) {
          const allClasses = await classesRes.json();
          availableClasses = allClasses.filter(cl => cl.career_id === student.career_id);
        }
      } catch (err) { console.error('Error cargando clases:', err); }

      const enrollClassSel = byId('enrollClass');
      if(enrollClassSel) enrollClassSel.innerHTML = availableClasses.map(cl => `<option value="${cl.id}">${cl.name}</option>`).join('');
      
      // Mostrar clases inscritas (desde Backend)
      try {
        const enrollRes = await fetch(`/api/classes/student/${studentId}`);
        if (enrollRes.ok) {
          const enrolledClasses = await enrollRes.json();
          const enrolledTable = byId('studentEnrolledClassesTable');
          if (enrolledTable) {
            enrolledTable.innerHTML = enrolledClasses.map(cl => {
              return `<tr><td>${cl.name}</td><td>${cl.teacher_name || 'Sin asignar'}</td><td>${cl.period || '-'}</td></tr>`;
            }).join('');
          }
        }
      } catch (err) { console.error('Error cargando inscripciones:', err); }

      show(byId('enrollStudentForm'));
    });
  });

  // Cambiar Estado (Baja/Alta)
  tbody.querySelectorAll('[data-toggle-status]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.getAttribute('data-toggle-status'));
      const st = students.find(s => s.id === id);
      if (!st) return;

      const newStatus = st.active === 0 ? true : false; 
      try {
         await fetch(`/api/students/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: newStatus })
         });
         renderAdminStudents();
      } catch(e) { console.error(e); alert('Error al cambiar estado'); }
    });
  });

  // Formulario Inscripción (Cerrar conexión con Backend)
  const enrollInner = byId('enrollStudentFormInner');
  if (enrollInner) {
      enrollInner.onsubmit = async (e) => {
      e.preventDefault();
      const class_id = Number(byId('enrollClass').value);
      const student_id = Number(byId('enrollStudentId').value);
      
      if (!class_id) { alert('Selecciona una clase'); return; }

      try {
        const res = await fetch('/api/classes/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ class_id, student_id })
        });
        
        const data = await res.json();
        if (res.ok) {
          alert('Inscripción realizada con éxito');
          // Actualizar lista de inscritas sin cerrar modal si se quiere seguir inscribiendo
          // O cerrar
          hide(byId('enrollStudentForm'));
          renderAdminStudents(); 
        } else {
          alert(data.error || 'Error al inscribir');
        }
      } catch (err) {
        console.error(err);
        alert('Error de conexión');
      }
    };
  }
  
  const cancelEnroll = byId('cancelEnrollStudent');
  if(cancelEnroll) {
    cancelEnroll.addEventListener('click', () => {
        hide(byId('enrollStudentForm'));
        if(enrollInner) enrollInner.reset();
    });
  }
}

// Admin Teachers
async function renderAdminTeachers() {
  const tbody = byId('teachersTable');
  tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
  
  let teachers = [];

  try {
    const res = await fetch('/api/teachers');
    if (!res.ok) throw new Error('Error al cargar profesores');
    teachers = await res.json();
    state.teachers = teachers; // Sync local para otras funciones
  } catch (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="7" class="error">Error cargando datos.</td></tr>';
    return;
  }

  // Render Tabla
  if (teachers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No hay profesores registrados.</td></tr>';
  } else {
    tbody.innerHTML = teachers.map(t => {
      const isInactive = t.active === 0;
      const status = isInactive ? ' (Baja)' : '';
      const toggleText = isInactive ? 'Reactivar' : 'Dar de baja';
      
      return `<tr>
        <td>${t.full_name}${status}</td>
        <td>${t.age ?? '-'}</td>
        <td>${t.career_studied ?? '-'}</td>
        <td>${t.specialty ?? '-'}</td>
        <td>${t.username ?? '-'}</td>
        <td>******</td> <!-- Ocultar password -->
        <td>
          <button class="btn" data-edit-teacher="${t.id}">Editar</button>
          <button class="btn" data-toggle-teacher-status="${t.id}">${toggleText}</button>
        </td>
      </tr>`;
    }).join('');
  }

  // Formulario CREAR
  const form = byId('teacherForm');
  if(form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      
      const newTeacher = {
        full_name: byId('tcName').value.trim(),
        age: Number(byId('tcAge').value) || null,
        career_studied: byId('tcCareerStudied').value.trim() || null,
        specialty: byId('tcSpecialty').value.trim() || null,
        username: byId('tcUsername').value.trim(),
        password: byId('tcPassword').value.trim()
      };

      try {
        const postRes = await fetch('/api/teachers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTeacher)
        });

        const data = await postRes.json();

        if (postRes.ok) {
          alert('Profesor registrado correctamente');
          if (window._activeModalClose) window._activeModalClose();
          form.reset();
          renderAdminTeachers();
        } else {
          alert('Error: ' + (data.error || 'No se pudo crear el profesor'));
        }
      } catch (err) { console.error(err); alert('Error de conexión'); }
    };
  }

  // Eventos Tabla
  tbody.querySelectorAll('[data-toggle-teacher-status]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.getAttribute('data-toggle-teacher-status'));
      const t = teachers.find(x => x.id === id);
      if (t) {
        const newActive = t.active === 0 ? true : false;
        try {
            await fetch(`/api/teachers/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: newActive })
            });
            renderAdminTeachers();
        } catch(e) { console.error(e); alert('Error al cambiar estado'); }
      }
    });
  });
  
  // Editar (Básico - solo abre modal con datos)
  tbody.querySelectorAll('[data-edit-teacher]').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-edit-teacher'));
        const teacher = teachers.find(t => t.id === id);
        if(teacher) {
            byId('editTeacherId').value = teacher.id;
            byId('editTcName').value = teacher.full_name;
            byId('editTcAge').value = teacher.age || '';
            byId('editTcCareerStudied').value = teacher.career_studied || '';
            byId('editTcSpecialty').value = teacher.specialty || '';
            byId('editTcUsername').value = teacher.username || '';
            byId('editTcPassword').value = ''; // No mostrar pass hash, dejar vacio para no editar
            const card = byId('editTeacherForm');
            if(card) openModalWithElement(card, 'Editar profesor');
        }
    });
  });

  // Handler para GUARDAR EDICIÓN de profesor
  const editForm = byId('editTeacherFormInner');
  if (editForm) {
    editForm.onsubmit = async (e) => {
      e.preventDefault();
      const id = byId('editTeacherId').value;
      const updatedTeacher = {
        full_name: byId('editTcName').value.trim(),
        age: Number(byId('editTcAge').value) || null,
        career_studied: byId('editTcCareerStudied').value.trim() || null,
        specialty: byId('editTcSpecialty').value.trim() || null,
        username: byId('editTcUsername').value.trim(),
        password: byId('editTcPassword').value.trim() || null // Opcional
      };

      try {
        const res = await fetch(`/api/teachers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTeacher)
        });

        if (res.ok) {
          alert('Profesor actualizado correctamente');
          if (window._activeModalClose) window._activeModalClose();
          renderAdminTeachers();
        } else {
          const data = await res.json();
          alert('Error: ' + (data.error || 'No se pudo actualizar el profesor'));
        }
      } catch (err) {
        console.error(err);
        alert('Error de conexión');
      }
    };
  }

  // Cancelar Edición
  const cancelEditBtn = byId('cancelEditTeacher');
  if (cancelEditBtn) {
    cancelEditBtn.onclick = () => {
      if (window._activeModalClose) window._activeModalClose();
    };
  }

  // Botón Nuevo Profesor
  const addTeacherBtn = byId('addTeacherBtn');
  if (addTeacherBtn) {
    addTeacherBtn.onclick = () => {
      const card = byId('teacherFormCard');
      if(card) openModalWithElement(card, 'Registrar profesor');
    };
  }
  
  // LOGICA DE ASIGNACIÓN (Mantenida localmente pero refrescada)
  refreshAssignmentSection(teachers);
}

function refreshAssignmentSection(teachers) {
  // --- Asignación de clases a profesor ---
  const atTeacherSel = byId('atTeacher');
  const atClassSel = byId('atClass');
  const atMsg = byId('atMsg');
  const teacherClassesTable = byId('teacherClassesTable');

  if(!atTeacherSel || !atClassSel) return;

  // Poblar selects
  atTeacherSel.innerHTML = teachers
    .filter(t => t.active !== 0)
    .map(t => `<option value="${t.id}">${t.full_name}</option>`)
    .join('');
    
  // Classes siguen siendo locales por ahora state.classes
  const unassignedClasses = state.classes.filter(c => !c.teacher_id);
  atClassSel.innerHTML = unassignedClasses.length
    ? unassignedClasses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')
    : '<option value="">No hay clases sin profesor</option>';

  // Render clases del profesor seleccionado
  const renderTeacherClasses = () => {
    if(atMsg) atMsg.textContent = '';
    const tid = Number(atTeacherSel.value);
    const rows = state.classes
      .filter(c => c.teacher_id === tid)
      .map(c => {
        const careerName = state.careers.find(x => x.id === c.career_id)?.name || '-';
        const avg = c.average_grade != null ? Number(c.average_grade).toFixed(2) : '-';
        return `<tr>
          <td>${c.name}</td>
          <td>${careerName}</td>
          <td>${c.period || '-'}</td>
          <td>${avg}</td>
        </tr>`;
      }).join('');
    if(teacherClassesTable) teacherClassesTable.innerHTML = rows || '<tr><td colspan="4">Sin clases asignadas</td></tr>';
  };

  renderTeacherClasses();
  atTeacherSel.onchange = renderTeacherClasses;
  
  // El submit de asignación sigue siendo local hasta migrar Clases
  // ... (se mantiene el existente en memoria si no lo sobreescribimos, pero mejor re-attach)
  const assignForm = byId('assignTeacherToClassForm');
  if(assignForm) {
      assignForm.onsubmit = (e) => {
        e.preventDefault();
        const tid = Number(atTeacherSel.value);
        const cid = Number(atClassSel.value);
        if(!tid || !cid) return;
        
        // Simular asignacion local
        const cl = state.classes.find(c => c.id === cid);
        if(cl) {
            cl.teacher_id = tid;
            alert('Asignación guardada (localmente - Clases pendiente de migrar)');
            renderAdminClasses(); // Update clases view
            refreshAssignmentSection(teachers); // Update this view
        }
      };
  }
}

// Admin Classes
async function renderAdminClasses() {
  const tbodyCareer = byId('classesByCareerTable');
  tbodyCareer.innerHTML = '<tr><td colspan="2">Cargando...</td></tr>';

  let classes = [];
  try {
    const res = await fetch('/api/classes');
    if (res.ok) {
      classes = await res.json();
      state.classes = classes; // Sync local
    }
  } catch (error) { console.error(error); }

  // Clases por carrera
  const byCareer = state.careers.map(c => {
    const count = classes.filter(cl => cl.career_id === c.id).length;
    return { name: c.name, count };
  });
  tbodyCareer.innerHTML = byCareer.map(x => `<tr><td>${x.name}</td><td>${x.count}</td></tr>`).join('');

  // Formulario para agregar clase
  const clCareerSel = byId('clCareer');
  const clTeacherAddSel = byId('clTeacherAdd');
  clCareerSel.innerHTML = state.careers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  clTeacherAddSel.innerHTML = '<option value="">Sin profesor</option>' + state.teachers
    .filter(t => t.active !== false)
    .map(t => `<option value="${t.id}">${t.full_name}</option>`)
    .join('');

  byId('addClassForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = byId('clName').value.trim();
    const career_id = Number(byId('clCareer').value);
    const period = byId('clPeriod').value.trim();
    const teacher_id_raw = byId('clTeacherAdd').value;
    const teacher_id = teacher_id_raw ? Number(teacher_id_raw) : null;
    
    if (!name || !career_id || !period) return;

    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, career_id, teacher_id, period })
      });

      if (res.ok) {
        alert('Clase agregada correctamente');
        byId('addClassForm').reset();
        renderAdminClasses();
      } else {
        alert('Error al guardar clase');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  // Listado de clases en tabla
  const ctbody = byId('classesTable');
  ctbody.innerHTML = classes.map(cl => {
    const careerName = state.careers.find(c => c.id === cl.career_id)?.name || '-';
    const teacherName = cl.teacher_name || 'Sin asignar';
    const avg = cl.average_grade != null ? Number(cl.average_grade).toFixed(2) : '-';
    return `<tr>
      <td>${cl.name}</td>
      <td>${careerName}</td>
      <td>${teacherName}</td>
      <td>${cl.period || '-'}</td>
      <td>${avg}</td>
    </tr>`;
  }).join('');
}

// Admin Reports
function renderAdminReports() {
  const repClassSel = byId('repClassSel');
  if (repClassSel) repClassSel.innerHTML = state.classes.map(cl => `<option value="${cl.id}">${cl.name}</option>`).join('');
  const repEvalInput = byId('repEvalInput');
  if (repEvalInput) repEvalInput.value = 'Final';
  const btnBuild = byId('btnBuildGrades');
  if (btnBuild) btnBuild.onclick = () => {
    const class_id = Number(repClassSel.value);
    const evaluation = (repEvalInput.value || 'Final').trim();
    buildGradesReportPreview(class_id, evaluation);
    const btnPdf = byId('btnPdfFromPreview'); if (btnPdf) btnPdf.disabled = false;
  };
  const btnPdf = byId('btnPdfFromPreview');
  if (btnPdf) btnPdf.onclick = () => {
    const class_id = Number(repClassSel.value);
    const evaluation = (repEvalInput.value || 'Final').trim();
    generateGradesReportPdf(class_id, evaluation);
  };
}

function buildGradesReportPreview(class_id, evaluation) {
  const cont = byId('repPreview'); if (!cont) return;
  const cl = state.classes.find(c => c.id === class_id);
  const teacher = state.teachers.find(t => t.id === cl?.teacher_id)?.full_name || '-';
  const sids = state.class_students.filter(cs => cs.class_id === class_id).map(cs => cs.student_id);
  const data = sids.map(id => {
    const st = state.students.find(s => s.id === id);
    const g = state.grades.find(x => x.class_id === class_id && x.student_id === id && x.evaluation === evaluation)?.grade;
    return { name: st?.full_name || '-', grade: g === undefined || g === '' ? null : Number(g) };
  });
  const vals = data.map(d => d.grade ?? 0);
  const avg = vals.length ? (vals.reduce((a,b)=>a+Number(b),0)/vals.length) : 0;
  const min = vals.length ? Math.min(...vals) : 0;
  const max = vals.length ? Math.max(...vals) : 0;
  const fails = vals.filter(v => Number(v) === 0).length;
  const rows = data.map(d => `<tr><td>${d.name}</td><td>${d.grade ?? '-'}</td></tr>`).join('');
  cont.innerHTML = `
    <h3>Vista previa del reporte de calificaciones</h3>
    <div><b>Clase:</b> ${cl?.name || '-'} &nbsp; <b>Evaluación:</b> ${evaluation} &nbsp; <b>Profesor:</b> ${teacher}</div>
    <div class="grid two" style="margin-top:8px">
      <div>
        <table class="table"><thead><tr><th>Alumno</th><th>Calificación</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td>Promedio</td><td>${avg.toFixed(2)}</td></tr></tfoot></table>
      </div>
      <div>
        <canvas id="gradesChart" width="600" height="240"></canvas>
        <div class="muted" style="margin-top:6px">Min: ${min} &nbsp; Max: ${max} &nbsp; Reprobados (0): ${fails}</div>
      </div>
    </div>
  `;
  const cvs = byId('gradesChart');
  if (cvs) drawGradesChart(cvs, data.map(d=>d.name.split(' ')[0]), vals);
}

function drawGradesChart(canvas, labels, values) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);
  const pad = 30; const axisY = H-pad; const axisX = pad; const maxV = 100;
  ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(axisX, pad); ctx.lineTo(axisX, axisY); ctx.lineTo(W-pad, axisY); ctx.stroke();
  const n = values.length; if (!n) return;
  const barW = (W - pad*2) / n * 0.7; const gap = (W - pad*2) / n * 0.3;
  values.forEach((v, i) => {
    const x = axisX + i*(barW+gap) + gap/2;
    const h = Math.max(0, Math.min(maxV, Number(v))) / maxV * (axisY - pad);
    ctx.fillStyle = Number(v) >= 70 ? '#2a9d8f' : '#e76f51';
    ctx.fillRect(x, axisY - h, barW, h);
    ctx.fillStyle = '#555'; ctx.font = '10px Arial'; ctx.fillText(labels[i]||'', x, axisY+12);
  });
}

function generateGradesReportPdf(class_id, evaluation) {
  const cl = state.classes.find(c => c.id === class_id);
  const teacher = state.teachers.find(t => t.id === cl?.teacher_id)?.full_name || '-';
  const sids = state.class_students.filter(cs => cs.class_id === class_id).map(cs => cs.student_id);
  const data = sids.map(id => {
    const st = state.students.find(s => s.id === id);
    const g = state.grades.find(x => x.class_id === class_id && x.student_id === id && x.evaluation === evaluation)?.grade;
    return { name: st?.full_name || '-', grade: g === undefined || g === '' ? '-' : Number(g) };
  });
  const vals = data.map(d => d.grade === '-' ? 0 : Number(d.grade));
  const avg = vals.length ? (vals.reduce((a,b)=>a+Number(b),0)/vals.length).toFixed(2) : '-';
  const min = vals.length ? Math.min(...vals) : '-';
  const max = vals.length ? Math.max(...vals) : '-';
  const fails = vals.filter(v => Number(v) === 0).length;
  const rows = data.map(d => `<tr><td>${d.name}</td><td>${d.grade}</td></tr>`).join('');
  const cvs = byId('gradesChart');
  const img = cvs ? `<img src="${cvs.toDataURL()}" style="width:100%;max-width:700px;height:auto" />` : '';
  const content = `
    <h2>Reporte de Calificaciones</h2>
    <small>Fecha: ${new Date().toLocaleString('es-MX')}</small>
    <div><b>Clase:</b> ${cl?.name || '-'} &nbsp; <b>Evaluación:</b> ${evaluation} &nbsp; <b>Profesor:</b> ${teacher}</div>
    <table><thead><tr><th>Alumno</th><th>Calificación</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td>Promedio</td><td>${avg}</td></tr></tfoot></table>
    <h3>Gráfica</h3>
    ${img}
    <div>Min: ${min} &nbsp; Max: ${max} &nbsp; Reprobados (0): ${fails}</div>
  `;
  openPrintWindow('Calificaciones', content);
}

function openPrintWindow(title, contentHtml) {
  const styles = 'body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111}h1,h2,h3{margin:0 0 8px}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #444;padding:6px;text-align:left}tfoot td{font-weight:bold}small{color:#555}';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>${styles}</style></head><body onload="window.print()">${contentHtml}</body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); }
}

// Teacher Home
async function renderTeacherHome() {
  const teacherId = sessionStorage.getItem('userId');
  
  try {
    const res = await fetch('/api/classes');
    if (res.ok) {
      const allClasses = await res.json();
      const teacherClasses = allClasses.filter(cl => cl.teacher_id == teacherId);
      byId('teacherClassCount').textContent = teacherClasses.length;
    }
  } catch (err) { console.error(err); }

  const ulP = byId('pendingTopics');
  ulP.innerHTML = [
    'Repasar conceptos de programación funcional',
    'Entrega de proyecto parcial',
  ].map(t => `<li>${t}</li>`).join('');

  const ulA = byId('teacherActivities');
  ulA.innerHTML = '';
  // Actividades pueden seguir siendo locales o mixtas, por ahora solo limpiar si no hay backend de logs
}

// Teacher Students - Attendance
async function renderTeacherStudents() {
  const teacherId = sessionStorage.getItem('userId');
  const classSel = byId('attClass');
  const attTable = byId('attendanceTable');
  const attMsg = byId('attMsg');

  // Load teacher classes from backend
  try {
    const res = await fetch('/api/classes'); 
    if (res.ok) {
      const allClasses = await res.json();
      const teacherClasses = allClasses.filter(cl => cl.teacher_id == teacherId);
      classSel.innerHTML = teacherClasses.map(cl => `<option value="${cl.id}">${cl.name}</option>`).join('');
    }
  } catch (err) { console.error('Error cargando clases del maestro:', err); }

  byId('attDate').value = new Date().toISOString().slice(0, 10);

  byId('attLoad').onclick = async () => {
    const class_id = Number(classSel.value);
    const date = byId('attDate').value;
    if (!class_id || !date) return;
    
    attMsg.textContent = 'Cargando...';
    attTable.innerHTML = '';

    try {
      // 1. Get students in class
      const stRes = await fetch(`/api/classes/${class_id}/students`);
      if (!stRes.ok) throw new Error('Error al cargar alumnos');
      const students = await stRes.json();

      // 2. Get existing attendance for this date
      const attRes = await fetch(`/api/attendance/${class_id}/${date}`);
      const existingAtt = attRes.ok ? await attRes.json() : [];

      const rows = students.map(st => {
        const attRecord = existingAtt.find(a => a.student_id === st.id);
        const status = attRecord ? attRecord.status : 'absent';
        return `<tr>
          <td>${st.full_name}</td>
          <td>
            <select data-att="${st.id}">
              <option value="present" ${status === 'present' ? 'selected' : ''}>Presente</option>
              <option value="absent" ${status === 'absent' ? 'selected' : ''}>Ausente</option>
            </select>
          </td>
        </tr>`;
      }).join('');

      attTable.innerHTML = rows || '<tr><td colspan="2">No hay alumnos inscritos en esta clase.</td></tr>';
      attMsg.textContent = '';

    } catch (err) {
      console.error(err);
      attMsg.textContent = 'Error al cargar lista.';
    }
  };

  // Guardar asistencias
  byId('attSave').onclick = async () => {
    const class_id = Number(classSel.value);
    const date = byId('attDate').value;
    const teacher_id = Number(sessionStorage.getItem('userId'));
    const selects = attTable.querySelectorAll('select[data-att]');
    
    if (!class_id || !date || !selects.length) {
      attMsg.textContent = 'Primero cargue la lista de alumnos.';
      return;
    }

    const records = Array.from(selects).map(sel => ({
      student_id: Number(sel.getAttribute('data-att')),
      status: sel.value
    }));

    attMsg.textContent = 'Guardando...';
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id, date, records, teacher_id })
      });

      if (res.ok) {
        attMsg.textContent = 'Asistencia guardada con éxito.';
      } else {
        const data = await res.json();
        attMsg.textContent = 'Error: ' + (data.error || 'No se pudo guardar');
      }
    } catch (err) {
      console.error(err);
      attMsg.textContent = 'Error de conexión.';
    }
  };
}

// Teacher Grades
function renderTeacherGrades() {
  const teacherId = session.teacherId;
  const teacherClasses = state.classes.filter(cl => cl.teacher_id === teacherId);
  const classSel = byId('grClass');
  classSel.innerHTML = teacherClasses.map(cl => `<option value="${cl.id}">${cl.name}</option>`).join('');
  byId('grEval').value = 'Final';

  byId('grLoad').onclick = () => {
    const class_id = Number(byId('grClass').value);
    const evaluation = byId('grEval').value.trim() || 'Final';
    const studentsInClass = state.class_students.filter(cs => cs.class_id === class_id).map(cs => cs.student_id);
    const rows = studentsInClass.map(sid => {
      const st = state.students.find(s => s.id === sid);
      const existing = state.grades.find(g => g.class_id === class_id && g.student_id === sid && g.evaluation === evaluation)?.grade || '';
      return `<tr>
        <td>${st?.full_name}</td>
        <td><input type="number" min="0" max="100" step="1" data-grade="${sid}" value="${existing}"></td>
      </tr>`;
    }).join('');
    byId('gradesTable').innerHTML = rows;

    byId('gradesTable').querySelectorAll('input[data-grade]').forEach(inp => {
      inp.addEventListener('change', () => {
        const student_id = Number(inp.getAttribute('data-grade'));
        let grade = Number(inp.value);
        if (isNaN(grade) || grade < 0) return;
        if (grade > 100) { grade = 100; inp.value = 100; }
        if (grade < 70) { grade = 0; inp.value = 0; }
        const existing = state.grades.find(g => g.class_id === class_id && g.student_id === student_id && g.evaluation === evaluation);
        if (existing) {
          existing.grade = grade;
        } else {
          const id = state.grades.length ? Math.max(...state.grades.map(x => x.id || 0)) + 1 : 1;
          state.grades.push({ id, class_id, student_id, evaluation, grade, recorded_by_teacher_id: 1 });
        }
      });
    });
  };

  // Guardar cambios y recalcular promedio del salón
  byId('grSave').onclick = () => {
    const class_id = Number(byId('grClass').value);
    const evaluation = byId('grEval').value.trim() || 'Final';
    const inputs = byId('gradesTable').querySelectorAll('input[data-grade]');
    let updated = 0;
    inputs.forEach(inp => {
      const student_id = Number(inp.getAttribute('data-grade'));
      const val = inp.value;
      if (val === '') return; // ignora vacíos
      let grade = Number(val);
      if (isNaN(grade) || grade < 0) return;
      if (grade > 100) grade = 100;
      if (grade < 70) grade = 0;
      const existing = state.grades.find(g => g.class_id === class_id && g.student_id === student_id && g.evaluation === evaluation);
      if (existing) {
        existing.grade = grade;
      } else {
        const id = state.grades.length ? Math.max(...state.grades.map(x => x.id || 0)) + 1 : 1;
        state.grades.push({ id, class_id, student_id, evaluation, grade, recorded_by_teacher_id: 1 });
      }
      updated++;
    });

    // Recalcular promedio para la clase en la evaluación seleccionada
    const gradesForClassEval = state.grades.filter(g => g.class_id === class_id && g.evaluation === evaluation);
    if (gradesForClassEval.length) {
      const avg = gradesForClassEval.reduce((acc, g) => acc + Number(g.grade), 0) / gradesForClassEval.length;
      const cl = state.classes.find(c => c.id === class_id);
      if (cl) cl.average_grade = Number(avg.toFixed(2));
    }

    // Mensaje y actividad
    byId('grMsg').textContent = updated ? `Se guardaron ${updated} calificación(es) para "${evaluation}".` : 'No hubo cambios para guardar.';
    state.activities.push({ id: state.activities.length + 1, type: 'Calificaciones', description: `Actualizadas (${evaluation}) en clase ${class_id}`, actor_role: 'maestro', actor_name: 'Maestro' });
    persist();
    renderAdminHome(); // actualiza promedio visible en panel admin
  };
}

// Student Dashboard
async function renderStudentHome() {
  const name = session.userName;
  const sid = session.studentId;
  byId('studentWelcomeName').textContent = name;

  if (!sid) return;

  try {
    // 1. Materias inscritas
    const clRes = await fetch(`/api/classes/student/${sid}`);
    const classes = clRes.ok ? await clRes.json() : [];
    byId('studentSubjectCount').textContent = classes.length;

    // 2. Promedio general (desde grades)
    const grRes = await fetch(`/api/grades/student/${sid}`);
    const grades = grRes.ok ? await grRes.json() : [];
    if (grades.length) {
      const avg = grades.reduce((acc, curr) => acc + Number(curr.grade), 0) / grades.length;
      byId('studentOverallAvg').textContent = avg.toFixed(2);
    } else {
      byId('studentOverallAvg').textContent = '-';
    }
  } catch (err) { console.error(err); }
}

async function renderStudentAcademics() {
  const sid = session.studentId;
  const tbody = byId('studentGradesTable');
  tbody.innerHTML = '<tr><td colspan="4">Cargando datos...</td></tr>';

  try {
    // 1. Obtener todas las inscripciones (clases en las que está el alumno)
    const enRes = await fetch(`/api/classes/student/${sid}`);
    const enrollments = enRes.ok ? await enRes.json() : [];

    // 2. Obtener todas las calificaciones del alumno
    const grRes = await fetch(`/api/grades/student/${sid}`);
    const grades = grRes.ok ? await grRes.json() : [];

    if (enrollments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No estás inscrito en ninguna clase aún.</td></tr>';
      return;
    }

    // 3. Unir datos: mostrar todas las clases inscritas y poner su calificación si existe
    tbody.innerHTML = enrollments.map(en => {
      const g = grades.find(x => x.class_id === en.id);
      const gradeVal = g ? g.grade : '-';
      const gradeClass = g ? (Number(g.grade) >= 70 ? 'success' : 'error') : '';

      return `
        <tr>
          <td>${en.name}</td>
          <td>${en.teacher_name || 'Sin asignar'}</td>
          <td>${en.period || '-'}</td>
          <td class="bold ${gradeClass}">${gradeVal}</td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="4" class="error">Error al cargar datos académicos.</td></tr>';
  }
}

async function renderStudentSchedule() {
  const sid = session.studentId;
  const cont = byId('studentScheduleContent');
  cont.innerHTML = '<p class="muted">Cargando horario...</p>';

  try {
    const res = await fetch(`/api/schedules/student/${sid}`);
    if (res.ok) {
      const schedule = await res.json();
      if (schedule.length === 0) {
        cont.innerHTML = '<p class="muted">Aún no tienes horarios registrados para tus clases.</p>';
        return;
      }

      cont.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Materia</th>
              <th>Profesor</th>
              <th>Horario</th>
              <th>Aula</th>
            </tr>
          </thead>
          <tbody>
            ${schedule.map(s => `
              <tr>
                <td class="bold">${s.day_of_week}</td>
                <td>${s.class_name}</td>
                <td>${s.teacher_name || '-'}</td>
                <td>${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}</td>
                <td>${s.classroom || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  } catch (err) { console.error(err); }
}
function loadPersisted() {
  const raw = localStorage.getItem('app_state');
  if (raw) {
    try {
      const s = JSON.parse(raw);
      Object.assign(state, s);
    } catch {}
  }
}

window.addEventListener('beforeunload', persist);

// Inicialización
loadPersisted();
renderApp();
