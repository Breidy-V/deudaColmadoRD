import { useState } from 'react';
import './login.css';

function Login({ onLogin }) {
  // ==========================================
  // ESTADO DEL COMPONENTE LOGIN
  // ==========================================
  const [isLogin, setIsLogin] = useState(true); // Alterna entre Login y Registro
  const [formData, setFormData] = useState({
    usuarioEmail: '',
    contrasena: '',
    confirmarContrasena: '',
    nombre: '', // Solo para registro
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // ==========================================
  // MANEJO DE CAMBIOS EN LOS INPUTS
  // ==========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Limpiar errores al escribir
  };

  // ==========================================
  // VALIDACIONES BÁSICAS
  // ==========================================
  const esEmailValido = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const esContrasenaValida = (contrasena) => {
    // Mínimo 6 caracteres (placeholder - mejorar después)
    return contrasena.length >= 6;
  };

  // ==========================================
  // MANEJO DE LOGIN
  // ==========================================
  const handleLogin = (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    // CREDENCIAL HARDCODEADA PARA ADMIN (PLACEHOLDER)
    const ADMIN_USER = 'ADMIN';
    const ADMIN_PASS = 'admin1234';

    // Validaciones
    if (!formData.usuarioEmail || !formData.contrasena) {
      setError('Por favor completa todos los campos');
      setCargando(false);
      return;
    }

    // Verificar si es Admin
    if (
      (formData.usuarioEmail === ADMIN_USER ||
        esEmailValido(formData.usuarioEmail)) &&
      formData.contrasena === ADMIN_PASS &&
      formData.usuarioEmail === ADMIN_USER
    ) {
      // LOGIN EXITOSO - ADMIN
      onLogin({
        id: 'admin-001',
        usuario: ADMIN_USER,
        nombre: 'Administrador',
        rol: 'ADMIN',
      });
    } else {
      // PLACEHOLDER: Aquí iría la conexión a BD para verificar USER
      // Por ahora aceptamos cualquier usuario con contraseña >= 6 caracteres
      // para poder testear el flujo de USER
      if (esContrasenaValida(formData.contrasena)) {
        // LOGIN EXITOSO - USER
        onLogin({
          id: `user-${Date.now()}`,
          usuario: formData.usuarioEmail,
          nombre: formData.usuarioEmail.split('@')[0],
          rol: 'USER',
        });
      } else {
        setError('Credenciales inválidas');
      }
    }

    setCargando(false);
  };

  // ==========================================
  // MANEJO DE REGISTRO
  // ==========================================
  const handleRegistro = (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    // Validaciones
    if (
      !formData.nombre ||
      !formData.usuarioEmail ||
      !formData.contrasena ||
      !formData.confirmarContrasena
    ) {
      setError('Por favor completa todos los campos');
      setCargando(false);
      return;
    }

    // Validar que sea email válido (USER siempre usa email)
    if (!esEmailValido(formData.usuarioEmail)) {
      setError('Por favor ingresa un email válido');
      setCargando(false);
      return;
    }

    // Validar contraseña
    if (!esContrasenaValida(formData.contrasena)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    // PLACEHOLDER: Aquí iría la conexión a BD para crear nuevo USER
    // Por ahora solo simulamos el registro exitoso
    alert(
      `Usuario registrado exitosamente: ${formData.nombre}\nEmail: ${formData.usuarioEmail}`
    );

    // Limpiar formulario y volver a login
    setFormData({
      usuarioEmail: '',
      contrasena: '',
      confirmarContrasena: '',
      nombre: '',
    });
    setIsLogin(true);
    setCargando(false);
  };

  // ==========================================
  // MANEJO DE GOOGLE OAUTH (PLACEHOLDER)
  // ==========================================
  const handleGoogleLogin = () => {
    // TODO: Implementar Google OAuth después
    // 1. Instalar: npm install @react-oauth/google
    // 2. Configurar credenciales en Google Cloud Console
    // 3. Enviar token a backend para validación
    // 4. Backend retorna usuario si existe, o crea nuevo USER
    alert(
      'Google OAuth será implementado en la siguiente fase.\nContacta con el equipo de backend.'
    );
  };

  // ==========================================
  // RENDERIZADO
  // ==========================================
  return (
    <div className="login-container">
      {/* Header del login */}
      <header className="login-header">
        <div className="login-logo">
          <span aria-hidden="true">🏪</span>
          <h1>FiadoRD</h1>
        </div>
        <p className="login-subtitle">Gestión de Colmados</p>
      </header>

      {/* Formulario principal */}
      <div className="login-content">
        {/* Tabs para cambiar entre Login/Registro */}
        <div className="login-tabs">
          <button
            className={`tab-btn ${isLogin ? 'activo' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setFormData({
                usuarioEmail: '',
                contrasena: '',
                confirmarContrasena: '',
                nombre: '',
              });
            }}
            aria-label="Cambiar a pestaña de login"
          >
            Iniciar Sesión
          </button>
          <button
            className={`tab-btn ${!isLogin ? 'activo' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              setFormData({
                usuarioEmail: '',
                contrasena: '',
                confirmarContrasena: '',
                nombre: '',
              });
            }}
            aria-label="Cambiar a pestaña de registro"
          >
            Registrarse
          </button>
        </div>

        {/* FORMULARIO DE LOGIN */}
        {isLogin ? (
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Bienvenido</h2>
            <p className="form-subtitle">Ingresa tus credenciales para continuar</p>

            {/* Mensaje de error */}
            {error && <div className="error-message" role="alert">{error}</div>}

            {/* Input usuario/email */}
            <div className="form-group">
              <label htmlFor="usuarioEmail-login">Usuario o Email</label>
              <input
                id="usuarioEmail-login"
                type="text"
                name="usuarioEmail"
                placeholder="Tu usuario o correo electrónico"
                value={formData.usuarioEmail}
                onChange={handleInputChange}
                required
                aria-label="Usuario o correo electrónico"
              />
            </div>

            {/* Input contraseña */}
            <div className="form-group">
              <label htmlFor="contrasena-login">Contraseña</label>
              <input
                id="contrasena-login"
                type="password"
                name="contrasena"
                placeholder="Tu contraseña"
                value={formData.contrasena}
                onChange={handleInputChange}
                required
                aria-label="Contraseña"
              />
            </div>

            {/* Botón login */}
            <button
              type="submit"
              className="btn-login"
              disabled={cargando}
              aria-busy={cargando}
            >
              {cargando ? 'Cargando...' : 'Iniciar Sesión'}
            </button>

            {/* Divisor */}
            <div className="divider">O continúa con</div>

            {/* Botón Google OAuth */}
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleLogin}
              aria-label="Iniciar sesión con Google"
            >
              <span aria-hidden="true">🔐</span> Google
            </button>

            {/* Nota para ADMIN */}
            <p className="nota-admin">
              <strong>Cuenta ADMIN de prueba:</strong> Usuario: <code>ADMIN</code>, Contraseña: <code>admin1234</code>
            </p>
          </form>
        ) : (
          /* FORMULARIO DE REGISTRO */
          <form className="login-form" onSubmit={handleRegistro}>
            <h2>Crear Cuenta</h2>
            <p className="form-subtitle">
              Registrate como dueño de negocio (USER)
            </p>

            {/* Mensaje de error */}
            {error && <div className="error-message" role="alert">{error}</div>}

            {/* Input nombre */}
            <div className="form-group">
              <label htmlFor="nombre-registro">Nombre Completo</label>
              <input
                id="nombre-registro"
                type="text"
                name="nombre"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                aria-label="Nombre completo"
              />
            </div>

            {/* Input email */}
            <div className="form-group">
              <label htmlFor="usuarioEmail-registro">Email</label>
              <input
                id="usuarioEmail-registro"
                type="email"
                name="usuarioEmail"
                placeholder="tu@email.com"
                value={formData.usuarioEmail}
                onChange={handleInputChange}
                required
                aria-label="Correo electrónico"
              />
            </div>

            {/* Input contraseña */}
            <div className="form-group">
              <label htmlFor="contrasena-registro">Contraseña</label>
              <input
                id="contrasena-registro"
                type="password"
                name="contrasena"
                placeholder="Mínimo 6 caracteres"
                value={formData.contrasena}
                onChange={handleInputChange}
                required
                aria-label="Contraseña"
              />
            </div>

            {/* Input confirmar contraseña */}
            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <input
                id="confirmarContrasena"
                type="password"
                name="confirmarContrasena"
                placeholder="Confirma tu contraseña"
                value={formData.confirmarContrasena}
                onChange={handleInputChange}
                required
                aria-label="Confirmar contraseña"
              />
            </div>

            {/* Botón registro */}
            <button
              type="submit"
              className="btn-login"
              disabled={cargando}
              aria-busy={cargando}
            >
              {cargando ? 'Cargando...' : 'Crear Cuenta'}
            </button>

            {/* Divisor */}
            <div className="divider">O registrate con</div>

            {/* Botón Google OAuth */}
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleLogin}
              aria-label="Registrarse con Google"
            >
              <span aria-hidden="true">🔐</span> Google
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p>&copy; 2026 FiadoRD - Gestión de Colmados</p>
      </footer>
    </div>
  );
}

export default Login;