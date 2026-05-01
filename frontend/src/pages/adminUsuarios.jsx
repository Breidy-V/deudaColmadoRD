import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './adminUsuario.css';

function AdminUsuarios({ usuario, onBack, onLogout }) {
  // ==========================================
  // ESTADO DEL COMPONENTE
  // ==========================================
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Administrador',
      email: 'admin@fiardord.local',
      usuario: 'ADMIN',
      rol: 'ADMIN',
      estado: 'activo',
      fecha_creacion: '2026-01-15',
      ultimo_acceso: '2026-04-30 14:30',
    },
    {
      id: 2,
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      usuario: null,
      rol: 'USER',
      estado: 'activo',
      fecha_creacion: '2026-02-20',
      ultimo_acceso: '2026-04-29 10:15',
    },
    {
      id: 3,
      nombre: 'María García',
      email: 'maria@email.com',
      usuario: null,
      rol: 'USER',
      estado: 'activo',
      fecha_creacion: '2026-03-10',
      ultimo_acceso: '2026-04-28 16:45',
    },
  ]);

  // Estado de búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos'); // 'todos', 'ADMIN', 'USER'
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos', 'activo', 'inactivo'
  const [ordenar, setOrdenar] = useState('fecha-desc'); // 'fecha-asc', 'fecha-desc', 'nombre'

  // Estado de modales
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalContrasena, setMostrarModalContrasena] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Estado de formularios
  const [formAgregar, setFormAgregar] = useState({
    nombre: '',
    email: '',
    rol: 'USER',
    contrasena: '',
    confirmarContrasena: '',
  });

  const [formEditar, setFormEditar] = useState({
    nombre: '',
    email: '',
    rol: 'USER',
  });

  const [formContrasena, setFormContrasena] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: '',
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // ==========================================
  // FUNCIONES DE FILTRADO Y BÚSQUEDA
  // ==========================================
  const usuariosFiltrados = usuarios
    .filter((u) => {
      // Filtro de búsqueda - con validaciones
      const coincideBusqueda =
        (u.nombre && u.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(busqueda.toLowerCase())) ||
        (u.user && u.user.toLowerCase().includes(busqueda.toLowerCase()));

      // Filtro por rol
      const coincideRol = filtroRol === 'todos' || u.rol === filtroRol;

      // Filtro por estado
      const coincideEstado = filtroEstado === 'todos' || u.estado === filtroEstado;

      return coincideBusqueda && coincideRol && coincideEstado;
    })
    .sort((a, b) => {
      if (ordenar === 'fecha-desc') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      } else if (ordenar === 'fecha-asc') {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      } else if (ordenar === 'nombre') {
        return (a.nombre || '').localeCompare(b.nombre || '');
      }
      return 0;
    });

  // ==========================================
  // MANEJADORES DE AGREGAR USUARIO
  // ==========================================
  const handleAbrirModalAgregar = () => {
    setFormAgregar({
      nombre: '',
      email: '',
      rol: 'USER',
      contrasena: '',
      confirmarContrasena: '',
    });
    setError('');
    setExito('');
    setMostrarModalAgregar(true);
  };

  const handleCambioFormAgregar = (e) => {
    const { name, value } = e.target;
    setFormAgregar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardarNuevoUsuario = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validaciones
    if (!formAgregar.nombre || !formAgregar.email || !formAgregar.contrasena) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (formAgregar.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formAgregar.contrasena !== formAgregar.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Llamar API
      const nuevoUsuario = await api.users.create(
        formAgregar.nombre,
        formAgregar.email,
        formAgregar.contrasena
      );

      // Agregar a la lista local
      setUsuarios([...usuarios, {
        ...nuevoUsuario,
        rol: formAgregar.rol,
        estado: 'activo',
        fecha_creacion: new Date().toISOString().split('T')[0],
        ultimo_acceso: null,
      }]);

      setExito(`Usuario ${formAgregar.nombre} creado exitosamente`);
      setTimeout(() => {
        setMostrarModalAgregar(false);
        setExito('');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Error al crear usuario');
    }
  };

  // ==========================================
  // MANEJADORES DE EDITAR USUARIO
  // ==========================================
  const handleAbrirModalEditar = (u) => {
    setUsuarioSeleccionado(u);
    setFormEditar({
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
    });
    setError('');
    setMostrarModalEditar(true);
  };

  const handleCambioFormEditar = (e) => {
    const { name, value } = e.target;
    setFormEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardarEdicionUsuario = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (!formEditar.nombre || !formEditar.email) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      // Llamar API
      await api.users.update(
        usuarioSeleccionado.id,
        formEditar.nombre,
        formEditar.email,
        formEditar.rol
      );

      // Actualizar en lista local
      setUsuarios(
        usuarios.map((u) =>
          u.id === usuarioSeleccionado.id
            ? { ...u, nombre: formEditar.nombre, email: formEditar.email, rol: formEditar.rol }
            : u
        )
      );

      setExito('Usuario actualizado exitosamente');
      setTimeout(() => {
        setMostrarModalEditar(false);
        setExito('');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Error al actualizar usuario');
    }
  };

  // ==========================================
  // MANEJADORES DE CAMBIAR CONTRASEÑA
  // ==========================================
  const handleAbrirModalContrasena = (u) => {
    setUsuarioSeleccionado(u);
    setFormContrasena({
      contrasenaActual: '',
      contrasenaNueva: '',
      confirmarContrasena: '',
    });
    setError('');
    setMostrarModalContrasena(true);
  };

  const handleCambioFormContrasena = (e) => {
    const { name, value } = e.target;
    setFormContrasena((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardarNuevaContrasena = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (!formContrasena.contrasenaNueva || !formContrasena.confirmarContrasena) {
      setError('Por favor completa los campos de contraseña');
      return;
    }

    if (formContrasena.contrasenaNueva.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formContrasena.contrasenaNueva !== formContrasena.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Llamar API
      await api.users.changePassword(
        usuarioSeleccionado.id,
        formContrasena.contrasenaNueva,
        formContrasena.confirmarContrasena
      );

      setExito('Contraseña actualizada exitosamente');
      setTimeout(() => {
        setMostrarModalContrasena(false);
        setExito('');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Error al cambiar contraseña');
    }
  };

  // ==========================================
  // MANEJADORES DE ELIMINAR/ACTIVAR-DESACTIVAR
  // ==========================================
  const handleEliminarUsuario = async (u) => {
    if (u.rol === 'ADMIN' && usuarios.filter((x) => x.rol === 'ADMIN').length === 1) {
      setError('No se puede eliminar el único administrador');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${u.nombre}?`)) {
      try {
        // Llamar API
        await api.users.delete(u.id);

        // Eliminar de lista local
        setUsuarios(usuarios.filter((x) => x.id !== u.id));
        setExito(`${u.nombre} ha sido eliminado`);
        setTimeout(() => setExito(''), 2000);
      } catch (error) {
        setError(error.message || 'Error al eliminar usuario');
      }
    }
  };

  const handleCambiarEstado = async (u) => {
    const nuevoEstado = u.estado === 'activo' ? 'inactivo' : 'activo';

    if (u.rol === 'ADMIN' && u.id === usuario.id) {
      setError('No puedes desactivar tu propia cuenta');
      return;
    }

    try {
      // Llamar API
      await api.users.changeStatus(u.id, nuevoEstado);

      // Actualizar en lista local
      setUsuarios(
        usuarios.map((x) =>
          x.id === u.id ? { ...x, estado: nuevoEstado } : x
        )
      );

      setExito(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente`);
      setTimeout(() => setExito(''), 2000);
    } catch (error) {
      setError(error.message || 'Error al cambiar estado');
    }
  };

  // ==========================================
  // CARGAR USUARIOS AL MONTAR COMPONENTE
  // ==========================================
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await api.users.list();
      // response es un array de usuarios
      setUsuarios(response);
    } catch (error) {
      setError(error.message || 'Error al cargar usuarios');
    }
  };

  // ==========================================
  // RENDERIZADO
  // ==========================================
  return (
    <div className="admin-usuarios-container">
      {/* ==========================================
          HEADER
          ========================================== */}
      <header className="admin-usuarios-header">
        <div className="admin-usuarios-top">
          <div className="admin-usuarios-info">
            <button 
              className="btn-volver" 
              onClick={onBack}
              aria-label="Volver al panel de administración"
              title="Volver atrás"
            >
              ←
            </button>
            <h1>Administrar Usuarios</h1>
          </div>
          <button 
            className="btn-cerrar-sesion-admin" 
            onClick={onLogout}
            aria-label="Cerrar sesión"
          >
            🚪 Logout
          </button>
        </div>

        {/* Mensajes de éxito/error */}
        {exito && <div className="mensaje-exito">{exito}</div>}
        {error && <div className="mensaje-error">{error}</div>}

        {/* Controles de búsqueda y filtros */}
        <div className="admin-usuarios-controles">
          {/* Búsqueda */}
          <div className="control-grupo">
            <label htmlFor="busqueda-usuarios">Buscar:</label>
            <input
              id="busqueda-usuarios"
              type="text"
              placeholder="Nombre, email o usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-busqueda"
              aria-label="Buscar usuarios"
            />
          </div>

          {/* Filtro de rol */}
          <div className="control-grupo">
            <label htmlFor="filtro-rol">Rol:</label>
            <select
              id="filtro-rol"
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="select-filtro"
              aria-label="Filtrar por rol"
            >
              <option value="todos">Todos</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuario</option>
            </select>
          </div>

          {/* Filtro de estado */}
          <div className="control-grupo">
            <label htmlFor="filtro-estado">Estado:</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="select-filtro"
              aria-label="Filtrar por estado"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Ordenar */}
          <div className="control-grupo">
            <label htmlFor="ordenar">Ordenar:</label>
            <select
              id="ordenar"
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              className="select-filtro"
              aria-label="Ordenar usuarios"
            >
              <option value="fecha-desc">Más reciente</option>
              <option value="fecha-asc">Más antiguo</option>
              <option value="nombre">Nombre (A-Z)</option>
            </select>
          </div>

          {/* Botón agregar usuario */}
          <button
            className="btn-agregar-usuario"
            onClick={handleAbrirModalAgregar}
            aria-label="Agregar nuevo usuario"
          >
            ➕ Nuevo Usuario
          </button>
        </div>
      </header>

      {/* ==========================================
          TABLA DE USUARIOS
          ========================================== */}
      <div className="admin-usuarios-contenedor">
        <div className="tabla-responsive">
          <table className="tabla-usuarios" role="table" aria-label="Tabla de usuarios">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Última Conexión</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((u) => (
                  <tr key={u.id} className={`fila-usuario estado-${u.estado}`}>
                    <td data-label="Nombre">{u.nombre}</td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Rol">
                      <span className={`badge-rol rol-${u.rol.toLowerCase()}`}>
                        {u.rol === 'ADMIN' ? '👑 ' : '👤 '}
                        {u.rol}
                      </span>
                    </td>
                    <td data-label="Estado">
                      <span className={`badge-estado estado-${u.estado}`}>
                        {u.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                      </span>
                    </td>
                    <td data-label="Última Conexión">
                      {u.ultimo_acceso ? u.ultimo_acceso : 'Nunca'}
                    </td>
                    <td data-label="Acciones">
                      <div className="acciones-usuario">
                        <button
                          className="btn-accion-editar"
                          onClick={() => handleAbrirModalEditar(u)}
                          aria-label={`Editar a ${u.nombre}`}
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-accion-contrasena"
                          onClick={() => handleAbrirModalContrasena(u)}
                          aria-label={`Cambiar contraseña de ${u.nombre}`}
                          title="Cambiar contraseña"
                        >
                          🔑
                        </button>
                        <button
                          className={`btn-accion-estado ${u.estado === 'activo' ? 'desactivar' : 'activar'}`}
                          onClick={() => handleCambiarEstado(u)}
                          disabled={u.rol === 'ADMIN' && u.id === usuario.id}
                          aria-label={`${u.estado === 'activo' ? 'Desactivar' : 'Activar'} a ${u.nombre}`}
                          title={u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        >
                          {u.estado === 'activo' ? '⊘' : '✓'}
                        </button>
                        <button
                          className="btn-accion-eliminar"
                          onClick={() => handleEliminarUsuario(u)}
                          disabled={u.rol === 'ADMIN' && usuarios.filter((x) => x.rol === 'ADMIN').length === 1}
                          aria-label={`Eliminar a ${u.nombre}`}
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="sin-resultados">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Contador de usuarios */}
        <div className="contador-usuarios">
          <p>
            Mostrando <strong>{usuariosFiltrados.length}</strong> de{' '}
            <strong>{usuarios.length}</strong> usuarios
          </p>
        </div>
      </div>

      {/* ==========================================
          MODAL: AGREGAR USUARIO
          ========================================== */}
      {mostrarModalAgregar && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-agregar">
          <div className="modal-content">
            <h2 id="titulo-modal-agregar">Crear Nuevo Usuario</h2>
            {error && <div className="error-modal">{error}</div>}

            <form onSubmit={handleGuardarNuevoUsuario}>
              <div className="form-grupo">
                <label htmlFor="agregar-nombre">Nombre Completo</label>
                <input
                  id="agregar-nombre"
                  type="text"
                  name="nombre"
                  value={formAgregar.nombre}
                  onChange={handleCambioFormAgregar}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="agregar-email">Email</label>
                <input
                  id="agregar-email"
                  type="email"
                  name="email"
                  value={formAgregar.email}
                  onChange={handleCambioFormAgregar}
                  placeholder="juan@email.com"
                  required
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="agregar-rol">Rol</label>
                <select
                  id="agregar-rol"
                  name="rol"
                  value={formAgregar.rol}
                  onChange={handleCambioFormAgregar}
                >
                  <option value="USER">Usuario (USER)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
              </div>

              <div className="form-grupo">
                <label htmlFor="agregar-contrasena">Contraseña</label>
                <input
                  id="agregar-contrasena"
                  type="password"
                  name="contrasena"
                  value={formAgregar.contrasena}
                  onChange={handleCambioFormAgregar}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="agregar-confirmar">Confirmar Contraseña</label>
                <input
                  id="agregar-confirmar"
                  type="password"
                  name="confirmarContrasena"
                  value={formAgregar.confirmarContrasena}
                  onChange={handleCambioFormAgregar}
                  placeholder="Confirma tu contraseña"
                  required
                />
              </div>

              <div className="modal-botones">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrarModalAgregar(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: EDITAR USUARIO
          ========================================== */}
      {mostrarModalEditar && usuarioSeleccionado && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-editar">
          <div className="modal-content">
            <h2 id="titulo-modal-editar">Editar: {usuarioSeleccionado.nombre}</h2>
            {error && <div className="error-modal">{error}</div>}

            <form onSubmit={handleGuardarEdicionUsuario}>
              <div className="form-grupo">
                <label htmlFor="editar-nombre">Nombre Completo</label>
                <input
                  id="editar-nombre"
                  type="text"
                  name="nombre"
                  value={formEditar.nombre}
                  onChange={handleCambioFormEditar}
                  required
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="editar-email">Email</label>
                <input
                  id="editar-email"
                  type="email"
                  name="email"
                  value={formEditar.email}
                  onChange={handleCambioFormEditar}
                  required
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="editar-rol">Rol</label>
                <select
                  id="editar-rol"
                  name="rol"
                  value={formEditar.rol}
                  onChange={handleCambioFormEditar}
                >
                  <option value="USER">Usuario (USER)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
              </div>

              <div className="modal-botones">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrarModalEditar(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CAMBIAR CONTRASEÑA
          ========================================== */}
      {mostrarModalContrasena && usuarioSeleccionado && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-contrasena">
          <div className="modal-content">
            <h2 id="titulo-modal-contrasena">Cambiar Contraseña: {usuarioSeleccionado.nombre}</h2>
            {error && <div className="error-modal">{error}</div>}

            <form onSubmit={handleGuardarNuevaContrasena}>
              <div className="form-grupo">
                <label htmlFor="contrasena-actual">Contraseña Actual</label>
                <input
                  id="contrasena-actual"
                  type="password"
                  name="contrasenaActual"
                  value={formContrasena.contrasenaActual}
                  onChange={handleCambioFormContrasena}
                  placeholder="Tu contraseña actual"
                  required
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="contrasena-nueva">Contraseña Nueva</label>
                <input
                  id="contrasena-nueva"
                  type="password"
                  name="contrasenaNueva"
                  value={formContrasena.contrasenaNueva}
                  onChange={handleCambioFormContrasena}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="form-grupo">
                <label htmlFor="confirmar-contrasena-nueva">Confirmar Nueva Contraseña</label>
                <input
                  id="confirmar-contrasena-nueva"
                  type="password"
                  name="confirmarContrasena"
                  value={formContrasena.confirmarContrasena}
                  onChange={handleCambioFormContrasena}
                  placeholder="Confirma la nueva contraseña"
                  required
                />
              </div>

              <div className="modal-botones">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setMostrarModalContrasena(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;