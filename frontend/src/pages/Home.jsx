import { useState } from 'react';
import './Home.css';

function Home({ usuario, onLogout, onOpenAdminModal }) {
  // ==========================================
  // ESTADO DEL COMPONENTE HOME
  // ==========================================
  const [usuarioApp] = useState({
    nombre: usuario?.nombre || "Usuario",
    negocio: "FiadoRD",
  });

  const [totalDeudas] = useState(15450.00);
  const [deudores] = useState([
    { id: 1, nombre: "Juan Pérez", monto: 2500, diasVencido: 18 },
    { id: 2, nombre: "María Gómez", monto: 800, diasVencido: 5 },
    { id: 3, nombre: "Pedro Díaz", monto: 4500, diasVencido: 20 },
  ]);

  const [mostrarModalAdd, setMostrarModalAdd] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarMenuPerfil, setMostrarMenuPerfil] = useState(false);

  // ==========================================
  // MANEJADOR DE CERRAR SESIÓN
  // ==========================================
  const handleCerrarSesion = () => {
    if (
      window.confirm(
        '¿Estás seguro de que deseas cerrar sesión?'
      )
    ) {
      onLogout();
    }
  };

  // ==========================================
  // MANEJADOR PARA IR A ADMINISTRACIÓN (ADMIN)
  // ==========================================
  const handleIrAAdministracion = () => {
    setMostrarMenuPerfil(false);
    onOpenAdminModal?.();
  };

  return (
    <div className="mobile-app-container">
      
      {/* ==========================================
          HEADER CON PERFIL DE USUARIO 
          ========================================== */}
      <header className="header-resumen">
        <div className="top-nav">
          <div className="info-negocio">
            <span aria-hidden="true">🏪</span>
            <h2>{usuarioApp.negocio}</h2>
          </div>
          
          <div className="perfil-usuario">
            <button 
              className="btn-avatar" 
              onClick={() => setMostrarMenuPerfil(!mostrarMenuPerfil)}
              aria-label="Opciones de cuenta"
              title={`${usuarioApp.nombre} (${usuario?.rol})`}
            >
              {usuarioApp.nombre.charAt(0).toUpperCase()}
            </button>
            
            {mostrarMenuPerfil && (
              <div className="menu-desplegable">
                <p className="saludo">Hola, <strong>{usuarioApp.nombre}</strong></p>
                <p className="rol-usuario">
                  {usuario?.rol === 'ADMIN' ? '👑 Administrador' : '👤 Usuario'}
                </p>
                <hr />
                
                {/* Opción para ADMIN: Ir a Administración */}
                {usuario?.rol === 'ADMIN' && (
                  <>
                    <button 
                      className="btn-menu-item admin"
                      onClick={handleIrAAdministracion}
                      aria-label="Ir a panel de administración"
                    >
                      ⚙️ Panel de Administración
                    </button>
                    <hr />
                  </>
                )}

                <button className="btn-menu-item">⚙️ Configuración</button>
                <button 
                  className="btn-menu-item salir"
                  onClick={handleCerrarSesion}
                  aria-label="Cerrar sesión"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="resumen-financiero">
          <p>Total de Deudas Activas</p>
          <h1>${totalDeudas.toFixed(2)}</h1>
        </div>
      </header>

      {/* ==========================================
          CONTROLES IZQUIERDA (Buscador y Botones)
          ========================================== */}
      <div className="controles-izquierda">
        <div className="buscador-container">
          <input 
            type="search" 
            placeholder="Buscar cliente..." 
            className="buscador-input" 
            aria-label="Buscar clientes por nombre"
          />
        </div>

        <div className="botones-grid">
          <button 
            className="btn-accion" 
            onClick={() => setMostrarModalAdd(true)} 
            aria-label="Añadir nuevo cliente"
          >
            <span aria-hidden="true">➕</span> Añadir Cliente
          </button>
          <button className="btn-accion" aria-label="Registrar nuevo fiado">
            <span aria-hidden="true">📝</span> Nuevo Fiado
          </button>
          <button className="btn-accion" aria-label="Ver resumen de caja">
            <span aria-hidden="true">💰</span> Resumen Caja
          </button>
        </div>
      </div>

      {/* ==========================================
          LISTA DE DEUDORES (Derecha en PC)
          ========================================== */}
      <section className="lista-deudores" aria-labelledby="titulo-lista">
        <div className="encabezado-lista">
          <h3 id="titulo-lista">Estado de Cuentas</h3>
          <select className="filtro-select" aria-label="Filtrar lista de deudores">
            <option>Mayor a menor deuda</option>
            <option>Por proximidad</option>
            <option>Fecha</option>
          </select>
        </div>

        <div className="deudores-contenedor" role="list">
          {deudores.map((cliente) => (
            <div 
              key={cliente.id} 
              className={`tarjeta-cliente ${cliente.diasVencido > 15 ? 'alerta-roja' : 'alerta-naranja'}`}
              role="listitem"
            >
              <button 
                className="btn-info-cliente" 
                onClick={() => setClienteSeleccionado(cliente)}
                aria-label={`Gestionar cuenta de ${cliente.nombre}`}
              >
                <strong>{cliente.nombre}</strong>
                <span>Hace {cliente.diasVencido} días</span>
              </button>
              
              <div className="acciones-cliente">
                <div className="monto-cliente" aria-hidden="true">
                  <strong>${cliente.monto}</strong>
                </div>
                <button className="btn-eliminar" aria-label={`Eliminar a ${cliente.nombre} del sistema`}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          FOOTER DEL EQUIPO
          ========================================== */}
      <footer className="footer-equipo">
        <p>&copy; 2026 FiadoRD - Gestión de Colmados</p>
        <p className="integrantes">
          Desarrollado por: Jose Ismael Garcia, Bienvenido Quezada, Bryan Ramirez, Deivy Abreu, Jose Manuel de la Cruz, Yordani Guerrero y Gregory Alfonso.
        </p>
      </footer>

      {/* ==========================================
          VENTANA EMERGENTE: AÑADIR CLIENTE 
          ========================================== */}
      {mostrarModalAdd && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-add">
          <div className="modal-content">
            <h2 id="titulo-modal-add">Añadir Nuevo Cliente</h2>
            <form className="formulario-modal" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Nombre completo" required aria-label="Nombre completo" />
              <input type="date" required aria-label="Fecha de registro" />
              <input type="text" placeholder="Dirección" required aria-label="Dirección" />
              <input type="tel" placeholder="Teléfono" required aria-label="Número de teléfono" />
              <input type="number" placeholder="Deuda Inicial (Opcional)" aria-label="Deuda inicial opcional" />
              
              <div className="modal-botones">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModalAdd(false)}>Cancelar</button>
                <button type="submit" className="btn-guardar">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          VENTANA EMERGENTE: GESTIONAR DEUDA CLIENTE 
          ========================================== */}
      {clienteSeleccionado && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-gestion">
          <div className="modal-content">
            <h2 id="titulo-modal-gestion">Gestionar: {clienteSeleccionado.nombre}</h2>
            <p className="deuda-actual">Deuda Total: <strong>${clienteSeleccionado.monto}</strong></p>
            
            <div className="historial-mini">
              <p>Último movimiento: Fiado (hace {clienteSeleccionado.diasVencido} días)</p>
            </div>

            <div className="botones-gestion">
              <button className="btn-gestion saldar">Saldar Completo</button>
              <button className="btn-gestion abonar">Abonar Cantidad</button>
              <button className="btn-gestion sumar">Sumar a la Deuda</button>
            </div>

            <button className="btn-cerrar-modal" onClick={() => setClienteSeleccionado(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;