import db from '../config/db.js';

/* =========================
   🔹 CREAR PAGO
========================= */
export const createPago = (id_deuda, monto, metodo_pago, observacion) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO pagos (id_deuda, monto, metodo_pago, observacion)
       VALUES (?, ?, ?, ?)`,
      [id_deuda, monto, metodo_pago, observacion],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_pago: this.lastID,
          id_deuda,
          monto
        });
      }
    );
  });
};

/* =========================
   🔹 LISTAR PAGOS
========================= */
export const getAllPagos = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        p.*,
        c.nombre,
        c.apellido,
        d.monto_total
      FROM pagos p
      JOIN deudas d ON d.id_deuda = p.id_deuda
      JOIN clientes c ON c.id_cliente = d.id_cliente
      ORDER BY p.id_pago DESC
      `,
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

/* =========================
   🔹 PAGOS POR DEUDA
========================= */
export const getPagosByDeuda = (id_deuda) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM pagos WHERE id_deuda = ? ORDER BY fecha_pago DESC`,
      [id_deuda],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

/* =========================
   🔹 ELIMINAR PAGO
========================= */
export const deletePago = (id_pago) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM pagos WHERE id_pago = ?`,
      [id_pago],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_pago,
          message: 'Pago eliminado'
        });
      }
    );
  });
};