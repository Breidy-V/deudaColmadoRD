import { useState } from 'react';
import './login.css';
import { api } from '../services/api';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    usuarioEmail: '',
    contrasena: '',
    confirmarContrasena: '',
    nombre: '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const esEmailValido = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const esContrasenaValida = (contrasena) => {
    return contrasena.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    if (!formData.usuarioEmail || !formData.contrasena) {
      setError('Por favor completa todos los campos');
      setCargando(false);
      return;
    }

    try {
      const response = await api.auth.login(formData.usuarioEmail, formData.contrasena);

      if (response.token) {
        const userData = {
          id: response.id,
          usuario: formData.usuarioEmail,
          nombre: response.name || formData.usuarioEmail,
          rol: response.rol || 'USER',
          token: response.token,
        };

        localStorage.setItem('usuarioFiadoRD', JSON.stringify(userData));
        onLogin(userData);
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }

    setCargando(false);
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    if (!formData.nombre || !formData.usuarioEmail || !formData.contrasena || !formData.confirmarContrasena) {
      setError('Por favor completa todos los campos');
      setCargando(false);
      return;
    }

    if (!esEmailValido(formData.usuarioEmail)) {
      setError('Por favor ingresa un email válido');
      setCargando(false);
      return;
    }

    if (!esContrasenaValida(formData.contrasena)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    try {
      const response = await api.users.create(
        formData.nombre,
        formData.usuarioEmail,
        formData.contrasena
      );

      setError('');
      setFormData({
        usuarioEmail: '',
        contrasena: '',
        confirmarContrasena: '',
        nombre: '',
      });

      alert('Cuenta creada exitosamente. Por favor, inicia sesión.');
      setIsLogin(true);
    } catch (err) {
      setError(err.message || 'Error al registrar');
    }

    setCargando(false);
  };

  const handleGoogleLogin = () => {
    alert('Google OAuth será implementado en la siguiente fase.\nContacta con el equipo de backend.');
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <div className="login-logo">
          <span aria-hidden="true">🏪</span>
          <h1>FiadoRD</h1>
        </div>
        <p className="login-subtitle">Gestión de Colmados</p>
      </header>

      <div className="login-content">
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

        {isLogin ? (
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Bienvenido</h2>
            <p className="form-subtitle">Ingresa tus credenciales para continuar</p>

            {error && <div className="error-message" role="alert">{error}</div>}

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
              />
            </div>

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
              />
            </div>

            <button type="submit" className="btn-login" disabled={cargando}>
              {cargando ? 'Cargando...' : 'Iniciar Sesión'}
            </button>

            <div className="divider">O continúa con</div>

            <button type="button" className="btn-google" onClick={handleGoogleLogin}>
              <span aria-hidden="true">🔐</span> Google
            </button>

            <p className="nota-admin">
              <strong>Cuenta ADMIN de prueba:</strong> Usuario: <code>ADMIN</code>, Contraseña: <code>admin1234</code>
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegistro}>
            <h2>Crear Cuenta</h2>
            <p className="form-subtitle">Registrate como dueño de negocio (USER)</p>

            {error && <div className="error-message" role="alert">{error}</div>}

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
              />
            </div>

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
              />
            </div>

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
              />
            </div>

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
              />
            </div>

            <button type="submit" className="btn-login" disabled={cargando}>
              {cargando ? 'Cargando...' : 'Crear Cuenta'}
            </button>

            <div className="divider">O registrate con</div>

            <button type="button" className="btn-google" onClick={handleGoogleLogin}>
              <span aria-hidden="true">🔐</span> Google
            </button>
          </form>
        )}
      </div>

      <footer className="login-footer">
        <p>&copy; 2026 FiadoRD - Gestión de Colmados</p>
      </footer>
    </div>
  );
}

export default Login;