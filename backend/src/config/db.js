import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error(err.message);
  else console.log('SQLite conectado');
});

db.run('PRAGMA foreign_keys = ON');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    rol TEXT DEFAULT 'USER',
    estado TEXT DEFAULT 'activo',
    ultimo_acceso DATETIME, -- <--- Aquí está la que querías
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    fecha_registro DATE DEFAULT CURRENT_DATE
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS deudas (
    id_deuda INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    monto_total REAL NOT NULL CHECK(monto_total > 0),
    descripcion TEXT,
    tasa_interes REAL DEFAULT 0,
    fecha_deuda DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    estado TEXT CHECK(estado IN ('pendiente', 'pagada', 'vencida')) DEFAULT 'pendiente',

    FOREIGN KEY (id_cliente) 
      REFERENCES clientes(id_cliente) 
      ON DELETE CASCADE
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS pagos (
    id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    id_deuda INTEGER NOT NULL,
    monto REAL NOT NULL CHECK(monto > 0),
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pago TEXT CHECK(metodo_pago IN ('efectivo', 'transferencia', 'tarjeta')) NOT NULL,
    observacion TEXT,

    FOREIGN KEY (id_deuda) 
      REFERENCES deudas(id_deuda) 
      ON DELETE CASCADE
  )
`);


db.run(`
  CREATE TABLE IF NOT EXISTS movimientos (
    id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_deuda INTEGER,
    tipo TEXT CHECK(tipo IN ('creacion', 'abono', 'ajuste', 'cancelacion')) NOT NULL,
    monto REAL,
    descripcion TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_deuda) 
      REFERENCES deudas(id_deuda) 
      ON DELETE CASCADE
  )
`);

export default db;