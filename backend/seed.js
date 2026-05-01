import bcrypt from 'bcrypt';
import db from './src/config/db.js';

const crearAdminInicial = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    
    db.run(
      `INSERT INTO users (name, user, email, password, rol, estado) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Administrador', 'ADMIN', 'admin@fiardord.com', hashedPassword, 'ADMIN', 'activo'],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            console.log('✓ Admin ya existe');
          } else {
            console.error('Error:', err.message);
          }
        } else {
          console.log('✓ Admin creado exitosamente');
        }
        process.exit(0);
      }
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

crearAdminInicial();