function validatePasswordPolicy(password) {
  const value = password || '';
  return {
    minLength: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    special: /[^A-Za-z0-9]/.test(value)
  };
}

function isPasswordPolicyValid(password) {
  const checks = validatePasswordPolicy(password);
  return checks.minLength && checks.uppercase && checks.special;
}

function setupPasswordToggle(inputId, buttonId) {
  const input = byId(inputId);
  const button = byId(buttonId);
  if (!input || !button) return;

  button.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.textContent = isPassword ? '🙈' : '👁';
    button.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });
}

function bindPasswordPolicyFeedback(passwordInputId, feedbackId) {
  const input = byId(passwordInputId);
  const feedback = byId(feedbackId);
  if (!input || !feedback) return;

  const render = () => {
    const checks = validatePasswordPolicy(input.value);
    const okClass = 'feedback-ok';
    const badClass = 'feedback-bad';

    feedback.innerHTML = `
      <div class="${checks.minLength ? okClass : badClass}">Mínimo 8 caracteres</div>
      <div class="${checks.uppercase ? okClass : badClass}">Al menos una mayúscula</div>
      <div class="${checks.special ? okClass : badClass}">Al menos un carácter especial</div>
    `;
  };

  input.addEventListener('input', render);
  render();
}

function bindPasswordConfirmation(passwordId, confirmId, feedbackId) {
  const passwordInput = byId(passwordId);
  const confirmInput = byId(confirmId);
  const feedback = byId(feedbackId);
  if (!passwordInput || !confirmInput || !feedback) return;

  const render = () => {
    if (!confirmInput.value) {
      feedback.textContent = '';
      feedback.className = 'password-feedback';
      return;
    }
    const match = passwordInput.value === confirmInput.value;
    feedback.textContent = match ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden';
    feedback.className = match ? 'password-feedback feedback-ok' : 'password-feedback feedback-bad';
  };

  passwordInput.addEventListener('input', render);
  confirmInput.addEventListener('input', render);
  render();
}

function buildLoginFeedback(data) {
  if (data && data.username_correct === true && data.password_correct === false) {
    return 'Usuario correcto. Contraseña incorrecta.';
  }
  if (data && data.username_correct === false) {
    return 'Usuario incorrecto. Contraseña incorrecta.';
  }
  if (data && data.username_correct === true && data.password_correct === true) {
    return 'Usuario y contraseña correctos.';
  }
  return (data && data.error) || 'No se pudo iniciar sesión.';
}
