import db from '../config/db.js';

/* =========================
   🔹 REGISTRAR MOVIMIENTO
========================= */
export const createMovimiento = (id_deuda, tipo, monto, descripcion) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO movimientos (id_deuda, tipo, monto, descripcion)
       VALUES (?, ?, ?, ?)`,
      [id_deuda, tipo, monto, descripcion],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_movimiento: this.lastID,
          id_deuda,
          tipo,
          monto,
          descripcion
        });
      }
    );
  });
};

/* =========================
   🔹 LISTAR MOVIMIENTOS
========================= */
export const getMovimientos = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT m.*, c.nombre, c.apellido
      FROM movimientos m
      LEFT JOIN deudas d ON d.id_deuda = m.id_deuda
      LEFT JOIN clientes c ON c.id_cliente = d.id_cliente
      ORDER BY m.id_movimiento DESC
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
   🔹 MOVIMIENTOS POR DEUDA
========================= */
export const getMovimientosByDeuda = (id_deuda) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM movimientos WHERE id_deuda = ? ORDER BY fecha DESC`,
      [id_deuda],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};