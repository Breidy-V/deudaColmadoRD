import bcrypt from 'bcrypt';
import { createUser, getAllUsers } from '../models/user.model.js';

export const register = async (req, res) => {
  const { name, user, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const newUser = await createUser(name, user, hashed);

    res.json(newUser);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    res.status(500).json({ error: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};