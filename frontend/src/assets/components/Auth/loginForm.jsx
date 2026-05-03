

export default function LoginForm({ formData, onChange, onSubmit, error, loading }) {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <h2>Iniciar Sesión</h2>
      {error && <div className="error-message" role="alert">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="usuarioEmail">Usuario o Email</label>
        <input
          id="usuarioEmail"
          type="text"
          name="usuarioEmail"
          value={formData.usuarioEmail}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="contrasena">Contraseña</label>
        <input
          id="contrasena"
          type="password"
          name="contrasena"
          value={formData.contrasena}
          onChange={onChange}
          required
        />
      </div>

      <button type="submit" className="btn-login" disabled={loading}>
        {loading ? 'Cargando...' : 'Entrar'}
      </button>
    </form>
  );
};

