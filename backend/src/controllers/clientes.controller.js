import {
  createCliente as createClienteModel,
  getAllClientes,
  getClienteById as getClienteByIdModel,
  updateCliente as updateClienteModel,
  deleteCliente as deleteClienteModel
} from '../models/clientes.model.js';

/* =========================
   🔹 CREAR CLIENTE
========================= */
export const createCliente = async (req, res) => {
  const { nombre, apellido, telefono, direccion } = req.body;

  if (!nombre || !apellido) {
    return res.status(400).json({
      error: 'Nombre y apellido son obligatorios'
    });
  }

  try {
    const cliente = await createClienteModel(
      nombre.trim(),
      apellido.trim(),
      telefono,
      direccion
    );

    res.json({
      message: 'Cliente creado correctamente',
      cliente
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 LISTAR CLIENTES
========================= */
export const getClientes = async (req, res) => {
  try {
    const clientes = await getAllClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 OBTENER CLIENTE POR ID
========================= */
export const getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await getClienteByIdModel(id);

    if (!cliente) {
      return res.status(404).json({
        error: 'Cliente no encontrado'
      });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 ACTUALIZAR CLIENTE
========================= */
export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, direccion } = req.body;

  if (!nombre || !apellido) {
    return res.status(400).json({
      error: 'Nombre y apellido son obligatorios'
    });
  }

  try {
    const cliente = await updateClienteModel(
      id,
      nombre.trim(),
      apellido.trim(),
      telefono,
      direccion
    );

    res.json({
      message: 'Cliente actualizado correctamente',
      cliente
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 ELIMINAR CLIENTE
========================= */
export const deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteClienteModel(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};