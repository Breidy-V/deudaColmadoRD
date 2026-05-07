import db from '../config/db.js';

export const registrarMovimiento = (id_deuda, tipo, monto, descripcion) => {
  db.run(
    `INSERT INTO movimientos (id_deuda, tipo, monto, descripcion)
     VALUES (?, ?, ?, ?)`,
    [id_deuda, tipo, monto, descripcion]
  );
};