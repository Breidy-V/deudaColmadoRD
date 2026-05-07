import { Store } from 'lucide-react';
import { PerfilMenu } from './PerfilMenu';

export function Header({ negocio, nombre, rol, mostrarMenu, onToggleMenu, children, onCerrarSesion, onIrAdministracion }) {
  return (
    <header className="header-resumen">
      <div className="top-nav">
        <div className="info-negocio">
          <Store size={24} />
          <h2>{negocio}</h2>
        </div>
        
        <div className="perfil-usuario">
          <button 
            className="btn-avatar" 
            onClick={onToggleMenu}
            aria-label="Opciones de cuenta"
            title={`${nombre} (${rol})`}
          >
            {nombre.charAt(0).toUpperCase()}
          </button>
          
          {mostrarMenu && (
            <PerfilMenu 
              nombre={nombre}
              rol={rol}
              onCerrarSesion={onCerrarSesion}
              onIrAdministracion={onIrAdministracion}
            />
          )}
        </div>
      </div>

      {children}
    </header>
  );
}