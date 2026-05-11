// ========== LOGIN ALUMNO ==========

const loginForm = byId('loginForm');
const loginError = byId('loginError');
const registerForm = byId('registerForm');
const showRegisterBtn = byId('showRegisterBtn');
const cancelRegisterBtn = byId('cancelRegisterBtn');
const registerError = byId('registerError');

setupPasswordToggle('password', 'toggleLoginPassword');
setupPasswordToggle('regPassword', 'toggleRegPassword');
setupPasswordToggle('regConfirmPassword', 'toggleRegConfirmPassword');
bindPasswordPolicyFeedback('regPassword', 'regPasswordPolicy');
bindPasswordConfirmation('regPassword', 'regConfirmPassword', 'regPasswordMatch');

// Cargar carreras
async function loadCareers() {
  try {
    const res = await fetch('/api/careers');
    if (res.ok) {
      const careers = await res.json();
      const regCareer = byId('regCareer');
      if (regCareer) {
        regCareer.innerHTML = careers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      }
    }
  } catch (err) {
    console.error('Error cargando carreras:', err);
    // Usar valores por defecto si falla
    const regCareer = byId('regCareer');
    if (regCareer) {
      regCareer.innerHTML = `
        <option value="1">Ingeniería en Sistemas</option>
        <option value="2">Administración</option>
        <option value="3">Contaduría</option>
      `;
    }
  }
}

// Cargar carreras al iniciar
loadCareers();

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
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = byId('regUsername').value.trim();
    const password = byId('regPassword').value.trim();
    const first_name = byId('regFirstName').value.trim();
    const last_name = byId('regLastName').value.trim();
    const career_id = Number(byId('regCareer').value);
    const semester = Number(byId('regSemester').value) || 1;
    const confirmPassword = byId('regConfirmPassword').value.trim();

    if (!username || !password || !first_name || !last_name) {
      registerError.textContent = 'Todos los campos obligatorios deben llenarse';
      show(registerError);
      return;
    }

    if (!isPasswordPolicyValid(password)) {
      registerError.textContent = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un carácter especial.';
      show(registerError);
      return;
    }

    if (password !== confirmPassword) {
      registerError.textContent = 'Las contraseñas no coinciden.';
      show(registerError);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          password, 
          first_name, 
          last_name, 
          role: 'student',
          career_id,
          semester
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
      registerForm.reset();
    } catch (err) {
      console.error(err);
      registerError.textContent = 'Error de conexión con el servidor';
      show(registerError);
    }
  };
}

// Handler login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = byId('username').value.trim();
    const password = byId('password').value.trim();

    if (!username || !password) {
      loginError.textContent = 'Por favor completa todos los campos';
      show(loginError);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        loginError.textContent = buildLoginFeedback(data);
        show(loginError);
        return;
      }

      // Validar que sea alumno
      if (data.user.role !== 'student') {
        loginError.textContent = 'Esta cuenta no es de alumno';
        show(loginError);
        return;
      }

      // Login exitoso
      const { token, user } = data;

      alert(buildLoginFeedback(data));
      
      // Guardar sesión
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', user.role);
      sessionStorage.setItem('userId', user.id);
      sessionStorage.setItem('userName', `${user.first_name} ${user.last_name}`);
      sessionStorage.setItem('userFirstName', user.first_name);
      sessionStorage.setItem('userLastName', user.last_name);
      sessionStorage.setItem('studentId', user.studentId || user.id);

      hide(loginError);
      loginForm.reset();
      
      // Redirigir al dashboard de alumno
      window.location.href = 'dashboard-alumno.html';

    } catch (err) {
      console.error(err);
      loginError.textContent = 'Error de conexión con el servidor';
      show(loginError);
    }
  });
}
