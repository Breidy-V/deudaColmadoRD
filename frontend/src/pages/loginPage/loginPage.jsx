import { useState, useEffect } from 'react';
import './loginPage.css';
import { api } from '../../services/api';
import { useAlert } from '../../components/Alert';

function LoginPage({ onLoginSuccess }) {
  const { success, error } = useAlert();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    usuarioEmail: '',
    contrasena: '',
    confirmarContrasena: '',
    nombre: '',
  });
  const [formError, setFormError] = useState('');
  const [cargando, setCargando] = useState(false);
  
  // Estados para validación en tiempo real y efectos visuales
  const [fieldErrors, setFieldErrors] = useState({
    usuarioEmail: '',
    contrasena: '',
    confirmarContrasena: '',
    nombre: ''
  });
  
  const [fieldValid, setFieldValid] = useState({
    usuarioEmail: false,
    contrasena: false,
    confirmarContrasena: false,
    nombre: false
  });
  
  const [shakeFields, setShakeFields] = useState({
    usuarioEmail: false,
    contrasena: false,
    confirmarContrasena: false
  });

  // Funciones de validación
  const esEmailValido = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const esContrasenaValida = (contrasena) => {
    return contrasena.length >= 6;
  };

  // Validación en tiempo real para LOGIN (solo verificar que no esté vacío)
  useEffect(() => {
    if (isLogin) {
      // Para login, solo validamos que no esté vacío (sin validación de email)
      if (formData.usuarioEmail && formData.usuarioEmail.trim() !== '') {
        setFieldErrors(prev => ({ ...prev, usuarioEmail: '' }));
        setFieldValid(prev => ({ ...prev, usuarioEmail: true }));
      } else {
        setFieldErrors(prev => ({ ...prev, usuarioEmail: '' }));
        setFieldValid(prev => ({ ...prev, usuarioEmail: false }));
      }
    } else {
      // Para registro, validamos formato de email
      if (formData.usuarioEmail) {
        if (!esEmailValido(formData.usuarioEmail)) {
          setFieldErrors(prev => ({ ...prev, usuarioEmail: 'Ingresa un email válido' }));
          setFieldValid(prev => ({ ...prev, usuarioEmail: false }));
        } else {
          setFieldErrors(prev => ({ ...prev, usuarioEmail: '' }));
          setFieldValid(prev => ({ ...prev, usuarioEmail: true }));
        }
      } else {
        setFieldErrors(prev => ({ ...prev, usuarioEmail: '' }));
        setFieldValid(prev => ({ ...prev, usuarioEmail: false }));
      }
    }
  }, [formData.usuarioEmail, isLogin]);

  useEffect(() => {
    if (formData.contrasena) {
      if (!esContrasenaValida(formData.contrasena)) {
        setFieldErrors(prev => ({ ...prev, contrasena: 'Mínimo 6 caracteres' }));
        setFieldValid(prev => ({ ...prev, contrasena: false }));
      } else {
        setFieldErrors(prev => ({ ...prev, contrasena: '' }));
        setFieldValid(prev => ({ ...prev, contrasena: true }));
      }
    } else {
      setFieldErrors(prev => ({ ...prev, contrasena: '' }));
      setFieldValid(prev => ({ ...prev, contrasena: false }));
    }
  }, [formData.contrasena]);

  useEffect(() => {
    if (!isLogin && formData.confirmarContrasena) {
      if (formData.contrasena !== formData.confirmarContrasena) {
        setFieldErrors(prev => ({ ...prev, confirmarContrasena: 'Las contraseñas no coinciden' }));
        setFieldValid(prev => ({ ...prev, confirmarContrasena: false }));
      } else {
        setFieldErrors(prev => ({ ...prev, confirmarContrasena: '' }));
        setFieldValid(prev => ({ ...prev, confirmarContrasena: true }));
      }
    }
  }, [formData.confirmarContrasena, formData.contrasena, isLogin]);

  useEffect(() => {
    if (!isLogin && formData.nombre) {
      if (formData.nombre.length < 3) {
        setFieldErrors(prev => ({ ...prev, nombre: 'Nombre muy corto (mínimo 3 caracteres)' }));
        setFieldValid(prev => ({ ...prev, nombre: false }));
      } else {
        setFieldErrors(prev => ({ ...prev, nombre: '' }));
        setFieldValid(prev => ({ ...prev, nombre: true }));
      }
    }
  }, [formData.nombre, isLogin]);

  // Función para activar el efecto shake
  const triggerShake = (field) => {
    setShakeFields(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShakeFields(prev => ({ ...prev, [field]: false }));
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setFormError('');

    if (!formData.usuarioEmail || !formData.contrasena) {
      setFormError('Por favor completa todos los campos');
      if (!formData.usuarioEmail) triggerShake('usuarioEmail');
      if (!formData.contrasena) triggerShake('contrasena');
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
        onLoginSuccess(userData);
      }
    } catch (err) {
      error(err.message || 'Error al iniciar sesión');
      triggerShake('usuarioEmail');
      triggerShake('contrasena');
    }

    setCargando(false);
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);
    setFormError('');

    if (!formData.nombre || !formData.usuarioEmail || !formData.contrasena || !formData.confirmarContrasena) {
      setFormError('Por favor completa todos los campos');
      setCargando(false);
      return;
    }

    if (!esEmailValido(formData.usuarioEmail)) {
      setFormError('Por favor ingresa un email válido');
      triggerShake('usuarioEmail');
      setCargando(false);
      return;
    }

    if (!esContrasenaValida(formData.contrasena)) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      triggerShake('contrasena');
      setCargando(false);
      return;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      setFormError('Las contraseñas no coinciden');
      triggerShake('confirmarContrasena');
      setCargando(false);
      return;
    }

    try {
      const response = await api.users.create(
        formData.nombre,
        formData.usuarioEmail,
        formData.contrasena
      );

      setFormError('');
      setFormData({
        usuarioEmail: '',
        contrasena: '',
        confirmarContrasena: '',
        nombre: '',
      });
      setFieldValid({
        usuarioEmail: false,
        contrasena: false,
        confirmarContrasena: false,
        nombre: false
      });

      success('Cuenta creada exitosamente. Por favor, inicia sesión.');
      setIsLogin(true);
    } catch (err) {
      error(err.message || 'Error al registrar');
    }

    setCargando(false);
  };

  const handleGoogleLogin = () => {
    alert('Google OAuth será implementado en la siguiente fase.\nContacta con el equipo de backend.');
  };

  // Helper para obtener la clase del input basado en validación
  const getInputClass = (fieldName, value) => {
    let classes = '';
    if (value && fieldValid[fieldName]) {
      classes = 'valid';
    } else if (value && fieldErrors[fieldName]) {
      classes = 'error';
    }
    if (shakeFields[fieldName]) {
      classes += ' error';
    }
    return classes;
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
        {isLogin ? (
          <form className="login-form" onSubmit={handleLogin} noValidate>
            {/* Tabs DENTRO del formulario */}
            <div className="login-tabs">
              <button
                type="button"
                className={`tab-btn ${isLogin ? 'activo' : ''}`}
                onClick={() => {
                  setIsLogin(true);
                  setFormError('');
                  setFormData({
                    usuarioEmail: '',
                    contrasena: '',
                    confirmarContrasena: '',
                    nombre: '',
                  });
                  setFieldErrors({
                    usuarioEmail: '',
                    contrasena: '',
                    confirmarContrasena: '',
                    nombre: ''
                  });
                  setFieldValid({
                    usuarioEmail: false,
                    contrasena: false,
                    confirmarContrasena: false,
                    nombre: false
                  });
                }}
                aria-label="Cambiar a pestaña de login"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className={`tab-btn ${!isLogin ? 'activo' : ''}`}
                onClick={() => {
                  setIsLogin(false);
                  setFormError('');
                  setFormData({
                    usuarioEmail: '',
                    contrasena: '',
                    confirmarContrasena: '',
                    nombre: '',
                  });
                  setFieldErrors({
                    usuarioEmail: '',
                    contrasena: '',
                    confirmarContrasena: '',
                    nombre: ''
                  });
                  setFieldValid({
                    usuarioEmail: false,
                    contrasena: false,
                    confirmarContrasena: false,
                    nombre: false
                  });
                }}
                aria-label="Cambiar a pestaña de registro"
              >
                Registrarse
              </button>
            </div>

            <h2>Bienvenido</h2>
            <p className="form-subtitle">Ingresa tus credenciales para continuar</p>

            {formError && <div className="error-message" role="alert">{formError}</div>}

            <div className="form-group">
              <label htmlFor="usuarioEmail-login">Usuario o Email</label>
              <div className="input-area">
                <input
                  id="usuarioEmail-login"
                  type="text"
                  name="usuarioEmail"
                  placeholder="Tu usuario o correo electrónico"
                  value={formData.usuarioEmail}
                  onChange={handleInputChange}
                  className={getInputClass('usuarioEmail', formData.usuarioEmail)}
                  required
                />
                <span className="input-icon">👤</span>
                <span className={`validation-icon ${formData.usuarioEmail && fieldValid.usuarioEmail ? 'visible success' : ''} ${formData.usuarioEmail && fieldErrors.usuarioEmail ? 'visible error' : ''}`}>
                  {fieldValid.usuarioEmail ? '✓' : fieldErrors.usuarioEmail ? '✗' : ''}
                </span>
              </div>
              {fieldErrors.usuarioEmail && formData.usuarioEmail && (
                <div className="field-error-txt">{fieldErrors.usuarioEmail}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contrasena-login">Contraseña</label>
              <div className="input-area">
                <input
                  id="contrasena-login"
                  type="password"
                  name="contrasena"
                  placeholder="Tu contraseña"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  className={getInputClass('contrasena', formData.contrasena)}
                  required
                />
                <span className="input-icon">🔒</span>
                <span className={`validation-icon ${formData.contrasena && fieldValid.contrasena ? 'visible success' : ''} ${formData.contrasena && fieldErrors.contrasena ? 'visible error' : ''}`}>
                  {fieldValid.contrasena ? '✓' : fieldErrors.contrasena ? '✗' : ''}
                </span>
              </div>
              {fieldErrors.contrasena && formData.contrasena && (
                <div className="field-error-txt">{fieldErrors.contrasena}</div>
              )}
            </div>

            <button type="submit" className="btn-login" disabled={cargando}>
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <div className="divider">
              <span>O continúa con</span>
            </div>

            <button type="button" className="btn-google" onClick={handleGoogleLogin}>
              <span aria-hidden="true">🔐</span> Google
            </button>

            <div className="nota-admin" onClick={() => {
              setFormData({
                ...formData,
                usuarioEmail: 'ADMIN',
                contrasena: 'admin1234'
              });
            }}>
              <strong>📋 Cuenta ADMIN de prueba:</strong> Usuario: <code>ADMIN</code>, Contraseña: <code>admin1234</code>
              <br />
              <small>(Haz clic aquí para autocompletar)</small>
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegistro} noValidate>
            {/* Tabs DENTRO del formulario */}
            <div className="login-tabs">
              <button
                type="button"
                className={`tab-btn ${isLogin ? 'activo' : ''}`}
                onClick={() => {
                  setIsLogin(true);
                  setFormError('');
                  setFormData({
                    usuarioEmail: '',
                    contrasena: '',
                    confirmarContrasena: '',
                    nombre: '',
                  });
                  setFieldErrors({
                    usuarioEmail: '',
                    contrasena: '',
                    confirmarContrasena: '',
                    nombre: ''
                  });
                  setFieldValid({
                    usuarioEmail: false,
                    contrasena: false,
                    confirmarContrasena: false,
                    nombre: false
                  });
                }}
                aria-label="Cambiar a pestaña de login"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className={`tab-btn ${!isLogin ? 'activo' : ''}`}
                onClick={() => {
                  setIsLogin(false);
                  setFormError('');
                  setFormData({
                    usuarioEmail: '',
                    contrasena: '',
                    confirmarContrasena: '',
                    nombre: '',
                  });
                  setFieldErrors({
                    usuarioEmail: '',
                    contrasena: '',
                    confirmarContrasena: '',
                    nombre: ''
                  });
                  setFieldValid({
                    usuarioEmail: false,
                    contrasena: false,
                    confirmarContrasena: false,
                    nombre: false
                  });
                }}
                aria-label="Cambiar a pestaña de registro"
              >
                Registrarse
              </button>
            </div>

            <h2>Crear Cuenta</h2>
            <p className="form-subtitle">Registrate como dueño de negocio (USER)</p>

            {formError && <div className="error-message" role="alert">{formError}</div>}

            <div className="form-group">
              <label htmlFor="nombre-registro">Nombre Completo</label>
              <div className="input-area">
                <input
                  id="nombre-registro"
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={getInputClass('nombre', formData.nombre)}
                  required
                />
                <span className="input-icon">👤</span>
                <span className={`validation-icon ${formData.nombre && fieldValid.nombre ? 'visible success' : ''} ${formData.nombre && fieldErrors.nombre ? 'visible error' : ''}`}>
                  {fieldValid.nombre ? '✓' : fieldErrors.nombre ? '✗' : ''}
                </span>
              </div>
              {fieldErrors.nombre && formData.nombre && (
                <div className="field-error-txt">{fieldErrors.nombre}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="usuarioEmail-registro">Correo Electrónico</label>
              <div className="input-area">
                <input
                  id="usuarioEmail-registro"
                  type="email"
                  name="usuarioEmail"
                  placeholder="tu@email.com"
                  value={formData.usuarioEmail}
                  onChange={handleInputChange}
                  className={getInputClass('usuarioEmail', formData.usuarioEmail)}
                  required
                />
                <span className="input-icon">📧</span>
                <span className={`validation-icon ${formData.usuarioEmail && fieldValid.usuarioEmail ? 'visible success' : ''} ${formData.usuarioEmail && fieldErrors.usuarioEmail ? 'visible error' : ''}`}>
                  {fieldValid.usuarioEmail ? '✓' : fieldErrors.usuarioEmail ? '✗' : ''}
                </span>
              </div>
              {fieldErrors.usuarioEmail && formData.usuarioEmail && (
                <div className="field-error-txt">{fieldErrors.usuarioEmail}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contrasena-registro">Contraseña</label>
              <div className="input-area">
                <input
                  id="contrasena-registro"
                  type="password"
                  name="contrasena"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  className={getInputClass('contrasena', formData.contrasena)}
                  required
                />
                <span className="input-icon">🔒</span>
                <span className={`validation-icon ${formData.contrasena && fieldValid.contrasena ? 'visible success' : ''} ${formData.contrasena && fieldErrors.contrasena ? 'visible error' : ''}`}>
                  {fieldValid.contrasena ? '✓' : fieldErrors.contrasena ? '✗' : ''}
                </span>
              </div>
              {fieldErrors.contrasena && formData.contrasena && (
                <div className="field-error-txt">{fieldErrors.contrasena}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <div className="input-area">
                <input
                  id="confirmarContrasena"
                  type="password"
                  name="confirmarContrasena"
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmarContrasena}
                  onChange={handleInputChange}
                  className={getInputClass('confirmarContrasena', formData.confirmarContrasena)}
                  required
                />
                <span className="input-icon">✓</span>
                <span className={`validation-icon ${formData.confirmarContrasena && fieldValid.confirmarContrasena ? 'visible success' : ''} ${formData.confirmarContrasena && fieldErrors.confirmarContrasena ? 'visible error' : ''}`}>
                  {fieldValid.confirmarContrasena ? '✓' : fieldErrors.confirmarContrasena ? '✗' : ''}
                </span>
              </div>
              {fieldErrors.confirmarContrasena && formData.confirmarContrasena && (
                <div className="field-error-txt">{fieldErrors.confirmarContrasena}</div>
              )}
            </div>

            <button type="submit" className="btn-login" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <div className="divider">
              <span>O registrate con</span>
            </div>

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

export default LoginPage;