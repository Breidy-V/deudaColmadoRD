import db from '../config/db.js';

/* =========================
   🔹 CREAR DEUDA
========================= */
export const createDeuda = (id_cliente, monto_total, descripcion, tasa_interes, fecha_vencimiento) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO deudas
      (id_cliente, monto_total, descripcion, tasa_interes, fecha_vencimiento)
      VALUES (?, ?, ?, ?, ?)`,
      [id_cliente, monto_total, descripcion, tasa_interes || 0, fecha_vencimiento],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_deuda: this.lastID,
          id_cliente,
          monto_total
        });
      }
    );
  });
};

/* =========================
   🔹 LISTAR DEUDAS
========================= */
export const getAllDeudas = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        d.*,
        c.nombre,
        c.apellido,
        IFNULL(SUM(p.monto), 0) AS total_pagado,
        (d.monto_total - IFNULL(SUM(p.monto), 0)) AS saldo_pendiente
      FROM deudas d
      JOIN clientes c ON c.id_cliente = d.id_cliente
      LEFT JOIN pagos p ON p.id_deuda = d.id_deuda
      GROUP BY d.id_deuda
      ORDER BY d.id_deuda DESC
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
   🔹 OBTENER DEUDA POR ID
========================= */
export const getDeudaById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT 
        d.*,
        c.nombre,
        c.apellido,
        IFNULL(SUM(p.monto), 0) AS total_pagado,
        (d.monto_total - IFNULL(SUM(p.monto), 0)) AS saldo
      FROM deudas d
      JOIN clientes c ON c.id_cliente = d.id_cliente
      LEFT JOIN pagos p ON p.id_deuda = d.id_deuda
      WHERE d.id_deuda = ?
      GROUP BY d.id_deuda
      `,
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

/* =========================
   🔹 ACTUALIZAR DEUDA
========================= */
export const updateDeuda = (id, descripcion, tasa_interes, fecha_vencimiento, estado) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE deudas
       SET descripcion = ?, tasa_interes = ?, fecha_vencimiento = ?, estado = ?
       WHERE id_deuda = ?`,
      [descripcion, tasa_interes, fecha_vencimiento, estado, id],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_deuda: id,
          message: 'Deuda actualizada'
        });
      }
    );
  });
};

/* =========================
   🔹 ELIMINAR DEUDA
========================= */
export const deleteDeuda = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM deudas WHERE id_deuda = ?`,
      [id],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_deuda: id,
          message: 'Deuda eliminada'
        });
      }
    );
  });
};