import bcrypt from 'bcrypt';
import { 
  createUser, 
  getAllUsers, 
  findUserByUsername,
  updateUser as updateUserModel,
  updatePassword as updatePasswordModel,
  deleteUserById,
  updateStatus,
  getUserById
} from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

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

// ============ EDITAR USUARIO ============
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, rol } = req.body;

  try {
    // Validaciones
    if (!name || !email || !rol) {
      return res.status(400).json({ error: 'Por favor completa todos los campos' });
    }

    if (!['USER', 'ADMIN'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    // PLACEHOLDER: Aquí va la llamada a updateUser del modelo
    // import { updateUser as updateUserModel } from '../models/user.model.js';
    const updatedUser = await updateUserModel(id, name, email, rol);

    res.json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ CAMBIAR CONTRASEÑA ============
export const changePassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Validaciones
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Por favor completa todos los campos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Hash de la nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);

    // PLACEHOLDER: Aquí va la llamada a updatePassword del modelo
    // import { updatePassword } from '../models/user.model.js';
    await updatePasswordModel(id, hashed);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ ELIMINAR USUARIO ============
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // No permitir eliminar el único admin
    const users = await getAllUsers();
    const admins = users.filter((u) => u.rol === 'ADMIN');

    if (admins.length === 1 && admins[0].id === parseInt(id)) {
      return res.status(400).json({ error: 'No se puede eliminar el único administrador' });
    }

    // PLACEHOLDER: Aquí va la llamada a deleteUserById del modelo
    // import { deleteUserById } from '../models/user.model.js';
    await deleteUserById(id);

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ CAMBIAR ESTADO (ACTIVO/INACTIVO) ============
export const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    // Validaciones
    if (!['activo', 'inactivo'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Debe ser activo o inactivo' });
    }

    // PLACEHOLDER: Aquí va la llamada a updateStatus del modelo
    // import { updateStatus } from '../models/user.model.js';
    await updateStatus(id, estado);

    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};