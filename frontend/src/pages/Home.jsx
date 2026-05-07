import { useState, useEffect } from 'react';
import './Home.css';
import { api } from '../services/api';
import { useAlert } from '../components/Alert.jsx';
import {
  Header,
  ResumenFinanciero,
  Buscador,
  BotonesAccion,
  ListaDeudores,
  ModalAddCliente,
  ModalGestionarDeuda,
  Footer
} from '../components/home';

const INTEGRANTES = [
  'Jose Ismael Garcia', 
  'Bienvenido Quezada', 
  'Bryan Ramirez', 
  'Deivy Abreu', 
  'Jose Manuel de la Cruz', 
  'Yordani Guerrero', 
  'Gregory Alfonso'
];

export default function Home({ usuario, onLogout, onOpenAdminModal }) {
  const { showAlert } = useAlert();
  
  const [usuarioApp] = useState({
    nombre: usuario?.nombre || "Usuario",
    negocio: "FiadoRD",
  });

  const [deudores, setDeudores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModalAdd, setMostrarModalAdd] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarMenuPerfil, setMostrarMenuPerfil] = useState(false);

  const [formCliente, setFormCliente] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    deuda: ''
  });

  useEffect(() => {
    cargarDeudas();
  }, []);

  useEffect(() => {
    const data = busqueda.trim()
      ? deudores.filter(c => 
          `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
        )
      : deudores;
  }, [busqueda, deudores]);

  const cargarDeudas = async () => {
    try {
      const data = await api.deudas.list();
      setDeudores(data);
    } catch (error) {
      console.error('Error cargando deudas:', error);
    }
  };

  const handleCerrarSesion = async () => {
    const confirmar = await showAlert({
      type: 'confirm',
      title: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      confirmText: 'Sí, cerrar',
      cancelText: 'Cancelar'
    });
    if (confirmar) {
      onLogout();
    }
  };

  const handleIrAAdministracion = () => {
    setMostrarMenuPerfil(false);
    onOpenAdminModal?.();
  };

  const handleCrearCliente = async (e) => {
    e.preventDefault();

    try {
      const nuevoCliente = await api.clientes.create(
        formCliente.nombre,
        formCliente.apellido,
        formCliente.telefono,
        formCliente.direccion
      );

      const monto = Number(formCliente.deuda);

      const idCliente =
        nuevoCliente?.cliente?.id_cliente ||
        nuevoCliente?.cliente?.id ||
        nuevoCliente?.id_cliente ||
        nuevoCliente?.id;

      if (!idCliente) {
        await showAlert({
          type: 'error',
          title: 'Error',
          message: 'Error interno: ID no encontrado',
          confirmText: 'Aceptar'
        });
        return;
      }

      await api.deudas.create(
        idCliente,
        !isNaN(monto) && monto > 0 ? monto : 0
      );

      await showAlert({
        type: 'success',
        title: 'Éxito',
        message: 'Cliente creado correctamente',
        confirmText: 'Aceptar'
      });

      setMostrarModalAdd(false);
      setFormCliente({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        deuda: ''
      });

      cargarDeudas();

    } catch (error) {
      console.error(error);
      await showAlert({
        type: 'error',
        title: 'Error',
        message: 'Error al crear cliente',
        confirmText: 'Aceptar'
      });
    }
  };

  const handleChangeCliente = (e) => {
    setFormCliente({
      ...formCliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleEliminarCliente = async (e, idCliente) => {
    e.stopPropagation();
    
    const confirmar = await showAlert({
      type: 'confirm',
      title: 'Eliminar Cliente',
      message: '¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar'
    });

    if (!confirmar) return;

    try {
      await api.clientes.delete(idCliente);
      await showAlert({
        type: 'success',
        title: 'Éxito',
        message: 'Cliente eliminado correctamente',
        confirmText: 'Aceptar'
      });
      cargarDeudas();
    } catch (error) {
      console.error(error);
      await showAlert({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar cliente',
        confirmText: 'Aceptar'
      });
    }
  };

  const handleSelectCliente = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const handleSaldar = async (monto) => {
    if (!clienteSeleccionado?.id_deuda) return;

    const confirmar = await showAlert({
      type: 'confirm',
      title: 'Saldar Deuda',
      message: `¿Confirmas el pago de $${monto.toFixed(2)} para saldar esta deuda?`,
      confirmText: 'Sí, pagar',
      cancelText: 'Cancelar'
    });

    if (!confirmar) return;

    try {
      await api.pagos.create(
        clienteSeleccionado.id_deuda,
        monto,
        'efectivo',
        'Pago para saldar deuda'
      );

      await showAlert({
        type: 'success',
        title: 'Éxito',
        message: 'Deuda saldada correctamente',
        confirmText: 'Aceptar'
      });

      setClienteSeleccionado(null);
      cargarDeudas();
    } catch (error) {
      console.error(error);
      await showAlert({
        type: 'error',
        title: 'Error',
        message: 'Error al saldar la deuda',
        confirmText: 'Aceptar'
      });
    }
  };

  const handleAbonar = async (monto) => {
    if (!clienteSeleccionado?.id_deuda) return;

    try {
      await api.pagos.create(
        clienteSeleccionado.id_deuda,
        monto,
        'efectivo',
        'Abono a deuda'
      );

      await showAlert({
        type: 'success',
        title: 'Éxito',
        message: `Abono de $${monto.toFixed(2)} registrado correctamente`,
        confirmText: 'Aceptar'
      });

      setClienteSeleccionado(null);
      cargarDeudas();
    } catch (error) {
      console.error(error);
      await showAlert({
        type: 'error',
        title: 'Error',
        message: 'Error al registrar el abono',
        confirmText: 'Aceptar'
      });
    }
  };

  const handleSumar = async (monto) => {
    if (!clienteSeleccionado?.id_cliente) return;

    try {
      await api.deudas.create(
        clienteSeleccionado.id_cliente,
        monto,
        'Nueva deuda agregada'
      );

      await showAlert({
        type: 'success',
        title: 'Éxito',
        message: `Nueva deuda de $${monto.toFixed(2)} registrada`,
        confirmText: 'Aceptar'
      });

      setClienteSeleccionado(null);
      cargarDeudas();
    } catch (error) {
      console.error(error);
      await showAlert({
        type: 'error',
        title: 'Error',
        message: 'Error al agregar deuda',
        confirmText: 'Aceptar'
      });
    }
  };

  const handleNuevoFiado = async () => {
    await showAlert({ type: 'info', title: 'Nuevo Fiado', message: 'Funcionalidad en desarrollo' });
  };

  const handleResumenCaja = async () => {
    await showAlert({ type: 'info', title: 'Resumen Caja', message: 'Funcionalidad en desarrollo' });
  };

  const totalDeudas = deudores.reduce((acc, item) => acc + (item.saldo_pendiente || 0), 0);

  const deudoresFiltrados = busqueda.trim()
    ? deudores.filter(c => 
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
      )
    : deudores;

  return (
    <div className="mobile-app-container">
      <Header
        negocio={usuarioApp.negocio}
        nombre={usuarioApp.nombre}
        rol={usuario?.rol}
        mostrarMenu={mostrarMenuPerfil}
        onToggleMenu={() => setMostrarMenuPerfil(!mostrarMenuPerfil)}
        onCerrarSesion={handleCerrarSesion}
        onIrAdministracion={handleIrAAdministracion}
      >
        <ResumenFinanciero total={totalDeudas} />
      </Header>

      <div className="controles-izquierda">
        <Buscador 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
        />
        <BotonesAccion 
          onAddCliente={() => setMostrarModalAdd(true)}
          onNuevoFiado={handleNuevoFiado}
          onResumenCaja={handleResumenCaja}
        />
      </div>

      <ListaDeudores 
        deudores={deudoresFiltrados}
        onSelectCliente={handleSelectCliente}
        onEliminarCliente={handleEliminarCliente}
      />

      <Footer />

      <ModalAddCliente
        mostrar={mostrarModalAdd}
        form={formCliente}
        onChange={handleChangeCliente}
        onSubmit={handleCrearCliente}
        onClose={() => setMostrarModalAdd(false)}
      />

      <ModalGestionarDeuda
        cliente={clienteSeleccionado}
        onClose={() => setClienteSeleccionado(null)}
        onSaldar={handleSaldar}
        onAbonar={handleAbonar}
        onSumar={handleSumar}
      />
    </div>
  );
}
