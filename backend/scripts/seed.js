import bcrypt from 'bcrypt';
import db from '../src/config/db.js';  // ← Cambiar initDB por db

const crearAdminInicial = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (name, user, email, password, rol, estado) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['Administrador', 'ADMIN', 'admin@fiardord.com', hashedPassword, 'ADMIN', 'activo'],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log('✓ Admin creado exitosamente');
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      console.log('✓ Admin ya existe');
    } else {
      console.error('Error:', error.message);
    }
  }
  process.exit(0);
};

crearAdminInicial();