import bcrypt from 'bcrypt';
import { findUserByUsername } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  const { user, password } = req.body;

  try {
    const dbUser = await findUserByUsername(user);

    if (!dbUser) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, dbUser.password);

    if (!valid) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = generateToken(dbUser);

    // Devolver token + datos del usuario
    res.json({ 
      token,
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      user: dbUser.user,
      rol: dbUser.rol,
      estado: dbUser.estado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};