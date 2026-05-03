import db from '../config/db.js';

import {
  createPago as createPagoModel,
  getAllPagos,
  getPagosByDeuda,
  deletePago as deletePagoModel
} from '../models/pagos.model.js';

import { createMovimiento } from '../models/movimientos.model.js';

/* =========================
   🔹 CREAR PAGO
========================= */
export const createPago = async (req, res) => {
  const {
    id_deuda,
    monto,
    metodo_pago,
    observacion
  } = req.body;

  if (!id_deuda || !monto || !metodo_pago) {
    return res.status(400).json({
      error: 'Datos incompletos'
    });
  }

  if (monto <= 0) {
    return res.status(400).json({
      error: 'El monto debe ser mayor a 0'
    });
  }

  try {
    const pago = await createPagoModel(
      id_deuda,
      monto,
      metodo_pago,
      observacion
    );

    // 🔥 MOVIMIENTO AUTOMÁTICO
    await createMovimiento(
      id_deuda,
      'abono',
      monto,
      'Pago realizado'
    );

    // 🔥 actualizar estado deuda
    await actualizarEstadoDeuda(id_deuda);

    res.json({
      message: 'Pago registrado correctamente',
      pago
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 LISTAR PAGOS
========================= */
export const getPagos = async (req, res) => {
  try {
    const pagos = await getAllPagos();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 PAGOS POR DEUDA
========================= */
export const getPagosByDeudaController = async (req, res) => {
  const { id } = req.params;

  try {
    const pagos = await getPagosByDeuda(id);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔹 ELIMINAR PAGO
========================= */
export const deletePago = async (req, res) => {
  const { id } = req.params;

  try {
    const pagoEliminado = await deletePagoModel(id);

    // 🔥 registrar movimiento
    await createMovimiento(
      null,
      'ajuste',
      0,
      'Pago eliminado'
    );

    res.json(pagoEliminado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   🔥 ACTUALIZAR ESTADO DE DEUDA
========================= */
function actualizarEstadoDeuda(id_deuda) {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT 
        d.monto_total,
        IFNULL(SUM(p.monto), 0) AS pagado
      FROM deudas d
      LEFT JOIN pagos p ON p.id_deuda = d.id_deuda
      WHERE d.id_deuda = ?
      GROUP BY d.id_deuda
      `,
      [id_deuda],
      (err, row) => {
        if (err || !row) return resolve();

        let estado = 'pendiente';

        if (row.pagado >= row.monto_total) {
          estado = 'pagada';
        }

        db.run(
          `UPDATE deudas SET estado = ? WHERE id_deuda = ?`,
          [estado, id_deuda],
          () => resolve()
        );
      }
    );
  });
}