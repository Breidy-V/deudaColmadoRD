import db from '../config/db.js';

/* =========================
   🔹 CREAR CLIENTE
========================= */
export const createCliente = (nombre, apellido, telefono, direccion) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO clientes (nombre, apellido, telefono, direccion)
       VALUES (?, ?, ?, ?)`,
      [nombre, apellido, telefono, direccion],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_cliente: this.lastID,
          nombre,
          apellido,
          telefono,
          direccion
        });
      }
    );
  });
};

/* =========================
   🔹 LISTAR CLIENTES
========================= */
export const getAllClientes = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM clientes ORDER BY id_cliente DESC`,
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

/* =========================
   🔹 OBTENER CLIENTE POR ID
========================= */
export const getClienteById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM clientes WHERE id_cliente = ?`,
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

/* =========================
   🔹 ACTUALIZAR CLIENTE
========================= */
export const updateCliente = (id, nombre, apellido, telefono, direccion) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE clientes
       SET nombre = ?, apellido = ?, telefono = ?, direccion = ?
       WHERE id_cliente = ?`,
      [nombre, apellido, telefono, direccion, id],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_cliente: id,
          nombre,
          apellido,
          telefono,
          direccion
        });
      }
    );
  });
};

/* =========================
   🔹 ELIMINAR CLIENTE
========================= */
export const deleteCliente = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM clientes WHERE id_cliente = ?`,
      [id],
      function (err) {
        if (err) return reject(err);

        resolve({
          id_cliente: id,
          message: 'Cliente eliminado correctamente'
        });
      }
    );
  });
};