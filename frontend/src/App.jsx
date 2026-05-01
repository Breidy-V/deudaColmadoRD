import { useState, useEffect } from 'react';
import Login from './pages/login.jsx';
import Home from './pages/Home.jsx';
import AdminModal from './pages/adminModal.jsx';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarAdminModal, setMostrarAdminModal] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioFiadoRD');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        localStorage.removeItem('usuarioFiadoRD');
      }
    }
  }, []);

  const handleLogin = (datosUsuario) => {
    setUsuario(datosUsuario);
    if (datosUsuario.rol === 'ADMIN') {
      setMostrarAdminModal(true);
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setMostrarAdminModal(false);
    localStorage.removeItem('usuarioFiadoRD');
  };

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  if (usuario.rol === 'ADMIN' && mostrarAdminModal) {
    return (
      <AdminModal
        usuario={usuario}
        onClose={() => setMostrarAdminModal(false)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Home
      usuario={usuario}
      onLogout={handleLogout}
      onOpenAdminModal={() => setMostrarAdminModal(true)}
    />
  );
}

export default App;