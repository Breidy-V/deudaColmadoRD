import { useState } from 'react';
import AdminUsuarios from './adminUsuarios'; 
import './adminModal.css';
import { useAlert } from '../components/Alert.jsx';

function AdminModal({ usuario, onBack, onLogout, onClose }) {
  const { showAlert } = useAlert();
  // ==========================================
  // ESTADO DEL MODAL ADMIN
  // ==========================================
  const [seccionActual, setSeccionActual] = useState('menu'); // 'menu' o 'usuarios'

  // ==========================================
  // MANEJADORES DE OPCIONES
  // ==========================================
  
  // Administrar Usuarios - Cambiar a sección de usuarios
  const handleAdministrarUsuarios = () => {
    setSeccionActual('usuarios');
  };

  // Ir a Inicio (Home) - Cerrar modal y mostrar Home
  const handleIrAInicio = () => {
    onClose(); // Cierra el modal
  };

  // Volver al menú desde usuarios
  const handleVolverAlMenu = () => {
    setSeccionActual('menu');
  };

  // Cerrar sesión
  const handleCerrarSesion = async () => {
    const confirmar = await showAlert({
      type: 'confirm',
      title: 'Cerrar Sesión',
      message: '¿Deseas cerrar sesión?',
      confirmText: 'Sí, cerrar',
      cancelText: 'Cancelar'
    });
    if (confirmar) {
      onLogout();
    }
  };

  // ==========================================
  // SI ESTÁ EN SECCIÓN DE USUARIOS, MOSTRAR ADMINUSUARIOS
  // ==========================================
  if (seccionActual === 'usuarios') {
    return (
      <AdminUsuarios 
        usuario={usuario}
        onBack={handleVolverAlMenu}
        onLogout={onLogout}
      />
    );
  }

  // ==========================================
  // SI NO, MOSTRAR EL MENÚ DEL ADMIN MODAL
  // ==========================================
  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
      <div className="admin-modal-content">
        
        {/* ==========================================
            ENCABEZADO DEL MODAL
            ========================================== */}
        <header className="admin-modal-header">
          <div className="admin-modal-icon">
            <span aria-hidden="true">👑</span>
          </div>
          <h1 id="admin-modal-title">Panel de Administración</h1>
          <p className="admin-modal-subtitle">Bienvenido, {usuario?.nombre}</p>
        </header>

        {/* ==========================================
            CONTENIDO PRINCIPAL - OPCIONES
            ========================================== */}
        <div className="admin-modal-body">
          <p className="admin-intro">
            Selecciona una opción para continuar:
          </p>

          <div className="admin-opciones">
            {/* OPCIÓN 1: ADMINISTRAR USUARIOS */}
            <button
              className="admin-opcion-card"
              onClick={handleAdministrarUsuarios}
              aria-label="Administrar usuarios del sistema"
            >
              <div className="opcion-icon">
                <span aria-hidden="true">👥</span>
              </div>
              <h3>Administrar Usuarios</h3>
              <p>Crear, editar o eliminar cuentas de usuarios. Gestionar permisos y roles.</p>
              <span className="opcion-badge">Disponible</span>
            </button>

            {/* OPCIÓN 2: IR A INICIO */}
            <button
              className="admin-opcion-card"
              onClick={handleIrAInicio}
              aria-label="Ir a la página de inicio"
            >
              <div className="opcion-icon">
                <span aria-hidden="true">🏠</span>
              </div>
              <h3>Ir a Inicio</h3>
              <p>Acceder a la interfaz principal de FiadoRD para visualizar y gestionar deudas.</p>
              <span className="opcion-badge ready">Disponible</span>
            </button>
          </div>
        </div>

        {/* ==========================================
            FOOTER DEL MODAL - BOTONES DE ACCIÓN
            ========================================== */}
        <div className="admin-modal-footer">
          <button
            className="btn-admin-cerrar-sesion"
            onClick={handleCerrarSesion}
            aria-label="Cerrar sesión"
          >
            🚪 Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminModal;