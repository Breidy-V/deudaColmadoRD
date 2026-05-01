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
      return res.status(400).json({ error: 'Password incorrecto' });
    }

    const token = generateToken(dbUser);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};