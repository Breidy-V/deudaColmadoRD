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
      `SELECT id, name, user, created_at FROM users`,
      [],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};