import {
  createDeuda as createDeudaModel,
  getAllDeudas,
  getDeudaById as getDeudaByIdModel,
  updateDeuda as updateDeudaModel,
  deleteDeuda as deleteDeudaModel
} from '../models/deudas.model.js';

import { createMovimiento } from '../models/movimientos.model.js';

/* =========================
   🔹 CREAR DEUDA
========================= */
export const createDeuda = async (req, res) => {
  const {
    id_cliente,
    monto_total,
    descripcion,
    tasa_interes,
    fecha_vencimiento
  } = req.body;

  if (!id_cliente || !monto_total) {
    return res.status(400).json({
      error: 'Cliente y monto son obligatorios'
    });
  }

  if (monto_total <= 0) {
    return res.status(400).json({
      error: 'El monto debe ser mayor a 0'
    });
  }

  try {
    const deuda = await createDeudaModel(
      id_cliente,
      monto_total,
      descripcion,
      tasa_interes,
      fecha_vencimiento
    );

    // 🔥 MOVIMIENTO AUTOMÁTICO
    await createMovimiento(
      deuda.id_deuda,
      'creacion',
      monto_total,
      'Deuda creada'
    );

    res.json({
      message: 'Deuda creada correctamente',
      deuda
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 LISTAR DEUDAS
========================= */
export const getDeudas = async (req, res) => {
  try {
    const deudas = await getAllDeudas();
    res.json(deudas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 OBTENER DEUDA POR ID
========================= */
export const getDeudaById = async (req, res) => {
  const { id } = req.params;

  try {
    const deuda = await getDeudaByIdModel(id);

    if (!deuda) {
      return res.status(404).json({
        error: 'Deuda no encontrada'
      });
    }

    res.json(deuda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 ACTUALIZAR DEUDA
========================= */
export const updateDeuda = async (req, res) => {
  const { id } = req.params;
  const { descripcion, tasa_interes, fecha_vencimiento, estado } = req.body;

  try {
    const result = await updateDeudaModel(
      id,
      descripcion,
      tasa_interes,
      fecha_vencimiento,
      estado
    );

    // 🔥 movimiento opcional
    await createMovimiento(
      id,
      'ajuste',
      0,
      'Deuda actualizada'
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 ELIMINAR DEUDA
========================= */
export const deleteDeuda = async (req, res) => {
  const { id } = req.params;

  try {
    // 🔥 movimiento antes de eliminar
    await createMovimiento(
      id,
      'cancelacion',
      0,
      'Deuda eliminada'
    );

    const result = await deleteDeudaModel(id);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};