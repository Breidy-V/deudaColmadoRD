import { User, Settings, LogOut, Crown } from 'lucide-react';

export function PerfilMenu({ nombre, rol, onCerrarSesion, onIrAdministracion, onClose }) {
  return (
    <div className="menu-desplegable">
      <p className="saludo">Hola, <strong>{nombre}</strong></p>
      <p className="rol-usuario">
        {rol === 'ADMIN' ? <><Crown size={14} /> Administrador</> : <><User size={14} /> Usuario</>}
      </p>
      <hr />
      
      {rol === 'ADMIN' && (
        <>
          <button 
            className="btn-menu-item admin"
            onClick={onIrAdministracion}
            aria-label="Ir a panel de administración"
          >
            <Settings size={16} /> Panel de Administración
          </button>
          <hr />
        </>
      )}

      <button className="btn-menu-item">
        <Settings size={16} /> Configuración
      </button>
      <button 
        className="btn-menu-item salir"
        onClick={onCerrarSesion}
        aria-label="Cerrar sesión"
      >
        <LogOut size={16} /> Cerrar Sesión
      </button>
    </div>
  );
}