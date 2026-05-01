import db from '../config/db.js';

export const createUser = (name, user, password) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (name, user, password) VALUES (?, ?, ?)`,
      [name, user, password],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, name, user });
      }
    );
  });
};

export const findUserByUsername = (user) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE user = ?`, [user], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, name, user, email, rol, estado, created_at FROM users`,
      [],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};

// ============ FUNCIÓN DE ACTUALIZAR USUARIO ============
export const updateUser = (id, name, email, rol) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET name = ?, email = ?, rol = ? WHERE id = ?`,
      [name, email, rol, id],
      function (err) {
        if (err) return reject(err);
        resolve({ id, name, email, rol });
      }
    );
  });
};

// ============ FUNCIÓN DE CAMBIAR CONTRASEÑA ============
export const updatePassword = (id, hashedPassword) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, id],
      function (err) {
        if (err) return reject(err);
        resolve({ id, message: 'Contraseña actualizada' });
      }
    );
  });
};

// ============ FUNCIÓN DE ELIMINAR USUARIO ============
export const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM users WHERE id = ?`,
      [id],
      function (err) {
        if (err) return reject(err);
        resolve({ id, message: 'Usuario eliminado' });
      }
    );
  });
};

// ============ FUNCIÓN DE CAMBIAR ESTADO ============
export const updateStatus = (id, estado) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET estado = ? WHERE id = ?`,
      [estado, id],
      function (err) {
        if (err) return reject(err);
        resolve({ id, estado, message: 'Estado actualizado' });
      }
    );
  });
};

// ============ FUNCIÓN DE OBTENER USUARIO POR ID ============
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, name, user, email, rol, estado, created_at FROM users WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
};

// ============ FUNCIÓN DE ACTUALIZAR USUARIO ============
export const updateUserModel = (id, name, email, rol) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET name = ?, email = ?, rol = ? WHERE id = ?`,
      [name, email, rol, id],
      function (err) {
        if (err) return reject(err);
        resolve({ id, name, email, rol });
      }
    );
  });
};