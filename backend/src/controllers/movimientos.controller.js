import {
  createMovimiento as createMovimientoModel,
  getMovimientos,
  getMovimientosByDeuda
} from '../models/movimientos.model.js';

/* =========================
   🔹 CREAR MOVIMIENTO (manual si quieres)
========================= */
export const createMovimiento = async (req, res) => {
  const { id_deuda, tipo, monto, descripcion } = req.body;

  if (!id_deuda || !tipo) {
    return res.status(400).json({
      error: 'id_deuda y tipo son obligatorios'
    });
  }

  try {
    const movimiento = await createMovimientoModel(
      id_deuda,
      tipo,
      monto,
      descripcion
    );

    res.json({
      message: 'Movimiento registrado',
      movimiento
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 LISTAR TODOS LOS MOVIMIENTOS
========================= */
export const getAllMovimientos = async (req, res) => {
  try {
    const movimientos = await getMovimientos();
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 MOVIMIENTOS POR DEUDA
========================= */
export const getMovimientosDeuda = async (req, res) => {
  const { id } = req.params;

  try {
    const movimientos = await getMovimientosByDeuda(id);
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};