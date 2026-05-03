import LoginForm from '../../assets/components/Auth/loginForm';
import { useAuthForm } from '../../hooks/useAuthForm';
import { api } from '../../services/api';
import './loginPage.css';

export default function LoginPage ({ onLoginSuccess }){
  const handleLoginSubmit = async (data) => {
    const response = await api.auth.login(data.usuarioEmail, data.contrasena);
    
    if (response.token) {
      localStorage.setItem('usuarioFiadoRD', JSON.stringify(response));
      onLoginSuccess(response);
    }
  };

  const { formData, handleChange, handleSubmit, error, loading } = useAuthForm(
    { usuarioEmail: '', contrasena: '' },
    handleLoginSubmit
  );

  return (
    <div className="login-page-container">
      <header className="login-header">
        <h1>FiadoRD</h1>
        <p>Gestión de Colmados</p>
      </header>
      
      <main className="login-content">
        <LoginForm 
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
        />
      </main>
    </div>
  );
};

