export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (pass) => pass.length >= 6;

export const validateRegistration = (formData) => {
  if (!formData.nombre || !formData.usuarioEmail || !formData.contrasena) {
    return 'Por favor completa todos los campos';
  }
  if (!validateEmail(formData.usuarioEmail)) {
    return 'Email no válido';
  }
  if (formData.contrasena !== formData.confirmarContrasena) {
    return 'Las contraseñas no coinciden';
  }
  return null;
};