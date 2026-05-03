import { useState } from 'react';
import LoginForm from './loginForm';
// crear RegisterForm después
// import RegisterForm from './registerForm'; 

const AuthTabs = ({ onLoginSuccess }) => {
  const [tabActiva, setTabActiva] = useState('login');

  return (
    <div className="auth-container">
      <div className="tabs-header">
        <button 
          className={tabActiva === 'login' ? 'active' : ''} 
          onClick={() => setTabActiva('login')}
        >
          Entrar
        </button>
        <button 
          className={tabActiva === 'registro' ? 'active' : ''} 
          onClick={() => setTabActiva('registro')}
        >
          Nuevo Cliente
        </button>
      </div>

      <div className="tabs-content">
        {tabActiva === 'login' ? (
          <LoginForm onLoginSuccess={onLoginSuccess} />
        ) : (
          <div>Formulario de Registro (Próximamente)</div>
        )}
      </div>
    </div>
  );
};

export default AuthTabs;