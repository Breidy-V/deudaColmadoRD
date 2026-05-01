import { Router } from 'express';
import { register, listUsers, updateUser, changePassword, deleteUser, changeStatus } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// ============ RUTAS PÚBLICAS ============
router.post('/', register);                    // Crear usuario

// ============ RUTAS PROTEGIDAS (REQUIEREN JWT) ============
router.get('/', verifyToken, listUsers);       // Listar usuarios

// ============ RUTAS DE ADMIN (PROTEGIDAS) ============
router.put('/:id', verifyToken, updateUser);             // Editar usuario
router.put('/:id/password', verifyToken, changePassword); // Cambiar contraseña
router.delete('/:id', verifyToken, deleteUser);          // Eliminar usuario
router.patch('/:id/status', verifyToken, changeStatus);  // Cambiar estado

export default router;