// ========== LOGIN ADMINISTRADOR ==========

const loginForm = byId('loginForm');
const loginError = byId('loginError');

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

    // Para admin, validar que sea ADMINISTRADOR
    if (username.toUpperCase() !== 'ADMINISTRADOR') {
      loginError.textContent = 'Solo el administrador puede acceder por esta ruta';
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
        loginError.textContent = data.error || 'Error al iniciar sesión';
        show(loginError);
        return;
      }

      // Validar que sea admin
      if (data.user.role !== 'admin') {
        loginError.textContent = 'Esta cuenta no tiene permisos de administrador';
        show(loginError);
        return;
      }

      // Login exitoso
      const { token, user } = data;
      
      // Guardar sesión
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', user.role);
      sessionStorage.setItem('userId', user.id);
      sessionStorage.setItem('userName', `${user.first_name} ${user.last_name}`);
      sessionStorage.setItem('userFirstName', user.first_name);
      sessionStorage.setItem('userLastName', user.last_name);

      hide(loginError);
      loginForm.reset();
      
      // Redirigir al dashboard de admin
      window.location.href = 'dashboard-admin.html';

    } catch (err) {
      console.error(err);
      loginError.textContent = 'Error de conexión con el servidor';
      show(loginError);
    }
  });
}
