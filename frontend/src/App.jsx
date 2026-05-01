import { useState, useEffect } from 'react';
import Login from './pages/login';
import Home from './pages/Home';
import AdminModal from './pages/adminModal'; // Por desarrollar
import './App.css';

function App() {
  // ==========================================
  // ESTADO GLOBAL DE AUTENTICACIÓN
  // ==========================================
  const [usuario, setUsuario] = useState(null); // Usuario actual
  const [mostrarAdminModal, setMostrarAdminModal] = useState(false); // Modal ADMIN

  // ==========================================
  // CARGAR SESIÓN GUARDADA EN localStorage
  // ==========================================
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioFiadoRD');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al cargar sesión guardada:', error);
        localStorage.removeItem('usuarioFiadoRD');
      }
    }
  }, []);

  // ==========================================
  // MANEJO DE LOGIN
  // ==========================================
  const handleLogin = (datosUsuario) => {
    // Guardar usuario en estado
    setUsuario(datosUsuario);

    // Guardar en localStorage para persistencia
    localStorage.setItem('usuarioFiadoRD', JSON.stringify(datosUsuario));

    // Si es ADMIN, mostrar modal de opciones
    if (datosUsuario.rol === 'ADMIN') {
      setMostrarAdminModal(true);
    }
  };

  // ==========================================
  // MANEJO DE LOGOUT
  // ==========================================
  const handleLogout = () => {
    // Limpiar estado
    setUsuario(null);
    setMostrarAdminModal(false);

    // Limpiar localStorage
    localStorage.removeItem('usuarioFiadoRD');
  };

  // ==========================================
  // LÓGICA DE RENDERIZADO
  // ==========================================

  // Si no hay usuario autenticado, mostrar LOGIN
  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  // Si es ADMIN y debe mostrar modal, renderizar Home + Modal
  if (usuario.rol === 'ADMIN' && mostrarAdminModal) {
    return (
      <>
        {/* Aquí irá el AdminModal cuando esté desarrollado */}
        <AdminModal
          usuario={usuario}
          onClose={() => setMostrarAdminModal(false)}
          onLogout={handleLogout}
        />
      </>
    );
  }

  // Si es ADMIN sin modal (navegó a Inicio), mostrar Home
  // Si es USER, mostrar Home
  return (
    <Home
      usuario={usuario}
      onLogout={handleLogout}
      onOpenAdminModal={() => setMostrarAdminModal(true)}
    />
  );
}

export default App;