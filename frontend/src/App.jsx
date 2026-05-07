import { useState, useEffect } from 'react';
import LoginPage from './pages/loginPage/loginPage.jsx';
import Home from './pages/Home.jsx';
import AdminModal from './pages/adminModal.jsx';
import { AlertProvider } from './components/Alert.jsx';
import './components/Alert.css';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarAdminModal, setMostrarAdminModal] = useState(false);
  const [cargando, setCargando] = useState(true);

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
    setCargando(false);
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

  if (cargando) return <div className="loading">Cargando FiadoRD...</div>;

  return (
    <AlertProvider>
      {!usuario ? (
        <LoginPage onLoginSuccess={handleLogin} />
      ) : usuario.rol === 'ADMIN' && mostrarAdminModal ? (
        <AdminModal
          usuario={usuario}
          onClose={() => setMostrarAdminModal(false)}
          onLogout={handleLogout}
        />
      ) : (
        <Home
          usuario={usuario}
          onLogout={handleLogout}
          onOpenAdminModal={() => setMostrarAdminModal(true)}
        />
      )}
    </AlertProvider>
  );
}
